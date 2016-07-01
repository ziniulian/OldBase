// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2/WindLayer.js" ]);

// ----------- 基于OpenLayers的风场图层 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/Layer.js",
	LZR.HTML5.jsPath + "util/Graphics.js",
	LZR.HTML5.jsPath + "HTML5/util/Css.js",
	LZR.HTML5.jsPath + "HTML5/util/Ajax.js",
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2.js"
]);
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer = function (obj) {
	var vc = LZR.Util.ValCtrl;
	LZR.Util.Layer.call(this);

	// OpenLayers地图
	this.map = null;

	// 风场服务URL
	this.windUrl = null;

	// 画布
	this.cav = document.createElement("canvas");

	// 绘图环境
	this.ctx = this.cav.getContext("2d");

	// 风场数据
	this.data = [];

	// 时间序号
	this.timeId = new vc(0);

	// 横向个数
	this.column = new vc(15);

	// 纵向个数
	this.row = new vc(10);

	// 边缘补白
	this.pad = new vc(10);

	// 风长系数
	this.length = new vc(3);

	// 风场颜色
	this.color = new vc("yellow");

	// 最小风速
	this.miniSpeed = new vc(0.2);

	// 是否自动刷新
	this.autoFlush = true;

	// 数据投影模式
	this.dataProjection = "EPSG:4326";

	// 地图投影模式
	this.mapProjection = "EPSG:4326";

	// 图形学相关算法
	this.gp = new LZR.Util.Graphics();

	// 刷新计数器
	this.countOfFlush = 0;

	// 新数据
	this.newData = null;

	// 事件回调
	this.event = {
		"flushed": new LZR.Util.CallBacks (this)
	};

	// 事件回调总设置
	this.callback();

	// 设置参数
	if (obj) {
		LZR.setObj (this, obj);

		// 设置风场图层的CSS样式
		if (obj.windCanvasStyle) {
			this.setWindCanvasStyle (obj.windCanvasStyle);
		}
	}
};
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype = LZR.createPrototype (LZR.Util.Layer.prototype);
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype._super = LZR.Util.Layer.prototype;
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype.className = "LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer";
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype.version = "0.0.3";

// 初始化
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype.init = function (olmap) {
	if (!this.map) {
		this.map = olmap;

		// 地图变化时件回调
		olmap.on('postcompose', LZR.bind (this, this.draw));

		// 地图移动结束时事件回调
		olmap.on('moveend', LZR.bind (this, this.flushNoEvent));

		// 加载画布
		olmap.getViewport().appendChild(this.cav);
		this.resize();
	}
	this.dataProj = ol.proj.get(this.dataProjection);
	this.mapProj = ol.proj.get(this.mapProjection);
	this.LLC = ol.proj.get("EPSG:4326");
};

// 刷新显示
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype.flush = function (doEvent) {
	if (doEvent !== false) {
		doEvent = true;
	}
	this.countOfFlush ++;

	if (this.info.val && this.visible.val && this.alpha.val>0 && this.row.val>0 && this.column.val>0) {
		var url = this.info.val[this.timeId.val];
		if (url) {
			this.queryData (url, doEvent);
			return;
		}
	}

	this.event.flushed.enableEvent = doEvent;
	this.flushed();
	this.draw();
};

// 不触发刷新结束事件的画布刷新
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype.flushNoEvent = function () {
	this.flush (false);
};

// 设置风场图层的CSS样式
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype.setWindCanvasStyle = function (css) {
	LZR.HTML5.Util.Css.addClass (this.cav, css);
	this.resize();
};

// 设置风场服务路径
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype.setWindUrl = function (url) {
	this.windUrl = url;
};

// 查询数据
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype.queryData = function (pro, doEvent) {
	// 整理URL
	var url = this.windUrl + pro;
	url += "&rowNo=";
	url += this.column.val;
	url += "&columnNo=";
	url += this.row.val;
	var p = this.pad.val;
	var p1 = ol.proj.transform( this.map.getCoordinateFromPixel([p, p]), this.mapProj, this.LLC );
	var p2 = ol.proj.transform( this.map.getCoordinateFromPixel([(this.cav.clientWidth - p), (this.cav.clientHeight - p)]), this.mapProj, this.LLC );
	url += "&lonmin=" + p1[0];
	url += "&latmin=" + p2[1];
	url += "&lonmax=" + p2[0];
	url += "&latmax=" + p1[1];
// console.log(p1[0] + " , " + p2[1] + " , " + p2[0] + " , " + p1[1]);

	// 获取数据
	new LZR.HTML5.Util.Ajax ().get (url, LZR.bind (this, this.onload, doEvent));
};

