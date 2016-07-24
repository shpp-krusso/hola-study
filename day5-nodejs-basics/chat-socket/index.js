var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile('/home/kocmuk/hola-study/day5-nodejs-basics/chat-socket/index.html');
});

var nicknames = [];
var usersTypingNow = [];

io.on('connection', function (socket) {
    console.log('a user connected');
    var id = (socket.id).toString();

    socket.on('disconnect', function () {
        handleDisconnectEvent(this, id);
    });

    socket.on('chat message', function (msg) {
        handleChatMessage(this, id, msg);
    });

    socket.on('nickname', function(name) {
        userIdentification(this, id, name);
        refreshOnlineUsersInformation(this);
    });

    socket.on('user is typing', function() {
        usersTypingNow[id] = nicknames[id];
        refreshUserTypingInfo(this);
    });

    socket.on('user finished typing', function() {
        delete usersTypingNow[id];
        refreshUserTypingInfo(this);
    });
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});

function handleDisconnectEvent(socket, id) {
    var nick = '';
    nick += (nicknames[id] == 'undefined') ? '' : nicknames[id];
    socket.broadcast.emit('member connected/disconnected', nick.toString() + ' had been disconnected');
    delete (nicknames[id]);
    refreshOnlineUsersInformation(socket);
    console.log('user disconnected');
}

function handleChatMessage(socket, id, msg) {
    socket.broadcast.emit('chat message', nicknames[id] + ' say: ' + msg);
}

function userIdentification(socket, id, name) {
    nicknames[id] = name;
    socket.broadcast.emit('member connected/disconnected', nicknames[id] + ' had been come.');
}

function refreshUserTypingInfo(socket) {
    var msg = '';
    for(var propName in usersTypingNow) {
        if(usersTypingNow.hasOwnProperty(propName)) {
            var propValue = usersTypingNow[propName];
            msg += (propValue) ? (propValue) + ' ' : '';
        }
    }
    msg += (msg) ? 'typing' : '';
    socket.broadcast.emit('user is typing', msg);
}

function refreshOnlineUsersInformation(socket) {
    var onlineUsers = [];
    for(var propName in nicknames) {
        if(nicknames.hasOwnProperty(propName)) {
            var propValue = nicknames[propName];
            if (propValue)
            onlineUsers.push(propValue);
        }
    }
    socket.emit('refresh onlineUsers', onlineUsers);
}
