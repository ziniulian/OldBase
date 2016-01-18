// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/TimeAxisBurst.js" ]);

// ------------------- 时间轴分段 ---------------------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/Selector.js",
	LZR.HTML5.jsPath + "HTML5/util/BaseTimeAxis.js"
]);
LZR.HTML5.Util.TimeAxisBurst = function (obj) {
	/*
		参数说明：
		{
			bta: ,	// 时间轴（必填）
			count: ,	// 分段数
			data: ,		// 时间轴刻度数据

			defaultClass: ,	// 选择默认样式
			overClass: ,	// 鼠标经过样式
			downClass: ,	// 鼠标按下样式
			outClass: ,	// 外框样式
			offsetW: ,	// 宽度补偿量
			noBorder: ,	// 是否取消收尾边线
		}
	*/

	// 时间轴
	this.bta = obj.bta;

	// 分段数
	if (obj.count) {
		this.count = obj.count;
	} else {
		this.count = 0;
	}

	// 分段间距
	this.step = 0;

	// 数据
	this.data = this.createData(obj.data);

	// 选择器
	this.selector = new LZR.HTML5.Util.Selector ({
		data: this.data,
		type: 5,
		checked: 1,
		defaultClass: obj.defaultClass,
		overClass: obj.overClass,
		downClass: obj.downClass,
		rowNum: 0
	});

	// 宽度补偿量
	if (obj.offsetW) {
		this.offsetW = obj.offsetW;
	} else {
		this.offsetW = 0;
	}

	// 取消首尾边框
	if (obj.noBorder) {
		this.selector.children[0].div.style.borderLeftWidth = 0;
		this.selector.children[this.count - 1].div.style.borderRightWidth = 0;
	}

	// 容器
	this.div = this.selector.div;
	LZR.HTML5.Util.Css.addClass(this.div, obj.outClass);
	this.bta.cover.appendChild(this.div);
};
LZR.HTML5.Util.TimeAxisBurst.prototype.className = "LZR.HTML5.Util.TimeAxisBurst";
LZR.HTML5.Util.TimeAxisBurst.prototype.version = "0.0.0";

// 初始化
LZR.HTML5.Util.TimeAxisBurst.prototype.init = function () {
	var w = this.bta.scroll.constant.stripPs.width;
	this.div.style.width = w + "px";
	w /= this.count;
	for (var i=0; i<this.count; i++) {
		this.selector.children[i].div.style.width = (w-this.offsetW) + "px";
	}
};

// 生成时间轴刻度数据
LZR.HTML5.Util.TimeAxisBurst.prototype.createData = function (data) {
	if (data) {
		this.count = data.length;
	}
	if (this.count === 0) {
		return [];
	}
	var a = [];
	this.step = this.bta.timeLong / this.count;
	var s = this.step * this.bta.timeStep;	// 时间间隔
	var ts = this.bta.startTime;
	var te;
	var today, backday, nextday, endday;

	if (!data) {
		today = new Date();
		today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(0);
		today.setMilliseconds(0);
		today = today.valueOf();
		backday = today - 24 * 3600 * 1000;
		nextday = today + 24 * 3600 * 1000;
		endday = nextday + 24 * 3600 * 1000;
	}

	for (var i=0; i<this.count; i++) {
		var c = "";
		if (data) {
			c = data[i];
		} else {
			c = this.getContent (ts, te, backday, today, nextday, endday);
		}
		te = s + ts;
		a.push({
			ts: ts,	// 开始时间（日期的数字形式）
			te: te,	// 结束时间（日期的数字形式）
			title: c	// 显示内容
		});
		ts = te;
	}
	return a;
};

// 获取时间轴的显示内容（接口）
LZR.HTML5.Util.TimeAxisBurst.prototype.getContent = function (ts, te, backday, today, nextday, endday) {
	if (ts>=backday) {
		if (ts<today) {
			return "昨天";
		} else if (ts<nextday) {
			return "今天";
		} else if (ts < endday) {
			return "明天";
		}
	}

	var t = new Date(ts);
	var c = "";
	switch (t.getDay()) {
		case 0:
			c = "周日 ";
			break;
		case 1:
			c = "周一 ";
			break;
		case 2:
			c = "周二 ";
			break;
		case 3:
			c = "周三 ";
			break;
		case 4:
			c = "周四 ";
			break;
		case 5:
			c = "周五 ";
			break;
		case 6:
			c = "周六 ";
			break;
	}
	c += t.getDate();
	return c;
};

