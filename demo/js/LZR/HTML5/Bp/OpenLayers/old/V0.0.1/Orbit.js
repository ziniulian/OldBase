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
LZR.HTML5.Bp.OpenLayers.Orbit = function (obj) {
	/*
		参数说明：
			{
				map :,	// openLayers_Map（必填）
				data :,	// 轨迹数据（必填）
				showWind :,	// 是否显示风向
				windColor :,	// 风向颜色
				windScale :,	// 风向大小比例
				nodeColor :,	// 节点颜色
				nodeAnimationColor :,	// 节点动画颜色
				nodeSelectedColor :,	// 节点选中颜色
				nodeScale :,	// 节点大小比例
				nodeMax :,	// 节点最大边长
				nodeMin :,	// 节点最小边长
				nodeLen :,	// 节点动画扩散长度
				nodeSpeed :,	// 节点动画播放速度（0~1之间）
				orbitColor :,	// 轨迹颜色
				orbitAnimationColor :,	// 轨迹动画颜色
				orbitSelectedColor :,	// 轨迹选中颜色
				orbitScale :,	// 轨迹大小比例
				orbitMax :,	// 轨迹最大线宽
				orbitMin :,	// 轨迹最小线宽
				orbitSpeed :,	// 轨迹动画播放速度（0~1之间）

				showNode :,	// 首尾节点的显示（0：显示所有节点；1：第一个节点不显示；2：最后一个节点不显示）
				showAllNode :,	// 是否一直显示节点
			}
	*/
	if (obj.map && obj.data) {
		// openLayers_Map
		this.map = obj.map;

		// 轨迹数据
		this.initData(obj.data);

		// 是否显示风向
		if (obj.showWind) {
			this.showWind = obj.showWind;
		} else {
			this.showWind = false;
		}

		// 风向颜色
		if (obj.windColor) {
			this.windColor = obj.windColor;
		} else {
			this.windColor = "rgba(0, 255, 0, 1)";
		}

		// 风向大小比例
		if (obj.windScale) {
			this.windScale = obj.windScale;
		} else {
			this.windScale = 6000;
		}

		// 节点颜色
		this.nodeColor = this.initColor(obj.nodeColor);
// console.log(this.nodeColor);

		// 节点动画颜色
		this.nodeAnimationColor = this.initColor(obj.nodeAnimationColor);
// console.log(this.nodeAnimationColor);

		// 节点选中颜色
		this.nodeSelectedColor = this.initColor(obj.nodeSelectedColor);
// console.log(this.nodeSelectedColor);

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
			this.nodeMin = 2;
		}

		// 节点动画扩散长度
		if (obj.nodeLen) {
			this.nodeLen = obj.nodeLen;
		} else {
			this.nodeLen = 12;
		}

		// 节点动画播放速度（0~1之间）
		if (obj.nodeSpeed) {
			this.nodeSpeed = obj.nodeSpeed;
		} else {
			this.nodeSpeed = 0.03;
		}

		// 轨迹颜色
		this.orbitColor = this.initColor(obj.orbitColor);
// console.log(this.orbitColor);

		// 轨迹动画颜色
		this.orbitAnimationColor = this.initColor(obj.orbitAnimationColor);
// console.log(this.orbitAnimationColor);

		// 轨迹选中颜色
		this.orbitSelectedColor = this.initColor(obj.orbitSelectedColor);
// console.log(this.orbitSelectedColor);

		// 轨迹大小比例
		if (obj.orbitScale) {
			this.orbitScale = obj.orbitScale;
		} else {
			this.orbitScale = 1000;
		}

		// 轨迹最大线宽
		if (obj.orbitMax) {
			this.orbitMax = obj.orbitMax;
		} else {
			this.orbitMax = 3;
		}

		// 轨迹最小线宽
		if (obj.orbitMin) {
			this.orbitMin = obj.orbitMin;
		} else {
			this.orbitMin = 1;
		}

		// 轨迹动画播放速度（0~1之间）
		if (obj.orbitSpeed) {
			this.orbitSpeed = obj.orbitSpeed;
		} else {
			this.orbitSpeed = 0.05;
		}

		// 首尾节点的显示
		if (obj.showNode) {
			this.showNode = obj.showNode;
		} else {
			this.showNode = 0;
		}

		// 是否一直显示节点
		if (obj.showAllNode) {
			this.showAllNode = obj.showAllNode;
		} else {
			this.showAllNode = false;
		}

		// 鼠标当前位置
		this.curentPosition = [-1, -1];

		// 被选中的轨迹序号
		this.orbitSelectedIndex = -1;

		// 鼠标经过的轨迹序号
		this.orbitOverIndex = -1;

		// 被选中的节点序号
		this.nodeSelectedIndex = -1;

		// 鼠标经过的节点序号
		this.nodeOverIndex = -1;

		// 动画参数
		this.ap = [];
		for (var i=0; i<this.data.length; i++) {
			this.ap[i] = 0;
		}

		// 图层
		this.layer = null;
	}
};
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.className = "LZR.HTML5.Bp.OpenLayers.Orbit";
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.version = "0.0.1";

