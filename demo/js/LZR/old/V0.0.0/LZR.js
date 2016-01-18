var LZR = {
	// 版本号
	version: "0.0.0",

	// 包结构：
	HTML5: {
		// 大数据专案
		ProductLib: null,

		// WebGL 相关功能
		WebGL: {
			// Three.js 相关功能
			Three: {}
		},

		// HTML5 各种常用功能
		Util: {},

		// ---------------------------------- HTML5 必用函数 --------------------------
		jsPath: "js/LZR/",	// JS 路径
		logger: null,		// LOG输出

		// 获取类名
		getClassName: function ( obj ) {
			if (null === obj)  return "null";

			var type = typeof obj;
			if (type != "object")  return type;

			var c = Object.prototype.toString.apply ( obj );
			c = c.substring( 8, c.length-1 );
			return c;
		},

		// 网页加载 JS 文件
		loadJs: function(array, type) {
			var head = document.getElementsByTagName('head')[0];
			var path = this.getClassName ( array );
			if ( path == "string" && array ) {
				path = array;
				array = [path];
				path = "Array";
			}
			if (path == "Array") {
				for(path in array) {
					path = array[path];
					if (path) {
						var myHead;
						var myJs;
						switch (type) {
							case "css":
								myHead = document.getElementsByTagName("HEAD").item(0);
								myJs = document.createElement( "style" );
								break;
							default:
								myHead = document.getElementsByTagName("HEAD").item(0);
								myJs = document.createElement( "script" );
								break;
						}
						if (!document.getElementById(path)) {
							var txt = this.loadFileByAjax(path, path, type);
							if (txt) {
								myJs.id = path;
								try{
									//IE8以及以下不支持这种方式，需要通过text属性来设置
									myJs.appendChild(document.createTextNode(txt));
								} catch (ex){
									myJs.text = txt;
								}
								myHead.appendChild( myJs );
// this.alog("\tOK \t " + path);
//							} else {
// this.alog("\t<------ error \t " + path + " \t error ------>");
							}
//						} else {
// this.alog("\t<------ pass \t " + path + " \t pass ------>");
						}
					}
				}
			}
		},

		// 网页加载 CSS 文件
		loadCss: function(cssArray) {
			this.webJs(cssArray, "css");
		},

		// 获取 Ajax 对象
		getAjax: function () {
			var xmlHttp = null;
			try{
				xmlHttp = new XMLHttpRequest();
			} catch (MSIEx) {
				var activeX = [ "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP" ];
				for (var i=0; i < activeX.length; i++) {
					try {
						xmlHttp = new ActiveXObject( activeX[i] );
					} catch (e) {}
				}
			}
			return xmlHttp;
/*
			if (window.ActiveXObject) {		//IE
				try {
					//IE6以及以后版本中可以使用
					return new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					//IE5.5以及以后版本可以使用
					return new ActiveXObject("Microsoft.XMLHTTP");
				}
			} else if (window.XMLHttpRequest) {	//Firefox，Opera 8.0+，Safari，Chrome
				return new XMLHttpRequest();
			}
			return null;
*/
		},

		// Ajax 同步加载文件
		loadFileByAjax: function (url){
			var  xmlHttp = this.getAjax();
			if (!xmlHttp) return null;

			//采用同步加载
			xmlHttp.open("GET", url, false);

			//发送同步请求
			xmlHttp.send(null);

			//4代表数据发送完毕
			if ( xmlHttp.readyState == 4 ) {
				//0为访问的本地，200到300代表访问服务器成功，304代表没做修改访问的是缓存
				if((xmlHttp.status >= 200 && xmlHttp.status <300) || xmlHttp.status === 0 || xmlHttp.status == 304) {
// this.alog(url);
					return xmlHttp.responseText;
				}
			}
			return null;
		},

		// 创建LOG
		createLog: function() {
			if (!this.logger) {
				this.logger = document.getElementById("LZR_LOG");
				if (!this.logger) {
					this.logger = document.createElement( "pre" );
					this.logger.id = "LZR_LOG";
					if (document.body.children.length) {
						document.body.insertBefore(this.logger, document.body.children[0]);
					} else {
						document.body.appendChild(this.logger);
					}
				}
			}
		},

		// 刷新LOG
		log: function(memo) {
			this.createLog();
			this.logger.innerHTML = memo;
		},

		// 添加LOG
		alog: function(memo) {
			this.createLog();
			this.logger.innerHTML += memo;
			this.logger.innerHTML += "<br>";
		},

		// 返回上 N 级路径
		upPath: function(n) {
			var path = "";
			for (var i=0; i<n; i++) {
				path += "..\\";
			}
			return path;
		}
	}, // HTML5 end
	Util: {
		// 图形学相关算法
		Graphics: {}
	}, // Util end
	Mongo: null,
	Nodejs: null,
	Java: null,
	Cpp: null
};
