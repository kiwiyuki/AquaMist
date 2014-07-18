var socket = require('socket.io');
var Player = require('./game/player');
var allPlayer = {};
module.exports = sio;

function sio (server) {
	var io = socket.listen(server);
	// サーバー接続処理
	io.sockets.on('connection', function (socket) {
		var x = makePosition();
		var y = makePosition();
		var color = makeColor();
		var p = new Player(socket.id, x, y, color);
		//first_msg
		socket.json.emit('first message', p);
	});

}

function makePosition() {
	return Math.round(Math.random() - 0.5) * 100;
}
function makeColor() {
	return '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
}
