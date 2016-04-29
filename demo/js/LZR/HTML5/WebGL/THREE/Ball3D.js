// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/WebGL/THREE/Ball3D.js" ]);

// ---------------- 3D球控制场景 -----------------------
if (!window.THREE) {
	LZR.HTML5.loadJs([
		LZR.HTML5.jsPath + "HTML5/expand/threejs/three.min.js",
		LZR.HTML5.jsPath + "HTML5/expand/threejs/OBJLoader.js",
		LZR.HTML5.jsPath + "HTML5/expand/threejs/TrackballControls.js"
	]);
}
LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/Util.js"
]);
LZR.HTML5.WebGL.Three.Ball3D = function (obj) {
/*
	参数说明：
	{
		obj.canvas,				// 画布
		obj.width,				// 场景宽度
		obj.height,				// 场景高度
		obj.fov,					// 透视角度
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
	this.backColor = isNaN(obj.backColor) ? 0xcccccc : obj.backColor;

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
LZR.HTML5.WebGL.Three.Ball3D.prototype.className = "LZR.HTML5.WebGL.Three.Ball3D";
LZR.HTML5.WebGL.Three.Ball3D.prototype.version = "0.0.2";

// 初始化
LZR.HTML5.WebGL.Three.Ball3D.prototype.init = function(obj) {
	// 生成描绘器
	this.createRanderer(obj);

	// 生成场景
	this.scene = new THREE.Scene();
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
	this.controls = new THREE.TrackballControls (this.camera, this.canvas);
	if (obj.minCtrlDistance) {
		this.controls.minDistance = obj.minCtrlDistance;
	}
	if (obj.maxCtrlDistance) {
		this.controls.maxDistance = obj.maxCtrlDistance;
	}

	// 启动控制
	this.control();

	// 读取档案
	if (obj.file) {
		this.load3D(obj.file);
	}
};

// 生成描绘器
LZR.HTML5.WebGL.Three.Ball3D.prototype.createRanderer = function(obj) {
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
LZR.HTML5.WebGL.Three.Ball3D.prototype.load3D = function(url) {
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
LZR.HTML5.WebGL.Three.Ball3D.prototype.appendMesh = function(name, mesh) {
	this.meshs[name] = mesh;
	this.mod.add(mesh);
	this.flush();
};

// 删除实体
LZR.HTML5.WebGL.Three.Ball3D.prototype.removeMesh = function(name) {
	this.mod.remove(this.meshs[name]);
	this.flush();
};

// 加载JSON档案
LZR.HTML5.WebGL.Three.Ball3D.prototype.loadJson = function(url) {
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
LZR.HTML5.WebGL.Three.Ball3D.prototype.loadObj = function(url) {
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
LZR.HTML5.WebGL.Three.Ball3D.prototype.rotate = function() {
	this.rotateId = setInterval ( LZR.HTML5,Util.bind (this, function(){
		this.mod.rotation.y += 0.01;
		if (this.mod.rotation.y > Math.PI * 2) {
			this.mod.rotation.y -= Math.PI * 2;
		}
		this.flush();
	}), 20);
};

// 停止实体旋转动画
LZR.HTML5.WebGL.Three.Ball3D.prototype.stopRotate = function() {
	clearInterval(this.rotateId);
};

// 控制实体
LZR.HTML5.WebGL.Three.Ball3D.prototype.control = function() {
	requestAnimationFrame( LZR.HTML5.Util.bind ( this, this.control ) );
	this.controls.update();
	this.flush();
};

// 刷新画布
LZR.HTML5.WebGL.Three.Ball3D.prototype.flush = function() {
	this.renderer.render(this.scene, this.camera);
};
