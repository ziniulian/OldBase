// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/Util/BpTimeAxis.js" ]);

// ----------- BP时间轴 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/TimeAxisBurst.js"
]);
LZR.HTML5.loadCss([
	LZR.HTML5.jsPath + "css/LHBU_BpTimeAxis.css"
]);
LZR.HTML5.Bp.Util.BpTimeAxis = function (obj) {
	/*
		参数说明：
			{
				count : ,	// 时间刻度数量
				data: ,		// 时间刻度数据
				style: ,		// 风格（0：压线（含最大时间）；1：压中（不含最大时间））

				startTime: ,	// 起始时间
				timeLong: ,	// 时间长度
				timeStep: ,	// 时间间隔（秒）
				playStep: ,	// 时间轴播放跨度
				playSpeed: ,	// 时间轴播放速度（毫秒）
				playMod: ,	// 播放模式（0：循环播放；1：自动停止）
				div: ,		// 容器

				allShow: ,	// 鼠标移开时是否继续显示当前提示
				noDrop: ,	// 时间轴不能拖动
				hidPlay: ,	// 是否隐藏播放按钮
				hidTitle: ,	// 是否隐藏提示框

			}
	*/
	// 容器
	if (obj.div) {
		this.div = obj.div;
	} else {
		this.div = document.createElement("div");
	}

	// 播放按钮
	this.playBtn = new LZR.HTML5.Util.Select ({
		data: {
			title: "播放动画",
			checked: false
		},
		type: 0,
		defaultClass: "LHU_BpTimeAxis_play",	// 播放按钮默认样式
		downClass: "LHU_BpTimeAxis_pause"	// 播放按钮按下样式
	});
	this.div.appendChild(this.playBtn.div);
	if (obj.hidPlay) {
		this.playBtn.div.style.display = "none";
	}

	// 时间轴
	this.ta = new LZR.HTML5.Util.BaseTimeAxis({
		currentTitleClass: "LHU_BpTimeAxis_ct",		// 当前提示样式
		mouseTitleClass: "LHU_BpTimeAxis_mt",		// 鼠标提示样式
		backStripClass: "LHU_BpTimeAxis_bs",		// 时间条背景样式
		coverStripClass: "LHU_BpTimeAxis_cs",		// 时间条覆盖样式
		scrollBtnClass: "LHU_BpTimeAxis_sb",		// 滚动条的按钮样式

		startTime: obj.startTime,	// 起始时间
		timeLong: obj.timeLong,	// 时间长度
		timeStep: obj.timeStep,	// 时间间隔（秒）
		style: obj.style,		// // 风格（0：压线（含最大时间）；1：压中（不含最大时间））

		allShow: obj.allShow,	// 鼠标移开时是否继续显示当前提示
		noDrop: obj.noDrop,		// 鼠标移开时是否继续显示当前提示
		titleOver: -18,		// 提示重叠增量
		hidTitle: obj.hidTitle,	// 是否隐藏提示框
		hoverTime: obj.hoverTime,	// 悬停延迟时间（毫秒）

		playStep: obj.playStep,	// 时间轴播放跨度
		playSpeed: obj.playSpeed,	// 时间轴播放速度（毫秒）
		playMod: obj.playMod,	// 播放模式（0：循环播放；1：自动停止）

		div: this.div
	});

	// 时间刻度
	this.tb = this.createTb (obj.count, obj.data);

	// 自适应屏幕
	LZR.HTML5.Util.Event.addEvent (window, "resize", LZR.bind (this, function() {
		this.init();
	}), false);

	// 接口设置
	this.playBtn.onDown = LZR.bind (this, function(d) {
		if (d.checked) {
			this.play();
		} else {
			this.stop();
			this.autoStop();
		}
	});
	this.ta.autoStop = LZR.bind (this, function () {
		this.playBtn.setChecked (false);
		this.autoStop();
	});
	this.ta.onchange = LZR.bind (this, function (time, position) {
		return this.onchange(time, position);
	});
	this.ta.getCurrentTitleContent = LZR.bind (this, function (t) {
		return this.getCurrentTitleContent(t);
	});
	this.ta.getMouseTitleContent = LZR.bind (this, function (t) {
		return this.getMouseTitleContent(t);
	});
};
LZR.HTML5.Bp.Util.BpTimeAxis.prototype.className = "LZR.HTML5.Bp.Util.BpTimeAxis";
LZR.HTML5.Bp.Util.BpTimeAxis.prototype.version = "0.0.3";

// 初始化
LZR.HTML5.Bp.Util.BpTimeAxis.prototype.init = function (p) {
	/*
		参数说明：
			p: ,	// 刻度位置
	*/
	this.ta.init(p);
	this.tb.init();
};

