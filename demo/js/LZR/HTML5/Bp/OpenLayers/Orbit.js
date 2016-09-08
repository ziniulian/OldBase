// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/OpenLayers/Orbit.js" ]);

// ----------- ------------

if (! window.ol) {
	LZR.HTML5.loadJs([
		LZR.HTML5.jsPath + "HTML5/expand/ol3/ol.js"
	]);
	LZR.HTML5.loadCss([
		LZR.HTML5.jsPath + "HTML5/expand/ol3/ol.css"
	]);
}
LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/Graphics.js"
]);
LZR.HTML5.Bp.OpenLayers.Orbit = function (obj) {
	/*
		参数说明：
			{
				map :,	// openLayers_Map（必填）
				data :,	// 轨迹数据

				sourceColor : ,	// 原点波纹颜色
				sourceSize :,		// 原点波纹大小
				sourceWidth :,	// 原点波纹粗细
				sourceSpeed :,	// 原点波纹速度（0~1之间）

				orbitAnimationColor :,	// 轨迹动画颜色（文字/数组）
				orbitShadowColor :,	// 轨迹阴影颜色（文字/数组）
				orbitColor :,	// 轨迹颜色（文字/数组）
				orbitBlur: ,	// 轨迹阴影级别
				orbitScale :,	// 轨迹相对节点大小的比例
				orbitSpeed :,	// 轨迹动画播放速度（0~1之间）

				nodeShadowColor: ,	// 节点阴影颜色（文字/数组）
				nodeColor: ,	// 节点颜色（文字/数组）
				nodeBlur: ,	// 节点阴影级别
				nodeScale: ,	// 节点大小比例
				nodeMax: ,	// 节点最大边长
				nodeMin: ,	// 节点最小边长

				showNode :,	// 首尾节点的显示（0：显示所有节点；1：第一个节点不显示；2：最后一个节点不显示）
				title: ,		// 提示容器
				titleArea: ,	// 提示框显示判断范围
			}
	*/
	if (obj.map) {
		// openLayers_Map
		this.map = obj.map;

		// 颜色参数
		this.clrStr = {
			"0": "245,255,255",
			"3.5": "210,255,255",
			"7.0": "190,255,255",
			"10.5": "150,243,255",
			"14.0": "131,232,255",
			"17.5": "74,221,255",
			"21.0": "26,212,255",
			"24.5": "0,195,255",
			"28.0": "0,202,255",
			"31.5": "0,220,220",
			"35.0": "0,232,190",
			"39.0": "0,230,175",
			"43.0": "0,230,140",
			"47.0": "0,230,110",
			"51.0": "0,230,80",
			"55.0": "0,230,60",
			"59.0": "0,230,50",
			"63.0": "0,230,0",
			"67.0": "30,230,0",
			"71.0": "100,235,0",
			"75.0": "180,240,0",
			"79.0": "220,250,0",
			"83.0": "255,255,0",
			"87.0": "255,250,0",
			"91.0": "255,245,0",
			"95.0": "255,242,0",
			"99.0": "255,240,0",
			"103.0": "255,238,0",
			"107.0": "255,235,0",
			"111.0": "255,230,0",
			"115.0": "255,220,0",
			"118.5": "255,200,0",
			"122.0": "255,190,0",
			"125.5": "255,185,0",
			"129.0": "255,180,0",
			"132.5": "255,175,0",
			"136.0": "255,170,0",
			"139.5": "255,165,0",
			"143.0": "255,145,0",
			"146.5": "255,115,0",
			"150.0": "255,95,0",
			"160.0": "255,70,0",
			"170.0": "255,20,0",
			"180.0": "255,0,0",
			"190.0": "245,0,0",
			"200.0": "247,0,0",
			"210.0": "249,0,0",
			"220.0": "250,0,0",
			"230.0": "252,0,0",
			"240.0": "240,0,20",
			"250.0": "240,0,50",
			"260.0": "220,0,100",
			"270.0": "200,0,145",
			"280.0": "180,0,150",
			"290.0": "160,0,150",
			"300.0": "150,0,150",
			"310.0": "140,0,160",
			"320.0": "135,0,160",
			"330.0": "130,0,160",
			"340.0": "125,0,160",
			"350.0": "120,0,160",
			"10000.0": "110,0,160"
		};

		// 轨迹数据
		// this.initData(obj.data);
		this.initData(obj.data, this.clrStr);

		// 原点波纹颜色
		if (obj.sourceColor) {
			this.sourceColor = obj.sourceColor;
		} else {
			this.sourceColor = "red";
		}

		// 原点波纹大小
		if (obj.sourceSize) {
			this.sourceSize = obj.sourceSize;
		} else {
			this.sourceSize = 20;
		}

		// 原点波纹粗细
		if (obj.sourceWidth) {
			this.sourceWidth = obj.sourceWidth;
		} else {
			this.sourceWidth = 2;
		}

		// 原点波纹速度（0~1之间）
		if (obj.sourceSpeed) {
			this.sourceSpeed = obj.sourceSpeed;
		} else {
			this.sourceSpeed = 0.01;
		}

		// 轨迹动画颜色
		this.orbitAnimationColor = this.initColor(obj.orbitAnimationColor);

		// 轨迹阴影颜色
		this.orbitShadowColor = this.initColor(obj.orbitShadowColor);

		// 轨迹颜色
		this.orbitColor = this.initColor(obj.orbitColor);

		// 调整轨迹名称颜色
		this.setNamLayerClr();

		// 轨迹阴影级别
		if (obj.orbitBlur) {
			this.orbitBlur = obj.orbitBlur;
		} else {
			this.orbitBlur = 20;
		}

		// 轨迹相对节点大小的比例
		if (obj.orbitScale) {
			this.orbitScale = obj.orbitScale;
		} else {
			this.orbitScale = 0.5;
		}

		// 轨迹动画播放速度（0~1之间）
		if (obj.orbitSpeed) {
			this.orbitSpeed = obj.orbitSpeed;
		} else {
			this.orbitSpeed = 0.01;
		}

		// 节点阴影颜色（文字/数组）
		if (obj.nodeShadowColor) {
			this.nodeShadowColor = obj.nodeShadowColor;
		} else {
			this.nodeShadowColor = this.orbitShadowColor;
		}

		// 节点颜色（文字/数组）
		if (obj.nodeColor) {
			this.nodeColor = obj.nodeColor;
		} else {
			this.nodeColor = this.orbitColor;
		}

		// 节点阴影级别
		if (obj.nodeBlur) {
			this.nodeBlur = obj.nodeBlur;
		} else {
			this.nodeBlur = this.orbitBlur;
		}

		// 节点大小比例
		if (obj.nodeScale) {
			this.nodeScale = obj.nodeScale;
		} else {
			this.nodeScale = 3000;
		}

		// 节点最大边长
		if (obj.nodeMax) {
			this.nodeMax = obj.nodeMax;
		} else {
			this.nodeMax = 8;
		}

		// 节点最小边长
		if (obj.nodeMin) {
			this.nodeMin = obj.nodeMin;
		} else {
			this.nodeMin = 6;
		}

		// 首尾节点的显示
		if (obj.showNode) {
			this.setShowNode (obj.showNode);
		} else {
			this.setShowNode (0);
		}

		// 提示容器
		if (obj.title) {
			this.title = obj.title;
		} else {
			this.title = document.createElement("div");
		}

		// 提示框显示判断范围
		if (obj.titleArea) {
			this.titleArea = obj.titleArea;
		} else {
			this.titleArea = 0;
		}

		// 鼠标当前位置
		this.curentPosition = [-1, -1];

		// 鼠标经过的轨迹序号
		this.orbitOverIndex = -1;

		// 鼠标经过的节点序号
		this.nodeOverIndex = -1;

		// 图层
		this.layer = null;

		// 画布
		this.canvas = null;

		// 绘图环境
		this.ctx = null;

		// 图形学相关算法
		this.gp = new LZR.Util.Graphics ();
	}
};
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.className = "LZR.HTML5.Bp.OpenLayers.Orbit";
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.version = "0.0.7";

