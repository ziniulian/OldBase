// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Canvas/LayerMgrEys.js" ]);

// ----------- 图层管理之鹰眼 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/Canvas/LayerManager.js"
]);
LZR.HTML5.Canvas.LayerMgrEys = function (obj) {
	/*
		参数说明：
			canvas:	// 画布
			layerMgr:	// 图层管理对象
	*/

	// 画布
	this.canvas = obj.canvas;

	// 图层管理器
	this.layerMgr = obj.layerMgr;

	// 环境
	this.ctx = this.canvas.getContext("2d");

	// 图层管理器显示范围（边框）
	this.lmEdge = new LZR.Util.Graphics.Edge ({
		width: this.layerMgr.max.w,
		height: this.layerMgr.max.h
	});

	// 最大边框
	this.max = new LZR.Util.Graphics.Edge ({
		width: this.canvas.width,
		height: this.canvas.height
	});
	this.max.addChild (this.lmEdge);

	// 控制器
	this.ctrl = new LZR.HTML5.Util.MouseDropController(this.canvas);

	// 区域显示颜色
	this.showColor = "#cccccc";

	// 区域背景色颜色
	this.backColor = null;

	// 区域颜色透明度
	this.colorAlpha = 0.3;

	// 背景图层
	this.layers = [];

	// 方便计算的假常量
	this.constant = {};
};
LZR.HTML5.Canvas.LayerMgrEys.prototype.className = "LZR.HTML5.Canvas.LayerMgrEys";
LZR.HTML5.Canvas.LayerMgrEys.prototype.version = "0.0.0";

// 初始化
LZR.HTML5.Canvas.LayerMgrEys.prototype.init = function () {
	this.lmEdge.rrByParent();	// 内容管理器边框适应画布区域
	this.layers = this.layerMgr.layers;	// 与图层管理器内容绑定
	this.lmEdge.alineInParent("center");	// 内容管理器边框在画布内居中
	this.constant.scale = this.lmEdge.scale();	// 比例常量
	// this.constant.d = LZR.HTML5.Util.getDomPositionForDocument(this.canvas);	// 画布位置常量

	if (this.ctrl.state === this.ctrl.STATE.UNABLE) {
		this.ctrl.noMid = true;
		this.ctrl.noRight = true;
		this.ctrl.noClick = true;
		this.ctrl.enable();
	}
};

// 刷新画布
LZR.HTML5.Canvas.LayerMgrEys.prototype.flush = function () {
	// 清空画布
	// this.ctx.clearRect (0, 0, this.canvas.width, this.canvas.height);

	// // 还原坐标变换
	// this.ctx.setTransform(1, 0, 0, 1, 0, 0);

	// // 加载各图层图片
	var x = this.lmEdge.left;
	var y = this.lmEdge.top;
	var w = this.lmEdge.w;
	var h = this.lmEdge.h;
	this.ctx.globalAlpha = 1;
	this.ctx.fillStyle="#eeeeee";
	this.ctx.fillRect (x, y, w, h);
	for (var i=0; i<this.layers.length; i++) {
		this.layers[i].draw (this.ctx, x, y, w, h);
	}

	// 大范围额外画图
	this.autoFlushMax ( this.ctx, x, y, w, h );

	// 涂灰
	this.ctx.globalAlpha = this.colorAlpha;
	if (this.backColor) {
		this.ctx.fillStyle=this.backColor;
		this.ctx.fillRect (x, y, w, h);
	}

	// 涂白
	x += this.layerMgr.s.left * this.constant.scale;
	y += this.layerMgr.s.top * this.constant.scale;
	w = this.layerMgr.s.w * this.constant.scale;
	h = this.layerMgr.s.h * this.constant.scale;
	if (this.backColor) {
		this.ctx.globalCompositeOperation="lighter";
		// this.ctx.globalCompositeOperation="xor";
	}
	this.ctx.fillStyle = this.showColor;
	this.ctx.fillRect (x, y, w, h);
	this.ctx.globalCompositeOperation="source-over";

	// 小范围额外画图
	this.autoFlush ( this.ctx, x, y, w, h );
};

// 刷新时大范围的额外画图（接口）
LZR.HTML5.Canvas.LayerMgrEys.prototype.autoFlushMax = function (ctx, x, y, w, h) {};

// 刷新时小区域的额外画图（接口）
LZR.HTML5.Canvas.LayerMgrEys.prototype.autoFlush = function (ctx, x, y, w, h) {};

// 更新鼠标事件
LZR.HTML5.Canvas.LayerMgrEys.prototype.ctrlUpdate = function() {
	var x, y;
	if (this.ctrl.state == this.ctrl.STATE.LEFT) {
		// 平移
		x = (this.ctrl.leftEnd.x - this.ctrl.leftStart.x) / this.constant.scale;
		y = (this.ctrl.leftEnd.y - this.ctrl.leftStart.y) / this.constant.scale;
		this.ctrl.leftStart = LZR.HTML5.Util.clone(this.ctrl.leftEnd);
		this.layerMgr.pan(x, y);
	} else if ( this.ctrl.wheelValue !== 0) {
		// 缩放
		var s = -this.ctrl.wheelValue;
		this.ctrl.wheelValue = 0;

		// 动态计算画布位置可避免滚动后坐标错误的问题（2015-8-29）
		var d = LZR.HTML5.Util.getDomPositionForDocument(this.canvas);
		x = (this.ctrl.currentPage.x - d.left - this.lmEdge.left) / this.constant.scale - this.layerMgr.s.left;
		y = (this.ctrl.currentPage.y - d.top - this.lmEdge.top) / this.constant.scale - this.layerMgr.s.top;
		this.layerMgr.zoom (s, x, y);
	}
};

// 启动图层管理器的鼠标响应功能
LZR.HTML5.Canvas.LayerMgrEys.prototype.ctrlEnable = function () {
	if (this.ctrl.state === this.ctrl.STATE.UNABLE) {
		this.ctrl.enable ();
	}
};

// 停止图层管理器的鼠标响应功能
LZR.HTML5.Canvas.LayerMgrEys.prototype.ctrlDisable = function () {
	if (this.ctrl.state !== this.ctrl.STATE.UNABLE) {
		this.ctrl.disable();
	}
};

// 重新计算尺寸
LZR.HTML5.Canvas.LayerMgrEys.prototype.resize = function () {
	LZR.HTML5.Util.mateWidth (this.canvas);
	this.init();
};

