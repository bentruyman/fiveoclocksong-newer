define(
  ['services/jquery'],
  function($) {
    return {
      getCurrentPoll: function () {
        return $.getJSON('/poll.json');
      }
    };
  }
);