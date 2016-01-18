// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5\\util\\Util.js" ]);

// --------------------- HTML5 util ----------------------------

LZR.HTML5.Util = {
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

	// 获取DOM元素的文档坐标 
	getDomPositionForDocument: function(obj) {
		var p = {
			left:0,
			top:0,
			width:0,
			height:0
		};

		if (obj === document) {
			p.left = 0;
			p.top = 0;
			p.width = window.innerWidth;
			p.height = window.innerHeight;
		} else {
			var d, box = obj.getBoundingClientRect();
			p.width = box.right - box.left;
			p.height = box.bottom - box.top;
			if (window.pageXOffset !== undefined) {
				d = obj.ownerDocument.documentElement;
				p.left = box.left - d.clientLeft + window.pageXOffset;
				p.top = box.top - d.clientTop + window.pageYOffset;
			} else {
				// IE 浏览器
				d = obj.ownerDocument.body;
				p.left = box.left - d.clientLeft + (d.scrollLeft || obj.ownerDocument.documentElement.scrollLeft);
				p.top = box.top - d.clientTop + (d.scrollTop || obj.ownerDocument.documentElement.scrollTop);
			}
		}

		return p;
	},

	// 获取DOM对象的父节点
	getParentNode: function(obj) {
		return obj.parentNode || obj.parentElement;
	},

	// 对象克隆
	clone: function(obj){
		var objClone;
		if ( obj.constructor == Object ) {
			objClone = new obj.constructor();
		} else {
			objClone = new obj.constructor(obj.valueOf());
		}

		for ( var key in obj ) {
			if (objClone[key] != obj[key] ) {
				if ( typeof(obj[key]) == 'object' ) {
					objClone[key] = obj[key].clone();
				} else {
					objClone[key] = obj[key];
				}
			}
		}
		objClone.toString = obj.toString;
		objClone.valueOf = obj.valueOf;
		return objClone;
	},

	// 获取对象类名
	getClassName: function(obj) {
		var c = LZR.HTML5.getClassName(obj);
		if ( c == "Object" ) {
			if (obj.className) return obj.className;	// 自定义类属性

			var con = obj.constructor;
			if (con == Object) {
				return c;
			}

			if (obj.prototype && "classname" in obj.prototype.constructor && typeof obj.prototype.constructor.classname == "string") {
				return con.prototype.classname;
			}
		}
		return c;
	},

	// 获取类对象
	getClassObj: function(obj) {
		return obj.__proto__;
	},

	// 标记 this 指针。BUG：只支持单个对象，不支持多个对象。
	targThis: function(thisObj) {
		var classObj = LZR.HTML5.Util.getClassObj(thisObj);
		if (!classObj.lzrTarg) {
			classObj.lzrTarg = thisObj;
		}
	},

	// 获取 this 指针。BUG：只支持单个对象，不支持多个对象。
	getThis: function(newObj) {
		return LZR.HTML5.Util.getClassObj(newObj).lzrTarg;
	},

	// 保持 function 的 this 指針（Demo 1.00版）
		/** 用法：
		 *	某类.prototype.某方法 = function () {
		 *		var caller = new LZR.HTML5.Util.ThisTag(this);	// 创建该实例
		 *
		 *		......  其它程序码  .........
		 *		
		 *		// 设置某回调函数
		 *		ajax.callback = function (arg1, arg2, arg3 ...) {
		 *			caller.tagCall(function () {this.某回调函数实体(arg1, arg2, arg3 ...);});	// 使用该实例_方法1
		 *			caller.tagCall(caller._this.某回调函数实体, [arg1, arg2, arg3 ...]);	// 使用该实例_方法2
		 *		};
		 *	};
		 *	某类.prototype.某回调函数实体 = function (arg1, arg2, arg3 ...) {
		 *		......  // 此处可像面向对象一样使用 this 指针。
		 *	};
		 */
	ThisTag: function(thisObj) {
		this._this = thisObj;
		this.tagCall  = function(fun, argumentArray) {
			if (argumentArray) {
				fun.apply(this._this, argumentArray);
			} else {
				fun.apply(this._this);
			}
		};
	},

	// 为适应 IE8 自编的 bind 方法
	bind: function ( obj, fun ) {
		var args = Array.prototype.slice.call ( arguments, 2 );
		return function () {
			for ( var i=0; i<arguments.length; i++ ) {
				args.push ( arguments[i] );
			}
			return fun.apply ( obj, args );
		};
	},

	// 获取文件名后缀
	getFileExtension: function(fileName) {
		if (fileName) {
			var i = fileName.lastIndexOf('.')+1;
			if (i>0) {
				return fileName.substring(i, fileName.length).toLowerCase();
			}
		}
		return "";
	},

	// 添加一个事件
	addEvent: function(obj, type, callback, useCapture ){
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

		return LZR.HTML5.Util.addEvent(obj, wheelType, function(e){
			var event = LZR.HTML5.Util.getEvent(e);
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

		removeEvent(obj, wheelType, callback, useCapture);
	},

	// 消除小数的精度误差
	formatFloat: function(f, digit) {
		var m = Math.pow(10, digit);
		return parseInt(f * m, 10) / m;
	},

	// 向 <tbody> 中插入数据
	appendTbody: function(tbody, obj, named) {
		/*
			参数说明：
			obj: {
				title: {th1, th2, th3, ... },
				data: [
					{ td1, td2, td3, ... },
					{ td1, td2, td3, ... },
					{ td1, td2, td3, ... },
					......
				]
			}
		*/

		var i, s, tr, td;
		if (obj.title) {
			tr = document.createElement ("tr");
			for (s in obj.title) {
				td = document.createElement ("th");
				td.innerHTML = obj.title[s];
				if (named) td.name = s;
				tr.appendChild (td);
			}
			tbody.appendChild (tr);
		}
		for (i=0; i<obj.data.length; i++) {
			tr = document.createElement ("tr");
			for (s in obj.data[i]) {
				td = document.createElement ("td");
				td.innerHTML = obj.data[i][s];
				if (named) td.name = s;
				tr.appendChild (td);
			}
			tbody.appendChild (tr);
		}
	}
};
