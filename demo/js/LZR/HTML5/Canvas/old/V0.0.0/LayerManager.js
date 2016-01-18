// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Canvas/LayerManager.js" ]);

// ----------- 图层管理 ------------

LZR.HTML5.loadJs([
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

	// 原图显示区域（边框）
	this.sx = 0;
	this.sy = 0;
	this.sw = obj.width;
	this.sh = obj.height;

	// 极限
	this.maxTop = 0;
	this.maxBottom = this.sh;
	this.maxLeft = 0;
	this.maxRight = this.sw;
	this.minWidth = 10;
	this.minHeight = 10;

	// 控制器
	this.ctrl = new LZR.HTML5.Util.MouseDropController(obj);
};
LZR.HTML5.Canvas.LayerManager.prototype.className = "LZR.HTML5.Canvas.LayerManager";
LZR.HTML5.Canvas.LayerManager.prototype.version = "0.0.0";

// 初始化
LZR.HTML5.Canvas.LayerManager.prototype.init = function () {
	if (this.ctrl.state === this.ctrl.STATE.UNABLE) {
		this.ctrl.noMid = true;
		this.ctrl.noRight = true;
		this.ctrl.noClick = true;
		this.ctrl.enable();
	}
	this.calculateLimit();
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
		this.layers[i].draw (this.ctx, this.sx, this.sy, this.sw, this.sh, 0, 0, this.canvas.width, this.canvas.height);
	}
};

// 所有图层整体平移（向量）
LZR.HTML5.Canvas.LayerManager.prototype.pan = function (x, y) {
	if (x<0) {
		this.sx += x;
		if (this.sx < this.maxLeft) {
			this.sx = this.maxLeft;
		}
	} else if (x!==0) {
		this.sx += x;
		if ( (this.sx + this.sw) > this.maxRight ) {
			this.sx = this.maxRight - this.sw;
		}
	}

	if (y<0) {
		this.sy += y;
		if (this.sy < this.maxTop) {
			this.sy = this.maxTop;
		}
	} else if (y !== 0) {
		this.sy += y;
		if ( (this.sy + this.sh) > this.maxBottom ) {
			this.sy = this.maxBottom - this.sh;
		}
	}
};

// 所有图层整体缩放（缩放量，缩放中心点坐标）
LZR.HTML5.Canvas.LayerManager.prototype.zoom = function (s, x, y) {
	s *= this.zoomScale;
	if (s<0) {
		// 缩小

		s = 1.0/(1.0-s);
		this.sw = Math.floor(this.sw*s);
		this.sh = Math.floor(this.sh*s);

		// 极限修正
		if (this.sR > this.minR) {
			// 高对比
			if (this.sh < this.minHeight) {
				this.sh = this.minHeight;
				this.sw = Math.floor(this.sR * this.sh);
			}
		} else {
			// 宽对比
			if (this.sw < this.minWidth) {
				this.sw = this.minWidth;
				this.sh = Math.floor(this.sw/this.sR);
			}
		}

	} else if (s !== 0) {
		// 放大

		s += 1.0;
		this.sw = Math.floor(this.sw*s);
		this.sh = Math.floor(this.sh*s);

		// 极限修正
		if (this.sR < this.maxR) {
			// 高对比
			if (this.sh > this.maxHeight) {
				this.sh = this.maxHeight;
				this.sy = this.maxTop;
				this.sw = Math.floor(this.sR * this.sh);
			}
		} else {
			// 宽对比
			if (this.sw > this.maxWidth) {
				this.sw = this.maxWidth;
				this.sx = this.maxLeft;
				this.sh = Math.floor(this.sw/this.sR);
			}
		}

		// 不能处理缩放中心时的简易位置修正方法
		if ( (this.sx + this.sw) > this.maxRight ) {
			this.sx = this.maxRight - this.sw;
		}
		if ( (this.sy + this.sh) > this.maxBottom ) {
			this.sy = this.maxBottom - this.sh;
		}
	}

	// 缩放中心处理

/** 待缩放中心可处理后，再用此位置修正
	// 位置修正
	if ( s>1 ) {
		if ( (this.sx + this.sw) > this.maxRight ) {
			this.sx = this.maxRight - this.sw;
		}
		if ( (this.sy + this.sh) > this.maxBottom ) {
			this.sy = this.maxBottom - this.sh;
		}
		if (this.sx < this.maxLeft) {
			this.sx = this.maxLeft;
		}
		if (this.sy < this.maxTop) {
			this.sy = this.maxTop;
		}
	}
*/

};

// 计算极限参数（当极限条件发生变化时，需要调用此方法计算极限参数）
LZR.HTML5.Canvas.LayerManager.prototype.calculateLimit = function () {
	// 最大宽度
	this.maxWidth = this.maxRight - this.maxLeft;

	// 最大高度
	this.maxHeight = this.maxBottom - this.maxTop;

	// 最大宽高比
	this.maxR = this.maxWidth/this.maxHeight;

	// 最小宽高比
	this.minR = this.minWidth/this.minHeight;

	// 边框宽高比
	this.sR = this.sw/this.sh;
};

// 更新鼠标事件
LZR.HTML5.Canvas.LayerManager.prototype.ctrlUpdate = function() {
// LZR.HTML5.log("i++");
	if (this.ctrl.state == this.ctrl.STATE.LEFT) {
		// 平移
		var x = (this.ctrl.leftStart.x - this.ctrl.leftEnd.x) * this.sw /this.maxWidth;
		var y = (this.ctrl.leftStart.y - this.ctrl.leftEnd.y) * this.sh /this.maxHeight;
		this.ctrl.leftStart = LZR.HTML5.Util.clone(this.ctrl.leftEnd);
// LZR.HTML5.alog("\nx = " + x);
// LZR.HTML5.alog("y =" + x);
		this.pan(x, y);
	} else if ( this.ctrl.wheelValue !== 0) {
		// 缩放
		var s = -this.ctrl.wheelValue;
		this.ctrl.wheelValue = 0;
// LZR.HTML5.alog("\ns = " + s);
		this.zoom (s);
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

// 导出图片（...）:？？？

