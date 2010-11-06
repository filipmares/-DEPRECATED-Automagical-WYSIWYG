var builder;
if( !builder ) {
    builder = {};
}

builder.init = (function()
{	
	var init = {}, populateNavList;
	
    populateNavList = function()
    {
    	$.getJSON('Selectors/index.json',function(json, status){
			var folderName = "";
    		for(var i = 0; i < json.main.selectors.length;i++)
    		{
    			folderName = json.main.selectors[i].Folder_Name;
    			$("nav#nav").append('<a id="'+ folderName + '" href="#">' + folderName + '</a>');
    		}
    	});
    };
     
    init.initialize = function()
    {

		populateNavList();
    };
    
    return init;
    
}());




