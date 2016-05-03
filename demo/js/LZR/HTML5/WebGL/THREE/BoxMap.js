// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/WebGL/THREE/BoxMap.js" ]);

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/WebGL/THREE/Ball3D.js",
	LZR.HTML5.jsPath + "HTML5/WebGL/THREE/PositionBox.js",
	LZR.HTML5.jsPath + "HTML5/util/Scroll.js",
	LZR.HTML5.jsPath + "HTML5/util/Event.js"
]);

// 地图盒子
LZR.HTML5.WebGL.Three.BoxMap = function (obj) {
	this.map = {
		w: 1000,
		h: 1000,
		data: "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",	// 黑色背景
		obj: null
	};

	this.box = {
		minlon: 0,
		minlat: 0,
		maxlon: 0,
		maxlat: 0,
		top: 250,
		left: 250,
		w: 500,
		h: 500,
		z: 300,
		obj: null,
		ctrl: null
	};

	this.cav = null;
	this.view = null;
	this.center = null;
	this.min = 0;
	this.max = 0;
};
LZR.HTML5.WebGL.Three.BoxMap.prototype.className = "LZR.HTML5.WebGL.Three.BoxMap";
LZR.HTML5.WebGL.Three.BoxMap.prototype.version = "0.0.2";

// 初始化地图
LZR.HTML5.WebGL.Three.BoxMap.prototype.initMap = function() {
	if (this.map.w < this.map.h) {
		this.max = this.map.h;
	} else {
		this.max = this.map.w;
	}
	if (this.max < this.box.z) {
		this.max = this.box.z;
	}
	this.center = {
		x: this.box.left + this.box.w/2,
		y: this.box.top + this.box.h/2,
		z: 0
	};
	if (this.center.x < this.center.y) {
		this.min = this.center.x;
	} else {
		this.min = this.center.y;
	}
	if ((this.map.h - this.center.y) < this.min) {
		this.min = this.map.h - this.center.y;
	}

	var g = new THREE.PlaneGeometry(this.map.w, this.map.h);
	g.vertices[0].x = -this.center.x;
	g.vertices[0].y = this.center.y;
	g.vertices[1].x = this.map.w - this.center.x;
	if (g.vertices[1].x < this.min) {
		this.min = g.vertices[1].x;
	}
	g.vertices[1].y = this.center.y;
	g.vertices[2].x = -this.center.x;
	g.vertices[2].y = this.center.y - this.map.h;
	g.vertices[3].x = this.map.w - this.center.x;
	g.vertices[3].y = this.center.y - this.map.h;

	this.map.obj = new THREE.Mesh (
		g,
		new THREE.MeshBasicMaterial ({
			map:THREE.ImageUtils.loadTexture (this.map.data),
			side:THREE.DoubleSide
		})
	);
};

// 初始化盒子
LZR.HTML5.WebGL.Three.BoxMap.prototype.initBox = function(alpha) {
	this.box.obj = new LZR.HTML5.WebGL.Three.PositionBox( {
		x: 0,
		y: 0,
		lat: this.box.minlat + (this.box.maxlat - this.box.minlat)/2,
		lng: this.box.minlon + (this.box.maxlon - this.box.minlon)/2,
		min: 1,
		max: this.min,
		imgUrl: {}
	});
	this.box.obj.init(this.box.w/2, this.box.h/2, this.box.z, alpha);
	this.box.obj.create();
};

// 初始化3D场景
LZR.HTML5.WebGL.Three.BoxMap.prototype.initCav = function (backColor) {
	this.wb = new LZR.HTML5.WebGL.Three.Ball3D ({
		fov: 75,
		minCtrlDistance: 10,
		maxCtrlDistance: this.max,
		cameraPosition: {
			x: 0,
			y: -this.max/2,
			z: this.max/2.5
		},
		backColor: backColor,
		canvas: this.cav
	});

	this.wb.appendMesh( "map",  this.map.obj);
	this.wb.appendMesh( "box",  this.box.obj.create());
};

// 初始化透明控制器
LZR.HTML5.WebGL.Three.BoxMap.prototype.initCtrl = function (div, strip, btn) {
	this.view = div;
	this.box.ctrl = {
		top: "上",
		east: "东",
		south: "南",
		west: "西",
		north: "北"
	};
	var ctrlA = function (f, p) {
		f.setAlpha(p/100);
	};
	var s, nam;
	for (s in this.box.ctrl) {
		nam = this.box.ctrl[s];
		this.box.ctrl[s] = new LZR.HTML5.Util.Scroll({
			count: 100,
			position: this.box.obj[s].getAlpha() * 100,
			direction: 1,
			autoLen: 1,
			autoMin: 30,
			padd: 0,
			len: "100%",
			stripClass: strip,
			btnClass: btn,
			div: div
		});
		this.box.ctrl[s].btn.innerHTML = nam;
		this.box.ctrl[s].init();
		this.box.ctrl[s].ctrlEnable();
		this.box.ctrl[s].onchange = LZR.bind(this, ctrlA, this.box.obj[s]);
	}
};

