// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/Util/CatchImgByWebsocket.js" ]);

// ----------- 通过马远的Websocket接口来获取图片基类 ------------
if (!window.JSON) {
	LZR.HTML5.loadJs([
		LZR.HTML5.jsPath + "util/expand/json2.js"
	]);
}
LZR.HTML5.Bp.Util.CatchImgByWebsocket = function (obj) {
	// 查询编号
	this.num = null;

	// 区域
	this.area = null;

	// 模式
	this.mod = null;

	// 排序方式（0：时间从大到小；1：时间从小到大）
	this.sort = 1;

	// WebSocket 对象
	this.ws = null;

	// 结果集
	this.results = null;

	// 查询状态
	this.state = this.STATE.none;

	// 查询结果类型
	this.resultType = this.REULT_TYPE.url;

	// 设置参数
	if (obj) {
		LZR.setObj (this, obj);
	}
};
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.className = "LZR.HTML5.Bp.Util.CatchImgByWebsocket";
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.version = "0.0.0";

// 查询状态枚举
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.STATE = {
	none: 0,		// 未初始化
	ok: 1,			// 查询可开始
	ing: 2,			// 查询中
	over: 3,		// 查询被服务器端中止
	end: 4,			// 查询主动中止
	reQuery: 5,		// 为重新查询而中止
	reInit: 6		// 为重新初始化而中止
};

// 查询结果类型枚举
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.REULT_TYPE = {
	// URL型
	url: {
		typ: "picURL",
		fld: "URL",
		pre: "http://192.168.1.101/imgServer/figure/figure/"
	},

	// Base64型
	base64: {
		typ: "picContent",
		fld: "Byte64",
		pre: "data:image/jpeg;base64,"
	}
};

// 加载内部类
LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/Bp/Util/CatchImgByWebsocket/Result.js"
]);

// 初始化
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.init = function (url) {
	this.wsurl = url;
	switch (this.state) {
		case this.STATE.reQuery:
			this.state = this.STATE.reInit;
			break;
		case this.STATE.ing:
			this.state = this.STATE.reInit;
			this.ws.close();
			break;
		default:
			this.state = this.STATE.none;
			this.results = null;
			this.ws = new WebSocket(url);
			this.ws.onopen = LZR.bind(this, this.handleOnOpen);
			this.ws.onclose = LZR.bind(this, this.handleOnClose);
			this.ws.onerror = LZR.bind(this, this.handleOnError);
			this.ws.onmessage = LZR.bind(this, function (evt) {
				this.handleOnMessage( JSON.parse(evt.data) );
			});
			break;
	}
};

// 开始查询
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.open = function () {
	switch (this.state) {
		case this.STATE.ok:
		case this.STATE.end:
		case this.STATE.over:
			this.state = this.STATE.ing;
			this.results = [];
			this.ws.send( JSON.stringify(this.createSQL()) );
			break;
		case this.STATE.ing:
			this.state = this.STATE.reQuery;
			this.ws.close();
			break;
	}
};

// 结束查询
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.close = function () {
	if (this.state === this.STATE.ing) {
		this.state = this.STATE.end;
		this.ws.close();
	}
};

// 连接成功事件处理
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.handleOnOpen = function () {
	this.state = this.STATE.ok;
	this.succeInit();
};

// 收到信息事件处理
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.handleOnMessage = function (d) {

	switch (d.state) {
		case "0":
			var r = new LZR.HTML5.Bp.Util.CatchImgByWebsocket.Result ();
			r.tim = d.picTime;
			r.result = this.resultType.pre + d[this.resultType.fld];
			if ( this.onGetOneResponse(r) ) {
				this.results.push(r);
			}
			break;
		case "5":
			// alert(d.count);
			break;
		default:
			// 图片异常处理
			// alert(d.state);
			break;
	}
};

// 断开连接事件处理
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.handleOnClose = function () {
	switch (this.state) {
		case this.STATE.reInit:
			this.init(this.wsurl);
			break;
		case this.STATE.reQuery:
			this.state = this.STATE.end;
			this.open();
			break;
		case this.STATE.ing:
			this.state = this.STATE.over;
			this.onClose (this.results, this.state);
			break;
		case this.STATE.end:
			this.onClose (this.results, this.state);
			break;
	}
};

// 发生错误事件处理
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.handleOnError = function () {
	this.ws.close();
	this.state = this.STATE.none;
	this.results = null;
	this.ws = null;
};

// -------------------- 接口 ------------------

// 生成查询语句
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.createSQL = function () {};

// 获得一个结果时是否存入结果集中
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.onGetOneResponse = function (result) {
	return true;
};

// 已初始化成功
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.succeInit = function () {};

// 查询结束了
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.onClose = function (results, state) {};

