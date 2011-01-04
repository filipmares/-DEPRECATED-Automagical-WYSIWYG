(function($){
	$.fn.postProcessing = function(){
		
		/* This function initializes the GetHtml link button*/
		var canvasHTML="";
					
		//We need to recursively go through and do element by element for a multitude of reasons right now
		$(this).children().each(function() {
			canvasHTML = recursiveHTMLAppendFunction(canvasHTML, $(this).clone())
    	});	
					
		var allHTML = $.ajax({async:false, url:'template.html',}).responseText;
		allHTML = allHTML.replace(/\{body\}/m, canvasHTML);

		//Output HTML to console
		console.log(allHTML);
	};

	/* This function recursively iterates through all of an element's children to produce it's html */
    recursiveHTMLAppendFunction = function( canvasHTML, element) {
		//if the div is only being used for resizing purposes, don't include it in final html
		if ((element.filter('.ui-resizable-handle, .ui-resizable-e, .ui-resizable-handle, .ui-resizable-s, .ui-resizable-handle, .ui-resizable-se, .ui-icon, .ui-icon-gripsmall-diagonal-se')).size() > 0) {
			return "";
		}
		
		//remove all the classes we are using for editing purposes
		element.removeClass('component container ui-draggable added ui-resizable ');

		//TODO: This doesn't take into acount any other attributes other than 'style', this needs to be changed
		canvasHTML += "<"+ element.get(0).tagName + " " + defineInlineCssProperty(element) + ">" + element.clone().find("*").remove().end().text();
		
		//Go through all of the children of this element
        if (element.children().size() > 0) {
            element.children().each( function() {
                canvasHTML += recursiveHTMLAppendFunction("", $(this));
            });
        }
        
       	canvasHTML += "</"+ element.get(0).tagName + ">";
       	
       	return canvasHTML;
	};
    
    /* This function is used to get all the inline style attributes of an element that is set*/
    defineInlineCssProperty = function(element) {
    	
    	var styleString = "style=\"";
    	
    	styleString+= element.attr('style');
    	
    	styleString+= "\"";
    	return styleString;
    };
		
}

)(jQuery);
