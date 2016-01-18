// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "util/Geography/ScaleRule.js" ]);

// ----------- 比例尺 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/Geography/Latitude.js",
	LZR.HTML5.jsPath + "util/Geography/Longitude.js"
]);
LZR.Util.Geography.ScaleRule = function (obj) {
	/*
		参数说明：
			x:	// 模型原点X坐标
			y:	// 模型原点Y坐标
			lat:	// 模型原点对应的纬度
			lon:	// 模型原点对应的经度
	*/
	this.x = obj.x;
	this.y = obj.y;
	this.lat = new LZR.Util.Geography.Latitude ( obj.lat );
	this.lon = new LZR.Util.Geography.Longitude ( obj.lon );

	// 模型单位对应的经度
	this.lonScale = 0;

	// 模型单位对应的纬度
	this.latScale = 0;

	// 合理比例尺
	this.rational = {};
};
LZR.Util.Geography.ScaleRule.prototype.className = "LZR.Util.Geography.ScaleRule";
LZR.Util.Geography.ScaleRule.prototype.version = "0.0.1";

// 计算比例
LZR.Util.Geography.ScaleRule.prototype.computeScale = function (sr) {
	this.lonScale = Math.abs(this.lon.val - sr.lon.val) / Math.abs(this.x - sr.x);
	this.latScale = Math.abs(this.lat.val - sr.lat.val) / Math.abs(this.y - sr.y);
	sr.lonScale = this.lonScale;
	sr.latScale = this.latScale;
};

// 计算合理比例尺
LZR.Util.Geography.ScaleRule.prototype.computeRational = function (min, max, lat) {
	/*
		参数说明：
			min: 最小长度（模型单位）
			max: 最大长度（模型单位）
			lat: 对应的纬度
	*/
	if (!lat) {
		lat = this.lat;
	}
	min = this.lon.toRange(lat, min * this.lonScale);
	max = this.lon.toRange(lat, max * this.lonScale);

	min = Math.ceil( min );
	max = Math.floor( max );
	var s = Math.pow( 10, (min + "").length-1 );
	var r = Math.ceil( min / s ) * s;
	while (r>max) {
		s /= 10;
		if (s>10) {
			r = Math.ceil( min / s ) * s;
		} else {
			r = max;
		}
	}

	// 距离（单位：米）
	this.rational.d = r;

	// 比例尺宽度（模型单位）
	this.rational.w = this.lon.toAngle (lat, r) / this.lonScale;

	return this.rational;
};

