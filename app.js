////////////////////////////////////////////////////////////////////////////////
// FIVEOCLOCKSONG
////////////////////////////////////////////////////////////////////////////////

var http = require('http'),
    config = require('./config'),
    ss = require('socketstream'),
    server, consoleServer;

// Define a single-page client called 'main'
ss.client.define('main', {
  view: 'app.html',
  css:  ['libs/reset.css', 'app.styl'],
  code: ['libs/jquery.min.js', 'app'],
  tmpl: '*'
});

ss.http.route('/', function(req, res){
  res.serveClient('main');
});

// ss.client.formatters.add(require('ss-compass'));
ss.client.templateEngine.use(require('ss-hogan'));

if (ss.env === 'production') ss.client.packAssets();

server = http.Server(ss.http.middleware);
server.listen(config.server.port);

consoleServer = require('ss-console')(ss);
consoleServer.listen(config.repl.port);

// Start SocketStream
ss.start(server);
