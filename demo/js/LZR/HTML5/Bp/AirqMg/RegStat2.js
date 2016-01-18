// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2.js" ]);

// ----------- 区域形势 ------------

if (! window.ol) {
	LZR.HTML5.loadJs([
		LZR.HTML5.jsPath + "HTML5/expand/ol3/ol.js"
	]);
	LZR.HTML5.loadCss([
		LZR.HTML5.jsPath + "HTML5/expand/ol3/ol.css"
	]);
}
LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/Layer/Manager.js",
	LZR.HTML5.jsPath + "HTML5/Bp/Util/BpTimeAxis.js"
]);
LZR.HTML5.Bp.AirqMg.RegStat2 = function (obj) {
	// OpenLayers地图
	this.olmap = null;

	// 数据
	this.data = null;

	// 图层管理器
	this.layersMgr = new LZR.Util.Layer.Manager();

	// 已刷新结束的图层个数
	this.allFlushed = 0;

	// 图片图层计数器
	this.countOfOlLayer = 0;

	// 设置参数
	if (obj) {
		LZR.setObj (this, obj);
	}
	this.initViewByData ();
};
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.className = "LZR.HTML5.Bp.AirqMg.RegStat2";
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.version = "0.1.3";

// 加载内部类
LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2/OlLayer.js",
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2/OlGeoJsonLayer.js",
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2/WindLayer.js",
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2/ViewData.js",
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2/SelectView.js",
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2/Query.js"
]);

// 初始化视图
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByData = function () {
	if (this.data) {
		for (var s in this.data) {
			switch (s) {
				case "fom":
					this.initViewByFom (this.data.fom);
					break;
				case "line":
					this.initViewByLine (this.data.line);
					break;
				case "wind":
					this.initViewByWind (this.data.wind);
					break;
				case "mod":
					this.initViewByMod (this.data.mod);
					break;
				case "area":
					this.initViewByArea (this.data.area);
					break;
				case "timeStep":
					this.initViewByTimeStep (this.data.timeStep);
					break;
				case "time":
					this.initViewByTime (this.data.time);
					break;
				case "date":
					this.initViewByDate (this.data.date);
					break;
				case "timeAxis":
					this.initViewByTimeAxis (this.data.timeAxis);
					break;
				case "timeHover":
					this.initViewByTimeHover (this.data.timeHover);
					break;
				case "qry":
					this.initViewByQry (this.data.qry);
					break;
				case "mark":
					this.initViewByMark (this.data.mark);
					break;
			}
		}
	}
};

// 初始化污染物视图
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByFom = function (obj) {
	this.initLayer(obj);
};

// 初始化等高线视图
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByLine = function (obj) {
	this.initLayer(obj);
};

