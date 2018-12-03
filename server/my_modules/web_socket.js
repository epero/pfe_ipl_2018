var io = require('socket.io')();

let init_socket = () => {
  var port = 3031;
  io.listen(port);
  //console.log('listening on port ', port);
}

exports.io = io;
exports.init_socket = init_socket;


// socket.io => HOW TO USE

//const socket = require('./modules/web_socket.js');
//socket.init_socket();
/*var io = require('socket.io')();
io.on('connection', (socket) => {

  socket.on('new_message', (data) =>{
    io.sockets.emit('new_message', {message : data.message})
  })
});
var port = 3031;
io.listen(port);
console.log('listening on port ', port);*/