// 初始化随机颜色
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.initColor = function (objColor) {
	var i=0, c;
	var cs = [];
	if (objColor) {
		if (LZR.HTML5.Util.getClassName (objColor) == "string") {
			for (i=0; i<this.data.length; i++) {
				cs.push(objColor);
			}
			return cs;
		} else {
			cs = objColor;
			i = cs.length;
			if (isNaN(i)) {
				i = 0;
			}
		}
	}

	// 生成随机颜色
	for (; i<this.data.length; i++) {
		c = "rgba(" + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ", 1)";
		cs.push(c);
	}
	return cs;
};

// 初始化
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.init = function () {
	// 创建图层
	if (this.layer === null) {
		this.layer = new ol.layer.Image({
			source: new ol.source.ImageStatic({
				url: "",
				imageExtent: [0, 0, 0, 0]
			})
		});

		// 抓取当前鼠标位置
		this.map.on ("pointermove", LZR.bind (this, function(evt) {
			this.curentPosition = evt.pixel;
		}));

		// 循环动画
		this.layer.on("postcompose", LZR.bind (this, function(evt) {
			if (this.ctx === null) {
				// 创建内容提示区
				// this.ctx = evt.context;
				// this.canvas = this.ctx.canvas;

				this.canvas = document.createElement("canvas");
				var port = this.map.getViewport();
				port.insertBefore(this.canvas, port.childNodes[1]);
				this.canvas.style.width = "100%";
				this.canvas.style.height = "100%";
				this.canvas.style.position = "absolute";
				this.canvas.style.top = "0";
				this.canvas.style.left = "0";
				this.canvas.width = this.canvas.clientWidth;
				this.canvas.height = this.canvas.clientHeight;
				LZR.HTML5.Util.Event.addEvent (window, "resize", LZR.bind(this, function () {
					this.canvas.width = this.canvas.clientWidth;
					this.canvas.height = this.canvas.clientHeight;
				}), false);
				this.ctx = this.canvas.getContext("2d");

				var s = this.title.style;
				s.visibility = "hidden";
				s.position = "relative";

				s = this.map.getTargetElement();
				s.appendChild(this.title);
				this.mapW = s.scrollWidth;	// 容器宽度
				this.mapH = s.scrollHeight;	// 容器高度
				this.titleObi = -1;	// DIV所在的轨迹
				this.titleNdi = -1;	// DIV所在的节点
				this.mouseObi = -1;	// 鼠标所在的轨迹
			}
			if (this.flush (this.ctx)) {
				this.map.render();
			}
		}));

		this.map.addLayer (this.layer);
	}
};

