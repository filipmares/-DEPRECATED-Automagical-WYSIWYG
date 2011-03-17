var automagicalCss = (function(){

	var highlightElement,
		unHighlightElement,
		highlightClickedElement,
		unHighlightClickedElement,
		populateAttributesBox,
		changeWidthHeightAttributesBox,
		extractElementId,
		initializeFileUploadDialog,
		initializeChangeContentDialog,
		initializeFileList,
		submitFile,
		justText,
		stopEvent,
		

		cssInformation = {},
		attrInformation = {},
		fileUploadDialog,
		changeContentDialog;
	
	stopEvent = function(event) {
				event.preventDefault();
			    event.stopPropagation();
			    if ($.browser.msie) {
			        event.originalEvent.keyCode = 0;
			        event.originalEvent.cancelBubble = true;
			        event.originalEvent.returnValue = false;
			    }
	};	
	
	justText = function(element) {
	 
	    return $(element)  .clone()
	            .children()
	            .remove()
	            .end()
	            .text();
	 
	};
	
	initializeChangeContentDialog = function() {
		changeContentDialog = $('<div></div>')
			.html(	' <label> Enter new content here: </label> </br>' +
					' <textarea id="newContent" ROWS=3 COLS=30 > </textarea></br>'
    				)
			.dialog({
				autoOpen: false,
				title: 'Change Content',
				modal: true,
				open: function(event, ui) {
					$('textarea#newContent').text('');
				
				},
				resizable: false,
				buttons: {
        			'Change': function(){
        				var el = $('#canvas .component.outline-element-clicked');
        				
						if (el.size() > 0) {
								$(el)
		  							.contents()
		  							.filter(function() {
		    							return this.nodeType == 3; //Node.TEXT_NODE
		  							}).replaceWith($('#newContent').val());
		  					

		  				}

						changeContentDialog.dialog('close');
        				
            			
        			},
        			'Cancel': function(){
            			changeContentDialog.dialog('close');
        			},

    			}
				
			});
	}
			
	initializeFileUploadDialog = function() {
		fileUploadDialog = $('<div></div>')
			.html('	<form action="/img" id="frmsample" name="frmSample" enctype="multipart/form-data" method="post">'+
					'Upload A File</br>'+
    				'<input size="-4" type="file" name="upload" multiple="multiple" class="multi" accept="gif|jpg"/><br>'+
    				'<input size="-4" type="submit" value="Upload">'+
    				'</form><br/>' +
    				'Choose From Uploaded Files'+
    				'<ul id="selectableUploads" size="-6" style="background-color:white; border: 1px solid black; list-style-type: none; float:left;">' +
					'</ul>'
    				)
			.dialog({
				autoOpen: false,
				title: 'File Upload',
				open: function(event, ui) {
					initializeFileList();
				
				},
				resizable: false,
				buttons: {
        			'Submit': function(){
        				submitFile();
        				
            			
        			},
        			'Cancel': function(){
        				$('.fileUploadInput').removeClass('fileUploading');
            			fileUploadDialog.dialog('close');
        			},

    			}
				
			});
		$('#selectableUploads').selectable();
	};
	
	submitFile = function() {


				fileUploadDialog.dialog('close');
				var selected = $('#selectableUploads .ui-selected').html();
				
				$.ajax({  
  					type: "GET",  
  					url: "/img/"+selected,
  					success: function(data) {  

						
						//console.log(data);
						//data = '\"/'+ data + '\"';
						
						var selected = $('.component.outline-element-clicked');
						
						if ($('.fileUploading').attr('cssValue')) {
				
							var property = $('.fileUploading').attr('cssValue');
						
							//checks to see if selector based on ID present in css
							if (cssInformation['#'+selected.attr('id')][property] != null) {
				
								selected.css(property, data);
								automagicalCss.writeCssSelector('#'+selected.attr('id'),property,data);
								automagicalCss.updatePageCss();
							}
							else {
								//TODO: What to do if class or element selector
							}
						}
						else if ($('.fileUploading').attr('attrValue')){
							var attrib = $('.fileUploading').attr('attrValue');
				
							//checks to see if selector based on ID present in css
							if (attrInformation['#'+selected.attr('id')][attrib] != null) {
							
								if ((selected).attr(attrib) != undefined) { 
									(selected).attr(attrib, data);
								}
								automagicalCss.writeAttrSelector('#'+selected.attr('id'),attrib,data);
							}
							else {
								//TODO: What to do if class or element selector
							}
						
						}
							
						$('.fileUploading').val(data);	
						$('.fileUploadInput').removeClass('fileUploading');
							}
		    		}); 
				


		
	};
	
	initializeFileList = function() {
		$.ajax({  
  			type: "GET",  
  			url: "/imglist/",
  			success: function(data) {  
				var files = data.split(",");
				$('#selectableUploads').empty();
				
				for (file in files) {

					$('#selectableUploads').append('<li>'+ files[file] + '</li>');
				}
				
				
				
			}
    		});  
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
		var idSelector = '#'+selected.attr('id');
		var selector_field = $('#attributes-selector-input');
		var attributes_list = $('#attributes-list');

		
		selector_field.val(extractElementId(selected));
		
		//See if css based on element id is present
		if (('#'+selected.attr('id')) in cssInformation){
			
			attributes_list.empty();
			

			
			for (value in cssInformation[idSelector]){
				
				if (value == "background-color" || value == 'color' || value == 'border-top-color' || value == 'border-bottom-color' || value == 'border-left-color' || value == 'border-right-color') {
					attributes_list.append('<label>' + value + '</label> <input class="color colorPicker" value="' + selected.css(value) + '"cssValue="' + value + '" /> <br/>');
											jscolor.init();
				}

				else if (value == 'background-image') {
				
				
					attributes_list.append('<label>' + value + '</label> <input class="fileUploadInput" type="text" value="' + selected.css(value) + '" readonly="readonly" cssValue="' + value + '" /><br/>');
				
				
				
				
				}
				else {
					attributes_list.append('<label>' + value + '</label> <input class="cssInput" type="text" value="' + 
										selected.css(value) + '" cssValue="' + value + '" /> <br/>');
				}
			}
			
			for (value in attrInformation[idSelector]){
				
				var attrValue = "";
				if (!selected.attr(value)) {
					attrValue = "none";
				}	
				else {
					attrValue = selected.attr(value);
				}
				
				if (value == 'src') {
					

				
					attributes_list.append('<label>' + value + '</label> <input class="fileUploadInput" type="text" value="' + attrValue + '" readonly="readonly" attrValue="' + value + '" /> <br/>');
				
				
				
				
				}
				else {
					attributes_list.append('<label>' + value + '</label> <input class="attrInput" type="text" value="' + 
										attrValue + '" attrValue="' + value + '" /><br/>');
				}
			}
			
			
			
		}
		else {
			//TODO: Handle this case
		}
		


		//Highlight clicked element
		unHighlightClickedElement('#canvas *');
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
			$('#canvas .component').live('click', function(event){
					populateAttributesBox(this);
					stopEvent(event);
					return false;
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
				var selected = $('.component.outline-element-clicked');
				
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
				var selected = $('.component.outline-element-clicked');
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
			
			//Listen to when the user changes a css color property, then change the property
			$('.colorPicker').live('change', function(event){
				var selected = $('.outline-element-clicked');
				var property = $(this).attr('cssValue');
	
				//checks to see if selector based on ID present in css
				if (cssInformation['#'+selected.attr('id')][property] != null) {
	
					selected.css(property, $(this).css('background-color'));
					automagicalCss.writeCssSelector('#'+selected.attr('id'),property,$(this).css('background-color'));
					automagicalCss.updatePageCss();
				}
				else {
					//TODO: What to do if class or element selector
				}
					
	
			});
			
			//Listen to when the user changes a attribute, then change the attribute value
			$('.attrInput').live('change', function(event){
				var selected = $('.component.outline-element-clicked');
				var attrib = $(this).attr('attrValue');
	
				//checks to see if selector based on ID present in css
				if (attrInformation['#'+selected.attr('id')][attrib] != null) {
				
					if ((selected).attr(attrib) != undefined) { 
						(selected).attr(attrib, $(this).val());
					}
					automagicalCss.writeAttrSelector('#'+selected.attr('id'),attrib,$(this).val());
				}
				else {
					//TODO: What to do if class or element selector
				}
			

	
			});
			
			//Support for outlining the current element
			
			//Need mouseover event so that outline stays even when mousing over resizing div's on east and south of component
			$('#canvas .component').live('mouseover', function(event){
				highlightElement(this);
				stopEvent(event);
				return false;
			});
			
			//Show/hide the outline when we hover over an element. We could probably use hover() for this
			$('#canvas .component').live('mouseenter', function(event){
				highlightElement(this);
				stopEvent(event);
				return false;
			});
			
			$('#canvas .component').live('mouseout', function(event){
				unHighlightElement(this);
				stopEvent(event);
				return false;
			});
			
			//Need event for when the label is clicked for a file upload
			$('.fileUploadInput').live('click', function(event){
				$(this).addClass('fileUploading');
				fileUploadDialog.dialog('open');
				

			});
			
				
			$('#frmsample').live('submit', function(event) {
			  
				
			    $(this).ajaxSubmit(function() {
			    	//fileUploadDialog.dialog('close');	
			    	initializeFileList();	
			    
			    }); 
		
			  return false
  			});
	
	
			initializeFileUploadDialog();
			initializeChangeContentDialog();

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
		
		writeAttrSelector : function(selector, attr, value){
			
			if (!(selector in attrInformation)){
				var properties = {};
				
				properties[attr] = value;
				attrInformation[selector] = properties;
				
			}
			else {
				attrInformation[selector][attr] = value;
			}
			

	
	
	
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
			
							
	
		},
		
		changeCurrentElementContent : function(){
		
			changeContentDialog.dialog('open');
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
