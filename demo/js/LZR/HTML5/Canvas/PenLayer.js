// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Canvas/PenLayer.js" ]);

// ----------- 画笔图层 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/Canvas/Layer.js",
	LZR.HTML5.jsPath + "HTML5/util/MouseDropController.js"
]);
LZR.HTML5.Canvas.PenLayer = function (obj) {
	LZR.HTML5.Canvas.Layer.call(this, obj);

	// 画布
	this.cav = obj.cav;

	// 绘图环境
	this.ctx = this.cav.getContext("2d");

	// 图层管理器
	this.layerMgr = obj.layerMgr;

	// 控制器
	this.ctrl = new LZR.HTML5.Util.MouseDropController(this.cav);
	this.ctrl.noMid = true;
	this.ctrl.noClick = true;

	// 方便计算的假常量
	this.constant = {};

	if (!this.obj) {
		this.clear();
	}
};
LZR.HTML5.Canvas.PenLayer.prototype = LZR.createPrototype (LZR.HTML5.Canvas.Layer.prototype);
LZR.HTML5.Canvas.PenLayer.prototype._super = LZR.HTML5.Canvas.Layer.prototype;
LZR.HTML5.Canvas.PenLayer.prototype.className = "LZR.HTML5.Canvas.PenLayer";
LZR.HTML5.Canvas.PenLayer.prototype.version = "0.0.1";

// 画布放下之后的初始化项目
LZR.HTML5.Canvas.PenLayer.prototype.init = function () {
	this.constant.d = LZR.HTML5.Util.getDomPositionForDocument(this.cav);	// 画布位置
};

// 绘图
LZR.HTML5.Canvas.PenLayer.prototype.draw = function (ctx, sx, sy, sw, sh, dx, dy, dw, dh) {
	if (dw) {
		this.cav.width = this.layerMgr.s.w;
		this.cav.height = this.layerMgr.s.h;
		this._super.draw.call(this, this.ctx, sx, sy, sw, sh, 0, 0);
	}
};

// 清空画布
LZR.HTML5.Canvas.PenLayer.prototype.clear = function () {
	this.obj = this.ctx.createImageData (this.layerMgr.max.w, this.layerMgr.max.h);
};

// 启动图层管理器的鼠标响应功能
LZR.HTML5.Canvas.PenLayer.prototype.ctrlEnable = function () {
	if (this.ctrl.state === this.ctrl.STATE.UNABLE) {
		this.ctrl.enable (false, false, true);
	}
};

// 停止图层管理器的鼠标响应功能
LZR.HTML5.Canvas.PenLayer.prototype.ctrlDisable = function () {
	if (this.ctrl.state !== this.ctrl.STATE.UNABLE) {
		this.ctrl.disable();
	}
};

// 更新鼠标事件
LZR.HTML5.Canvas.PenLayer.prototype.ctrlUpdate = function() {
	var x, y;
	// 图层管理器的控制器（画笔控制器未启动时）
	if (this.ctrl.state === this.ctrl.STATE.LEFT) {
		// 平移
		x = (this.ctrl.leftStart.x - this.ctrl.leftEnd.x) * this.layerMgr.s.scale();
		y = (this.ctrl.leftStart.y - this.ctrl.leftEnd.y) * this.layerMgr.s.scale();
		this.ctrl.leftStart = LZR.HTML5.Util.clone(this.ctrl.leftEnd);
		this.layerMgr.pan(x, y);
	} else if ( this.ctrl.state === this.ctrl.STATE.RIGHT) {
		// 画笔
		var sx = (this.ctrl.rightStart.x - this.constant.d.left) * this.layerMgr.s.scale();
		var sy = (this.ctrl.rightStart.y - this.constant.d.top) * this.layerMgr.s.scale();
		var ex = (this.ctrl.rightEnd.x - this.constant.d.left) * this.layerMgr.s.scale();
		var ey = (this.ctrl.rightEnd.y - this.constant.d.top) * this.layerMgr.s.scale();
		this.ctrl.rightStart = LZR.HTML5.Util.clone(this.ctrl.rightEnd);
// console.log (sx + " , " + sy + " , " + ex + " , " + ey);
// console.log ((sx + this.layerMgr.s.left) + " , " + (sy + this.layerMgr.s.top) + " , " + (ex + this.layerMgr.s.left) + " , " + (ey + this.layerMgr.s.top));

		// 画点：
		// x = Math.floor( ex + this.layerMgr.s.left );
		// y = Math.floor( ey + this.layerMgr.s.top );
		// this.point(x, y);

		// 画线：
		this.lineByCtx(sx, sy, ex, ey);
		// this.line(sx, sy, ex, ey);
	} else if ( this.ctrl.wheelValue !== 0) {
		// 缩放
		var s = -this.ctrl.wheelValue;
		this.ctrl.wheelValue = 0;
		x = (this.ctrl.currentPage.x - this.constant.d.left) * this.layerMgr.s.scale();
		y = (this.ctrl.currentPage.y - this.constant.d.top) * this.layerMgr.s.scale();
		this.layerMgr.zoom (s, x, y);
	}
};

