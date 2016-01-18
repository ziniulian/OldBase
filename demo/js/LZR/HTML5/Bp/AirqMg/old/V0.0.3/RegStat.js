// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat.js" ]);

// ----------- 区域形势 ------------

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
	this.map.max.reset({
		// width: 1112,
		// height: 866

		// 火狐缩放未解决的临时处理办法：将图片割去一个像素的边。
		top: 1,
		left: 1,
		width: 1111,
		height: 865
	});
	this.map.min.reset({
		width: 100,
		height: 100
	});
	this.map.offset = {
		left: 40,
		top: 5,
		right: 20,
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

	// 地图图片
	this.maps = new LZR.HTML5.Canvas.ImgLoader( LZR.HTML5.Util.bind (this, this.onMaps) );

	// 分布图图片
	this.tbns = new LZR.HTML5.Canvas.ImgLoader( LZR.HTML5.Util.bind (this, this.onTbns) );
	this.tbns.finished = LZR.HTML5.Util.bind (this, function() {
		this.playState = 0;
	});

	// 是否可循环控制（0：请求停止；1：启动；2：真正停止）
	this.ctrlEnable = 1;

	// 图片路径（V0.0.1）
	this.path = LZR.HTML5.upPath(7) + "data/RegImg/";

	// 动画播放速度
	this.playSpeed = 1;

	// 动画播放状态
	this.playState = -1;

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

	// 添加窗体变化自适应功能
	LZR.HTML5.Util.Event.addEvent (window, "resize", LZR.bind(this, this.resize), false);
};
LZR.HTML5.Bp.AirqMg.RegStat.prototype.className = "LZR.HTML5.Bp.AirqMg.RegStat";
LZR.HTML5.Bp.AirqMg.RegStat.prototype.version = "0.0.3";

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
		this.tbn.count = 24 * 7;
		this.tbn.ctx.font="18px Verdana";
		this.tbn.wheelScale = 10;
		this.tbn.wheelStyle = 2;
		this.tbn.draw = function (tb, i, x, y, w, h) {
			tb.ctx.fillText( tb.imgs[i].tim, x+5 , y + h + 20);
		};
	} else {
		this.tbn.index = 0;
		this.tbn.count = 7;
		this.tbn.ctx.font="18px Verdana";
		this.tbn.wheelScale = 1;
		this.tbn.wheelStyle = 2;
		this.tbn.draw = function (tb, i, x, y, w, h) {
			tb.ctx.fillText( tb.imgs[i].tim, x+25 , y + h + 20);
		};
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
	// if (index !== this.condition.area) {
	// 	alert("onMaps：" + index + " --- " + this.condition.area + " 地图的异步 ...");
	// }
	// if (index === this.condition.area) {
		var m = new LZR.HTML5.Canvas.Layer({name:"地图", obj:img});

		// 防止图层重复加载而清空元素
		this.map.layers = [];
		this.tbn.imgs = [];

		// 填充地图数据
		this.map.addLayer ( new LZR.HTML5.Canvas.Layer({name:"分布图", obj:img}) );
		this.map.addLayer ( m );

		// 填充缩略图数据
		this.fillTbn (m, img);
		this.changeTitle ();

		// 启动控制
		this.ctrlStart();

		// 加载其它分布图
		this.loadTbns();
	// } else {
	// 	alert("onMaps：" + index + " --- " + this.condition.area + " 地图的异步 ...");
	// }
};

// 填充缩略图数据
LZR.HTML5.Bp.AirqMg.RegStat.prototype.fillTbn = function (m, img) {
	// 产品初始日期
// LZR.HTML5.log(new Date (this.condition.date));
	var path = this.path + "crop4xw/";
	var url = "";

	// 污染物
	path += this.condition.fom;	// PM25HourlySpa_d03_NAQPMS_2015061720_171

	// 区域
	url += "_d0";
	url += this.condition.area;

	// 模式
	url += "_";
	url += this.condition.mod;
	url += "_";

	// 产品日期
	t = this.condition._date;
	url += t.getFullYear();
	url += LZR.HTML5.Util.format (t.getMonth()+1, 2, "0");
	url += LZR.HTML5.Util.format (t.getDate(), 2, "0");
	url += this.condition._tim;

	for (var i=0; i<this.tbn.count; i++) {
		var r = this.createImg (i, this.condition.date, path, url);
		r.layers.push( new LZR.HTML5.Canvas.Layer({name:"分布图", obj:img}) );
		r.layers.push( m );
		this.tbn.imgs.push( r );
	}
};

