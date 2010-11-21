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
		}).appendTo("div#attributesWrapper");
		
		var selector_field = $('#attributes-selector-input', wrapper);
		var attributes_list = $('#attributes-list', wrapper);
		var selected = null;
		
		//When an element on the canvas is clicked, populate the css attributes list
		$('#canvas *').live('click', function(){
			selected = $(this);
			
			selector_field.val($.fn.automagicalCss.extractCssSelectorPath(selected));
			attributes_list.empty();
			

			jQuery.each($.fn.automagicalCss.divCommonStyles, function(key, value){
				attributes_list.append('<label>' + key + '</label> <input class="cssInput" type="text" value="' + 
										selected.css(value) + '" cssValue="' + value + '" /> <br/>');
			});
			
			if ($("div#attributesWrapper").is(':hidden')) {
				$("div#attributesWrapper").show();
			}
			else {
				$("div#attributesWrapper").hide();
			}
		});
		
		//When an element on the canvas is clicked, populate the css attributes list
		$('#canvas *').live('resize', function(event, ui){
			$.fn.automagicalCss.changeWidthHeight(ui.size.width, ui.size.height);
		});
		
		
		//Listen to when the user changes a css property, then change the property
		$('.cssInput').live('keyup', function(event){
			var element = $(this);
			
			selected.css(element.attr('cssValue'), element.val());
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
		width: 'width',
		height: 'height',
		bkgcolor: 'backgroundColor',
	};
	
}



)(jQuery);

$(function () { $.fn.automagicalCss(); });
