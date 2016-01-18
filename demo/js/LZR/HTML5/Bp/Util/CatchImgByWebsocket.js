// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/Util/CatchImgByWebsocket.js" ]);

// ----------- 通过马远的Websocket接口来获取图片基类 ------------
if (!window.JSON) {
	LZR.HTML5.loadJs([
		LZR.HTML5.jsPath + "util/expand/json2.js"
	]);
}
LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/CallBacks.js"
]);
LZR.HTML5.Bp.Util.CatchImgByWebsocket = function (obj) {
	// 查询编号
	this.num = null;

	// 区域
	this.area = null;

	// 模式
	this.mod = null;

	// 排序方式（0：时间从大到小；1：时间从小到大）
	this.sort = 1;

	// WebSocket 服务器路径
	this.url = null;

	// WebSocket 对象
	this.ws = null;

	// 结果集
	this.results = null;

	// 查询状态
	this.state = this.STATE.none;

	// 查询结果类型
	this.resultType = this.REULT_TYPE.url;

	// 事件回调
	this.event = {
		"get": new LZR.Util.CallBacks (this),
		"close": new LZR.Util.CallBacks (this)
	};

	// 设置参数
	if (obj) {
		LZR.setObj (this, obj);
	}
};
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.className = "LZR.HTML5.Bp.Util.CatchImgByWebsocket";
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.version = "0.0.2";

// 查询状态枚举
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.STATE = {
	none: 0,		// 未初始化
	ok: 1,			// 可查询
	ing: 2,			// 查询中
	over: 3,		// 查询被服务器端中止
	end: 4,			// 查询主动中止
	redo: 5		// 为重新查询而中止
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

// 开始查询
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.open = function () {
	switch (this.state) {
		case this.STATE.ing:
			this.state = this.STATE.redo;
			this.ws.close();
			break;
		case this.STATE.none:
		case this.STATE.over:
		case this.STATE.end:
			this.state = this.STATE.ok;
			this.results = [];
			this.ws = new WebSocket(this.url);
			this.ws.onopen = LZR.bind(this, this.handleOnOpen);
			this.ws.onclose = LZR.bind(this, this.handleOnClose);
			this.ws.onerror = LZR.bind(this, this.handleOnError);
			this.ws.onmessage = LZR.bind(this, function (evt) {
				this.handleOnMessage( JSON.parse(evt.data) );
			});
			break;
	}
};

// 停止查询
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.close = function () {
	switch (this.state) {
		case this.STATE.ing:
			this.state = this.STATE.end;
			this.ws.close();
			break;
		case this.STATE.redo:
			this.state = this.STATE.end;
			break;
	}
};

// 设置URL型图片服务的前缀
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.setUrlPre = function (pre) {
	this.REULT_TYPE.url.pre = pre;
};

// 设置事件调用对象
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.setEventObj = function (obj) {
	for (var s in this.event) {
		this.event[s].obj = obj;
	}
};

// 连接成功事件处理
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.handleOnOpen = function () {
	if (this.state === this.STATE.ok) {
		this.state = this.STATE.ing;
		this.ws.send( JSON.stringify(this.createSQL()) );
	}
};

// 收到信息事件处理
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.handleOnMessage = function (d) {
	switch (d.state) {
		case "0":
			var r = new LZR.HTML5.Bp.Util.CatchImgByWebsocket.Result ();
			r.tim = d.picTime;
			r.ret = this.resultType.pre + d[this.resultType.fld];
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
		case this.STATE.redo:
			this.state = this.STATE.none;
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
	// 为保证IE下正常运行，暂取消错误的回复初始值处理。
	// this.ws.close();
	// this.state = this.STATE.none;
	// this.results = null;
	// this.ws = null;
};

// -------------------- 事件 ------------------

// 获得一个结果时是否存入结果集中
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.onGetOneResponse = function (result) {
	return this.event.get.execute (result);
};

// 查询结束了
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.onClose = function (results, state) {
	return this.event.close.execute (results, state);
};

// -------------------- 接口 ------------------

// 生成查询语句
LZR.HTML5.Bp.Util.CatchImgByWebsocket.prototype.createSQL = function () {};

