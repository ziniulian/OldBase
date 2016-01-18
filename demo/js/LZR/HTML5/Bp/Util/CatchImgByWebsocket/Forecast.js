// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/Util/CatchImgByWebsocket/Forecast.js" ]);

// ----------- 通过马远的Websocket接口来获取预报图片 ------------
LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/Bp/Util/CatchImgByWebsocket.js"
]);
LZR.HTML5.Bp.Util.CatchImgByWebsocket.Forecast = function (obj) {
	LZR.HTML5.Bp.Util.CatchImgByWebsocket.call(this);

	// 产品时间
	this.tim = null;

	// 起始时效
	this.start = 4;

	// 结束时效
	this.end = 27;

	// 设置参数
	if (obj) {
		LZR.setObj (this, obj);
	}
};
LZR.HTML5.Bp.Util.CatchImgByWebsocket.Forecast.prototype = LZR.createPrototype (LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype);
LZR.HTML5.Bp.Util.CatchImgByWebsocket.Forecast.prototype._super = LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype;
LZR.HTML5.Bp.Util.CatchImgByWebsocket.Forecast.prototype.className = "LZR.HTML5.Bp.Util.CatchImgByWebsocket.Forecast";
LZR.HTML5.Bp.Util.CatchImgByWebsocket.Forecast.prototype.version = "0.0.0";

// 生成查询语句
LZR.HTML5.Bp.Util.CatchImgByWebsocket.Forecast.prototype.createSQL = function () {
	var sql = {
		type: this.resultType.typ,
		sort: this.sort,
		picType: [this.num]
	};
	sql[this.num] = {
		"modelType": [this.mod],
		"domain": [this.area],
		"times": this.tim,
		"periodStart": this.start,
		"periodEnd": this.end
	};
// console.log (JSON.stringify(sql));
	return sql;
};

