// ゲームコンフィグ
var gameConfig = {
	DEBUG : false
};

(function() {
	// グローバル変数
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	var scene, camera, renderer;
	var stats;

	// 初期化
	init();

	// 初期化
	function init() {
		// シーン
		scene = new THREE.Scene();

		// カメラ
		camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 50000);
		
		// レンダラー
		renderer = new THREE.WebGLRenderer();
		renderer.setSize(WIDTH, HEIGHT);
		renderer.setClearColor(0xffffff, 1);
		document.getElementById("game").appendChild(renderer.domElement);

		// fps表示
		stats = new Stats();
		stats.setMode(0);
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
		if(gameConfig.DEBUG) document.getElementById("game").appendChild(stats.domElement);

		// イベント追加
		window.addEventListener('resize', onWindowResize, false);
		window.addEventListener('keydown', onKeyDown, false);
		window.addEventListener('keyup', onKeyUp, false);

		// ループ開始
		requestAnimationFrame(gameLoop);
	}

	// ゲームループ
	function gameLoop() {
		if(gameConfig.DEBUG) stats.begin();

		renderer.render(scene, camera);

		if(gameConfig.DEBUG) stats.end();
		requestAnimationFrame(gameLoop);
	}

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
		case 114: // key "F3"
		e.preventDefault();
		if (gameConfig.DEBUG) {
			document.getElementById("game").removeChild(stats.domElement);
			gameConfig.DEBUG = !gameConfig.DEBUG;
		} else {
			document.getElementById("game").appendChild(stats.domElement);
			gameConfig.DEBUG = !gameConfig.DEBUG;
		}
		break;
	}

		// console.log(e.keyCode);
	}

	function onKeyUp(e) {

	}
})();