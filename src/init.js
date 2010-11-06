/*jslint bitwise: true, browser: true, devel: true, eqeqeq: true, immed: true, newcap: true, nomen: true, onevar: true, regexp: true, undef: true */
/*global $, $$, $cls, $$cls, $tag, $$tag, document, window, ActiveXObject, SIMULATE_DEVICE */

//Quick change to the comments
var builder;
if( !builder ) {
    builder = {};
}

builder.init = (function()
{

    var init = {},
    	populateNavList,
		initSelectorScrollbar,
		reloadSelectorScrollbar;

	initSelectorScrollbar = function()
	{
		//Get our elements for faster access and set overlay width
		var divSelector = $('div#selector');


		//Remove scrollbars
		divSelector.css({overflow: 'hidden'});

	};
	
	reloadSelectorScrollbar = function()
	{
		//Get our elements for faster access and set overlay width
		var divSelector = $('div#selector'),
			ulSelector = $('ul#selectorList'),
			 
			 // unordered list's left margin
			 ulSelectorPadding = 15;


		//Find last image container
		var lastLiSelector = ulSelector.find('li:last-child');
		

			  
		
		//When user move mouse over menu
		divSelector.mousemove(function(e){
				
			e.stopPropagation();
			
		  //As images are loaded ul width increases,
		  //so we recalculate it each time
		  var ulSelectorWidth = lastLiSelector[0].offsetLeft + lastLiSelector.outerWidth() + ulSelectorPadding;

		  var leftScroll = (e.pageX - divSelector.offset().left) * (ulSelectorWidth-divSelector.width()) / divSelector.width();
		  divSelector.scrollLeft(leftScroll);

			return false;
		});
		

	
	
	};
	
	
    populateNavList = function()
    {
    	//TODO: Need a way to dynamically populate these menus
    	$.getJSON('Selectors/General/general.json',function(json, status){
 

    		$('ul[name="list"]').append('<li><a id=\"'+ json.main.title+'\" href="#">'+json.main.title+'</a></li>');
				
				//Populating the selector cells when navbar button is clicked
    			$('a#'+json.main.title).click(function()
				{
				  $('a').removeClass('active');
				  $('li').removeClass('active');
				  $(this).addClass('active');
				  $(this).parent().addClass('active');
					$('div#selector').hide('slow');
					$('ul#selectorList').html(""); 	//Ugly way of clearing the list for now
					$.each(json.main.cells,function(name, cell){
    					$('ul#selectorList').append('<li><a href=\"\"><img src=\"'+cell.icon+'\" alt=\"'+cell.name+'\"><span>'+cell.name+'</span></a></li>');

					});
					$('div#selector').show('slow');
					reloadSelectorScrollbar();
				});
				

		});
		
		$.getJSON('Selectors/Layouts/layouts.json',function(json, status){
 

    		$('ul[name="list"]').append('<li><a id=\"'+ json.main.title+'\" href="#">'+json.main.title+'</a></li>');

				//Populating the selector cells when navbar button is clicked
    			$('a#'+json.main.title).click(function()
				{
				  $('a').removeClass('active');
          $('li').removeClass('active');
          $(this).addClass('active');
          $(this).parent().addClass('active');
					$('div#selector').hide('slow');
					$('ul#selectorList').html(""); 	//Ugly way of clearing the list for now
					$.each(json.main.cells,function(name, cell){
    					$('ul#selectorList').append('<li><a href=\"\"><img src=\"'+cell.icon+'\" alt=\"'+cell.name+'\"><span>'+cell.name+'</span></a></li>');

					});
					$('div#selector').show('slow');
					reloadSelectorScrollbar();
				});
				

		}); 
		
		$.getJSON('Selectors/Template/template.json',function(json, status){
 

    		$('ul[name="list"]').append('<li><a id=\"'+ json.main.title+'\" href="#">'+json.main.title+'</a></li>');

				//Populating the selector cells when navbar button is clicked
    			$('a#'+json.main.title).click(function()
				{
				  $('a').removeClass('active');
          $('li').removeClass('active');
          $(this).addClass('active');
          $(this).parent().addClass('active');
					$('div#selector').hide('slow');
					$('ul#selectorList').html(""); 	//Ugly way of clearing the list for now
					$.each(json.main.cells,function(name, cell){
    					$('ul#selectorList').append('<li><a href=\"\"><img src=\"'+cell.icon+'\" alt=\"'+cell.name+'\"><span>'+cell.name+'</span></a></li>');

					});
					$('div#selector').show('slow');
					reloadSelectorScrollbar();
				});
				

		}); 
    
    };
    
    init.initialize = function()
    {

		populateNavList();
		initSelectorScrollbar();
    };
    
    return init;
    
}());




