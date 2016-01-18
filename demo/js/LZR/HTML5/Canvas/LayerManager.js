// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Canvas/LayerManager.js" ]);

// ----------- 图层管理 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/Graphics/Edge.js",
	LZR.HTML5.jsPath + "HTML5/Canvas/Layer.js",
	LZR.HTML5.jsPath + "HTML5/util/MouseDropController.js"
]);
LZR.HTML5.Canvas.LayerManager = function (obj) {

	// 画布
	this.canvas = obj;

	// 环境
	this.ctx = obj.getContext("2d");

	// 图层集合
	this.layers = [];

	// 缩放系数
	this.zoomScale = 0.1;

	// 留白
	this.offset = {
		left: 0,
		top: 0,
		right: 0,
		bottom: 0
	};

	// 显示区域（边框）
	this.s = new LZR.Util.Graphics.Edge ({
		width: obj.width,
		height: obj.height
	});

	// 最大区域（边框）
	this.max = new LZR.Util.Graphics.Edge ({
		width: obj.width,
		height: obj.height
	});
	this.max.addChild (this.s);

	// 最小区域（边框）
	this.min = new LZR.Util.Graphics.Edge ({
		width: 5,
		height: 5
	});
	this.s.addChild (this.min);

	// 控制器
	this.ctrl = new LZR.HTML5.Util.MouseDropController(obj);

	// 方便计算的假常量
	this.constant = {};

	// 平移不超出父边框
	this.autoMove = true;

	// 缩放不超出父边框
	this.autoZoom = true;
};
LZR.HTML5.Canvas.LayerManager.prototype.className = "LZR.HTML5.Canvas.LayerManager";
LZR.HTML5.Canvas.LayerManager.prototype.version = "0.0.3";

// 初始化
LZR.HTML5.Canvas.LayerManager.prototype.init = function () {
	this.s.rrByParent();	// 显示区域适应最大区域

	this.constant.d = LZR.HTML5.Util.getDomPositionForDocument(this.canvas);	// 画布位置
	this.constant.w= this.canvas.width - this.offset.left - this.offset.right;		// 绘图部分的宽
	this.constant.h = this.canvas.height - this.offset.top - this.offset.bottom;		// 绘图部分的高

	if (this.ctrl.state === this.ctrl.STATE.UNABLE) {
		this.ctrl.noMid = true;
		this.ctrl.noRight = true;
		this.ctrl.noClick = true;
		this.ctrl.noCurrentMove = false;
		this.ctrl.enable();
	}
};

// 添加图层（图层对象, 图层名）
LZR.HTML5.Canvas.LayerManager.prototype.addLayer = function ( layer, name ) {
	if ( layer.getType && layer.getType() >=0 ) {
		if (name) {
			layer.name = name;
		}
		this.layers.push (layer);
		return true;
	} else {
		return false;
	}
};

// 删除图层（序号）
LZR.HTML5.Canvas.LayerManager.prototype.delLayer = function ( index ) {
	this.layers.splice(index, 1);
};

// 获取图层序号（图层名）:图层序列号
LZR.HTML5.Canvas.LayerManager.prototype.getIndexByName = function ( name ) {
	for (var i=0; i<this.layers.length; i++) {
		if (this.layers[i].name == name) {
			return i;
		}
	}
};

// 刷新画布
LZR.HTML5.Canvas.LayerManager.prototype.flush = function () {

	// 清空画布
	this.ctx.clearRect (0, 0, this.canvas.width, this.canvas.height);

	// // 还原坐标变换
	// this.ctx.setTransform(1, 0, 0, 1, 0, 0);

	// 加载各图层图片
	for (var i=0; i<this.layers.length; i++) {
		this.layers[i].draw (this.ctx, this.s.left, this.s.top, this.s.w, this.s.h, this.offset.left, this.offset.top, this.constant.w, this.constant.h);
	}

	// 额外画图
	this.autoFlush ( this.ctx, this.offset.left, this.offset.top, this.constant.w, this.constant.h );
};