// 刷新画布
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.flush = function (ctx) {
	ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	var r = this.map.getView().getResolution();
	this.calcNodeWidth(r);
	this.orbitOverIndex = -1;
	this.nodeOverIndex = -1;
	var doRender = -1;
	for (var i=0; i<this.data.length; i++) {
		if (this.data[i].visible) {
			doRender = i;
			var nodes = this.data[i].nodes;
			this.calcData (nodes, r);

			// 画轨迹
			this.drawOrbitPath (nodes, ctx, i);

			// 计算鼠标是否经过节点
			this.calcNode (nodes, ctx, i);

			if (this.orbitOverIndex === i) {
				// 画节点
				this.drawNode (nodes, ctx, i);

				// 显示DIV
				if (this.nodeOverIndex >= 0) {
					if (this.titleObi !== this.orbitOverIndex || this.titleNdi !== this.nodeOverIndex) {
						this.titleObi = this.orbitOverIndex;
						this.titleNdi = this.nodeOverIndex;
						var s = this.title.style;
						s.left = this.curentPosition[0] + "px";
						s.top = (this.curentPosition[1] - this.canvas.height) + "px";
						// this.onShowTitle (this.title, nodes[this.titleNdi], this.titleObi, this.titleNdi);
						this.onShowTitle (this.title, this.oldDat[this.titleObi].points[this.titleNdi], this.titleObi, this.titleNdi);
						if (s.visibility === "hidden") {
							s.visibility = "visible";
						}
					}
				}

			} else {
				// 动画下一帧
				this.ap[i] += this.orbitSpeed;
				if (this.ap[i] > 1) {
					this.ap[i] = 0;
				}
			}

			// 画轨迹动画
			this.drawOrbit (nodes, ctx, i);
		}
	}

	if (doRender !== -1) {
		// 画原点动画
		this.drawSource (ctx, doRender);

		// 隐藏DIV
		if (this.titleNdi !== -1 && this.nodeOverIndex === -1) {
			// this.onHidTitle (this.title, this.data[this.titleObi].nodes[this.titleNdi], this.titleObi, this.titleNdi);
			this.onHidTitle (this.title, this.oldDat[this.titleObi].points[this.titleNdi], this.titleObi, this.titleNdi);
			this.titleObi = -1;
			this.titleNdi = -1;
			this.title.style.visibility = "hidden";
		}

		// 触发鼠标经过/移开事件
		if (this.orbitOverIndex === -1) {
			if (this.mouseObi !== -1) {
// console.log ("out - " + this.mouseObi);
				this.onMouseOut(this.mouseObi);
				this.mouseObi = -1;
			}
		} else {
			if (this.mouseObi !== this.orbitOverIndex) {
				if (this.mouseObi !== -1) {
// console.log ("out - " + this.mouseObi);
					this.onMouseOut(this.mouseObi);
				}
// console.log ("in - " + this.orbitOverIndex);
				this.onMouseOver(this.orbitOverIndex);
				this.mouseObi = this.orbitOverIndex;
			}
		}

		return true;
	} else {
		return false;
	}
};

