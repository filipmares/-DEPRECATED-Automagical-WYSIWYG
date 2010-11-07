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
	populateNavList = function ()
	{
		$.getJSON('Selectors/index.json', function (json, status)
		{
			$.each(json.main.selectors, function (name, cell)
			{
				console.log(cell.Folder_Name);
				$("nav#nav").append('<a id="' + cell.Folder_Name + '" href="#">' + cell.Folder_Name + '</a>');
				$('a#' + cell.Folder_Name).click(function ()
				{
					if ($(this).hasClass('active'))
					{
						$(".active").removeClass("active");
						$("nav#selector").slideUp("slow");
					}
					else
					{
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