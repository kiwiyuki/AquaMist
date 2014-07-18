// デバッグヘルパー
var DebugHelper = function(parentElement) {
	// three.js 読み込みチェック
	if(THREE == undefined) {
		console.log("three.jsが読み込まれていません");
		return;
	}

	var DEBUG = false;

	// 情報表示用DOM
	var info = document.createElement("div");
	info.style.position = "absolute";
	info.style.left = "0px";
	info.style.top = "0px";
	info.style.textAlign = "left";
	if(DEBUG) parentElement.appendChild(info);

	// fps表示
	var stats = new Stats();
	stats.setMode(0);
	info.appendChild(stats.domElement);

	// 座標表示
	var pos = document.createElement("div");
	info.appendChild(pos);

	// 座標軸表示
	var axis = new THREE.AxisHelper(1000);
	axis.position.set(0, 0, 0);

	return {
		update : function(position) {
			if(DEBUG) {
				stats.update();
				if(position != undefined) {
					pos.innerHTML = "x: " + position.x + "<br>" + "y: " + position.y;
				};
			};
		},

		modeChange : function(scene) {
			if (DEBUG) {
				parentElement.removeChild(info);
				scene.remove(axis);

				DEBUG = !DEBUG;
			} else {
				parentElement.appendChild(info);
				scene.add(axis);

				DEBUG = !DEBUG;
			}
		}
	};
};

(function() {
	// グローバル変数
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	var socket;
	var scene, camera, renderer;
	var debugHelper = new DebugHelper(document.getElementById("game"));
	var player;
	var avatarManager;

	// WebSocket開始
	socket = io.connect();

	var flag = true;
	// データ受信
	if(flag) socket.on("first message", function(data) {
		init();

		player = new Player(data.x, data.y, data.color, data.id);
		player.generate(scene);

		flag = false;
	});

	// 初期化
	function init() {
		// シーン
		scene = new THREE.Scene();

		// カメラ
		camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 10000);
		camera.position.set(0, 0, 800);
		camera.lookAt(new THREE.Vector3(0, 0, 0));

		// レンダラー
		renderer = new THREE.WebGLRenderer();
		renderer.setSize(WIDTH, HEIGHT);
		renderer.setClearColor(0xffffff, 1);
		document.getElementById("game").appendChild(renderer.domElement);

		// 光源
		var light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(WIDTH / 2, HEIGHT / 2, 1000);
		// light.castShadow = true;
		scene.add(light);
		// 環境光
		var ambient = new THREE.AmbientLight(0x550000, 1);
		scene.add(ambient);

		// イベント追加
		window.addEventListener('resize', onWindowResize, false);
		window.addEventListener('keydown', onKeyDown, false);
		window.addEventListener('keyup', onKeyUp, false);

		// アバターマネージャー起動
		avatarManager = new AvatarManager();

		// ループ開始
		requestAnimationFrame(gameLoop);
	}

	// ゲームループ
	function gameLoop() {
		player.update();
		renderer.render(scene, camera);

		// カメラ移動
		var d = 0.95;
		var targetPositionX = camera.position.x * d + player.getPosition().x * (1 - d);
		var targetPositionY = camera.position.y * d + player.getPosition().y * (1 - d);
		camera.position.x = targetPositionX;
		camera.position.y = targetPositionY;
		camera.lookAt(new THREE.Vector3(targetPositionX, targetPositionY, 0));

		debugHelper.update(player.getPosition());
		requestAnimationFrame(gameLoop);

		// サーバーへデータ送信
		socket.json.emit("client data", {
			"id" : player.id,
			"x" : player.getPosition().x,
			"y" : player.getPosition().y
		});
	}

	socket.on("world data", function(data) {
		var length = data.allPlayers.length;
		for(var i = 0; i < length; i++) {
			if(player.id != data.id) {
				avatarManager.updateAvatar(data.allPlayers[i], scene);
			}
		}
	});

	// イベントリスナー
	function onWindowResize(e) {
		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;
		renderer.setSize(WIDTH, HEIGHT);
		camera.aspect = WIDTH / HEIGHT;
		camera.updateProjectionMatrix();
	}

	function onKeyDown(e) {
		switch(e.keyCode) {
			case 37:
			e.preventDefault();
			player.controls.moveLeft = true;
			break;

			case 38:
			e.preventDefault();
			player.controls.moveUp = true;
			break;

			case 39:
			e.preventDefault();
			player.controls.moveRight = true;
			break;

			case 40:
			e.preventDefault();
			player.controls.moveDown = true;
			break;

			case 114: // key "F3"
			e.preventDefault();
			debugHelper.modeChange(scene);
			break;
		}

		// console.log(player.getPosition());
	}

	function onKeyUp(e) {
		switch(event.keyCode){
			case 37:
			e.preventDefault();
			player.controls.moveLeft = false;
			break;

			case 38:
			e.preventDefault();
			player.controls.moveUp = false;
			break;

			case 39:
			e.preventDefault();
			player.controls.moveRight = false;
			break;

			case 40:
			e.preventDefault();
			player.controls.moveDown = false;
			break;
		}
	}

	function Player(px, py, pcolor , pid) {
		var x = px;
		var y = py;
		var speed = 4;
		var hp;
		var id = pid;
		var box;
		var color = pcolor;

		var rotateAngle = 2 * Math.PI / 180;

		var controls = {
			moveUp: false,
			moveDown: false,
			moveLeft: false,
			moveRight: false
		};

		return {
			controls : controls,
			id: id,

			getPosition : function() {
				return box.position;
			},

			generate : function(scene) {
				var boxSize = 30;
				var g = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
				var m = new THREE.MeshLambertMaterial({color : color});
				box = new THREE.Mesh(g, m);
				box.position.set(x, y, 0);

				scene.add(box);
			},

			update : function() {
				if(controls.moveLeft) x -= speed;
				if(controls.moveUp) y += speed;
				if(controls.moveRight) x += speed;
				if(controls.moveDown) y -= speed;
				box.position.set(x, y, 0);

				box.rotation.x += rotateAngle;
				box.rotation.y += rotateAngle;
			}
		};
	}

	function AvatarManager() {
		var avatars = [];
		var num = 0;

		this.addAvatar = function(x, y, id, color, scene) {
			var boxSize = 30;
			var g = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
			var m = new THREE.MeshLambertMaterial({color : color});
			box = new THREE.Mesh(g, m);
			box.position.set(x, y, 0);
			box.avatarID = id;

			avatars.push(box);
			scene.add(box);
			num++;
		};

		this.updateAvatar = function(data, scene) {
			var i = 0;
			while(i < num) {
				if(avatars[i].avatarID == data.id) {
					avatars[i].x = data.x;
					avatars[i].y = data.y;
					return;
				} 

				i++;
			}

			this.addAvatar(data.x, data.y, data.id, data.color, scene);
		};

		this.move = function() {

		}
	}
})();