// 整理轨迹数据
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.initData = function (data, clrs) {
	if (clrs) {
		this.clrStr = clrs;
	}

	this.crtNamLayer(data);
	this.oldDat = data;
	this.data = [];
	this.ap = [];	// 动画参数
	if (data) {
		for (var i = 0; i<data.length; i++) {
			var d = {};
			d.visible = true;
			// d.zlevel = data[i].zlevel;
			d.zlevel = data[i];
			d.nodes = [];
			var c = data[i].points;
			for (var j=0; j<c.length; j++) {
				var n = {};
				for (var k in c[j]) {
					n[k] = c[j][k];
				}
				n.lon = c[j].lon;
				n.lat = c[j].lat;

				// 计算线条的真实角度
				if (j>0) {
					var pn = d.nodes[j-1];
					var y = n.lat-pn.lat;
					var x = n.lon-pn.lon;
					pn.lineAngle = Math.asin( y / Math.sqrt(y*y + x*x) );
					if (x<0) {
						pn.lineAngle = Math.PI - pn.lineAngle;
					}
				}

				// 添加污染物信息
				if (clrs && c[j].values) {
					n.fom = {
						val: c[j].values[0],
						// clr: "rgba(" + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ", 1)"
						// clr: "yellow"
						clr: this.getClrByStr(c[j].values[0])
					};
				}

				d.nodes.push(n);
			}
			this.data.push(d);

			// 动画参数
			this.ap.push(0);
		}
	}
};

// 创建名字图层
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.crtNamLayer = function (dat) {
	var i;
	if (this.namLayer) {
		for (i=0; i<this.namLayer.length; i++) {
			this.map.removeOverlay(this.namLayer[i]);
		}
	}
	this.namLayer = [];
	if (dat) {
		for (i=0; i<dat.length; i++) {
			if (dat[i].name) {
				var mark = document.createElement("div");
				var namDiv = document.createElement("div");
				mark.style.position = "relative";
				mark.appendChild(namDiv);
				namDiv.className = "Lc_oldBase_Orbit_namLayer";
				namDiv.innerHTML = dat[i].name;
				var pi;
				switch (this.showNode) {
					case 2:
						pi = 0;
						break;
					default:
						pi = dat[i].points.length-1;
						break;
				}
				var p = ol.proj.fromLonLat([dat[i].points[pi].lon, dat[i].points[pi].lat]);
				var marker = new ol.Overlay({
					position: p,
					// positioning: "center-center",
					// positioning: "bottom-left",
					positioning: "bottom-center",
					element: mark,
					stopEvent: false
				});
				this.map.addOverlay(marker);
				this.namLayer.push(marker);
			}
		}
	}
};

// 根据AQI值获取颜色
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.getClrByAQI = function (v) {
	if (v<0) {
		return "rgba(0,0,0,0)";
	} else if (v<=50) {
		return "rgba(0,228,0,1)";
	} else if (v<=100) {
		return "rgba(255,255,0,1)";
	} else if (v<=150) {
		return "rgba(255,126,0,1)";
	} else if (v<=200) {
		return "rgba(255,0,0,1)";
	} else if (v<=300) {
		return "rgba(153,0,76,1)";
	} else if (v<=500) {
		return "rgba(126,0,35,1)";
	} else {
		return "rgba(0,0,0,0)";
	}
};

