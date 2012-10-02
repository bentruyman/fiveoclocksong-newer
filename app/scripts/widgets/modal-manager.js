define(
  ['services/jquery'],
  function ($) {
    return {
      creator: function (sandbox) {
        var subscriptionHandles = [];
        
        var openModal = function (options) {
          
        };
        
        var closeModal = function () {
          
        };
        
        var body = $('<p>This is text</p>').get(0);
        
        $(body).click(function () {
          alert('hey girl hey');
        });
        
        sandbox.app.publish('/modal/open', {
          header: 'Modal Window',
          body: body
        });
        
        return {
          create: function () {
            subscriptionHandles.push(sandbox.app.subscribe('/modal/open', openModal));
            subscriptionHandles.push(sandbox.app.subscribe('/modal/close', closeModal));
          },
          destroy: function () {
            sandbox.app.unsubscribeAll(subscriptionHandles);
          }
        };
      }
    };
  }
);
