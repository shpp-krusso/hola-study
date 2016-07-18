var http = require('http');
var message = 'Hello World!';

//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
var options = {
  family: '4',
  method: 'GET',
  path: '/echo?message=' + encodeURI(message),
  port: '8080',
};

var request = http.request(options, function(responseFromServer) {
  responseFromServer.on('data', function(data) {
      var response = data.toString();

      console.log('The message: ' + message);
      console.log('The response: ' + response);

      if (response == message) {
        console.log('The message and the response match!');
      } else {
        console.log('The message and the response doesn\'t mutch.');
      }
  })
});

request.on('error', function(err) {
    console.log( 'Error: ', err);
});
request.end();
