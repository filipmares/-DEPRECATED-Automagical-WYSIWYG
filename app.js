
// Expose modules in ./support for demo purposes
require.paths.unshift(__dirname + '/../../support');

/**
 * Module dependencies.
 */
var express = require('express')
	, crypto = require('crypto')
	, ejs = require('ejs')
	, data = require(__dirname + '/data');

var app = module.exports = express.createServer();

// Optional since express defaults to CWD/views
app.set('views', __dirname + '/views');
// Set our default template engine to "ejs"
app.set('view engine', 'html');
app.register('.html', require('ejs'));
//Public directory
var pub = __dirname + '/public';
app.use(express.static(pub));

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'secret salt yay!'}));
app.use('/', express.errorHandler({dump:true, stack:true}));

app.dynamicHelpers({
	messages: require('express-messages')
});

app.dynamicHelpers({
	message: function(req){
		var err = req.session.error
			,	msg = req.session.success;
			delete req.session.error;
			delete req.session.success;
			if (err) return err;
			if (msg) return msg;
	}
});

app.get('/', function(req, res){
  res.render('home');
});

app.get('/login', function(req, res){
	if (req.session.user) {
		req.session.success = 'Welcome, ' + 
													'<a href=/user/' + req.session.user.username + 
													'>' + req.session.user.username + '</a>';
	} else {
		req.session.success = 'Please login:';
	}
	res.render('login');
});

app.post('/login', function(req,res){
	console.log('username:' + req.body.username + ' password:' + req.body.password);
	authenticate(req.body.username, req.body.password, function(err, user){
		if (user){
			req.session.regenerate(function(){
				req.session.user = user;
				//res.render('user', {user: user});
				res.redirect('/user/' + req.body.username);
			});
		} else {
			req.session.error = err.message;
			res.redirect('back');
		}
	});
});

app.get('/user/:username', function(req, res){
	if (req.session.user){
		if (req.session.user.username == req.params.username){
			data.getPageList(req.session.user, function(err, userPages){
				if (err) {
					console.log("Grave error when getting page list!")
					return;
				}
				res.render('user', {user: req.session.user, pages: userPages});
			});
		} else {
			res.redirect('/logout');
		}
	}
});

app.get('/user/:username/:pageNum.html', function(req,res){
	data.getPage(req.params.username, req.params.pageNum, function(err, reply){
		if (err){
			console.log("page could not be found: " + req.params.username + "/" + req.params.pageNum);
			res.render('404');
			//do a 404
		} else{
			res.render('page', {data: reply, layout: false});
		}
	});
});

app.get('/logout', function(req,res){
	//destroy the session
	req.session.destroy(function(){
		res.redirect('/login');
	});
});

app.get('/newpage', function(req,res){
	if (req.session.user){
		res.render('client', {layout: false});
	} else {
		res.redirect('/logout');
	}
});

app.post('/savepage', function(req,res){
	if (req.session.user){
		data.savePage(req.session.user.username, req.body.data);
	} else {
		res.redirect('/logout');
	}
});

app.get('/register', function(req,res){
	if (req.session.user){
		req.session.destroy();
		res.redirect('/logout');
	} else{
		res.render('register');
	}
});

app.post('/register', function(req,res){
	register(req.body.username, req.body.password, function(err, user){
		if (user){
			req.session.regenerate(function(){
				req.session.user = user;
				//res.render('user', {user: user});
				res.redirect('/user/' + user.username);
			});
		} else{
			req.flash('error', err.message);
			res.redirect('back');
		}
	});
});

app.get('/img/:imagename', function(req,res){
	
});

app.post('/img', function(req,res){
	data.saveImage(req.body.imagename, req.body.data);
});

app.listen(3000);
console.log('Express app started on port 3000');

//Helper functions bellow
function authenticate(username, pass, fn){
	data.getUser(username, function(user){
		//user exists?
		if (!user) return fn(new Error('Invalid username'));
		//Check the password
		if (user.password == pass) return fn(null, user);
		//otherwise throw error, password is invalid
		fn(new Error('Invalid password'));
	});
};

function register(username, pass, fn){
	//Try to authenticate with credential to see if user exists
	authenticate(username, pass, function(err, user){
		if (user || (err.message === 'Invalid password')){
			return fn(new Error('Username is already taken'));
		}
		var newUser = data.addUser(username, pass);
		fn(null, newUser);
	});
};