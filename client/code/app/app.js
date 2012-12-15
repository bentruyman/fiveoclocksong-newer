var chatroom   = require('./modules/chatroom'),
    poll       = require('./modules/poll'),
    userStatus = require('./modules/user-status');

userStatus.init('#user-status');

ss.rpc('app.restoreSession');
