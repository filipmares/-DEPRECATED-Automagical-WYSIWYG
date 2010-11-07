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
		populateNavList;
		
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
				});
			});
		});
	};
	init.initialize = function ()
	{
		populateNavList();
	};
	return init;
}());