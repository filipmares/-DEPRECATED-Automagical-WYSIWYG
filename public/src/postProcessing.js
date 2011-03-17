var postProcessing = (function(){
	

	
	var recursiveHTMLAppendFunction;


	/* This function recursively iterates through all of an element's children to produce it's html */
    recursiveHTMLAppendFunction = function( canvasHTML, element, positioning) {
		//if the div is only being used for resizing purposes, don't include it in final html
		if ((element.filter('.ui-resizable-handle, .ui-resizable-e, .ui-resizable-handle, .ui-resizable-s, .ui-resizable-handle, .ui-resizable-se, .ui-icon, .ui-icon-gripsmall-diagonal-se')).size() > 0) {
			return "";
		}
		
		//remove all the classes we are using for editing purposes
		element.removeClass('component container ui-draggable ui-droppable added ui-resizable outline-element outline-element-clicked');
		
		var attributes = "";
		
				
		if (positioning) {
			element.css('position', positioning);
			//console.log("changed " + element.attr('id'));
		}
		
		var target = $(element).get(0);
		$.each($(target.attributes), function(index) {

			attributes += target.attributes[index].name + "=\"" + target.attributes[index].value+ "\" ";

		});

		
		//TODO: This doesn't take into acount any other attributes other than 'style', this needs to be changed
		if (!element.hasClass('ui-wrapper')) {
			canvasHTML += "<"+ element.get(0).tagName + " "+ attributes +">\n" + element.clone().find("*").remove().end().text();
			
			//Go through all of the children of this element
	        if (element.children().size() > 0) {
	            element.children().each( function() {
	                canvasHTML += recursiveHTMLAppendFunction("", $(this));
	            });
	        }
	        
	       	canvasHTML += "</"+ element.get(0).tagName + ">\n";

		}
		else {
			//Go through all of the children of this element
	        if (element.children().size() > 0) {
	            element.children().each( function() {
	                canvasHTML += recursiveHTMLAppendFunction("", $(this), 'absolute');
	            });
	        }
		}

       	
       	return canvasHTML; 
	};
	
	return {
		postProcessing : function(){
			
			/* This function initializes the GetHtml link button*/
			var canvasHTML="";
			var styleHTML ="";
						
			//We need to recursively go through and do element by element for a multitude of reasons right now
			$('#canvas').children().each(function() {
				canvasHTML = recursiveHTMLAppendFunction(canvasHTML, $(this).clone())
	    	});	
			
			styleHTML = $('style[id="temporary"]').html();
						
			var allHTML = $.ajax({async:false, url:'/src/template.html',}).responseText;
			allHTML = allHTML.replace(/\{body\}/m, canvasHTML);
			allHTML = allHTML.replace(/\{style\}/m, "\n\n" + styleHTML + "\n\n");
			
			//get page number, if an existing page is being edited.
			var params = $.getUrlVars();
			var pageNum = "";
			if (params.length > 1){
				pageNum = "/" + params['page'];
			}
			
			$.post("/savepage" + pageNum, {data: allHTML, style: styleHTML, canvas: canvasHTML}, 
				function(data){
					//Show some page saved confirmation
				}
			);
	
			//Output HTML to console
			console.log(allHTML);
		}
	};
    
		
})();
