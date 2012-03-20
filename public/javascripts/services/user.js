define(
  ['services/jquery'],
  function($) {
    return {
      getCurrentUser: function () {
        return $.getJSON('/user.json');
      }
    };
  }
);