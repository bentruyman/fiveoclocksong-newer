define(['backbone'], function(Backbone) {
  
  var Track = Backbone.Model.extend({
    defaults: {
      key: '',
      name: '',
      artist: '',
      album: '',
      icon: ''
    },
    initialize: function () {
      
    }
  });
  
  return Track;
});
