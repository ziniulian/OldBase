// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "util/Graphics.js" ]);

// --------------------- 图形学相关算法 ----------------------------

LZR.Util.Graphics = function (obj) {};
LZR.Util.Graphics.prototype.className = "LZR.Util.Graphics";
LZR.Util.Graphics.prototype.version = "0.0.0";

// 计算变换矩阵
LZR.Util.Graphics.prototype.calcTransform  = function (a, sx, sy, dx, dy) {
	/*
		参数说明：
			a: 旋转角度（弧度）
			sx: x方向缩放比例
			sy: y方向缩放比例
			dx: x方向偏移量
			dy: y方向偏移量
		返回值：
			[0], [2], [4]
			[1], [3], [5]
			 0 ,  0 ,  1
	*/
	var v = [];
	v.push( sx*Math.cos(a) );
	v.push( sy*Math.sin(a) );
	v.push( -1*sx*Math.sin(a) );
	v.push( sy*Math.cos(a) );
	v.push( dx );
	v.push( dy );
	return v;
};