// 整理风场数据
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype.handleWindData = function (obj) {
	var r = [];
	for (var i=0; i<obj.length; i++) {
		var d = obj[i];

		// 风速
		var speed = Math.sqrt(d[3]*d[3] + d[2]*d[2]);
		if (speed > this.miniSpeed.val) {
			// 角度
			var a = 0;
			if (d[2] === 0) {
				if (d[3]>0) {
					a = -Math.PI/2;
				} else {
					a = Math.PI/2;
				}
			} else {
				a = Math.atan(-d[3]/d[2]);
				if (d[2] < 0) {
					a += Math.PI;
				}
			}

			// 旋转系数
			var p = this.gp.calcTransform(a, 1, 1, 0, 0);
			var c = ol.proj.transform([d[0], d[1]], this.dataProj, this.mapProj);
			var size;

			// 比例风速
			// size = this.length.val * speed;

			// 级别风速
			size = this.getWindSize(speed);

			r.push([p, size, c]);
		}
	}
	return r;
};

// 通过风力的级别来决定风的绘制长度
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype.getWindSize = function (speed) {
	var size = 0;
	if (speed <= 1.5) {
		size = 12;
	} else if (speed <= 3.3) {
		size = 13;
	} else if (speed <= 5.4) {
		size = 14;
	} else if (speed <= 7.9) {
		size = 15;
	} else if (speed <= 10.7) {
		size = 16;
	} else if (speed <= 13.8) {
		size = 17;
	} else if (speed <= 17.1) {
		size = 18;
	} else {
		size = 19;
	}
	return size;
};

// 画风场
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype.draw = function () {
	this.ctx.clearRect(0, 0, this.cav.width, this.cav.height);
	if (this.visible.val && this.alpha.val>0 && this.data) {
		this.ctx.save();
		this.ctx.strokeStyle = this.color.val;
		this.ctx.globalAlpha = this.alpha.val;
		this.ctx.beginPath();
		for (var i=0; i<this.data.length; i++) {
			// 画图
			var d = this.data[i];
			var p = d[0];
			var size = d[1];
			var dp = this.map.getPixelFromCoordinate(d[2]);
			this.ctx.setTransform(p[0], p[1], p[2], p[3], dp[0], dp[1]);
			this.drowArrow (d[1]);
			this.ctx.closePath();
		}
		this.ctx.stroke();
		this.ctx.restore();
	}
};

// 画箭头（三叉箭头）
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype.drowArrow = function (size) {
	var t = size - this.length.val;
	this.ctx.moveTo(0, 0);
	this.ctx.lineTo(size, 0);
	this.ctx.lineTo(t, size-t);
	this.ctx.moveTo(size, 0);
	this.ctx.lineTo(t, t-size);
};

// 画箭头（指针箭头）
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype.drowArrow1 = function (size) {
	var t = size*0.2;
	this.ctx.moveTo(0, 0);
	this.ctx.lineTo(size, 0);
	this.ctx.moveTo(size, 0);
	this.ctx.lineTo(0, t);
	this.ctx.lineTo(t, 0);
	this.ctx.lineTo(0, -t);
};

// -------------------- 事件 ------------------

// 图片刷新结束时触发的事件
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype.flushed = function (self) {
	this.countOfFlush --;
	return this.event.flushed.execute (this);
};

// -------------------- 事件回调 ------------------

// 事件回调总设置
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype.callback = function () {
	// 时间序号
	this.timeId.setEventObj (this);
	this.timeId.event.change.append (this.flush);

	// 图片信息
	this.info.setEventObj (this);
	this.info.event.set.append (this.flush);

	// 透明度
	this.alpha.setEventObj (this);
	this.alpha.event.change.append (this.draw);

	// 是否可见
	this.visible.setEventObj (this);
	this.visible.event.change.append (this.flushNoEvent);

	// 横向个数
	this.column.setEventObj (this);
	this.column.event.change.append (this.flushNoEvent);

	// 纵向个数
	this.row.setEventObj (this);
	this.row.event.change.append (this.flushNoEvent);

	// 边缘补白
	this.pad.setEventObj (this);
	this.pad.event.change.append (this.flushNoEvent);

	// 风长系数
	this.length.setEventObj (this);
	this.length.event.change.append (this.draw);

	// 风场颜色
	this.color.setEventObj (this);
	this.color.event.change.append (this.draw);

	// 添加窗体变化自适应功能
	LZR.HTML5.Util.Event.addEvent (window, "resize", LZR.bind(this, this.resize), false);
};

// 查询数据结束时的回调函数
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype.onload = function (doEvent, txt) {
	if (txt) {
		// 整理数据
		this.newData = this.handleWindData(JSON.parse(txt));

		// 画风场
		if (this.autoFlush) {
			this.data = this.newData;
			this.draw();
		}
	}

	// 刷新结束的回调
	this.event.flushed.enableEvent = doEvent;
// console.log ("load : " + this.event.flushed.enableEvent);
	this.flushed();
};

// 窗体变化时的回调函数
LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer.prototype.resize = function () {
	this.cav.width = this.cav.clientWidth;
	this.cav.height = this.cav.clientHeight;
};

