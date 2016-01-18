// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "util/Geography/Longitude.js" ]);

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/Geography/CoordinateForm.js"
]);

// 经度
LZR.Util.Geography.Longitude = function (obj) {
	this.val = obj;
};
LZR.Util.Geography.Longitude.prototype.className = "LZR.Util.Geography.Longitude";
LZR.Util.Geography.Longitude.prototype.version = "0.0.0";

// 地球平均半径（米）
LZR.Util.Geography.Longitude.prototype.R = 6371004;

// 获取经纬度格式
LZR.Util.Geography.Longitude.prototype.getCoordinateForm = function () {
	var s = "E";
	if (this.val < 0) s = "W";
	return new LZR.Util.Geography.CoordinateForm ({type:s, decimal:this.val});
};

// 加距离
LZR.Util.Geography.Longitude.prototype.add = function (lat, distance) {
	var r = Math.cos( lat.val/180*Math.PI )*this.R;
	var a = this.val + ( distance/(r*Math.PI/180) );
	if (a>180) {
		a += 180;
		a = a - ( parseInt (a / 360) * 360);
		a -= 180;
	}
	this.val = a;
};

// 复制
LZR.Util.Geography.Longitude.prototype.clone = function () {
	return new LZR.Util.Geography.Longitude (this.val);
};
