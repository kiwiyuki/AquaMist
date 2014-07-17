var socket = require('socket.io');

module.exports = sio;

function sio (server) {
	var io = socket.listen(server);
	io.set('transport',['websocket']);
}