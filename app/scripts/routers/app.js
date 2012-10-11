define(
  ['backbone'],
  function (Backbone) {
    var AppRouter = Backbone.Router.extend({
      routes: {
        '/about': 'showAbout',
        '/achievements': 'showAchievements',
        '/help': 'showHelp',
        '/login': 'showLogin',
        '*other': 'defaultRoute'
      },
      showAbout: function () {},
      showAchievements: function () {},
      showHelp: function () {},
      showLogin: function () {},
      defaultRoute: function () {}
    });
    
    return AppRouter;
  }
);
