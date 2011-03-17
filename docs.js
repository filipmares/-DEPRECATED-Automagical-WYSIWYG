//A document fetcher + parser. Uses JSDOM to build the page on the server side.
//This allows us to do things like build the structure of the webpage on the serverside
//The 'rendered' elements can then be scraped, full with their css.

var jsdom = require("jsdom");

exports.loadDocument = function(url, callback){
	jsdom.env(url, ["http://code.jquery.com/jquery-1.5.min.js"],
		function(errors, window){
			if (errors){
				console.log('there was an error fetching the page');
				return callback("error");
			}
			
			//Change relative image paths to absolute image paths
			window.$('img').each(function(index, element){
				var absSource = getAbsolutePath(url, window.$(element).get(0).src);
				window.$(element).attr('src', absSource);
			});			
			//console.log(window.document.getElementsByTagName('img')[0].src);
			
			//String all <a> of links so we can click on buttons etc.. w/o being redirected
			window.$('a').each(function(index, element){
				window.$(element).attr('href', "");
			});
			
			//Change relative stylesheet paths to absolute stylesheet paths
			var stylesheets = "";
			window.$('link').each(function(index, element){
				var el = window.$(element);
				if (el.attr('type') === "text/css"){
					var absStyleSource = getAbsolutePath(url, el.attr('href'));
					stylesheets += '<link href="' + absStyleSource + '" type="text/css" rel="stylesheet"/>';
				}
			});
			stylesheets += "\n";
			
			//Get all styles for every element and save them to a global <style> tag string
			var style = "<style>\n";
			//window.$('body').find('*').each(function(index, element){
			//	style += getCssStyle(window.$(element));
			//});
			style += "</style>\n";
			
			//Get all html for every element and save it to an html string
			var html = "";
			window.$('script').remove();
			html = window.$('body').html();
			//window.$('body').children().each(function(index, element){
			//	html = recursiveHTMLAppendFunction(window, html, window.$(element));
				//console.log(window.$(element).html() + "\n");
			//});
			
			var all = "<html><head>" + stylesheets + style + "</head><body>" + html + "</body></html>";
			
			callback(null, all, html, stylesheets);
		}
	);
};

/* This function recursively iterates through all of an element's children to produce it's html */
recursiveHTMLAppendFunction = function(win, canvasHTML, element) {	
	var attributes = "";
	
	var target = win.$(element).get(0);
	win.$.each(win.$(target.attributes), function(index) {

		attributes += target.attributes[index].name + "=\"" + target.attributes[index].value+ "\" ";

	});
	
	//TODO: This doesn't take into acount any other attributes other than 'style', this needs to be changed
	canvasHTML += "<"+ element.get(0).tagName + " "+ attributes +">\n" + element.clone().find("*").remove().end().text();
	
	//Go through all of the children of this element
      if (element.children().size() > 0) {
          element.children().each( function() {
              canvasHTML += recursiveHTMLAppendFunction(win, "", win.$(this));
          });
      }
      
     	canvasHTML += "</"+ element.get(0).tagName + ">\n";
     	
     	return canvasHTML; 
};

getCssStyle = function(element) {
	var attr = ['font-family','font-size','font-weight','font-style','color',
        'text-transform','text-decoration','letter-spacing','word-spacing',
        'line-height','text-align','vertical-align','direction','background-color',
        'background-image','background-repeat','background-position',
        'background-attachment','opacity','width','height','top','right','bottom',
        'left','margin-top','margin-right','margin-bottom','margin-left',
        'padding-top','padding-right','padding-bottom','padding-left',
        'border-top-width','border-right-width','border-bottom-width',
        'border-left-width','border-top-color','border-right-color',
        'border-bottom-color','border-left-color','border-top-style',
        'border-right-style','border-bottom-style','border-left-style','position',
        'display','visibility','z-index','overflow-x','overflow-y','white-space',
        'clip','float','clear','cursor','list-style-image','list-style-position',
        'list-style-type','marker-offset'];
    
		var len = attr.length; 
		var	style = "#" + element.attr('id') + "{\n";
				
    for (var i = 0; i < len; i++){
			var attributeName = attr[i];
			var attributeValue = element.css(attributeName);
			if (attributeValue){
				//style += attributeName + ":" + element.css(attributeName) + ";\n";
				style += attributeName + ":" + element.attr(attributeName) + ";\n";
			}
			//obj[attr[i]] = jQuery.fn.css2.call(this, attr[i]);
		}
		
		style += "}\n";
    return style;
};

getAbsolutePath = function(pageUrl, imageRelativePath){
	if (imageRelativePath.indexOf("http://") === 0) return imageRelativePath;
	
	var rootUrl = pageUrl.substr(7);
	if (imageRelativePath.charAt(0) === "/"){
		rootUrl = rootUrl.split("/")[0];
	} else if(imageRelativePath.substr(0,2) === "./"){
		rootUrl = rootUrl.split("/")[0];
	} else{
		var index = rootUrl.lastIndexOf("/");
		rootUrl = rootUrl.slice(0, index + 1);
	}
	console.log(rootUrl + imageRelativePath);
	return "http://" + rootUrl + imageRelativePath;
};