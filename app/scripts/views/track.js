define(
  [
    'backbone',
    'jquery',
    'jade!templates/track'
  ],
  function(Backbone, $, trackView) {
    var AppView = Backbone.View.extend({
      tagName: 'li',
      className: 'track',
      template: trackView,
      initialize: function () {
        
      },
      render: function () {
        $(this.el).html(trackView(this.model.toJSON()));
        
        return this;
      }
    });
     
    return AppView;
  }
);
