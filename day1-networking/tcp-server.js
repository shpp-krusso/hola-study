var net = require('net');

var server = net.createServer();

var options = {
    port: '8081',
    family: '6'
}

server.listen(options, function () {
    console.log('Client is listening on port:', '8081');
});


server.on('connection', function (socket) {
    console.log('The connection is established.');
    socket.on('data', function (requiredData) {
        var message = requiredData.toString();
        console.log('{ date: ' + new Date());
        console.log('clien\'s ip: ' + socket.remoteAddress);
        console.log('client message: ' + message);
        socket.end(message);
    });
});


server.on('end', function () {
    console.log('Disconected from server.');
});

