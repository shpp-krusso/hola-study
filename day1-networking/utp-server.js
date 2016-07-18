const dgram = require('dgram');
const server = dgram.createSocket('udp4');


server.on('message', function (message, rinfo) {
    console.log('server got:' + message + 'from ' + rinfo.address + ':' + rinfo.port);
    server.send(message, 0, message.length,  8082, 'localhost');
});

server.on('listening', function () {
    var address = server.address();
    console.log('server listening ' + address.address + ':' + address.port);
});

server.bind(8082, 'localhost');