var socket = require('socket.io');
var Player = require('./game/player');
var world_data = require('./game/world_data');

function sio (server) {
	var io = socket.listen(server);

	// サーバー接続処理
	io.sockets.on('connection', function (socket) {
		// プレイヤーデータ初期化
		var player = initPlayer(socket);
		// データ送信
		socket.json.emit('first_message', player,function () {
			console.log("first_message send!");
		});
		//クライアントデータ受信
		socket.json.on('client_data', function (data) {
			for(var i = 0; i < world_data.allPlayers.length; i++) {
				//ユーザーデータ更新
				if(data.id == world_data.allPlayers[i].id) {
					world_data.allPlayers[i].x = data.x;
					world_data.allPlayers[i].y = data.y;
					break;
				}
			}
		});
		// 切断処理
		socket.on('disconnect',function () {
			for(var i = 0; i < world_data.allPlayers.length; i++) {
				if(world_data.allPlayers[i].id === socket.id) {
					world_data.allPlayers.splice(i, 1);
					console.log(socket.id + " disconnect");
					break;
				}
			}
		});
	});

	// 全プレイヤーデータ送信（毎秒30回）
	setInterval(function() {
		io.sockets.json.emit('world_data', world_data);
	}, 33);
}

// プレイヤーデータ初期化
function initPlayer(socket) {
	var x = setPosition();
	var y = setPosition();
	var color = setColor();
	var p = new Player(socket.id, x, y, color);
	world_data.allPlayers.push(p);
	return p;
}
// 座標生成
function setPosition() {
	return Math.round((Math.random() - 0.5) * 100);
}
// カラー生成
function setColor() {
	return '#' + ('00000' + (Math.random() * (1<<24)|0).toString(16)).slice(-6);
}

module.exports = sio;
