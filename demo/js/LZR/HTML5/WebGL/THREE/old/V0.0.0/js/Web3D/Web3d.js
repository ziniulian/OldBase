/*
		<script src="js\Web3D\threejs\three.min.js"></script>
		<script src="js\Web3D\threejs\TrackballControls.js"></script>
		<script src="js\Web3D\threejs\OBJLoader.js"></script>
*/

// 显示 3D
function Web3d (obj) {
	if (obj) {
		this._Web3d (obj);
	}
}
Web3d.prototype._Web3d = function (obj) {
/*
	{
		obj.canvas,				// 画布
		obj.width,				// 场景宽度
		obj.height,				// 场景高度
		obj.fov,				// 透视角度
		obj.cameraPosition:{x, y, z}		// 初始相机位置
		obj.rotateCenter:{x, y, z}		// 旋转中心
		obj.file,				// 3D档路径
	}
*/

	// HTML5画布
	this.canvas = null;

	// 场景宽度
	this.width = 2;

	// 场景高度
	this.height = 2;

	// 描绘器
	this.renderer = null;

	// 背景色
	this.background = 0xcccccc;

	// 照相机近点
	this.near = 0.01;

	// 照相机远点
	this.far = 100000;

	// 场景
	this.scene = null;

	// 照相机
	this.camera = null;

	// 模型
	this.mod = null;

	// 零件集合
	this.meshs = {};

	// 照明
	this.light = null;

	// 控制器
	this.controls = null;

	// 旋转动画ID
	this.rotateId = 0;

	this.init(obj);
};

// 获取对象原型
Web3d.prototype.getClass = function() {
	return Web3d.prototype;
};

// 初始化
Web3d.prototype.init = function(obj) {
	// 生成描绘器
	this.createRanderer(obj);

	// 生成场景
	this.scene = new THREE.Scene();

	// 生成模型
	this.mod = new THREE.Object3D();
	this.scene.add(this.mod);

	// 生成相机
	if (obj.fov) {
		this.camera = new THREE.PerspectiveCamera(obj.fov, this.width/this.height, this.near, this.far);
	} else {
		this.camera = new THREE.OrthographicCamera(this.width/-2, this.width/2, this.height/2, this.height/-2 , this.near, this.far);
		//this.camera = new THREE.OrthographicCamera(this.width/-100, this.width/100, this.height/100, this.height/-100 , this.near, this.far);
	}
	this.scene.add(this.camera);

	// 设置相机位置
	if (obj.cameraPosition) {
		this.camera.position.set(obj.cameraPosition.x, obj.cameraPosition.y, obj.cameraPosition.z);
	} else {
		this.camera.position.set(0, 10, 5);
	}

	// 生成光照
	var ambient = new THREE.AmbientLight( 0x060606);
	this.scene.add( ambient );
	this.light = new THREE.DirectionalLight(0xffff00);
	this.scene.add(this.light);

	// 生成控制器
	this.controls = new THREE.TrackballControls(this.camera, this.canvas);
	this.controls.minDistance = this.near;
	this.controls.maxDistance = this.far;
	this.controls.rotateSpeed = 5.0;
	this.controls.zoomSpeed = 5;
	this.controls.panSpeed = 2;
	this.controls.noZoom = false;
	this.controls.noPan = false;
	this.controls.staticMoving = true;
	this.controls.dynamicDampingFactor = 0.3;

	// 读取档案
	if (obj.file) {
		this.loadObj(obj.file);
	}

	// 启动控制
	this.control();
};

// 生成描绘器
Web3d.prototype.createRanderer = function(obj) {
	if (obj.canvas) {
		this.canvas = obj.canvas;
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.renderer = new THREE.WebGLRenderer({canvas:obj.canvas});
	} else {
		this.renderer = new THREE.WebGLRenderer();
		this.canvas = this.renderer.domElement;
		if (obj.width && obj.height) {
			renderer.setSize(obj.width, obj.height);
		}
		this.width = this.canvas.width;
		this.height = this.canvas.height;
	}
	this.renderer.setClearColor(this.background);
};

// 加载OBJ档案
Web3d.prototype.loadObj = function(url) {
	targThis(this);

	var loader = new THREE.OBJLoader();
	loader.load(url, function(obj) {

		// 双面渲染
		obj.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.material.side = THREE.DoubleSide;
			}
		});

		var self = getThis(new Web3d());
		self.meshs[url] = obj;
		self.mod.add(obj);
		self.flush();
	});
};

// 实体旋转动画
Web3d.prototype.rotate = function() {
	targThis(this);
	this.rotateId = setInterval(function () {
		var self = getThis(new Web3d());
		self.mod.rotation.y += 0.01;
		if (self.mod.rotation.y > Math.PI * 2) {
			self.mod.rotation.y -= Math.PI * 2;
		}
		self.flush();
	}, 20);
};

// 停止实体旋转动画
Web3d.prototype.stopRotate = function() {
	clearInterval(this.rotateId);
};

// 控制实体
Web3d.prototype.control = function() {
	var self = getThis(new Web3d());

	requestAnimationFrame(self.control);
	self.controls.update();
	self.light.position.set(self.camera.position.x, self.camera.position.y, self.camera.position.z);
	self.flush();
};

// 刷新画布
Web3d.prototype.flush = function() {
	this.renderer.render(this.scene, this.camera);
};
