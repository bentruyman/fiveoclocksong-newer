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
        var poll = new Poll({ id: createDateString(new Date) }),
            pollView = new PollView({ model: poll });
        
        poll.fetch().then(function () {
          pollView.render();
        });
        
        return this;
      }
    });
    
    function createDateString (date) {
      date = new Date(date);
      
      var year  = date.getFullYear(),
          month = date.getMonth() + 1,
          day   = date.getDate();
      
      // stringify all the numbers
      year =   year.toString();
      month = month.toString();
      day =     day.toString();
      
      // pad month to two digits
      month = (month.length === 1) ? '0' + month : month;
      
      // pad day to two digits
      day = (day.length === 1) ? '0' + day : day;
      
      return '' + year + month + day;
    };
    
    return AppView;
  }
);
