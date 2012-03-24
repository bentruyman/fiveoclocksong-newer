(function () {

  // configure require.js
  require.config({
    baseUrl: '/javascripts',
    paths: {
      json: 'lib/requirejs-plugins/json',
      text: 'lib/requirejs/text'
    }
  });
  
  // create a weld app
  var app = new Weld.App;
  
  app.start(app.create('modal-manager', { container: 'modal-manager' }));
  app.start(app.create('chatroom', { container: 'chatroom' }));

}());
