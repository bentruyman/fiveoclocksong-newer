var path       = require('path'),
    express    = require('express'),
    RedisStore = require('connect-redis')(express);

var config      = require('../../../config'),
    PollService = require('../services/poll'),
    PollTimer   = require('./poll-timer'),
    UserService = require('../services/user');

var PUBLIC_DIR = path.normalize(__dirname + '../../../../public'),
    VIEWS_DIR  = path.normalize(__dirname + '../../../../views');

var app = module.exports = express.createServer();

// configure the express app
app.configure(function(){
  app.set('views', VIEWS_DIR);
  app.set('view engine', 'jade');
  
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
  
  app.use(require('stylus').middleware({ src: PUBLIC_DIR }));
  
  app.use(app.router);
  app.use(express.static(PUBLIC_DIR));
});

// start the poll timer
PollTimer.start();

// init the messenger
var messenger = require('../services/messenger');
messenger.init();
messenger.attach(app);

// publish poll state changes
PollTimer.on('pollstart', function () {
  messenger.client.publish('/poll/start', true);
});
PollTimer.on('pollstop', function () {
  messenger.client.publish('/poll/stop', true);
});

// define the routes
app.get('/', function (req, res) {
  res.render('index');
});

app.get('/config.json', function (req, res) {
  res.json({
    messenger: config.messenger
  });
});

app.get('/poll.json', function (req, res) {
  PollService.getPoll(new Date, function (err, poll) {
    if (err) {
      res.json(err);
    } else {
      res.json({
        poll: poll,
        state: PollTimer.getState()
      });
    }
  });
});

app.get('/user.json', function (req, res) {
  var username = req.session.username;
  
  if (username) {
    UserService.getUserByName(username, function (err, user) {
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