// 初始化随机颜色
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.initColor = function (objColor) {
	var i, c;
	var cs = [];
	if (objColor) {
		if (LZR.HTML5.Util.getClassName (objColor) == "string") {
			for (i=0; i<this.data.length; i++) {
				cs.push(objColor);
			}
		} else {
			cs = objColor;
			i = cs.length;
			if (isNaN(i)) {
				i = 0;
			}
			for (; i<this.data.length; i++) {
				c = "rgba(" + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ", 1)";
				cs.push(c);
			}
		}
	} else {
		for (i=0; i<this.data.length; i++) {
			c = "rgba(" + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ", 1)";
			cs.push(c);
		}
	}
	return cs;
};

// 初始化
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.init = function () {
	// 创建图层
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
		if (this.flush (evt.context)) {
			this.map.render();
		}
	}));

	this.map.addLayer (this.layer);
};

// 刷新画布
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.flush = function (ctx) {
	var r = this.map.getView().getResolution();
	this.calcOrbitWidth(r);
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
			this.createOrbitPath (nodes, ctx);
			ctx.lineJoin='round';
			ctx.lineWidth = this.orbitWidth;
			if (this.orbitSelectedIndex === i) {
				ctx.strokeStyle = this.orbitSelectedColor[i];
			} else {
				ctx.strokeStyle = this.orbitColor[i];
			}
			ctx.stroke();

			// 判断轨迹是否经过
			if ( this.orbitSelectedIndex !== i && this.orbitOverIndex === -1 && ctx.isPointInPath(this.curentPosition[0], this.curentPosition[1]) ) {
				this.orbitOverIndex = i;
			}

			// 生成节点路径
			this.createNodePath (nodes, ctx, 0);

			// 判断轨迹是否经过
			if ( ctx.isPointInPath(this.curentPosition[0], this.curentPosition[1]) ) {
				if (this.orbitSelectedIndex !== i && this.orbitOverIndex === -1) {
					this.orbitOverIndex = i;
				}
				this.calcNodeIndex (nodes);
			}

			if (this.showAllNode) {
				// 画节点
				this.drawNode (nodes, ctx, this.nodeColor[i]);
			}

			if (this.orbitSelectedIndex === i || this.orbitOverIndex === i) {
				if (!this.showAllNode) {
					// 画节点
					this.drawNode (nodes, ctx, this.nodeColor[i]);
				}

				// 画被选中的节点
				if (this.orbitSelectedIndex === i) {
					var n = nodes[this.nodeSelectedIndex];
					ctx.beginPath();
					ctx.rect(n.x-this.nodeWidth, n.y-this.nodeWidth, 2*this.nodeWidth, 2*this.nodeWidth);
					ctx.fillStyle = this.nodeSelectedColor[i];
					ctx.fill();
				}

				// 画风向
				if (this.showWind) {
					this.drawWind(nodes, ctx);
				}

				// 画节点动画
				if (this.nodeOverIndex >= 0) {
					this.drawNodeAnimation (nodes[this.nodeOverIndex], ctx, i);
				}
			} else {
				// 画轨迹动画
				this.drawOrbit (nodes, ctx, i);
			}

			// 修正动画参数
			if (this.ap[i] > 1) {
				this.ap[i] = 0;
			}
		}
	}
	return doRender;
};

// 整理轨迹数据
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.initData = function (data) {
	this.data = [];
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

			// 计算风的元素向量
			var a = n.angle/180*Math.PI;
			// var a = (n.angle + 180)/180*Math.PI;
			n.su = Math.cos(a) * n.speed;
			// n.sv = Math.sin(a) * n.speed;
			n.sv = Math.sin(a) * n.speed * -1;

			d.nodes.push(n);
		}
		this.data.push(d);
	}
};

