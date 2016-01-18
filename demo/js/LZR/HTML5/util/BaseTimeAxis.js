// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/BaseTimeAxis.js" ]);

// ------------------- 基础时间轴 ---------------------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/Date.js",
	LZR.HTML5.jsPath + "HTML5/util/Scroll.js"
]);
LZR.HTML5.Util.BaseTimeAxis = function (obj) {
	/*
		参数说明：
		{
			currentTitleClass: ,	// 当前提示样式
			mouseTitleClass: ,	// 鼠标提示样式
			backStripClass: ,	// 时间条背景样式
			coverStripClass: ,	// 时间条覆盖样式
			scrollBtnClass: ,	// 滚动条的按钮样式

			startTime: ,	// 起始时间
			timeLong: ,	// 时间长度
			timeStep: ,	// 时间间隔（秒）
			style: ,		// 风格（0：压线（含最大时间）；1：压中（不含最大时间））

			allShow: ,	// 鼠标移开时是否继续显示当前提示
			noDrop: ,	// 时间轴不能拖动（0：可拖动并触发事件；1：不可拖动，只能点击触发事件；2：可拖动，但只有鼠标抬起时才能触发事件）
			titleOver: ,	// 提示重叠增量
			hidTitle: ,	// 是否隐藏提示框
			hoverTime: ,	// 悬停延迟时间（毫秒）

			playStep: ,	// 时间轴播放跨度
			playSpeed: ,	// 时间轴播放速度（毫秒）
			playMod: ,	// 播放模式（0：循环播放；1：自动停止）

			div: ,	// 容器
		}
	*/
	// 起始时间
	this.startTime = this.calcStartTime (obj.startTime);

	// 时间长度
	if (obj.timeLong) {
		this.timeLong = obj.timeLong;
	} else {
		this.timeLong = 100;
	}

	// 时间间隔（秒）
	if (obj.timeStep) {
		this.timeStep = obj.timeStep * 1000;
	} else {
		this.timeStep = 1000;
	}

	// 风格
	if (obj.style) {
		this.style = obj.style;
	} else {
		this.style = 0;
	}

	// 鼠标移开时是否继续显示当前提示
	if (obj.allShow) {
		this.allShow = obj.allShow;
	} else {
		this.allShow = false;
	}

	// 时间轴不能拖动
	if (obj.noDrop) {
		this.noDrop = obj.noDrop;
	} else {
		this.noDrop = 0;
	}

	// 提示重叠增量
	if (obj.titleOver) {
		this.titleOver = obj.titleOver;
	} else {
		this.titleOver = 0;
	}

	// 是否隐藏提示框
	if (obj.hidTitle) {
		this.hidTitle = obj.hidTitle;
	} else {
		this.hidTitle = false;
	}

	// 时间轴播放跨度
	if (obj.playStep) {
		this.playStep = obj.playStep;
	} else {
		this.playStep = 1;
	}

	// 时间轴播放速度（毫秒）
	if (obj.playSpeed) {
		this.playSpeed = obj.playSpeed;
	} else {
		this.playSpeed = 100;
	}

	// 播放模式（0：循环播放；1：自动停止）
	if (obj.playMod) {
		this.playMod = obj.playMod;
	} else {
		this.playMod = 0;
	}

	// 悬停延迟时间（毫秒）
	if (obj.hoverTime) {
		this.hoverTime = obj.hoverTime;
	} else {
		this.hoverTime = 1000;
	}

	// onchange时不触发事件
	this.nochange = false;

	// 滚动条
	this.scroll = new LZR.HTML5.Util.Scroll({
			count: obj.timeLong,		// 总数
			position: 0,	// 位置
			direction: 1,	// 方向（横向:1 ；纵向:2）
			autoLen: 0,	// 按钮自适应长度（0：不调整 padd 和 len；>0：代表按钮长度，并调整 padd 和 len）
			padd: 0,		// 按钮补白
			len: "100%",		// 可移动长度
			stripClass: obj.backStripClass,	// 长条 CSS 样式
			btnClass: obj.scrollBtnClass,		// 按钮CSS样式
			div: obj.div,	// 容器
			noAuto	: true	// 不要事件驱动
	});
	this.scroll.onchange = LZR.bind (this, function(p) {
		// 修改滚动条宽度
		var w;
		switch (this.style) {
			case 0:
				w = p;
				break;
			case 1:
				w = p + 0.5;
				break;
		}
		w = w / this.timeLong * this.scroll.len;
		this.cover.style.width = w + "px";

		// 修改提示窗位置
		this.currentTitle.style.left = (w - parseFloat(this.currentTitle.scrollWidth, 10)/2) + "px";

		// 修改提示窗内容
		var t = this.calcTimeByPosition (p);
		this.currentTitle.innerHTML = this.getCurrentTitleContent (t);

		// 触发回调事件
		if (this.nochange) {
			this.nochange = false;
		} else {
			this.onchange(t, p);
		}
	});

	// 容器
	this.div = this.scroll.div;

	// 覆盖条
	this.cover = document.createElement("div");
	LZR.HTML5.Util.Css.addClass (this.cover, obj.coverStripClass);
	var s = this.cover.style;
	s.width = 0;
	this.scroll.strip.appendChild(this.cover);

	// 当前提示
	this.currentTitle = document.createElement("div");
	LZR.HTML5.Util.Css.addClass (this.currentTitle, obj.currentTitleClass);
	s = this.currentTitle.style;
	s.position = "relative";
	if (!this.allShow || this.hidTitle) {
		s.visibility = "hidden";
	}
	this.cover.appendChild(this.currentTitle);

	// 鼠标提示
	this.mouseTitle = document.createElement("div");
	LZR.HTML5.Util.Css.addClass (this.mouseTitle, obj.mouseTitleClass);
	s = this.mouseTitle.style;
	s.position = "relative";
	s.display = "none";
	this.scroll.strip.appendChild(this.mouseTitle);
	this.mouseTile_top = parseFloat( this.getStyle(this.mouseTitle, "top") );

	// 控制器
	this.ctrl = new LZR.HTML5.Util.MouseDropController(this.scroll.strip);
	this.ctrl.noMid = true;
	this.ctrl.noRight = true;
	this.ctrl.noClick = true;
	this.ctrl.noCurrentMove = false;

	// 鼠标悬停延时制作
	this.hover = null;

	// 添加鼠标提示事件
	this.ctrl.autoCurrentMove = LZR.bind(this, function (x, y) {
		var p = this.calcPositionByMouse (x, y);
		var w = x - this.scroll.constant.stripPs.left;
		if (w >0 && w < this.scroll.len) {
			var cw = parseFloat(this.mouseTitle.scrollWidth, 10);
			this.mouseTitle.style.left = (w - cw/2) + "px";
			if (this.titleOver) {
				var m = parseFloat(this.mouseTitle.style.left, 10);
				var c = parseFloat(this.currentTitle.style.left, 10);
				if (m>(c-cw) && m<(c + parseFloat(this.currentTitle.scrollWidth, 10))) {
					this.mouseTitle.style.top = (this.mouseTile_top + this.titleOver) + "px";
				} else {
					this.mouseTitle.style.top = (this.mouseTile_top) + "px";
				}
			}
		}
		this.mouseTitle.innerHTML = this.getMouseTitleContent (this.calcTimeByPosition (p));

		// 刷新悬停事件
		clearTimeout(this.hover);
		this.hover = setTimeout( LZR.bind (this, function(position) {
			this.onHover(this.calcTimeByPosition (position), position);
		}, p), this.hoverTime);
	});

	// 判断是否可拖动
	var drag = LZR.bind(this, function () {
		if (this.ctrl.state === this.ctrl.STATE.LEFT) {
			this.pause();
			this.setPosition (this.calcPositionByMouse (this.ctrl.leftEnd.x, this.ctrl.leftEnd.y));
			this.autoStop();
		}
	});
	switch (this.noDrop) {
		case 2:
			// 添加鼠标抬起事件
			this.ctrl.autoMouseUp = LZR.bind(this, function () {
				if (this.ctrl.state === this.ctrl.STATE.LEFT) {
					this.nochange = false;
					var p = this.getCurrentPosition();
					this.onchange(this.calcTimeByPosition (p), p);
				}
			});

			// 添加拖动时间条事件
			this.ctrl.autoFlush = LZR.bind(this, function (dr) {
				this.nochange = true;
				dr();
			}, drag);
			break;
		case 0:
			// 添加拖动时间条事件
			this.ctrl.autoFlush = drag;
			break;
		case 1:
			// 单击事件
			this.ctrl.autoMouseUp = drag;
			break;
	}

/*
	// 隐藏当前提示事件
	this.ctrl.autoMouseUp = LZR.bind(this, function () {
		if ((this.ctrl.state === this.ctrl.STATE.LEFT) && !this.allShow) {
			this.currentTitle.style.visibility = "hidden";
		}
	});

	// 显示当前提示事件
	this.ctrl.autoMouseDown = LZR.bind(this, function () {
		if ((this.ctrl.state === this.ctrl.STATE.LEFT) && !this.allShow) {
			this.currentTitle.style.visibility = "visible";
		}
	});
*/
	// 隐藏当前提示事件
	LZR.HTML5.Util.Event.addEvent (this.div, "mouseout", LZR.bind(this, function() {
		// this.mouseTitle.style.display = "none";
		if (!this.allShow) {
			this.currentTitle.style.visibility = "hidden";
		}
	}), false);

	// 显示当前提示事件
	LZR.HTML5.Util.Event.addEvent (this.div, "mouseover", LZR.bind(this, function() {
		// this.mouseTitle.style.display = "";
		if (!this.hidTitle) {
			this.currentTitle.style.visibility = "visible";
		}
	}), false);

	// 隐藏鼠标提示事件
	LZR.HTML5.Util.Event.addEvent (this.scroll.strip, "mouseout", LZR.bind(this, function() {
		this.mouseTitle.style.display = "none";
		clearTimeout(this.hover);
	}), false);

	// 显示鼠标提示事件
	LZR.HTML5.Util.Event.addEvent (this.scroll.strip, "mouseover", LZR.bind(this, function() {
		if (!this.hidTitle) {
			this.mouseTitle.style.display = "";
		}
	}), false);
};
LZR.HTML5.Util.BaseTimeAxis.prototype.className = "LZR.HTML5.Util.BaseTimeAxis";
LZR.HTML5.Util.BaseTimeAxis.prototype.version = "0.0.2";

