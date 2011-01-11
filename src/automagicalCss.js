(function($){
	$.fn.automagicalCss = function(){

		//When an element on the canvas is clicked, populate the css attributes list
		$('#canvas .component').live('click', function(){
				populateAttributesBox(this);

		});

		//When an element on the canvas is dropped onto canvas, populate the css attributes list		
		$('#canvas .component').live('appendToCanvas', function(){
				populateAttributesBox(this);
				
		});
		
		//When an element on the canvas is clicked, populate the css attributes list
		$('#canvas .component').live('resize', function(event, ui){
		
			var selected = $(event.target);	
			//TODO: On resize, we have to make sure the attributes box is showing the right element. We can refactor this code out somehow.
			if (selected !== null) {
				if (selected.parent()[0] !== $(ui.helper).get(0)) {
					populateAttributesBox(ui.helper);

				}
			}
			
			//Need to do this to handle case where during resize mouse moves outside of element being resized			
			highlightElement(this);
			
			changeWidthHeightAttributesBox(ui.size.width, ui.size.height);
		});
		
		
		//When an element on the canvas is resized, use mouseup to say when it's done. We need this part to account for golden grid, and the fact that when you resize, the size doesn't corresponding to the resizing correctly because of snapping.
		
		$('#canvas .component').live('resizestop', function(event,ui){
		
			var selected = $(event.target);
			
			//TODO: On resize, we have to make sure the attributes box is showing the right element. We can refactor this code out somehow.
			if (selected !== null) {
				if (selected.parent()[0] !== $(ui.helper).get(0)) {
					
					populateAttributesBox(ui.helper);
					
				}
			}
			
			//Need to do this to handle case where during resize mouse moves outside of element being resized			
			highlightElement(this);
			
			//We use event.target here again to account for golden grid. This will give you the snapped width and height.
			changeWidthHeightAttributesBox($(event.target).width(), $(event.target).height());

		});
		

		//Listen to when the user changes id, then change the id
		$('#attributes-selector-input').live('keyup', function(event){
			var element = $(this);
			
			if (element.val() !== "") {
				selected.attr('id', element.val());
			}
		});
		
		//Listen to when the user changes a css property, then change the property
		$('.cssInput').live('keyup', function(event){
			var element = $(this);
			var typeMapping = $.fn.automagicalCss.tagMappings[selected.get(0).tagName];
			var styleMapping = null;
			if (typeMapping[element.attr('cssValue')] != null) styleMapping = typeMapping[element.attr('cssValue')];
			jQuery.each(styleMapping, function(index, value){
				selected.css(value, element.val());
			});
		});
		
		//Support for outlining the current element
		
		//Need mouseover event so that outline stays even when mousing over resizing div's on east and south of component
		$('#canvas .component').live('mouseover', function(event){
			highlightElement(this);
		});
		
		//Show/hide the outline when we hover over an element. We could probably use hover() for this
		$('#canvas .component').live('mouseenter', function(event){
			highlightElement(this);
		});
		
		$('#canvas .component').live('mouseout', function(event){
			unHighlightElement(this);
		});


	};
	

	//Extract the full path of an element
	$.fn.automagicalCss.extractCssSelectorPath = function(element){
		if (element.attr('id')){
			return '#' + element.attr('id');
		}
		
		var path = $.fn.automagicalCss.extractCssSelectorPath(element.parent());
		
		if (element.attr('class') && element.attr('class') != ' '){ 
			return path + ' .' + element.attr('class');
		}
		
		return path + ' ' + element.get(0).tagName().toLowerCase(); 
	};
	


	
	$.fn.automagicalCss.divCommonStyles = {
		width: ['width'],
		height: ['height'],
		bkgcolor: ['backgroundColor'],
		radius: ['-webkit-border-radius', 'border-radius', '-moz-border-radius',
				'-webkit-border-bottom-left-radius', '-moz-border-radius-bottomleft', 'border-bottom-left-radius',
				'-webkit-border-bottom-right-radius', '-moz-border-radius-bottomright', 'border-bottom-right-radius',
				'-webkit-border-top-right-radius', '-moz-border-radius-topright', 'border-top-right-radius',
				'-webkit-border-top-left-radius', '-moz-border-radius-topleft', 'border-top-left-radius']
	};
	
	$.fn.automagicalCss.tagMappings = {
	
		//TODO: Figure out a better way to discern between styles for different elements
		DIV : $.fn.automagicalCss.divCommonStyles,
		A : $.fn.automagicalCss.divCommonStyles,
		H1 : $.fn.automagicalCss.divCommonStyles,
		P : $.fn.automagicalCss.divCommonStyles,
		LABEL : $.fn.automagicalCss.divCommonStyles,
		HEADER : $.fn.automagicalCss.divCommonStyles,
		FOOTER : $.fn.automagicalCss.divCommonStyles,
		AUDIO : $.fn.automagicalCss.divCommonStyles,
		IMAGE : $.fn.automagicalCss.divCommonStyles,
		VIDEO : $.fn.automagicalCss.divCommonStyles
	};
	
	highlightElement = function(element) {
		$('#canvas *').removeClass('outline-element');
		$(element).addClass('outline-element');
	};
	
	unHighlightElement = function(element) {
		$(element).removeClass('outline-element');	
	};
	
	highlightClickedElement = function(element) {
		$(element).addClass('outline-element-clicked');
	};
	
	unHighlightClickedElement = function(element) {
		$(element).removeClass('outline-element-clicked');
	};
	
	populateAttributesBox = function(element) {
		var selected = $(element);
		var selector_field = $('#attributes-selector-input');
		var attributes_list = $('#attributes-list');
		var panel = $('#attributes-panel');
		var label = $('#showHideLabel');
		var marginDiv = $('#marginDiv');
		
		selector_field.val($.fn.automagicalCss.extractCssSelectorPath(selected));
		attributes_list.empty();
		
		var typeMapping = $.fn.automagicalCss.tagMappings[selected.get(0).tagName];
		
		jQuery.each(typeMapping, function(key, value){
			var validStyle = "";
			jQuery.each(value, function(index, style){
				if (selected.css(style) != null) {
					validStyle = style;
				}
			});
			
			attributes_list.append('<label>' + key + '</label> <input class="cssInput" type="text" value="' + 
									selected.css(validStyle) + '" cssValue="' + key + '" /> <br/>');
		});

		//Highlight clicked element
		unHighlightClickedElement('#canvas .component');
		highlightClickedElement(selected);

		
		$.fn.showAttributesBox();
	};
	
	changeWidthHeightAttributesBox = function(width, height){
		
		//TODO: This doesn't actually modify the value attribute in the html but is it even necessary to update this value?

		$('#attributes-list input[cssvalue="width"]').val(width +'px');
		$('#attributes-list input[cssvalue="height"]').val(height + 'px');

	};
	
}



)(jQuery);
