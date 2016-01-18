// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/Layout/GridElement.js" ]);

// ------------------- 网格布局元素 ---------------------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/Layout/BaseDiv.js"
]);
LZR.HTML5.Util.Layout.GridElement = function (obj) {
	/*
		参数说明：
		{
			width:,		// 宽度个数
			height:,	// 高度个数
		}
	*/
	obj.type = 0;
	LZR.HTML5.Util.Layout.BaseDiv.call(this, obj);

	// 宽度个数
	if (obj.width) {
		this.width = obj.width;
	} else {
		this.width = 1;
	}

	// 高度个数
	if (obj.height) {
		this.height = obj.height;
	} else {
		this.height = 1;
	}
};
LZR.HTML5.Util.Layout.GridElement.prototype = LZR.createPrototype (LZR.HTML5.Util.Layout.BaseDiv.prototype);
LZR.HTML5.Util.Layout.GridElement.prototype.className = "LZR.HTML5.Util.Layout.GridElement";
LZR.HTML5.Util.Layout.GridElement.prototype.version = "0.0.0";