// 初始化
LZR.HTML5.Util.BaseTimeAxis.prototype.init = function (p) {
	if (p) {
		this.scroll.position = p;
	}
	this.nochange = true;
	this.scroll.init();
	if (this.ctrl.state === this.ctrl.STATE.UNABLE) {
		this.ctrl.enable (false, true, true);
	}
};

// 设置位置
LZR.HTML5.Util.BaseTimeAxis.prototype.setPosition = function (p) {
	this.scroll.setPosition (p);
};

// 设置开始时间
LZR.HTML5.Util.BaseTimeAxis.prototype.calcStartTime = function (t) {
	switch (LZR.HTML5.Util.getClassName (t)) {
		case "string":
			t = LZR.Util.Date.getDate( t ).valueOf();
			break;
		case "Date":
			t = t.valueOf();
			break;
		case "number":
			t = t;
			break;
		default:
			t = new Date();
			t.setHours(0);
			t.setMinutes(0);
			t.setSeconds(0);
			t.setMilliseconds(0);
			t = t.valueOf();
			break;
	}
	return t;
};

// 设置时间长度
LZR.HTML5.Util.BaseTimeAxis.prototype.setTimeLong = function (c) {
	this.timeLong = c;
	this.pause();
	this.scroll.srcObj.count = c;
	this.scroll.position = 0;
	this.init();
};

