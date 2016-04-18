// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2/Query.js" ]);

// ----------- 查询条件 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/Date.js",
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2.js",
	LZR.HTML5.jsPath + "HTML5/Bp/Util/CatchImgByWebsocket/Forecast.js"
]);
LZR.HTML5.Bp.AirqMg.RegStat2.Query = function (obj) {
	var vc = LZR.Util.ValCtrl;

	// 用于查询的图层顺序号
	this.index = -1;

	// 预报图查询条件
	this.foc = new LZR.HTML5.Bp.Util.CatchImgByWebsocket.Forecast();

	// 当前数据（用于时间格式转换）
	this.data = null;

	// 图层集合
	this.layers = [];

	// 替补图片
	this.backImg = "back.png";

	// 替补JSON
	this.backJson = "back.json";

	// 事件回调总设置
	this.callback();

	// 设置参数
	if (obj) {
		LZR.setObj (this, obj);
	}
};
LZR.HTML5.Bp.AirqMg.RegStat2.Query.prototype.className = "LZR.HTML5.Bp.AirqMg.RegStat2.Query";
LZR.HTML5.Bp.AirqMg.RegStat2.Query.prototype.version = "0.0.2";

// 设置查询条件
LZR.HTML5.Bp.AirqMg.RegStat2.Query.prototype.setQry = function (obj) {
	if (obj) {
		LZR.setObj (this.foc, obj);
	}
};

// 开启查询
LZR.HTML5.Bp.AirqMg.RegStat2.Query.prototype.open = function () {
	this.index = 0;
	this.qry();
};

// 关闭查询
LZR.HTML5.Bp.AirqMg.RegStat2.Query.prototype.close = function () {
	this.foc.close();
	this.index = -1;
};

// 查询
LZR.HTML5.Bp.AirqMg.RegStat2.Query.prototype.qry = function () {
	var y = this.layers[this.index];
	if (y) {
		switch (y.className) {
			// OpenLayers图片图层
			case "LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer":
			// OpenLayers GeoJson图层
			case "LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer":
				this.foc.num = y.num.val;
				this.foc.open();
				break;
			// 基于OpenLayers的风场图层
			case "LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer":
				// 获取风场图层各时间所需的URL参数
				this.handleClose (this.creWindSQL(y));
				break;
		}
	} else {
		this.index = -1;
	}
};

// 转换查询结果的时间格式
LZR.HTML5.Bp.AirqMg.RegStat2.Query.prototype.handleTime = function (tim) {
	if (this.data.cur.timeStep) {
		switch (this.data.cur.timeStep.id) {
			case "hour":
				return this.handleTimeToHour(tim);
			case "day":
				return this.handleTimeToDay(tim);
		}
	}
	return tim;
};

// 转换为小时格式
LZR.HTML5.Bp.AirqMg.RegStat2.Query.prototype.handleTimeToHour = function (tim) {
	var t = "";
	for (var i=0; i<tim.length; i++) {
		t += tim[i];
		switch (i) {
			case 3:
			case 5:
				t += "-";
				break;
			case 7:
				t += " ";
				break;
		}
	}
	t += "时";
	return t;
};

// 转换为风场产品时间格式
LZR.HTML5.Bp.AirqMg.RegStat2.Query.prototype.handleTimeToWindHour = function (tim) {
	var t = this.handleTimeToDay (tim);
	t = LZR.Util.Date.getDate( t );
	t.setTime(t.valueOf() + 24 * 3600 * 1000);
	var s = t.getFullYear();
	s += "-";
	s += LZR.HTML5.Util.format (t.getMonth()+1, 2, "0");
	s += "-";
	s += LZR.HTML5.Util.format (t.getDate(), 2, "0");
	s += " ";
	s += LZR.HTML5.Util.format (t.getHours(), 2, "0");
	return s;
};

// 转换为日均格式
LZR.HTML5.Bp.AirqMg.RegStat2.Query.prototype.handleTimeToDay = function (tim) {
	var t = "";
	for (var i=0; i<8; i++) {
		t += tim[i];
		switch (i) {
			case 3:
			case 5:
				t += "-";
				break;
		}
	}
	return t;
};

