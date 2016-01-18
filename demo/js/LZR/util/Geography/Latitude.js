// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "util/Geography/Latitude.js" ]);

// ----------- 纬度 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/Geography/CoordinateForm.js"
]);
LZR.Util.Geography.Latitude = function (obj) {
	this.val = obj;
};
LZR.Util.Geography.Latitude.prototype.className = "LZR.Util.Geography.Latitude";
LZR.Util.Geography.Latitude.prototype.version = "0.0.1";

// 纬度一度对应的米数
LZR.Util.Geography.Latitude.prototype.scale = 111195;

// 获取经纬度格式
LZR.Util.Geography.Latitude.prototype.getCoordinateForm = function () {
	var s = "N";
	if (this.val < 0) s = "S";
	return new LZR.Util.Geography.CoordinateForm ({type:s, decimal:this.val});
};

// 加纬度
LZR.Util.Geography.Latitude.prototype.add = function (a) {
	a += this.val + 90;
	if (a>360) a = a - ( parseInt (a / 360, 10) * 360);
	if (a>180) a = 360 - a;
	this.val = a-90;
	return this;
};

// 复制
LZR.Util.Geography.Latitude.prototype.clone = function () {
	return new LZR.Util.Geography.Latitude (this.val);
};

// 计算相对纬度对应的距离
LZR.Util.Geography.Latitude.prototype.toRange = function (a) {
	return this.scale * a;
};

// 计算距离对应的相对纬度
LZR.Util.Geography.Latitude.prototype.toAngle = function (d) {
	return d/this.scale;
};

// 计算两纬度间的距离差
LZR.Util.Geography.Latitude.prototype.rangeDiff = function (lat) {
	return this.toRange( Math.abs(this.val - lat.val) );
};

