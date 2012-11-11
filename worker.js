////////////////////////////////////////////////////////////////////////////////
// FIVEOCLOCKSONG - Worker
////////////////////////////////////////////////////////////////////////////////

var http = require('http'),
    ss = require('socketstream'),
    config = require('./config'),
    server, port;

// define a single-page client called 'main'
ss.client.define('main', {
  view: 'app.html',
  css:  ['libs/base.css', 'app.styl'],
  code: ['libs/jquery.js', 'libs/modernizr.custom.54241.js', 'app'],
  tmpl: '*'
});

// route the root to the main app module
ss.http.route('/', function(req, res){
  res.serveClient('main');
});

// use the stylus formatter
ss.client.formatters.add(require('ss-stylus'));

// use the hogan templating engine
ss.client.templateEngine.use(require('ss-hogan'));

// use redis for session storage
ss.session.store.use('redis');

// use redis for pubsub transport
ss.publish.transport.use('redis', {
  host: config.redis.host,
  port: config.redis.port
});

// pack assets in production
if (ss.env === 'production') {
  ss.client.packAssets();
}

// create the web server
server = http.Server(ss.http.middleware);
server.listen(parseInt(process.argv.slice(-1), 10));

// start socketstream
ss.start(server);
