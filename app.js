
// Expose modules in ./support for demo purposes
require.paths.unshift(__dirname + '/../../support');

/**
 * Module dependencies.
 */
var express = require(__dirname + '/lib/express/express')
	, crypto = require('crypto')
	, ejs = require('ejs')
	, data = require(__dirname + '/data.js');

// Path to our public directory

var pub = __dirname + '/public';

// Auto-compile sass to css with "compiler"
// and then serve with connect's staticProvider

var app = express.createServer(
  express.staticProvider(pub)
);

// Optional since express defaults to CWD/views
app.set('views', __dirname + '/views');
// Set our default template engine to "ejs"
app.set('view engine', 'html');
app.register('.html', require('ejs'));

app.use(express.bodyDecoder());
app.use(express.cookieDecoder());
app.use(express.session({secret: 'secret salt yay!'}));

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

// Dummy users
var users = {
	denis: {
		name: 'Denis Zgonjanin' ,
		userid: 'denis',
		pass: 'hello'
	},
	raj: {
		name: 'Rajkumar Parameswaran',
		userid: 'raj',
		pass: 'hello'
	},
	brian: {
		name: "Brian O'Connor",
		userid: 'brian',
		pass: 'hello'
	}
};

app.get('/', function(req, res){
  res.redirect('/login');
});

app.get('/login', function(req, res){
	if (req.session.user) {
		req.session.success = 'Authenticated as ' + 
													'<a href=/user/' + req.session.user.userid + 
													'>' + req.session.user.name + '</a>';
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
				res.redirect('/user/' + req.body.username)
			});
		} else {
			req.session.error = err;
			res.redirect('back');
		}
	});
});

app.get('/user/:username', function(req, res){
	if (req.session.user){
		if (req.session.user.userid == req.params.username){
			res.render('user', {user: req.session.user});
		} else {
			res.redirect('/logout');
		}
	}
});

app.get('/logout', function(req,res){
	//destroy the session
	req.session.destroy(function(){
		res.redirect('/login');
	});
});

app.get('/newpage', function(req,res){
	if (req.session.user){
		res.render('client')
	} else {
		res.redirect('/logout');
	}
});

app.post('/savepage', function(req,res){
	if (req.session.user){
		console.log('got post request for save page');
	} else {
		res.redirect('/logout');
	}
});

app.listen(3000);
console.log('Express app started on port 3000');

//Helper functions bellow
function authenticate(name, pass, fn){
	var user = users[name];
	//query db for user existance
	if (!user) return fn(new Error('cannot find user'))
	//Check the password
	if (user.pass == pass) return fn(null, user);
	//otherwise throw error, password is invalid
	fn(new Error('invalid password'));
};