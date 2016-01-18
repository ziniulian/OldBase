// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "util/Layer.js" ]);

// --------------------- 通用图层 ----------------------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/ValCtrl.js"
]);
LZR.Util.Layer = function (obj) {
	var vc = LZR.Util.ValCtrl;

	// 图层名
	this.name = new vc();

	// 透明度
	this.alpha = new vc(1);

	// 是否可见
	this.visible = new vc(true);

	// 图片信息
	this.info = new vc();

	// 图片类型
	this.type = this.IMG_TYPE.url;

	// 序号
	this.index = -1;

	// 设置参数
	if (obj) {
		LZR.setObj (this, obj);
	}
};
LZR.Util.Layer.prototype.className = "LZR.Util.Layer";
LZR.Util.Layer.prototype.version = "0.0.0";

// 图片类型
LZR.Util.Layer.prototype.IMG_TYPE = {
	url: 1,
	base64: 2,
	img: 3
};

// -------------------- 接口 ------------------

// 刷新显示
LZR.Util.Layer.prototype.flush = function () {};

