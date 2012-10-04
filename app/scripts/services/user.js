define(
  ['jquery'],
  function($) {
    return {
      getCurrentUser: function () {
        return $.getJSON('/user.json');
      }
    };
  }
);
