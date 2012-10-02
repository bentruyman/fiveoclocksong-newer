define(
  ['lib/weld.min.js', 'widgets/chatroom'],
  function () {

    'use strict';
    
    // configure require.js
    require.config({
      baseUrl: 'scripts',
      paths: {
        async: 'lib/requirejs-plugins/async',
        jade:  'lib/requirejs-plugins/jade',
        json:  'lib/requirejs-plugins/json',
        text:  'lib/requirejs/text'
      }
    });
    
    // create a weld app
    var app = new Weld.App;
    
    app.start(app.create('modal-manager', { container: 'modal-manager' }));
    app.start(app.create('status-bar',    { container: 'user-status' }));
    app.start(app.create('poll',          { container: 'poll' }));
    app.start(app.create('chatroom',      { container: 'chatroom' }));

  }
);
