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

	// 每行的网格数
	this.n = -1;

	// 网格宽度
	this.w = -1;

	// 网格横向间距
	this.u = -1;

	// 布局数组
	this.rows = [];

	LZR.HTML5.Util.Event.addEvent (window, "resize", LZR.bind(this, this.init), false);
};
LZR.HTML5.Util.Layout.GridLayout.prototype = LZR.createPrototype (LZR.HTML5.Util.Layout.BaseDiv.prototype);
LZR.HTML5.Util.Layout.GridLayout.prototype._super = LZR.HTML5.Util.Layout.BaseDiv.prototype;
LZR.HTML5.Util.Layout.GridLayout.prototype.className = "LZR.HTML5.Util.Layout.GridLayout";
LZR.HTML5.Util.Layout.GridLayout.prototype.version = "0.0.1";

// 重新布局
LZR.HTML5.Util.Layout.GridLayout.prototype.init = function () {
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

	if (this.n !== n || this.w != w || this.u != u) {
		// 重绘元素
		this.outDiv = new LZR.HTML5.Util.Layout.BaseDiv(0);
		this.outDiv.div.style.textAlign = "center";
		this.outDiv.placeTo (this.div);
		this.w = w;
		this.u = u;

		// 计算布局数组
		if (this.n !== n) {
			this.n = n;
			this.rows = this.calcLayout (n, this.children);
		}
		var i, j;
/*
		// 测试布局数组是否正确
		for (i = 0; i<this.rows.length; i++) {
			var s = "";
			for (j=0; j<this.rows[i].length; j++) {
				s += this.rows[i][j];
				s += " , ";
			}
			console.log(s);
		}
*/
		// 放置元素
		var rw = n*(w+u) - u;	// 行容器宽度
		for (i = 0; i<this.rows.length; i++) {
			// 创建行容器
			var r = this.rows[i];
			var row = new LZR.HTML5.Util.Layout.BaseDiv(0);
			var ds = row.div.style;
			ds.width =  rw + "px";
			ds.height = h + "px";
			ds.marginLeft = "auto";
			ds.marginRight = "auto";
			if (i>0) {
				ds = new LZR.HTML5.Util.Layout.BaseDiv(0);
				ds.div.style.height = v + "px";
				this.outDiv.addChild (ds);
			}
			this.outDiv.addChild (row);

			var d, k = 0;	// 补白距离的长度
			for (j = 0; j<r.length; j++) {
				if (j>0) {
					k += u;
				}
				if (r[j] < 0) {
					k += w;
				} else {
					if (k) {
						// 添加补白区域
						d = new LZR.HTML5.Util.Layout.BaseDiv(0);
						ds = d.div.style;
						ds.width = k + "px";
						ds.height =  "1px";
						ds.display = "inline-block";
						ds.verticalAlign = "top";
						row.addChild (d);
						k = 0;
					}

					// 添加元素
					d = this.children[ r[j] ];
					ds = d.div.style;
					ds.width = (w * d.w + u * (d.w-1)) + "px";
					ds.height = (h * d.h + v * (d.h-1)) + "px";
					ds.display = "inline-block";
					ds.verticalAlign = "top";
					d.placeTo (row.div);
					j += d.w - 1;	// 跳过所有 -2 区域
				}
			}
			if (k) {
				// 添加补白区域
				d = new LZR.HTML5.Util.Layout.BaseDiv(0);
				ds = d.div.style;
				ds.width = k + "px";
				ds.height =  "1px";
				ds.display = "inline-block";
				ds.verticalAlign = "top";
				row.addChild (d);
				k = 0;
			}
		}
	} else {
		this.outDiv.placeTo (this.div);
	}
};

// 计算布局数组
LZR.HTML5.Util.Layout.GridLayout.prototype.calcLayout = function (n, elms) {
	/*
		参数说明：
			n：每一行的网格个数
			elms：布局元素集合
		返回值说明：
			rows：网格数组。	（ 数组值说明：
							>=0：对应元素集合的索引；
							-1：表示未被占用区域（需要填充）；
							-2：表示已被占用区域（无需填充）；
							-3：表示已被占用区域（需要填充）；
						）
	*/
	var d, p=0, rows = [];
	for (var i=0; i<elms.length; i++) {
		// 整理元素宽高
		d = elms[i];
		if (d.width > n) {
			d.w = n;
			d.h = d.height;
		} else {
			d.w = d.width;		// 实际显示的宽度个数
			d.h = d.height;		// 时间显示的高度个数
		}

		// 计算布局数组
		p = this.calcRows (rows, n, d.w, d.h, p, i);
	}
	return rows;
};

// 创建一行数组
LZR.HTML5.Util.Layout.GridLayout.prototype.createRow = function (n) {
	var r = [];
	for (var i=0; i<n; i++) {
		r.push(-1);
	}
	r.p = 0;	// 数组已占用位置数
	return r;
};

// 计算元素可放入的位置
LZR.HTML5.Util.Layout.GridLayout.prototype.calcRows = function (rows, n, w, h, p, index) {
	/*
		参数说明：
			rows：布局数组
			n：每一行的网格个数
			w：准备放入元素的宽度个数
			h：准备放入元素的高度个数
			p：rows 的循环起始值
		返回值说明：
			p：rows 的循环起始值
	*/
	var pb = true;	// 是否可判断 rows 的循环起始值

	for (var i = p; i<rows.length; i++) {
		var r = rows[i];
		var x = 0;	// 每行的连续范围值
		if (r.p === n) {
			// 此行已满
			if (pb) {
				p ++;
			}
		} else {
			pb = false;
			for (var j = 0; j<n; j++) {
				if (r[j] === -1) {
					x++;
					if (x === w) {
						// 宽度适合
						x = j-w+1;	// 找到宽度方向的起始位置

						// 高度检查
						var m, k=true;
						for (m=1; m<h; m++) {
							if ((rows[i+m]) && (rows[i+m][x] !== -1)) {
								k = false;
								x = 0;
								break;
							}
						}
						if (k) {
							// 找到合适的范围
							r.p += w;
							r[x] = index;

							// 横向宽度填充
							for (k=1; k<w; k++) {
								r[x + k] = -2;
							}

							// 纵向高度填充
							for (m=1; m<h; m++) {
								r = rows[i + m];
								if (!r) {
									r = this.createRow(n);
									rows.push(r);
								}
								r.p += w;
								for (k=0; k<w; k++) {
									r[x + k] = -3;
								}
							}

							// 返回 rows 的循环起始值
							return p;
						}
					}
				} else {
					x = 0;
				}
			}
		}
	}

	// 没有合适位置时，新建一行再递归计算。
	rows.push(this.createRow(n));
	this.calcRows (rows, n, w, h, i, index);
	return p;
};

// 添加子元素
LZR.HTML5.Util.Layout.GridLayout.prototype.addChild = function (elm) {
	if (elm.className === "LZR.HTML5.Util.Layout.GridElement") {
		this._super.addChild.call (this, elm, true);
	}
};

// 删除子元素
LZR.HTML5.Util.Layout.GridLayout.prototype.delChild = function (elm) {
	this._super.delChild.call (this, elm);
};

