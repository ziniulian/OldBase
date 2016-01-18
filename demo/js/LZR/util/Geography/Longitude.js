// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "util/Geography/Longitude.js" ]);

// ----------- 经度 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/Geography/CoordinateForm.js"
]);
LZR.Util.Geography.Longitude = function (obj) {
	this.val = obj;
};
LZR.Util.Geography.Longitude.prototype.className = "LZR.Util.Geography.Longitude";
LZR.Util.Geography.Longitude.prototype.version = "0.0.1";

// 地球平均半径（米）
LZR.Util.Geography.Longitude.prototype.R = 6371004;

// 获取经纬度格式
LZR.Util.Geography.Longitude.prototype.getCoordinateForm = function () {
	var s = "E";
	if (this.val < 0) s = "W";
	return new LZR.Util.Geography.CoordinateForm ({type:s, decimal:this.val});
};

// 加经度
LZR.Util.Geography.Longitude.prototype.add = function (a) {
	a += this.val;
	if (a>180) {
		a += 180;
		a = a - ( parseInt (a / 360, 10) * 360);
		a -= 180;
	}
	this.val = a;
	return this;
};

// 复制
LZR.Util.Geography.Longitude.prototype.clone = function () {
	return new LZR.Util.Geography.Longitude (this.val);
};

// 计算相对经度对应的距离
LZR.Util.Geography.Longitude.prototype.toRange = function (lat, a) {
	var r = Math.cos( lat.val/180*Math.PI )*this.R;
	return a/180*Math.PI*r;
};

// 计算距离对应的相对经度
LZR.Util.Geography.Longitude.prototype.toAngle = function (lat, d) {
	var r = Math.cos( lat.val/180*Math.PI )*this.R;
	return d/(r*Math.PI/180);
};

// 计算两经度间的距离差
LZR.Util.Geography.Longitude.prototype.rangeDiff = function (lat, lon) {
	return this.toRange( lat, Math.abs(this.val - lon.val) );
};

