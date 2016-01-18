// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Canvas/Thumbnail.js" ]);

// ----------- 缩略图 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/Canvas/ThumbnailImg.js",
	LZR.HTML5.jsPath + "HTML5/util/MouseDropController.js"
]);
LZR.HTML5.Canvas.Thumbnail = function (obj) {

	// 画布
	this.canvas = obj;

	// 环境
	this.ctx = obj.getContext("2d");

	// 缩略图图片
	this.imgs = [];

	// 图片总数
	this.count = 0;

	// 显示排数
	this.rows = 1;

	// 排列方向（横向:1 ；纵向:2）
	this.direction = 1;

	// 每个图片的显示宽度
	this.width = 100;

	// 每个图片的显示高度
	this.height = 100;

	// 图片的排列方向偏移量
	this.offsetU = 0;

	// 图片的非排列方向偏移量
	this.offsetV = 0;

	// // 图片宽长比（不能自动匹配容器大小时，此参数暂时无用）
	// this.ratio = 1;

	// // 每排个数（不能自动匹配容器大小时，此参数暂时无用）
	// this.number = 6;

	// 图片排列方向间距
	this.paddingU = 10;

	// 图片非排列方向间距
	this.paddingV = 10;

	// 当前位置
	this.position = 0;

	// 可拖动的最大位置
	this.max = 0;

	// 选中时的边框宽度
	this.boderWidth = 4;

	// 选中时的边框颜色
	this.boderColor = "red";

	// 缓冲长度
	this.buff = 20;

	// 被选中图片的序号
	this.index = -1;

	// 鼠标拖动控制器
	this.ctrl = new LZR.HTML5.Util.MouseDropController(this.canvas);

	// 归位状态（0：无需归位；1：需要归位；2：正在归位）
	this.alineState = 0;

	// 滚动系数
	this.wheelScale = 3;

	// 滚动形式（1：按像素滚动；2：按图片个数滚动；3：按图片个数滚动并选择）
	this.wheelStyle = 2;

	// 归位总帧数
	this.alineFrameNum = 1;

	// 不显示选中边框
	this.noBoder = false;
};
LZR.HTML5.Canvas.Thumbnail.prototype.className = "LZR.HTML5.Canvas.Thumbnail";
LZR.HTML5.Canvas.Thumbnail.prototype.version = "0.0.1";

// 根据容器大小及图片显示大小初始化行列数及其它排版参数
LZR.HTML5.Canvas.Thumbnail.prototype.init = function() {
	if (this.ctrl.state === this.ctrl.STATE.UNABLE) {
		this.ctrl.noMid = true;
		this.ctrl.noRight = true;
		this.ctrl.clickTime = 300;
		this.ctrl.autoClick = LZR.HTML5.Util.bind(this, this.click);
		this.ctrl.enable();
	}

	this.ctx.lineWidth = this.boderWidth;
	this.ctx.strokeStyle = this.boderColor;

	this.calculateMax();
};

// 根据容器大小及行列数初始化每个图片的显示大小及其它排版参数

// 刷新画布
LZR.HTML5.Canvas.Thumbnail.prototype.flush = function() {
	// 清除画布
	this.ctx.clearRect (0, 0, this.canvas.width, this.canvas.height);
	var i, d, t, u, uu, uuu, v=0;
	if ( this.direction === 1 ) {
		t = this.height + this.paddingV;
		uu = this.canvas.width;
		uuu = this.width;
	} else if ( this.direction === 2 ) {
		t = this.width + this.paddingV;
		uu = this.canvas.height;
		uuu = this.height;
	}

	d = uuu + this.paddingU;
	if (this.position < 0) {
		i = 0;
		u = -this.position;
	} else {
		i = Math.floor( this.position / d ) * this.rows;
		u = this.position % d;
		if (u < uuu) {
			u = -u;
		} else {
			i += this.rows;
			u = this.paddingU - u + uuu;
		}
	}

/*
LZR.HTML5.log (	"------\n" +
	"position = " + this.position + "\n" +
	"buff = " + this.buff + "\n" +
	"i = " + i + "\n" +
	"u = " + u + "\n" +
	"uu = " + uu + "\n" +
	"uuu = " + uuu + "\n"
);
*/
	u += this.offsetU;
	while (u<uu && i<this.count) {
		v += this.offsetV;
		for (var j = 0; j<this.rows; j++) {
			var ls = this.imgs[i];

			// 前置绘图
			if ( this.direction === 1 ) {
				this.beforeDraw(this, i, u, v, this.width, this.height);
			} else if ( this.direction === 2 ) {
				this.beforeDraw(this, i, v, u, this.width, this.height);
			}

			// 绘图
			if (ls) {
				ls = ls.getLayers();
				for (var k=0; k<ls.length; k++) {
					if ( this.direction === 1 ) {
						ls[k].draw (this.ctx, u, v, this.width, this.height);
					} else if ( this.direction === 2 ) {
						ls[k].draw (this.ctx, v, u, this.width, this.height);
					}
				}
			}

/** // 解决选择边框边界无法显示的一种方法（改用 offset 偏移比该方法更合理。）
			if (i === this.index) {
				var b = Math.floor (this.boderWidth/2);
				var b2 = b * 2;
				if ( this.direction === 1 ) {
					this.ctx.strokeRect(u+b, v+b, this.width-b2, this.height-b2);
				} else if ( this.direction === 2 ) {
					this.ctx.strokeRect(v+b, u+b, this.width-b2, this.height-b2);
				}
			}
*/
			this.ctx.globalAlpha = 1;
			if ( this.direction === 1 ) {
				if ( !this.noBoder && i === this.index ) {
					this.ctx.strokeRect(u, v, this.width, this.height);
				}
				this.draw (this, i, u, v, this.width, this.height);
			} else if ( this.direction === 2 ) {
				if ( !this.noBoder && i === this.index ) {
					this.ctx.strokeRect(v, u, this.width, this.height);
				}
				this.draw (this, i, v, u, this.width, this.height);
			}
			i++;
			if (i >= this.count) {
				break;
			}
			v += t;
		}
		v = 0;
		u += d;
	}

};

