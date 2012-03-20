(function () {

  // configure require.js
  require.config({
    baseUrl: '/javascripts'
  });
  
  // create a weld app
  var app = new Weld.App;
  
  app.start(app.create('modal-manager', { container: 'modal-manager' }));
  app.start(app.create('chatroom', { container: 'chatroom' }));

}());