// 重新计算尺寸
LZR.HTML5.Canvas.PenLayer.prototype.resize = function () {
	this.init();
};

// 画点
LZR.HTML5.Canvas.PenLayer.prototype.point = function (x, y) {
	if (x>=0 && x <= this.obj.width) {
		var i = (y * this.obj.width + x) * 4;
		this.obj.data[i] = 255;
		this.obj.data[i+3] = 255;
	}
};

// 画线
LZR.HTML5.Canvas.PenLayer.prototype.line = function (sx, sy, ex, ey) {
	var a, i, x, y;
	sx = Math.floor( sx + this.layerMgr.s.left );
	sy = Math.floor( sy + this.layerMgr.s.top );
	ex = Math.floor( ex + this.layerMgr.s.left );
	ey = Math.floor( ey + this.layerMgr.s.top );
	x = ex - sx;
	y = ey - sy;
	a = x / y;

	if (Math.abs(x) > Math.abs(y)) {
		if (x>0) {
			ex = 0;
			ey = x;
		} else {
			ex = x;
			ey = 0;
		}

		for (i=ex; i<=ey; i++) {
			this.point (sx+i, Math.floor(sy + i/a));
		}
	} else if (y !== 0) {
		if (y>0) {
			ex = 0;
			ey = y;
		} else {
			ex = y;
			ey = 0;
		}

		for (i=ex; i<=ey; i++) {
			this.point (Math.floor(sx + a * i), sy + i);
		}
	}
};

// ctx画线（存在浏览器兼容性，和IE速度慢问题）
LZR.HTML5.Canvas.PenLayer.prototype.lineByCtx = function (sx, sy, ex, ey) {
	if (sx !== ex || sy !== ey) {
		this.ctx.beginPath();
		this.ctx.moveTo(sx, sy);
		this.ctx.lineTo(ex, ey);
		this.ctx.stroke();
		var d = this.ctx.getImageData(0, 0, this.cav.width, this.cav.height);

		// 覆盖图片数据对象
		if (d.width === this.obj.width && d.height === this.obj.height) {
			this.obj = d;
		} else {
			var n = Math.floor(this.layerMgr.s.left) + Math.floor(this.layerMgr.s.top) * this.obj.width;		// 谷歌浏览器取整方案
			// var n = Math.ceil(this.layerMgr.s.left) + Math.ceil(this.layerMgr.s.top) * this.obj.width;		// IE浏览器取整方案
			n *= 4;
			var m = 0;
			var k = (this.obj.width - d.width) * 4;
			for (var i=0; i<d.height; i++) {
				for (var j=0; j<d.width; j++) {
					this.obj.data[n++] = d.data[m++];
					this.obj.data[n++] = d.data[m++];
					this.obj.data[n++] = d.data[m++];
					this.obj.data[n++] = d.data[m++];
				}
				n += k;
			}
		}
	}
};