// 卷动
LZR.HTML5.Canvas.Thumbnail.prototype.scroll = function(s) {
	this.position += s;
	if (this.position < -this.buff) {
		this.position = -this.buff;
	} else if (this.position > this.max) {
		this.position = this.max;
	}
	this.alineState = 1;
};

// 更新鼠标事件
LZR.HTML5.Canvas.Thumbnail.prototype.ctrlUpdate = function( ctrl ) {
	var s;
	if (!ctrl) {
		ctrl = this.ctrl;
	}
	if (ctrl.state == ctrl.STATE.LEFT) {
		if ( this.direction === 1 ) {
			s = ctrl.leftStart.x - ctrl.leftEnd.x;
		} else if ( this.direction === 2 ) {
			s = ctrl.leftStart.y - ctrl.leftEnd.y;
		}
		if (s!==0) {
			ctrl.leftStart = LZR.HTML5.Util.clone(ctrl.leftEnd);
			this.scroll (s);
		}
	} else if ( ctrl.wheelValue !== 0) {
		s = ctrl.wheelValue * -this.wheelScale;
		ctrl.wheelValue = 0;

		switch (this.wheelStyle) {
			case 1:
				this.scroll (s);
				break;
			case 2:
				this.aline( s );
				break;
			case 3:
				this.select( this.index + s );
				break;
		}
	} else {
		this.aline();
	}
};

// 计算可拖动的最大位置
LZR.HTML5.Canvas.Thumbnail.prototype.calculateMax = function() {
	var d = Math.ceil(this.count/this.rows);
	if ( this.direction === 1 ) {
		d = d*(this.width+this.paddingU) - this.canvas.width;
	} else if ( this.direction === 2 ) {
		d = d*(this.height+this.paddingU) - this.canvas.height;
	}
	if (d<0) {
		d = 0;
	}
	d += this.buff;
	this.max = d;
};

// 画布单击事件
LZR.HTML5.Canvas.Thumbnail.prototype.click = function (x, y) {
	var p = LZR.HTML5.Util.getDomPositionForDocument (this.canvas);
	x -= p.left;
	y -= p.top;
	var i = this.calculateIndex (x, y).index;

	if (i !== this.index) {
		this.index = i;
		this.onchange (i);
	}
	this.onclick(i);
};

// 根据坐标计算对应的图片序号
LZR.HTML5.Canvas.Thumbnail.prototype.calculateIndex = function (x, y) {
	var d, t, u, v;
	if ( this.direction === 1 ) {
		d = this.width + this.paddingU;
		t = this.height + this.paddingV;
		u = this.position + x;
		v = y;
	} else if ( this.direction === 2 ) {
		d = this.height + this.paddingU;
		t = this.width + this.paddingV;
		u = this.position + y;
		v = x;
	}

	var i = Math.floor( u/d );
	var r = Math.floor( v/t );
	if (r >= this.rows) {
		r = this.rows - 1;
	}
/*
alert (	"------\n" +
	"x = " + x + "\n" +
	"y = " + y + "\n" +
	"u = " + u + "\n" +
	"v = " + v + "\n" +
	"d = " + d + "\n" +
	"t = " + t + "\n" +
	"i = " + i + "\n" +
	"r = " + r + "\n"
);
*/
	r += (i * this.rows);
	if (r >= this.count) {
		r = this.count - 1;
	}

	return { "d":d, "t":t, "i":i, "index": r };
};

