var $container;

module.exports = userStatus = {
  init: function (container) {
    $container = $(container);
  },
  setUsername: function (name) {
    
  }
};

ss.event.on('/login', function (user) {
  $container.html(ss.tmpl['user-status'].render());
});

ss.event.on('/logout', function (user) {
  $container.empty();
});
