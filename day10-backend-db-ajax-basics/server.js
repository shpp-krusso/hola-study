var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static(__dirname + '/todo-list/'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/todo-list/index.html');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});