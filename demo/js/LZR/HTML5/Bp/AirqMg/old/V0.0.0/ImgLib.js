// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/ImgLib.js" ]);

// ----------- 图片库 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/Canvas/LayerMgrEys.js",
	LZR.HTML5.jsPath + "HTML5/Canvas/Thumbnail.js",
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegImg.js",
	LZR.HTML5.jsPath + "HTML5/util/Scroll.js",
	LZR.HTML5.jsPath + "HTML5/Canvas/ImgLoader.js"
]);
LZR.HTML5.Bp.AirqMg.ImgLib = function (obj) {
	/*
		参数说明：
			{
				// 图片信息
				imginfo: [
					{
						tim,		// 图片概述
						path,		// 图片路径
					}, ....
				],

				// 图片备注
				memo,

				// 图片大小
				area: {
					top,
					left,
					width,
					height
				},

				// 滚动条参数
				scrollObj: {
					stripClass	// 长条 CSS 样式
					btnClass	// 按钮 CSS 样式
					div,		// 容器
				},

				title,	// 标题
				map,	// 地图DIV
				tbn,	// 缩略图DIV
			}
	*/

	// 图片备注
	if (obj.memo) {
		this.memo = obj.memo;
	} else {
		this.memo = "";
	}

	// 图片大小
	if (obj.area) {
		this.area = obj.area;
	} else {
		this.area = {
			top: 1,
			left: 1,
			width: 500,
			height: 500
		};
	}

	// 图片信息
	if (obj.imginfo) {
		this.imginfo = obj.imginfo;
	} else {
		this.imginfo = [{
			tim: "无图片"
		}];
	}

	// 标题
	this.title = obj.title;

	// 地图
	LZR.HTML5.Util.mateWidth (obj.map);
	obj.map.style.cursor = "crosshair";
	this.map = new LZR.HTML5.Canvas.LayerManager (obj.map);

	this.map.max.reset(this.area);
	this.map.s.top = this.map.max.top;
	this.map.s.left = this.map.max.left;

	this.map.min.reset({
		width: 100,
		height: 100
	});
	this.map.ctrl.leftCursor = "move";

	// 缩略图
	LZR.HTML5.Util.mateWidth (obj.tbn);
	this.tbn = new LZR.HTML5.Canvas.Thumbnail(obj.tbn);
	this.tbn.direction = 2;
	this.tbn.width = 167;
	this.tbn.height = 130;
	this.tbn.paddingU = 40;
	this.tbn.offsetU = 2;
	this.tbn.offsetV = 5;
	this.tbn.buff = 0;
	this.tbn.ctx.fillStyle="black";
	this.tbn.onchange = LZR.HTML5.Util.bind (this, function (i) {
		this.map.layers[0].obj = this.tbn.imgs[i].getLayers()[0].obj;
		this.changeTitle ();
	});

	// 底图图片
	this.maps = new LZR.HTML5.Canvas.ImgLoader( LZR.HTML5.Util.bind (this, this.onMaps) );

	// 图片
	this.tbns = new LZR.HTML5.Canvas.ImgLoader( LZR.HTML5.Util.bind (this, this.onTbns) );
	this.tbns.finished = LZR.HTML5.Util.bind (this, function() {
		this.playState = 0;
	});

	// 是否可循环控制（0：请求停止；1：启动；2：真正停止）
	this.ctrlEnable = 1;

	// 图片路径
	this.path = LZR.HTML5.upPath(7) + "data/RegImg/";

	// 动画播放速度
	this.playSpeed = 1;

	// 动画播放状态
	this.playState = -1;

	// 动画播放跳帧
	this.playFrame = 1;

	// 滚动条
	this.scrollObj = obj.scrollObj;

	// 添加窗体变化自适应功能
	LZR.HTML5.Util.Event.addEvent (window, "resize", LZR.bind(this, this.resize), false);
};
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.className = "LZR.HTML5.Bp.AirqMg.ImgLib";
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.version = "0.0.0";

// 初始化
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.init = function () {
	this.map.max.reset(this.area);

	this.initTbn();
	this.map.init();
	this.tbn.init();
	this.createScroll();
	this.loadMaps();
};

// 缩略图初始化
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.initTbn = function () {
	this.tbn.index = 0;
	this.tbn.count = this.imginfo.length;
	this.tbn.wheelScale = 1;
	this.tbn.wheelStyle = 2;
	this.tbn.ctx.font="18px Verdana";
	this.tbn.draw = function (tb, i, x, y, w, h) {
		tb.ctx.fillText( tb.imgs[i].tim, x+15 , y + h + 20);
	};
};

// 启动循环控制
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.ctrlStart = function () {
	this.map.ctrlEnable();
	this.tbn.ctrlEnable();
	this.scroll.ctrlEnable();
	this.ctrl (this.playSpeed, true);
};

// 关闭循环控制
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.ctrlStop = function () {
	this.ctrlEnable = 0;
	this.map.ctrlDisable();
	this.tbn.ctrlDisable();
	this.scroll.ctrlDisable();
};

// 循环控制
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.ctrl = function (v, start) {
	switch (this.ctrlEnable) {
		case 0:		// 请求停止
			if (start) {
				this.ctrlEnable = 1;
			} else {
				this.ctrlEnable = 2;
			}
			break;
		case 1:		// 启动
			this.map.ctrlUpdate();
			this.tbn.ctrlUpdate();
			this.map.flush();
			this.tbn.flush();

			// 动画播放
			v = this.play(v);

			// 滚动条
			this.fulshScroll();
			requestAnimationFrame( LZR.HTML5.Util.bind ( this, this.ctrl, v ) );
			break;
		case 2:		// 真正停止
			if (start) {
				this.ctrlEnable = 1;
				alert("ctrl = 2。真正的停止 ...");
			}
			break;
	}
};

