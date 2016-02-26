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

	// 图层管理器的控制器
	this.ctrlMgr = new LZR.HTML5.Util.MouseDropController(this.cav);
	this.ctrlMgr.noMid = true;
	this.ctrlMgr.noRight = true;
	this.ctrlMgr.noClick = true;

	// 画笔控制器
	this.ctrlPen = new LZR.HTML5.Util.MouseDropController(this.cav);
	this.ctrlPen.noMid = true;
	this.ctrlPen.noRight = true;
	this.ctrlPen.noClick = true;

	// 方便计算的假常量
	this.constant = {};

	if (!this.obj) {
		this.clear();
	}
};
LZR.HTML5.Canvas.PenLayer.prototype = LZR.createPrototype (LZR.HTML5.Canvas.Layer.prototype);
LZR.HTML5.Canvas.PenLayer.prototype._super = LZR.HTML5.Canvas.Layer.prototype;
LZR.HTML5.Canvas.PenLayer.prototype.className = "LZR.HTML5.Canvas.PenLayer";
LZR.HTML5.Canvas.PenLayer.prototype.version = "0.0.0";

// 画布放下之后的初始化项目
LZR.HTML5.Canvas.PenLayer.prototype.init = function () {
	this.constant.d = LZR.HTML5.Util.getDomPositionForDocument(this.cav);	// 画布位置
};

// 绘图
LZR.HTML5.Canvas.PenLayer.prototype.draw = function (ctx, sx, sy, sw, sh, dx, dy, dw, dh) {
	this.cav.width = this.layerMgr.max.w * sw / dw;
	this.cav.height = this.layerMgr.max.h * sh / dh;
	this.superDraw(this.ctx, sx, sy, sw, sh, dx, dy, dw, dh);
};

// 绘图
LZR.HTML5.Canvas.PenLayer.prototype.superDraw = LZR.HTML5.Canvas.Layer.prototype.draw;

// 清空画布
LZR.HTML5.Canvas.PenLayer.prototype.clear = function () {
	this.obj = this.ctx.createImageData (this.layerMgr.max.w, this.layerMgr.max.h);
};

// 启动图层管理器的鼠标响应功能
LZR.HTML5.Canvas.PenLayer.prototype.ctrlEnable = function () {
	if (this.ctrlMgr.state === this.ctrlMgr.STATE.UNABLE) {
		this.ctrlMgr.enable ();
	}
};

// 停止图层管理器的鼠标响应功能
LZR.HTML5.Canvas.PenLayer.prototype.ctrlDisable = function () {
	if (this.ctrlMgr.state !== this.ctrlMgr.STATE.UNABLE) {
		this.ctrlMgr.disable();
	}
};

// 启动画笔的鼠标响应功能
LZR.HTML5.Canvas.PenLayer.prototype.penEnable = function () {
	if (this.ctrlPen.state === this.ctrlPen.STATE.UNABLE) {
		this.ctrlPen.enable (false, true);		// 滚轮不可用
	}
};

// 停止画笔的鼠标响应功能
LZR.HTML5.Canvas.PenLayer.prototype.penDisable = function () {
	if (this.ctrlPen.state !== this.ctrlPen.STATE.UNABLE) {
		this.ctrlPen.disable();
	}
};

// 是否已启动画笔控制
LZR.HTML5.Canvas.PenLayer.prototype.isPening = function () {
	if (this.ctrlPen.state === this.ctrlPen.STATE.UNABLE) {
		return false;
	} else {
		return true;
	}
};

// 更新鼠标事件
LZR.HTML5.Canvas.PenLayer.prototype.ctrlUpdate = function() {
	// 画笔控制器
	if (this.ctrlPen.state == this.ctrlPen.STATE.LEFT) {
		var sx = (this.ctrlPen.leftStart.x - this.constant.d.left) * this.layerMgr.s.scale();
		var sy = (this.ctrlPen.leftStart.y - this.constant.d.top) * this.layerMgr.s.scale();
		var ex = (this.ctrlPen.leftEnd.x - this.constant.d.left) * this.layerMgr.s.scale();
		var ey = (this.ctrlPen.leftEnd.y - this.constant.d.top) * this.layerMgr.s.scale();
		this.ctrlPen.leftStart = LZR.HTML5.Util.clone(this.ctrlPen.leftEnd);
// console.log (sx + " , " + sy + " , " + ex + " , " + ey);
// console.log ((sx + this.layerMgr.s.left) + " , " + (sy + this.layerMgr.s.top) + " , " + (ex + this.layerMgr.s.left) + " , " + (ey + this.layerMgr.s.top));

		// 画点：
		// ex = Math.floor( ex + this.layerMgr.s.left );
		// ey = Math.floor( ey + this.layerMgr.s.top );
		// var i = (ey * this.obj.width + ex) * 4;
		// this.obj.data[i] = 255;
		// this.obj.data[i+3] = 255;

		// 画线：
		if (sx !== ex || sy !== ey) {
			this.ctx.beginPath();
			this.ctx.moveTo(sx, sy);
			this.ctx.lineTo(ex, ey);
			this.ctx.stroke();
			var d = this.ctx.getImageData(0, 0, this.cav.width, this.cav.height);
			if (d.width === this.obj.width) {
				this.obj = d;
			} else {
				var m = 0;
				var n = Math.floor(this.layerMgr.s.left) + Math.floor(this.layerMgr.s.top) * this.obj.width;
				n *= 4;
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
	} else if (this.ctrlPen.state === this.ctrlPen.STATE.UNABLE) {
		var x, y;
		// 图层管理器的控制器（画笔控制器未启动时）
		if (this.ctrlMgr.state == this.ctrlMgr.STATE.LEFT) {
			// 平移
			x = (this.ctrlMgr.leftStart.x - this.ctrlMgr.leftEnd.x) * this.layerMgr.s.scale();
			y = (this.ctrlMgr.leftStart.y - this.ctrlMgr.leftEnd.y) * this.layerMgr.s.scale();
			this.ctrlMgr.leftStart = LZR.HTML5.Util.clone(this.ctrlMgr.leftEnd);
			this.layerMgr.pan(x, y);
		} else if ( this.ctrlMgr.wheelValue !== 0) {
			// 缩放
			var s = -this.ctrlMgr.wheelValue;
			this.ctrlMgr.wheelValue = 0;
			x = (this.ctrlMgr.currentPage.x - this.constant.d.left) * this.layerMgr.s.scale();
			y = (this.ctrlMgr.currentPage.y - this.constant.d.top) * this.layerMgr.s.scale();
			this.layerMgr.zoom (s, x, y);
		}
	}
};

// 重新计算尺寸
LZR.HTML5.Canvas.LayerManager.prototype.resize = function () {
	this.init();
};
