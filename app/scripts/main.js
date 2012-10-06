define(
  function () {
    'use strict';
    
    // configure require.js
    require.config({
      baseUrl: 'scripts',
      paths: {
        // plugins
        jade:       'vendor/requirejs-plugins/jade',
        text:       'vendor/requirejs-plugins/text',
        // libraries
        backbone:   'vendor/backbone',
        jquery:     'vendor/jquery',
        underscore: 'vendor/underscore'
      },
      shim: {
        backbone: {
          deps: ['underscore', 'jquery'],
          exports: 'Backbone'
        }
      }
    });
    
    require(['app'], function (app) {
      app.init();
    });
    
  }
);
