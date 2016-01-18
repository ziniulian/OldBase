// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Canvas/ThumbnailImg.js" ]);

// ----------- 缩略图图片（接口） ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/Canvas/Layer.js"
]);
LZR.HTML5.Canvas.ThumbnailImg = function () {
	// 图层集合
	this.layers = [];
};
LZR.HTML5.Canvas.ThumbnailImg.prototype.className = "LZR.HTML5.Canvas.ThumbnailImg";
LZR.HTML5.Canvas.ThumbnailImg.prototype.version = "0.0.0";

// 获取图层集合
LZR.HTML5.Canvas.ThumbnailImg.prototype.getLayers = function() {
	return this.layers;
};

// 获取图片信息
LZR.HTML5.Canvas.ThumbnailImg.prototype.getInfo = function() {};


