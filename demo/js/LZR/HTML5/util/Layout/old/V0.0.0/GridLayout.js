// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/Layout/GridLayout.js" ]);

// ------------------- 网格布局器 ---------------------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/Layout/GridElement.js",
	LZR.HTML5.jsPath + "HTML5/util/Event.js"
]);
LZR.HTML5.Util.Layout.GridLayout = function (obj) {
	/*
		参数说明：
		{
			minWidth:,	// 最小宽度
			maxWidth:,	// 最大宽度
			minNum:,	// 最小个数
			maxNum:,	// 最大个数
			wMargin:,	// 宽度方向间距
			hMargin:,	// 高度方向间距
			maxMargin:,	// 宽度方向最大间距
			ratio:,		// 宽高比
		}
	*/
	obj.type = 0;
	LZR.HTML5.Util.Layout.BaseDiv.call(this, obj);

	// 最小宽度
	if (obj.minWidth) {
		this.minWidth = obj.minWidth;
	} else {
		this.minWidth = 100;
	}

	// 最大宽度
	if (obj.maxWidth) {
		this.maxWidth = obj.maxWidth;
	} else {
		this.maxWidth = this.minWidth;
	}

	// 最小个数
	if (obj.minNum) {
		this.minNum = obj.minNum;
	} else {
		this.minNum = 1;
	}

	// 最大个数
	if (obj.maxNum) {
		this.maxNum = obj.maxNum;
	} else {
		this.maxNum = this.minNum;
	}

	// 宽度方向间距
	if (obj.wMargin) {
		this.wMargin = obj.wMargin;
	} else {
		this.wMargin = 0;
	}

	// 高度方向间距
	if (obj.hMargin) {
		this.hMargin = obj.hMargin;
	} else {
		this.hMargin = 0;
	}

	// 宽度方向最大间距
	if (obj.maxMargin) {
		this.maxMargin = obj.maxMargin;
	} else {
		this.maxMargin = this.wMargin;
	}

	// 宽高比
	if (obj.ratio) {
		this.ratio = obj.ratio;
	} else {
		this.ratio = 1;
	}

	LZR.HTML5.Util.Event.addEvent (window, "resize", LZR.bind(this, this.resize), false);
};
LZR.HTML5.Util.Layout.GridLayout.prototype = LZR.createPrototype (LZR.HTML5.Util.Layout.BaseDiv.prototype);
LZR.HTML5.Util.Layout.GridLayout.prototype.super = LZR.HTML5.Util.Layout.BaseDiv.prototype;
LZR.HTML5.Util.Layout.GridLayout.prototype.className = "LZR.HTML5.Util.Layout.GridLayout";
LZR.HTML5.Util.Layout.GridLayout.prototype.version = "0.0.0";

// 重新布局
LZR.HTML5.Util.Layout.GridLayout.prototype.resize = function () {
	// 获取DIV的宽度
	if (this.outDiv) {
		this.delChild (this.outDiv);
	}
	var w = this.div.scrollWidth;

	// 计算横向可摆放的网格个数（n）
	var n = (w + this.wMargin) / (this.minWidth + this.wMargin);
	n = Math.floor(n);
	if (n<this.minNum) {
		n = this.minNum;
	} else if (n>this.maxNum) {
		n = this.maxNum;
	}

	// 计算网格宽度（w）
	var u = 0;	// 横向增量
	w = (w - (n-1)*this.wMargin) / n;
	if (w>this.maxWidth) {
		u = w-this.maxWidth;
		w = this.maxWidth;
	} else if (w<this.minWidth) {
		w = this.minWidth;
	}
	u += this.wMargin;
	if (u > this.maxMargin) {
		u = this.maxMargin;
	}

	// 计算网格高度（h）
	var h = w * this.ratio;
	var v = this.hMargin;	// 纵向增量

	// 重绘元素
	this.outDiv = new LZR.HTML5.Util.Layout.BaseDiv(0);
	this.outDiv.div.style.textAlign = "center";
	this.outDiv.placeTo (this.div);

	var row = null;	// 行容器
	var rh = h;	// 行容器高度
	var rw = n*(w+u) - u;	// 行容器宽度
	for (var i=0; i<this.children.length; i++) {
		var d = this.children[i];
		var ds = d.div.style;
		ds.float = "left";
		ds.width = w + "px";
		ds.height = h + "px";

		// 生成行容器
		if ( i%n === 0 ) {
			// 该容器在行首
			row = new LZR.HTML5.Util.Layout.BaseDiv(0);
			ds = row.div.style;
			ds.width =  rw + "px";
			ds.height = rh + "px";
			ds.marginLeft = "auto";
			ds.marginRight = "auto";
			if (this.outDiv.children.length) {
				ds = new LZR.HTML5.Util.Layout.BaseDiv(0);
				ds.div.style.height = v + "px";
				this.outDiv.addChild (ds);
				// ds.marginTop = v + "px";
			}
			this.outDiv.addChild (row);
		}

		// 放入行容器
		d.placeTo (row.div);

		// 添加行间距 （横向增量：u）
		if ( i%n === n-1 ) {
			// 该容器在行尾
		} else {
			// 该容器不在行尾
			var m = new LZR.HTML5.Util.Layout.BaseDiv(0);
			ds = m.div.style;
			ds.float = "left";
			ds.width = u + "px";
			ds.height =  "100%";
			row.addChild (m);
		}
	}
};

// 添加子元素
LZR.HTML5.Util.Layout.GridLayout.prototype.addChild = function (elm) {
	if (elm.className === "LZR.HTML5.Util.Layout.GridElement") {
		this.super.addChild.call (this, elm, true);
	}
};

// 删除子元素
LZR.HTML5.Util.Layout.GridLayout.prototype.delChild = function (elm) {
	this.super.delChild.call (this, elm);
};