// 播放
LZR.HTML5.Bp.Util.BpTimeAxis.prototype.play = function () {
	if (this.beforePlay() !== false) {
		this.ta.play();
	}
};

// 暂停
LZR.HTML5.Bp.Util.BpTimeAxis.prototype.stop = function () {
	this.ta.pause();
	this.playBtn.setChecked (false);
};

// 跳至下一帧
LZR.HTML5.Bp.Util.BpTimeAxis.prototype.next = function () {
	this.ta.next();
};

// 跳回上一帧
LZR.HTML5.Bp.Util.BpTimeAxis.prototype.back = function () {
	this.ta.back();
};

// 设置位置
LZR.HTML5.Bp.Util.BpTimeAxis.prototype.setPosition = function (p) {
	/*
		参数说明：
			p: ,	// 刻度位置
	*/
	this.ta.setPosition(p);
};

// 生成时间刻度
LZR.HTML5.Bp.Util.BpTimeAxis.prototype.createTb = function (count, data) {
	return new LZR.HTML5.Util.TimeAxisBurst ({
		bta: this.ta,
		count: count,
		data: data,
		outClass: "LHU_BpTimeAxis_tb",
		defaultClass: "LHU_BpTimeAxis_tbf",
		overClass: "LHU_BpTimeAxis_tbo",
		downClass: "LHU_BpTimeAxis_tbd",
		offsetW: 1,
		noBorder: true
	});
};

// 设置

// 参数设置
LZR.HTML5.Bp.Util.BpTimeAxis.prototype.setter = function (k, v) {
	var c, d;
	switch (k) {
		case "count":
			c = v;
		case "data":
			if (c === undefined) {
				d = v;
			}
			this.ta.cover.removeChild(this.tb.div);
			this.tb = this.createTb(c, d);
			this.tb.init();
			break;
		case "startTime":
			this.ta.startTime = this.ta.calcStartTime (v);
			this.ta.scroll.position = 0;
			this.ta.init();
			this.stop();
			this.ta.cover.removeChild(this.tb.div);
			if (this.tb.count) {
				this.tb = this.createTb(this.tb.count);
			} else {
				this.tb = this.createTb(undefined, this.tb.data);
			}
			this.tb.init();
			break;
		case "timeLong":
			this.ta.setTimeLong (v);
			this.stop();
			break;
		case "timeStep":
			this.ta.timeStep = v * 1000;
			this.stop();
			break;
		case "playStep":
			this.ta.playStep = v;
			break;
		case "playSpeed":
			this.ta.setPlaySpeed(v);
			break;
		case "playMod":
			this.ta.playMod = v;
			break;
		case "allShow":
			this.ta.setAllShow (v);
			break;
		case "hidPlay":
			if (v) {
				this.playBtn.div.style.display = "none";
			} else {
				this.playBtn.div.style.display = "";
			}
			this.stop();
			break;
		case "style":
			this.ta.style = v;
			this.ta.init();
			break;
		case "noDrop":
			this.ta.noDrop = v;
			break;
		case "hidTitle":
			this.ta.setHidTitle (v);
			break;
	}
};

// 获取时间轴的当前时间
LZR.HTML5.Bp.Util.BpTimeAxis.prototype.getCurrentTime = function () {
	return this.ta.getCurrentTime();
};

// 刷新时间轴的当前时间
LZR.HTML5.Bp.Util.BpTimeAxis.prototype.flushCurrentTime = function () {
	this.ta.currentTitle.innerHTML = this.getCurrentTitleContent (this.getCurrentTime());
};

// 获取当前提示内容（接口）
LZR.HTML5.Bp.Util.BpTimeAxis.prototype.getCurrentTitleContent = function (t) {
	/*
		参数说明：
			t: ,	// 时间轴的当前时间
	*/
	return (LZR.HTML5.Util.format (t.getHours(), 2, "0") + ":" + LZR.HTML5.Util.format (t.getMinutes(), 2, "0"));
};

// 获取鼠标提示内容（接口）
LZR.HTML5.Bp.Util.BpTimeAxis.prototype.getMouseTitleContent = function (t) {
	/*
		参数说明：
			t: ,	// 当前鼠标所在的时间
	*/
	return this.getCurrentTitleContent(t);
};

// 时间轴变化事件（接口）
LZR.HTML5.Bp.Util.BpTimeAxis.prototype.onchange = function (time, position) {
	/*
		参数说明：
			time: ,		// 时间轴的当前时间
			position: ,	// 当前位置
	*/
};

// 播放前事件（接口）
LZR.HTML5.Bp.Util.BpTimeAxis.prototype.beforePlay = function () {};

// 播放自动停止事件（接口）
LZR.HTML5.Bp.Util.BpTimeAxis.prototype.autoStop = function () {};
