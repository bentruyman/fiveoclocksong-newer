define(
  function () {
    'use strict';

    // configure require.js
    require.config({
      baseUrl: 'scripts',
      paths: {
        jade:   'vendor/requirejs-plugins/jade',
        text:   'vendor/requirejs-plugins/text',
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
