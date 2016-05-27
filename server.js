var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var numUsers = 0;


io.on('connection', function (socket) {
    var addedUser = false;

    socket.on('add user', function(username){
    	if (addedUser) return;

    	socket.username = username;
    	++numUsers;
    	
    	addedUser = true;
    	socket.emit('login', {
    		numUsers: numUsers
    	});

    	socket.broadcast.emit('user joined', {
    		username: socket.username,
    		numUsers: numUsers
    	});
    });


    socket.on('new message', function(data) {
        // console.log('Received message:', message);
        socket.broadcast.emit('new message', {
        	username: socket.username,
        	message: data
        });
    });

  

    socket.on('disconnect',function(){
    	// console.log('Client disconnected')
    	if (addedUser) {
    		--numUsers;

    		socket.broadcast.emit('user left', {
    			username: socket.username,
    			numUsers: numUsers
    		});
    	}
    });
});

server.listen(8080, function(){
	console.log('Server listening at port 8080');
});





// Two things on the list to do:
// Display how many users are connected - YAY.
//when someone connects/disconnects - YAY.
// Nickname



// if you want a counter, we can make an algorithm where every time someone connects
// we can add counter++





//ORIGINAL CODE
// var socket_io = require('socket.io');
// var http = require('http');
// var express = require('express');

// var app = express();
// app.use(express.static('public'));

// var server = http.Server(app);
// var io = socket_io(server);

// io.on('connection', function (socket) {
//     console.log('Client connected');

//     socket.on('message', function(message) {
//         console.log('Received message:', message);
//         socket.broadcast.emit('message', message);
//     });
// });

// server.listen(8080);