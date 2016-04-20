// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat.js" ]);

// ----------- ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/Date.js",
	LZR.HTML5.jsPath + "HTML5/Canvas/LayerMgrEys.js",
	LZR.HTML5.jsPath + "HTML5/Canvas/Thumbnail.js",
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegImg.js",
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStatRule.js",
	LZR.HTML5.jsPath + "HTML5/util/Scroll.js",
	LZR.HTML5.jsPath + "HTML5/Canvas/ImgLoader.js"
]);
LZR.HTML5.Bp.AirqMg.RegStat = function (obj) {
	/*
		参数说明：
			{
				// 查询条件
				condition: {
					_date,		// 产品查询日期
					dateName,	// 产品日期名
					date,		// 产品初始日期
					_tim,		// 产品查询时次
					timName,	// 产品时次名
					tim,		// 产品初始时次
					ttyp,		// 日均/小时值	（小时:1, 日均:0）
					ttypName,	// 日均/小时 名
					area,		// 区域		（全国:1, 华东:2, 京津冀:3）
					areaName,	// 区域名
					mod,		// 模式
					fom,		// 污染物
					fomName,	// 污染物名

					layersInfo: [	// 图层信息获取条件
						{
							typ: [],		// 图片类型编号（包含小时和日均两种）
							mod: ""		// 模式条件
						},
						..........
					]
				},

				// 滚动条参数
				scrollObj: {
					stripClass	// 长条 CSS 样式
					btnClass	// 按钮 CSS 样式
					div,		// 容器
				}

				title,	// 标题
				map,	// 地图DIV
				tbn,	// 缩略图DIV
				eys,	// 鹰眼DIV

			}
	*/
	// 查询条件
	if (obj.condition) {
		this.condition = obj.condition;
	} else {
		this.condition = {};
	}

	// 标题
	this.title = obj.title;

	// 地图
	LZR.HTML5.Util.mateWidth (obj.map);
	obj.map.style.cursor = "crosshair";
	this.map = new LZR.HTML5.Canvas.LayerManager (obj.map);
	this.map.min.reset({
		width: 100,
		height: 100
	});
	this.map.offset = {
		left: 40,
		top: 1,
		right: 1,
		bottom: 25
	};
	this.map.ctrl.leftCursor = "move";
	this.map.autoFlush = LZR.HTML5.Util.bind (this, this.mapAutoFlush);

	// 鹰眼
	LZR.HTML5.Util.mateWidth (obj.eys);
	obj.eys.style.cursor = "crosshair";
	this.eys = new LZR.HTML5.Canvas.LayerMgrEys ({
		canvas: obj.eys,
		layerMgr: this.map
	});

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
	this.tbn.ctx.fillStyle="black";
	this.tbn.onchange = LZR.HTML5.Util.bind (this, function (i) {
/*
		var ls = this.tbn.imgs[i].getLayers();
		this.map.layers[0].obj = ls[0].obj;

		for (var j = 2; j<ls.length; j++) {
			this.map.layers[j] = ls[j];
		}
*/
		this.map.layers = this.tbn.imgs[i].getLayers();
		this.changeTitle ();
	});

	// 地图图片
	this.maps = new LZR.HTML5.Canvas.ImgLoader( LZR.HTML5.Util.bind (this, this.onMaps) );

	// 是否可循环控制（0：请求停止；1：启动；2：真正停止）
	this.ctrlEnable = 1;

	// 动画播放速度
	this.playSpeed = 1;

	// 动画播放状态（-1：动画不能播放；0：动画暂停；1：动画播放）
	// this.playState = -1;
	this.playState = 0;

	// 动画播放跳帧
	this.playFrame = 1;

	// 指南针
	this.compass = {};

	// 图例
	this.legend = {};

	// 比例尺
	this.ruler = null;

	// 滚动条
	this.scrollObj = obj.scrollObj;

	// 边框颜色
	this.boderColor = null;

	// 图片路径
	this.path = "";

	// 缩略图字体样式
	this.tbnFont = [
		{
			left: 25,
			bottom: 20,
			font: "17px Verdana"
		},
		{
			left: 5,
			bottom: 20,
			font: "17px Verdana"
		}
	];

	// 预报天数
	this.dayNum = 7;

	// 小时间隔
	this.hourStep = 1;

	// 比例尺范围
	this.rulerArea = {
		latt: 55,
		latb: 8,
		lonl: 69,
		lonr:140,
		dlon: 9,
		dlat: 8
	};

	// 地图初始范围
	this.mapArea = null;
/*
	// 范围举例
	this.mapArea = {
		top: 0,
		left: 0,
		width: 100
	};
*/

	// 时效起始时间
	this.periodStart = 4;

	// 各图层的图片下载器
	this.layersLoader = [];

	// 图片—— 0
	var ayid = 0;
	this.layersLoader[ayid] = new LZR.HTML5.Canvas.ImgLoader( LZR.bind (this, this.onLayersLoad, ayid) );
	this.layersLoader[ayid].finished = LZR.bind (this, function () {
		// this.playState = 0;
		this.tbnFinished();
	});

	// 生成其它图层
	this.createLayersLoader ();

	// webSocket 连接信息
/*
	this.wsInfo = {	// Base64 方式
		url: "ws://192.168.1.211:8989",	// Websocket 服务路径
		typ: "picContent",	// 马远接口的typ值
		pre: "data:image/jpeg;base64,",	// 图片路径前缀
		fld: "Byte64"		// 马远接口的图片路径值
	};
*/
	this.wsInfo = {		// URL 方式
		url: "ws://192.168.1.130:8901",	// Websocket 服务路径
		typ: "picURL",		// 马远接口的typ值
		pre: "http://192.168.1.101/imgServer/picService?type=1&path=",	// 图片路径前缀
		fld: "URL"		// 马远接口的图片路径值
	};

	// 添加窗体变化自适应功能
	LZR.HTML5.Util.Event.addEvent (window, "resize", LZR.bind(this, this.resize), false);
};
LZR.HTML5.Bp.AirqMg.RegStat.prototype.className = "LZR.HTML5.Bp.AirqMg.RegStat";
LZR.HTML5.Bp.AirqMg.RegStat.prototype.version = "0.0.8";

