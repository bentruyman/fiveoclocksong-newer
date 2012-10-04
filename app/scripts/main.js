define(
  function () {
    'use strict';

    // configure require.js
    require.config({
      baseUrl: 'scripts',
      paths: {
        async:  'vendor/requirejs-plugins/async',
        jade:   'vendor/requirejs-plugins/jade',
        json:   'vendor/requirejs-plugins/json',
        text:   'vendor/requirejs/text',
        jquery: 'vendor/jquery'
      }
    });
    
    requirejs([
      'widgets/chatroom',
      'widgets/modal-manager',
      'widgets/poll',
      'widgets/status-bar'
    ], function (chatroom, modalManager, poll, statusBar) {
      chatroom.render();
      modalManager.render();
      poll.render();
      statusBar.render();
    });

  }
);
