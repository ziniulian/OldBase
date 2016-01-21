// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2/ViewData.js" ]);

// ----------- 区域形势的界面数据 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2.js"
]);
LZR.HTML5.Bp.AirqMg.RegStat2.ViewData = function (obj) {
	var vc = LZR.Util.ValCtrl;

	// 污染物选项
	this.fom = {
		id: "fom",	// 数据之名（数据关键字）
		content: null,	// 数据之值（数据关键字）
		parent: null,	// 数据之父（数据关键字）
		root: this,	// 数据之根（数据关键字）
		view: null,	// 视图元素
		ctrl: null	// 控制元素
	};
	this.fom.children = {	// 数据之子（数据关键字）
		"PM25" : {
			id: "PM25",
			parent: this.fom,
			root: this,
				html: "PM<sub>2.5</sub>",
				unit: "ug/m³",
				hour: "35",
				day: "3A",
				visible: new vc(false),
				alpha: new vc(0.7),
				enable: new vc(true),
				dataProjection: "EPSG:4326",
				mapProjection: "EPSG:4326",
				legendUrl: null,
			view: null,
			ctrl: null
		},
		"PM10" : {
			id: "PM10",
			parent: this.fom,
			root: this,
				html: "PM<sub>10</sub>",
				unit: "ug/m³",
				hour: "32",
				day: "38",
				visible: new vc(false),
				alpha: new vc(0.7),
				enable: new vc(true),
				dataProjection: "EPSG:4326",
				mapProjection: "EPSG:4326",
				legendUrl: null,
			view: null,
			ctrl: null
		},
		"SO2" : {
			id: "SO2",
			parent: this.fom,
			root: this,
				html: "SO<sub>2</sub>",
				unit: "ug/m³",
				hour: "30",
				day: "36",
				visible: new vc(false),
				alpha: new vc(0.7),
				enable: new vc(true),
				dataProjection: "EPSG:4326",
				mapProjection: "EPSG:4326",
				legendUrl: null,
			view: null,
			ctrl: null
		},
		"NO2" : {
			id: "NO2",
			parent: this.fom,
			root: this,
				html: "NO<sub>2</sub>",
				unit: "ug/m³",
				hour: "31",
				day: "37",
				visible: new vc(false),
				alpha: new vc(0.7),
				enable: new vc(true),
				dataProjection: "EPSG:4326",
				mapProjection: "EPSG:4326",
				legendUrl: null,
			view: null,
			ctrl: null
		},
		"CO" : {
			id: "CO",
			parent: this.fom,
			root: this,
				html: "CO",
				unit: "mg/m³",
				hour: "33",
				day: "39",
				visible: new vc(false),
				alpha: new vc(0.7),
				enable: new vc(true),
				dataProjection: "EPSG:4326",
				mapProjection: "EPSG:4326",
				legendUrl: null,
			view: null,
			ctrl: null
		},
		"O3" : {
			id: "O3",
			parent: this.fom,
			root: this,
				html: "O<sub>3</sub>",
				unit: "ug/m³",
				hour: "34",
				day: "",
				visible: new vc(false),
				alpha: new vc(0.7),
				enable: new vc(true),
				dataProjection: "EPSG:4326",
				mapProjection: "EPSG:4326",
				legendUrl: null,
			view: null,
			ctrl: null
		},
		"AQI" : {
			id: "AQI",
			parent: this.fom,
			root: this,
				html: "AQI",
				unit: "",
				hour: "",
				day: "3E",
				visible: new vc(false),
				alpha: new vc(0.7),
				enable: new vc(true),
				dataProjection: "EPSG:4326",
				mapProjection: "EPSG:4326",
				legendUrl: null,
			view: null,
			ctrl: null
		},
		"O38H" : {
			id: "O38H",
			parent: this.fom,
			root: this,
				html: "O<sub>3</sub>滑动8小时",
				unit: "",
				hour: "",
				day: "3D",
				visible: new vc(false),
				alpha: new vc(0.7),
				enable: new vc(true),
				dataProjection: "EPSG:4326",
				mapProjection: "EPSG:4326",
				legendUrl: null,
			view: null,
			ctrl: null
		}
	};

	// 等高线选项
	this.line = {
		id: "line",
		root: this,
		ctrl: null
	};
	this.line.children = {
		"Te" : {
			id: "Te",
			parent: this.line,
			root: this,
				html: "温度",
				unit: "℃",
				hour: "4W",
				day: "50",
				visible: new vc(false),
				alpha: new vc(0.5),
				enable: new vc(true),
				dataProjection: "EPSG:4326",
				mapProjection: "EPSG:4326",
				legendUrl: null,
			view: null,
			ctrl: null
		},
		"Rh" : {
			id: "Rh",
			parent: this.line,
			root: this,
				html: "湿度",
				unit: "%",
				hour: "4X",
				day: "51",
				visible: new vc(false),
				alpha: new vc(0.5),
				enable: new vc(true),
				dataProjection: "EPSG:4326",
				mapProjection: "EPSG:4326",
				legendUrl: null,
			view: null,
			ctrl: null
		},
		"Pr" : {
			id: "Pr",
			parent: this.line,
			root: this,
				html: "压强",
				unit: "hPa",
				hour: "4Y",
				day: "52",
				visible: new vc(false),
				alpha: new vc(0.5),
				enable: new vc(true),
				dataProjection: "EPSG:4326",
				mapProjection: "EPSG:4326",
				legendUrl: null,
			view: null,
			ctrl: null
		}
	};

	// 风场选项
	this.wind = {
		id: "wind",
		root: this,
		ctrl: null
	};
	this.wind.children = {
		"Lagrange" : {
			id: "Lagrange",
			parent: this.wind,
			root: this,
				html: "拉格朗日风场",
				windUrl: "http://192.168.1.222/bpycserver/api/GrdHandle/getWindData",
				column: 40,
				row: 30,
				pad: 20,
				windCanvasStyle: "windCanvasStyle",
				visible: new vc(false),
				alpha: new vc(1),
				enable: new vc(true),
				color: "yellow",
				dataProjection: "EPSG:4326",
				mapProjection: "EPSG:4326",
				legendUrl: null,
			view: null,
			ctrl: null
		},
		"Euler": {
			id: "Euler",
			parent: this.wind,
			root: this,
				html: "欧拉风场",
				visible: new vc(false),
				alpha: new vc(0.8),
				legendUrl: null,
			view: null,
			ctrl: null
		}
	};

	// 模式选项
	this.mod = {
		id: "mod",
		root: this
	};
	this.mod.children = {
		"Ensemble" : {
			id: "Ensemble",
			parent: this.mod,
			root: this,
				html: "集合预报",
				timeLong: {
					"d01": 7,
					"d02": 4,
					"d03": 4
				},
				selected: new vc(false),
			view: null,
			ctrl: null
		},
		"NAQPMS" : {
			id: "NAQPMS",
			parent: this.mod,
			root: this,
				html: "NAQPMS",
				timeLong: {
					"d01": 7,
					"d02": 4,
					"d03": 4
				},
				selected: new vc(true),
			view: null,
			ctrl: null
		},
		"CAMx" : {
			id: "CAMx",
			parent: this.mod,
			root: this,
				html: "CAMX",
				timeLong: {
					"d01": 7,
					"d02": 4,
					"d03": 4
				},
				selected: new vc(false),
			view: null,
			ctrl: null
		},
		"CMAQ" : {
			id: "CMAQ",
			parent: this.mod,
			root: this,
				html: "CMAQ",
				timeLong: {
					"d01": 7,
					"d02": 4,
					"d03": 4
				},
				selected: new vc(false),
			view: null,
			ctrl: null
		},
		"WRFchem" : {
			id: "WRFchem",
			parent: this.mod,
			root: this,
				html: "WRF-CHEM",
				timeLong: {
					"d01": 4,
					"d02": 3,
					"d03": 3
				},
				selected: new vc(false),
			view: null,
			ctrl: null
		}
	};

	// 区域选项
	this.area = {
		id: "area",
		root: this
	};
	this.area.children = {
		"d01" : {
			id: "d01",
			parent: this.area,
			root: this,
				html: "第一区域",
				range: [47.02134865, -16.45396135,164.58891465, 60.37036195],
				num: "d01",
				selected: new vc(true),
				enable: new vc(true),
			view: null,
			ctrl: null
		},
		"d02" : {
			id: "d02",
			parent: this.area,
			root: this,
				html: "第二区域",
				range: [37.02134865, -6.45396135,134.58891465, 50.37036195],
				num: "d02",
				selected: new vc(false),
				enable: new vc(true),
			view: null,
			ctrl: null
		},
		"d03" : {
			id: "d03",
			parent: this.area,
			root: this,
				html: "第三区域",
				range: [27.02134865, 6.45396135,104.58891465, 40.37036195],
				num: "d03",
				selected: new vc(false),
				enable: new vc(true),
			view: null,
			ctrl: null
		}
	};

	// 时长选项
	this.timeStep = {
		id: "timeStep",
		root: this
	};
	this.timeStep.children = {
		"hour" : {
			id: "hour",
			parent: this.timeStep,
			root: this,
				html: "小时值",
				selected: new vc(true),
			view: null,
			ctrl: null
		},
		"day" : {
			id: "day",
			parent: this.timeStep,
			root: this,
				html: "日均值",
				selected: new vc(false),
			view: null,
			ctrl: null
		}
	};

	// 产品时次选项
	this.time = {
		id: "time",
		root: this
	};
	this.time.children = {
		"20" : {
			id: "20",
			parent: this.time,
			root: this,
				html: "20时",
				selected: new vc(true),
			view: null,
			ctrl: null
		},
		"8" : {
			id: "8",
			parent: this.time,
			root: this,
				html: "8时",
				selected: new vc(false),
			view: null,
			ctrl: null
		}
	};

	// 产品时间
	this.date = {
		id: "date",
		root: this,
			content: new vc("2015-07-02"),
		view: null,
		ctrl: null
	};

	// 时间轴
	this.timeAxis = {
		id: "timeAxis",
		root: this,
			style: 1,
			noDrop: 2,
			hoverTime: 800,
			timeLong: new vc(7),	// 时间长度（以天计）
			playing: false,
			playWaitTime: new vc(200),	// 动画播放间停顿时间（以毫秒计）
		view: null,
		ctrl: null
	};

	// 时间悬浮框
	this.timeHover = {
		id: "timeHover",
		root: this,
			hoverClass: "hover",		// 悬浮框外框CSS样式
			imgClass: "hover_img",	// 悬浮框图片CSS样式
			txtClass: "hover_txt",		// 悬浮框文字CSS样式
			vClass: "hover_v",		// 悬浮框箭头CSS样式
			padd: 10,			// 图片间距
			layerId: 0,			// 图层位置
		view: null,
		ctrl: null
	};

// ------------------ 无事件参数 ---------------------

	// 查询条件参数
	this.qry = {
		id: "qry",
		root: this,
			wsUrl: "ws://192.168.1.211:8980",
			urlPre: "http://192.168.1.101/v0020/figure/",
			start: 4,
		ctrl: null
	};
/*
	// 污染物浓度标记
	this.mark = {
		id: "mark",
		root: this,
			markClass: "mark",	// 标记的样式
			titleClass: "mark_title",	// 标记提示的样式
			name: "内蒙古",	// 站点或城市名称
			cityNo: "001",		// 站点或城市ID
			data: [
				{
					time: "2015-7-3 8:00:00",	// 时间
					value: 150,	// 浓度值
					aqi: 80,	// AQI值
					level: 1,	// 污染物级别
					mmtyp: "MAX",	// 最大最小类型
					color: "red"	// 污染级别颜色
				},
				{
					time: "2015-7-3 20:00:00",	// 时间
					value: 150,	// 浓度值
					aqi: 80,	// AQI值
					level: 1,	// 污染物级别
					mmtyp: "MIN",	// 最大最小类型
					color: "yellow"	// 污染级别颜色
				},
				{
					time: "2015-7-4 8:00:00",	// 时间
					value: 150,	// 浓度值
					aqi: 80,	// AQI值
					level: 1,	// 污染物级别
					mmtyp: "MAX",	// 最大最小类型
					color: "blue"	// 污染级别颜色
				},
				{
					time: "2015-7-4 20:00:00",	// 时间
					value: 150,	// 浓度值
					aqi: 80,	// AQI值
					level: 1,	// 污染物级别
					mmtyp: "MIN",	// 最大最小类型
					color: "green"	// 污染级别颜色
				},
				{
					time: "2015-7-5 8:00:00",	// 时间
					value: 150,	// 浓度值
					aqi: 80,	// AQI值
					level: 1,	// 污染物级别
					mmtyp: "MIN",	// 最大最小类型
					color: "green"	// 污染级别颜色
				},
				{
					time: "2015-7-5 20:00:00",	// 时间
					value: 150,	// 浓度值
					aqi: 80,	// AQI值
					level: 1,	// 污染物级别
					mmtyp: "MAX",	// 最大最小类型
					color: "yellow"	// 污染级别颜色
				},
				{
					time: "2015-7-6 8:00:00",	// 时间
					value: 150,	// 浓度值
					aqi: 80,	// AQI值
					level: 1,	// 污染物级别
					mmtyp: "MIN",	// 最大最小类型
					color: "red"	// 污染级别颜色
				},
				{
					time: "2015-7-6 20:00:00",	// 时间
					value: 150,	// 浓度值
					aqi: 80,	// AQI值
					level: 1,	// 污染物级别
					mmtyp: "MAX",	// 最大最小类型
					color: "green"	// 污染级别颜色
				},
				{
					time: "2015-7-7 8:00:00",	// 时间
					value: 150,	// 浓度值
					aqi: 80,	// AQI值
					level: 1,	// 污染物级别
					mmtyp: "MAX",	// 最大最小类型
					color: "green"	// 污染级别颜色
				},
				{
					time: "2015-7-7 20:00:00",	// 时间
					value: 150,	// 浓度值
					aqi: 80,	// AQI值
					level: 1,	// 污染物级别
					mmtyp: "MIN",	// 最大最小类型
					color: "blue"	// 污染级别颜色
				},
				{
					time: "2015-7-8 8:00:00",	// 时间
					value: 150,	// 浓度值
					aqi: 80,	// AQI值
					level: 1,	// 污染物级别
					mmtyp: "MAX",	// 最大最小类型
					color: "green"	// 污染级别颜色
				},
				{
					time: "2015-7-8 20:00:00",	// 时间
					value: 150,	// 浓度值
					aqi: 80,	// AQI值
					level: 1,	// 污染物级别
					mmtyp: "MAX",	// 最大最小类型
					color: "yellow"	// 污染级别颜色
				},
				{
					time: "2015-7-9 8:00:00",	// 时间
					value: 150,	// 浓度值
					aqi: 80,	// AQI值
					level: 1,	// 污染物级别
					mmtyp: "MIN",	// 最大最小类型
					color: "blue"	// 污染级别颜色
				},
				{
					time: "2015-7-9 20:00:00",	// 时间
					value: 150,	// 浓度值
					aqi: 80,	// AQI值
					level: 1,	// 污染物级别
					mmtyp: "MAX",	// 最大最小类型
					color: "green"	// 污染级别颜色
				}
			],
		view: null,
		ctrl: null
	};
*/
	// 当前值
	this.cur = {
		fom: this.fom.children.PM25,
		line: this.line.children.Te,
		wind: this.wind.children.Lagrange,
		mod: this.mod.children.NAQPMS,
		area: this.area.children.d01,
		timeStep: this.timeStep.children.hour,
		time: this.time.children[20],
		date: this.date,
		timeAxis: this.timeAxis,
		tp: new vc(0),
		qry: this.qry,
		mark: this.mark
	};

	// 设置参数
	if (obj) {
		LZR.setObj (this, obj);
	}
};
LZR.HTML5.Bp.AirqMg.RegStat2.ViewData.prototype.className = "LZR.HTML5.Bp.AirqMg.RegStat2.ViewData";
LZR.HTML5.Bp.AirqMg.RegStat2.ViewData.prototype.version = "0.0.2";

// 获取马远接口格式的产品时间
LZR.HTML5.Bp.AirqMg.RegStat2.ViewData.prototype.getTimByInterface = function () {
	return this.date.content.val.replace(/-/g, "") + LZR.HTML5.Util.format (this.cur.time.id, 2, "0");
};

// 获取马远接口的结束时效
LZR.HTML5.Bp.AirqMg.RegStat2.ViewData.prototype.getEndByInterface = function () {
	return this.qry.start + this.timeAxis.timeLong.val * 24;
};

// 获取时间轴需要的开始时间
LZR.HTML5.Bp.AirqMg.RegStat2.ViewData.prototype.getStartTimeByTimeAxis = function () {
	return new Date(this.date.content.val + " 0:0").valueOf() + 24*3600*1000;
};

// 调整时长
LZR.HTML5.Bp.AirqMg.RegStat2.ViewData.prototype.setTimeLongByTimeAxis = function () {
	this.timeAxis.timeLong.set (this.cur.mod.timeLong[this.cur.area.id]);
};

