// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/Util/CatchImgByWebsocket/Truth.js" ]);

// ----------- 通过马远的Websocket接口来获取实况图片 ------------
LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/Bp/Util/CatchImgByWebsocket.js"
]);
LZR.HTML5.Bp.Util.CatchImgByWebsocket.Truth = function (obj) {
	LZR.HTML5.Bp.Util.CatchImgByWebsocket.call(this);

	// 起始时间
	this.start = null;

	// 起始时间
	this.end = null;

	// 设置参数
	if (obj) {
		LZR.setObj (this, obj);
	}
};
LZR.HTML5.Bp.Util.CatchImgByWebsocket.Truth.prototype = LZR.createPrototype (LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype);
LZR.HTML5.Bp.Util.CatchImgByWebsocket.Truth.prototype._super = LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype;
LZR.HTML5.Bp.Util.CatchImgByWebsocket.Truth.prototype.className = "LZR.HTML5.Bp.Util.CatchImgByWebsocket.Truth";
LZR.HTML5.Bp.Util.CatchImgByWebsocket.Truth.prototype.version = "0.0.0";

// 生成查询语句
LZR.HTML5.Bp.Util.CatchImgByWebsocket.Truth.prototype.createSQL = function () {
	var sql = {
		type: this.resultType.typ,
		sort: this.sort,
		picType: [this.num]
	};
	sql[this.num] = {
		"modelType": [this.mod],
		"domain": [this.area],
		"timesRange": [this.start, this.end]
	};
	return sql;
};

