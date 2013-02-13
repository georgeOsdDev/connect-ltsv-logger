var assert     = require('assert'),
    exec       = require('child_process').exec,
    http       = require('http'),
    fs         = require('fs'),
    connect    = require('connect'),
    ltsvlogger = require('../');

var logFilePath = "./test/test_access.log",
    out = fs.createWriteStream(logFilePath,{flags: 'w'}),
    server;

describe('basic test', function(done) {
  var app = connect()
    .use(ltsvlogger({stream:out}))
    .use(function(req, res,next){
      res.end('Hello from Connect!\n');
      // server.close();
    });
  it("create server",function(done){
    server = http.createServer(app).listen(3001,function(){
      var opt = {
        "hostname":"localhost",
        "port":3001,
        "path":"/",
        "agent":false
      };
      http.get(opt, function(res) {
        assert(res.statusCode === 200);
        done();
      });
    });
  });
  it('should be default format', function(done) {
    exec('tail -1 ' + logFilePath, function(err, stdout, stderr) {
      console.log(stdout);
      assert(/^host:127.0.0.1\tident:-\tuser:-\ttime:\[.*\]\treq:GET \/ HTTP\/1.1\tstatus:200\tsize:-\treferer:-\tua:-/.exec(stdout));
      server.close();
      done();
    });
  });
});

describe('"default" format test', function(done) {
  var app = connect()
    .use(ltsvlogger({format:"default",stream:out}))
    .use(function(req, res,next){
      res.end('Hello from Connect!\n');
      // server.close();
    });
  it("create server",function(done){
    server = http.createServer(app).listen(3001,function(){
      var opt = {
        "hostname":"localhost",
        "port":3001,
        "path":"/",
        "agent":false
      };
      http.get(opt, function(res) {
        assert(res.statusCode === 200);
        done();
      });
    });
  });
  it('should be default format', function(done) {
    exec('tail -1 ' + logFilePath, function(err, stdout, stderr) {
      console.log(stdout);
      assert(/^host:127.0.0.1\tident:-\tuser:-\ttime:\[.*\]\treq:GET \/ HTTP\/1.1\tstatus:200\tsize:-\treferer:-\tua:-/.exec(stdout));
      server.close();
      done();
    });
  });
});

describe('"short" format test', function(done) {
  var app = connect()
    .use(ltsvlogger({format:"short",stream:out}))
    .use(function(req, res,next){
      res.end('Hello from Connect!\n');
      // server.close();
    });
  it("create server",function(done){
    server = http.createServer(app).listen(3001,function(){
      var opt = {
        "hostname":"localhost",
        "port":3001,
        "path":"/",
        "agent":false
      };
      http.get(opt, function(res) {
        assert(res.statusCode === 200);
        done();
      });
    });
  });
  it('should be short format', function(done) {
    exec('tail -1 ' + logFilePath, function(err, stdout, stderr) {
      console.log(stdout);
      assert(/^host:127.0.0.1\tident:-\treq:GET \/ HTTP\/1.1\tstatus:200\tsize:-\tresponse-time:.* ms/.exec(stdout));
      server.close();
      done();
    });
  });
});

describe('"tiny" format test', function(done) {
  var app = connect()
    .use(ltsvlogger({format:"tiny",stream:out}))
    .use(function(req, res,next){
      res.end('Hello from Connect!\n');
      // server.close();
    });
  it("create server",function(done){
    server = http.createServer(app).listen(3001,function(){
      var opt = {
        "hostname":"localhost",
        "port":3001,
        "path":"/",
        "agent":false
      };
      http.get(opt, function(res) {
        assert(res.statusCode === 200);
        done();
      });
    });
  });
  it('should be tiny format', function(done) {
    exec('tail -1 ' + logFilePath, function(err, stdout, stderr) {
      console.log(stdout);
      assert(/^req:GET \/\tstatus:200\tsize:-\tresponse-time:.* ms/.exec(stdout));
      server.close();
      done();
    });
  });
});

describe('custome format test', function(done) {

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

  var app = connect()
    .use(ltsvlogger({format:ltsv,stream:out}))
    .use(function(req, res,next){
      res.end('Hello from Connect!\n');
      // server.close();
    });
  it("create server",function(done){
    server = http.createServer(app).listen(3001,function(){
      var opt = {
        "hostname":"localhost",
        "port":3001,
        "path":"/",
        "agent":false
      };
      http.get(opt, function(res) {
        assert(res.statusCode === 200);
        done();
      });
    });
  });
  it('should be custome format', function(done) {
    exec('tail -1 ' + logFilePath, function(err, stdout, stderr) {
      console.log(stdout);
      assert(/^time:\[.*\]\thost:.*\tX-Forwarded-For:.*\tuser:.*\tident:.*\treq:.*\tmethod:.*\turi:.*\tprotocol:.*\tstatus:.*\tsize:.*\treqsize:.*\treferer:.*\tua:.*\tvhost:.*\treqtime:.*\tX-Cache:.*\tX-Runtime:.*/.exec(stdout));
      server.close();
      done();
    });
  });
});

describe('invalid format test2', function(done) {

  // select tokens
  var ltsv = [];
  ltsv.push("time");
  ltsv.push("hoge");
  ltsv.push("host");
  ltsv.push("fuga");
  ltsv.push("req");

  var app = connect()
    .use(ltsvlogger({format:ltsv,stream:out}))
    .use(function(req, res,next){
      res.end('Hello from Connect!\n');
      // server.close();
    });
  it("create server",function(done){
    server = http.createServer(app).listen(3001,function(){
      var opt = {
        "hostname":"localhost",
        "port":3001,
        "path":"/",
        "agent":false
      };
      http.get(opt, function(res) {
        assert(res.statusCode === 200);
        done();
      });
    });
  });
  it('should be valid format', function(done) {
    exec('tail -1 ' + logFilePath, function(err, stdout, stderr) {
      console.log(stdout);
      assert(/^time:\[.*\]\thost:.*\treq:.*/.exec(stdout));
      server.close();
      done();
    });
  });
});
