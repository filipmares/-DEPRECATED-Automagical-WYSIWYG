var automagical = (function(){

	var populateNavList, 
		initializeGetHtml,
		initializeDroppableAreas,
		
		LONG_LOREM_IPSUM,
		SHORT_LOREM_IPSUM;
		
		


	LONG_LOREM_IPSUM = function() { 
		return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla laoreet venenatis nisl, at viverra urna semper eget. Fusce pellentesque justo id ligula tincidunt volutpat. Suspendisse ut metus sed tellus dictum imperdiet. Nunc vestibulum justo eu velit blandit laoreet. Donec tempor sollicitudin eleifend. Praesent venenatis ante quis magna vulputate ultricies. Duis fringilla pharetra tellus ut sollicitudin. Vivamus tempor nunc eu neque euismod nec adipiscing tellus faucibus. In massa turpis, congue eget ullamcorper nec, laoreet vel odio. Pellentesque a nisl ac erat molestie pharetra sed ac est. Sed tempor luctus odio, eget pretium tellus venenatis pretium. Donec neque lectus, semper egestas consectetur vel, tincidunt sit amet libero. Nam lectus risus, accumsan sit amet volutpat ac, volutpat id nisl. Cras urna velit, aliquet a viverra a, condimentum at justo. Sed non massa non neque molestie interdum mattis eu enim.";
	};
	
	SHORT_LOREM_IPSUM = function() {
		return "Lorem ipsum dolor";
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
				tag.append(LONG_LOREM_IPSUM());
				break;
			case ('Label'):
				tag.append(SHORT_LOREM_IPSUM());
				break;
			case ('Heading'):
				tag.append(SHORT_LOREM_IPSUM());
				break;
			case ('Container'):
				tag.addClass('container');
				break;
			case ('Link'):
				tag.append('A link');
				break;
			case ('Heading'):
				tag.append('Heading');
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
					wrapElementInDragAndDrop(cloned, $(this));

					//Need these offsets when appending children to a container that's not the canvas
					cloned.css('top', ui.position.top - $(this).offset().top);
					cloned.css('left', ui.position.left - $(this).offset().left);
					
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
		
		var pageUrl = '/processed/' + params['user'] + '/' + params['page'];
		console.log('fetching saved page from ' + pageUrl);
		$.get(pageUrl, function(data){
			var html = data.canvas.toString();
			var css = data.style.toString();
			console.log(html + "\n");
			console.log(css);
			
			$('.temporary').append(css);
			var bodyWrapper = $('<div></div>');
			bodyWrapper.append(html);
			
			$(bodyWrapper).children().each(function(i, el){
				//console.log($(el).attr('id'));
				wrapElementInDragAndDrop(el, $('#canvas'));
				$(el).addClass('container component')
			});
			bodyWrapper.empty().remove();
		});
	};
	
	wrapElementInDragAndDrop = function(element, appendTo){
		console.log($(appendTo).attr('id'));
		console.log($(element).attr('id'));
		appendTo.append($(element)
			.draggable({containment:"#canvas"})
			.addClass("added")
			.removeClass("ui-draggable-dragging")
			.resizable({
				containment:"parent",
				resize: function(event, ui) {
					//This function can now be removed as the golden grid snapping has been factored out
				}
			})
		);
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
	}
	
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
