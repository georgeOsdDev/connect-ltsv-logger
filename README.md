## introduction

[LTSV](http://ltsv.org/) format logger for (connect|express).

This is just a wrapper of [connect.middleware.logger](http://www.senchalabs.org/connect/logger.html).

## Usage

```js
var express = require("express"),
    ltsvlogger = require('connect-ltsv-logger');

// define output WriteStream
var out = fs.createWriteStream("ltsv-access.log",{flags: 'a+'}),

// define tokens
var ltsv = [];
ltsv.push("time");
ltsv.push("host");
ltsv.push("X-Forwarded-For");
ltsv.push("req");
ltsv.push("status");
ltsv.push("size");
ltsv.push("referer");
ltsv.push("ua");
ltsv.push("vhost");
ltsv.push("reqtime");
ltsv.push("X-Cache");
ltsv.push("X-Runtime");

var app = express();
app.configure(function(){
	// app.set(/*snip*/)
	// ...

	app.use(ltsvlogger({format:ltsv,stream:out}));

	// app.use(/*snip*/)
	// ...
});

```

```bash
tail -f ltsv-access.log
time:[13/Feb/2013:19:15:44 +09:00]<TAB>host:127.0.0.1<TAB>X-Forwarded-For:-<TAB>req:GET /stylesheets/style.css HTTP/1.1<TAB>method:GET<TAB>uri:/stylesheets/style.css<TAB>status:200<TAB>size:110<TAB>referer:http://localhost:3001/<TAB>ua:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17<TAB>vhost:localhost:3001<TAB>reqtime:6<TAB>X-Cache:-<TAB>X-Runtime:-
time:[13/Feb/2013:19:15:45 +09:00]<TAB>host:127.0.0.1<TAB>X-Forwarded-For:-<TAB>req:GET /stylesheets/style.css HTTP/1.1<TAB>method:GET<TAB>uri:/stylesheets/style.css<TAB>status:200<TAB>size:110<TAB>referer:http://localhost:3001/<TAB>ua:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17<TAB>vhost:localhost:3001<TAB>reqtime:6<TAB>X-Cache:-<TAB>X-Runtime:-

```
## Options
* format: Format string or Token array, see below for tokens
* stream :is the same as connect.logger.
* buffer: is the same as connect.logger.
* immediate: is the same as connect.logger.

## Formats
Just override connect.logger's formats as ltsv

* default

`host:127.0.0.1<TAB>ident:-<TAB>user:-<TAB>time:[Wed, 13 Feb 2013 10:00:55 GMT]<TAB>req:GET / HTTP/1.1<TAB>status:200<TAB>size:110<TAB>referer:-<TAB>ua:-`

* short

`host:127.0.0.1<TAB>ident:-<TAB>req:GET / HTTP/1.1<TAB>status:200<TAB>size:-<TAB>response-time:1 ms`

* tiny

`req:GET /<TAB>status:200<TAB>size:-<TAB>response-time:1 ms`

* dev

concise output colored by response status for development use (Not ltsv format).

## Tokens
The following tokens are available

* time
```js
logger.token("time",function(){
  return "[" + moment().format("DD/MMM/YYYY:HH:mm:ss Z") + "]" ;
});
```
* host
```js
logger.token("host",function(req,res){
  return req.connection.address().address || '-';
});
```
* X-Forwarded-For
```js
logger.token("X-Forwarded-For",function(req,res){
  return res.getHeader("X-Forwarded-For") || "-";
});
```
* user
```js
logger.token("user",function(req,res){
  return '-';
});
```
* ident
```js
logger.token("ident",function(req,res){
  return '-';
});
```
* req
```js
logger.token("req",function(req,res){
  var ret = [];
  ret.push(req.method);
  ret.push(req.url);
  ret.push("HTTP/"+req.httpVersion);
  return ret.join(" ");
});
```
* method
```js
logger.token("method",function(req,res){
  return req.method;
});
```
* uri
```js
logger.token("uri",function(req,res){
  return url.parse(req.url).href;
});
```
* protocol
```js
logger.token("protocol",function(req,res){
  return url.parse(req.url).protocol;
});
```
* status
```js
logger.token("status",function(req,res){
  return res.statusCode;
});
```
* size
```js
logger.token("size",function(req,res){
  return res.getHeader("content-length");
});
```
* reqsize
```js
logger.token("reqsize",function(req,res){
  if(req.body) return req.body.length;
  return "-";
});
```
* referer
```js
logger.token("referer",function(req,res){
  return req.headers['referer'] || req.headers['referrer'];
});
```
* ua
```js
logger.token("ua",function(req,res){
  return req.headers['user-agent'];
});
```
* vhost
```js
logger.token("vhost",function(req,res){
  return req.headers["host"];
});
```
* reqtime
```js
logger.token("reqtime",function(req,res){
  return new Date - req._startTime;;
});
```
* X-Cache
```js
logger.token("X-Cache",function(req,res){
  return res.getHeader('X-Cache');
});
```
* X-Runtime
```js
logger.token("X-Runtime",function(req,res){
  return res.getHeader('X-Runtime');
});
```

## Install
npm do

```bash
npm install connect-ltsv-logger
```

## License

Source code can be found on [github](https://github.com/georgeOsdDev/connect-ltsv-logger), licenced under [MIT](http://opensource.org/licenses/mit-license.php).

## Author

Developed by [Takeharu.Oshida](http://about.me/takeharu.oshida)
