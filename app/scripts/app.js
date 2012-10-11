define(
  [
    'backbone',
    'routers/app',
    'views/app'
  ],
  function (Backbone, AppRouter, AppView) {
    return {
      init: function () {
        // Initialize routing and start Backbone.history()
        var appRouter = new AppRouter();
        Backbone.history.start();
        
        // Initialize the application view
        var appView = new AppView();
        appView.render();
      }
    };
  }
);
