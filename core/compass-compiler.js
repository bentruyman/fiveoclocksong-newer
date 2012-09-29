var spawn = require('child_process').spawn,
    path  = require('path');

var log    = require('./log'),
    logger = log.getLogger('compass');

var defaults = {
  css: 'stylesheets',
  sass: 'stylesheets',
  images: 'images',
  fonts: 'fonts',
  project: path.join(process.cwd(), 'public'),
  main: 'fiveoclocksong.scss'
};

var CompassCompiler = module.exports = function (options) {
  this.settings = options || {};
  
  // merge settings with defaults
  Object.keys(defaults).forEach(function (key) {
    if (this.settings[key] === undefined) {
      this.settings[key] = defaults[key];
    }
  }, this);
};

CompassCompiler.prototype.init = function() {
  var opts = this.settings,
      child;
  
  child = spawn(
    'compass',
    [
      process.env.NODE_ENV === 'production' ? 'compile' : 'watch',
      '--e', process.env.NODE_ENV === 'production' ? 'production' : 'development',
      '--boring',
      '--css-dir', opts.css,
      '--sass-dir', opts.sass,
      '--images-dir', opts.images,
      '--fonts-dir', opts.fonts,
      path.join(opts.project, opts.css, opts.main)
    ],
    {
      cwd: opts.project
    }
  );
  
  child.stdout.on('data', function (data) {
    logger.debug(cleanData(data));
  });
  
  function cleanData(data) {
    return data.toString().replace(/^>>>/, '').trim();
  }
};