// 归位
LZR.HTML5.Canvas.Thumbnail.prototype.aline = function (num, absolute) {
	/*
		参数说明：
			num：序号数
			absolute：绝对序号
	*/
	if ( !isNaN(num) ) {
		this.alineState = 1;
	}
	if (this.alineState === 1) {
		this.alineState = 2;
		var enable = this.ctrl.state !== this.ctrl.STATE.UNABLE;	// 保存动画之前的鼠标控制状态
		this.ctrlDisable ();

		// 计算目标位置
		var dp, di;
		if (this.position < 0) {
			dp = 0;
		} else {
			di = this.calculateIndex (0, 0);
			dp = di.i * di.d;
			if ( (this.position - dp) > (di.d/2) ) {
				dp += di.d;
			}
		}

		if ( !isNaN(num) ) {
			if (absolute) {
				dp = di.d* Math.floor( num / this.rows );
			} else {
				dp += (di.d*num);
			}
		}

		if (dp <= 0) {
			dp = 0;
			if (this.position <= dp) {
				this.position = -this.buff;
			}
		} else if (dp > this.max) {
			dp = this.max-this.buff;
			if (this.position >= dp) {
				this.position = this.max;
			}
		}
/*
LZR.HTML5.log(
	"dp ：" + dp + '\n' +
	"index ：" + di.index + '\n' +
	"d ：" + di.d + '\n' +
	"i ：" + di.i + '\n' +
	"position ：" + this.position + '\n' +
	"III ：" + dp/di.d + '\n'
);
*/
		// 执行归位动画
		this.alineShow (dp, this.alineFrameNum, 0, 20, enable);
	}
};

// 归位动画
LZR.HTML5.Canvas.Thumbnail.prototype.alineShow = function (dp, num, current, waitTime, enable) {
	/*
		参数说明：
			dp：目标位置
			num：动画总帧数
			current：当前帧数
			waitTime：每一帧之间的时间间隔
	*/

	var end = function (self, enable) {
		self.position = dp;
		self.flush();
		self.alineState = 0;
		if (enable) {
			self.ctrlEnable();
		}
	};
/*
LZR.HTML5.log(
	"dp ：" + dp + '\n' +
	"num ：" + num + '\n' +
	"current ：" + current + '\n' +
	"waitTime ：" + waitTime + '\n'
);
*/
	var t = num - current;
	if ( t<=1 ) {
		end(this, enable);
	} else {
		var d = Math.floor ( (dp-this.position) / t );
		if (d === 0) {
			end(this, enable);
		} else {
			this.position += d;
			this.flush();
			current++;
			setTimeout( LZR.HTML5.Util.bind (this, this.alineShow, dp, num, current, waitTime, enable) ,waitTime );
		}
	}
};

// 选中图片
LZR.HTML5.Canvas.Thumbnail.prototype.select = function(index) {
	if (this.index !== index) {
		if (index >= this.count) {
			index = this.count-1;
		} else if (index < 0) {
			index = 0;
		}
		this.index = index;
		this.aline (index, true);
		this.onchange (index);
	}
};

// 启动图层管理器的鼠标响应功能
LZR.HTML5.Canvas.Thumbnail.prototype.ctrlEnable = function () {
	if (this.ctrl.state === this.ctrl.STATE.UNABLE) {
		this.ctrl.enable ();
	}
};

// 停止图层管理器的鼠标响应功能
LZR.HTML5.Canvas.Thumbnail.prototype.ctrlDisable = function () {
	if (this.ctrl.state !== this.ctrl.STATE.UNABLE) {
		this.ctrl.disable();
	}
};

// 重新计算尺寸
LZR.HTML5.Canvas.Thumbnail.prototype.resize = function () {
	// LZR.HTML5.log(this.canvas.clientHeight);
	var f = this.ctx.font;
	LZR.HTML5.Util.mateWidth (this.canvas);
	this.init();
	this.ctx.font = f;
};

// 加载对应序号的缩略图图片（接口）
LZR.HTML5.Canvas.Thumbnail.prototype.loadImg = function(index) {};

// 选择变换回调函数（接口）
LZR.HTML5.Canvas.Thumbnail.prototype.onchange = function(index) {};

// 单击回调函数（接口）
LZR.HTML5.Canvas.Thumbnail.prototype.onclick = function(index) {};

// 附加绘图（接口）
LZR.HTML5.Canvas.Thumbnail.prototype.draw = function(thumbnail, index, x, y, w, h) {};

// 附加绘图（接口）
LZR.HTML5.Canvas.Thumbnail.prototype.beforeDraw = function(thumbnail, index, x, y, w, h) {};

