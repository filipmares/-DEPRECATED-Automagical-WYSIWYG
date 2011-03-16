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
		var selected = null;
		
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
			selected = $(this);
			var marginDiv = $('#marginDiv');
			var label = $('#showHideLabel');
			
			selector_field.val($.fn.cssEditor.extractCssSelectorPath(selected));
			attributes_list.empty();
			
			var typeMapping = $.fn.cssEditor.commonStyles;
			
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
			if (typeMapping[element.attr('cssValue')] != null) styleMapping = typeMapping[element.attr('cssValue')];
			jQuery.each(styleMapping, function(index, value){
				selected.css(value, element.val());
			});
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
	
	$.fn.cssEditor.commonStyles = {
		width: widthSelector,
		height: heightSelector,
		position: positionSelector,
		bkgcolor: bkgcolorSelector,
		display: displaySelector,
		opacity: opacitySelector,
		radius: radiusSelector,
		font: fontSelector,
		txtSize: txtSizeSelector,
		txtWeight: txtWeightSelector,
		txtStyle: fontStyleSelector,
		txtColor: txtColorSelector,
		txtSpacing: txtSpacingSelector,
		txtAlign: txtAlignSelector,
		txtWrap: txtWrapSelector,
		bkgImage: bkgImageSelector,
		bkgRepeat: bkgRepeatSelector,
		bkgPosition: bkgPositionSelector,
		bkgAttach: bkgAttachSelector,
		top: topSelector,
		right: rightSelector,
		bottom: bottomSelector,
		left: leftSelector,
		margin: marginSelector,
		padding: paddingSelector,
		borderWidth: borderWidthSelector,
		borderColor: borderColorSelector,
		borderStyle: borderStyleSelector,
		visibility: visibilitySelector,
		zIndex: zIndexSelector,
		floats : floatsSelector
	};
	
	var widthSelector = {
		type: 'input', styles: ['width']
	};
	var heightSelector = {
		type: 'input', styles: ['height']
	};
	var positionSelector = {
		type: 'select', options: ['absolute', 'fixed', 'static', 'relative', 'inherit'],
		styles: ['position']
	};
	var bkgcolorSelector = {
		type: 'colorpicker', styles: ['backgroundColor'] 
	};
	var displaySelector = {
		type: 'select', styles: ['display'],
		options: ['none', 'block', 'inline', 'table', 'inherit']
	};
	var opacitySelector = {
		type: 'input', styles: ['opacity']
	};
	var radiusSelector = {
		type: 'input', styles: ['-webkit-border-radius', 'border-radius', '-moz-border-radius',
				'-webkit-border-bottom-left-radius', '-moz-border-radius-bottomleft', 'border-bottom-left-radius',
				'-webkit-border-bottom-right-radius', '-moz-border-radius-bottomright', 'border-bottom-right-radius',
				'-webkit-border-top-right-radius', '-moz-border-radius-topright', 'border-top-right-radius',
				'-webkit-border-top-left-radius', '-moz-border-radius-topleft', 'border-top-left-radius']
	};
	var fontSelector = {
		type: 'input', styles: ['font-family']
	};
	var txtSizeSelector = {
		type: 'input', styles: ['font-size']
	};
	var txtWeightSelector = {
		type: 'input', styles: ['font-weight']
	};
	var txtStyleSelector = {
		type: 'select', styles: ['font-style'], 
		options: ['normal', 'italic', 'oblique', 'inherit']
	};
	var txtColorSelector = {
		type: 'colorpicker', styles: ['color']
	};
	var txtSpacingSelector = {
		type: 'input', styles: ['line-height']
	};
	var txtAlignSelector = {
		type: 'select', styles: ['text-align'], 
		options: ['left', 'right', 'center', 'justify', 'inherit']
	};
	var txtWrapSelector = {
		type: 'select', styles: ['white-space'], 
		options: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'inherit']
	};
	var bkgImageSelector = {
		type: 'input', styles: ['background-image']
	};
	var bkgRepeatSelector = {
		type: 'select', styles: ['background-repeat'],
		options: ['repeat', 'repeat-x', 'repeat-y', 'no-repeat', 'inherit']
	};
	var bkgPositionSelector = {
		type: 'input', styles: ['background-position'] 
	};
	var bkgAttachSelector = {
		type: 'select', styles: ['background-attachment'],
		options: ['scroll', 'fixed', 'inherit']
	};
	var topSelector = {
		type: 'input', styles: ['top']
	};
	var rightSelector = {
		type: 'input', styles: ['right']
	};
	var bottomSelector = {
		type: 'input', styles: ['bottom']
	};
	var leftSelector = {
		type: 'input', styles: ['left']
	};
	var marginSelector = {
		type: 'input', styles: ['margin-top','margin-right','margin-bottom','margin-left']
	};
	var paddingSelector = {
		type: 'input', styles: ['padding-top','padding-right','padding-bottom','padding-left']
	};
	var borderWidthSelector = {
		type: 'input', styles: ['border-top-width','border-right-width','border-bottom-width','border-left-width']
	};
	var borderColorSelector = {
		type: 'colorpicker', styles: ['border-top-color','border-right-color', 'border-bottom-color','border-left-color']
	};
	var borderStyleSelector = {
		type: 'select', styles: ['border-top-style','border-right-style','border-bottom-style','border-left-style'],
		options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'inherit']
	};
	var visibilitySelector = {
		type: 'select', styles: ['visibility'], 
		options: ['vissible', 'hidden', 'collapse', 'inherit']
	};
	var zIndexSelector = {
		type: 'input', styles: ['z-index']
	};
	var floatsSelector = {
		type: 'select', styles: ['float'], 
		options: ['left', 'right', 'none', 'inherit']
	};
	
}



)(jQuery);

//$(function () { $.fn.cssEditor(); });