// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat.js" ]);

// ----------- 区域形势 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/Canvas/LayerManager.js",
	LZR.HTML5.jsPath + "HTML5/Canvas/Thumbnail.js",
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegImg.js",
	LZR.HTML5.jsPath + "HTML5/Canvas/ImgLoader.js",
	LZR.HTML5.jsPath + "HTML5/util/Event.js",
	LZR.HTML5.jsPath + "util/Date.js"
]);
LZR.HTML5.Bp.AirqMg.RegStat = function (obj) {
	/*
		参数说明：
			{
				// 查询条件（V0.0.2版后作废，改用对应的控制元素数据来初始化查询条件）
				condition: {
					_date,		// 产品查询日期
					date,		// 产品初始日期
					_tim,		// 产品查询时次
					tim,		// 产品初始时次
					ttyp,		// 日均/小时值	（小时:1, 日均:0）
					ttypName,	// 日均/小时 名
					area,		// 区域		（全国:1, 华东:2, 京津冀:3）
					areaName,	// 区域名
					mod,		// 模式
					fom,		// 污染物
				},

				// 查询条件控制元素
				conditionView: {
					date,	// 产品日期
					tim,	// 产品时次
					mod,	// 模式
					fom,	// 污染物
					ttyp,	// 日均/小时	（小时:1, 日均:0）
					area,	// 区域		（全国:1, 华东:2, 京津冀:3）
				},

				// 图层控制元素
				layers: {
					visible:[],	// 是否可见
					alpha:[],	// 透明度
				},

				// 动画控制元素
				animation: {
					_frame,	// 帧数控件
					frame,		// 帧数
					btn,		// 按钮
					state,		// 播放状态	（正在播放:1, 暂停播放:0）
					speed,		// 播放速率
				},

				title,	// 标题
				map,	// 地图DIV
				tbn,	// 缩略图DIV
				eys	// 鹰眼DIV
			}
	*/
	this.layers = obj.layers;
	this.animation = obj.animation;
	this.conditionView = obj.conditionView;
	this.title = obj.title;

	// 查询条件
	this.changeCont();
	// this.condition = obj.condition;

	// 初始化控制事件
	this.initEvent();

	// 地图
	this.map = new LZR.HTML5.Canvas.LayerManager (obj.map);
	this.map.maxRight = 1112;
	this.map.maxBottom = 866;
	this.map.minWidth = 250;
	this.map.minHeight = 250;

	// 缩略图
	this.tbn = new LZR.HTML5.Canvas.Thumbnail(obj.tbn);
	this.tbn.direction = 2;
	this.tbn.width = 167;
	this.tbn.height = 130;
	this.tbn.paddingU = 40;
	this.tbn.offsetU = 2;
	this.tbn.offsetV = 5;
	this.tbn.ctx.fillStyle="black";
	this.tbn.onchange = LZR.HTML5.Util.bind (this, function (i) {
		this.map.layers[0].obj = this.tbn.imgs[i].getLayers()[0].obj;
		this.changeTitle ();
	});

	// 地图图片
	this.maps = new LZR.HTML5.Canvas.ImgLoader( LZR.HTML5.Util.bind (this, this.onMaps) );

	// 分布图图片
	this.tbns = new LZR.HTML5.Canvas.ImgLoader( LZR.HTML5.Util.bind (this, this.onTbns) );

	// 是否可循环控制
	this.ctrlEanble = true;

	// 图片路径（V0.0.1）
	this.path = LZR.HTML5.upPath(7) + "data/RegImg/";

	// 动画播放速度
	this.playSpeed = 1;
};
LZR.HTML5.Bp.AirqMg.RegStat.prototype.className = "LZR.HTML5.Bp.AirqMg.RegStat";
LZR.HTML5.Bp.AirqMg.RegStat.prototype.version = "0.0.2";

