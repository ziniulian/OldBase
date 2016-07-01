// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/ImgLib.js" ]);

// ----------- 图片库 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/Canvas/LayerManager.js",
	LZR.HTML5.jsPath + "HTML5/Canvas/Thumbnail.js",
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegImg.js",
	LZR.HTML5.jsPath + "HTML5/util/Scroll.js",
	LZR.HTML5.jsPath + "HTML5/Canvas/ImgLoader.js"
]);
LZR.HTML5.Bp.AirqMg.ImgLib = function (obj) {
	/*
		参数说明：
			{
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

	// 标题
	this.title = obj.title;

	// 地图
	LZR.HTML5.Util.mateWidth (obj.map);
	obj.map.style.cursor = "crosshair";
	this.map = new LZR.HTML5.Canvas.LayerManager (obj.map);
	this.map.ctrl.leftCursor = "move";
	this.map.autoMove = false;
	this.map.autoZoom = false;

	// 缩略图
	LZR.HTML5.Util.mateWidth (obj.tbn);
	this.tbn = new LZR.HTML5.Canvas.Thumbnail(obj.tbn);
	this.tbn.direction = 2;
	this.tbn.width = 156;
	this.tbn.height = 120;
	this.tbn.paddingU = 40;
	this.tbn.offsetU = 10;
	this.tbn.offsetV = 10;
	this.tbn.buff = 0;
	this.tbn.wheelScale = 1;
	this.tbn.wheelStyle = 2;
	this.tbn.ctx.fillStyle="#777";
	this.tbn.draw = LZR.bind (this, function (tb, i, x, y, w, h) {
		tb.ctx.textAlign = "center";	// 画布字体居中
		tb.ctx.fillText( tb.imgs[i].tim, x+this.tbn.width/2 , y + h + this.tbnFont[0].bottom);
	});
	this.tbn.onchange = LZR.HTML5.Util.bind (this, function (i) {
		this.map.layers[0].obj = this.tbn.imgs[i].getLayers()[0].obj;
		this.changeTitle ();
	});

	// 图片
	this.tbns = new LZR.HTML5.Canvas.ImgLoader( LZR.bind (this, this.onTbns) );
	this.tbns.onCount = LZR.bind(this, function (c, d) {
		this.fillLayers(d.count);
	});

	// 是否可循环控制（0：请求停止；1：启动；2：真正停止）
	this.ctrlEnable = 1;

	// 图片路径
	this.path = "";

	// 动画播放速度
	this.playSpeed = 1;

	// 动画播放状态
	this.playState = 0;

	// 动画播放跳帧
	this.playFrame = 1;

	// 滚动条
	this.scrollObj = obj.scrollObj;

	// 缩略图字体样式
	this.tbnFont = [
		{
			left: 12,
			bottom: 25,
			font: "20px Verdana"
		}
	];

	// webSocket 连接信息
	this.wsInfo = {	// Base64 方式
		url: "ws://192.168.1.211:8989",	// Websocket 服务路径
		typ: "picContent",	// 马远接口的typ值
		pre: "data:image/jpeg;base64,",	// 图片路径前缀
		fld: "Byte64"		// 马远接口的图片路径值
	};

	// 图片居中
	this.mapLimitCenter = false;

	// 添加窗体变化自适应功能
	LZR.HTML5.Util.Event.addEvent (window, "resize", LZR.bind(this, this.resize), false);
};
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.className = "LZR.HTML5.Bp.AirqMg.ImgLib";
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.version = "0.0.2";

// 初始化
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.init = function () {
	this.tbn.ctx.font=this.tbnFont[0].font;

	this.pic = document.createElement("img");	// 缓冲图片
	this.pic.onload = LZR.bind(this, function () {
		this.map.addLayer (new LZR.HTML5.Canvas.Layer({obj: this.pic}), "图片");
		this.map.init();
		this.tbn.init();
		this.initMap();
		this.initTbn();
		this.ctrlStart();
		this.loadTbns();
	});
	this.pic.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABGdBTUEAALGPC/xhBQAAAA5JREFUKFNjYBgFgzMEAAGaAAFUMoc2AAAAAElFTkSuQmCC";
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
			// 画笔功能
			if (this.pen) {
				this.pen.ctrlUpdate();
			}
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
				// alert("ctrl = 2。真正的停止 ...");
			}
			break;
	}
};

// 加载分布图
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.loadTbns = function () {
	var typ = this.imginfo;
	var d = {
		type: this.wsInfo.typ,
		picType: [typ],
		sort: 0
	};

	switch (this.typ) {
		case "yu":
			d[typ] = {
				"times": this.date + this.tim,
				"periodStart": 0,
				"periodEnd": 240
			};
			break;
		case "child":
			d[typ] = {
				"timesRange": [this.liveStartDate, this.liveEndDate]
			};
			break;
	}
/*
	// 查询日期
	var te = new Date(this.condition.date);		// 结束时间
	var t = (this.condition.count - 1) * 3600 * 1000;
	if (this.condition.ttyp === 0) {
		t *= 24;
	}
	var ts = new Date(this.condition.date - t);		// 开始时间

	// 日期转换
	t = ts.getFullYear();
	t += LZR.HTML5.Util.format (ts.getMonth()+1, 2, "0");
	t += LZR.HTML5.Util.format (ts.getDate(), 2, "0");
	t += LZR.HTML5.Util.format (ts.getHours(), 2, "0");
	ts = t;
	t = te.getFullYear();
	t += LZR.HTML5.Util.format (te.getMonth()+1, 2, "0");
	t += LZR.HTML5.Util.format (te.getDate(), 2, "0");
	t += LZR.HTML5.Util.format (te.getHours(), 2, "0");
	te = t;
*/
	this.tbns.addByWebSocket (this.wsInfo, d);
// console.log( JSON.stringify (d) );
};

