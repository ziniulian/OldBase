// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Canvas/ImgLoader.js" ]);

// ----------- 图层 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/Util.js"
]);
LZR.HTML5.Canvas.ImgLoader = function (callback) {
	// 图片
	this.imgs = [];

	// 预加载图片数量
	this.expect = 0;

	// 实际已加载的图片数量
	this.fact = 0;

	if (callback) {
		this.callback = callback;
	}
};
LZR.HTML5.Canvas.ImgLoader.prototype.className = "LZR.HTML5.Canvas.ImgLoader";
LZR.HTML5.Canvas.ImgLoader.prototype.version = "0.0.1";

// 添加图片
LZR.HTML5.Canvas.ImgLoader.prototype.add = function (url, index, cb) {
	var p = document.createElement("IMG");
	LZR.HTML5.Util.addEvent (p, "load", LZR.HTML5.Util.bind (this, this.finish, index, p, cb));
	this.expect ++;
	p.src = url;
};

// 删除图片
LZR.HTML5.Canvas.ImgLoader.prototype.del = function (index) {
	this.imgs.splice(index, 1);
};

// 加载完成时必须处理的函数
LZR.HTML5.Canvas.ImgLoader.prototype.finish = function (index, p, cb) {
	// 图片加入数组
	if ( !isNaN(index) ) {
		this.imgs[index] = p;
	} else {
		this.imgs.push(p);
	}

	// 调用回调函数
	if (cb) {
		cb (index, p);
	} else {
		this.callback (index, p);
	}

	// 更新实际加载数量
	this.fact ++;
	if (this.expect <= this.fact) {
		// 调用全部图片加载完成回调函数
		this.finished();
	}
};

// 回调处理接口（接口）
LZR.HTML5.Canvas.ImgLoader.prototype.callback = function (index, img) {};

// 所有图片加载完成时的回调处理事件（接口）
LZR.HTML5.Canvas.ImgLoader.prototype.finished = function () {};

