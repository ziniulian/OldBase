// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/Ajax.js" ]);

// ----------------- Ajax -----------------------
if (!window.JSON) {
	LZR.HTML5.loadJs([
		LZR.HTML5.jsPath + "util/expand/json2.js"
	]);
}
LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/Util.js"
]);
LZR.HTML5.Util.Ajax = function () {
	/* BUG：
		未处理跨域问题。跨域解决方法：
			1. 将请求发送至后端服务器处理
			2. 利用 script 的 src 属性发送跨域请求。（缺点：只能 get，不能 post，不能同步）
			4. 利用 form + iframe 实现跨域 get/post 请求。（可解决跨域 post，缺点：不能同步）
			3. 需要跨域服务器增加 Access-Control-Allow-Origin 头标识。（缺点：需要服务器许可、需要浏览器支持）
				例如：	<meta http-equiv="Access-Control-Allow-Origin" content="*">
						<meta http-equiv="Access-Control-Allow-Origin" content="http://www.baidu.com:80">
	*/
	this.ajax = LZR.HTML5.getAjax ();
	if ( !this.ajax ) return null;
};
LZR.HTML5.Util.Ajax.prototype.className = "LZR.HTML5.Util.Ajax";
LZR.HTML5.Util.Ajax.prototype.version = "0.0.0";

// 发送 POST 请求
LZR.HTML5.Util.Ajax.prototype.post = function (url, msg, callback, msgType, isGet) {
	/*
		callback：
			有此参数即为异步传输；
			无此参数即为同步传输。
		msgType：
			在Form元素的语法中，EncType 表明提交数据的格式 用 Enctype 属性指定将数据回发到服务器时浏览器使用的编码类型：
			application/x-www-form-urlencoded： 窗体数据被编码为名称/值对。这是标准的编码格式
			multipart/form-data： 窗体数据被编码为一条消息，页上的每个控件对应消息中的一个部分。二进制数据传输方式，主要用于上传文件
			text/plain： 窗体数据以纯文本形式进行编码，其中不含任何控件或格式字符
	*/

	// 判断异步
	var isAsyn = false;
	if ( callback ) {
		isAsyn = true;
		this.ajax.onreadystatechange = LZR.HTML5.Util.bind ( this,  this.asynCallback, callback );
	}

	// 处理 msg
	if ( msg && typeof msg == "object" ) {
		var ms="";
		for (var n in msg) {
			if ("" !== ms) {
				ms += "&";
			}
			ms += n;
			ms += "=";
			ms += JSON.stringify ( msg[n] );
		}
		msg = ms;
// LZR.HTML5.alog ( msg );
	}

	// 发送请求
	try {
		if ( isGet ) {
			this.ajax.open("GET", url, isAsyn);
		} else {
			this.ajax.open("POST", url, isAsyn);
			if ( !msgType ) {
				msgType = "application/x-www-form-urlencoded; charset=utf-8";
			}
			this.ajax.setRequestHeader("Content-Type", msgType);
		}
		this.ajax.send(msg);
	} catch ( e ) {
		return null;
	}

	// 同步回调
	var s =  null;
	if ( !isAsyn && this.ajax.readyState == 4 ) {
		s = this.ajax.responseText;
		// this.ajax.close();
	}
	return s;
};

// 发送 GET 请求
LZR.HTML5.Util.Ajax.prototype.get = function (url, callback) {
	return this.post ( url, null, callback, null, true );
};

// 异步回调
LZR.HTML5.Util.Ajax.prototype.asynCallback = function ( callback ) {
	if ( this.ajax.readyState == 4 ) {
		callback ( this.ajax.responseText,  this.ajax.status );
	}
	// this.ajax.close();
// LZR.HTML5.alog ( this.ajax.readyState );
};

// 取消请求
LZR.HTML5.Util.Ajax.prototype.abort = function () {
	this.ajax.abort();
};
