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
		initializeDraggableAreas;
		
		
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
					//Else if any MenuBar item is acitve, remove active class and hide menu.
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
						containment: "#canvasContainer",
						helper: function() {
						   return $( cellInner.tag )[0];
						}
					});
					

			
				});
				

				
			});
	};
	
	initializeDraggableAreas = function()
	{
		$("#selector").hide();

		
		$("#canvas").droppable({
			drop: function(ev, ui) { 
				if (!ui.draggable.hasClass("added")) {
					var cloned = ui.helper.clone();
					$(this).append(cloned
						.draggable({containment:"parent"})
						.addClass("added")

						
					);


				}
			}
		});
	};
	
	init.initialize = function ()
	{
		populateNavList();
		initializeDraggableAreas();
	};
	return init;
}());