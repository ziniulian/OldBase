// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/Layout/GridBorder.js" ]);

// ------------------- 图框 ---------------------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/Util.js",
	LZR.HTML5.jsPath + "HTML5/util/Css.js",
	LZR.HTML5.jsPath + "util/Graphics/Edge.js"
]);
LZR.HTML5.Util.Layout.GridBorder = function (obj) {
	/*
		参数说明：
		{
			img: {
				url:
				left:
				top:
				width:
				height:
				div:
			}
			titleClass: "",		// 标题样式
			packClass: "",		// 容器样式
			footerClass: "",	// 页脚样式
			divClass: ""		// 最外层容器样式
		}
	*/
	// 最外层容器
	this.div = document.createElement("div");
	if (obj.divClass) {
		LZR.HTML5.Util.Css.addClass (this.div, obj.divClass);
	} else {
		LZR.HTML5.Util.Css.addClass (this.div, "LHUL_GridBorder_Div");
	}

	// 标题
	this.title = document.createElement("div");
	if (obj.titleClass) {
		LZR.HTML5.Util.Css.addClass (this.title, obj.titleClass);
	} else {
		LZR.HTML5.Util.Css.addClass (this.title, "LHUL_GridBorder_Title");
	}

	// 页脚
	this.footer = document.createElement("div");
	if (obj.footerClass) {
		LZR.HTML5.Util.Css.addClass (this.footer, obj.footerClass);
	} else {
		LZR.HTML5.Util.Css.addClass (this.footer, "LHUL_GridBorder_Footer");
	}

	// 容器
	this.pack = document.createElement("div");
	if (obj.packClass) {
		LZR.HTML5.Util.Css.addClass (this.pack, obj.packClass);
	} else {
		LZR.HTML5.Util.Css.addClass (this.pack, "LHUL_GridBorder_Pack");
	}

	if (obj.img) {
		this.placeTo (obj.img.div);
		this.setImg (obj.img.url, obj.img.left, obj.img.top, obj.img.width, obj.img.height);
	}
};
LZR.HTML5.Util.Layout.GridBorder.prototype.className = "LZR.HTML5.Util.Layout.GridBorder";
LZR.HTML5.Util.Layout.GridBorder.prototype.version = "0.0.0";

// 设置标题内容
LZR.HTML5.Util.Layout.GridBorder.prototype.setTitle = function (content) {
	this.title.innerHTML = content;
};

// 添加标题样式
LZR.HTML5.Util.Layout.GridBorder.prototype.addTitleClass = function (cls) {
	LZR.HTML5.Util.Css.addClass (this.title, cls);
};

// 添加容器样式
LZR.HTML5.Util.Layout.GridBorder.prototype.addPackClass = function (cls) {
	LZR.HTML5.Util.Css.addClass (this.pack, cls);
};

// 删除标题样式
LZR.HTML5.Util.Layout.GridBorder.prototype.delTitleClass = function (cls) {
	LZR.HTML5.Util.Css.removeClass (this.title, cls);
};

// 删除容器样式
LZR.HTML5.Util.Layout.GridBorder.prototype.delPackClass = function (cls) {
	LZR.HTML5.Util.Css.removeClass (this.pack, cls);
};

// 加入DOM
LZR.HTML5.Util.Layout.GridBorder.prototype.placeTo = function (obj) {
	obj.appendChild(this.div);
	this.div.appendChild(this.title);
	this.div.appendChild(this.pack);
	this.div.appendChild(this.footer);
};

// 在容器中添加图片
LZR.HTML5.Util.Layout.GridBorder.prototype.setImg = function (url, left, top, width, height) {
	this.pack.innerHTML = "";

	var s = document.createElement("canvas");
	s.style.width = "100%";
	s.style.height = "100%";
	this.pack.appendChild( s );
	LZR.HTML5.Util.mateWidth (s);

	var f = new LZR.Util.Graphics.Edge ({
		width: s.width,
		height: s.height
	});

	var p = document.createElement("img");
	p.onload = LZR.bind(p, function(s, f, left, top, width, height) {
		if (!left) {
			left = 0;
		}
		if (!top) {
			top = 0;
		}

		if (!width) {
			width = p.width;
		}
		if (!height) {
			height = p.height;
		}

		if (width + left > p.width) {
			width = p.width - left;
		}
		if (height + top > p.height) {
			height = p.height - top;
		}

		if (width>0 && height>0) {
			var e = new LZR.Util.Graphics.Edge ({
				width: width,
				height: height
			});
			e.w = f.w;
			e.reHeight();
			e.rrByParent (f);
			e.alineInParent ("center", f);

			s.getContext("2d").drawImage (this, left, top, width, height, e.left, e.top, e.w, e.h);
		}
	}, s, f, left, top, width, height);
	p.src = url;
};

