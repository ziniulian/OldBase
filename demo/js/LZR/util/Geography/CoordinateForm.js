// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "util/Geography/CoordinateForm.js" ]);

// ----------- 经纬度格式 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/Geography.js"
]);
LZR.Util.Geography.CoordinateForm = function (obj) {
	/**
		参数说明：
			type：经纬度类型，
			decimal：经纬度的小数形式
	*/
	// 度
	this.d = 0;

	// 分
	this.m = 0;

	// 秒
	this.s = 0;

	// 经纬度类别：E（东经）、W（西经）、S（南纬）、N（北纬）
	this.type = obj.type;

	if (obj.decimal) {
		this.setByDecimal (obj.decimal);
	}

};
LZR.Util.Geography.CoordinateForm.prototype.className = "LZR.Util.Geography.CoordinateForm";
LZR.Util.Geography.CoordinateForm.prototype.version = "0.0.0";

// 度分秒换算小数
LZR.Util.Geography.CoordinateForm.prototype.toDecimal = function () {
	return this.d + (this.m/60) + (this.s/3600);
};

// 小数换算度分秒
LZR.Util.Geography.CoordinateForm.prototype.setByDecimal = function (obj) {
	this.d = parseInt (obj, 10);
	this.s = (obj - this.d) * 60;
	this.m = parseInt (this.s, 10);
	this.s = parseInt ( (this.s - this.m)*60, 10);
	return this;
};

// 输出
LZR.Util.Geography.CoordinateForm.prototype.print = function () {
	return this.type + " " + this.d + "度" + this.m + "分" + this.s + "秒";
};
