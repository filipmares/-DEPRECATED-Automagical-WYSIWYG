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
		reinitializeDroppableAreas;
		
		
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
	
	snapToGrid = function(element){
    element.css('top',Math.floor(parseInt(element.css("top").replace("px",""))/80)*80+'px');
	  element.css('left',Math.floor(parseInt(element.css("left").replace("px",""))/80)*80+'px'); 
	};
	
	snapSize = function(element){
	  element.css('width','70px');
	  element.css('height','70px');
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
						},
						start: function(event, ui) {
							//We need to know if something is a container so it can be initialized properly
							if (elementInner.container === true) {
								$(ui.helper).addClass("container");
							}
							
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
						.draggable({containment:"parent"})
						.addClass("added")
						.removeClass("ui-draggable-dragging")
						.resizable({
							containment:"parent"
						})
					);
					
					
					//TODO: Preliminary step to implement contentEditable areas at some point in future
					cloned.click(function(event) {

						$(this).focus();
					});
					
					snapToGrid(cloned);
					snapSize(cloned);
					
					
					//TODO: Find a better solution. Hack so that nested dynamic droppables will work.
					if ($(cloned).hasClass("container")) {
						clearDroppableAreas();
						initializeDroppableAreas($(cloned));
						reinitializeDroppableAreas();

					}



				}
				else { //Element already on canvas
					

					$(this).append($(ui.draggable));

          snapToGrid(ui.draggable);
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
		hideElements();
		populateNavList();
		initializeDroppableAreas($("#canvas"));
	};
	return init;
}());