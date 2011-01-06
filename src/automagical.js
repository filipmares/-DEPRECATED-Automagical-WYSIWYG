var builder;
var LONG_LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla laoreet venenatis nisl, at viverra urna semper eget. Fusce pellentesque justo id ligula tincidunt volutpat. Suspendisse ut metus sed tellus dictum imperdiet. Nunc vestibulum justo eu velit blandit laoreet. Donec tempor sollicitudin eleifend. Praesent venenatis ante quis magna vulputate ultricies. Duis fringilla pharetra tellus ut sollicitudin. Vivamus tempor nunc eu neque euismod nec adipiscing tellus faucibus. In massa turpis, congue eget ullamcorper nec, laoreet vel odio. Pellentesque a nisl ac erat molestie pharetra sed ac est. Sed tempor luctus odio, eget pretium tellus venenatis pretium. Donec neque lectus, semper egestas consectetur vel, tincidunt sit amet libero. Nam lectus risus, accumsan sit amet volutpat ac, volutpat id nisl. Cras urna velit, aliquet a viverra a, condimentum at justo. Sed non massa non neque molestie interdum mattis eu enim.";
var SHORT_LOREM_IPSUM = "Lorem ipsum dolor";

if (!builder)
{
	builder =
	{
	};
}
builder.init = (function ()
{
	var init =
	{
	},
		
		hideElements,
		initializeMenuDisplayControl,
		populateNavList,
		populateToolboxList,
		initializeDroppableAreas,
		clearDroppableAreas,
		reinitializeDroppableAreas,
		initializeGetHtml,
		getOuterHTML,
		recursiveHTMLAppendFunction,
		defineInlineCssProperty;
		
		
	/* This function returns the entire html of an element, including its tag*/	
	getOuterHTML = function(element) {
    	return $('<div>').append( element.eq(0).clone() ).html();
	};
	
	initializeGetHtml = function(){
		$('a#getHTML').click(function(){
			$('#canvas').postProcessing();
		});
	}

	
	hideElements = function () {
		$("#navContainer").hide();
		$("#menuToolbox").hide();
	};
	
	initializeMenuDisplayControl = function() {
		var isSelected = 0;
		
		if (isSelected == 0){
			$("#menuDisplayControl").hover(function(){
				$(this).css('opacity', '1.0');
			},function(){
				$(this).css('opacity', '0.4');
			});
		}
		
		
		$("#menuDisplayControl").click(function(){
			if($("#navContainer").is(":visible")){
				$("#navContainer").slideUp("fast");
				$("#lblDropDown").text("Show Menu");
				$('#menuDisplayControl').css('opacity', '0.4');										
				$("#lblDropDown").css('color', '#292929');	
				console.log('MenuDisplay Hidden');
				isSelected = 0;
			}else{
				$("#navContainer").slideDown("fast");
				$("#lblDropDown").text("Hide Menu");		
				$('#menuDisplayControl').css('opacity', '1.0');
				$("#lblDropDown").css('color', '#FF6600');
				console.log('MenuDisplay Selected');
				isSelected = 1;		
			}
		});
	
	};
		
	/*This funtion populates the MenuBar and Toolbox bar with extensions and their various elements*/	
	populateNavList = function ()
	{
		//Get INDEX JSON file to iterate through extensions
		$.getJSON('Toolbox/index.json', function (json, status)
		{
			//Iterate Through extensions
			$.each(json.main.tools, function (name, element)
			{
				//console.log("Found Folder: " + element.Folder_Name);
				//Populate MenuBar with extension folder names.
				$("nav#nav").append('<a id="' + element.Folder_Name + '" href="#">' + element.Folder_Name + '</a>');
				//Add on-click behaviour to MenuBar Items.
				$('a#' + element.Folder_Name).click(function ()
				{
					//If this menu item is active then remove active class and hide Toolbox Bar.
					if ($(this).hasClass('active'))
					{
						$(".active").removeClass("active");
						$("nav#menuToolbox").slideUp();
					}
					else
					{
					//Else if any MenuBar item is active, remove active class and hide menu.
					//Make item clicked active and slide menuToolbox Bar.
						if ($("nav#menuToolbox").is(":visible"))
						{
							$("nav#menuToolbox").hide();
						}
						$("nav#menuToolbox").slideDown("fast");
						$(".active").removeClass("active");
						$(this).addClass("active");
					}
					
					populateToolboxList(element.Folder_Name);
				});
			});
		});
	};
	
	populateToolboxList = function(folderName)
	{
	
			//Populate the Toolbox items using the json file in the correct folder pointed to by main json file
			$.getJSON('Toolbox/'+folderName+'/'+folderName+'.json',function(jsonInner, statusInnter){

				//Clear everything currently in ToolBox
				$('nav#menuToolbox').html("");
				
				//Append to the nav
				$.each(jsonInner.main.elements,function(nameInner, elementInner){
						console.log('element name ' + elementInner.name);
						$('nav#menuToolbox').append('<a href=\"#\" id=\"'+folderName+elementInner.name+'\"><img src=\"Toolbox/General/images/'+elementInner.icon+'\" alt=\"'+elementInner.name+'\" width=\"55\" height=\"27\" /></a>');
						
					//Make the item draggable
					$("#"+folderName+elementInner.name).draggable({
						revert: "invalid",
						appendTo: "body",
						containment: "#canvas",
						helper: function() {
							var response = elementInner.tag;
							console.log('tag is ' + response.replace('{placeholder}', LONG_LOREM_IPSUM));
							switch (elementInner.name){
								case('Text'):
									response = response.replace('{placeholder}', LONG_LOREM_IPSUM);
									break;
								case ('Label'):
									response = response.replace('{placeholder}', SHORT_LOREM_IPSUM);
									break;
								default:
									response = elementInner.tag;
									break;
							}
							//Return the new tag to be created
						   return $(response.replace('{placeholder}', LONG_LOREM_IPSUM))[0];
						}

					});
				});	
			});
	};
	
	initializeDroppableAreas = function( droppableAttr )
	{
		droppableAttr.droppable({
			greedy: true,	//Stop droppable event propogation
			drop: function(ev, ui) { 
				if (!ui.draggable.hasClass("added")) {	//Hasn't been placed on canvas yet
					var cloned = ui.helper.clone();
					$(this).append(cloned
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
					
					//To set default id, get how many of this specific tag already exist on document
					var idNumber = $("#canvas " + cloned.get(0).tagName + '.component').size();
					
					//If an element with this id number exists already, increment id number until it doesn't
					while ($('#'+cloned.get(0).tagName + '_' + idNumber).size() !== 0) {
						idNumber++;
					}
					
					//Set default id for element
					cloned.attr('id', cloned.get(0).tagName + '-' + idNumber);
					
					//Need these offsets when appending children to a container that's not the canvas
					cloned.css('top', ui.position.top - $(this).offset().top);
					cloned.css('left', ui.position.left - $(this).offset().left);
					

					
					//TODO: Find a better solution. Hack so that nested dynamic droppables will work.
					if ($(cloned).hasClass("container")) {
						clearDroppableAreas();
						initializeDroppableAreas($(cloned));
						reinitializeDroppableAreas();
					}
					
					//Make a custom event to show when element is first added to canvas
					cloned.trigger('appendToCanvas');

				}
				else { //Element already on canvas
					

					$(this).append($(ui.draggable));
					
					//Need these offsets when appending children to a container that's not the canvas
					$(ui.draggable).css('top', ui.offset.top - $(this).offset().top);
					$(ui.draggable).css('left', ui.offset.left - $(this).offset().left);
				}
			}
		});
	};
	
	reinitializeDroppableAreas = function() {
	
		var droppableAreas = $("#canvas .container");
		
		$.each(droppableAreas, function(index, element) { 
			initializeDroppableAreas($(element));
		});
		
	};
	
	clearDroppableAreas = function() {
	
		var droppableAreas = $("#canvas .container");
		
		$.each(droppableAreas, function(index, element) { 
			$(element).droppable("destroy");
		});
	};
	
	init.initialize = function ()
	{
		initializeMenuDisplayControl();
		initializeGetHtml();
		hideElements();
		populateNavList();
		initializeDroppableAreas($("#canvas"));
	};
	return init;
}());