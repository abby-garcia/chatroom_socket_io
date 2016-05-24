var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var counter = 1;


io.on('connection', function (socket) {
    console.log('Client connected');
    console.log(counter++);
    

    socket.on('message', function(message) {
        console.log('Received message:', message);
        socket.broadcast.emit('message', message);
    });

  

    socket.on('disconnect',function(socket){
    	console.log('Client disconnected')
    });




});

server.listen(8080);





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