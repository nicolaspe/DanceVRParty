var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');

app.use(express.static('public'));

server.listen(9999, function () {
	  console.log('Server listening on port 9999!')
});


io.on('connection', function(socket){
	console.log("user connected");
	socket.on('disconnect', function(){
		console.log("user disconnected");
	});
	// socket.on('select', function(mode){
	// 	_scene = mode;
	// 	io.emit('change scene', _scene);
	// 	console.log("received selection: " + _scene);
	// });
});
