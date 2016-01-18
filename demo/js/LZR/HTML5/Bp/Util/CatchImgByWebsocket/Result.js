// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/Util/CatchImgByWebsocket/Result.js" ]);

// ----------- 通过马远的Websocket接口来获取图片的查询结果 ------------
LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/Bp/Util/CatchImgByWebsocket.js"
]);
LZR.HTML5.Bp.Util.CatchImgByWebsocket.Result = function (obj) {
	// 返回序号
	this.num = -1;

	// 时间
	this.tim = null;

	// 查询结果
	this.ret = null;

	// 设置参数
	if (obj) {
		LZR.setObj (this, obj);
	}
};
LZR.HTML5.Bp.Util.CatchImgByWebsocket.Result.prototype.className = "LZR.HTML5.Bp.Util.CatchImgByWebsocket.Result";
LZR.HTML5.Bp.Util.CatchImgByWebsocket.Result.prototype.version = "0.0.0";

