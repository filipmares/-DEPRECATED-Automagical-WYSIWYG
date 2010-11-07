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
            $.each(json.main.selectors, function(name, cell){
                $("nav#nav").append('<a id="'+ cell.Folder_Name + '" href="#">' + cell.Folder_Name + '</a>');
               $('a#'+cell.Folder_name).click(function(){
               
                   $("nav#selector").slideToggle("slow"); 
                   $('a#'+cell.Folder_name).addClass("active");
               });
            });
        });
    };
     
    init.initialize = function()
    {

        populateNavList();
    };
    
    return init;
    
}());