var socket = require('socket.io');

module.exports = sio;

function sio (server) {
	var io = socket.listen(server);
		// サーバー接続処理
	io.socket.on('connection', function (socket) {
		//first_msg
		socket.emit('first_msg', function () {

		});
	});
}
