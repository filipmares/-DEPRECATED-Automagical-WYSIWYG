var automagicalCss = (function(){

	var highlightElement,
		unHighlightElement,
		highlightClickedElement,
		unHighlightClickedElement,
		populateAttributesBox,
		changeWidthHeightAttributesBox,
		extractElementId,
	
		cssInformation = {};
		
	
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
		var idSelector = '#'+selected.attr('id');
		var selector_field = $('#attributes-selector-input');
		var attributes_list = $('#attributes-list');

		
		selector_field.val(extractElementId(selected));
		
		//See if css based on element id is present
		if (('#'+selected.attr('id')) in cssInformation){
			
			attributes_list.empty();
			

			
			for (value in cssInformation[idSelector]){
				
				if (value == "background-color") {
					attributes_list.append('<label>' + value + '</label> <input class="cssInput color" type="text" value="' +
					selected.css(value) +
					'" cssValue="' +
					value +
					'" /> <br/>');
					jscolor.init();
				}
				else {
					attributes_list.append('<label>' + value + '</label> <input class="cssInput" type="text" value="' +
					selected.css(value) +
					'" cssValue="' +
					value +
					'" /> <br/>');
				}				
										
			}
			
			
			
		}
		else {
			//TODO: Handle this case
		}
		


		//Highlight clicked element
		unHighlightClickedElement('#canvas .component');
		highlightClickedElement(selected);

		
		automagicalUI.showAttributesBox();
	};
	
	changeWidthHeightAttributesBox = function(width, height){
		
		//TODO: This doesn't actually modify the value attribute in the html but is it even necessary to update this value?

		$('#attributes-list input[cssvalue="width"]').val(width +'px');
		$('#attributes-list input[cssvalue="height"]').val(height + 'px');

	};
	
	extractElementId = function(element){
		if (element.attr('id')){
			return element.attr('id');
		}
		
		var path = extractElementId(element.parent());
		
		if (element.attr('class') && element.attr('class') != ' '){ 
			return path + ' .' + element.attr('class');
		}
		
		return path + ' ' + element.get(0).tagName().toLowerCase(); 
	};

	return {
	
		initializeCssFunctionality : function(){
			
	
	
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
			$('#attributes-selector-input').live('change', function(event){
				var element = $(this);
				var selected = $('.outline-element-clicked');
				
				if (element.val() !== "") {
				
					var oldId = selected.attr('id');
					selected.attr('id', element.val());
					
					if ('#'+oldId in cssInformation){
	
						cssInformation['#'+selected.attr('id')] = cssInformation['#'+oldId];
						delete cssInformation['#'+oldId];
						automagicalCss.updatePageCss();
						
					}
					else {
									//TODO: What to do if class or element selector
					
					}
				}
			});
			
			//Listen to when the user changes a css property, then change the property
			$('.cssInput').live('change', function(event){
				var selected = $('.outline-element-clicked');
				var property = $(this).attr('cssValue');
	
				//checks to see if selector based on ID present in css
				if (cssInformation['#'+selected.attr('id')][property] != null) {
	
					selected.css(property, $(this).val());
					automagicalCss.writeCssSelector('#'+selected.attr('id'),property,$(this).val());
					automagicalCss.updatePageCss();
				}
				else {
					//TODO: What to do if class or element selector
				}
					
	
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
	
	
		},
		
		writeCssSelector : function(selector, property, value){
			
	
			if (!(selector in cssInformation)){
				var properties = {};
				
				properties[property] = value;
				cssInformation[selector] = properties;
				
			}
			else {
				cssInformation[selector][property] = value;
			}
			
			automagicalCss.updatePageCss();
	
	
	
		},
		
		//TODO: Find better way of updating css rather than flushing entire style and rewriting on each change
		updatePageCss : function(){
			if ($('style[id="temporary"]').length) {
				
				var cssStyles = "";
				
				for (selector in cssInformation) {
					cssStyles+= selector + "{\n";
					
					for (property in cssInformation[selector]) {
						cssStyles+= property + ": " + cssInformation[selector][property] + ";\n" ;
					
					}
					
					cssStyles+= "\n}\n\n";
				}
				
				$('style[id="temporary"]').empty();
				$('style[id="temporary"]').append(cssStyles);
	
			}
			
							
	
		}
		

	};
	


	

	
		
	
	//TODO: Don't know if storing css values in associative arrays is the best way to do things for now so I've not deleted this so we could go back to this system if we want to
	/*
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
	};*/
	
})();
