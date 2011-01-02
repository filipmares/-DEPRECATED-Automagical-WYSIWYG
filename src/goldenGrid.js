/* This function snaps the size of a resized element so it conforms to the underlying grid*/
	snapSize = function(element){
	
		var width = 70 * Math.round(element.width() / 70);
		var height = 70 * Math.round(element.height() / 70);
		
		if (width === 0) {
			width = 70;
		}
		
		if (height === 0) {
			height = 70;
		}
		
		element.css('width', width + 'px');
		element.css('height', height + 'px');
	};
	
	/* This function snaps the dropped element to the underlying grid*/
	snapToGrid = function(element){
		
		
		var top = 70 * Math.round(parseInt(element.css("top").replace("px",""), 10)/70);
		var left = 70 * Math.round(parseInt(element.css("left").replace("px",""), 10)/70);
		
		//if element is at left most region, no need for a left margin; also no need for margin if it is an element inside another
		if ((left === 0) || (element.parent().attr("id") != "canvas")) {
			element.css("margin-left", "0px");
			
		}
		else {
			element.css("margin-left", "10px");
		}
		element.css("margin-bottom", "10px");

		element.css("top",	top + 'px');
		element.css("left", left + 'px');
	};