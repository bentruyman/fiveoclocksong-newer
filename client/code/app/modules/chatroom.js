var container    = $('#chatroom')[0],
    form         = $('#chatroom-form')[0],
    messageInput = $('#chatroom-input')[0],
    messages     = $('#chatroom-messages')[0],
    MESSAGE_SELECTOR = '.message',
    LIMIT = 100,
    LOGGED_IN = 'logged-in';

ss.event.on('/chat/message', function (payload) {
  addMessage(payload);
});

ss.event.on('/login', function (user) {
  $(container).addClass(LOGGED_IN);
});

ss.event.on('/logout', function (user) {
  $(container).removeClass(LOGGED_IN);
});

$(form).submit(function (event) {
  var $input = $(messageInput),
      message = $input.val().trim();
  
  event.preventDefault();
  
  if (message.length) {
    ss.rpc('chat.send', $input.val());
    $input.val('');
  }
});

function addMessage(message) {
  var newMessage = ss.tmpl['chatroom-message'].render(message);
  
  $(messages).append(newMessage);
  
  messages.scrollTop = messages.scrollHeight;
  
  pruneMessages();
}

function pruneMessages() {
  var length = $(messages).find(MESSAGE_SELECTOR).length,
      amountToPrune = length - LIMIT,
      i = 0;
  
  for (; i < amountToPrune; i++) {
    $(messages).find(MESSAGE_SELECTOR).eq(i).remove();
  }
}