// 计算轨迹线宽
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.calcOrbitWidth = function (r) {
	this.orbitWidth = this.orbitScale / r;
	if (this.orbitWidth > this.orbitMax) {
		this.orbitWidth = this.orbitMax;
	} else if (this.orbitWidth < this.orbitMin) {
		this.orbitWidth = this.orbitMin;
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
	for (var i=0; i<nodes.length; i++) {
		var n = nodes[i];
		var p = this.calcPixel( n.lon, n.lat );
		n.x = p[0];
		n.y = p[1];
		n.u = n.su / r * this.windScale;
		n.v = n.sv / r * this.windScale;
	}
};

// 画轨迹
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.createOrbitPath = function (nodes, ctx) {
	ctx.beginPath();
	ctx.moveTo(nodes[0].x, nodes[0].y);
	for (i=1; i<nodes.length; i++) {
		// var x1 = nodes[i-1].x + nodes[i-1].u;
		// var y1 = nodes[i-1].y + nodes[i-1].v;
		// var x2 = nodes[i].x - nodes[i].u;
		// var y2 = nodes[i].y - nodes[i].v;
		// ctx.bezierCurveTo(x1, y1, x2, y2, nodes[i].x, nodes[i].y);
		ctx.lineTo(nodes[i].x, nodes[i].y);
	}
};

// 生成节点路径
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.createNodePath = function (nodes, ctx, showNode) {
	var s=0, e=nodes.length;
	switch (showNode) {
		case 1:
			s ++;
			break;
		case 2:
			e --;
			break;
	}

	ctx.beginPath();
	for (var i=s; i<e; i++) {
		ctx.rect(nodes[i].x-this.nodeWidth, nodes[i].y-this.nodeWidth, 2*this.nodeWidth, 2*this.nodeWidth);
	}
};

// 画节点
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.drawNode = function (nodes, ctx, c) {
	this.createNodePath (nodes, ctx, this.showNode);
	ctx.fillStyle = c;
	ctx.fill();
};

// 画风向
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.drawWind = function (nodes, ctx) {
	ctx.lineWidth=1;
	ctx.strokeStyle = this.windColor;
	for (i=0; i<nodes.length; i++) {
		ctx.beginPath();
		ctx.moveTo(nodes[i].x, nodes[i].y);
		ctx.lineTo(nodes[i].x + nodes[i].u, nodes[i].y + nodes[i].v);
		ctx.stroke();
	}
};

// 画轨迹动画
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.drawOrbit = function (nodes, ctx, index) {
	ctx.fillStyle = this.orbitAnimationColor[index];
	for (i=1; i<nodes.length; i++) {
		var x = (nodes[i].x - nodes[i-1].x) * this.ap[index] + nodes[i-1].x;
		var y = (nodes[i].y - nodes[i-1].y) * this.ap[index] + nodes[i-1].y;
		ctx.beginPath();
		ctx.arc(x, y, this.nodeWidth, 0, 2*Math.PI);
		ctx.fill();
	}
	this.ap[index] += this.orbitSpeed;
};

// 画节点动画
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.drawNodeAnimation = function (node, ctx, index) {
	var nodeW = this.ap[index]*this.nodeLen + this.nodeWidth;
	ctx.beginPath();
	ctx.strokeStyle = this.nodeAnimationColor[index];
	ctx.rect(node.x-nodeW, node.y-nodeW, 2*nodeW, 2*nodeW);
	ctx.stroke();
	this.ap[index] += this.nodeSpeed;

	// 添加注释
	if (node.content) {
		ctx.fillStyle="black";
		ctx.font="20px Verdana";
		for (var i=0; i<node.content.length; i++) {
			ctx.fillText (node[node.content[i]], node.x + this.nodeLen, node.y + i*25);
		}
	}
};

// 计算鼠标经过的节点序号
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.calcNodeIndex = function (nodes) {
	for (i=0; i<nodes.length; i++) {
		var x = Math.abs(this.curentPosition[0] - nodes[i].x);
		var y = Math.abs(this.curentPosition[1] - nodes[i].y);
		if (x<=this.nodeWidth && y<=this.nodeWidth) {
			this.nodeOverIndex = i;
			break;
		}
	}
};

// 设置轨迹是否可见
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.setVisible = function (index, visible) {
	if (this.data[index].visible && this.orbitSelectedIndex === index) {
		this.orbitSelectedIndex = -1;
		this.nodeSelectedIndex = -1;
	}
	this.data[index].visible = visible;
	if (visible) {
		this.map.render();
	}
};

// 通过经纬度计算画布像素点（接口）
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.calcPixel = function (lon, lat) {
	return this.map.getPixelFromCoordinate( ol.proj.fromLonLat ([lon, lat]) );
};

// 被选轨迹变更时回调函数（接口）
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.orbitChange = function (orbitIndex) {};

// 备选节点变更时回调函数（接口）
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.nodeChange = function (orbitIndex, nodeIndex) {};

// 计算变换矩阵
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.calcTransform = function (a, sx, sy, dx, dy) {
	/*
		参数说明：
			a: 旋转角度（弧度）
			dx: x方向偏移量
			dy: y方向偏移量
			sx: x方向缩放比例
			sy: y方向缩放比例
		返回值：
			[0], [2], [4]
			[1], [3], [5]
			 0 ,  0 ,  1
	*/
	var v = [];
	v.push( sx*Math.cos(a) );
	v.push( sy*Math.sin(a) );
	v.push( -1*sx*Math.sin(a) );
	v.push( sy*Math.cos(a) );
	v.push( dx );
	v.push( dy );
	return v;
};

