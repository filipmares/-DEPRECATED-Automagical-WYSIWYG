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
		populateNavList,
		populateSelectorList,
		initializeDroppableAreas,
		clearDroppableAreas,
		reinitializeDroppableAreas;
		
		
	/*This funtion populates the MenuBar and Selector bar with extensions and their various cells*/	
	populateNavList = function ()
	{
		//Get INDEX JSON file to iterate through extensions
		$.getJSON('Selectors/index.json', function (json, status)
		{
			//Iterate Through extensions
			$.each(json.main.selectors, function (name, cell)
			{
				console.log("Found Folder: " + cell.Folder_Name);
				//Populate MenuBar with extension folder names.
				$("nav#nav").append('<a id="' + cell.Folder_Name + '" href="#">' + cell.Folder_Name + '</a>');
				//Add on-click behaviour to MenuBar Items.
				$('a#' + cell.Folder_Name).click(function ()
				{
					//If this menu item is active then remove active class and hide SelectorBar.
					if ($(this).hasClass('active'))
					{
						$(".active").removeClass("active");
						$("nav#selector").slideUp("slow");
					}
					else
					{
					//Else if any MenuBar item is active, remove active class and hide menu.
					//Make item clicked active and slide SelectorBar.
						if ($("nav#selector").is(":visible"))
						{
							$("nav#selector").hide();
						}
						$("nav#selector").slideDown("slow");
						$(".active").removeClass("active");
						$(this).addClass("active");
					}
					
					populateSelectorList(cell.Folder_Name);
				});
			});
		});
	};
	
	populateSelectorList = function(folderName)
	{
	
				//Populate the selectors using the json file in the correct folder pointed to by main json file
			$.getJSON('Selectors/'+folderName+'/'+folderName+'.json',function(jsonInner, statusInnter){

				//Clear everything currently in selecter
				$('nav#selector').html("");
				
				//Append to the nav
				$.each(jsonInner.main.cells,function(nameInner, cellInner){
						$('nav#selector').append('<a href=\"#\" id=\"'+folderName+cellInner.name+'\"><img src=\"images/cells/'+cellInner.icon+'\" alt=\"'+cellInner.name+'\" width=\"55\" height=\"27\" /></a>');
						
					//Make the item draggable
					$("#"+folderName+cellInner.name).draggable({
						revert: "invalid",
						appendTo: "body",
						containment: "#canvas",
						helper: function() {
							//Return the new tag to be created
						   return $( cellInner.tag )[0];
						},
						start: function(event, ui) {
							//We need to know if something is a container so it can be initialized properly
							if (cellInner.container == true) {
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
					cloned.click(function() {
						$(this).focus();
					});
					
					
					
					
					//TODO: Find a better solution. Hack so that nested dynamic droppables will work.
					if ($(cloned).hasClass("container")) {
						clearDroppableAreas();
						initializeDroppableAreas($(cloned));
						reinitializeDroppableAreas();

					}

					cloned.css('top', ui.position.top - $(this).offset().top);
       				cloned.css('left', ui.position.left - $(this).offset().left);



				}
				else { //Element already on canvas
					

					$(this).append($(ui.draggable));

					$(ui.draggable).css('top', ui.offset.top - $(this).offset().top);
       				$(ui.draggable).css('left', ui.offset.left - $(this).offset().left);
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
		populateNavList();
		initializeDroppableAreas($("#canvas"));
	};
	return init;
}());