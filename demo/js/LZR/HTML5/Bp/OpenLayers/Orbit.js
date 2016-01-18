// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/OpenLayers/Orbit.js" ]);

// ----------- 轨迹图 ------------

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

		// 轨迹数据
		this.initData(obj.data);

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
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.version = "0.0.3";

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
				this.ctx = evt.context;
				this.canvas = this.ctx.canvas;
				var s = this.title.style;
				s.visibility = "hidden";
				s.position = "relative";

				s = this.map.getTargetElement();
				s.appendChild(this.title);
				this.mapW = s.scrollWidth;	// 容器宽度
				this.mapH = s.scrollHeight;	// 容器高度
				this.titleObi = -1;	// DIV所在的轨迹
				this.titleNdi = -1;	// DIV所在的节点
			}
			if (this.flush (evt.context)) {
				this.map.render();
			}
		}));

		this.map.addLayer (this.layer);
	}
};

// 刷新画布
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.flush = function (ctx) {
	var r = this.map.getView().getResolution();
	this.calcNodeWidth(r);
	this.orbitOverIndex = -1;
	this.nodeOverIndex = -1;
	var doRender = false;
	for (var i=0; i<this.data.length; i++) {
		if (this.data[i].visible) {
			doRender = true;
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
						s.top = (this.curentPosition[1] - this.mapH) + "px";
						this.onShowTitle (this.title, nodes[this.titleNdi], this.titleObi, this.titleNdi);
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

	if (doRender) {
		// 画原点动画
		this.drawSource (ctx);

		// 隐藏DIV
		if (this.titleNdi !== -1 && this.nodeOverIndex === -1) {
			this.titleObi = -1;
			this.titleNdi = -1;
			this.title.style.visibility = "hidden";
		}
	}

	return doRender;
};

// 整理轨迹数据
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.initData = function (data) {
	this.data = [];
	this.ap = [];	// 动画参数
	if (data) {
		for (var i = 0; i<data.length; i++) {
			var d = {};
			d.visible = true;
			d.zlevel = data[i].zlevel;
			d.nodes = [];
			var c = data[i].grdCollection;
			for (var j=0; j<c.length; j++) {
				var n = {};
				for (var k in c[j]) {
					n[k] = c[j][k];
				}
				n.lon = c[j].x;
				n.lat = c[j].y;

				// 计算线条的真实角度
				if (j>0) {
					var pn = d.nodes[j-1];
					var y = n.y-pn.y;
					var x = n.x-pn.x;
					pn.lineAngle = Math.asin( y / Math.sqrt(y*y + x*x) );
					if (x<0) {
						pn.lineAngle = Math.PI - pn.lineAngle;
					}
				}

				d.nodes.push(n);
			}
			this.data.push(d);

			// 动画参数
			this.ap.push(0);
		}
	}
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
	ctx.beginPath();
	for (var i=0; i<nodes.length-1; i++) {
		// ctx.arc(nodes[i].x, nodes[i].y, 10, 0, Math.PI);
		var p = this.gp.calcTransform(nodes[i].lineAngle, 1, 1, nodes[i].x, nodes[i].y);
		ctx.setTransform(p[0], p[1], p[2], p[3], p[4], p[5]);
		ctx.moveTo(0, w);
		ctx.arc(0, 0, w, Math.PI/2,  3*Math.PI/2);
		ctx.lineTo(nodes[i].lineLong, -w);
		ctx.arc(nodes[i].lineLong, 0, w, -Math.PI/2,  Math.PI/2);
		ctx.closePath();
	}
	ctx.fill();
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
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.drawSource = function (ctx) {
	var x, y, r, nodes = this.data[0].nodes;
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
	var o = this.data[index];
	if (o) {
		o.visible = visible;
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

// 通过经纬度计算画布像素点（接口）
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.calcPixel = function (lon, lat) {
	return this.map.getPixelFromCoordinate( ol.proj.fromLonLat ([lon, lat]) );
};

// 提示框显示事件（接口）
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.onShowTitle = function (div, data, i, j) {};