// 初始化风场视图
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByWind = function (obj) {
	this.initLayer(obj);
};

			// 初始化污染物、等高线、风场视图通用函数
			LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initLayer = function (obj) {
				if (!obj.ctrl) {
					// 生成图层
					var c, arg;
					switch (obj.id) {
						case "fom":
							c = "OlLayer";
							arg = {
								num: obj.root.cur[obj.id][obj.root.cur.timeStep.id],
								visible: obj.root.cur[obj.id].visible.val,
								alpha: obj.root.cur[obj.id].alpha.val,
								dataProjection: obj.root.cur[obj.id].dataProjection,
								mapProjection: obj.root.cur[obj.id].mapProjection,
								area: obj.root.cur.area.range
							};
							break;
						case "line":
							c = "OlGeoJsonLayer";
							arg = {
								num: obj.root.cur[obj.id][obj.root.cur.timeStep.id],
								visible: obj.root.cur[obj.id].visible.val,
								alpha: obj.root.cur[obj.id].alpha.val,
								dataProjection: obj.root.cur[obj.id].dataProjection,
								mapProjection: obj.root.cur[obj.id].mapProjection
							};
							break;
						case "wind":
							c = "WindLayer";
							arg = {
								visible: obj.root.cur[obj.id].visible.val,
								alpha: obj.root.cur[obj.id].alpha.val,
								windUrl: obj.root.cur[obj.id].windUrl,
								column: obj.root.cur[obj.id].column,
								row: obj.root.cur[obj.id].row,
								pad: obj.root.cur[obj.id].pad,
								windCanvasStyle: obj.root.cur[obj.id].windCanvasStyle,
								color: obj.root.cur[obj.id].color,
								dataProjection: obj.root.cur[obj.id].dataProjection,
								mapProjection: obj.root.cur[obj.id].mapProjection
							};
							break;
					}
					obj.ctrl = new LZR.HTML5.Bp.AirqMg.RegStat2[c] (arg);
					obj.ctrl.dataParent = obj.root.cur[obj.id];
					this.layersMgr.append (obj.ctrl);

					// 初始化图层
					switch (obj.id) {
						case "fom":
							this.countOfOlLayer ++;
							break;
						case "line":
						case "wind":
							obj.ctrl.autoFlush = false;
							break;
					}
					obj.ctrl.init(this.olmap);

					// 事件关联 ------------------------------------------------
					obj.ctrl.event.flushed.obj = this;
					obj.ctrl.event.flushed.append(this.layerFlushed);
				}

				for (var s in obj.children) {
					var f = obj.children[s];

					// 数据完善
					if (!f.ctrl) {
						f.ctrl = obj.ctrl;
						f.alpha = f.ctrl.alpha;
					}
					if (!f.view) {
						f.view = new LZR.HTML5.Bp.AirqMg.RegStat2.SelectView({
							html: f.html,
							selected: f.visible
						});
					}

					// 事件关联 ------------------------------------------------
					f.visible.setEventObj (this);
					f.alpha.event.change.append (LZR.bind(this, this.setLayerAlpha, f), f.id + "_alpha");
					f.visible.event.change.append (LZR.bind(this, this.setLayerVisible, f), "visible");
				}
			};

			// 变更图层是否可见
			LZR.HTML5.Bp.AirqMg.RegStat2.prototype.setLayerVisible = function (lay, v) {
				if (v) {
					var s = lay.parent.id;
					if (lay !== lay.root.cur[s]) {
						lay.root.cur[s].visible.set (false);
						lay.root.cur[s] = lay;
						lay.ctrl.dataParent = lay;
						if (lay.ctrl.num) {
							lay.ctrl.num.set (lay[ lay.root.cur.timeStep.id ]);
						}
					}
					this.flush();
				}
				lay.ctrl.visible.set(v);
			};

			// 变更图层透明度
			LZR.HTML5.Bp.AirqMg.RegStat2.prototype.setLayerAlpha = function (lay, v) {
				lay.ctrl.alpha.set(v);
			};

			// 刷新图层
			LZR.HTML5.Bp.AirqMg.RegStat2.prototype.flush = function () {
// console.log ("flush : " + new Date().valueOf());
				this.allFlushed = 0;
				this.data.qry.ctrl.open();
			};

			// 图层刷新结束时的回调函数
			LZR.HTML5.Bp.AirqMg.RegStat2.prototype.layerFlushed = function (self) {
// console.log (self.index + " : " + new Date().valueOf());
				this.allFlushed ++;
				if (this.allFlushed === this.layersMgr.layers.length) {
					this.allLayersFlushed();
				} else if (this.allFlushed === (this.layersMgr.layers.length - this.countOfOlLayer)) {
					var ys = this.layersMgr.layers;
					for (var i=0; i<ys.length; i++) {
						var y = ys[i];
						switch (y.className) {
							// 区域形势的OpenLayers图片图层
							case "LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer":
								y.timeId.set(this.data.timeAxis.ctrl.ta.getCurrentPosition());
								break;
						}
					}
				}
			};

			// 全部图层都刷新完毕时的回调函数
			LZR.HTML5.Bp.AirqMg.RegStat2.prototype.allLayersFlushed = function () {
				var ys = this.layersMgr.layers;
				for (var i=0; i<ys.length; i++) {
					var y = ys[i];
					switch (y.className) {
						// 区域形势的OpenLayers GeoJson图层
						case "LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer":
						// 区域形势基于OpenLayers的风场图层
						case "LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer":
							y.autoFlush = true;
							y.data = y.newData;
							y.draw();
							break;
					}
				}

				// 动画是否继续播放
				if (this.data.timeAxis.playing) {
					this.data.timeAxis.playing = setTimeout( LZR.bind (this, function () {
						if (this.data.timeAxis.playing) {
							this.data.timeAxis.ctrl.next();
						}
					}), this.data.timeAxis.playWaitTime.val );
				}
			};

