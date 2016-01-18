// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/Css.js" ]);

// --------------------- HTML CSS样式函数 ----------------------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/Util.js"
]);
LZR.HTML5.Util.Css = {
	// 版本号
	version: "0.0.0",

	// 检查 class 样式是否存在
	hasClass: function (obj, cls) {
		if (cls && cls !== "") {
			return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
		} else {
			return false;
		}
	},

	// 添加 class 样式
	addClass: function (obj, cls) {
		if (cls && cls !== "" && !LZR.HTML5.Util.Css.hasClass(obj, cls)) {
			obj.className += " " + cls + " ";
		}
	},

	// 移除 class 样式
	removeClass: function (obj, cls) {
		if (LZR.HTML5.Util.Css.hasClass(obj, cls)) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			obj.className = obj.className.replace(reg, '');
		}
	},

	// class 样式替换
	toggleClass: function (obj,cls){
		if(LZR.HTML5.Util.Css.hasClass(obj,cls)){
			LZR.HTML5.Util.Css.removeClass(obj, cls);
		}else{
			LZR.HTML5.Util.Css.addClass(obj, cls);
		}
	}

};
