//http://iti.hatenablog.jp/entry/2014/05/27/112806
var socket = require('socket.io');

module.exports = sio;

function sio (server) {
	var io = socket.listen(server);
	io.set('transport',['websocket']);
}