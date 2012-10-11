define(
  [
    'backbone',
    'jquery',
    'models/poll',
    'views/poll'
  ],
  function(Backbone, $, Poll, PollView) {
    var AppView = Backbone.View.extend({
      el: '#fiveoclocksong',
      initialize: function () {
        
      },
      render: function () {
        var poll = new Poll({ id: '20121010' }),
            pollView = new PollView({ model: poll });
        
        poll.fetch().then(function () {
          pollView.render();
        });
        
        return this;
      }
    });
     
    return AppView;
  }
);