// 初始化
LZR.HTML5.Bp.AirqMg.RegStat.prototype.init = function () {
	this.initTbn();
	this.map.init();
	this.tbn.init();
	this.eys.init();
	this.loadEys();
	this.createRuler();
	this.createScroll();
	this.loadMaps();
};

// 缩略图初始化
LZR.HTML5.Bp.AirqMg.RegStat.prototype.initTbn = function () {
	if (this.condition.ttyp == 1) {
		this.tbn.index = new Date().getHours();
		if (this.tbn.index > this.condition.tim) {
			this.tbn.index = Math.floor( (this.tbn.index - this.condition.tim) / this.hourStep) + 1;
		} else {
			this.tbn.index = 0;
		}
		this.tbn.count = Math.ceil((24 - this.condition.tim) / this.hourStep);
		this.tbn.count += Math.floor(24 * (this.dayNum - 1) / this.hourStep);
		this.tbn.ctx.font=this.tbnFont[1].font;
		this.tbn.wheelScale = 3;
		this.tbn.wheelStyle = 2;
		this.tbn.draw = LZR.bind (this, function (tb, i, x, y, w, h) {
			tb.ctx.fillText( tb.imgs[i].tim, (x+this.tbnFont[1].left) , (y + h + this.tbnFont[1].bottom));
		});
	} else {
		this.tbn.index = 0;
		this.tbn.count = this.dayNum;
		this.tbn.ctx.font=this.tbnFont[0].font;
		this.tbn.wheelScale = 1;
		this.tbn.wheelStyle = 2;
		this.tbn.draw = LZR.bind (this, function (tb, i, x, y, w, h) {
			tb.ctx.fillText( tb.imgs[i].tim, x+this.tbnFont[0].left , y + h + this.tbnFont[0].bottom);
		});
	}
};

// 启动循环控制
LZR.HTML5.Bp.AirqMg.RegStat.prototype.ctrlStart = function () {
	this.map.ctrlEnable();
	this.tbn.ctrlEnable();
	this.eys.ctrlEnable();
	this.scroll.ctrlEnable();
	this.ctrl (this.playSpeed, true);
};

// 加载鹰眼图片
LZR.HTML5.Bp.AirqMg.RegStat.prototype.loadEys = function (url) {
	this.eys.layers = [];
	if (!url) {
		url = this.path;
	}
	url += "D" + this.condition.area + ".png";
	this.maps.add(url, 0, LZR.HTML5.Util.bind ( this, function (i, p) {
		this.eys.layers.push(new LZR.HTML5.Canvas.Layer({name:"地图", obj:p}));
	} ));
};

