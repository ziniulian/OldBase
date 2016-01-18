// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "util/Geography/ScaleRule.js" ]);

// ----------- 比例尺 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/Geography/CoordinateForm.js"
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
	this.lat = obj.lat;
	this.lon = obj.lon;

	// 模型单位对应的距离值（米）
	this.scale = 0;

	// 合理距离值（米）
	this.rational = 0;
};
LZR.Util.Geography.ScaleRule.prototype.className = "LZR.Util.Geography.ScaleRule";
LZR.Util.Geography.ScaleRule.prototype.version = "0.0.0";

// 计算比例
LZR.Util.Geography.ScaleRule.prototype.computeScale = function (sr) {
	this.scale = this.lat.rangeDiff(sr.lat) / this.y;
	return this.scale;
};

// 计算合理距离值
LZR.Util.Geography.ScaleRule.prototype.computeRational = function (min, max) {
	/*
		参数说明：
			min: 最小长度（模型单位）
			max: 最大长度（模型单位）
	*/
	min = Math.ceil(min * this.scale);
	max = Math.floor(max * this.scale);
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
	this.rational = r;
	return r;
};

// 计算X坐标对应的经度
LZR.Util.Geography.ScaleRule.prototype.computeLon = function (x) {
	return this.lon.clone().add( (x - this.x) * this.scale );
};

// 计算Y坐标对应的纬度
LZR.Util.Geography.ScaleRule.prototype.computeLat = function (y) {
	return this.lat.clone().add( (y - this.y) * this.scale );
};

