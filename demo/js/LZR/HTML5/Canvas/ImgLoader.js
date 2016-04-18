// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Canvas/ImgLoader.js" ]);

// ----------- 图层 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/Event.js",
	LZR.HTML5.jsPath + "util/expand/json2.js"
]);
LZR.HTML5.Canvas.ImgLoader = function (callback) {
	// 图片
	this.imgs = [];

	// 预加载图片数量
	this.expect = 0;

	// 实际已加载的图片数量
	this.fact = 0;

	// websocket 获取的总数
	this.wsCount = 0;

	// websocket 获取的序号
	this.wsId = 0;

	// 是否正在忙碌
	this.isBusy = false;

	if (callback) {
		this.callback = callback;
	}
};
LZR.HTML5.Canvas.ImgLoader.prototype.className = "LZR.HTML5.Canvas.ImgLoader";
LZR.HTML5.Canvas.ImgLoader.prototype.version = "0.0.2";

// 添加图片
LZR.HTML5.Canvas.ImgLoader.prototype.add = function (url, index, cb, data) {
	// 防图片重载或覆盖
	var p;
	if (!isNaN(index) && this.imgs[index]) {
		p = this.imgs[index];
		LZR.HTML5.Util.Event.removeEvent (p, "load", p.LZR_cb);
	} else {
		p = document.createElement("IMG");
	}
	p.LZR_cb = LZR.bind (this, this.finish, index, p, cb, data);
	LZR.HTML5.Util.Event.addEvent (p, "load", p.LZR_cb);

	this.isBusy = true;
	this.expect ++;
	p.src = url;
};

// 删除图片
LZR.HTML5.Canvas.ImgLoader.prototype.del = function (index) {
	this.imgs.splice(index, 1);
};

// 加载完成时必须处理的函数
LZR.HTML5.Canvas.ImgLoader.prototype.finish = function (index, p, cb, data) {
	// 图片加入数组
	if ( !isNaN(index) ) {
		this.imgs[index] = p;
	} else {
		this.imgs.push(p);
	}

	// 调用回调函数
	if (cb) {
		cb (index, p, data);
	} else {
		this.callback (index, p, data);
	}
// console.log (index + " , " + this.expect + " , " + this.fact);

	// 更新实际加载数量
	this.fact ++;
	if (this.expect <= this.fact) {
// console.log (this.expect + " finished " + this.fact);	
		// 调用全部图片加载完成回调函数
		this.isBusy = false;
		this.finished();
	}
};

// ------------------- 马远的 WebSocket 图片接收 -------------

// WinSock 加载图片
LZR.HTML5.Canvas.ImgLoader.prototype.addByWebSocket = function (wsInfo, data, cb) {
	this.closeWebSocket();
	this.websocket = new WebSocket(wsInfo.url);

	this.websocket.onopen = LZR.bind(this, function (evt) {
		//已经建立连接
		// alert("onopen : ");

		this.wsId = 0;
		this.expect = 0;
		this.fact = 0;
		this.isBusy = true;
		this.websocket.send( JSON.stringify (data) );

// console.log (JSON.stringify (data));
		//查看this.websocket当前状态
		// alert(this.websocket.readyState);
	});

	this.websocket.onclose = LZR.bind(this, function (evt) {
		//已经关闭连接。
		// alert("onclose : ");

		// this.websocket = null;
		this.expect = this.wsId;
		if (this.wsId === 0) {
			this.finished();
		}
// console.log ("end : " + this.expect);
	});

	this.websocket.onmessage = LZR.bind(this, function (evt) {
		//收到服务器消息，使用evt.data提取
		var data = JSON.parse(evt.data);
		switch (data.state) {
			case "0":
				var url = data[wsInfo.fld].replace(/\\/g, "/");
// console.log (this.wsId + " : " + url);
				this.add(wsInfo.pre + url, this.wsId, cb, data);
				this.wsId ++;
				break;
			case "5":
// console.log ("start : " + data.count);
				this.expect = data.count;
				this.wsId = 0;
				this.onCount (this.wsCount, data);
				break;
			default:
				// 图片异常处理
				// alert(data.state);
		}
	});

	this.websocket.onerror = function (evt) {
		//产生异常
		// alert("LZR.HTML5.Canvas.ImgLoader WinSocket_onerror : ");
	};
};

// WinSock 连接关闭
LZR.HTML5.Canvas.ImgLoader.prototype.closeWebSocket = function () {
	if (this.websocket) {
		this.websocket.close();
		this.websocket = null;
	}
};

// 回调处理接口（接口）
LZR.HTML5.Canvas.ImgLoader.prototype.callback = function (index, img, data) {};

// webSocket 获取图片数量时的回调事件
LZR.HTML5.Canvas.ImgLoader.prototype.onCount = function (count, data) {};

// 所有图片加载完成时的回调处理事件（接口）
LZR.HTML5.Canvas.ImgLoader.prototype.finished = function () {};

