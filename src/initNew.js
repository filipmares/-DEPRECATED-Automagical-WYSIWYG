var builder;
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
		/* DEBUGGING VARIABLE: Use this to specify whether to use the grid system or not*/
		//gridSystem = true,
		
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
		
		//snapToGrid,
		//snapSize;
		
	/* This function returns the entire html of an element, including its tag*/	
	getOuterHTML = function(element) {
    	return $('<div>').append( element.eq(0).clone() ).html();
	};
	
	/* This function initializes the GetHtml link button*/
	initializeGetHtml = function() {
	
			$('a#getHTML').click(function(){
					
					var canvasHTML="";
					
					//We need to recursively go through and do element by element for a multitude of reasons right now
					$('#canvas').children().each(function() {
					
						canvasHTML = recursiveHTMLAppendFunction(canvasHTML, $(this).clone())

    				});
    		
					
					var allHTML = $.ajax({async:false, url:'template.html',}).responseText;
					allHTML = allHTML.replace(/\{body\}/m, canvasHTML);
					
					

					//Output HTML to console
					console.log(allHTML);

			});
	};

	/* This function recursively iterates through all of an element's children to produce it's html */
    recursiveHTMLAppendFunction = function( canvasHTML, element) {
		
		//if the div is only being used for resizing purposes, don't include it in final html
		if ((element.filter('.ui-resizable-handle, .ui-resizable-e, .ui-resizable-handle, .ui-resizable-s, .ui-resizable-handle, .ui-resizable-se, .ui-icon, .ui-icon-gripsmall-diagonal-se')).size() > 0) {
			return "";
		}
		
		//remove all the classes we are using for editing purposes
		element.removeClass('component container ui-draggable added ui-resizable ');

		//TODO: This doesn't take into acount any other attributes other than 'style', this needs to be changed
		canvasHTML += "<"+ element.get(0).tagName + " " + defineInlineCssProperty(element) + ">" + element.clone().find("*").remove().end().text();
		
		//Go through all of the children of this element
        if (element.children().size() > 0) {
            
            element.children().each( function() {
            	
                canvasHTML += recursiveHTMLAppendFunction("", $(this));
            });
        }
        
       	canvasHTML += "</"+ element.get(0).tagName + ">";
       	
       	return canvasHTML;
    };
    
    /* This function is used to get all the inline style attributes of an element that is set*/
    defineInlineCssProperty = function(element) {
    	
    	var styleString = "style=\"";
    	
    	styleString+= element.attr('style');
    	
    	styleString+= "\"";
    	return styleString;
    };

	
	hideElements = function () {
		$("#navContainer").hide();
		$("#menuToolbox").hide();
	};
	
	initializeMenuDisplayControl = function() {
		$("#lblDropDown").click(function(){
			if($("#navContainer").is(":visible")){
				$("#navContainer").slideUp("fast");
				$("#lblDropDown").text("Show Menu");										
			}else{
				$("#navContainer").slideDown("fast");
				$("#lblDropDown").text("Hide Menu");				
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
						$('nav#menuToolbox').append('<a href=\"#\" id=\"'+folderName+elementInner.name+'\"><img src=\"Toolbox/General/images/'+elementInner.icon+'\" alt=\"'+elementInner.name+'\" width=\"55\" height=\"27\" /></a>');
						
					//Make the item draggable
					$("#"+folderName+elementInner.name).draggable({
						revert: "invalid",
						appendTo: "body",
						containment: "#canvas",
						helper: function() {
							//Return the new tag to be created
						   return $( elementInner.tag )[0];
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
								
								//if (gridSystem) {				
								//	snapSize(cloned);
								//}
							}
						})
					);

					//Need these offsets when appending children to a container that's not the canvas
					cloned.css('top', ui.position.top - $(this).offset().top);
					cloned.css('left', ui.position.left - $(this).offset().left);
					
					//if (gridSystem) {
					//	snapToGrid(cloned);
					//	snapSize(cloned);
					//}
					
					//TODO: Find a better solution. Hack so that nested dynamic droppables will work.
					if ($(cloned).hasClass("container")) {
						clearDroppableAreas();
						initializeDroppableAreas($(cloned));
						reinitializeDroppableAreas();
					}

				}
				else { //Element already on canvas
					

					$(this).append($(ui.draggable));
					
					//Need these offsets when appending children to a container that's not the canvas
					$(ui.draggable).css('top', ui.offset.top - $(this).offset().top);
					$(ui.draggable).css('left', ui.offset.left - $(this).offset().left);
					
					//if (gridSystem) {
					//	snapToGrid(ui.draggable);
					//	snapSize(ui.draggable);
					//}
				}
			}
		});
	};
	
	reinitializeDroppableAreas = function() {
	
		var droppableAreas = $("#canvasContainer .container");
		
		$.each(droppableAreas, function(index, element) { 
			initializeDroppableAreas($(element));
		});
		
	};
	
	clearDroppableAreas = function() {
	
		var droppableAreas = $("#canvasContainer .container");
		
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