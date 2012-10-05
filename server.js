var path       = require('path'),
    ejs        = require('ejs'),
    express    = require('express'),
    RedisStore = require('connect-redis')(express);

var config    = require('./config'),
    log       = require('./core/log'),
    logger    = log.getLogger('web server'),
    PollTimer = require('./lib/poll-timer');

var pollService = require('./services/poll'),
    userService = require('./services/user');

var pollTimer = new PollTimer;
pollTimer.start();

var PUBLIC_DIR = path.resolve(__dirname, config.server.publicDir);

var app = module.exports = express();

// configure the express app
app.configure(function () {
  logger.info('configuring');
  
  // app.use(log.connectLogger(logger, { level: log.levels.DEBUG }));
  
  app.set('views', PUBLIC_DIR);
  app.set('view engine', 'ejs');
  
  ejs.open  = '{{';
  ejs.close = '}}';
  app.engine('ejs', ejs.__express);
  
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
  
  app.use(app.router);
  app.use(express.static(PUBLIC_DIR));
});

// define the routes
app.get('/', function (req, res) {
  res.render('index', { config: config, layout: null });
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
  pollService.getTodaysPoll(function (err, poll) {
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
