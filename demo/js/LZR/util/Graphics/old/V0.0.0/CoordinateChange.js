// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "util/Graphics/CoordinateChange.js" ]);

// ----------- 坐标变换 ------------

LZR.Util.Graphics.CoordinateChange = function (obj) {
/*
	参数说明：
	{
		s: {		// 原坐标系
			p1: {x, y, z},
			p2: {x, y, z},
			p3: {x, y, z},
			p4: {x, y, z}
		},
		t: {		// 当前坐标系
			p1: {x, y, z},
			p2: {x, y, z},
			p3: {x, y, z},
			p4: {x, y, z}
		},
		scale: 1	// 缩放比例
	}
*/
	// 数据源
	this.dataSource = obj;

	// 七参数
	this.seven = {
		x: 0,		// 平移因子 X
		y: 0,		// 平移因子 Y
		z: 0,		// 平移因子 Z
		s: 1,		// 缩放比例
		angleZ: 0,	// 第一角度：绕原坐标 Z 轴的旋转角度
		angleX: 0,	// 第二角度：绕新坐标 X 轴的旋转角度
		angleY: 0,	// 第三角度：绕新坐标 Y 轴的旋转角度
	};

	// 旋转因子，是一个正交矩阵
	this. r = {
		a1:0, a2:0, a3:0,
		b1:0, b2:0, b3:0,
		c1:0, c2:0, c3:0
	};

	if (obj.scale) {
		this.seven.s = obj.scale;
	}
};
LZR.Util.Graphics.CoordinateChange.prototype.className = "LZR.Util.Graphics.CoordinateChange";
LZR.Util.Graphics.CoordinateChange.prototype.version = "0.0.0";

// 三点法计算 R
LZR.Util.Graphics.CoordinateChange.prototype.computeR3 = function () {
	/* BUG：
		目前公式错误，不知原因，无法使用。
	*/
	var obj = this.dataSource;
	var a, b, c, h, s = this.seven.s;

	var	xs21 = obj.s.p2.x - obj.s.p1.x,
		ys21 = obj.s.p2.y - obj.s.p1.y,
		zs21 = obj.s.p2.z - obj.s.p1.z,
		xs31 = obj.s.p3.x - obj.s.p1.x,
		ys31 = obj.s.p3.y - obj.s.p1.y,
		zs31 = obj.s.p3.z - obj.s.p1.z,

		xt21 = obj.t.p2.x - obj.t.p1.x,
		yt21 = obj.t.p2.y - obj.t.p1.y,
		zt21 = obj.t.p2.z - obj.t.p1.z,
		xt31 = obj.t.p3.x - obj.t.p1.x,
		yt31 = obj.t.p3.y - obj.t.p1.y;
		zt31 = obj.t.p3.z - obj.t.p1.z;

	var	u1 = xt21 - s*xs21,
		v1 = yt21 - s*ys21,
		w1 = zt31 - s*zs31,
		u2 = s*xs21 + xt21,
		v2 = s*ys21 + yt21,
		w2 = s*zs21 + zt21,
		u3 = s*xs31 + xt31,
		v3 = s*ys31 + yt31,
		w3 = s*zs31 + zt31;

	h = u3*v2*w2 - u2*v3*w2;
	a = (u2*u3*u1 - u3*v2*v1 + u2*w3*w1)/h;		// u2*w2, 原文为 u2*w3
	b = (u2*v3*u1 + v2*v3*v1 + v2*w2*w1)/h;
	c = (-u3*w2*u1 - v3*w2*v1 - w2*w2*w1)/h;

	// I-S，	S：反对称矩阵，与 R 一起构成罗德里格矩阵
	u1=1;		u2=c;		u3=b;
	v1=-c;		v2=1;		v3=a;
	w1=-b;		w2=-a;		w3=1;

	// I-S 的模
	var det = u1*v2*w3 + u2*v3*w1 + u3*v1*w2 - u3*v2*w1 - u2*v1*w3 - u1*v3*w2;

	// I-S 的逆
	var	a1 = (v2*w3-w2*v3)/det,	a2 = -(u2*w3-w2*u3)/det,	a3 = (u2*v3-u3*v2)/det,
		b1 = (v3*w1-w3*v1)/det,	b2 = -(u3*w1-w3*u1)/det,	b3 = (u3*v1-u1*v3)/det,
		c1 = (v1*w2-w1*v2)/det,	c2 = -(u1*w2-w1*u2)/det,	c3 = (u1*v2-u2*v1)/det;

	// I+S
	u1=1;		u2=-c;		u3=-b;
	v1=c;		v2=1;		v3=-a;
	w1=b;		w2=a;		w3=1;

	// 计算旋转因子
	this.r.a1 = u1*a1 + u2*b1 + u3*c1;
	this.r.a2 = u1*a2 + u2*b2 + u3*c2;
	this.r.a3 = u1*a3 + u2*b3 + u3*c3;

	this.r.b1 = v1*a1 + v2*b1 + v3*c1;
	this.r.b2 = v1*a2 + v2*b2 + v3*c2;
	this.r.b3 = v1*a3 + v2*b3 + v3*c3;

	this.r.c1 = w1*a1 + w2*b1 + w3*c1;
	this.r.c2 = w1*a2 + w2*b2 + w3*c2;
	this.r.c3 = w1*a3 + w2*b3 + w3*c3;

	// 计算平移因子
	u1 = obj.s.p1.x;
	v1 = obj.s.p1.y;
	w1 = obj.s.p1.z;
	this.seven.x = obj.t.p1.x/s - (this.r.a1*u1 + this.r.a2*v1 + this.r.a3*w1);
	this.seven.y = obj.t.p1.y/s - (this.r.b1*u1 + this.r.b2*v1 + this.r.b3*w1);
	this.seven.z = obj.t.p1.z/s - (this.r.c1*u1 + this.r.c2*v1 + this.r.c3*w1);
};

