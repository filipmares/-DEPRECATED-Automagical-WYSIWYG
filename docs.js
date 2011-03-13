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
			
			var html = "";
			window.$('script').remove();
			window.$('body').children().each(function(index, element){
				html+= window.$(element).html() + "\n";
				console.log(window.$(element).html() + "\n");
			});
			
			callback(null, html);
		}
	);
};