// 根据浓度值获取颜色
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.getClrByStr = function (v) {
	var ps = null;
	for (var s in this.clrStr) {
		if (v < s) {
			if (ps) {
				return "rgba(" + this.clrStr[ps] + ",1)";
			} else {
				return "rgba(0,0,0,0)";
			}
		}
		ps = s;
	}
	return "rgba(" + this.clrStr[ps] + ",1)";
};

// 计算节点边长
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.calcNodeWidth = function (r) {
	this.nodeWidth = this.nodeScale / r;
	if (this.nodeWidth > this.nodeMax) {
		this.nodeWidth = this.nodeMax;
	} else if (this.nodeWidth < this.nodeMin) {
		this.nodeWidth = this.nodeMin;
	}
};

// 计算轨迹数据的像素值
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.calcData = function (nodes, r) {
	var max =0;
	for (var i=0; i<nodes.length; i++) {
		var n = nodes[i];
		var p = this.calcPixel( n.lon, n.lat );
		n.x = p[0];
		n.y = p[1];
		n.u = n.su / r * this.windScale;
		n.v = n.sv / r * this.windScale;

		// 计算线条的真实角度
		if (i>0) {
			var pn = nodes[i-1];
			var y = n.y-pn.y;
			var x = n.x-pn.x;
			pn.lineLong = Math.sqrt(y*y + x*x);
			pn.lineAngle = Math.asin( y / pn.lineLong );
			if (x<0) {
				pn.lineAngle = Math.PI - pn.lineAngle;
			}

			if (pn.lineLong > max) {
				max = pn.lineLong;
			}
		}
	}
	nodes.max = max;
};

// 画轨迹
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.drawOrbitPath = function (nodes, ctx, index) {
	var w = this.nodeWidth * this.orbitScale;

	ctx.save();
	ctx.fillStyle = this.orbitColor[index];
	ctx.shadowColor = this.orbitShadowColor[index];
	ctx.shadowBlur = this.orbitBlur;
	for (var i=0; i<nodes.length-1; i++) {
		ctx.beginPath();

		// ctx.arc(nodes[i].x, nodes[i].y, 10, 0, Math.PI);
		var p = this.gp.calcTransform(nodes[i].lineAngle, 1, 1, nodes[i].x, nodes[i].y);
		ctx.setTransform(p[0], p[1], p[2], p[3], p[4], p[5]);
		ctx.moveTo(0, w);
		ctx.arc(0, 0, w, Math.PI/2,  3*Math.PI/2);
		ctx.lineTo(nodes[i].lineLong, -w);
		ctx.arc(nodes[i].lineLong, 0, w, -Math.PI/2,  Math.PI/2);
		ctx.closePath();

		// 渐变色
		if (nodes[i].fom) {
			var grd=ctx.createLinearGradient(0,0,nodes[i].lineLong,0);
			grd.addColorStop(0, nodes[i].fom.clr);
			grd.addColorStop(1, nodes[i+1].fom.clr);
			ctx.shadowBlur = 0;
			ctx.fillStyle = grd;
		}
		ctx.fill();
	}
	ctx.restore();

	// 判断轨迹是否经过
	if ( this.orbitOverIndex === -1 && ctx.isPointInPath(this.curentPosition[0], this.curentPosition[1]) ) {
		this.orbitOverIndex = index;
	}
};

// 判断轨迹是否经过节点
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.calcNode = function (nodes, ctx, index) {
	var r = this.nodeWidth + this.titleArea;
	var a = 2*Math.PI;
	for (var i=0; i<nodes.length; i++) {
		ctx.beginPath();
		ctx.arc(nodes[i].x, nodes[i].y, r, 0, a);
		if ( (this.orbitOverIndex === -1 || this.orbitOverIndex === index) && ctx.isPointInPath(this.curentPosition[0], this.curentPosition[1]) ) {
			this.orbitOverIndex = index;
			this.nodeOverIndex = i;
			return;
		}
	}
};

