(function($){
	$.fn.cssMain = function(){
		var params = $.getUrlVars();
		if (params.length <= 1) return;
		var page = params['user'] + '/' + params['page'];
		
		$.fn.cssMain.loadExternalPage(page);
	};
	
	$.fn.cssMain.loadExternalPage = function(page){
		console.log('fetching page ' + page);
		var pageUrl = '/processed/' + page;
		$.get(pageUrl, function(data){
			var html = data.canvas.toString();
			var css = data.style.toString();
			
			//console.log(html);
			//console.log(css);

			$('head').append(css);
			$('#canvas').append(html);
			
			$.fn.cssEditor();
		});
	};
	
})(jQuery);

$(function () { $.fn.cssMain(); });