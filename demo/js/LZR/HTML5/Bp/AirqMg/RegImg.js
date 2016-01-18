// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegImg.js" ]);

// ----------- 区域形势图片 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/Canvas/ThumbnailImg.js"
]);
LZR.HTML5.Bp.AirqMg.RegImg = function () {
	// 图层集合
	this.layers = [];

	// 图片路径
	this.tbnUrl = "";

	// 时间
	this.tim = "";
};
LZR.HTML5.Bp.AirqMg.RegImg.prototype = LZR.createPrototype (LZR.HTML5.Canvas.ThumbnailImg.prototype);
LZR.HTML5.Bp.AirqMg.RegImg.prototype.className = "LZR.HTML5.Bp.AirqMg.RegImg";
LZR.HTML5.Bp.AirqMg.RegImg.prototype.version = "0.0.0";

// 获取图层集合
LZR.HTML5.Bp.AirqMg.RegImg.prototype.getLayers = function() {
	return this.layers;
};

// 获取图片信息
LZR.HTML5.Bp.AirqMg.RegImg.prototype.getInfo = function() {
	return {tbnUrl:this.tbnUrl, tim:this.tim};
};

