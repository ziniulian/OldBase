// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/Util.js" ]);

// --------------------- HTML5 util ----------------------------

LZR.HTML5.Util = {
	// 版本号
	version: "0.0.1",

	// 布局
	Layout: {},

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

	// 对象克隆（有BUG，对象中的数组只有一个元素克隆时会有问题）
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
					if (obj[key].clone) {
						objClone[key] = obj[key].clone();
					} else {
						objClone[key] = LZR.HTML5.Util.clone(obj[key]);
					}
				} else {
					objClone[key] = obj[key];
				}
			}
		}

		// if (obj.toString) objClone.toString = obj.toString;
		// if (obj.valueOf) objClone.valueOf = obj.valueOf;
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

	del: function ( obj ) {
		/*
			目前仅执行一句以避免 IE 的 delete BUG，具体功能待日后完善。
			参考文献：http://www.cnblogs.com/enein/archive/2012/08/23/2651312.html
			参考文献：http://perfectionkills.com/understanding-delete/#ie_bugs
		*/
		delete obj;
	},

	// 为适应 IE8 自编的 bind 方法
	bind: function ( obj, fun ) {
		var arg = Array.prototype.slice.call ( arguments, 2 );
		return function () {
			var i, args = [];
			for ( i=0; i<arg.length; i++ ) {
				args.push ( arg[i] );
			}
			for ( i=0; i<arguments.length; i++ ) {
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

		LZR.HTML5.Util.removeEvent(obj, wheelType, callback, useCapture);
	},

	// 消除小数的精度误差
	formatFloat: function(f, digit) {
		var m = Math.pow(10, digit);
		return parseInt(f * m, 10) / m;
	},

	// 相对路径转换为绝对路径
	toAbsURL: function () {
		var directlink = function(url){
			var a = document.createElement ( "a" );
			a.href = url;
			return a.href;
		};
		return directlink('') === '' ? function ( url ) {
			var div = document.createElement ( "div" );
			div.innerHTML = '<a href="' + url.replace(/"/g, '%22') + '"/>';
			return div.firstChild.href;
		} : directlink;
	} (),

	// 数据过滤
	filter: function ( src, tmp, clone, result ) {
		/*
			参数说明：
				result：结果集
				src：原数据
				clone：是否克隆对象
				tmp：过滤模板
				{	// 模板结构
					a: null		// 原名对应
					a: string	// 新名对应
					a: number	// 不从数据源，名对应tmp，值对应参数列表 arguments[4+n]。（序号从 0 开始）
					a: obj {
						name: string		// 对应名称
						tmp: {			// 新 tmp
							....
						}
						type: <"ary"/"obj">	// 类型选项：若为“ary”，则 tmp 是数组元素的 tmp
					}
				}
		*/
		if (!result) result = {};
		var c = clone ? function (o) { return LZR.HTML5.Util.clone(o); } : function (o) { return o; };

		for (var s in tmp) {
			if (tmp[s] === null) {
				result [s] = c ( src [s] );
			} else {
				switch ( typeof tmp[s] ) {
					case "string":
						result [ tmp[s] ] = c ( src[s] );
						break;
					case "number":
						result [s] = arguments [ tmp[s] + 4 ];
						break;
					case "object":
						var t = tmp[s].type;
						var n = tmp[s].name;
						n = n ? n : s;
						t = t ? t : "obj";
						switch ( t ) {
							case "ary":
								result [n] = [];
								var index = 0;
								for ( var i in src[s] ) {
									if ( tmp[s].tmp ) {
										result [n][index] = LZR.HTML5.Util.filter ( src [s][i], tmp[s].tmp, clone, {}, index+1 );
									} else {
										result [n][index] = c ( src[s][i] );
									}
									index ++;
								}
								break;
							case "obj":
								result [n] = LZR.HTML5.Util.filter ( src[s], tmp[s].tmp, clone );
								break;
							default:
								result [n] = tmp[s].tmp;
								break;
						}
						break;
					default:
						result [s] = c ( src[s] );
						break;
				}
			}
		}
		return result;
	},

	// 数据筛选
	query: function ( obj, condition ) {
		/*
			参数说明：
				condition: {			// 查询条件：默认为 and 方式
					<pro>: <value>,			// 元素属性：对应值
					LZRorr*: {				// 或
						<pro>: <value>,		// 元素属性：对应值
						LZRand*: {			// 与
							<pro>: <value>	// 元素属性：对应值
						},
						<pro>: <value>,		// 元素属性：对应值
						LZRnot*: {			// 取反
							<pro>: <value>	// 元素属性：对应值
						},
						LZRhas*: [pro1, pro2, ...]	// 存在
					}
				}
		*/
		var r;
		switch ( LZR.HTML5.Util.getClassName (obj) ) {
			case "Array":
			case "NodeList":
				r = [];
				for ( var i=0; i<obj.length; i++ ) {
					if ( LZR.HTML5.Util.and ( obj[i], condition ) ) {
						r.push ( obj[i] );
					}
				}
				break;
			default:
				r = {};
				for ( var s in obj ) {
					if ( LZR.HTML5.Util.and ( obj[s], condition ) ) {
						r[s] = obj[s];
					}
				}
				break;
		}
		return r;
	},

	// 数据筛选 and
	and: function ( obj, condition ) {
		for ( var s in condition ) {
			switch ( s.substring ( 0, 6 ) ) {
				case "LZRand":
					if ( !LZR.HTML5.Util.and ( obj, condition[s] ) ) return false;
					break;
				case "LZRorr":
					if ( !LZR.HTML5.Util.orr ( obj, condition[s] ) ) return false;
					break;
				case "LZRnot":
					break;
				case "LZRhas":
					break;
				default:
					// if ( !obj[s] ) return false;
					if ( obj[s] != condition[s] ) return false;
					break;
			}
		}
		return true;
	},

	// 数据筛选 orr
	orr: function ( obj, condition ) {
		for ( var s in condition ) {
			switch ( s.substring ( 0, 6 ) ) {
				case "LZRand":
					if ( LZR.HTML5.Util.and ( obj, condition[s] ) ) return true;
					break;
				case "LZRorr":
					if ( LZR.HTML5.Util.orr ( obj, condition[s] ) ) return true;
					break;
				case "LZRnot":
					break;
				case "LZRhas":
					break;
				default:
					// if ( obj[s] && obj[s] == condition[s] ) return true;
					if ( obj[s] == condition[s] ) return true;
					break;
			}
		}
		return false;
	},

	// 向 <tbody> 中插入数据
	appendTbody: function(tbody, obj, reset, named) {
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
		if (reset) {
			for ( s=tbody.children.length-1; s >= 0; s-- ) {
				tr = tbody.children [s];
				if (obj.title) {
					tbody.removeChild (tr);
				} else {
					for ( i=0; i<tr.children.length; i++ ) {
						if ( tr.children [i].tagName == "TD" ) {
							tbody.removeChild (tr);
							break;
						}
					}
				}
			}
		}
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
	},

	// 同名取值
	getVals: function ( obj, condition, valueName ) {
		var a = LZR.HTML5.Util.query ( obj, condition );
		var count = 0;
		for (var s in a) {
			var v = parseInt ( a[s][valueName], 10 );
			if ( !isNaN(v) ) {
				count += v;
			}
		}
		return count;
	},

	// 获取 URL 参数
	getRequest: function () {
		var url = location.search;
		var theRequest = {};
		if (url.indexOf("?") != -1) {
			url = url.substr(1).split("&");
			for(var i = 0; i < url.length; i ++) {
				var str = url[i].split("=");
				theRequest[str[0]] = unescape(str[1]);
			}
		}
		return theRequest;
	},

	// 数字转固定宽度的字符
	format: function (s, width, subs) {
		s += "";
		var n = s.length;
		if (width > n) {
			n = width - n;
			for (var i=0; i<n; i++) {
				s = subs + s;
			}
		}
		return s;
	},

	// 修正DOM元素的宽高
	mateWidth: function (obj) {
		if (obj.scrollWidth !== obj.width) {
			obj.width = obj.scrollWidth;
			obj.height = obj.scrollHeight;
		} else if (obj.scrollHeight !== obj.height) {
			obj.height = obj.scrollHeight;
		}
	},

	// 数据回填（未完成）
	backfill: function ( obj ) {
		for (var s in obj) {
			var d = document.getElementsByName (s);
			if ( d.length == 1 ) {
				switch ( d[0].targName ) {
					case "input":
						d[0].value = obj[s];
						break;
					case "textarea":
						d[0].innerHTML = obj[s];
						break;
				}
			} else if (d.length > 1) {
				if ( d[0].targName == "input" ) {
					// 未完成，此处回填 多选框、単选框、下拉选框 等
					// for ( var i=0; i<d.length; i++ ) {
					//	switch ( d[i].type ) {
					//		case "radio":
					//			break;
					//		case "checkbox":
					//			break;
					//	}
					// }
				}
			}
		}
	}
};
