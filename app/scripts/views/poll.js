define(
  [
    'backbone',
    'jquery',
    'models/poll',
    'models/track',
    'views/track'
  ],
  function(Backbone, $, Poll, Track, TrackView) {
    var PollView = Backbone.View.extend({
      el: '#poll',
      initialize: function () {
        
      },
      render: function () {
        var self = this,
            tracks = this.model.toJSON().tracks;
        
        tracks.forEach(function (data) {
          var track = new Track(data),
              trackView = new TrackView({ model: track });
          
          $(self.el).append(trackView.render().el);
        });
        
        return this;
      }
    });
     
    return PollView;
  }
);
