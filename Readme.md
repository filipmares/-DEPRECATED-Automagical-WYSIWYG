Automagical aims to create an easy to use WYSIWYG Editor for HTML and CSS that outputs as it's result clean, readable HTML and CSS. It's purpose is to help web designers get a good start on designing a web page and get feedback on it. When the initial design is done, you are left with clean HTML and CSS code to continue with.

Building
================
* jQuery 1.4.2 is included in the lib folder.
* The server side runs on Node.js. You will need to install node and npm. The app uses the following packages and versions:
	connect@1.0.3             High performance middleware framewo
	connect-redis@1.0.0       Redis session store for Connect    
	ejs@0.3.0                 Embedded JavaScript templates     t
	express@2.0.0beta2        Sinatra inspired web development fr
	express-contrib@0.3.4     Express utilities
	express-messages@0.0.1    Express flash notification message 
	hiredis@0.1.8             Wrapper for reply processing code i
	mime@1.2.1                A comprehensive library for mime-ty
	qs@0.0.6                  querystring parser    
	redis@0.5.7               Redis client library    

After installing npm, you should be able to install all of the dependancies with 'npm install'. So to install express do:
	npm install express
	
You will also need to install and run Redis.
	
If you have problems running the app with the above instructions, please open an issue and I'll try to help you as soon as possible.