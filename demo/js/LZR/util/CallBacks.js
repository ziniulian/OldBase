// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "util/CallBacks.js" ]);

// --------------------- 通用回调函数集合 ----------------------------

LZR.Util.CallBacks = function (obj) {
	// 是否触发事件
	this.enableEvent = true;

	// 事件自动恢复
	this.autoEvent = true;

	// 调用对象
	this.obj = this;

	// 回调函数集合
	this.funs = {
		length: 0
	};

	// 设置参数
	if (obj) {
		this.obj = obj;
	}
};
LZR.Util.CallBacks.prototype.className = "LZR.Util.CallBacks";
LZR.Util.CallBacks.prototype.version = "0.0.2";

// 添加回调函数
LZR.Util.CallBacks.prototype.append = function (fun, name) {
	if (name === undefined || name === null) {
		name = this.funs.length;
	}
	if (this.funs[name] === undefined) {
		this.funs.length ++;
	}
	this.funs[name] = {
		// 是否触发事件
		enableEvent: true,

		// 事件自动恢复
		autoEvent: true,

		// 函数
		fun: fun
	};
};

// 删除回调函数
LZR.Util.CallBacks.prototype["delete"] = function (funName) {
	if (this.funs[funName] !== undefined) {
		this.funs[funName] = undefined;
		this.funs.length --;
	}
};

// 执行回调函数
LZR.Util.CallBacks.prototype.execute = function () {
	if (this.enableEvent) {
		var b = true;	// 回调函数正常执行则返回 true，否则返回 false
		for (var s in this.funs) {
			switch (s) {
				case "length":
					break;
				default:
					if (this.funs[s].enableEvent) {
						if ( (this.funs[s].fun.apply ( this.obj, arguments )) === false ) {
							b = false;
						}
					} else {
						this.funs[s].enableEvent = this.funs[s].autoEvent;
					}
					break;
			}
		}
		return b;
	} else {
		this.enableEvent = this.autoEvent;
		return false;
	}
};

