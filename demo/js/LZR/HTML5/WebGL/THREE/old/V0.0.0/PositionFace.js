// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/WebGL/THREE/PositionFace.js" ]);

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/expand/json2.js",
	LZR.HTML5.jsPath + "HTML5/expand/threejs/three.js",
	LZR.HTML5.jsPath + "util/Geography/Longitude.js",
	LZR.HTML5.jsPath + "util/Geography/Latitude.js"
]);

// 地理坐标方块的面
LZR.HTML5.WebGL.Three.PositionFace = function (obj) {
	/**
		参数说明：
			origin：继承 PositionBox的原点信息
			id：平面编号（0号为顶面）
			name：名字
			movs：移动点
			axis：轴
			direction：方向
			distance：距离
			imgs：图像点（计算图片参数需要的位置信息）
				[高度点、一点、二点]
	*/

	this.id = obj.id;
	this.name = obj.name;
	this.origin = obj.origin;
	this.movs = obj.movs;
	this.axis = obj.axis;
	this.direction = obj.direction;
	this.distance = obj.distance;
	this.imgs = obj.imgs;

	this.init();

	// 材质
	this.material = new THREE.MeshBasicMaterial ({
		map: this.flush(),
		overdraw:true,
		side:THREE.DoubleSide,
		transparent:true,
		blending:THREE.NormalBlending,
		opacity:obj.alpha
	});
};
LZR.HTML5.WebGL.Three.PositionFace.prototype.className = "LZR.HTML5.WebGL.Three.PositionFace";
LZR.HTML5.WebGL.Three.PositionFace.prototype.version = "0.0.0";

// 初始化
LZR.HTML5.WebGL.Three.PositionFace.prototype.init = function () {

	var fc = new THREE.Face3(this.movs[0], this.movs[1], this.movs[2]);
	fc.materialIndex = this.id;
	this.origin.geo.faces.push(fc);
	this.origin.geo.faceVertexUvs[0].push([
			new THREE.Vector2(0, 0),
			new THREE.Vector2(1, 0),
			new THREE.Vector2(0, 1)]);

	fc = new THREE.Face3(this.movs[1], this.movs[2], this.movs[3]);
	fc.materialIndex = this.id;
	this.origin.geo.faces.push(fc);
	this.origin.geo.faceVertexUvs[0].push([
			new THREE.Vector2(1, 0),
			new THREE.Vector2(0, 1),
			new THREE.Vector2(1, 1)]);

};

// 修改距离
LZR.HTML5.WebGL.Three.PositionFace.prototype.setDistance = function (distance) {
	if (distance > this.origin.max) {
		distance = this.origin.max;
	} else if (distance < this.origin.min) {
		distance = this.origin.min;
	}

	if (this.distance != distance) {
		this.distance = distance;
		var vs = this.origin.geo.vertices;
		var d = this.origin[this.axis] + distance*this.direction;
		for (var i=0; i<this.movs.length; i++) {
			vs [ this.movs[i] ] [this.axis] = d;
		}
		this.flush();
	}

	return distance;
};

// 刷新图片
LZR.HTML5.WebGL.Three.PositionFace.prototype.flush = function () {
	/**
		图片参数说明：
			lng1：第一点经度
			lat1：第一点纬度
			lng2：第二点经度
			lat2：第二点纬度
			hight：高度
			time：时间
			type：类型。"top"（顶面）、"side"（侧面）
	*/
	var obj = {};

	// 计算所需的图片参数
	var v0 = this.origin;
	var vs = v0.geo.vertices;
	var p = vs [ this.imgs[1] ];
	obj.lat1 = v0.lat.clone();
	obj.lat1.add( v0.scale* (p.y - v0.y) );
	obj.lng1 = v0.lng.clone();
	obj.lng1.add(obj.lat1, v0.scale* (p.x - v0.x) );
	p = vs [ this.imgs[2] ];
	obj.lat2 = v0.lat.clone();
	obj.lat2.add( v0.scale* (p.y - v0.y) );
	obj.lng2 = v0.lng.clone();
	obj.lng2.add(obj.lat2, v0.scale* (p.x - v0.x) );
	p = vs [ this.imgs[0] ];
	obj.hight = v0.scale* (p.z - v0.z);
	obj.time = v0.time;

	if (this.id === 0) {
		obj.type = "top";
	} else {
		obj.type = "side";
	}

	// var r = THREE.ImageUtils.loadTexture ( "data/" + parseInt ( Math.random()*10+1 ) + ".jpg" );
	var r = THREE.ImageUtils.loadTexture (LZR.HTML5.upPath (7) + "data/融昭普瑞DemoImg/" + parseInt(Math.random()*10+1, 10) + ".jpg");
	if (this.material) {
		this.material.map = r;

		// 数据测试
		LZR.HTML5.log ("");
		LZR.HTML5.alog (this.name);
		LZR.HTML5.alog (obj.lng1.getCoordinateForm().print());
		LZR.HTML5.alog (obj.lat1.getCoordinateForm().print());
		LZR.HTML5.alog (obj.lng2.getCoordinateForm().print());
		LZR.HTML5.alog (obj.lat2.getCoordinateForm().print());
		LZR.HTML5.alog (obj.hight);
		LZR.HTML5.alog (obj.time);
		LZR.HTML5.alog (obj.type);
	}
	return r;
};

// 设置透明度
LZR.HTML5.WebGL.Three.PositionFace.prototype.setAlpha = function (alpha) {
	if (alpha >1) {
		alpha = 1;
	} else if (alpha < 0) {
		alpha = 0;
	}

	this.material.opacity = alpha;

	return alpha;
};
