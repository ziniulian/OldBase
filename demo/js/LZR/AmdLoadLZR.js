// AMD规范加载 LZR

define([], function() {
	if (!document.getElementById("LZR_scriptObj")) {
		var p = "bplz/dijit/LZR/";
		var s = document.createElement("script");
		s.id = "LZR_scriptObj";

		// ajax 同步请求
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
		if (xmlHttp) {
			//采用同步加载
			xmlHttp.open("GET", p+"LZR.js", false);

			//发送同步请求
			xmlHttp.send(null);

			//4代表数据发送完毕
			if ( xmlHttp.readyState == 4 ) {
				//0为访问的本地，200到300代表访问服务器成功，304代表没做修改访问的是缓存
				if((xmlHttp.status >= 200 && xmlHttp.status <300) || xmlHttp.status === 0 || xmlHttp.status == 304) {
					try{
						//IE8以及以下不支持这种方式，需要通过text属性来设置
						s.appendChild(document.createTextNode(xmlHttp.responseText));
					} catch (ex){
						s.text = xmlHttp.responseText;
					}
				}
			}
		}
/*
		// 此异步方法，无法保证其它子类的正常加载
		s.onload = function (p) {
			return function() {
				LZR.HTML5.jsPath = p;
			};
		} (p);
		s.src = p + "LZR.js";
*/
		document.getElementsByTagName("HEAD").item(0).appendChild(s);

		LZR.HTML5.jsPath = p;
		return LZR;
	}
});

