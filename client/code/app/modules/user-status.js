var $container = $('#user-status');

ss.event.on('/login', function (user) {
  user.votesLeft = user.votesLeft || 0;
  $container.html(ss.tmpl['user-status'].render(user));
});

ss.event.on('/logout', function (user) {
  $container.empty();
});
