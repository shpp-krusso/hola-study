var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var nicknamesById = [];
var idByNicknames = [];
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

    socket.on('nickname', function (name) {
        userIdentification(this, id, name);
        refreshOnlineUsersInformation();
    });

    socket.on('user is typing', function () {
        usersTypingNow[id] = nicknamesById[id];
        refreshUserTypingInfo(this);
    });

    socket.on('user finished typing', function () {
        delete usersTypingNow[id];
        refreshUserTypingInfo(this);
    });
});


http.listen(3001, function () {
    console.log('listening on *:3001');
});

function handleDisconnectEvent(socket, id) {
    if (nicknamesById[id]) {
        var nick = nicknamesById[id];
        socket.broadcast.emit('member connected/disconnected', nick.toString() + ' has disconnected');
        delete (idByNicknames[nick]);
        delete (nicknamesById[id]);
    }
    refreshOnlineUsersInformation();
    console.log('user disconnected');
}

function handleChatMessage(socket, id, msg) {
    if(isPrivateMessage(msg)) {
        sendMessageToParticularUsers(socket, id, msg);
    } else {
        socket.broadcast.emit('chat message', nicknamesById[id] + ' say: ' + msg);
    }
}

function userIdentification(socket, id, name) {
    nicknamesById[id] = name;
    idByNicknames[name] = id;
    socket.broadcast.emit('member connected/disconnected', name + ' has come.');
}

function refreshUserTypingInfo(socket) {
    var msg = '';
    for(var id in usersTypingNow) {
        msg += usersTypingNow[id] + ' ';
    };

    msg += (msg) ? 'typing' : '';
    socket.broadcast.emit('user is typing', msg);
}

function refreshOnlineUsersInformation() {
    var onlineUsers = [];
    for (var name in idByNicknames) {
        if (name) {
            onlineUsers.push(name);
        }
    }
    io.emit('refresh onlineUsers', onlineUsers);
}

function isPrivateMessage(msg) {
    var hasRecipients = msg.search(/@<.*?>/g);
    return (hasRecipients != -1);
}

function sendMessageToParticularUsers(socket, id, msg) {
    var recipients = msg.match(/@<.*?>/g);
    recipients.forEach(function(elem) {
        elem = elem.slice(2, elem.length - 1);
        var userId = idByNicknames[elem];
        if (userId) {
            socket.broadcast.to(userId).emit('private message', nicknamesById[id] + ' say to: ' + msg);
        }
    });



}
