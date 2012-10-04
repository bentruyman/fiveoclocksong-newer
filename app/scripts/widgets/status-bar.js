define(
  'widgets/status-bar',
  ['jquery', 'services/user'],
  function ($, userService) {
    'use strict';

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
      rendering: function (container) {}
    };
  }
);
