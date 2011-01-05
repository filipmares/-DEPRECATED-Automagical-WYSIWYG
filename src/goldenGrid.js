(function($){
	$.fn.goldenGrid = function(options){
		var opts = $.extend({}, $.fn.goldenGrid.defaults, options);
		
		//Link to the style sheet for the golden grid
		jQuery('<link/>',{
			rel: 'stylesheet',
			type: 'text/css',
			media: 'screen',
			href: opts.stylesheet
		}).appendTo('head');
				
		//An outline to help the user see where the element will drop
		var helperDiv = jQuery('<div id="golden-drig-helper-div" class="outline-element"></div>');
		
		//When an element is resized make sure it snaps to the grid
		$('#canvas .component').live('resize', function(event, ui){
			$.fn.goldenGrid.snapSize($(this));
		});
		
		//When we start dragging, show the helper div
		$('#canvas .component').live('dragstart', function(event, ui){
			helperDiv.appendTo('body');
			helperDiv.width(ui.helper.width());
			helperDiv.height(ui.helper.height());
			$.fn.goldenGrid.snapSize(helperDiv);
		});
		
		//Move the helper div as we are dragging the element
		$('#canvas .component').live('drag', function(event, ui){
			helperDiv.css('top', ui.helper.css('top'));
			helperDiv.css('left', ui.helper.css('left'));
			$.fn.goldenGrid.snapToGrid(helperDiv);
			
		});
		
		//When dragging is complete, remove the helper div, and snap the element into it's new place
		$('#canvas .component').live('dragstop', function(event, ui){
			$.fn.goldenGrid.snapToGrid(ui.helper);
			$.fn.goldenGrid.snapSize(ui.helper);
			helperDiv.remove();
		});
		
	}
	
	/* This function returns the default grid size used for the golden grid */
	$.fn.goldenGrid.GRIDSIZE = function() {
		return 10;
	}
	
	/* This function snaps the size of a resized element so it conforms to the underlying grid*/
	$.fn.goldenGrid.snapSize = function(element){
		
		var width = $.fn.goldenGrid.GRIDSIZE() * Math.round(element.width() / $.fn.goldenGrid.GRIDSIZE());
		var height = $.fn.goldenGrid.GRIDSIZE() * Math.round(element.height() / $.fn.goldenGrid.GRIDSIZE());
			
		if (width === 0) {
			width = $.fn.goldenGrid.GRIDSIZE();
		}
			
		if (height === 0) {
			height = $.fn.goldenGrid.GRIDSIZE();
		}
	
		if (element.width() > $('#canvas').width()) {
			element.css('width','100%');
		}
		else {
			element.css('width', width + 'px');
		}
		element.css('height', height + 'px');
	};
		
	/* This function snaps the dropped element to the underlying grid*/
	$.fn.goldenGrid.snapToGrid = function(element){
			
		var top = $.fn.goldenGrid.GRIDSIZE() * Math.round(parseInt(element.css("top").replace("px", ""), 10) / $.fn.goldenGrid.GRIDSIZE());
		var left = $.fn.goldenGrid.GRIDSIZE() * Math.round(parseInt(element.css("left").replace("px", ""), 10) / $.fn.goldenGrid.GRIDSIZE());
			
		//if element is at left most region, no need for a left margin; also no need for margin if it is an element inside another
		if ((left === 0) || (element.parent().attr("id") != "canvas")) {
			element.css("margin-left", "0px");
				
		}
		else {
			element.css("margin-left", "10px");
		}
		element.css("margin-bottom", "10px");
		
		element.css("top", top + 'px');
		element.css("left", left + 'px');
	};
	
	$.fn.goldenGrid.defaults = {
		stylesheet : 'Styles/golden-min.css'
	};
	
}
	
)(jQuery);
	
$(function () { $.fn.goldenGrid(); });