// 生成风场查询条件
LZR.HTML5.Bp.AirqMg.RegStat2.Query.prototype.creWindSQL = function () {
	var s = [];
	var url = "?model=naqpms&isAverage=true&prediction=1&z=1";

	// 区域
	url += "&zone=";
	var a = this.foc.area.replace(/^d0/, "");
	url += a;

	// 产品时间
	url += "&pTime=";
	var pt = this.handleTimeToWindHour(this.foc.tim);
	// var pt = "2015-01-07 00";
	url += pt;

	pt = LZR.Util.Date.getDate( pt ).valueOf();
	var step = 1;
	if (this.data.cur.timeStep) {
		switch (this.data.cur.timeStep.id) {
			case "hour":
				step = 1;
				break;
			case "day":
				step = 24;
				break;
		}
	}
	// for (var i = this.foc.start; i<this.foc.end; i+=step) {
	for (var i = 0; i<(this.foc.end - this.foc.start); i+=step) {
		var t = new Date(pt+i*3600*1000);
		var ts = url + "&cTime=";
		ts += t.getFullYear();
		ts += "-";
		ts += LZR.HTML5.Util.format (t.getMonth()+1, 2, "0");
		ts += "-";
		ts += LZR.HTML5.Util.format (t.getDate(), 2, "0");
		ts += " ";
		ts += LZR.HTML5.Util.format (t.getHours(), 2, "0");
		s.push(ts);
	}

	return s;
};

// -------------------- 事件回调 ------------------

// 事件回调总设置
LZR.HTML5.Bp.AirqMg.RegStat2.Query.prototype.callback = function () {
	// 预报图查询条件
	this.foc.setEventObj (this);
	this.foc.event.close.append (this.handleClose);
};

// 查询结束时的回调函数
LZR.HTML5.Bp.AirqMg.RegStat2.Query.prototype.handleClose = function (rs) {
	var y = this.layers[this.index];
	this.index ++;
	this.qry();

	var r;
	switch (y.className) {
		// OpenLayers图片图层
		case "LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer":
			r = this.createBack (this.backImg, rs);
			break;
		// OpenLayers GeoJson图层
		case "LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer":
			r = this.createBack (this.backJson, rs);
			break;
		default:
			r = rs;
			break;
	}

	y.info.set(r);
};

// 生成替补数据
LZR.HTML5.Bp.AirqMg.RegStat2.Query.prototype.createBack = function (ret, rs) {
	var d = {};
	var i, step, n = this.foc.end - this.foc.start;
	var pt = this.data.getStartTimeByTimeAxis();
	if (this.data.cur.timeStep) {
		switch (this.data.cur.timeStep.id) {
			case "hour":
				step = 1;
				break;
			case "day":
				step = 24;
				break;
		}
	}
	for (i=0; i<n; i+=step) {
		var t = new Date( pt + i*3600*1000);
		var r = new LZR.HTML5.Bp.Util.CatchImgByWebsocket.Result({
			ret: ret
		});
		var s = t.getFullYear();
		var id = s;
		r.tim = s;
		r.tim += "-";

		s = LZR.HTML5.Util.format (t.getMonth()+1, 2, "0");
		id += s;
		r.tim += s;
		r.tim += "-";

		s = LZR.HTML5.Util.format (t.getDate(), 2, "0");
		id += s;
		r.tim += s;

		if (this.data.cur.timeStep.id == "hour") {
			r.tim += " ";
			s = LZR.HTML5.Util.format (t.getHours(), 2, "0");
			id += s;
			r.tim += s;
			r.tim += "时";
		}

		d[id] = r;
	}
	for (i = 0; i<rs.length; i++) {
		if (d[rs[i].tim]) {
			d[rs[i].tim].ret = rs[i].ret;
		}
	}
	var a = [];
	for (i in d) {
		a.push(d[i]);
	}
	return a;
};

