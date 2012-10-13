// configure require.js
require.config({
  baseUrl: 'scripts',
  paths: {
    // plugins
    jade:     'vendor/requirejs-plugins/jade',
    text:     'vendor/requirejs-plugins/text',
    // libraries
    backbone: 'vendor/backbone',
    jquery:   'vendor/jquery',
    lodash:   'vendor/lodash.custom'
  },
  shim: {
    lodash: {
      exports: '_'
    },
    backbone: {
      deps: ['lodash', 'jquery'],
      exports: 'Backbone'
    }
  }
});

require(['app'], function (app) {
  app.init();
});
