// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/WebGL/THREE/Web3d.js" ]);

// ---------------- 显示 3D -----------------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/expand/threejs/three.js",
	LZR.HTML5.jsPath + "HTML5/expand/threejs/OBJLoader.js",
	LZR.HTML5.jsPath + "HTML5/util/Util.js",
	LZR.HTML5.jsPath + "HTML5/WebGL/THREE/OrthographicControl.js"
]);
LZR.HTML5.WebGL.Three.Web3d = function (obj) {
/*
	参数说明：
	{
		obj.canvas,				// 画布
		obj.width,				// 场景宽度
		obj.height,				// 场景高度
		obj.fov,				// 透视角度
		obj:zoom,				// 正交缩放比例
		obj.cameraPosition:{x, y, z},		// 初始相机位置
		obj.center:{x, y, z},			// 旋转中心
		obj.backColor,			// 背景色
		obj.file,				// 3D档路径
	}
*/

	// HTML5画布
	this.canvas = null;

	// 场景宽度
	this.width = 0;

	// 场景高度
	this.height = 0;

	// 描绘器
	this.renderer = null;

	// 背景色
	this.backColor = obj.backColor ? obj.backColor : 0xcccccc;

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

	// 旋转中心
	this.center = obj.center ? new THREE.Vector3(obj.center.x, obj.center.y, obj.center.z) : new THREE.Vector3(0, 0, 0);

	// 旋转动画ID
	this.rotateId = 0;

	// 坐标系测试线
	this.testLine = [];

	this.init(obj);
};
LZR.HTML5.WebGL.Three.Web3d.prototype.className = "LZR.HTML5.WebGL.Three.Web3d";
LZR.HTML5.WebGL.Three.Web3d.prototype.version = "0.0.3";

// 初始化
LZR.HTML5.WebGL.Three.Web3d.prototype.init = function(obj) {
	// 生成描绘器
	this.createRanderer(obj);

	// 生成场景
	this.scene = new THREE.Scene();
	// this.addCenterCoo();
	// this.addSceneCoo();

	// 生成模型
	this.mod = new THREE.Object3D();
	this.scene.add(this.mod);

	// 生成相机
	if (obj.fov) {
		this.camera = new THREE.PerspectiveCamera(obj.fov, this.width/this.height, this.near, this.far);
	} else {
		this.near = -this.far;
		this.camera = new THREE.OrthographicCamera(this.width/-2, this.width/2, this.height/2, this.height/-2, this.near, this.far);
		if (obj.zoom) {
			this.camera.zoom = obj.zoom;
			this.camera.updateProjectionMatrix();
		}
	}
	this.scene.add(this.camera);

	// 设置相机位置
	if (obj.cameraPosition) {
		this.camera.position.set(obj.cameraPosition.x, obj.cameraPosition.y, obj.cameraPosition.z);
	} else {
		this.camera.position.set(0, 0, 1);
	}

	// 生成光照
	var ambient = new THREE.AmbientLight( 0x060606);
	this.scene.add(ambient);
	this.light = new THREE.DirectionalLight(0xffffff);
	this.light.position.copy(this.camera.position);
	this.scene.add(this.light);

	// 生成控制器
	this.controls = new LZR.HTML5.WebGL.Three.OrthographicControl ({
		ctrlDom: this.canvas,
		camera: this.camera,
		light: this.light,
		center: this.center
	});

	// 启动控制
	this.controls.enable();
	this.control();

	// 读取档案
	if (obj.file) {
		this.load3D(obj.file);
	}
};

// 生成描绘器
LZR.HTML5.WebGL.Three.Web3d.prototype.createRanderer = function(obj) {
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
	this.renderer.setClearColor(this.backColor);
};

// 加载3D档案
LZR.HTML5.WebGL.Three.Web3d.prototype.load3D = function(url) {
	switch (LZR.HTML5.Util.getFileExtension(url)) {
		case "obj":
			this.loadObj(url);
			break;
		default:
			this.loadJson(url);
			break;
	}
};

// 加入实体
LZR.HTML5.WebGL.Three.Web3d.prototype.appendMesh = function(name, mesh) {
	this.meshs[name] = mesh;
	this.mod.add(mesh);
	this.flush();
};

// 删除实体
LZR.HTML5.WebGL.Three.Web3d.prototype.removeMesh = function(name) {
	this.mod.remove(this.meshs[name]);
	this.flush();
};

// 加载JSON档案
LZR.HTML5.WebGL.Three.Web3d.prototype.loadJson = function(url) {
	var loader = new THREE.JSONLoader();
	loader.load(url, LZR.HTML5.Util.bind (this, function(geometry, materials ) {
			// geometry = new THREE.CubeGeometry(100,100,100);
			// var texture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg');
			// var material = new THREE.MeshBasicMaterial({ map: texture });

			// 双面渲染
			for (var i=0; i<materials.length; i++) {
				materials[i].side = THREE.DoubleSide;
			}
			var material = new THREE.MeshFaceMaterial( materials /*{ color: 'red', wireframe: true }*/ );
			var mesh = new THREE.Mesh( geometry, material );

			this.meshs[url] = mesh;
			this.mod.add(mesh);
			this.flush();
	}));
};

// 加载OBJ档案
LZR.HTML5.WebGL.Three.Web3d.prototype.loadObj = function(url) {
	var loader = new THREE.OBJLoader();
	loader.load(url, LZR.HTML5.Util.bind (this, function(obj) {
		// 双面渲染
		obj.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.material.side = THREE.DoubleSide;
			}
		});

		this.meshs[url] = obj;
		this.mod.add(obj);
		this.flush();
	}));
};

