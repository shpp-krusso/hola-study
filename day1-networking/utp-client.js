const dgram = require('dgram');
const message = 'Hello World!';
const client = dgram.createSocket('udp4');

client.send(message, 0, message.length,  8082, 'localhost');

client.on('message', function(data) {
    var message = data.toString();
    console.log('The message is: ' + message);
    client.close();
});


