var automagicalUI = (function(){

	var initializeAttributesBox,
		hideMenuDisplayControlElements,
		initializeMenuDisplayControl;

	initializeAttributesBox = function() {
		
		//Animate (show/hide) the attributes box when the user clicks the handle ('>>') component
		$('#showHide').click(function(){
			automagicalUI.hideShowAttributesBox();
		});
	
	};

	
	
	hideMenuDisplayControlElements = function () {
		$("#navContainer").hide();
		$("#menuToolbox").hide();
	};
	
	initializeMenuDisplayControl = function() {
		//TODO: Find a way to bind and unbind hover properly
		$.fn.bindHover = function(e){
			$(this).bind({
				mouseover: function(){
			    	$(this).css('opacity', '1.0');
			  },
			  	mouseout: function(){
			  		$(this).css('opacity', '0.4');
			  }
			});
		};

		$.fn.unbindHover = function (){
			$(this).unbind('mouseover');
			$(this).unbind('mouseout');
		};
	
		
		$("#menuDisplayControl").bindHover();
		
		
		$("#menuDisplayControl").click(function(){
			
			if($("#navContainer").is(":visible")){
				$("#navContainer").slideUp("fast");
				$("#lblDropDown").text("Show Menu");							
				$("#lblDropDown").css('color', '#292929');	

				$(this).bindHover();
			}else{
				$("#navContainer").slideDown("fast");
				$("#lblDropDown").text("Hide Menu");
				$("#lblDropDown").css('color', '#ee4411');

				$(this).unbindHover();
			}
			
		});
	
	};
	
	return {
	
		initializeUI : function(){
			
			hideMenuDisplayControlElements();
			initializeMenuDisplayControl();
			
			initializeAttributesBox();
		},
		
		hideShowMenuBarItem : function(element){
			
	
			
			//If this menu item is active then remove active class and hide Toolbox Bar.
			if (element.hasClass('active'))
			{
				$(".active").removeClass("active");
				$("nav#menuToolbox").slideUp();
			}
			else
			{
			//Else if any MenuBar item is active, remove active class and hide menu.
			//Make item clicked active and slide menuToolbox Bar.
				if ($("nav#menuToolbox").is(":visible"))
				{
					$("nav#menuToolbox").hide();
				}
				$("nav#menuToolbox").slideDown("fast");
				$(".active").removeClass("active");
				$(element).addClass("active");
			}
		},
		
		hideShowAttributesBox : function() {
				
				
				//Here we are animating the components marginLeft property to achieve the desired effect
				if ($('#marginDiv').is(":visible")){
				
					$('#marginDiv').animate({width: 'hide', 'opacity':'toggle'});
					$('#showHide').animate({marginLeft: $('#attributes-list').outerWidth()});
					$('#showHideLabel').text("<< ");
				} else{
				
					$('#marginDiv').animate({width: 'show', 'opacity':'toggle'});
					$('#showHide').animate({marginLeft: 0});
					$('#showHideLabel').text(">> ");
				}
		},
		
		showAttributesBox : function() {
	
				
				//Show the attributes box if it already isn't shown
				if (!($('#marginDiv').is(":visible"))){
					$('#marginDiv').animate({width: 'show', 'opacity':'toggle'});
					$('#showHide').animate({marginLeft: 0});
					$('#showHideLabel').text(">> ");
				}  
	
		}
	};
	


		
})();
