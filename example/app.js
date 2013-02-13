
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , ltsvlogger = require('../index.js')
  , http = require('http')
  , fs = require('fs')
  , path = require('path');


// select tokens
var ltsv = [];
ltsv.push("time");
ltsv.push("host");
ltsv.push("X-Forwarded-For");
ltsv.push("user");
ltsv.push("ident");
ltsv.push("req");
ltsv.push("method");
ltsv.push("uri");
ltsv.push("protocol");
ltsv.push("status");
ltsv.push("size");
ltsv.push("reqsize");
ltsv.push("referer");
ltsv.push("ua");
ltsv.push("vhost");
ltsv.push("reqtime");
ltsv.push("X-Cache");
ltsv.push("X-Runtime");
ltsv.push("hoge");    //will be ignored

var out = fs.createWriteStream("./example/log/access.log",{flags: 'a+'});

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(ltsvlogger({format:ltsv,stream:out}));
  // app.use(ltsvlogger());                 //use default format
  // app.use(ltsvlogger("default"));        //use default format
  // app.use(ltsvlogger("tiny"));           //use tiny format
  // app.use(ltsvlogger("short"));          //use short format
  // app.use(ltsvlogger({format:"short"})); //use short format
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
