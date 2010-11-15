(function($){
	$.fn.automagicalCss = function(options){
		var opts = $.extend({}, $.fn.automagicalCss.defaults, options);
		
		jQuery('<link/>',{
			rel: 'stylesheet',
			type: 'text/css',
			media: 'screen',
			href: opts.stylesheet
		}).appendTo('head');
	
		var attrubutes_html = '<div id="attributes-panel">' +
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
		
		$('body *:not(#attributes-wrapper, #attributes-wrapper *)').click(function(){
			var element = $(this);
			
			selector_field.val($.fn.automagicalCss.extractCssSelectorPath(element));
			
			if (element.get(0).tagName == 'DIV'){
				jQuery.each($.fn.automagicalCss.divCommonStyles, function(key, value){
					attributes_list.append('<label>' + key + '</label> <input type="text" value="' + 
											element.css(value) + '" /> <br/>');
				});
			}
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
