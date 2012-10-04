define(
  'widgets/chatroom',
  ['jquery', 'services/chat'],
  function($, chatService) {
    var create = function () {

    };

    var destroy = function () {

    };

    return {
      render: function (container) {
        var inputContainer = $('.chatroom-input', container).get(0),
            messagesContainer = $('.chatroom-messages', container).get(0);
      }
    };
  }
);
