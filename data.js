//Redis connection stuff

var redisNode = require('redis'),
		redis = redisNode.createClient();
		
redis.on('error', function(err){
	console.log('Error on data layer ' + err);
});

//Data Model
//user 						== user Name
//user:password 	== password
//user:numPages 	== num Pages User Has
//user:page:#num	== retrieve Page Defined By #Num

exports.savePage = function(user, page){
	var pageIndex = redis.get(user + ":numPages") + 1;
	redis.set(user + ":page:" + pageIndex, page);
};

exports.getPage = function(user, pageId){
	return redis.get(user + ":page:" + pageId);
};

exports.addUser = function(userid, password){
	redis.set(userid, userid);
	redis.set(userid + ":password",  password);
};

exports.getUser = function(userid){
	if (!redis.exists(userid)) return undefined;

	var user = {'username' : redis.get(userid)};
	return user;
};

exports.getPassword = function(userid){
	return redis.get(userid + ":password");
};