// 加载底图
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.loadMaps = function () {
	var url = this.path + "back.gif";
	this.maps.add(url, 0);
};

// 底图加载后回调内容
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.onMaps = function (index, img) {
	var m = new LZR.HTML5.Canvas.Layer({name:"底图", obj:img});

	// 防止图层重复加载而清空元素
	this.map.layers = [];
	this.tbn.imgs = [];

	// 填充地图数据
	this.map.addLayer ( m );

	// 填充缩略图数据
	this.fillTbn (img);
	this.changeTitle ();

	// 启动控制
	this.ctrlStart();

	// 加载其它分布图
	this.loadTbns();
};

// 填充缩略图数据
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.fillTbn = function (img) {
	for (var i=0; i<this.imginfo.length; i++) {
		var r = new LZR.HTML5.Bp.AirqMg.RegImg();
		r.url = this.imginfo[i].path;
		r.tim = this.imginfo[i].tim;
		r.layers.push( new LZR.HTML5.Canvas.Layer({name:"图片", obj:img}) );
		this.tbn.imgs.push( r );
	}
};

// 加载分布图
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.loadTbns = function () {
	this.tbns.fact = 0;
	this.tbns.expect = 0;
	this.tbns.add(this.tbn.imgs[ this.tbn.index ].url, this.tbn.index);
	for (var i=0; i<this.tbn.count; i++) {
		if (i !== this.tbn.index) {
			this.tbns.add(this.tbn.imgs[i].url, i);
		}
	}
};

// 分布图加载回调内容
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.onTbns = function (index, img) {
	if (img.src != this.imginfo[index].path) {
		console.log(img.src);
		console.log(this.imginfo[index].path.toString());
		return;
	}
	this.tbn.imgs[index].layers[0].obj = img;
	if (index === this.tbn.index) {
		this.tbn.aline (index, true);
		this.tbn.onchange (index);
	}
};

// 清空图片数据
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.clear = function () {
	this.ctrlStop();
	this.map.layers = [];
	this.tbn.imgs = [];
	this.playState = -1;
	this.playSpeed = 1;
};

// 标题变更
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.changeTitle = function () {
	this.title.innerHTML =	this.tbn.imgs[this.tbn.index].tim + this.memo;
};

// 播放动画
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.play = function (v) {
	if (this.playState == 1) {
		if (v>0) {
			v--;
		} else {
			v = this.playSpeed;
			var t = this.playFrame;
			t += this.tbn.index;
			if (t>=this.tbn.count) {
				t = 0;
			}
			this.tbn.select (t);
		}
	}
	return v;
};

// 动画控制
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.changeAnimation = function () {
	if (this.playState == -1) {
		return 0;
	} else if (this.playState == 1) {
		// 停止动画
		this.playState = 0;
		this.tbn.ctrlEnable();
		this.scroll.ctrlEnable();
	} else {
		// 播放动画
		this.tbn.ctrlDisable();
		this.scroll.ctrlDisable();
		this.playState = 1;
	}
	return this.playState;
};

// 控制帧头帧尾
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.changeHeadTail = function (i) {
	if (i) {
		this.tbn.select(this.tbn.count);
	} else {
		this.tbn.select(0);
	}
	return this.playState;
};

// 控制翻页
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.changePage = function (i) {
	this.tbn.select(this.tbn.index + i * this.playFrame);
};

// 设置播放速度
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.setSpeed = function (i) {
	this.playSpeed += i;
	if (this.playSpeed > 30) {
		this.playSpeed = 30;
	} else if (this.playSpeed < 0) {
		this.playSpeed = 0;
	}
};

// 生成滚动条
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.createScroll = function (p) {
	if (!this.scroll) {
		this.scrollObj.count = this.tbn.max + this.tbn.canvas.height;
		this.scrollObj.position = 0;
		this.scrollObj.autoLen = this.tbn.canvas.height;
		this.scrollObj.direction = 2;
		this.scrollObj.autoMin = 20;
		this.scrollObj.hidTooBig = false;
		this.scrollObj.padd = 0;
		this.scrollObj.len = "100%";

		this.scroll = new LZR.HTML5.Util.Scroll (this.scrollObj);
		this.scroll.onchange = LZR.bind(this, function(p) {
			this.tbn.position = p;
		});
		this.scroll.init();
	} else {
		this.scroll.srcObj.count = this.tbn.max + this.tbn.canvas.height;
		if (p) {
			this.scroll.position = p;
		} else {
			this.scroll.position = 0;
		}
		this.scroll.autoLen = this.tbn.canvas.height;
		this.scroll.init();
	}
};

// 刷新滚动条
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.fulshScroll = function () {
	if (this.tbn.position !== this.scroll.position) {
		this.scroll.setPosition (this.tbn.position);
	}
};

// 窗体自适应功能
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.resize = function () {
	this.map.resize();
	this.tbn.resize();
	this.createScroll (this.scroll.position);
	this.legend.resize();
	this.compass.resize();
};

// 设置图片信息
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.setImginfo = function (info, memo, area) {
	this.clear();
	this.imginfo = info;
	this.memo = memo;
	this.area = area;
	this.init();
};

