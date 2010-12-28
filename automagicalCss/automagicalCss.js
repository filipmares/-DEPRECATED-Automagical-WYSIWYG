(function($){
	$.fn.automagicalCss = function(options){
		var opts = $.extend({}, $.fn.automagicalCss.defaults, options);
		
		jQuery('<link/>',{
			rel: 'stylesheet',
			type: 'text/css',
			media: 'screen',
			href: opts.stylesheet
		}).appendTo('head');
	
		var attributes_html = 
		'<div id="attributes-panel" align="right">' +
			'<div id="showHide">' +
				'<label id="showHideLabel">&gt&gt</label>' +
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
		
		$('#showHide', wrapper).click(function(){
			var panel = $('#attributes-panel');
			var label = $('#showHideLabel');
			var marginDiv = $('#marginDiv');
			
			if (parseInt(panel.css('marginLeft'), 10) == 0){
				panel.animate({marginLeft: attributes_list.outerWidth()});
				marginDiv.hide();
				label.text("<<");
			} else{
				panel.animate({marginLeft: 0});
				marginDiv.show();
				label.text(">>");
			}
		});
		
		//When an element on the canvas is clicked, populate the css attributes list
		/*$('#canvas *').live('click', function(){
			selected = $(this);
			
			selector_field.val($.fn.automagicalCss.extractCssSelectorPath(selected));
			attributes_list.empty();
			
			var typeMapping = $.fn.automagicalCss.tagMappings[selected.get(0).tagName];
			
			jQuery.each(typeMapping, function(key, value){
				var validStyle = "";
				jQuery.each(value, function(index, style){
					if (selected.css(style) != null) validStyle = style;
				});
				attributes_list.append('<label>' + key + '</label> <input class="cssInput" type="text" value="' + 
										selected.css(validStyle) + '" cssValue="' + key + '" /> <br/>');
			});

		});*/
		
		//When an element on the canvas is clicked, populate the css attributes list
		$('#canvas *').live('resize', function(event, ui){
		
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
		
		$('#canvas .component').live('mouseenter', function(event){
			$('#canvas *').removeClass('outline-element');
			$(this).addClass('outline-element');
		});
		
		$('#canvas .component').live('mouseout', function(event){
			$(this).removeClass('outline-element');
		});
		
		$('#canvas .component').live('click', function(event){
			$('#canvas .component').removeClass('outline-element-clicked');
			$(this).addClass('outline-element-clicked');
		});
		
		//TODO: We have to add this functionality later in a way where it plays nice with initalization. This functionality is
		//necessary when working with stuff that's not from scratch
		/*
		//Add drag and resize functionality
		$('#canvas *').mouseenter(function(){
			var element = $(this);
			
			element.draggable({resize : function(event, ui){
				
			}});
			
			element.resizable({drag : function(event, ui){
				
			}});
		});
		
		//Remove the drag and drop functionality from the component
		$('#canvas *').mouseleave(function(){
			var element = $(this);
			element.resizable('destroy');
			element.draggable('destroy');
		});
		*/

	};
	
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
		stylesheet : 'automagicalCss/css/jquery.automagicalCss.css',
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