// 四点法计算 R
LZR.Util.Graphics.CoordinateChange.prototype.computeR4 = function () {
	/* BUG：
		1. 该函数忽视了缩放比例，永远默认比例为1。
		2. 尚未处理分母可能为零是 BUG
		3. 未测试四点坐标是否构成四面体
		4. 未处理四坐标点间的冲突
	*/
	var	x1 = this.dataSource.s.p1.x,
		y1 = this.dataSource.s.p1.y,
		z1 = this.dataSource.s.p1.z,

		xs21 = this.dataSource.s.p2.x - x1,
		ys21 = this.dataSource.s.p2.y - y1,
		zs21 = this.dataSource.s.p2.z - z1,

		xs31 = this.dataSource.s.p3.x - x1,		//ys31 = this.dataSource.s.p3.y - y1,	//zs31 = this.dataSource.s.p3.z - z1,
		xs41 = this.dataSource.s.p4.x - x1;		//ys41 = this.dataSource.s.p4.y - y1,	//zs41 = this.dataSource.s.p4.z - z1;

	var	u2 = (this.dataSource.s.p3.y - y1)*xs21 - xs31*ys21,
		u3 = (this.dataSource.s.p4.y - y1)*xs21 - xs41*ys21,
		v2 = (this.dataSource.s.p3.z - z1)*xs21 - xs31*zs21,
		v3 = (this.dataSource.s.p4.z - z1)*xs21 - xs41*zs21,
		w2, w3, t;

	// a
	x1 = this.dataSource.t.p1.x;
	t = this.dataSource.t.p2.x - x1;
	w2 = (this.dataSource.t.p3.x - x1)*xs21 - xs31*t;
	w3 = (this.dataSource.t.p4.x - x1)*xs21 - xs41*t;
	this.r.a3 = (u2*w3 - u3*w2)/(u2*v3 - u3*v2);
	this.r.a2 = (w2 - v2*this.r.a3)/u2;
	this.r.a1 = (t - ys21*this.r.a2 - zs21*this.r.a3)/xs21;

	// b
	y1 = this.dataSource.t.p1.y;
	t = this.dataSource.t.p2.y - y1;
	w2 = (this.dataSource.t.p3.y - y1)*xs21 - xs31*t;
	w3 = (this.dataSource.t.p4.y - y1)*xs21 - xs41*t;
	this.r.b3 = (u2*w3 - u3*w2)/(u2*v3 - u3*v2);
	this.r.b2 = (w2 - v2*this.r.b3)/u2;
	this.r.b1 = (t - ys21*this.r.b2 - zs21*this.r.b3)/xs21;

	// c
	z1 = this.dataSource.t.p1.z;
	t = this.dataSource.t.p2.z - z1;
	w2 = (this.dataSource.t.p3.z - z1)*xs21 - xs31*t;
	w3 = (this.dataSource.t.p4.z - z1)*xs21 - xs41*t;
	this.r.c3 = (u2*w3 - u3*w2)/(u2*v3 - u3*v2);
	this.r.c2 = (w2 - v2*this.r.c3)/u2;
	this.r.c1 = (t - ys21*this.r.c2 - zs21*this.r.c3)/xs21;

	// 计算平移因子
	u2 = this.dataSource.s.p1.x;
	v2 = this.dataSource.s.p1.y;
	w2 = this.dataSource.s.p1.z;
	this.seven.x = x1 - (this.r.a1*u2 + this.r.a2*v2 + this.r.a3*w2);
	this.seven.y = y1 - (this.r.b1*u2 + this.r.b2*v2 + this.r.b3*w2);
	this.seven.z = z1 - (this.r.c1*u2 + this.r.c2*v2 + this.r.c3*w2);
};

// 坐标转换
LZR.Util.Graphics.CoordinateChange.prototype.trans = function(ps, obj) {
	var	pt,
		x = ps.x,
		y = ps.y,
		z = ps.z;
	if (obj) {
		pt = obj;
	} else {
		pt = {x:0, y:0, z:0};
	}

	pt.x = this.seven.x + (this.r.a1*x + this.r.a2*y + this.r.a3*z);
	pt.y = this.seven.y + (this.r.b1*x + this.r.b2*y + this.r.b3*z);
	pt.z = this.seven.z + (this.r.c1*x + this.r.c2*y + this.r.c3*z);
	return pt;
};

// 计算七参数的三个角度

// 两向量相加

// 两向量相减

// 计算向量长度

// 向量标准化 normalize

// 修改向量长度