// 初始化模式视图
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByMod = function (obj) {
	this.initSelect(obj);

	// 事件关联 ------------------------------------------------
	obj.ctrl.event.change.append (this.setMod);
};

			// 模式变化
			LZR.HTML5.Bp.AirqMg.RegStat2.prototype.setMod = function (obj) {
				this.data.timeAxis.ctrl.stop();
				this.data.timeAxis.ctrl.autoStop();

				obj.root.setTimeLongByTimeAxis();
				obj.root.qry.ctrl.setQry({
					mod: obj.id,
					end: obj.root.getEndByInterface()
				});
			};

// 初始化区域视图
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByArea = function (obj) {
	this.initSelect(obj);

	// 事件关联 ------------------------------------------------
	obj.ctrl.event.change.append (this.setArea);
};

			// 区域变化
			LZR.HTML5.Bp.AirqMg.RegStat2.prototype.setArea = function (obj) {
				this.data.timeAxis.ctrl.stop();
				this.data.timeAxis.ctrl.autoStop();

				obj.root.fom.ctrl.area.set (obj.range);
				obj.root.setTimeLongByTimeAxis();
				obj.root.qry.ctrl.setQry({
					area: obj.num,
					end: obj.root.getEndByInterface()
				});
			};

// 初始化时长视图
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByTimeStep = function (obj) {
	this.initSelect(obj);

	// 事件关联 ------------------------------------------------
	obj.ctrl.event.change.append (this.setTimeStep);
};

			// 时长变化
			LZR.HTML5.Bp.AirqMg.RegStat2.prototype.setTimeStep = function (obj) {
				this.data.timeAxis.ctrl.stop();
				this.data.timeAxis.ctrl.autoStop();

				var v = obj.root.timeAxis.timeLong.val;
				switch (obj.id) {
					case "hour":
						obj.root.timeAxis.ctrl.setter("timeStep", 3600);
						obj.root.timeAxis.ctrl.setter("timeLong", v * 24);
						break;
					case "day":
						obj.root.timeAxis.ctrl.setter("timeStep", 3600 * 24);
						obj.root.timeAxis.ctrl.setter("timeLong", v);
						break;
				}
				this.resetLayerTimeId();

				v = obj.root.cur.fom;
				v.ctrl.num.enableEvent = false;
				v.ctrl.num.set (v[ obj.id ]);

				v = obj.root.cur.line;
				v.ctrl.num.enableEvent = false;
				v.ctrl.num.set (v[ obj.id ]);
			};

// 初始化产品时次视图
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByTime = function (obj) {
	this.initSelect(obj);

	// 事件关联 ------------------------------------------------
	obj.ctrl.event.change.append (this.setTime);
};

			// 产品时次变化
			LZR.HTML5.Bp.AirqMg.RegStat2.prototype.setTime = function (obj) {
				this.data.timeAxis.ctrl.stop();
				this.data.timeAxis.ctrl.autoStop();

				this.data.qry.ctrl.setQry({
					tim: this.data.getTimByInterface()
				});

				// 时间轴
				this.data.timeAxis.ctrl.setter("startTime", this.data.getStartTimeByTimeAxis());
				this.resetLayerTimeId();
			};


			// 初始化模式、区域、时长、产品时次视图
			LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initSelect = function (obj) {
				if (!obj.ctrl) {
					// 添加刷新事件
					obj.ctrl = {
						event: {
							"flush": new LZR.Util.CallBacks (this),
							"change": new LZR.Util.CallBacks (this)
						}
					};

					// 事件关联 ------------------------------------------------
					obj.ctrl.event.flush.append (this.flush);
				}

				for (var s in obj.children) {
					var f = obj.children[s];

					// 数据完善
					if (!f.view) {
						f.view = new LZR.HTML5.Bp.AirqMg.RegStat2.SelectView(f);
					}

					// 事件关联 ------------------------------------------------
					f.selected.event.before.append (LZR.bind(this, this.selectBefore, f), "selectBefore");
					f.selected.event.change.append (LZR.bind(this, this.selectHandle, f), "selectHandle");
				}
			};

			// 变更选项
			LZR.HTML5.Bp.AirqMg.RegStat2.prototype.selectBefore = function (obj, v) {
				var s = obj.parent.id;
				if (v) {
					if (obj !== obj.root.cur[s]) {
						var tmp = obj.root.cur[s];
						obj.root.cur[s] = obj;
						tmp.selected.set (false);
					} else {
						return false;
					}
				} else if (obj === obj.root.cur[s]) {
					return false;
				}
			};

			// 触发刷新事件
			LZR.HTML5.Bp.AirqMg.RegStat2.prototype.selectHandle = function (obj, v) {
				if (v) {
					// 触发变更事件
					obj.parent.ctrl.event.change.execute(obj);

					// 触发刷新事件
					obj.parent.ctrl.event.flush.execute(obj);
				}
			};

