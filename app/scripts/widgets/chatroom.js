define(
  'widgets/chatroom',
  ['services/jquery', 'services/chat'],
  function($, chatService) {
    'use strict';
    
    return {
      creator: function (sandbox) {
        // store containers
        var container = document.getElementById(sandbox.getOption('container')),
            inputContainer = $('.chatroom-input', container).get(0),
            messagesContainer = $('.chatroom-messages', container).get(0);
        
        var create = function () {
          
        };
        
        var destroy = function () {
          
        };
        
        return {
          create: create,
          destroy: destroy
        };
      }
    };
  }
);
