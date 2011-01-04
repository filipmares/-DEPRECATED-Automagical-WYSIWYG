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
								//This function can now be removed as the golden grid snapping has been factored out
							}
						})
					);
					
					//To set default id, get how many of this specific tag already exist on document
					var idNumber = $("#canvas " + cloned.get(0).tagName + '.component').size();
					
					//If an element with this id number exists already, increment id number until it doesn't
					while ($('#'+cloned.get(0).tagName + '_' + idNumber).size() !== 0) {
						console.log('#'+cloned.get(0).tagName + '-' + idNumber);
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