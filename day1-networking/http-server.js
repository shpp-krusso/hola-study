 //Lets require/import the HTTP module
var http = require('http');
var url = require('url');
var fs = require('fs');

//Lets define a port we want to listen to
const PORT=8080;

//We need a function which handles requests and send response
function handleRequest(request, response) {
    var parsedRequest = url.parse(request.url, true);
    var message = parsedRequest.query.message;
    response.end(message);
    var ip = request.headers['host'];
    console.log('{ date:' + new Date());
    console.log(ip);
    console.log('request:' + message + ' }');
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