// 生成图片信息
LZR.HTML5.Bp.AirqMg.RegStat.prototype.createImg = function (index, d, path, url) {
	var r = new LZR.HTML5.Bp.AirqMg.RegImg();
	if (this.condition.ttyp == 1) {
		r.url = path + "HourlySpa" + url + "_";
		r.url += LZR.HTML5.Util.format (index + 4, 3, "0");
		r.url += ".png";

		d += (index+this.condition.tim) * 60 * 60 *1000;
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
		// r.url = path + "DaySpa" + url + ".png";
		r.url = path + "HourlySpa" + url + "_";
		r.url += LZR.HTML5.Util.format (index * 24 + 4, 3, "0");
		r.url += ".png";

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

// 加载分布图
LZR.HTML5.Bp.AirqMg.RegStat.prototype.loadTbns = function () {
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
LZR.HTML5.Bp.AirqMg.RegStat.prototype.onTbns = function (index, img) {
	this.tbn.imgs[index].layers[0].obj = img;
	if (index === this.tbn.index) {
		this.tbn.aline (index, true);
		this.tbn.onchange (index);
	}
};

// 清空图片数据
LZR.HTML5.Bp.AirqMg.RegStat.prototype.clear = function () {
	this.ctrlStop();
	this.map.layers = [];
	this.tbn.imgs = [];
	this.ruler = null;
	this.playState = -1;
	this.playSpeed = 1;
};

// 标题变更
LZR.HTML5.Bp.AirqMg.RegStat.prototype.changeTitle = function () {
	this.title.innerHTML =	this.tbn.imgs[this.tbn.index].tim + " " +
				this.condition.mod + "模式" +
				this.condition.fomName +
				this.condition.areaName +
				// this.condition.ttypName +
				"区域形势 <sub>（产品时间：" +
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

// 设置产品日期
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setDate = function (value, redo) {
	this.condition.dateName = value;
	this.condition._date = LZR.Util.Date.getDate( value );
	this.condition.date = this.condition._date.valueOf() + 24 * 60 * 60 * 1000;
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
		this.clear();
		this.init();
	}
};

// 设置模式
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setMod = function (value, redo) {
	this.condition.mod = value;
	if (redo) {
		this.clear();
		this.init();
	}
};

// 设置污染物
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setFom = function (name, value, redo) {
	this.condition.fomName = name;
	this.condition.fom = value;
	if (redo) {
		this.clear();
		this.init();
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

// 设置区域
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setArea = function (name, value, redo) {
	this.condition.areaName = name;
	this.condition.area = value;
	if (redo) {
		this.clear();
		this.init();
	}
};

// 设置图层可见
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setLayerVisble = function (index, visible) {
	var l = this.map.layers[index];
	if (l) {
		l.visible = visible;
	}
};

// 设置图层透明度
LZR.HTML5.Bp.AirqMg.RegStat.prototype.setLayerAlpha = function (index, alpha) {
	var l = this.map.layers[index];
	if (l) {
		if ( !isNaN(alpha) ) {
			if (alpha < 0) {
				alpha = 0;
			} else if (alpha > 1) {
				alpha = 1;
			}
			l.alpha = alpha;
		}
	}
};

// 加载指南针
LZR.HTML5.Bp.AirqMg.RegStat.prototype.loadCompass = function (compassPath) {
	this.maps.add(compassPath, 0, LZR.HTML5.Util.bind ( this, function (i, p) {
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
	this.maps.add(legendPath, 0, LZR.HTML5.Util.bind ( this, function (i, p) {
		this.legend.resize = LZR.bind (this, function () {
			this.legend.h = this.map.canvas.height * 0.4;
			if (this.legend.h > this.legend.baseH) {
				this.legend.h = this.legend.baseH;
			}
			this.legend.w = this.legend.h * this.legend.scale;
		});
		this.legend.img = p;
		this.legend.visible = true;
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
	switch (this.condition.area) {
		case 1:
		case 2:
		case 3:
			this.ruler = new LZR.HTML5.Bp.AirqMg.RegStatRule ({
				rs: this,
				latt: 55,
				latb: 8,
				lonl: 69,
				lonr:140,
				min: 50,
				max: 70,
				dlon: 9,
				dlat: 8
			});
			break;
	}
};

// 生成滚动条
LZR.HTML5.Bp.AirqMg.RegStat.prototype.createScroll = function (p) {
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
	if (this.legend.visible) {
		width = this.legend.w;
		height = this.legend.h;
		ctx.drawImage (this.legend.img, x+w - width - 15, y+h - height - 15, width, height);
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
		ctx.fillText (s[i].toFixed(1), x - 40, height + 5);
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
		ctx.fillText (s[i].toFixed(1), width -17, height + 22);
	}

};


