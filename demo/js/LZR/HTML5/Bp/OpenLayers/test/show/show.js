
var show = {
	baseClass: 'my-widget',

/*
BUG：
	1. 时间轴播放时忽略排序
	2. 地图与列表锁定
	3. 城市模块显示及切换放置在列表下排
*/






	init: function() {
		LZR.HTML5.Util.Css.addClass (map, this.baseClass);

		// my_widget_date.value = this.timeToFomQryString(this.addHour(-24)).substring(0, 10);
		my_widget_date.value = "2015-11-10";
		LZR.HTML5.Util.Event.addEvent (my_widget_date, "change", hw.bind(this, function() {
			this.md.m_time.productTime.set(LZR.Util.Date.getDate(my_widget_date.value + " " + my_widget_tim.value));
		}), false);
		LZR.HTML5.Util.Event.addEvent (my_widget_tim, "change", hw.bind(this, function() {
			this.md.m_time.productTime.set(LZR.Util.Date.getDate(my_widget_date.value + " " + my_widget_tim.value));
		}), false);
		LZR.HTML5.Util.Event.addEvent (my_widget_mod, "change", hw.bind(this, function() {
			this.md.mod.set(my_widget_mod.value);
		}), false);

		this.buildModel();
		this.buildTimeAxis();

		this.oldz = this.map.getView().getZoom();
		this.zoomBase = 11;
		this.map.on('moveend', hw.bind (this, this.zoomChange));

		this.aj = new LZR.HTML5.Util.Ajax ();
		this.getStations();
// this.testCount();
	},

	buildModel: function() {
		this.md = new hw.HTML5.Project.Bp.StationInfo.Model ({
			map: this.map
		});

		this.md.m_data = {
			p: {},
			c: {},
			s: {},
		};

		this.md.cur = {
			station: new hw.Base.ValCtrl()
		};
		this.md.cur.station.setEventObj (this);
		this.md.cur.station.event.change.append(this.selectedStation);
		this.md.m_time.productTime.setEventObj (this);
		this.md.m_time.productTime.event.change.append(this.changeTim);

		this.md.mod.setEventObj (this);
		this.md.mod.event.change.append(this.changeMod);

		this.md.ctrl = document.createElement("div");
		LZR.HTML5.Util.Css.addClass (this.md.ctrl, "left");
		map.appendChild(this.md.ctrl);

		this.md.ctrl.date = my_widget_date;
		this.md.ctrl.tim = my_widget_tim;
		this.md.ctrl.mod = my_widget_mod;
		this.md.ctrl.date.out = my_widget_dateOut;
		this.md.ctrl.tim.out = my_widget_timOut;
		this.md.ctrl.mod.out = my_widget_modOut;

		this.md.ctrl.appendChild(this.md.ctrl.tim.out);
		this.md.ctrl.appendChild(this.md.ctrl.date.out);
		this.md.ctrl.appendChild(this.md.ctrl.mod.out);

		this.md.ctrl.bar = my_widget_selectBar;
		this.md.ctrl.bar.city = my_widget_city;
		this.md.ctrl.bar.primary = my_widget_primary;
		this.md.ctrl.bar.level = my_widget_level;
		this.md.ctrl.bar.order = my_widget_order;
		my_widget_order.value = "stb";
		LZR.HTML5.Util.Event.addEvent (my_widget_city, "change", hw.bind(this, this.selectChange, my_widget_city), false);
		LZR.HTML5.Util.Event.addEvent (my_widget_primary, "change", hw.bind(this, this.selectChange, my_widget_primary), false);
		LZR.HTML5.Util.Event.addEvent (my_widget_level, "change", hw.bind(this, this.selectChange, my_widget_level), false);
		LZR.HTML5.Util.Event.addEvent (my_widget_order, "click", hw.bind(this, this.selectOrder, my_widget_order), false);
		this.md.ctrl.appendChild(this.md.ctrl.bar);

		this.md.ctrl.stations = document.createElement("div");
		LZR.HTML5.Util.Css.addClass (this.md.ctrl.stations, "stations");
		var d = document.createElement("div");
		d.style.marginBottom = "10px";
		this.md.ctrl.stations.appendChild(d);
		this.md.ctrl.stations.inDiv = d;
		this.md.ctrl.appendChild(this.md.ctrl.stations);
	},

	initAfter: function() {
		for (var i in this.md.m_data.c) {
			s = this.md.m_data.c[i];
			var op = document.createElement("option");
			op.value = i;
			op.innerHTML = s.name;
			op.className = "selectOption";
			this.md.ctrl.bar.city.appendChild(op);
		}
		for (var s in this.md.m_data.s) {
			this.md.ctrl.stations.inDiv.appendChild(this.md.m_data.s[s].ctrl.out);
		}
		this.getFom();
	},

	// 错误处理
	handleError: function() {
		alert("error");
	},

	// 获取地图服务路径
	getGeoServerUrl: function() {
		var url = this.appConfig.map.geoServerUrl;
		url += "/";
		url += this.appConfig.map.operateLayer.workspaceName;
		url += "/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=";
		url += this.appConfig.map.operateLayer.workspaceName;
		url += ":";
		url += this.appConfig.map.operateLayer.stationLayerName;
		url += "&outputFormat=text/javascript&srsname=EPSG:3857";
		return url;
	},

	// 获取所有站点
	getStations: function() {
		this.aj.get("data/Stations", hw.bind(this, this.handleStations));
	},

	// 处理站点
	handleStations: function(txt) {
		var data = JSON.parse(txt);
		var s, md = this.md;
		var sdClass = hw.HTML5.Project.Bp.StationInfo.Model;
		var pLevel = sdClass.prototype.LEVEL;
		var cLevel = pLevel.city;
		var sLevel = pLevel.point;
		pLevel = pLevel.province;
		sdClass = sdClass.SpatialData;

		for (var i=0; i<data.features.length; i++) {
			s = new sdClass ({
				id: data.features[i].properties.stationcode,
				name: data.features[i].properties.stationname,
				level: sLevel,
				geoJson: data.features[i].geometry.coordinates,
				pro: data.features[i].properties
			});
			s.visible = new hw.Base.ValCtrl();
			md.m_data.s[s.id.val] = s;
			s.changeStyle = this.changeStyle;

			var pid = s.pro.provincename;
			var p = md.children[pid];
			if (!p) {
				p = new sdClass ({
					id: pid,
					name: pid,
					level: pLevel
				});
				md.m_data.p[pid] = p;
				md.append(p);
				this.createCtrl(p);
			}

			var cid = s.pro.citycode;
			var c = p.children[cid];
			if (!c) {
				c = new sdClass ({
					id: cid,
					name: s.pro.cityname,
					level: cLevel
				});
				md.m_data.c[cid] = c;
				p.append(c);
				this.createCtrl(c);
			}

			c.append(s);
			this.createView(s);
			this.createCtrl(s);
		}
// console.log (md);
		this.initAfter();
	},

	// 生成地图元素
	createView: function (s, css) {
		if (!css) {
			css = "defaultPoint noselect";
		}
		var d = document.createElement("div");
		if (s.parent.val) {
			d.title = s.parent.val.parent.val.name + " - " + s.parent.val.name + " - " + s.name;
		}
		LZR.HTML5.Util.Css.addClass (d, css);

		s.view = new ol.Overlay({
			position: s.geoJson,
			element: d,
			stopEvent: false
		});

		LZR.HTML5.Util.Event.addEvent (d, "mouseover", hw.bind(this, this.mouseover, s), false);
		LZR.HTML5.Util.Event.addEvent (d, "mouseout", hw.bind(this, this.mouseout, s), false);
		LZR.HTML5.Util.Event.addEvent (d, "click", hw.bind(this, this.click, s), false);

		this.map.addOverlay(s.view);
	},

	// 缩放级别样式调整
	zoomChange: function () {
		var s, z = this.map.getView().getZoom();
		if (z >= this.zoomBase && this.oldz < this.zoomBase) {
			this.oldz = z;
			for (s in this.md.m_data.s) {
				LZR.HTML5.Util.Css.addClass (this.md.m_data.s[s].view.getElement(), "defaultBigPoint");
			}
		} else if (this.oldz >= this.zoomBase && z < this.zoomBase) {
			this.oldz = z;
			for (s in this.md.m_data.s) {
				LZR.HTML5.Util.Css.removeClass (this.md.m_data.s[s].view.getElement(), "defaultBigPoint");
			}
		}
	},

	// 生成标签
	createCtrl: function (s) {
		s.ctrl = {
			out: document.createElement("div"),
			title: document.createElement("div"),
			color: document.createElement("div"),
			primary: document.createElement("div"),
			vaue: document.createElement("div")
		};
		LZR.HTML5.Util.Css.addClass (s.ctrl.out, "station");
		LZR.HTML5.Util.Css.addClass (s.ctrl.title, "title");
		LZR.HTML5.Util.Css.addClass (s.ctrl.color, "color");
		LZR.HTML5.Util.Css.addClass (s.ctrl.primary, "memo");
		LZR.HTML5.Util.Css.addClass (s.ctrl.vaue, "memo");

		LZR.HTML5.Util.Event.addEvent (s.ctrl.out, "mouseover", hw.bind(this, this.mouseover, s), false);
		LZR.HTML5.Util.Event.addEvent (s.ctrl.out, "mouseout", hw.bind(this, this.mouseout, s), false);
		LZR.HTML5.Util.Event.addEvent (s.ctrl.out, "click", hw.bind(this, this.click, s), false);

		s.ctrl.title.innerHTML = s.name;
		s.ctrl.primary.innerHTML = "首要污染物：<未知>";
		s.ctrl.vaue.innerHTML = "污染浓度：--";
		s.ctrl.out.appendChild (s.ctrl.title);

		var bot = document.createElement("div");
		s.ctrl.out.appendChild (bot);
		bot.appendChild (s.ctrl.color);

		d = document.createElement("div");
		LZR.HTML5.Util.Css.addClass (d, "memoout");
		bot.appendChild (d);
		d.appendChild (s.ctrl.primary);
		d.appendChild (s.ctrl.vaue);
	},

	// 鼠标经过事件
	mouseover: function (s) {
/*
		if (s.view) {
			LZR.HTML5.Util.Css.addClass (s.view.getElement(), "defaultPoint_hover");
		}
		if (s.ctrl) {
			LZR.HTML5.Util.Css.addClass (s.ctrl.out, "station_hover");
		}
*/
		var locate = true;	// 是否要定位
		if (s.ctrl) {
			var d = s.ctrl.out;
			var p = this.md.ctrl.stations;
			var city = this.md.ctrl.bar.city.value;
			var id = s.parent.val.id.val;
			LZR.HTML5.Util.Css.addClass (d, "station_hover");

			// 城市列表转换
			if (city != "all" && city != id) {
				locate = false;
				this.md.ctrl.bar.city.value = id;
				this.flush();
			}

			var top = d.offsetTop - p.offsetTop;
			// 定位
			if (top - 10 < p.scrollTop) {
				if (p.scrollTop - top > d.clientHeight) {
					locate = false;
				}
				p.scrollTop = top - 10;
			} else {
				var bot = p.scrollTop + p.clientHeight;
				var dbt = top + d.clientHeight + 10;
				if (dbt > bot) {
					if (top > bot) {
						locate = false;
					}
					if (dbt >= p.scrollHeight) {
						dbt = p.scrollHeight-1;
					}
					p.scrollTop = dbt - p.clientHeight;
				}
			}
		}
		if (s.view) {
			var v = s.view.getElement();
			LZR.HTML5.Util.Css.addClass (v, "defaultPoint_hover");
			if (locate) {
				var pad = 0;	// 容差范围
				var a = LZR.HTML5.Util.getDomPositionForDocument (v);
				if (	a.left > map.clientWidth - pad ||
					a.top > map.clientHeight - pad ||
					a.left < pad - a.width ||
					a.top < pad - a.height) {
					this.map.getView().setCenter (s.geoJson);
				}
			}
		}
	},

	// 鼠标移开事件
	mouseout: function (s) {
		if (s.view) {
			LZR.HTML5.Util.Css.removeClass (s.view.getElement(), "defaultPoint_hover");
		}
		if (s.ctrl) {
			LZR.HTML5.Util.Css.removeClass (s.ctrl.out, "station_hover");
		}
	},

	// 鼠标点击事件
	click: function (s) {
		if (this.md.cur.station.val === s) {
			s = null;
		}
		this.md.cur.station.set(s);

		if (s) {
			// 定中心及缩放
			this.map.getView().setCenter (s.geoJson);
			this.map.getView().setZoom (this.zoomBase);
		} else {
			//
		}
	},

	// 站点被选中
	selectedStation: function (s, self, old) {
		if (old) {
			if (old.view) {
				LZR.HTML5.Util.Css.removeClass (old.view.getElement(), "defaultPoint_selected");
			}
			if (old.ctrl) {
				LZR.HTML5.Util.Css.removeClass (old.ctrl.out, "station_selected");
			}
		}
		if (s) {
			if (s.ctrl) {
				LZR.HTML5.Util.Css.addClass (s.ctrl.out, "station_selected");
			}
			if (s.view) {
				LZR.HTML5.Util.Css.addClass (s.view.getElement(), "defaultPoint_selected");
			}
/*
			var locate = true;	// 是否要定位
			if (s.ctrl) {
				var d = s.ctrl.out;
				var p = this.md.ctrl.stations;
				LZR.HTML5.Util.Css.addClass (d, "station_selected");

				// 城市列表转换
				if (!d.scrollWidth) {
					locate = false;
					// 城市列表转换
				}

				// 定位
				if (d.offsetTop - 10 < p.scrollTop) {
					if (p.scrollTop - d.offsetTop > d.clientHeight) {
						locate = false;
					}
					p.scrollTop = d.offsetTop - 10;
				} else {
					var bot = p.scrollTop + p.clientHeight;
					var dbt = d.offsetTop + d.clientHeight + 10;
					if (dbt > bot) {
						if (d.offsetTop > bot) {
							locate = false;
						}
						if (dbt >= p.scrollHeight) {
							dbt = p.scrollHeight-1;
						}
						p.scrollTop = dbt - p.clientHeight;
					}
				}
			}
			if (s.view) {
				var v = s.view.getElement();
				LZR.HTML5.Util.Css.addClass (v, "defaultPoint_selected");
				if (locate) {
					var pad = 20;	// 容差范围
					var a = LZR.HTML5.Util.getDomPositionForDocument (v);
					if (	a.left > map.clientWidth - pad ||
						a.top > map.clientHeight - pad ||
						a.left < pad - a.width ||
						a.top < pad - a.height) {
						this.map.getView().setCenter (s.geoJson);
					}
				}
			}
*/
		}
	},

	// 创建时间轴
	buildTimeAxis: function() {
		this.md.mod.set(this.md.ctrl.mod.value, false);
		this.md.m_time.timeCount.set(7, false);
		this.md.m_time.timeStep.set(3600, false);
		this.md.m_time.timeCurrentIndex.set(0, false);
		this.md.m_time.productTime.set(LZR.Util.Date.getDate(this.md.ctrl.date.value + " " + this.md.ctrl.tim.value), false);
		this.md.m_time.timeStart.set(this.addHour( (24 - parseInt(this.md.ctrl.tim.value, 10)), this.md.m_time.productTime.val ), false);
		// this.md.m_time.timeStart.set(this.normalize(), false);
		// this.md.m_time.timeStart.set(LZR.Util.Date.getDate("2015-11-11"), false);
		// this.md.m_time.productTime.set(this.addHour(-4, this.md.m_time.timeStart.val), false);

		var td = document.createElement("div");
		td.className = "timeAxis";
		map.appendChild(td);
		this.md.m_time.ctrl = new LZR.HTML5.Bp.Util.BpTimeAxis ({
			div: td,
			count: this.md.m_time.timeCount.val,		// 时间刻度数量
			style: 1,		// 风格（0：压线（含最大时间）；1：压中（不含最大时间））
			timeLong: this.md.m_time.timeCount.val * 24,	// 时间长度
			timeStep: this.md.m_time.timeStep.val,	// 时间间隔（秒）
			startTime: this.md.m_time.timeStart.val,
			playSpeed: 50,	// 时间轴播放速度（毫秒）
		});
		this.md.m_time.ctrl.onchange = hw.bind(this, this.timeChange);
		this.md.m_time.ctrl.init();
	},

	// 时间变动
	timeChange: function (time, position) {
		for (var s in this.md.m_data.s) {
			this.md.m_data.s[s].changeStyle (position);
		}
		if (this.md.ctrl.bar.primary.value != "all" || this.md.ctrl.bar.level.value != "all") {
			this.flush();
		}
	},

	// 时间加N个小时的值
	addHour: function (n, time) {
		if (!time) {
			time = new Date();
		}
		time = time.valueOf();
		time += n * 3600 * 1000;
		return new Date(time);
	},

	// 时间精确至小时，忽略 分、秒 值
	normalize: function (time, hour) {
		if (!time) {
			time = new Date();
		}
		if (!hour) {
			hour = 0;
		}
		time.setMinutes(0);
		time.setSeconds(0);
		time.setMilliseconds(0);
		time.setHours(hour);
		return time;
	},

	// 将时间转换为条件查询用字符串
	timeToFomQryString: function (time) {
		var s = time.getFullYear();
		s += "-";
		s += time.getMonth() + 1;
		s += "-";
		s += time.getDate();
		s += " ";
		s += LZR.HTML5.Util.format(time.getHours(), 2, "0");
		s += ":";
		s += LZR.HTML5.Util.format(time.getMinutes(), 2, "0");
		s += ":";
		s += LZR.HTML5.Util.format(time.getSeconds(), 2, "0");
		return s;
	},

	// 获取污染物
	getFom: function() {
		var par = {
			prjName: "v0110",
			modeName: this.md.mod.val,
			areaName: "d0",
			productDate: this.timeToFomQryString (this.md.m_time.productTime.val),
			startDate: this.timeToFomQryString (this.md.m_time.timeStart.val),
			endDate: this.timeToFomQryString ( this.addHour(24 * this.md.m_time.timeCount.val, this.md.m_time.timeStart.val) ),
			target: "aqi,pm25_1h,pm10_1h,o3_1h,so2_1h,no2_1h,co_1h,primary_pollutant,aqi_level",
			dateType: "hour"
		};
		if (par.productDate == "2015-11-10 20:00:00" && par.modeName == "naqpms") {
			this.aj.get("data/Foms", hw.bind(this, this.handleFom));
		} else {
			this.flush();
		}
	},

	// 处理污染物
	handleFom: function(txt) {
		var data = JSON.parse(txt);
		var curtim, cts, ctid;
		var ts = this.md.m_time.timeStart.val.valueOf();
		var tc = this.md.m_time.timeCount.val * 24;
		var tp = this.md.m_time.timeStep.val * 1000;
		var tcur = this.md.m_time.ctrl.ta.getCurrentPosition();
		var m = this.md.m_data.s;

		var getLevelNum = function (num) {
			var r = {
				levelNum: 1
			};
			switch (true) {
				case num > 300:
					r.levelNum = 6;
					break;
				case num > 200:
					r.levelNum = 5;
					break;
				case num > 150:
					r.levelNum = 4;
					break;
				case num > 100:
					r.levelNum = 3;
					break;
				case num > 50:
					r.levelNum = 2;
					break;
			}
			return r;
		};

		for (var i=0; i<data.length; i++) {
			var d = data[i];
			if (cts != d.datadate) {
				cts = d.datadate;
				curtim = LZR.Util.Date.getDate( cts.replace(/T/, " ") );
				ctid = (curtim.valueOf() - ts)/tp;
			}
			if (ctid >= 0 && ctid < tc && m[d.code]) {
				var s = m[d.code];
				var fom = new hw.HTML5.Project.Bp.StationInfo.Model.FomInfo ({
					time: curtim,
					aqi: d.aqi
				});
				fom.mainFom = this.getFomName ({primary: this.orderPrimary(d.primary_pollutant)[0]});
				fom.concentration = d[fom.mainFom.key];
				fom.level = d.aqi_level;
				fom.memo = getLevelNum(fom.aqi);
				s.m_fom[ctid] = fom;
				if (ctid == tcur) {
					s.changeStyle (tcur);
				}
			}
		}
// console.log (this.md);

		this.flush();
	},

	// 首要污染物值、数据库关键字、页面显示文字 匹配
	getFomName: function (obj) {
		var v = {
			pm25: {
				key: "pm25_1h",
				primary: "pm2.5",
				html: "PM<sub>2.5<sub>"
			},
			pm10: {
				key: "pm10_1h",
				primary: "pm10",
				html: "PM<sub>10<sub>"
			},
			o3: {
				key: "o3_1h",
				primary: "o3",
				html: "O<sub>3<sub>"
			},
			so2: {
				key: "so2_1h",
				primary: "so2",
				html: "SO<sub>2<sub>"
			},
			no2: {
				key: "no2_1h",
				primary: "no2",
				html: "NO<sub>2<sub>"
			},
			co: {
				key: "co_1h",
				primary: "co",
				html: "CO"
			}
		};
		for (var s in obj) {
			if (obj[s]) {
				for (var f in v) {
					if (v[f][s] == obj[s]) {
						return v[f];
					}
				}
				return null;
			}
		}
		return null;
	},

	// 首要污染物排序
	orderPrimary: function (obj) {
		var order = ["pm2.5", "pm10", "o3", "so2", "no2", "co"];
		var r = [];
		for (var i = 0; i<order.length; i++) {
			if (obj.match(order[i])) {
				r.push(order[i]);
			}
		}
		return r;
	},

	// 空间数据下，根据第 n 个污染物信息设置空间数据样式
	changeStyle: function(position) {
		var s = this;
		var v = s.view.getElement();
		var fl = v.className;
		var fom = fl.indexOf("fomLevel_");
		if (fom > -1) {
			fl = fl.substring(fom, fom + 10);
			LZR.HTML5.Util.Css.removeClass (v, fl);
			LZR.HTML5.Util.Css.removeClass (s.ctrl.color, fl);
		}

		fom = s.m_fom[position];
		if (fom) {
			LZR.HTML5.Util.Css.addClass (v, "fomLevel_" + fom.memo.levelNum);
			LZR.HTML5.Util.Css.addClass (s.ctrl.color, "fomLevel_" + fom.memo.levelNum);
			v.innerHTML = fom.aqi;
			s.ctrl.color.innerHTML = fom.aqi;
			s.ctrl.primary.innerHTML = "首要污染物：" + fom.mainFom.html;
			s.ctrl.vaue.innerHTML = "污染浓度：" + fom.concentration;
		} else {
			// 清空样式
			v.innerHTML = "";
			s.ctrl.color.innerHTML = "";
			s.ctrl.primary.innerHTML = "首要污染物：<未知>";
			s.ctrl.vaue.innerHTML = "污染浓度：--";
		}
	},

	// 模式变更
	changeTim: function(d) {
		this.clreanFomStyle();
		this.md.m_time.timeStart.set( this.addHour( (24 - parseInt(this.md.ctrl.tim.value, 10)), this.md.m_time.productTime.val) );
		this.md.m_time.ctrl.setter("startTime",  this.md.m_time.timeStart.val);
		this.getFom();
	},

	// 产品时间变更
	changeMod: function(m) {
		this.clreanFomStyle();
		this.getFom();
	},

	// 清空污染物信息
	clreanFomStyle: function() {
		for (var sn in this.md.m_data.s) {
			var s = this.md.m_data.s[sn];
			s.changeStyle (-1);
			s.m_fom = [];
		}
	},

	// 列表筛选
	selectChange: function(div) {
		// this.md.m_time.ctrl.stop();
		if (div.value == "all") {
			LZR.HTML5.Util.Css.addClass (div, "selectAll");
		} else {
			LZR.HTML5.Util.Css.removeClass (div, "selectAll");
		}
		this.flush();
	},

	// 列表排序
	selectOrder: function(div) {
		// this.md.m_time.ctrl.stop();
		if (div.value == "stb") {
			div.value = "bts";
			div.title = "从大到小排序";
			div.innerHTML = "▼";
		} else {
			div.value = "stb";
			div.title = "从小到大排序";
			div.innerHTML = "▲";
		}
		this.flush();
	},

	// 刷新列表
	flush: function() {
		// 容器清空
		var div = this.md.ctrl.stations.inDiv;
		var sub, i, j;
		while (sub = div.firstChild, sub) {
			div.removeChild(sub);
		}

		// 筛选并排序
		var a, city = this.md.ctrl.bar.city.value;
		var primary = this.md.ctrl.bar.primary.value;
		var level = this.md.ctrl.bar.level.value;

		if (city == "all") {
			a = this.filte (this.md.m_data.s, primary, level);
		} else {
			a = this.filte (this.md.m_data.c[city].children, primary, level);
		}

		// 塞入容器
		if (this.md.ctrl.bar.order.value == "stb") {
			for (i = 0; i < a.length; i++) {
				if (a[i]) {
					for (j = 0; j < a[i].length; j++) {
						div.appendChild(a[i][j].ctrl.out);
					}
				}
			}
		} else {
			for (i = a.length-1; i >= 0; i--) {
				if (a[i]) {
					for (j = a[i].length-1; j >= 0; j--) {
						div.appendChild(a[i][j].ctrl.out);
					}
				}
			}
		}
	},

	// 筛选器
	filte: function(data, primary, level) {
		var r = [];
		var tcur = this.md.m_time.ctrl.ta.getCurrentPosition();
		for (var i in data) {
			var s = data[i];
			var f = s.m_fom[tcur];
			if ( (level == "all" || level == f.memo.levelNum) && (primary == "all" || primary == f.mainFom.primary) ) {
				if (!r[f.aqi]) {
					r[f.aqi] = [];
				}
				r[f.aqi].push(s);
			}
		}
		return r;
	},
































// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

	// 测试站点数量
	testCount: function() {
		var sdClass = hw.HTML5.Project.Bp.StationInfo.Model;
		var sLevel = sdClass.prototype.LEVEL.point;
		sdClass = sdClass.SpatialData;
		var x = 8300000;
		var y = 7000000;
		var sx = x;
		for (var i=0; i<25; i++) {
			for (var j=0; j<40; j++) {
				var test = new sdClass ({
					name: "test",
					level: sLevel,
					geoJson: [x, y]
				});
				this.createView(test, "defaultTest");
				x += 212500;	// 8500000
			}
			x = sx;
			y -= 160000;	// 4000000
		}
	}

};