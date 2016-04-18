// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "util/Date.js" ]);

// --------------------- JS常用时间函数 ----------------------------

LZR.Util.Date = {
	// 版本号
	version: "0.0.0",

	// 字符串转日期时间格式
	getDate: function (strDate) {
		return eval( 'new Date(' + strDate.replace( /\d+(?=-[^-]+$)/, function (a) { return parseInt(a, 10) - 1; } ).match(/\d+/g) + ')' );
	},

	// 时间加N个小时的时间
	addHour: function (n/*as:int*/, date/*as:Date*/, clone/*as:boolean*/)/*as:Date*/ {
		if (!date) {
			date = new Date();
		} else if (clone) {
			date = new Date(date.valueOf());
		}
		date.setTime(date.valueOf() + n * 3600 * 1000);
		return date;
	},

	// 时间圆整
	normalize: function (date/*as:Date*/, hour/*as:int*/, clone/*as:boolean*/)/*as:Date*/ {
		if (!date) {
			date = new Date();
		} else if (clone) {
			date = new Date(date.valueOf());
		}
		if (isNaN(hour)) {
			hour = date.getHours();
		}
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		date.setHours(hour);
		return date;
	},

	// 转换为 yyyy-mm-dd 格式的日期字符串
	toDate: function (date) {
		return date.getFullYear() + "-" +
			LZR.HTML5.Util.format (date.getMonth()+1, 2, "0") + "-" +
			LZR.HTML5.Util.format (date.getDate(), 2, "0");
	}
};
