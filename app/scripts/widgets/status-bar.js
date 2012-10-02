define(
  'widgets/status-bar',
  ['services/jquery', 'services/user'],
  function ($, userService) {
    'use strict';
    
    return {
      creator: function (sandbox) {
        var READY_CLASS = 'ready',
            subscriptions = [],
            container;
        
        function update() {
          userService.getCurrentUser().then(function (user) {
            if (user === null) {
              logout();
            } else {
              login(user);
            }
          });
        }
        
        function login(user) {
          $(container).addClass(READY_CLASS);
        }
        
        function logout() {
          $(container).removeClass(READY_CLASS);
        }
        
        return {
          create: function () {
            container = document.getElementById(sandbox.getOption('container'));
            
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