// 实体旋转动画
LZR.HTML5.WebGL.Three.Web3d.prototype.rotate = function() {
	this.rotateId = setInterval ( LZR.HTML5,Util.bind (this, function(){
		this.mod.rotation.y += 0.01;
		if (this.mod.rotation.y > Math.PI * 2) {
			this.mod.rotation.y -= Math.PI * 2;
		}
		this.flush();
	}), 20);
};

// 停止实体旋转动画
LZR.HTML5.WebGL.Three.Web3d.prototype.stopRotate = function() {
	clearInterval(this.rotateId);
};

// 控制实体
LZR.HTML5.WebGL.Three.Web3d.prototype.control = function() {
	requestAnimationFrame( LZR.HTML5.Util.bind ( this, this.control ) );
	this.controls.update();
	// this.delCameraCoo();	// 消除相机坐标
	// this.addCameraCoo();	// 更新相机坐标
	this.flush();
};

// 添加场景坐标系
LZR.HTML5.WebGL.Three.Web3d.prototype.addSceneCoo = function() {
	if (this.testLine["sceneX"]) return;
	var po = new THREE.Vector3(0, 0, 0);
	this.testLine["sceneX"] = this.line(po, new THREE.Vector3(10000, 0, 0), 0xff0000);
	this.testLine["sceneY"] = this.line(po, new THREE.Vector3(0, 10000, 0), 0x00ff00);
	this.testLine["sceneZ"] = this.line(po, new THREE.Vector3(0, 0, 10000), 0x0000ff);
	this.scene.add(this.testLine.sceneX);
	this.scene.add(this.testLine.sceneY);
	this.scene.add(this.testLine.sceneZ);
};

// 删除场景坐标系
LZR.HTML5.WebGL.Three.Web3d.prototype.delSceneCoo = function() {
	if (!this.testLine["sceneX"]) return;
	this.scene.remove(this.testLine.sceneX);
	this.scene.remove(this.testLine.sceneY);
	this.scene.remove(this.testLine.sceneZ);
	LZR.HTML5.Util.del (this.testLine.sceneX);
	LZR.HTML5.Util.del (this.testLine.sceneY);
	LZR.HTML5.Util.del (this.testLine.sceneZ);
};

// 添加旋转中心坐标系
LZR.HTML5.WebGL.Three.Web3d.prototype.addCenterCoo = function() {
	if (this.testLine["centerX"]) return;
	this.testLine["centerX"] = this.line(this.center, new THREE.Vector3(10000, 0, 0).add(this.center), 0xff0000);
	this.testLine["centerY"] = this.line(this.center, new THREE.Vector3(0, 10000, 0).add(this.center), 0x00ff00);
	this.testLine["centerZ"] = this.line(this.center, new THREE.Vector3(0, 0, 10000).add(this.center), 0x0000ff);
	this.scene.add(this.testLine.centerX);
	this.scene.add(this.testLine.centerY);
	this.scene.add(this.testLine.centerZ);
};

// 删除旋转中心坐标系
LZR.HTML5.WebGL.Three.Web3d.prototype.delCenterCoo = function() {
	if (!this.testLine["centerX"]) return;
	this.scene.remove(this.testLine.centerX);
	this.scene.remove(this.testLine.centerY);
	this.scene.remove(this.testLine.centerZ);
	LZR.HTML5.Util.del (this.testLine.centerX);
	LZR.HTML5.Util.del (this.testLine.centerY);
	LZR.HTML5.Util.del (this.testLine.centerZ);
};

// 添加相机坐标系
LZR.HTML5.WebGL.Three.Web3d.prototype.addCameraCoo = function() {
	if (this.testLine["camerarX"]) return;
	this.testLine["camerarX"] = this.line(this.controls.rigid.look, this.controls.rigid.x, 0xff0000);
	this.testLine["camerarY"] = this.line(this.controls.rigid.look, this.controls.rigid.y, 0x00ff00);
	this.testLine["camerarZ"] = this.line(this.controls.rigid.look, this.controls.rigid.z, 0x0000ff);
	this.scene.add(this.testLine.camerarX);
	this.scene.add(this.testLine.camerarY);
	this.scene.add(this.testLine.camerarZ);
};

// 删除相机坐标系
LZR.HTML5.WebGL.Three.Web3d.prototype.delCameraCoo = function() {
	if (!this.testLine["camerarX"]) return;
	this.scene.remove(this.testLine.camerarX);
	this.scene.remove(this.testLine.camerarY);
	this.scene.remove(this.testLine.camerarZ);
	LZR.HTML5.Util.del (this.testLine.camerarX);
	LZR.HTML5.Util.del (this.testLine.camerarY);
	LZR.HTML5.Util.del (this.testLine.camerarZ);
};

// 刷新画布
LZR.HTML5.WebGL.Three.Web3d.prototype.flush = function() {
	this.renderer.render(this.scene, this.camera);
};

// 画线
LZR.HTML5.WebGL.Three.Web3d.prototype.line = function (p1, p2, colorValue) {
	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial( { color: colorValue } );
	//var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );
	//var color = new THREE.Color(colorValue);
	//geometry.colors.push( color, color);
	geometry.vertices.push(p1);
	geometry.vertices.push(p2);
	var line = new THREE.Line( geometry, material, THREE.LinePieces );
	return line;
};