// 初始化地图
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.initMap = function (p) {
	if (!p) {
		p = this.pic;
		this.map.layers[0].obj = this.pic;
	}
	this.map.s.top = 0;
	this.map.s.left = 0;
	this.map.s.w = p.width;
	this.map.s.reHeight();
	this.map.resetMax (0, 0, p.width, p.height);

	if (this.mapLimitCenter) {
		this.hdMapLimitCenter(p);
	}
};

// 图片居中
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.hdMapLimitCenter = function (p) {
	if (!p) {
		p = this.map.layers[0].obj;
	}
	this.map.resetMax (0, 0, p.width, p.height);
	this.map.max.rrByParent (this.map.s);
	this.map.s.w *= this.map.max.baseW / this.map.max.w;
	this.map.s.reHeight();
	this.map.max.w = this.map.max.baseW;
	this.map.max.reHeight();
	this.map.s.alineInParent ("center", this.map.max);
};

// 缩略图初始化
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.initTbn = function (count) {
	if (!count) {
		count = 0;
	}
	this.tbn.index = 0;
	this.tbn.imgs = [];
	this.tbn.count = count;
	this.tbn.calculateMax();
	this.createScroll();
};

// 填充图层
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.fillLayers = function (count) {
	var i , r;
	for (i=0; i<count; i++) {
		r = new LZR.HTML5.Bp.AirqMg.RegImg();
		r.tim = "";
		r.layers.push( new LZR.HTML5.Canvas.Layer({name: i, obj:this.pic}) );
		this.tbn.imgs.push( r );
	}
	this.tbn.count = count;
	this.tbn.calculateMax();
	this.createScroll();
	// this.tbn.index = 0;
	// this.tbn.aline (0, true);
};

// 分布图加载回调内容
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.onTbns = function (index, img, data) {
	// 获取时间
	var tim = "";
	var n = data.picTime.length;
	for (var i=0; i<n; i++) {
		tim += data.picTime[i];
		switch (i) {
			case 3:
			case 5:
				tim += "-";
				break;
			case 7:
				if (n>8) {
					tim += " ";
				}
				break;
		}
	}
	if (n>8) {
		tim += "时";
	}

	var ms = this.tbn.imgs[index];
	if (ms) {
		ms.tim = tim;
		ms.layers[0].obj = img;
	}

	if (index === 0) {
		this.initMap (img);
		this.tbn.onchange (0);
		// if (img.width) { img.onload(img); }
	}
};

// 清空图片数据
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.clear = function () {
	this.tbns.closeWebSocket();
	this.initMap();
	this.initTbn();
	this.playState = 0;
	this.playSpeed = 1;
	this.title.innerHTML = "";
};

// 标题变更
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.changeTitle = function () {
	this.title.innerHTML = this.tbn.imgs[this.tbn.index].tim + "_" + this.memo;
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
		this.scrollObj.hidTooBig = true;
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
};

// 设置图片信息
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.setInfo = function (info, name, typ, tim, redo) {
	// 图片类型编号
	this.imginfo = info;

	// 图片信息
	this.memo = name;

	// 图片类型（实况/下载）
	this.typ = typ;

	// 时次
	this.tim = tim;

	if (redo) {
		this.clear();
		this.loadTbns();
	}
};

// 设置查询日期
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.setDate = function (d, redo) {
	// 查询日期（yyyymmdd）
	this.date = d;
	if (redo) {
		this.clear();
		this.loadTbns();
	}
};

// 设置查询开始日期
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.setLiveStartDate = function (d, redo) {
	// 查询日期（yyyymmddhh）
	this.liveStartDate = d;
	if (redo) {
		this.clear();
		this.loadTbns();
	}
};

// 设置查询结束日期
LZR.HTML5.Bp.AirqMg.ImgLib.prototype.setLiveEndDate = function (d, redo) {
	// 查询日期（yyyymmddhh）
	this.liveEndDate = d;
	if (redo) {
		this.clear();
		this.loadTbns();
	}
};


