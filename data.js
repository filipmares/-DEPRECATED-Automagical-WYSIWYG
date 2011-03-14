//Redis connection stuff

var redisNode = require('redis'),
		redis = redisNode.createClient();
		
redis.on('error', function(err){
	console.log('Error on data layer ' + err);
});


//Data Model
//user 						== the user's password
//user:numPages 	== num Pages User Has
//user:page:#num	== retrieve Page Defined By #Num

exports.savePage = function(user, page){
	redis.get(user + ":numPages", function(err, reply){
		if (err || (reply === null)) return;

		var pageIndex = parseInt(reply.toString());
		redis.set(user + ":page:" + pageIndex, page);
		redis.incr(user + ":numPages");
	});
};

exports.getPage = function(user, pageNum, callback){
	redis.get(user + ":page:" + pageNum, function(err, reply){
		if (err || !reply) {
			return callback(new Error("Could not retrieve page"));
		}
		
		callback(null, reply.toString());
	});
};

exports.addUser = function(username, password){
	redis.set(username, password);
	redis.set(username + ":numPages", 0)
	return makeUser(username, password);
};

exports.getUser = function(userid, callback){
	redis.get(userid, function(err, reply){
		if (err || !reply) return callback(undefined);
		
		var user = makeUser(userid, reply.toString());
		callback(user);
	});
};

exports.saveImage = function(imageName, imageData){
	redis.set(imageName, imageData);
};

exports.getImage = function(imageName, callback){
	redis.get(imageName, function(err, reply){
		if (err || !reply) return callback(undefined);
		
		var image = reply.toString();
		callback(image);
	});
};

exports.getPageList = function(user, callback){
	redis.get(user.username + ":numPages", function(err, reply){
		if (err) return callback(err);
		
		var numPages = parseInt(reply.toString());
		var pages = makePages(user, numPages);
		callback(null, pages);
	})
};

//Convenience methods
function makeUser(username, password){
	var user = {'username' : username, 'password' : password};
	return user;
};

function makePages(user, numPages){
	var pages = [];
	for (var i = 0; i<numPages; i++){
		var pageUrl = '<a href="/user/' + user.username + '/' + i + '.html">Page' + i + '</a>';
		pages.push({url : pageUrl});
	}
	return pages;
};