// 设置鼠标移开时是否继续显示当前提示
LZR.HTML5.Util.BaseTimeAxis.prototype.setAllShow = function (b) {
	this.allShow = b;
	if (b && !this.hidTitle) {
		this.currentTitle.style.visibility = "visible";
	}
};

// 设置是否隐藏提示框
LZR.HTML5.Util.BaseTimeAxis.prototype.setHidTitle = function (b) {
	this.hidTitle = b;
	if (b) {
		this.currentTitle.style.visibility = "hidden";
		this.mouseTitle.style.display = "none";
	} else if (this.allShow) {
		this.currentTitle.style.visibility = "visible";
	}
};

// 设置播放速度
LZR.HTML5.Util.BaseTimeAxis.prototype.setPlaySpeed = function (v) {
	this.playSpeed = v;
	if (this.playHandle) {
		this.pause();
		this.play();
	}
};

// 跳至下一帧
LZR.HTML5.Util.BaseTimeAxis.prototype.next = function () {
	var p = this.getCurrentPosition() + this.playStep;

	// 极值判断
	var end = false;
	switch (this.style) {
		case 0:
			end = (p > this.timeLong);
			break;
		case 1:
			end = (p >= this.timeLong);
			break;
	}

	if (end) {
		switch (this.playMod) {
			case 0:
				p = 0;
				break;
			case 1:
				return false;
		}
	}

	this.setPosition (p);
	return true;
};

