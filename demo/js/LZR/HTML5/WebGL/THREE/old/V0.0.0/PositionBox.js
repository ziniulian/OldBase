// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/WebGL/THREE/PositionBox.js" ]);

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/WebGL/THREE/PositionFace.js"
]);

// 换算地理坐标的方块
LZR.HTML5.WebGL.Three.PositionBox = function (obj) {
	/**
		参数说明：
			x：原点坐标 X
			y：原点坐标 Y
			lng：原点经度
			lat：原点纬度
			time：时间
			scale：比例（米/模型单位）
			min：方块最小值
			max：方块最大值
	*/

	// 原点
	this.origin = {
		x:obj.x,
		y:obj.y,
		lng:new LZR.Util.Geography.Longitude (obj.lng),
		lat:new LZR.Util.Geography.Latitude (obj.lat),
		z:0,

		time: obj.time,
		scale: obj.scale,
		min: obj.min,
		max :obj.max,

		// 实体
		geo: null
	};
};
LZR.HTML5.WebGL.Three.PositionBox.prototype.className = "LZR.HTML5.WebGL.Three.PositionBox";
LZR.HTML5.WebGL.Three.PositionBox.prototype.version = "0.0.0";

// 初始化
LZR.HTML5.WebGL.Three.PositionBox.prototype.init = function (length) {
	if (length > this.origin.max) {
		length = this.origin.max;
	} else if (!length || length < this.origin.min) {
		length = this.origin.min;
	}

	var geo = new THREE.Geometry();
	var x0 = this.origin.x - length;
	var x1 = this.origin.x + length;
	var y0 = this.origin.y - length;
	var y1 = this.origin.y + length;
	geo.vertices.push(new THREE.Vector3(x0, y0, length));
	geo.vertices.push(new THREE.Vector3(x1, y0, length));
	geo.vertices.push(new THREE.Vector3(x0, y1, length));
	geo.vertices.push(new THREE.Vector3(x1, y1, length));
	geo.vertices.push(new THREE.Vector3(x0, y0, 0));
	geo.vertices.push(new THREE.Vector3(x1, y0, 0));
	geo.vertices.push(new THREE.Vector3(x0, y1, 0));
	geo.vertices.push(new THREE.Vector3(x1, y1, 0));
	geo.faceVertexUvs = [[]];
	this.origin.geo = geo;

	// 顶面
	this.top = new LZR.HTML5.WebGL.Three.PositionFace ({
		id: 0,
		name: "顶面",
		origin: this.origin,
		movs: [0, 1, 2, 3],
		axis: "z",
		direction: 1,
		imgs: [0, 1, 2],
		alpha: 0.4
	});

	// 东面
	this.east = new LZR.HTML5.WebGL.Three.PositionFace ({
		id: 1,
		name: "东面",
		origin: this.origin,
		movs: [5,7,1,3],
		axis: "x",
		direction: 1,
		imgs: [0, 5, 7],
		alpha: 0.4
	});

	// 南面
	this.south = new LZR.HTML5.WebGL.Three.PositionFace ({
		id: 2,
		name: "南面",
		origin: this.origin,
		movs: [4,5,0,1],
		axis: "y",
		direction: -1,
		imgs: [0, 4, 5],
		alpha: 0.4
	});

	// 西面
	this.west = new LZR.HTML5.WebGL.Three.PositionFace ({
		id: 3,
		name: "西面",
		origin: this.origin,
		movs: [6,4,2,0],
		axis: "x",
		direction: -1,
		imgs: [0, 6, 4],
		alpha: 0.4
	});

	// 北面
	this.north = new LZR.HTML5.WebGL.Three.PositionFace ({
		id: 4,
		name: "北面",
		origin: this.origin,
		movs: [7,6,3,2],
		axis: "y",
		direction: 1,
		imgs: [0, 7, 6],
		alpha: 0.4
	});

	this.material = new THREE.MeshFaceMaterial ([
		this.top.material, this.east.material, this.south.material, this.west.material, this.north.material
	]);
};

// 生成方块
LZR.HTML5.WebGL.Three.PositionBox.prototype.create = function () {
	return new THREE.Mesh (this.origin.geo.clone(), this.material);
};

// 刷新 5 个面
LZR.HTML5.WebGL.Three.PositionBox.prototype.flush = function () {
	this.top.flush();
	this.east.flush();
	this.south.flush();
	this.west.flush();
	this.north.flush();
};

