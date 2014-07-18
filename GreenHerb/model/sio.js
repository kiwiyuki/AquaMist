var socket = require('socket.io');
var Player = require('./game/player');
var world_data = {};
world_data.allPlayers = [];
module.exports = sio;

function sio (server) {
	var io = socket.listen(server);
	// サーバー接続処理
	io.sockets.on('connection', function (socket) {
		var p = init(socket);
		//初期化、データ送信
		socket.json.emit('first message', p);
		//全ユーザーデータ送信
		//クライアントデータ受信
		socket.json.on('client data', function (data) {
			for(var i = 0; i < world_data.allPlayers.length; i++) {
				if(data.id == world_data.allPlayers[i].id) {
					world_data.allPlayers[i].x = data.x;
					world_data.allPlayers[i].y = data.y;
					console.log(world_data.allPlayers);
					break;
				}
			}
			// var index = world_data.allPlayers.indexOf(data.id);
			// world_data.allPlayers[index].x = data.x;
			// world_data.allPlayers[index].y = data.y;
		});
	});
	setInterval(function() {
		io.sockets.json.emit('world data', world_data);
	},33);
}

function init(socket) {
	var x = makePosition();
	var y = makePosition();
	var color = makeColor();
	var p = new Player(socket.id, x, y, color);
	world_data.allPlayers.push(p);
// 	console.log(world_data.allPlayers);
	return p;
}
function makePosition() {
	return Math.round((Math.random() - 0.5) * 100);
}
function makeColor() {
	return '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
}
