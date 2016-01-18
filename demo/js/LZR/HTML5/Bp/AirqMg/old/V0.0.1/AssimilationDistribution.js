// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/AssimilationDistribution.js" ]);

// ----------- 同化分布 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat.js"
]);
LZR.HTML5.Bp.AirqMg.AssimilationDistribution = function (obj) {
	/*
		参数说明：
			{
				// 查询条件
				condition: {
					date,		// 产品初始日期
					tim,		// 产品初始时次
					ttyp,		// 日均/小时值	（小时:1, 日均:0）
					count,		// 时长
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
	LZR.HTML5.Bp.AirqMg.RegStat.call(this, obj);

	this.map.max.reset({
		// width: 1112,
		// height: 866

		// 火狐缩放未解决的临时处理办法：将图片割去一个像素的边。
		top: 83,
		left: 66,
		width: 555,
		height: 428
	});
	this.map.s.top = 83;
	this.map.s.left = 66;
	this.eys.lmEdge.reset ({
		top: this.map.max.top,
		left: this.map.max.left,
		width: this.map.max.w,
		height: this.map.max.h
	});

	// 图片路径
	this.path = "";
};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype = LZR.createPrototype (LZR.HTML5.Bp.AirqMg.RegStat.prototype);
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype._super = LZR.HTML5.Bp.AirqMg.RegStat.prototype;
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.className = "LZR.HTML5.Bp.AirqMg.AssimilationDistribution";
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.version = "0.0.1";

// 设置产品日期
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setDate = function (value, redo) {};

// 设置产品时间
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setTim = function (date, time, redo) {
	this.condition.dateName = date;
	this.condition.tim = time;
	this.condition.date = LZR.Util.Date.getDate( date ).valueOf() + time * 60 * 60 * 1000;
	if (redo) {
		this.clear();
		this.init();
	}
};

// 设置小时/日均类型
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setTtyp = function (value, redo) {
	this.condition.ttyp = value;
	if (redo) {
		this.clear();
		this.init();
	}
};

// 设置时长
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setCount = function (value, redo) {
	this.condition.count = value;
	if (redo) {
		this.clear();
		this.init();
	}
};

// 缩略图初始化
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.initTbn = function () {
	if (this.condition.ttyp == 1) {
		this.tbn.index = this.condition.count - 1;	// 同化分布异同点
		this.tbn.count = this.condition.count;		// 同化分布异同点
		this.tbn.ctx.font=this.tbnFont[1].font;
		this.tbn.wheelScale = 10;
		this.tbn.wheelStyle = 2;
		this.tbn.draw = LZR.bind (this, function (tb, i, x, y, w, h) {
			tb.ctx.fillText( tb.imgs[i].tim, (x+this.tbnFont[1].left) , (y + h + this.tbnFont[1].bottom));
		});
	} else {
		this.tbn.index = this.condition.count - 1;	// 同化分布异同点
		this.tbn.count = this.condition.count;		// 同化分布异同点
		this.tbn.ctx.font=this.tbnFont[0].font;
		this.tbn.wheelScale = 1;
		this.tbn.wheelStyle = 2;
		this.tbn.draw = LZR.bind (this, function (tb, i, x, y, w, h) {
			tb.ctx.fillText( tb.imgs[i].tim, x+this.tbnFont[0].left , y + h + this.tbnFont[0].bottom);
		});
	}
};

// 地图底图加载后回调内容
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.onMaps = function (index, img) {
	var m = new LZR.HTML5.Canvas.Layer({name:"地图", obj:img});

	// 防止图层重复加载而清空元素
	this.map.layers = [];
	this.tbn.imgs = [];

	// 填充地图数据
	this.map.addLayer ( new LZR.HTML5.Canvas.Layer({name:"分布图", obj:img}) );
	// this.map.addLayer ( m );	// 同化分布异同点

	// 填充缩略图数据
	this.fillTbn (m, img);
	this.changeTitle ();

	// 启动控制
	this.ctrlStart();

	// 加载其它分布图
	this.loadTbns();
};

// 填充缩略图数据
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.fillTbn = function (m, img) {
	for (var i=this.tbn.count; i>0; i--) {
		var r = this.createImg (i-1, this.condition.date);
		r.layers.push( new LZR.HTML5.Canvas.Layer({name:"分布图", obj:img}) );
		// r.layers.push( m );	// 同化分布异同点
		this.tbn.imgs.push( r );
	}
};

// 生成图片信息
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.createImg = function (i, d) {
	var r = new LZR.HTML5.Bp.AirqMg.RegImg();
	var t, s;
	if (this.condition.ttyp === 1) {
		t = new Date(d - i*60*60*1000);
		r.tim = "";

		// 年
		s = t.getFullYear();
		r.tim += s;
		r.tim += "-";

		// 月
		s = LZR.HTML5.Util.format (t.getMonth()+1, 2, "0");
		r.tim += s;
		r.tim += "-";

		// 日
		s = LZR.HTML5.Util.format (t.getDate(), 2, "0");
		r.tim += s;
		r.tim += " ";

		// 时
		s = LZR.HTML5.Util.format (t.getHours(), 2, "0");
		r.tim += s;
		r.tim += "时";
	} else {
		t = new Date(d - i*24*60*60*1000);
		r.tim = "";

		// 年
		s = t.getFullYear();
		r.tim += s;
		r.tim += "-";

		// 月
		s = LZR.HTML5.Util.format (t.getMonth()+1, 2, "0");
		r.tim += s;
		r.tim += "-";

		// 日
		s = LZR.HTML5.Util.format (t.getDate(), 2, "0");
		r.tim += s;
	}
	return r;
};

// 加载分布图
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.loadTbns = function () {
	this.tbns.closeWebSocket();

	var typ = this.condition.fom[this.condition.ttyp];
	var d = {
		type: "picContent",
		picType: [typ],
		sort: 0
	};

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

	d[typ] = {
		"modelType": ["NAQPMS"],
		"domain": ["d"+ LZR.HTML5.Util.format (this.condition.area, 2, "0")],
		"timesRange": [ts, te]
	};

// console.log(JSON.stringify (d));
	this.tbns.addByWebSocket (this.webSocketUrl, d);
};
/*
// 分布图加载回调内容
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.onTbns = function (index, img) {
	// 倒序加载
	index = this.condition.count - index - 1;

	this.tbn.imgs[index].layers[0].obj = img;
	if (index === this.tbn.index) {
		this.tbn.aline (index, true);
		this.tbn.onchange (index);
	}
};

// 清空图片数据
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.clear = function () {
	this.ctrlStop();
	this.map.layers = [];
	this.tbn.imgs = [];
	this.ruler = null;
	this.playState = -1;
	this.playSpeed = 1;
};
*/
// 标题变更
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.changeTitle = function () {
	this.title.innerHTML =	this.tbn.imgs[this.tbn.index].tim + " " +
				this.condition.fomName +
				this.condition.areaName +
				"区域同化分布图";
};