// 初始化控制事件
LZR.HTML5.Bp.AirqMg.RegStat.prototype.initEvent = function () {
	// 产品日期
	LZR.HTML5.Util.Event.addEvent ( this.conditionView.date, "change", LZR.HTML5.Util.bind (this, this.changeContEvent), false);

	// 产品时次
	LZR.HTML5.Util.Event.addEvent ( this.conditionView.tim, "change", LZR.HTML5.Util.bind (this, this.changeContEvent), false);

	// 产品模式
	LZR.HTML5.Util.Event.addEvent ( this.conditionView.mod, "change", LZR.HTML5.Util.bind (this, this.changeContEvent), false);

	// 产品污染物
	LZR.HTML5.Util.Event.addEvent ( this.conditionView.fom, "change", LZR.HTML5.Util.bind (this, this.changeContEvent), false);

	// 日均/小时
	var i = 0;
	for (i=0; i<this.conditionView.ttyp.length; i++) {
		LZR.HTML5.Util.Event.addEvent ( this.conditionView.ttyp[i], "click", LZR.HTML5.Util.bind (this, this.changeContEvent), false);
	}

	// 区域
	for (i=0; i<this.conditionView.area.length; i++) {
		LZR.HTML5.Util.Event.addEvent ( this.conditionView.area[i], "click", LZR.HTML5.Util.bind (this, this.changeContEvent), false);
	}

	// 图层是否可见
	for (i=0; i<this.layers.visible.length; i++) {
		LZR.HTML5.Util.Event.addEvent ( this.layers.visible[i], "click", LZR.HTML5.Util.bind (this, this.changeLayer), false);
	}
/*
	// 图层透明度
	for (i=0; i<this.layers.alpha.length; i++) {
		LZR.HTML5.Util.Event.addEvent ( this.layers.alpha[i], "click", LZR.HTML5.Util.bind (this, this.changeLayer), false);
	}
*/
	// 动画
	LZR.HTML5.Util.Event.addEvent ( this.animation.btn, "click", LZR.HTML5.Util.bind (this, this.changeAnimation), false);
};

// 初始化
LZR.HTML5.Bp.AirqMg.RegStat.prototype.init = function () {
	// 修正画布宽高
	if (this.map.canvas.clientWidth !== this.map.canvas.width) {
		this.map.canvas.width = this.map.canvas.clientWidth;
		this.map.canvas.height = this.map.canvas.clientHeight;
	}
	if (this.tbn.canvas.clientWidth !== this.tbn.canvas.width) {
		this.tbn.canvas.width = this.tbn.canvas.clientWidth;
		this.tbn.canvas.height = this.tbn.canvas.clientHeight;
	}

	this.initTbn();
	this.map.init();
	this.tbn.init();
	this.loadMaps();
};