// 初始化产品时间视图
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByDate = function (obj) {
	if (!obj.view) {
		obj.view = document.createElement("input");
		obj.view.value = obj.content.val;
		LZR.HTML5.Util.Event.addEvent(obj.view, "change", LZR.bind(this, function(obj) {
			obj.content.set(obj.view.value);
		}, obj), false);

		// 事件关联 ------------------------------------------------
		obj.content.setEventObj(this);
		obj.content.event.change.append (this.setTime);
		obj.content.event.change.append (this.flush, "flush");
	}
};

// 初始化时间轴视图
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByTimeAxis = function (obj) {
	if (!obj.ctrl) {
		// 生成时间轴
		var arg = {
			style: obj.style,
			count: obj.timeLong.val,
			startTime: obj.root.getStartTimeByTimeAxis(),
			noDrop: obj.noDrop,
			hoverTime: obj.hoverTime,

			div: obj.view
		};
		switch (obj.root.cur.timeStep.id) {
			case "hour":
				arg.timeStep = 3600;
				arg.timeLong = obj.timeLong.val * 24;
				break;
			case "day":
				arg.timeStep = 3600 * 24;
				arg.timeLong = obj.timeLong.val;
				break;
		}
		obj.ctrl = new LZR.HTML5.Bp.Util.BpTimeAxis(arg);
		obj.view = obj.ctrl;

		// 时间轴悬浮框 ................. (未完成)

		// 事件关联 ------------------------------------------------
		obj.timeLong.setEventObj (this);
		obj.timeLong.event.change.append (this.setTimeLong);

		// 时间轴的控制播放
		obj.ctrl.beforePlay = LZR.bind(this, function(self) {
			self.playing = true;
			self.ctrl.next();
			return false;
		}, obj);
		obj.ctrl.autoStop = LZR.bind(this, function(self) {
			clearTimeout(self.playing);
			self.playing = false;
		}, obj);
		obj.ctrl.onchange = LZR.bind (this, this.changeTimeAxis);
	}
};

			// 时长变化
			LZR.HTML5.Bp.AirqMg.RegStat2.prototype.setTimeLong = function (v) {
				switch (this.data.cur.timeStep.id) {
					case "hour":
						// this.data.timeAxis.ctrl.setter("timeStep", 3600);
						this.data.timeAxis.ctrl.setter("timeLong", v * 24);
						break;
					case "day":
						// this.data.timeAxis.ctrl.setter("timeStep", 3600 * 24);
						this.data.timeAxis.ctrl.setter("timeLong", v);
						break;
				}
				this.data.timeAxis.ctrl.setter("count", v);
				this.resetLayerTimeId();
			};

			// 重置图层对应时间轴的ID号
			LZR.HTML5.Bp.AirqMg.RegStat2.prototype.resetLayerTimeId = function () {
				this.data.fom.ctrl.timeId.set(0, false);
				this.data.line.ctrl.timeId.set(0, false);
				this.data.wind.ctrl.timeId.set(0, false);
			};

			// 时间轴变动时的回调函数
			LZR.HTML5.Bp.AirqMg.RegStat2.prototype.changeTimeAxis = function (t, p) {
// console.log ("time change : " + new Date().valueOf());
				this.allFlushed = 0;
				var ys = this.layersMgr.layers;
				for (var i=0; i<ys.length; i++) {
					var y = ys[i];
					switch (y.className) {
						// 区域形势的OpenLayers图片图层
						case "LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer":
							if (this.countOfOlLayer === ys.length) {
								y.timeId.set(p);
							}
							break;
						// 区域形势的OpenLayers GeoJson图层
						case "LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer":
						// 区域形势基于OpenLayers的风场图层
						case "LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer":
							y.autoFlush = false;
							y.timeId.set(p);
							break;
					}
				}
				this.data.cur.tp.set(p);
			};

