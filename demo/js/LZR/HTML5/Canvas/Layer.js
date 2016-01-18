// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Canvas/Layer.js" ]);

// ----------- 图层 ------------

LZR.HTML5.Canvas.Layer = function (obj) {
	/*
		参数说明：
		{
			name:图层名,
			obj:图层中的图片内容
		}
	*/

	// 图层名
	if (obj) {
		this.name = obj.name;
	} else {
		this.name = "";
	}

	// 图层中的图片内容
	if (obj && obj.obj) {
		this.obj = obj.obj;
	} else {
		this.obj = obj;
	}

	// 透明度（0到1之间的小数）
	this.alpha = 1;

	// 是否可见（布尔值）
	this.visible = true;

};
LZR.HTML5.Canvas.Layer.prototype.className = "LZR.HTML5.Canvas.Layer";
LZR.HTML5.Canvas.Layer.prototype.version = "0.0.1";

// 获取类型值
LZR.HTML5.Canvas.Layer.prototype.getType = function () {
	var t = LZR.HTML5.Util.getClassName (this.obj);
	switch (t) {
		case "HTMLImageElement":
			return 0;
		case "ImageData":
			return 1;
		default:
			return -1;
	}
};

// 绘图
LZR.HTML5.Canvas.Layer.prototype.draw = function (ctx, sx, sy, sw, sh, dx, dy, dw, dh) {
	if (this.visible && this.obj) {
		ctx.globalAlpha = this.alpha;
		if (isNaN(sw)) {
			ctx.drawImage (this.obj, sx, sy);
		} else if (isNaN(dx)) {
			ctx.drawImage (this.obj, sx, sy, sw, sh);
		} else {
			this.draw2canvas (ctx, this.obj, sx, sy, sw, sh, dx, dy, dw, dh);
		}
	}
};

// 在画布上局部画图
LZR.HTML5.Canvas.Layer.prototype.draw2canvas = function (ctx, obj, sx, sy, sw, sh, dx, dy, dw, dh) {

/** 待兼容 ImageData 对象时，再使用判断语句
			switch (typ) {
				case 0:	// HTMLImageElement：DOM 的 Image 对象
					this.ctx.drawImage (y.obj, this.sx, this.sy, this.sw, this.sh, 0, 0, this.canvas.width, this.canvas.height);
					break;
				case 1:	// ImageData：HTML5画布的内部图片数据
					// 暂不能对 ImageData 进行缩放。
					// this.ctx.putImageData (y.obj, -this.sx, -this.sy, this.sx, this.sy, this.sw, this.sh);
					break;
			}
*/

	if (sx > obj.width || dx > ctx.canvas.width || sy > obj.height || dy > ctx.canvas.height) {
		return;
	}

	// 处理图片未完全覆盖相框问题（火狐、IE特有问题）
	var d;
	var ws = dw/sw;	// 宽度方向缩放比例
	var hs = dh/sh;	// 长度方向缩放比例
	var left = -sx;
	var top = -sy;
	var right = sx + sw - obj.width;
	var bottom = sy + sh - obj.height;

	if (left > 0) {
		sx = 0;
		sw -= left;
		d = left * ws;
		dx += d;
		dw -= d;
	}
	if (right > 0) {
		sw -= right;
		d = right * ws;
		dw -= d;
	}
	if (top > 0) {
		sy = 0;
		sh -= top;
		d = top * hs;
		dy += d;
		dh -= d;
	}
	if (bottom > 0) {
		sh -= bottom;
		d = bottom * hs;
		dh -= d;
	}

	ctx.drawImage (obj, sx, sy, sw, sh, dx, dy, dw, dh);
};