// 初始化
LZR.HTML5.WebGL.Three.BoxMap.prototype.init = function (obj) {
	/**
		obj 参数说明：
			mapW: 1000,	// 地图宽（像素）
			mapH: 1000,	// 地图高（像素）
			mapData: "data/map.jpg",	// 地图（Base64）
			boxMinlon: 0,	// 最小经度
			boxMinlat: 0,	// 最小纬度
			boxMaxlon: 0,	// 最大经度
			boxMaxlat: 0,	// 最大纬度
			boxTop: 250,	// 相对地图上边的距离（像素）
			boxLeft: 250,	// 相对地图左边的距离（像素）
			boxW: 500,	// X方向宽度（像素）
			boxH: 500,	// Y方向高度（像素）
			boxZ: 300,	// Z方向高度（像素）
			alpha: 0.5,	// 透明度
			div: map,	// 装载画布的容器
			cav: document.getElementById("mainCanvas"),	// 画布
			backColor: 0,	// 背景色
	*/
	if (!isNaN(obj.mapW)) {
		this.map.w = obj.mapW;
	}
	if (!isNaN(obj.mapH)) {
		this.map.h = obj.mapH;
	}
	if (obj.mapData) {
		this.map.data = obj.mapData;
	}
	if (!isNaN(obj.boxMinlon)) {
		this.box.minlon = obj.boxMinlon;
	}
	if (!isNaN(obj.boxMinlat)) {
		this.box.minlat = obj.boxMinlat;
	}
	if (!isNaN(obj.boxMaxlon)) {
		this.box.maxlon = obj.boxMaxlon;
	}
	if (!isNaN(obj.boxMaxlat)) {
		this.box.maxlat = obj.boxMaxlat;
	}
	if (!isNaN(obj.boxTop)) {
		this.box.top = obj.boxTop;
	}
	if (!isNaN(obj.boxLeft)) {
		this.box.left = obj.boxLeft;
	}
	if (!isNaN(obj.boxW)) {
		this.box.w = obj.boxW;
	}
	if (!isNaN(obj.boxH)) {
		this.box.h = obj.boxH;
	}
	if (!isNaN(obj.boxZ)) {
		this.box.z = obj.boxZ;
	}
	if (isNaN(obj.alpha)) {
		obj.alpha = 0.4;
	}
	if (!obj.backColor) {
		obj.backColor = 0;
	}
	if (obj.cav) {
		this.cav = obj.cav;
	} else {
		this.cav = document.createElement("canvas");
		this.cav.width = 800;
		this.cav.height = 600;
		if (obj.div) {
			this.cav.style.width = "100%";
			this.cav.style.height = "100%";
			obj.div.appendChild(this.cav);
			this.cav.width = this.cav.clientWidth;
			this.cav.height = this.cav.clientHeight;
		}
	}

	// 给画布添加resize事件
	LZR.HTML5.Util.Event.addEvent (window, "resize", LZR.bind(this, function() {
		this.cav.width = this.cav.clientWidth;
		this.cav.height = this.cav.clientHeight;
	}), false);

	this.initMap();
	this.initBox(obj.alpha);
	this.initCav(obj.backColor);
};

// 透明度设置
LZR.HTML5.WebGL.Three.BoxMap.prototype.setAlpha = function (facNam, alpha) {
	if (this.box.ctrl) {
		this.box.ctrl[facNam].setPosition(alpha * 100);
	} else {
		this.box.obj[facNam].setAlpha(alpha);
	}
};

// 刷新图片
LZR.HTML5.WebGL.Three.BoxMap.prototype.flush = function (imgUrl) {
	/**
		参数说明：
			top: "data/map.jpg",	// 图片（Base64）
			east: "data/map.jpg",	// 图片（Base64）
			south: "data/map.jpg",	// 图片（Base64）
			west: "data/map.jpg",	// 图片（Base64）
			north: "data/map.jpg",	// 图片（Base64）
			map: "data/map.jpg"	// 图片（Base64）
	*/
	if (imgUrl.top) {
		this.box.obj.top.imgUrl = imgUrl.top;
	}
	if (imgUrl.east) {
		this.box.obj.east.imgUrl = imgUrl.east;
	}
	if (imgUrl.south) {
		this.box.obj.south.imgUrl = imgUrl.south;
	}
	if (imgUrl.west) {
		this.box.obj.west.imgUrl = imgUrl.west;
	}
	if (imgUrl.north) {
		this.box.obj.north.imgUrl = imgUrl.north;
	}
	this.box.obj.flush();

	if (imgUrl.map) {
		this.map.obj.material.map = THREE.ImageUtils.loadTexture (imgUrl.map);
		this.map.data = imgUrl.map;
	}
};