// 初始化时间悬浮框视图
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByTimeHover = function (obj) {
};

// 初始化查询条件
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByQry = function (obj) {
	if (!obj.ctrl) {
		// 生成查询条件
		obj.ctrl = new LZR.HTML5.Bp.AirqMg.RegStat2.Query({
			data: obj.root,
			layers: this.layersMgr.layers
		});
		obj.ctrl.foc.setUrlPre(obj.urlPre);
		obj.ctrl.setQry ({
			area: obj.root.cur.area.num,
			mod: obj.root.cur.mod.id,
			tim: obj.root.getTimByInterface(),
			start: obj.start,
			end: obj.root.getEndByInterface(),
			url: obj.wsUrl
		});
	}
};

// 初始化标记视图
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByMark = function (obj) {
};






/*
// 生成时间轴
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.timeAxisCre = function () {
	// 根据各控制器的默认值，初始化时间轴参数
	var ta = new LZR.HTML5.Bp.Util.BpTimeAxis({
		count: 7,		// 时间刻度数量
		style: 1,		// 风格（0：压线（含最大时间）；1：压中（不含最大时间））
		timeLong: 168,	// 时间长度
		timeStep: 3600,	// 时间间隔（秒）
		startTime: "2015-7-3",	// 起始时间
		// allShow: ,	// 鼠标移开时是否继续显示当前提示
		// playStep: ,	// 时间轴播放跨度
		playSpeed: 150,	// 时间轴播放速度（毫秒）
		// playMod: ,	// 播放模式（0：循环播放；1：自动停止）
		// hidPlay: ,	// 是否隐藏播放按钮
		noDrop: 2,
		hoverTime: 800,

		div: timeAxis	// 时间轴容器
	});
	ta.playing = false;

	// 时间轴的控制播放
	ta.beforePlay = LZR.bind(this, function(self) {
		self.playing = true;
		self.next();
		return false;
	}, ta);
	ta.autoStop = LZR.bind(this, function(self) {
		clearTimeout(self.playing);
		self.playing = false;
	}, ta);

	// 时间轴悬浮框
	var hover = {
		hoverClass: "hover",	// 悬浮框外框CSS样式
		imgClass: "hover_img",	// 悬浮框图片CSS样式
		txtClass: "hover_txt",	// 悬浮框文字CSS样式
		vClass: "hover_v",	// 悬浮框箭头CSS样式
		padd: 10,		// 图片间距
		layerId: 0,		// 图层位置
	};
	ta.hover = hover;
	hover.div = document.createElement("div");
	LZR.HTML5.Util.Css.addClass (hover.div, hover.hoverClass);
	ta.div.insertBefore(hover.div, ta.div.childNodes[0]);
	hover.div.style.display = "none";
	hover.div.style.position = "relative";

	// 隐藏悬浮框
	LZR.HTML5.Util.Event.addEvent (hover.div, "mouseout", LZR.bind(this, function(hover) {
		this.timeAxis.hover.div.style.display = "none";
	}), false);
	LZR.HTML5.Util.Event.addEvent (hover.div, "mouseover", LZR.bind(this, function(hover) {
		this.timeAxis.hover.div.style.display = "";
	}), false);

	// 显示悬浮框
	ta.ta.onHover = LZR.bind(this, function (time, position) {
		this.timeAxis.hover.div.style.display = "";
		this.hoverCre (position);
	});

	return ta;
};

// 生成时间轴悬浮框的内容
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.hoverCre = function (position) {
	var hover = this.timeAxis.hover;
	var L = parseFloat(this.timeAxis.ta.mouseTitle.style.left, 10) + this.timeAxis.ta.mouseTitle.clientWidth/2;
	var src = this.layersMgr.layers[hover.layerId].info.val;

	// 图片被点击时的行为
	var click = function (p) {
		this.timeAxis.hover.div.style.display = "none";
		this.timeAxis.stop();
		this.timeAxis.autoStop();
		this.timeAxis.setPosition(p);
	};

	// 清空旧的内容
	this.timeAxis.hover.div.innerHTML = "";

	// 下箭头
	var v = document.createElement("div");
	LZR.HTML5.Util.Css.addClass (v, hover.vClass);
	hover.div.appendChild(v);
	v.style.left = L - v.clientWidth/2;

	// 主图片
	var img = document.createElement("div");
	LZR.HTML5.Util.Css.addClass (img, hover.imgClass);
	hover.div.appendChild(img);
	var w = img.clientWidth;		// 图片宽度
	var p0 = L - w/2;	// 原图位置
	w += hover.padd;
	img.style.left = p0;
	img.style.backgroundImage = "url(" + src[position].ret + ")";
	img.onclick = LZR.bind(this, click, position);

	// 图片文字
	var txt = document.createElement("div");
	LZR.HTML5.Util.Css.addClass (txt, hover.txtClass);
	txt.innerHTML = src[position].tim;
	img.appendChild(txt);

	// 右边图片递增
	var p=p0, i = position+1;
	var max = hover.div.clientWidth;
	var total = this.timeAxis.ta.timeLong;
	while (i<total && (p + 2*w)<max) {
		p += w;

		img = document.createElement("div");
		LZR.HTML5.Util.Css.addClass (img, hover.imgClass);
		img.style.left = p;
		img.style.backgroundImage = "url(" + src[i].ret + ")";
		img.onclick = LZR.bind(this, click, i);
		hover.div.appendChild(img);

		txt = document.createElement("div");
		LZR.HTML5.Util.Css.addClass (txt, hover.txtClass);
		txt.innerHTML = src[i].tim;
		img.appendChild(txt);

		i++;
	}

	// 左边图片递增
	p=p0;
	i = position-1;
	while (i>0 && (p - w)>0) {
		p -= w;

		img = document.createElement("div");
		LZR.HTML5.Util.Css.addClass (img, hover.imgClass);
		img.style.left = p;
		img.style.backgroundImage = "url(" + src[i].ret + ")";
		img.onclick = LZR.bind(this, click, i);
		hover.div.appendChild(img);

		txt = document.createElement("div");
		LZR.HTML5.Util.Css.addClass (txt, hover.txtClass);
		txt.innerHTML = src[i].tim;
		img.appendChild(txt);

		i--;
	}
};

// 生成污染物浓度标记
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.markCre = function (obj) {
	if (obj.data) {
		var ta = this.timeAxis;

		// 生成标记的提示容器
		ta.mark = {
			div: document.createElement("div"),
			show: function (d, left) {
				var div = this.timeAxis.mark.div;
				switch (d.mmtyp) {
					case "MAX":
						div.innerHTML = "当天最大值：" + d.aqi;
						div.style.backgroundColor = "rgba(200, 0, 0, 0.3)";
						break;
					case "MIN":
						div.innerHTML = "当天最小值：" + d.aqi;
						div.style.backgroundColor = "rgba(0, 200, 0, 0.3)";
						break;
				}
				div.style.display = "";
				if ((left + div.clientWidth) > this.timeAxis.ta.scroll.len) {
					div.style.left = left - div.clientWidth;
				} else {
					div.style.left = left;
				}
			},
			hid: function () {
				this.timeAxis.mark.div.style.display = "none";
			}
		};
		LZR.HTML5.Util.Css.addClass (ta.mark.div, obj.titleClass);
		ta.mark.div.style.display = "none";
		ta.ta.cover.appendChild(ta.mark.div);

		// 生成标记圆点
		var show = ta.mark.show;
		var hid = ta.mark.hid;
		ta = ta.ta;
		for (var i=0; i<obj.data.length; i++) {
			var p = ta.calcPositionByTime (LZR.Util.Date.getDate( obj.data[i].time ));
			if (p>=0 && p<ta.timeLong) {
				p = ta.calcPixByPosition (p);
				var d = document.createElement("div");
				LZR.HTML5.Util.Css.addClass (d, obj.markClass);
				d.style.backgroundColor = obj.data[i].color;
				d.style.left = p;
				ta.cover.appendChild(d);

				// 鼠标事件
				d.onmouseover = LZR.bind(this, show, obj.data[i], p);
				d.onmouseout = LZR.bind(this, hid);
			}
		}
	}
};
*/
