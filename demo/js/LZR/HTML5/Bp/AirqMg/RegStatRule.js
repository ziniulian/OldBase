// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStatRule.js" ]);

// ----------- 的比例尺 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/Geography/ScaleRule.js",
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat.js"
]);
LZR.HTML5.Bp.AirqMg.RegStatRule = function (obj) {
	/*
		参数说明：
			rs:	// 
			latt:	// 上边纬度
			latb:	// 下边纬度
			lonl:	// 左边经度
			lonr:	// 右边经度
			min:	// 比例尺最小长度
			max:	// 比例尺最大长度
			dlon:	// 经度段数
			dlat:	// 纬度段数
	*/
	// 
	this.rs = obj.rs;
	this.min = obj.min;
	this.max = obj.max;
	this.dlon = obj.dlon;
	this.dlat = obj.dlat;

	// 基本经纬度（左上角）
	this.base = new LZR.Util.Geography.ScaleRule ({
		x: 0,
		y: 0,
		lat: obj.latt,
		lon: obj.lonl
	});

	// 右下角经纬度（右下角）
	this.r = new LZR.Util.Geography.ScaleRule ({
		x: this.rs.map.max.w,
		y: this.rs.map.max.h,
		lat: obj.latb,
		lon: obj.lonr
	});
	this.r.computeScale(this.base);

	// 显示区域的原点经纬度
	this.s = LZR.HTML5.Util.clone (this.base);

};
LZR.HTML5.Bp.AirqMg.RegStatRule.prototype.className = "LZR.HTML5.Bp.AirqMg.RegStatRule";
LZR.HTML5.Bp.AirqMg.RegStatRule.prototype.version = "0.0.0";

// 更新显示区域经纬度
LZR.HTML5.Bp.AirqMg.RegStatRule.prototype.update = function () {
	var ms = this.rs.map.s;

	this.s.x = ms.left;
	this.s.y = ms.top;
	this.s.lat.val = this.base.lat.val - this.base.latScale * ms.top;
	this.s.lon.val = this.base.lon.val + this.base.lonScale * ms.left;

	this.r.x = ms.left + ms.w;
	this.r.y = ms.top + ms.h;
	this.r.lat.val = this.s.lat.val - this.base.latScale * ms.h;
	this.r.lon.val = this.s.lon.val + this.base.lonScale * ms.w;

	// return this.r.computeRational (this.min, this.max);

	ms = ms.w / this.rs.map.max.w;
	var r = this.r.computeRational (this.min * ms, this.max * ms);
	r.w /= ms;
	return r;
};

// 获得经度标尺
LZR.HTML5.Bp.AirqMg.RegStatRule.prototype.getLonRod = function () {
	var d = (this.r.lon.val - this.s.lon.val) / this.dlon;
	var a = [];
	for (var i=0; i<this.dlon; i++) {
		a.push(this.s.lon.val + d*i);
	}
	a.push(this.r.lon.val);
	return a;
};

// 获得纬度标尺
LZR.HTML5.Bp.AirqMg.RegStatRule.prototype.getLatRod = function () {
	var d = (this.s.lat.val - this.r.lat.val) / this.dlat;
	var a = [];
	for (var i=0; i<this.dlat; i++) {
		a.push(this.s.lat.val - d*i);
	}
	a.push(this.r.lat.val);
	return a;
};

