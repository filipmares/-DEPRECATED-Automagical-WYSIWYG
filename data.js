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
	});
};

exports.getPage = function(user, pageId, callback){
	redis.get(user + ":page:" + pageId, function(err, reply){
		if (err || !reply) callback(undefined);
		
		callback(reply.toString());
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

//Convenience methods
function makeUser(username, password){
	var user = {'username' : username, 'password' : password};
	return user;
};