// 画节点
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.drawNode = function (nodes, ctx, index) {
	var s=0, e=nodes.length;
	switch (this.showNode) {
		case 1:
			s ++;
			break;
		case 2:
			e --;
			break;
	}

	var r = this.nodeWidth;
	var a = 2*Math.PI;

	ctx.save();
	ctx.fillStyle = this.nodeColor[index];
	ctx.shadowColor = this.nodeShadowColor[index];
	ctx.shadowBlur = this.nodeBlur;
	ctx.beginPath();
	for (var i=s; i<e; i++) {
		ctx.arc(nodes[i].x, nodes[i].y, r, 0, a);
		ctx.closePath();
	}
	ctx.fill();
	ctx.restore();
};

// 画轨迹动画
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.drawOrbit = function (nodes, ctx, index) {
	ctx.save();
	ctx.fillStyle = this.orbitAnimationColor[index];
	ctx.shadowColor = this.orbitShadowColor[index];
	ctx.shadowBlur = this.orbitBlur;
	ctx.beginPath();
	for (i=1; i<nodes.length; i++) {
		var x = (nodes[i].x - nodes[i-1].x) * this.ap[index] + nodes[i-1].x;
		var y = (nodes[i].y - nodes[i-1].y) * this.ap[index] + nodes[i-1].y;
		var s = nodes[i-1].lineLong/nodes.max*0.8;
		if (s<0.2) {
			s = 0.2;
		}
		s *= this.nodeWidth;
		var p = this.gp.calcTransform(nodes[i-1].lineAngle, s, s, x, y);
		ctx.setTransform(p[0], p[1], p[2], p[3], p[4], p[5]);

		// 画箭头
		ctx.moveTo(0, 0);
		ctx.lineTo(-1, 1);
		ctx.lineTo(3, 0);
		ctx.lineTo(-1, -1);
		ctx.closePath();
	}
	ctx.fill();
	ctx.restore();
};

// 画原点动画
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.drawSource = function (ctx, doRender) {
	var x, y, r, nodes = this.data[doRender].nodes;
	switch (this.showNode) {
		case 2:
			r = nodes.length - 1;
			x = nodes[r].x;
			y = nodes[r].y;
			if (this.apSource < 0.05) {
				this.apSource = 1;
			}
			break;
		default:
			x = nodes[0].x;
			y = nodes[0].y;
			if (this.apSource > 1) {
				this.apSource = 0.05;
			}
			break;
	}
	r = this.sourceSize * this.apSource;

	ctx.save();
	ctx.lineWidth = this.sourceWidth;
	ctx.strokeStyle = this.sourceColor;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2*Math.PI);
	ctx.stroke();
	ctx.restore();

	this.apSource += this.sourceSpeed;
};

// 设置轨迹是否可见
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.setVisible = function (index, visible) {
	var n = this.namLayer[index];
	var o = this.data[index];
	if (o) {
		o.visible = visible;
	}
	if (n) {
		n.getElement().style.visibility = visible?"visible":"hidden";
	}
	if (visible) {
		this.map.render();
	}
};

// 设置首尾节点的显示
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.setShowNode = function (n) {
	this.showNode = n;

	// 原点动画参数设置
	if (this.showNode === 2) {
		this.apSource = 1;
		if (this.sourceSpeed > 0) {
			this.sourceSpeed *= -1;
		}
	} else {
		this.apSource = 0;
		if (this.sourceSpeed < 0) {
			this.sourceSpeed *= -1;
		}
	}
};

// 调整轨迹名称颜色
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.setNamLayerClr = function () {
	var i;
	for (i=0; i<this.orbitColor.length; i++) {
		if (this.namLayer[i]) {
			this.namLayer[i].getElement().style.color = this.orbitColor[i];
		}
	}
};

// 通过经纬度计算画布像素点（接口）
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.calcPixel = function (lon, lat) {
	return this.map.getPixelFromCoordinate( ol.proj.fromLonLat ([lon, lat]) );
};

// 提示框显示事件（接口）
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.onShowTitle = function (div, data, i, j) {};

// 提示框消失事件（接口）
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.onHidTitle = function (div, data, i, j) {};

// 鼠标经过路径事件（接口）
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.onMouseOver = function (i) {};

// 鼠标移开路径事件（接口）
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.onMouseOut = function (i) {};
