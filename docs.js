//A document fetcher + parser. Uses JSDOM to build the page on the server side.
//This allows us to do things like build the structure of the webpage on the serverside
//The 'rendered' elements can then be scraped, full with their css.

var jsdom = require("jsdom"),
		request = require('request'),
		sys = require('sys');

exports.loadDocument = function(url, callback){
	jsdom.env(url, ["https://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.js"],
		function(errors, window){
			if (errors){
				console.log('there was an error fetching the page');
				return;
			}
			
			
		}
	);
};