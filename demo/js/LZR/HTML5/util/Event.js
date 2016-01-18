// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/Event.js" ]);

// --------------------- HTML 鼠标事件相关函数 ----------------------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/Util.js"
]);
LZR.HTML5.Util.Event = {
	// 版本号
	version: "0.0.0",

	// 获取事件
	getEvent: function(e) {
		return window.event || e;
	},

	// 获取触发事件的DOM对象
	getEventTarg: function(e) {
		return window.event.srcElement || e.target;
	},

	// 阻止默认事件的执行
	stopDefault: function(e) {
		if ( e && e.preventDefault ) {
			e.preventDefault();
		} else {
			// IE 浏览器
			window.event.returnValue = false;
		}
	},

	// 阻止事件冒泡
	stopBubble: function(e)  {
		if (e && e.stopPropagation)  {
			e.stopPropagation();
		} else {
			// IE 浏览器
			window.event.cancelBubble=true;
		}
	},

	// 获取鼠标位置
	getMousePosition: function(e){
		if (e.pageX || e.pageY){
			return {x: e.pageX, y: e.pageY};
		} else {
			// IE 浏览器
			return {
				x: window.event.clientX + document.body.scrollLeft - document.body.clientLeft,
				y: window.event.clientY + document.body.scrollTop - document.body.clientTop
			};
		}
	},

	// 添加一个事件
	addEvent: function(obj, type, callback, useCapture ){
		/*
			useCapture：
				1. true 的触发顺序总是在 false 之前；
				2. 如果多个均为 true，则外层的触发先于内层；
				3. 如果多个均为 false，则内层的触发先于外层。
		*/
		if(obj.dispatchEvent){
			obj.addEventListener(type, callback, useCapture  );
		} else {
			// IE 浏览器
			obj.attachEvent( "on"+type, callback);
		}
		return callback;
	},

	// 移除一个事件
	removeEvent: function(obj, type, callback, useCapture){
		if(obj.dispatchEvent){
			obj.removeEventListener(type, callback, useCapture  );
		} else {
			// IE 浏览器
			obj.detachEvent( "on"+type, callback);
		}
	},

	// 添加滚轮事件
	addWheel: function(obj, callback, useCapture) {
		var wheelType = "mousewheel";
		try {
			document.createEvent("MouseScrollEvents");
			wheelType = "DOMMouseScroll";			// 火狐浏览器私有类型
		} catch(e) {}

		return LZR.HTML5.Util.Event.addEvent(obj, wheelType, function(e){
			var event = LZR.HTML5.Util.Event.getEvent(e);
			if ("wheelDelta" in event){

				//统一为±120，其中正数表示为向上滚动，负数表示向下滚动
				var delta = event.wheelDelta;

				//opera 9x系列的滚动方向与IE保持一致，10后修正
				if( window.opera && opera.version() < 10 ) delta = -delta;

				//由于事件对象的原有属性是只读，我们只能通过添加一个私有属性delta来解决兼容问题
				event.delta = Math.round(delta) /120; //修正safari的浮点 bug

			} else if ("detail" in event ) {
				//为火狐添加更大众化的wheelDelta
				event.wheelDelta = -event.detail * 40;

				//添加私有的delta
				event.delta = event.wheelDelta /120;
			}

			// callback.call(obj,event);	// 修正this指向
			callback(event);
		}, useCapture);
	},

	// 移除滚轮事件
	removeWheel: function(obj, callback, useCapture) {
		var wheelType = "mousewheel";
		try {
			document.createEvent("MouseScrollEvents");
			wheelType = "DOMMouseScroll";			// 火狐浏览器私有类型
		} catch(e) {}

		LZR.HTML5.Util.Event.removeEvent(obj, wheelType, callback, useCapture);
	}

};