// 跳至上一帧
LZR.HTML5.Util.BaseTimeAxis.prototype.back = function () {
	var p = this.getCurrentPosition() - 1;
	if (p < 0) {
		p = this.timeLong;
	}
	this.setPosition (p);
};

// 播放时间轴
LZR.HTML5.Util.BaseTimeAxis.prototype.play = function () {
	if (!this.playHandle) {
		this.playHandle = window.setInterval( LZR.bind (this, function() {
			if (!this.next()) {
				this.stop();
				this.autoStop();
			}
		}), this.playSpeed );
	}
};

// 暂停播放
LZR.HTML5.Util.BaseTimeAxis.prototype.pause = function () {
	if (this.playHandle) {
		window.clearInterval(this.playHandle);
		this.playHandle = undefined;
	}
};

// 停止播放
LZR.HTML5.Util.BaseTimeAxis.prototype.stop = function () {
	this.pause();
	this.init(0);
};

// 获取当前位置
LZR.HTML5.Util.BaseTimeAxis.prototype.getCurrentPosition = function () {
	return this.scroll.position;
};

// 获取当前时间
LZR.HTML5.Util.BaseTimeAxis.prototype.getCurrentTime = function () {
	return this.calcTimeByPosition (this.scroll.position);
};

// 根据鼠标位置计算对应的位置
LZR.HTML5.Util.BaseTimeAxis.prototype.calcPositionByMouse = function (x, y) {
	var p = (x - this.scroll.constant.stripPs.left) / this.scroll.len * this.timeLong;

	// 极值处理
	if (p<0) {
		p = 0;
	} else {
		switch (this.style) {
			case 0:
				if (p>this.timeLong) {
					p = this.timeLong;
				}
				break;
			case 1:
				if (p>=this.timeLong) {
					p = this.timeLong-1;
				}
				break;
		}
	}

	return Math.floor(p);
};

// 根据位置计算X方向像素坐标
LZR.HTML5.Util.BaseTimeAxis.prototype.calcPixByPosition = function (p) {
	return p / this.timeLong * this.scroll.len;
};

// 根据位置计算对应的时间
LZR.HTML5.Util.BaseTimeAxis.prototype.calcTimeByPosition = function (p) {
	return new Date(this.startTime + p*this.timeStep);
};

// 根据时间计算对应的位置
LZR.HTML5.Util.BaseTimeAxis.prototype.calcPositionByTime = function (t) {
	return (t.valueOf() - this.startTime) / this.timeStep;
};

// 获取当前提示内容（接口）
LZR.HTML5.Util.BaseTimeAxis.prototype.getCurrentTitleContent = function (t) {
	// return t.toString();
	return (LZR.HTML5.Util.format (t.getHours(), 2, "0") + ":" + LZR.HTML5.Util.format (t.getMinutes(), 2, "0"));
};

// 获取鼠标提示内容（接口）
LZR.HTML5.Util.BaseTimeAxis.prototype.getMouseTitleContent = function (t) {
	// return t.toString();
	return this.getCurrentTitleContent(t);
};

// 时间轴变化事件（接口）
LZR.HTML5.Util.BaseTimeAxis.prototype.onchange = function (time, position) {};

// 播放自动停止事件（接口）
LZR.HTML5.Util.BaseTimeAxis.prototype.autoStop = function () {};

// 鼠标悬停事件（接口）
LZR.HTML5.Util.BaseTimeAxis.prototype.onHover = function (time, position) {};

// 获取CSS样式值
LZR.HTML5.Util.BaseTimeAxis.prototype.getStyle = function (dom, name) {
	var s = window.getComputedStyle ? window.getComputedStyle(dom,null) : obj.currentStyle;
	if (name) {
		return s[name];
	} else {
		return s;
	}
};

