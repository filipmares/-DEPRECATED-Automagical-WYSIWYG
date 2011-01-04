(function($){
	$.fn.automagicalCss = function(options){
		var opts = $.extend({}, $.fn.automagicalCss.defaults, options);
		
		//Append a link to the DOM for the stylesheet for this plugin.
		jQuery('<link/>',{
			rel: 'stylesheet',
			type: 'text/css',
			media: 'screen',
			href: opts.stylesheet
		}).appendTo('head');
	
		var attributes_html = 
		'<div id="attributes-panel" align="right">' +
			'<div id="showHide">' +
				'<label id="showHideLabel">&gt&gt </label>' +
			'</div>' +
			'<div id="marginDiv">' +
				'<div id="attributes-selector">' +
					'<label for="attributes-selector-input">Element</label>' +
					'<input type="text" id="attributes-selector-input">' +
				'</div>' +
				'<div id="attributes-list">' +
				'</div>' +
			'</div>' +
		'</div>';
		
		var wrapper = jQuery('<div/>', {
			id: 'attributes-wrapper',
			'class' : 'automagicalCss-' + opts.position,
			html: attributes_html
		}).appendTo("div#attributesWrapper");
		
		var selector_field = $('#attributes-selector-input', wrapper);
		var attributes_list = $('#attributes-list', wrapper);
		var selected = null;
		
		//Animate (show/hide) the attributes box when the user clicks the handle ('>>') component
		$('#showHide', wrapper).click(function(){
			var panel = $('#attributes-panel');
			var label = $('#showHideLabel');
			var marginDiv = $('#marginDiv');
			
			//Here we are animating the components marginLeft property to achieve the desired effect
			if (marginDiv.is(":visible")){
				marginDiv.animate({width: 'hide', 'opacity':'toggle'});
				$('#showHide').animate({marginLeft: attributes_list.outerWidth()});
				label.text("<< ");
			} else{
				marginDiv.animate({width: 'show', 'opacity':'toggle'});
				$('#showHide').animate({marginLeft: 0});
				label.text(">> ");
			}
		});
		

		//When an element on the canvas is clicked, populate the css attributes list
		$('#canvas .component').live('click', function(){
			selected = $(this);
			var marginDiv = $('#marginDiv');
			var label = $('#showHideLabel');
			
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
			$('#canvas .component').removeClass('outline-element-clicked');
			$(this).addClass('outline-element-clicked');
			
			//Show the attributes box if it already isn't shown
			if (!(marginDiv.is(":visible"))){
				marginDiv.animate({width: 'show', 'opacity':'toggle'});
				$('#showHide').animate({marginLeft: 0});
				label.text(">> ");
			} 
		});
		
		//When an element on the canvas is clicked, populate the css attributes list
		$('#canvas .component').live('resize', function(event, ui){
		
			//TODO: On resize, we have to make sure the attributes box is showing the right element
			
			
			//Need to do this to handle case where during resize mouse moves outside of element being resized
			$('#canvas *').removeClass('outline-element');				
			$(this).addClass('outline-element');
			
			$.fn.automagicalCss.changeWidthHeight(ui.size.width, ui.size.height);
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
			$('#canvas *').removeClass('outline-element');
			$(this).addClass('outline-element');
		});
		
		//Show/hide the outline when we hover over an element. We could probably use hover() for this
		$('#canvas .component').live('mouseenter', function(event){
			$('#canvas *').removeClass('outline-element');
			$(this).addClass('outline-element');
		});
		
		$('#canvas .component').live('mouseout', function(event){
			$(this).removeClass('outline-element');
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
	
	$.fn.automagicalCss.changeWidthHeight = function(width, height){
		
		//TODO: This doesn't actually modify the value attribute in the html but is it even necessary to update this value?

		$('#attributes-list input[cssvalue="width"]').val(width +'px');
		$('#attributes-list input[cssvalue="height"]').val(height + 'px');

	};
	
	$.fn.automagicalCss.defaults = {
		stylesheet : 'Styles/jquery.automagicalCss.css',
		position: 'right'
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
		DIV : $.fn.automagicalCss.divCommonStyles
	};
	
}



)(jQuery);

$(function () { $.fn.automagicalCss(); });
