// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/WebGL/THREE/PositionFace.js" ]);

LZR.HTML5.loadJs([
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

			imgUrl：图片路径
	*/

	this.id = obj.id;
	this.name = obj.name;
	this.origin = obj.origin;
	this.movs = obj.movs;
	this.axis = obj.axis;
	this.direction = obj.direction;
	this.distance = obj.distance;
	this.imgs = obj.imgs;

	if (obj.imgUrl) {
		this.imgUrl = obj.imgUrl;
	} else {
		this.imgUrl = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";		// 透明图片
		// this.imgUrl = "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";		// 黑图片
	}

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
LZR.HTML5.WebGL.Three.PositionFace.prototype.version = "0.0.2";

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
	var r = THREE.ImageUtils.loadTexture (this.imgUrl);
	if (this.material) {
		this.material.map = r;
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

// 获取透明度
LZR.HTML5.WebGL.Three.PositionFace.prototype.getAlpha = function (alpha) {
	return this.material.opacity;
};
