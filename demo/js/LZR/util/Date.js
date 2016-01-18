// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "util/Date.js" ]);

// --------------------- JS常用时间函数 ----------------------------

LZR.Util.Date = {
	// 版本号
	version: "0.0.0",

	// 字符串转日期时间格式
	getDate: function (strDate) {
		return eval( 'new Date(' + strDate.replace( /\d+(?=-[^-]+$)/, function (a) { return parseInt(a, 10) - 1; } ).match(/\d+/g) + ')' );
	}
};