// 关闭循环控制
LZR.HTML5.Bp.AirqMg.RegStat.prototype.ctrlStop = function () {
	this.ctrlEnable = 0;
	this.map.ctrlDisable();
	this.tbn.ctrlDisable();
	this.eys.ctrlDisable();
	this.scroll.ctrlDisable();
};

// 循环控制
LZR.HTML5.Bp.AirqMg.RegStat.prototype.ctrl = function (v, start) {
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
			this.eys.ctrlUpdate();
			this.map.flush();
			this.tbn.flush();
			this.eys.flush();

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

// 加载地图底图
LZR.HTML5.Bp.AirqMg.RegStat.prototype.loadMaps = function (url) {
	if (!url) {
		url = this.path;
	}
	url += "D" + this.condition.area + ".png";
	this.maps.add(url, this.condition.area);
};

// 地图底图加载后回调内容
LZR.HTML5.Bp.AirqMg.RegStat.prototype.onMaps = function (index, img) {
	// 初始图片范围
	this.hdMapArea (img, true);

	// 防止图层重复加载而清空元素
	this.map.layers = [];
	this.tbn.imgs = [];

	// 填充图层
	this.fillLayers(img);

	// 启动控制
	this.ctrlStart();

	// 加载
	this.loadLayers(0);

	// 回调
	this.mapFinished();
};

// 图片居中
LZR.HTML5.Bp.AirqMg.RegStat.prototype.hdMapLimitCenter = function (p) {
	if (!p) {
		p = this.map.layers[1].obj;
	}
	this.map.resetMax (0, 0, p.width, p.height);
	this.map.max.rrByParent (this.map.s);
	this.map.s.w *= this.map.max.baseW / this.map.max.w;
	this.map.s.reHeight();
	this.map.max.w = this.map.max.baseW;
	this.map.max.reHeight();
	this.map.s.alineInParent ("center", this.map.max);
};

// 初始图片范围
LZR.HTML5.Bp.AirqMg.RegStat.prototype.hdMapArea = function (p, initMap) {
	if (initMap && p) {
		this.map.resetMax (0, 0, p.width, p.height);
		this.map.s.top = 0;
		this.map.s.left = 0;
		this.map.s.w = this.map.max.w;
		this.map.s.reHeight();
	}
	if (this.mapArea) {
		if (this.mapArea === "center") {
			this.hdMapLimitCenter(p);
		} else {
			this.map.s.top = this.mapArea.top;
			this.map.s.left = this.mapArea.left;
			this.map.s.w = this.mapArea.width;
			this.map.s.reHeight();
		}
	}
};

// 原比例显示图片
LZR.HTML5.Bp.AirqMg.RegStat.prototype.oneScale = function () {

	if (this.map.s.left<0 || this.map.s.left > this.map.max.w) {
		this.map.s.left = 0;
	}
	if (this.map.s.top<0 || this.map.s.top > this.map.max.h) {
		this.map.s.top = 0;
	}

	this.map.s.w = this.map.canvas.width;
	this.map.s.reHeight();
/*
	if (this.map.s.left<0 || this.map.s.left > this.map.max.baseW) {
		this.map.s.alineInParent ("center", this.map.max);
	}
*/
};

// 生成图层下载器
LZR.HTML5.Bp.AirqMg.RegStat.prototype.createLayersLoader = function () {
	this.layersNum = 2 + this.condition.layersInfo.length;	// 图层个数
	var ff = function (id) {
		this.otherFinished(id);
	};
	for (var i=2; i<this.layersNum; i++) {
		var il = new LZR.HTML5.Canvas.ImgLoader( LZR.bind (this, this.onLayersLoad, i) );
		il.finished = LZR.bind (this, ff, i);
		this.layersLoader[i] = il;
	}
};

// 填充图层
LZR.HTML5.Bp.AirqMg.RegStat.prototype.fillLayers = function (img) {
	var i , j, ay;
	for (i=0; i<this.tbn.count; i++) {
		var r = this.createImg (i, this.condition.date);
		for (j=0; j<this.layersNum; j++) {
			ay = new LZR.HTML5.Canvas.Layer();
			ay.visible = false;
			r.layers.push(ay);
		}
		r.layers[1].obj = img;
		r.layers[1].visible = true;
		r.layers[0].visible = true;
		this.tbn.imgs.push( r );
	}
	i = this.tbn.index;
	this.map.layers = this.tbn.imgs[i].layers;
	this.tbn.aline (i, true);
	this.changeTitle ();
};

// 生成图片信息
LZR.HTML5.Bp.AirqMg.RegStat.prototype.createImg = function (index, d) {
	var r = new LZR.HTML5.Bp.AirqMg.RegImg();
	if (this.condition.ttyp == 1) {
		d += (index * this.hourStep + this.condition.tim) * 60 * 60 *1000;
		d = new Date( d );

		r.tim = d.getFullYear();
		r.tim += "-";
		r.tim += LZR.HTML5.Util.format (d.getMonth()+1, 2, "0");
		r.tim += "-";
		r.tim += LZR.HTML5.Util.format (d.getDate(), 2, "0");
		r.tim += " ";
		r.tim += LZR.HTML5.Util.format (d.getHours(), 2, "0");
		r.tim += "时";
	} else {
		d += index * 24 * 60 * 60 *1000;
		d = new Date( d );

		r.tim = d.getFullYear();
		r.tim += "-";
		r.tim += LZR.HTML5.Util.format (d.getMonth()+1, 2, "0");
		r.tim += "-";
		r.tim += LZR.HTML5.Util.format (d.getDate(), 2, "0");
	}

	return r;
};

// 加载
LZR.HTML5.Bp.AirqMg.RegStat.prototype.loadLayers = function (id) {
	var typ, mod;
	var d = {
		type: this.wsInfo.typ,
		sort: 0
	};

	this.layersLoader[id].closeWebSocket();

	switch (id) {
		case 0:	// 
			typ = this.condition.fom[this.condition.ttyp];
			mod = this.condition.mod;
			this.createTbnQry (d, typ, mod);
			break;
		default:	// 其它图层
			typ = this.condition.layersInfo[id - 2].typ[this.condition.ttyp];
			mod = this.condition.layersInfo[id - 2].mod;
			this.createWeatherQry (d, typ, mod);
			break;
	}

// console.log (JSON.stringify(d));
	this.layersLoader[id].addByWebSocket (this.wsInfo, d);
};

// 生成查询条件
LZR.HTML5.Bp.AirqMg.RegStat.prototype.createTbnQry = function (qry, typ, mod) {
	return this.createWeatherQry (qry, typ, mod);
};

// 生成气象图查询条件
LZR.HTML5.Bp.AirqMg.RegStat.prototype.createWeatherQry = function (qry, typ, mod) {
	qry.picType = [typ];
	qry[typ] = {
		"modelType": [mod],
		"domain": ["d"+ LZR.HTML5.Util.format (this.condition.area, 2, "0")],
		"times": this.condition._date + this.condition._tim,
		"periodStart": this.periodStart,
		"periodEnd": (24 * this.dayNum + this.periodStart)
	};
	return qry;
};

// 加载回调内容
LZR.HTML5.Bp.AirqMg.RegStat.prototype.onLayersLoad = function (id, index, img) {
	var ms = this.tbn.imgs[index];
	if (ms) {
		ms.layers[id].obj = img;
	}
};

// 清空图片数据
LZR.HTML5.Bp.AirqMg.RegStat.prototype.clear = function () {
	this.ctrlStop();
	this.map.layers = [];
	this.tbn.imgs = [];
	this.ruler = null;
	// this.playState = -1;
	this.playSpeed = 1;
};

// 标题变更
LZR.HTML5.Bp.AirqMg.RegStat.prototype.changeTitle = function () {
	this.title.innerHTML =	this.tbn.imgs[this.tbn.index].tim + " " +
				this.condition.mod + "模式" +
				this.condition.fomName +
				this.condition.areaName +
				// this.condition.ttypName +
				"区域 形势<sub>（产品时间：" +
				this.condition.dateName + " " +
				this.condition.timName +
				"）</sub >";
};

// 播放动画
LZR.HTML5.Bp.AirqMg.RegStat.prototype.play = function (v) {
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
LZR.HTML5.Bp.AirqMg.RegStat.prototype.changeAnimation = function () {
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

// 设置跳帧
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setFrame = function (i) {
	this.playFrame = i;
};

// 控制帧头帧尾
LZR.HTML5.Bp.AirqMg.RegStat.prototype.changeHeadTail = function (i) {
	if (i) {
		this.tbn.select(this.tbn.count);
	} else {
		this.tbn.select(0);
	}
	return this.playState;
};

// 控制翻页
LZR.HTML5.Bp.AirqMg.RegStat.prototype.changePage = function (i) {
	this.tbn.select(this.tbn.index + i * this.playFrame);
};

// 设置播放速度
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setSpeed = function (i) {
	this.playSpeed += i;
	if (this.playSpeed > 30) {
		this.playSpeed = 30;
	} else if (this.playSpeed < 0) {
		this.playSpeed = 0;
	}
};

// 清空图层中的图片
LZR.HTML5.Bp.AirqMg.RegStat.prototype.clrLayers = function (index) {
	for (var i=0; i<this.tbn.count; i++) {
		var r = this.tbn.imgs[i].layers;
		if (isNaN(index)) {
			r[0].obj = undefined;
			// 跳过地图图层（1）
			for (var j=2; j<this.layersNum; j++) {
				r[j].obj = undefined;
			}
		} else {
			r[index].obj = undefined;
		}
	}
};

// 设置显示区域
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setMapMax = function (top, left, width, height) {
	this.map.max.reset({
		// 火狐缩放未解决的临时处理办法：将图片割去一个像素的边。
		top: top,
		left: left,
		width: width,
		height: height
	});
	this.map.s.top = top;
	this.map.s.left = left;
	this.map.s.w = width;
	this.map.s.reHeight();
	this.eys.lmEdge.reset ({
		top: top,
		left: left,
		width: width,
		height: height
	});
};

// 设置模式
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setMod = function (value, redo, dn) {
	this.condition.mod = value;
	if (redo) {
		this.clear();
		if (dn) {
			this.setDayNum (dn);
		}
		this.init();
	}
};

// 设置污染物
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setFom = function (name, value, redo) {
	this.condition.fomName = name;
	this.condition.fom = value;
	if (redo) {
		this.changeTitle ();
		this.clrLayers(0);
		this.loadLayers(0);
	}
};

// 设置产品日期
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setDate = function (value, redo) {
	this.condition.dateName = value;
	this.condition._date = value.replace(/-/g, "");
	this.condition.date = LZR.Util.Date.getDate( value ).valueOf() + 24 * 60 * 60 * 1000;
	if (redo) {
		this.clear();
		this.init();
	}
};

// 设置产品时次
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setTim = function (name, value, redo) {
	this.condition.timName = name;
	this.condition._tim = value;
	this.condition.tim = 0;
	if (redo) {
		this.changeTitle ();
		this.clrLayers();
		this.loadLayers(0);
	}
};

// 设置小时/日均类型
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setTtyp = function (name, value, redo) {
	this.condition.ttypName = name;
	this.condition.ttyp = value;
	if (redo) {
		this.clear();
		this.init();
	}
};

// 设置区域（预报天数、比例坐标会变化）
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setArea = function (name, value, redo, dn, ra) {
	this.condition.areaName = name;
	this.condition.area = value;
	if (redo) {
		this.clear();
		this.setDayNum (dn);
		this.setRulerArea (ra);
		this.init();
	}
};

// 设置预报天数
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setDayNum = function (dn) {
	// 重设预报天数
	if (dn) {
		this.dayNum = dn;
	}
};

// 设置比例尺范围
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setRulerArea = function (ra) {
	// 重设比例尺范围
	if (ra) {
		if (!isNaN(ra.latt)) {
			this.rulerArea.latt = ra.latt;
		}
		if (!isNaN(ra.latb)) {
			this.rulerArea.latb = ra.latb;
		}
		if (!isNaN(ra.lonl)) {
			this.rulerArea.lonl = ra.lonl;
		}
		if (!isNaN(ra.lonr)) {
			this.rulerArea.lonr = ra.lonr;
		}
		if (!isNaN(ra.dlon)) {
			this.rulerArea.dlon = ra.dlon;
		}
		if (!isNaN(ra.dlat)) {
			this.rulerArea.dlat = ra.dlat;
		}
	}
};

// 设置图层可见
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setLayerVisble = function (index, visible) {
	for (var i = 0; i<this.tbn.count; i++) {
		this.tbn.imgs[i].layers[index].visible = visible;
	}
};

// 设置图层透明度
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setLayerAlpha = function (index, alpha) {
	if ( !isNaN(alpha) ) {
		if (alpha < 0) {
			alpha = 0;
		} else if (alpha > 1) {
			alpha = 1;
		}
	}

	for (var i = 0; i<this.tbn.count; i++) {
		this.tbn.imgs[i].layers[index].alpha = alpha;
	}
};

// 加载指南针
LZR.HTML5.Bp.AirqMg.RegStat.prototype.loadCompass = function (compassPath) {
	this.maps.add(compassPath, 101, LZR.HTML5.Util.bind ( this, function (i, p) {
		this.compass.resize = LZR.bind (this, function () {
			this.compass.h = this.map.canvas.height * 0.15;
			if (this.compass.h > this.compass.baseH) {
				this.compass.h = this.compass.baseH;
			}
			this.compass.w = this.compass.h * this.compass.scale;
		});
		this.compass.img = p;
		this.compass.visible = true;
		this.compass.baseH = p.height;
		this.compass.scale = p.width / p.height;
		this.compass.resize();
	} ));
};

// 设置指南针是否可见
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setCompassVisble = function (visible) {
	if (this.compass.img) {
		this.compass.visible = visible;
	}
};

// 加载图例
LZR.HTML5.Bp.AirqMg.RegStat.prototype.loadLegend = function (legendPath) {
	// 创建图例对象
	this.legend.resize = LZR.bind (this, function () {
		if (this.legend.scale > 1) {
			this.legend.w = this.map.canvas.width * 0.4;
			if (this.legend.w > this.legend.baseW) {
				this.legend.w = this.legend.baseW;
			}
			this.legend.h = this.legend.w / this.legend.scale;
		} else {
			this.legend.h = this.map.canvas.height * 0.4;
			if (this.legend.h > this.legend.baseH) {
				this.legend.h = this.legend.baseH;
			}
			this.legend.w = this.legend.h * this.legend.scale;
		}
	});
	this.legend.visible = true;
	this.legend.alpha = 1;

	// 加载图片
	this.maps.add(legendPath, 102, LZR.HTML5.Util.bind ( this, function (i, p) {
		this.legend.img = p;
		if (!this.legend.OverImg) {
			this.legend.OverImg = p;	// 鼠标经过时的图片
		}
		this.legend.baseW = p.width;
		this.legend.baseH = p.height;
		this.legend.scale = p.width / p.height;
		this.legend.resize();
	} ));
};

// 设置图例图片
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setLegendImg = function (path) {
	this.maps.add(path, 103, LZR.HTML5.Util.bind ( this, function (i, p) {
		this.legend.img = p;
		this.legend.baseW = p.width;
		this.legend.baseH = p.height;
		this.legend.scale = p.width / p.height;
		this.legend.resize();
	} ));
};

// 设置图例的鼠标经过时的图片
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setLegendOverImg = function (path) {
	this.maps.add(path, 104, LZR.HTML5.Util.bind ( this, function (i, p) {
		this.legend.OverImg = p;
		this.legend.baseW = p.width;
		this.legend.baseH = p.height;
		this.legend.scale = p.width / p.height;
		this.legend.resize();
	} ));
};

// 设置图例是否可见
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setLegendVisble = function (visible) {
	if (this.legend.img) {
		this.legend.visible = visible;
	}
};

// 生成比例尺
LZR.HTML5.Bp.AirqMg.RegStat.prototype.createRuler = function () {
	this.ruler = new LZR.HTML5.Bp.AirqMg.RegStatRule ({
		rs: this,
		latt: this.rulerArea.latt,
		latb: this.rulerArea.latb,
		lonl: this.rulerArea.lonl,
		lonr:this.rulerArea.lonr,
		min: 50,
		max: 70,
		dlon: this.rulerArea.dlon,
		dlat: this.rulerArea.dlat
	});
};

// 生成滚动条
LZR.HTML5.Bp.AirqMg.RegStat.prototype.createScroll = function (p) {
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
LZR.HTML5.Bp.AirqMg.RegStat.prototype.fulshScroll = function () {
	if (this.tbn.position !== this.scroll.position) {
		this.scroll.setPosition (this.tbn.position);
	}
};

// 窗体自适应功能
LZR.HTML5.Bp.AirqMg.RegStat.prototype.resize = function () {
	this.map.resize();
	this.tbn.resize();
	this.eys.resize();
	this.loadEys();
	this.createScroll (this.scroll.position);
	this.legend.resize();
	this.compass.resize();
};

// 地图额外画图
LZR.HTML5.Bp.AirqMg.RegStat.prototype.mapAutoFlush = function (ctx, x, y, w, h) {
	var width, height;
	ctx.globalAlpha = 1;

	// 图框
	if (this.boderColor) {
		ctx.lineWidth="2";
		ctx.fillStyle=this.boderColor;
		ctx.strokeStyle=this.boderColor;
		ctx.strokeRect(x, 0, w, h + y);
		ctx.fillRect(x, 0, w, y);
	}

	// 画指南针
	if (this.compass.visible) {
		width = this.compass.w;
		ctx.drawImage (this.compass.img, x+w - width - 5, y+5, width, this.compass.h);
	}

	// 画图例
	if (this.legend.visible && this.legend.img) {
		width = this.legend.w;
		height = this.legend.h;

		var d = this.map.constant.d;
		var xx = x+w - width - 15;
		var yy = y+h - height - 15;
		var px = this.map.ctrl.currentPage.x - d.left - xx;
		var py = this.map.ctrl.currentPage.y - d.top - yy;

		ctx.globalAlpha = this.legend.alpha;
		if (px>0 && px<width && py>0 && py<height) {
			// 鼠标在图例范围内
			ctx.drawImage (this.legend.OverImg, xx, yy, width, height);
		} else {
			// 鼠标不在图例范围内
			ctx.drawImage (this.legend.img, xx, yy, width, height);
		}
		ctx.globalAlpha = 1;
	}

	// 画比例尺
	var r = this.ruler.update();
// LZR.HTML5.log ("");
// LZR.HTML5.alog (r.d);
// LZR.HTML5.alog (r.w + "\n");
// LZR.HTML5.alog (this.ruler.s.lon.getCoordinateForm().print());
// LZR.HTML5.alog (this.ruler.s.lat.getCoordinateForm().print());
// LZR.HTML5.alog (this.ruler.r.lon.getCoordinateForm().print());
// LZR.HTML5.alog (this.ruler.r.lat.getCoordinateForm().print());

	ctx.lineWidth="2";
	ctx.strokeStyle="black";
	ctx.fillStyle="black";
	ctx.font="10px Verdana";

	width = x + 15;
	height = y + h - 15;
	ctx.beginPath();
	ctx.moveTo(width, height - 10);
	ctx.lineTo(width, height);
	width += r.w;
	ctx.lineTo(width, height);
	ctx.lineTo(width, height - 10);
	ctx.stroke();

	width += 10;
	var i, s = r.d;
	if (s > 1000) {
		s = s/1000 + "公里";
	} else {
		s = s + "米";
	}
	ctx.fillText (s, width, height);

	// 画标尺
	// ctx.lineWidth="1";
	if (this.boderColor) {
		ctx.strokeStyle=this.boderColor;
	}

	s = this.ruler.getLatRod();
	r = h / (s.length-1);
	for (i=0; i<s.length; i++) {
		height = r * i + y;
		ctx.beginPath();
		ctx.moveTo(x - 10, height);
		ctx.lineTo(x, height);
		ctx.stroke();
		// ctx.fillText (s[i].toFixed(1), x - 40, height + 5);
		ctx.fillText (s[i].toFixed(1), x - 40, height + 10);
	}

	s = this.ruler.getLonRod();
	r = w / (s.length-1);
	height = y + h;
	for (i=0; i<s.length; i++) {
		width = r * i + x;
		ctx.beginPath();
		ctx.moveTo(width, height + 10);
		ctx.lineTo(width, height);
		ctx.stroke();
		// ctx.fillText (s[i].toFixed(1), width -17, height + 22);
		ctx.fillText (s[i].toFixed(1), width -35, height + 22);
	}

};

// 返回某个图层加载器是否繁忙
LZR.HTML5.Bp.AirqMg.RegStat.prototype.isBusyInLayersLoader = function (index) {
	if (this.layersLoader[index]) {
		return this.layersLoader[index].isBusy;
	} else {
		return false;
	}
};

// 地图加载完时的接口
LZR.HTML5.Bp.AirqMg.RegStat.prototype.mapFinished = function () {};

// 加载完时的接口
LZR.HTML5.Bp.AirqMg.RegStat.prototype.tbnFinished = function () {};

// 其它图层加载完时的接口
LZR.HTML5.Bp.AirqMg.RegStat.prototype.otherFinished = function (id) {};

