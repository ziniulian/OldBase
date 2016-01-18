// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Canvas/ImgLoader.js" ]);

// ----------- 图层 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/Util.js"
]);
LZR.HTML5.Canvas.ImgLoader = function (callback) {
	// 图片
	this.imgs = [];

	if (callback) {
		this.callback = callback;
	}
};
LZR.HTML5.Canvas.ImgLoader.prototype.className = "LZR.HTML5.Canvas.ImgLoader";
LZR.HTML5.Canvas.ImgLoader.prototype.version = "0.0.0";

// 添加图片
LZR.HTML5.Canvas.ImgLoader.prototype.add = function (url, index, cb) {
	var p = document.createElement("IMG");
	LZR.HTML5.Util.addEvent (p, "load", LZR.HTML5.Util.bind (this, this.finish, index, p, cb));
	p.src = url;
};

// 删除图片
LZR.HTML5.Canvas.ImgLoader.prototype.del = function (index) {
	this.imgs.splice(index, 1);
};

// 加载完成时必须处理的函数
LZR.HTML5.Canvas.ImgLoader.prototype.finish = function (index, p, cb) {
	if ( !isNaN(index) ) {
		this.imgs[index] = p;
	} else {
		this.imgs.push(p);
	}
	if (cb) {
		cb (index, p);
	} else {
		this.callback (index, p);
	}
};

// 回调处理接口（接口）
LZR.HTML5.Canvas.ImgLoader.prototype.callback = function (index, img) {};

