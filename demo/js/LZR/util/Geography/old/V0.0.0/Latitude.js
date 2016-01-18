// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "util/Geography/Latitude.js" ]);

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/Geography/CoordinateForm.js"
]);

// 纬度
LZR.Util.Geography.Latitude = function (obj) {
	this.val = obj;
};
LZR.Util.Geography.Latitude.prototype.className = "LZR.Util.Geography.Latitude";
LZR.Util.Geography.Latitude.prototype.version = "0.0.0";

// 纬度一度对应的米数
LZR.Util.Geography.Latitude.prototype.scale = 111195;

// 获取经纬度格式
LZR.Util.Geography.Latitude.prototype.getCoordinateForm = function () {
	var s = "N";
	if (this.val < 0) s = "S";
	return new LZR.Util.Geography.CoordinateForm ({type:s, decimal:this.val});
};

// 加距离
LZR.Util.Geography.Latitude.prototype.add = function (distance) {
	var a = this.val + 90 + (distance/this.scale);
	if (a>360) a = a - ( parseInt (a / 360, 10) * 360);
	if (a>180) a = 360 - a;
	this.val = a-90;
};

// 复制
LZR.Util.Geography.Latitude.prototype.clone = function () {
	return new LZR.Util.Geography.Latitude (this.val);
};
