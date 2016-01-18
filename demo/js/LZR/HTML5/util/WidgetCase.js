// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/WidgetCase.js" ]);

// ------------------- 配合框架中 Widget 部件的容器 ---------------------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/Css.js",
	LZR.HTML5.jsPath + "HTML5/util/Event.js"
]);
LZR.HTML5.Util.WidgetCase = function (obj) {
	/*
		参数说明：
		{
			father: 父类
			cls: 样式
		}
	*/
	this.parent = obj.father;
	this.div = document.createElement("DIV");
	if (obj.cls) {
		LZR.HTML5.Util.Css.addClass(this.div, obj.cls);
	}
};
LZR.HTML5.Util.WidgetCase.prototype.className = "LZR.HTML5.Util.WidgetCase";
LZR.HTML5.Util.WidgetCase.prototype.version = "0.0.0";

// 部件加载
LZR.HTML5.Util.WidgetCase.prototype.load = function () {
	this.parent.appendChild(this.div);
};

// 部件卸载
LZR.HTML5.Util.WidgetCase.prototype.unload = function () {
	this.parent.removeChild(this.div);
};

// 加载 iframe
LZR.HTML5.Util.WidgetCase.prototype.loadIframe = function (url, callback) {
	var ifm = document.createElement("IFRAME");
	LZR.HTML5.Util.Event.addEvent (ifm, "load", callback);
	ifm.src = url;
	ifm.scrolling="no";
	ifm.frameBorder=0;
	ifm.width = "100%";
	ifm.height = "100%";
	this.div.appendChild(ifm);
};

// 清空DIV
LZR.HTML5.Util.WidgetCase.prototype.empty = function (url) {
	this.div.innerHTML = "";
};

// 重新加载 iframe
LZR.HTML5.Util.WidgetCase.prototype.reLoadIframe = function (url, callback) {
	this.empty();
	this.loadIframe(url, callback);
};
