define(
  [
    'backbone',
    'models/poll'
  ],
  function(Backbone, Poll, TrackView) {
    var STARTED = 'started',
        STOPPED = 'stopped';
    
    var Poll = Backbone.Model.extend({
      urlRoot: 'api/poll',
      initialize: function () {
        
      }
    });
    
    return Poll;
  }
);