// 缩略图初始化
LZR.HTML5.Bp.AirqMg.RegStat.prototype.initTbn = function () {
	if (this.condition.ttyp == 1) {
		this.tbn.index = new Date().getHours();
		this.tbn.count = 24 * 7;
		this.tbn.ctx.font="14px Verdana";
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
	this.ctrlEanble = true;
	this.map.ctrlEnable();
	this.tbn.ctrlEnable();
	this.ctrl(this.playSpeed);
};

// 关闭循环控制
LZR.HTML5.Bp.AirqMg.RegStat.prototype.ctrlStop = function () {
	this.ctrlEanble = false;
	this.map.ctrlDisable();
	this.tbn.ctrlDisable();
};

// 循环控制
LZR.HTML5.Bp.AirqMg.RegStat.prototype.ctrl = function (v) {
	if (this.ctrlEanble) {
		this.map.ctrlUpdate();
		this.tbn.ctrlUpdate();
		this.map.flush();
		this.tbn.flush();
		v = this.play(v);
		requestAnimationFrame( LZR.HTML5.Util.bind ( this, this.ctrl, v ) );
	}
};

// 加载地图底图
LZR.HTML5.Bp.AirqMg.RegStat.prototype.loadMaps = function () {
	var url = this.path;
	url += "D" + this.condition.area + ".png";
	this.maps.add(url, this.condition.area);
};

// 地图底图加载后回调内容
LZR.HTML5.Bp.AirqMg.RegStat.prototype.onMaps = function (index, img) {
	var m = new LZR.HTML5.Canvas.Layer({name:"地图", obj:img});
	m.alpha = 0.6;

	// 填充地图数据
	this.map.addLayer ( new LZR.HTML5.Canvas.Layer({name:"分布图", obj:img}) );
	this.map.addLayer ( m );
	this.changeLayer();

	// 填充缩略图数据
	this.fillTbn (m, img);
	this.changeTitle ();

	// 启动控制
	this.ctrlStart();

	// 加载其它分布图
	this.loadTbns();
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
		r.tim += ":00:00";
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
};

// 全查询条件变更
LZR.HTML5.Bp.AirqMg.RegStat.prototype.changeCont = function () {
	this.condition = {};

	// 读取产品日期
	this.condition._date = LZR.Util.Date.getDate( this.conditionView.date.value );
	this.condition.date = this.condition._date.valueOf() + 24 * 60 * 60 * 1000;

	// 读取产品时次
	this.condition._tim = this.conditionView.tim.value - 0;
	this.condition.tim = 0;

	// 读取模式
	this.condition.mod = this.conditionView.mod.value;

	// 读取污染物
	this.condition.fom = this.conditionView.fom.value;

	// 读取日均/小时
	var i = 0;
	this.condition.ttyp = 1;
	for (i=0; i<this.conditionView.ttyp.length; i++) {
		if (this.conditionView.ttyp[i].checked) {
			this.condition.ttyp = this.conditionView.ttyp[i].value - 0;
			this.condition.ttypName = this.conditionView.ttyp[i].getAttribute("myValue");
			break;
		}
	}

	// 读取区域
	this.condition.area = 1;
	for (i=0; i<this.conditionView.area.length; i++) {
		if (this.conditionView.area[i].checked) {
			this.condition.area = this.conditionView.area[i].value - 0;
			this.condition.areaName = this.conditionView.area[i].getAttribute("myValue");
			break;
		}
	}
};

// 条件变更事件
LZR.HTML5.Bp.AirqMg.RegStat.prototype.changeContEvent = function () {
		this.changeCont();
		this.clear();
		this.init();
};

// 图层变更
LZR.HTML5.Bp.AirqMg.RegStat.prototype.changeLayer = function () {
	// 读取图层可见度
	for (i=0; i<this.map.layers.length; i++) {
		var vid;
		this.map.layers[i].visible = this.layers.visible[i].checked;
		// this.map.layers[i].alpha = this.layers.alpha[i].value;
	}
};

// 标题变更
LZR.HTML5.Bp.AirqMg.RegStat.prototype.changeTitle = function () {
	this.title.innerHTML =	this.tbn.imgs[this.tbn.index].tim + " " +
				this.condition.mod + "模式" +
				this.conditionView.fom.options[this.conditionView.fom.selectedIndex].text +
				this.condition.areaName +
				// this.condition.ttypName +
				"区域形势 <font  size=5>（产品时间：" +
				this.conditionView.date.value + " " +
				this.conditionView.tim.options[this.conditionView.tim.selectedIndex].text +
				"）</font >";
};

// 动画控制
LZR.HTML5.Bp.AirqMg.RegStat.prototype.changeAnimation = function () {
	if (this.animation.state == 1) {
		// 停止动画
		this.animation.state = 0;
		this.animation.btn.innerText = "播放动画";
		this.tbn.ctrlEnable();
	} else {
		// 读取帧数
		this.animation.frame = 1;
		for (i=0; i<this.animation._frame.length; i++) {
			if (this.animation._frame[i].checked) {
				this.animation.frame = this.animation._frame[i].value - 0;
				break;
			}
		}

		// 播放动画
		this.tbn.ctrlDisable();
		this.animation.state = 1;
		this.animation.btn.innerText = "停止播放";
	}
};

// 播放动画
LZR.HTML5.Bp.AirqMg.RegStat.prototype.play = function (v) {
	if (this.animation.state == 1) {
		if (v>0) {
			v--;
		} else {
			v = this.playSpeed;
			var t = this.animation.frame;
			t += this.tbn.index;
			if (t>=this.tbn.count) {
				t = 0;
			}
			this.tbn.select (t);
		}
	}
	return v;
};


