define(
  ['services/jquery', 'services/user'],
  function ($, userService) {
    return {
      creator: function (sandbox) {
        var subscriptions = [],
            container;
        
        function update() {
          userService.getCurrentUser().then(function (user) {
            if (user === null) {
              $(container).text('NOT LOGGED IN');
            } else {
              $(container).text('UR LOGGED IN');
            }
          });
        }
        
        return {
          create: function () {
            container = $('.wrapper', document.getElementById(sandbox.getOption('container')));
            
            // watch for user login/logout messages
            subscriptions.push(
              sandbox.app.subscribe('/user/login', update)
            );
            subscriptions.push(
              sandbox.app.subscribe('/user/logout', update)
            );
            
            // perform an initial update
            update();
          },
          destroy: function () {
            sandbox.app.unsubscribeAll(subscriptions);
          }
        };
      }
    };
  }
);