var message = 'Hello World!';
var net = require('net');

var client = new net.Socket();

var options = {
    port: '8081',
    // path: '/echo?message=' + encodeURI(message)
};

client.connect(options, function() {
    console.log('Connected!');
    client.end(message);
});

client.on('data', function(data) {
    console.log('The message is: ' + data.toString());
});

client.on('close', function() {
   console.log('Client is closed.')
});