var path       = require('path'),
    express    = require('express'),
    stylus     = require('stylus'),
    RedisStore = require('connect-redis')(express);

var config    = require('./config'),
    log       = require('./core/log'),
    logger    = log.getLogger('web server'),
    Messenger = require('./lib/messenger'),
    PollTimer = require('./lib/poll-timer');

var messenger = new Messenger,
    messengerClient = messenger.getClient(),
    pollTimer = new PollTimer,
    pollService = require('./services/poll'),
    userService = require('./services/user');

var PUBLIC_DIR = path.resolve(__dirname, './public'),
    VIEWS_DIR  = path.resolve(__dirname, './views');

var app = module.exports = express.createServer();

// attach the messenger
messenger.attach(app);

// configure the express app
app.configure(function () {
  logger.info('configuring');
  
  app.set('views', VIEWS_DIR);
  app.set('view engine', 'jade');
  
  app.use(log.connectLogger(logger, { level: log.levels.DEBUG }));
  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: config.security.secretKey,
    store: new RedisStore,
    cookie: {
      maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
    }
  }));
  
  app.use(stylus.middleware({
    src: PUBLIC_DIR,
    compile: function(str, path) {
      return stylus(str)
        .set('filename', path)
        .set('compress', true)
        .define('durl', stylus.url({
          paths: [PUBLIC_DIR]
        }));
    }
  }));
  
  app.use(app.router);
  app.use(express.static(PUBLIC_DIR));
});

// start the poll timer
pollTimer.start();

// publish poll state changes
pollTimer.on('pollstart', function () {
  logger.info('poll started');
  messengerClient.publish('/poll/start', true);
});
pollTimer.on('pollstop', function () {
  logger.info('poll stopped');
  messengerClient.publish('/poll/stop', true);
});

// define the routes
app.get('/', function (req, res) {
  res.render('index', {
    config: config
  });
});

// retrieves configuration options
app.get('/config.json', function (req, res) {
  res.json({
    messenger: config.messenger,
    server: config.server
  });
});

// retrieves the current poll's object
app.get('/poll.json', function (req, res) {
  pollService.getPoll(new Date, function (err, poll) {
    if (err) {
      res.json(err);
    } else {
      res.json({
        poll: poll,
        state: pollTimer.getState()
      });
    }
  });
});

// retrieves the logged in user's object, or null
app.get('/user.json', function (req, res) {
  var username = req.session.username;
  
  if (username) {
    userService.getUserByName(username, function (err, user) {
      if (err) {
        res.json(err);
      } else {
        res.json(user.toSecuredJSON());
      }
    });
  } else {
    res.json(null);
  }
});
