//Redis connection stuff

var redisNode = require('redis'),
		redis = redisNode.createClient();
		
redis.on('error', function(err){
	console.log('Error on data layer ' + err);
});

//Data Model
//user 					== userid
//user:password == password
//user:numPages == numPagesUserHas
//user:page:#num== retrievePageDefinedBy#Num

exports.savePage = function(user, page){
	var pageIndex = redis.get(user + ":numPages") + 1;
	redis.set(user + ":page:" + pageIndex, page);
};

exports.getPage = function(user, pageId){
	return redis.get(user + ":page:" + pageId);
};

exports.addUser = function(userid, password){
	redis.set(userid, userid);
	redis.set(userid + ":password" = password);
};

exports.getUser = function(userid){
	if (redis.exists(userid) == 0) return null;
	else return redis.get(userid);
};

exports.getPassword = function(userid){
	return redis.get(userid + ":password");
};