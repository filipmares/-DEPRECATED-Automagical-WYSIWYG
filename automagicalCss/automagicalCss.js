(function($){
	$.fn.automagicalCss = function(options){
		var opts = $.extend({}, $.fn.automagicalCss.defaults, options);
		
		jQuery('<link/>',{
			rel: 'stylesheet',
			type: 'text/css',
			media: 'screen',
			href: opts.stylesheet
		}).appendTo('head');
	
		var attrubutes_html = '<div id="attributes-panel" align="right">' +
			'<div id="attributes-selector">' +
				'<label for="attributes-selector-input">Element</label>' +
				'<input type="text" id="attributes-selector-input">' +
			'</div>' +
			'<div id="attributes-list">' +
			'</div>' +
		'</div>';
		
		var wrapper = jQuery('<div/>', {
			id: 'attributes-wrapper',
			'class' : 'automagicalCss-' + opts.position,
			html: attrubutes_html
		}).appendTo("body");
		
		var selector_field = $('#attributes-selector-input', wrapper);
		var attributes_list = $('#attributes-list', wrapper);
		var selected = null;
		
		//When an element on the canvas is clicked, populate the css attributes list
		$('body *:not(#attributes-wrapper, #attributes-wrapper *)').click(function(){
			selected = $(this);
			
			selector_field.val($.fn.automagicalCss.extractCssSelectorPath(selected));
			attributes_list.empty();
			
			if (selected.get(0).tagName == 'DIV'){
				jQuery.each($.fn.automagicalCss.divCommonStyles, function(key, value){
					attributes_list.append('<label>' + key + '</label> <input class="cssInput" type="text" value="' + 
											selected.css(value) + '" cssValue="' + value + '" /> <br/>');
				});
			}
		});
		
		//Listen to when the user changes a css property, then change the property
		$('.cssInput').live('keyup', function(event){
			var element = $(this);
			
			selected.css(element.attr('cssValue'), element.val());
		});
		
		//Add drag and resize functionality
		$('body *:not(#attributes-wrapper, #attributes-wrapper *)').mouseenter(function(){
			var element = $(this);
			
			element.draggable({resize : function(event, ui){
				
			}});
			
			element.resizable({drag : function(event, ui){
				
			}});
		});
		
		//Remove the drag and drop functionality from the component
		$('body *:not(#attributes-wrapper, #attributes-wrapper *)').mouseleave(function(){
			var element = $(this);
			element.resizable('destroy');
			element.draggable('destroy');
		});

	}
	
	$.fn.automagicalCss.extractCssSelectorPath = function(element){
		if (element.attr('id')) return '#' + element.attr('id');
		
		var path = $.fn.automagical.extractCssSelectorPath(element.parent());
		
		if (element.attr('class') && element.attr('class') != ' ') return path + ' .' + element.attr('class');
		return path + ' ' + element.get(0).tagName().toLowerCase(); 
	};
	
	
	$.fn.automagicalCss.defaults = {
		stylesheet : 'css/jquery.automagicalCss.css',
		position: 'right'
	};
	
	$.fn.automagicalCss.divCommonStyles = {
		width: 'width',
		height: 'height',
		background: 'backgroundColor',
		color: 'color'
	};
	
})(jQuery);

$(function () { $.fn.automagicalCss(); });
