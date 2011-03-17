(function($){
	$.fn.cssEditor = function(options){
		var opts = $.extend({}, $.fn.cssEditor.defaults, options);
		
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
		
		$('#showHide', wrapper).click(function(){
			var panel = $('#attributes-panel');
			var label = $('#showHideLabel');
			var marginDiv = $('#marginDiv');
			
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
		$('#canvas *').live('click', function(){
			$.fn.cssEditor.selected = $(this);
			var marginDiv = $('#marginDiv');
			var label = $('#showHideLabel');
			
			selector_field.val($.fn.cssEditor.extractCssSelectorPath($.fn.cssEditor.selected));
			attributes_list.empty();
			
			var typeMapping = $.fn.cssEditor.commonStyles;
			//Build the Attributes Box
			jQuery.each(typeMapping, function(key, value){
				//Find a style (from a set of related styles) that is set, and use that as default
				var validStyle = "";
				jQuery.each(value.styles, function(index, style){
					if ($.fn.cssEditor.selected.css(style) != null) {
						validStyle = style;
					}
				});
				//Find the type of selector to build, and build that selector
				if (value.type === "input"){
					attributes_list.append('<label>' + key + '</label> <input class="cssInput" type="text" value="' + 
											$.fn.cssEditor.selected.css(validStyle) + '" cssValue="' + key + '" /> <br/>');
				
				} else if (value.type === "select"){
					var selectBox = '<select class="cssEditSelect" ' + 
													' cssValue="' + key + '"' +
													' onchange="$.fn.cssEditor.changeSelectValue(this)">';
					//Add the whole set of options to the select element
					jQuery.each(value.options, function(index, option){
						selectBox += '<option value="' + option + '">' + option + '</option>';
					});
					selectBox += '</select>';
					attributes_list.append('<label>' + key + '</label>' + selectBox + '<br/>');
				
				}	else if (value.type === "colorpicker"){
					
				}	
				
			});

			//Highlight clicked element
			$('#canvas *').removeClass('outline-element-clicked');
			$(this).addClass('outline-element-clicked');
			
			//Show the attributes box if it already isn't shown
			if (!(marginDiv.is(":visible"))){
				marginDiv.animate({width: 'show', 'opacity':'toggle'});
				$('#showHide').animate({marginLeft: 0});
				label.text(">> ");
			} 
		});
		
		//When an element on the canvas is clicked, populate the css attributes list
		$('#canvas *').live('resize', function(event, ui){
		
			//TODO: On resize, we have to make sure the attributes box is showing the right element
			
			
			//Need to do this to handle case where during resize mouse moves outside of element being resized
			$('#canvas *').removeClass('outline-element');				
			$(this).addClass('outline-element');
			
			$.fn.cssEditor.changeWidthHeight(ui.size.width, ui.size.height);
		});
		
		
		//Listen to when the user changes a css property, then change the property
		$('.cssInput').live('keyup', function(event){
			var element = $(this);
			var typeMapping = $.fn.cssEditor.commonStyles;
			var styleMapping = null;
			
			if (typeMapping[element.attr('cssValue')] != null) {
				styleMapping = typeMapping[element.attr('cssValue')].styles;
				
				jQuery.each(styleMapping, function(index, value){
					$.fn.cssEditor.selected.css(value, element.val());
				});
			}
		});
		
		//Support for outlining the current element
		
		//Need mouseover event so that outline stays even when mousing over resizing div's on east and south of component
		$('#canvas *').live('mouseover', function(event){
			$('#canvas *').removeClass('outline-element');
			$(this).addClass('outline-element');
		});
		
		$('#canvas *').live('mouseenter', function(event){
			$('#canvas *').removeClass('outline-element');
			$(this).addClass('outline-element');
		});
		
		$('#canvas *').live('mouseout', function(event){
			$(this).removeClass('outline-element');
		});
		
		//Prevent links from opening new windows, so we can safely click on them
		$('a').click(function(event){
			event.preventDefault();
		});
		
		//Prevent forms from opening new windows, so we can safely click on them
		$('form').click(function(event){
			event.preventDefault();
		});
		
		/*$('#canvas .component').live('click', function(event){

		});*/
		
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
	
	$.fn.cssEditor.selected = null;
	
	$.fn.cssEditor.extractCssSelectorPath = function(element){
		if (element.attr('id')){
			return '#' + element.attr('id');
		}
		
		var path = $.fn.cssEditor.extractCssSelectorPath(element.parent());
		
		if (element.attr('class') && element.attr('class') != ' '){ 
			return path + ' .' + element.attr('class');
		}
		
		return path + ' ' + element.get(0).tagName().toLowerCase(); 
	};
	
	$.fn.cssEditor.changeWidthHeight = function(width, height){
		
		//TODO: This doesn't actually modify the value attribute in the html but is it even necessary to update this value?

		$('#attributes-list input[cssvalue="width"]').val(width +'px');
		$('#attributes-list input[cssvalue="height"]').val(height + 'px');

	};
	
	$.fn.cssEditor.defaults = {
		stylesheet : '/stylesheets/cssEditor.css',
		position: 'right'
	};
	
	$.fn.cssEditor.changeSelectValue = function(element){
		var el = $(element);
		var typeMapping = $.fn.cssEditor.commonStyles;
		var styleMapping = null;
		var elementValue = element.options[element.selectedIndex].value;
		
		if (typeMapping[el.attr('cssValue')] != null) {
			styleMapping = typeMapping[el.attr('cssValue')].styles;
			
			jQuery.each(styleMapping, function(index, value){
				$.fn.cssEditor.selected.css(value, elementValue);
			});
		}
	};
	
	
	
	$.fn.cssEditor.widthSelector = {
		type: 'input', styles: ['width']
	};
	$.fn.cssEditor.heightSelector = {
		type: 'input', styles: ['height']
	};
	$.fn.cssEditor.positionSelector = {
		type: 'select', options: ['absolute', 'fixed', 'static', 'relative', 'inherit'],
		styles: ['position']
	};
	$.fn.cssEditor.bkgcolorSelector = {
		type: 'colorpicker', styles: ['backgroundColor'] 
	};
	$.fn.cssEditor.displaySelector = {
		type: 'select', styles: ['display'],
		options: ['none', 'block', 'inline', 'table', 'inherit']
	};
	$.fn.cssEditor.opacitySelector = {
		type: 'input', styles: ['opacity']
	};
	$.fn.cssEditor.radiusSelector = {
		type: 'input', styles: ['-webkit-border-radius', 'border-radius', '-moz-border-radius',
				'-webkit-border-bottom-left-radius', '-moz-border-radius-bottomleft', 'border-bottom-left-radius',
				'-webkit-border-bottom-right-radius', '-moz-border-radius-bottomright', 'border-bottom-right-radius',
				'-webkit-border-top-right-radius', '-moz-border-radius-topright', 'border-top-right-radius',
				'-webkit-border-top-left-radius', '-moz-border-radius-topleft', 'border-top-left-radius']
	};
	$.fn.cssEditor.fontSelector = {
		type: 'input', styles: ['font-family']
	};
	$.fn.cssEditor.txtSizeSelector = {
		type: 'input', styles: ['font-size']
	};
	$.fn.cssEditor.txtWeightSelector = {
		type: 'input', styles: ['font-weight']
	};
	$.fn.cssEditor.txtStyleSelector = {
		type: 'select', styles: ['font-style'], 
		options: ['normal', 'italic', 'oblique', 'inherit']
	};
	$.fn.cssEditor.txtColorSelector = {
		type: 'colorpicker', styles: ['color']
	};
	$.fn.cssEditor.txtSpacingSelector = {
		type: 'input', styles: ['line-height']
	};
	$.fn.cssEditor.txtAlignSelector = {
		type: 'select', styles: ['text-align'], 
		options: ['left', 'right', 'center', 'justify', 'inherit']
	};
	$.fn.cssEditor.txtWrapSelector = {
		type: 'select', styles: ['white-space'], 
		options: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'inherit']
	};
	$.fn.cssEditor.bkgImageSelector = {
		type: 'input', styles: ['background-image']
	};
	$.fn.cssEditor.bkgRepeatSelector = {
		type: 'select', styles: ['background-repeat'],
		options: ['repeat', 'repeat-x', 'repeat-y', 'no-repeat', 'inherit']
	};
	$.fn.cssEditor.bkgPositionSelector = {
		type: 'input', styles: ['background-position'] 
	};
	$.fn.cssEditor.bkgAttachSelector = {
		type: 'select', styles: ['background-attachment'],
		options: ['scroll', 'fixed', 'inherit']
	};
	$.fn.cssEditor.topSelector = {
		type: 'input', styles: ['top']
	};
	$.fn.cssEditor.rightSelector = {
		type: 'input', styles: ['right']
	};
	$.fn.cssEditor.bottomSelector = {
		type: 'input', styles: ['bottom']
	};
	$.fn.cssEditor.leftSelector = {
		type: 'input', styles: ['left']
	};
	$.fn.cssEditor.marginSelector = {
		type: 'input', styles: ['margin-top','margin-right','margin-bottom','margin-left']
	};
	$.fn.cssEditor.paddingSelector = {
		type: 'input', styles: ['padding-top','padding-right','padding-bottom','padding-left']
	};
	$.fn.cssEditor.borderWidthSelector = {
		type: 'input', styles: ['border-top-width','border-right-width','border-bottom-width','border-left-width']
	};
	$.fn.cssEditor.borderColorSelector = {
		type: 'colorpicker', styles: ['border-top-color','border-right-color', 'border-bottom-color','border-left-color']
	};
	$.fn.cssEditor.borderStyleSelector = {
		type: 'select', styles: ['border-top-style','border-right-style','border-bottom-style','border-left-style'],
		options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'inherit']
	};
	$.fn.cssEditor.visibilitySelector = {
		type: 'select', styles: ['visibility'], 
		options: ['vissible', 'hidden', 'collapse', 'inherit']
	};
	$.fn.cssEditor.zIndexSelector = {
		type: 'input', styles: ['z-index']
	};
	$.fn.cssEditor.floatsSelector = {
		type: 'select', styles: ['float'], 
		options: ['left', 'right', 'none', 'inherit']
	};
	
	
	
	$.fn.cssEditor.commonStyles = {
		width: $.fn.cssEditor.widthSelector,
		height: $.fn.cssEditor.heightSelector,
		position: $.fn.cssEditor.positionSelector,
		bkgcolor: $.fn.cssEditor.bkgcolorSelector,
		display: $.fn.cssEditor.displaySelector,
		opacity: $.fn.cssEditor.opacitySelector,
		radius: $.fn.cssEditor.radiusSelector,
		font: $.fn.cssEditor.fontSelector,
		txtSize: $.fn.cssEditor.txtSizeSelector,
		txtWeight: $.fn.cssEditor.txtWeightSelector,
		txtStyle: $.fn.cssEditor.txtStyleSelector,
		txtColor: $.fn.cssEditor.txtColorSelector,
		txtSpacing: $.fn.cssEditor.txtSpacingSelector,
		txtAlign: $.fn.cssEditor.txtAlignSelector,
		txtWrap: $.fn.cssEditor.txtWrapSelector,
		bkgImage: $.fn.cssEditor.bkgImageSelector,
		bkgRepeat: $.fn.cssEditor.bkgRepeatSelector,
		bkgPosition: $.fn.cssEditor.bkgPositionSelector,
		bkgAttach: $.fn.cssEditor.bkgAttachSelector,
		top: $.fn.cssEditor.topSelector,
		right: $.fn.cssEditor.rightSelector,
		bottom: $.fn.cssEditor.bottomSelector,
		left: $.fn.cssEditor.leftSelector,
		margin: $.fn.cssEditor.marginSelector,
		padding: $.fn.cssEditor.paddingSelector,
		borderWidth: $.fn.cssEditor.borderWidthSelector,
		borderColor: $.fn.cssEditor.borderColorSelector,
		borderStyle: $.fn.cssEditor.borderStyleSelector,
		visibility: $.fn.cssEditor.visibilitySelector,
		zIndex: $.fn.cssEditor.zIndexSelector,
		floats : $.fn.cssEditor.floatsSelector
	};
	
}



)(jQuery);

//$(function () { $.fn.cssEditor(); });