// 所有图层整体平移（向量）
LZR.HTML5.Canvas.LayerManager.prototype.pan = function (x, y) {
	if (this.autoMove) {
		this.s.moveInParent (x, y, this.max);
	} else {
		this.s.move(x, y);
	}
	// this.s.floor();	// 取整后误差太大
};

// 所有图层整体缩放（缩放量，缩放中心点坐标）
LZR.HTML5.Canvas.LayerManager.prototype.zoom = function (s, x, y) {
	s *= this.zoomScale;
	if (s<0) {
		// 缩小
		s = 1.0/(1.0-s);
	} else if (s !== 0) {
		// 放大
		s += 1.0;
	}

	if (this.autoZoom) {
		this.s.zoomInParent (s, x, y, this.max, this.min);
	} else {
		this.s.zoom(s, x, y);
	}
	// this.s.floor();	// 取整后误差太大
};

// 更新鼠标事件
LZR.HTML5.Canvas.LayerManager.prototype.ctrlUpdate = function() {
	var x, y;
	if (this.ctrl.state == this.ctrl.STATE.LEFT) {
		// 平移
		x = (this.ctrl.leftStart.x - this.ctrl.leftEnd.x) * this.s.scale();
		y = (this.ctrl.leftStart.y - this.ctrl.leftEnd.y) * this.s.scale();
		this.ctrl.leftStart = LZR.HTML5.Util.clone(this.ctrl.leftEnd);
		this.pan(x, y);
	} else if ( this.ctrl.wheelValue !== 0) {
		// 缩放
		var s = -this.ctrl.wheelValue;
		this.ctrl.wheelValue = 0;
		x = (this.ctrl.currentPage.x - this.constant.d.left) * this.s.scale();
		y = (this.ctrl.currentPage.y - this.constant.d.top) * this.s.scale();
		this.zoom (s, x, y);
	}
};

// 启动图层管理器的鼠标响应功能
LZR.HTML5.Canvas.LayerManager.prototype.ctrlEnable = function () {
	if (this.ctrl.state === this.ctrl.STATE.UNABLE) {
		this.ctrl.enable ();
	}
};

// 停止图层管理器的鼠标响应功能
LZR.HTML5.Canvas.LayerManager.prototype.ctrlDisable = function () {
	if (this.ctrl.state !== this.ctrl.STATE.UNABLE) {
		this.ctrl.disable();
	}
};

// 交换图层位置
LZR.HTML5.Canvas.LayerManager.prototype.changeIndex = function (index1, index2) {
	var t = this.layers[index1];
	this.layers[index1] = this.layers[index2];
	this.layers[index2] = t;
};

// 重新计算尺寸
LZR.HTML5.Canvas.LayerManager.prototype.resize = function () {
	// LZR.HTML5.log(this.canvas.clientWidth);
	LZR.HTML5.Util.mateWidth (this.canvas);
	this.s.reset ({
		left: this.max.left,
		top: this.max.top,
		width: this.canvas.width,
		height: this.canvas.height
	});
	this.init();
};

// 重设最大区域
LZR.HTML5.Canvas.LayerManager.prototype.resetMax = function (top, left, width, height) {
	this.max.reset({
		top: top,
		left: left,
		width: width,
		height: height
	});
	this.s.rrByParent();
};

// 重设最小区域
LZR.HTML5.Canvas.LayerManager.prototype.resetMin = function (top, left, width, height) {
	this.min.reset({
		top: top,
		left: left,
		width: width,
		height: height
	});
};

// 获取最大区域中的点在显示区域中的比例坐标
LZR.HTML5.Canvas.LayerManager.prototype.getScalePixelFromMax = function (x, y) {
	x -= this.s.left;
	y -= this.s.top;
	x /= this.s.w;
	y /= this.s.h;
	return [x, y];
};

// 刷新时的额外画图（接口）
LZR.HTML5.Canvas.LayerManager.prototype.autoFlush = function (ctx, x, y, w, h) {};

// 导出图片（...）:？？？

