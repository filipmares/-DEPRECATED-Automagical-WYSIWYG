var automagical = (function(){

	var populateNavList, 
		initializeGetHtml,
		initializeDroppableAreas,
		addContextMenu,
		initializeSavedElementProperties,
		initializeNonResizableElements,
		initializePulledInChildElement,
		
		LONG_LOREM_IPSUM,
		SHORT_LOREM_IPSUM
		
		keepHTMLTidy = false,
		levelsDeep = true;
		
		


	LONG_LOREM_IPSUM = function() { 
		return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla laoreet venenatis nisl, at viverra urna semper eget. Fusce pellentesque justo id ligula tincidunt volutpat. Suspendisse ut metus sed tellus dictum imperdiet. Nunc vestibulum justo eu velit blandit laoreet. Donec tempor sollicitudin eleifend. Praesent venenatis ante quis magna vulputate ultricies. Duis fringilla pharetra tellus ut sollicitudin. Vivamus tempor nunc eu neque euismod nec adipiscing tellus faucibus. In massa turpis, congue eget ullamcorper nec, laoreet vel odio. Pellentesque a nisl ac erat molestie pharetra sed ac est. Sed tempor luctus odio, eget pretium tellus venenatis pretium. Donec neque lectus, semper egestas consectetur vel, tincidunt sit amet libero. Nam lectus risus, accumsan sit amet volutpat ac, volutpat id nisl. Cras urna velit, aliquet a viverra a, condimentum at justo. Sed non massa non neque molestie interdum mattis eu enim.";
	};
	
	SHORT_LOREM_IPSUM = function() {
		return "Lorem ipsum dolor";
	};
	
	SHORT_SHORT_LOREM_IPSUM = function() {
		return "Lorem";
	};
	
	initializeGetHtml = function(){
		$('a#getHTML').click(function(){
			postProcessing.postProcessing();

		});
	};

	
	/*This funtion populates the MenuBar and Toolbox bar with extensions and their various elements*/	
	populateNavList = function ()
	{
		//Get INDEX JSON file to iterate through extensions
		$.getJSON('/src/toolbox/index.json', function (json, status)
		{
			//Iterate Through extensions
			$.each(json.main.tools, function (name, element)
			{

				//Populate MenuBar with extension folder names.
				$("nav#nav").append('<a id="' + element.Folder_Name + '" href="#">' + element.Folder_Name + '</a>');
				
				//Add on-click behaviour to MenuBar Items.
				$('a#' + element.Folder_Name).click(function ()
				{
					automagicalUI.hideShowMenuBarItem($(this));
					populateToolboxList(element.Folder_Name);
				});
			});
		});
	};
	
	populateToolboxList = function(folderName)
	{
	
			//Populate the Toolbox items using the json file in the correct folder pointed to by main json file
			$.getJSON('/src/toolbox/'+folderName+'/'+folderName+'.json',function(jsonInner, statusInnter){

				//Clear everything currently in ToolBox
				$('nav#menuToolbox').html("");
				
				//Append to the nav
				$.each(jsonInner.main.elements,function(nameInner, elementInner){

						$('nav#menuToolbox').append('<a href=\"#\" id=\"'+folderName+elementInner.name+'\"><img src=\"/src/toolbox/General/images/'+elementInner.icon+'\" alt=\"'+elementInner.name+'\" width=\"55\" height=\"27\" /></a>');
						
					//Make the item draggable
					$("#"+folderName+elementInner.name).draggable({
						revert: "invalid",
						appendTo: "body",
						containment: "#canvas",
						helper: function() {
							return initializeElementToDrop(elementInner);
						}

					});
				});	
			});
	};
	
	initializeElementToDrop = function( elementInner ) 
	{
		var tag = $('<'+elementInner.tag+' />');
	
		switch (elementInner.name){
			case('Text'):
				tag.text(LONG_LOREM_IPSUM());
				break;
			case ('Label'):
				tag.text(SHORT_LOREM_IPSUM());
				break;
			case ('Heading'):
				tag.text(SHORT_LOREM_IPSUM());
				break;
			case ('Button'):
				tag.val(SHORT_SHORT_LOREM_IPSUM ());
				break;
			case ('Input'):
				tag.val(SHORT_LOREM_IPSUM());
				break;
			case ('Container'):
				tag.addClass('container');
				break;
			case ('Link'):
				tag.text('A link');
				break;
			case ('Heading'):
				tag.text('Heading');
				break;
			default:
				response = elementInner.tag;
				break;
		}
		
		//Each added element is a component
		tag.addClass('component');

		//To set default id, get how many of this specific tag already exist on document
		var idNumber = $("#canvas " + elementInner.tag + '.component').size();
		
		//If an element with this id number exists already, increment id number until it doesn't
		while ($('#'+elementInner.tag + '_' + idNumber).size() !== 0) {
			idNumber++;
		}
		
		//Set default id for element
		tag.attr('id', elementInner.tag + '-' + idNumber);
		
		//Recursively iterate through all properties in json to apply them
		addStylePropertyToElementRecursively(tag, elementInner.properties);
		

	
		
		if (elementInner.attributes !== undefined) {
			//Apply all the attributes to the elements
			$.each(elementInner.attributes,function(attribute, attrValue){
	
				tag.attr(attribute, attrValue);
				automagicalCss.writeAttrSelector('#'+tag.attr('id'),attribute,attrValue);
			});
		}

		
		return tag;
		
	};
	
	addStylePropertyToElementRecursively = function(element, jsonProperties) {
			
			$.each(jsonProperties,function(nameInner, elementInner){

				if (typeof elementInner == 'object'){
					addStylePropertyToElementRecursively(element, elementInner);

				}
				else {
					//If height or width are specified, set it					
					if ((nameInner == 'height') || (nameInner =='width')) {
						element.css(nameInner, elementInner);
						
					}
					automagicalCss.writeCssSelector('#'+element.attr('id'), nameInner, elementInner);
				}

			
			});
	};
	
	
	initializeDroppableAreas = function( droppableAttr )
	{
		droppableAttr.droppable({
			greedy: true,	//Stop droppable event propogation
			drop: function(ev, ui) { 
				if (!ui.draggable.hasClass("added")) {	//Hasn't been placed on canvas yet
					var cloned = ui.helper.clone();

					var clonedCopy = wrapElementInDragAndDrop(cloned, $(this));
					

					clonedCopy.css('position', 'absolute');
					//Need these offsets when appending children to a container that's not the canvas
					clonedCopy.css('top', ui.position.top - $(this).offset().top);
					clonedCopy.css('left', ui.position.left - $(this).offset().left);
					
					if (clonedCopy != cloned) { //if you have a ui-wrapper present
						cloned.css('top', clonedCopy.css('top'));
						cloned.css('left', clonedCopy.css('left'));
					}
					
				} else { //Element already on canvas
					$(this).append($(ui.draggable));
					
					//Need these offsets when appending children to a container that's not the canvas
					$(ui.draggable).css('top', ui.offset.top - $(this).offset().top);
					$(ui.draggable).css('left', ui.offset.left - $(this).offset().left);
				}
			}
		});
	};
	
	//Check if a previously saved pages needs to be loaded, and initialize it's components.
	checkSavedPage = function(){
		var params = $.getUrlVars();
		if (params.length <= 1) return;
		
		var page = params['user'] + '/' + params['page'];
		var getDirty = '/dirty/' + page;

		$.get(getDirty, function(data){
			var isDirty = data.dirty;
			if (!isDirty){
				loadOriginalPage(page);
			}
		});
	};
	
	loadOriginalPage = function(page){
		var pageUrl = '/processed/' + page;
		console.log('fetching saved page from ' + pageUrl);
		$.get(pageUrl, function(data){
			var html = data.canvas.toString();
			var css = data.style.toString();
			console.log(html + "\n");
			//console.log(css);
			
			//$('.temporary').append(css);
			$('head').append(css);
			var bodyWrapper = $('<div></div>');
			bodyWrapper.append(html);
			
			$(bodyWrapper).children().each(function(){
				
				var el=$(this);
				
				if ($(el).get(0).tagName == 'DIV'){
					$(el).addClass('container component');
				}
				else {
					$(el).addClass('component');
				}	
				initializeSavedElementProperties(el);
				
				el = wrapElementInDragAndDrop(el, $('#canvas'));
				


					
				
				initializePulledInChildElements(el);
				
				
			});
			bodyWrapper.empty().remove();
		});
	};
	
	initializePulledInChildElements = function(element) {
		
		if (($(element).children().size() > 0)) {
			
			
			$(element).children().each(function(){
				
				var el = $(this);
				
				//Stuff we put on for draggable and resizable functionality, we don't want to pull any of these in
				if (!($(el).filter('.ui-resizable-handle, .ui-resizable-e, .ui-resizable-handle, .ui-resizable-s, .ui-resizable-handle, .ui-resizable-se, .ui-icon, .ui-icon-gripsmall-diagonal-se')).size() > 0) {
					//
					var elCopy = el.detach();
					
					
					if ($(elCopy).get(0).tagName == 'DIV'){
						$(elCopy).addClass('container component');
					}
					else {
						$(elCopy).addClass('component');
					}
					initializeSavedElementProperties(elCopy);
					
					elCopy = wrapElementInDragAndDrop(elCopy, $(element));

					
					if (levelsDeep) {
						initializePulledInChildElements(el);
					}
		        }
				


				
			});
		}

	};
	
	wrapElementInDragAndDrop = function(element, appendTo){

		

		
		//TODO: Fix this bug where dropped images keep resizing themselves. JQuery has bug making images resizable and droppable
		if (($(element).get(0).tagName == 'IMG') || ($(element).get(0).tagName == 'INPUT')|| ($(element).get(0).tagName == 'BUTTON') || ($(element).hasClass('ui-wrapper'))) {
			
			element = initializeNonResizableElements(element, appendTo);


		}
		else {
			appendTo.append($(element)
				.draggable({
					containment:"#canvas",
					cancel: null
				})
				.addClass("added")
				.removeClass("ui-draggable-dragging")
				.resizable({
					containment:"parent",
					cancel: null,
					resize: function(event, ui) {
						//This function can now be removed as the golden grid snapping has been factored out
					}
				})
			);
		}
		
		addContextMenu(element);
		
		

		
		
		//TODO: Find a better solution. Hack so that nested dynamic droppables will work.
		if ($(element).hasClass("container")) {
			var droppableAreas = $("#canvas .container");
			
			$.each(droppableAreas, function(index, el) { 
				$(el).droppable("destroy");
			});

			initializeDroppableAreas(element);
			droppableAreas = $("#canvas .container");
			$.each(droppableAreas, function(index, el) { 
				initializeDroppableAreas($(el));
			});
		}
		//Make a custom event to show when element is first added to canvas
		$(element).trigger('appendToCanvas');
		
		
		return element;
	}
	

	
	initializeSavedElementProperties = function(element){
		
		$.getJSON('/src/toolbox/General/general.json', function (json, status)
		{
			//Iterate Through extensions
			$.each(json.main.elements, function (nameInner, elInner)
			{
					

				if (elInner.tag == $(element).get(0).tagName) {
					

					$.each(elInner.properties, function (nameSecond, elSecond)
					{
						//console.log($(element).attr('id') + ' ' + nameSecond+ ' ' + $(element).css(nameSecond));
						automagicalCss.writeCssSelector('#'+$(element).attr('id'), nameSecond, $(element).css(nameSecond));
					});
					
					if (elInner.attributes) {
						$.each(elInner.attributes, function (nameSecond, elSecond)
						{
							automagicalCss.writeAttrSelector('#'+$(element).attr('id'), nameSecond, $(element).attr(nameSecond));
						});
					}
				}
			
			});
		});
	
	}
	addContextMenu = function(element) {
	
	        $(element).contextMenu('context-menu-1', {
	            'Change Text': {
	                click: function(element) {  // element is the jquery obj clicked on when context menu launched
	                    automagicalCss.changeCurrentElementContent();
	                },
	                klass: "menu-item-1" // a custom css class for this menu item (usable for styling)
	            },
	            'Delete': {
	                click: function(element){ 
	                	
	                	
	                			
						if (($(element).children().size() > 0)) {
							
							
							$(element).children().each(function(){
								var el = $(this);
								el.remove();
							
							})
							
							element.remove();
							
							
						}
						else {
							element.empty().remove();
						}

	                },
	                klass: "menu-item-2"
	            }
	        });

	    

	
	

	};
	
	initializeNonResizableElements = function(element, appendTo) {
			
			if (keepHTMLTidy){ //Don't give it resizable option, keeps our html clean (well...somewhat clean)
				appendTo.append($(element)
					.addClass("added")
					.removeClass("ui-draggable-dragging")
					.draggable({
						containment:"#canvas",
						cancel: null
					})
					
	
				);
			}
			else { //wraps imgs, inputs, in div so they can be resized on the fly
				
				if (!$(element).parent().hasClass('ui-wrapper')) {
					$(element).removeClass("ui-draggable-dragging");
					appendTo.append($(element));
					$(element).resizable({
						containment:"parent",
						cancel: null,
						resize: function(event, ui) {
							//This function can now be removed as the golden grid snapping has been factored out
						}
					})

					
					var helper = $(element).parent(); //These are elements which need a ui-wrapper
					$(helper).addClass("added");
					$(helper).draggable({
						containment:"#canvas",
						cancel: null,
						stop: function(event, ui) {
							element.css('top', helper.css('top'));	//we want the positions to stay the same for wrapping div because we remove wrapping div after
							element.css('left', helper.css('left'));
						}
					})
					
					element.css('top', helper.css('top'));
					element.css('left', helper.css('left'));
					
				}
			

			}
			
			return helper;
	
	
	};
	
	return {
	
		initialize : function(){
			
			automagicalUI.initializeUI();
			automagicalCss.initializeCssFunctionality();
			
			initializeGetHtml();
			populateNavList();
			initializeDroppableAreas($("#canvas"));
			
			checkSavedPage();
		}
	};
	

		
})();
