// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "util/ValCtrl.js" ]);

// --------------------- 值控制器 ----------------------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/CallBacks.js"
]);
LZR.Util.ValCtrl = function (obj) {
	// 值
	this.val = null;

	// 是否触发事件
	this.enableEvent = true;

	// 事件自动恢复
	this.autoEvent = true;

	// 事件回调
	this.event = {
		"before": new LZR.Util.CallBacks (this),
		"change": new LZR.Util.CallBacks (this),
		"set": new LZR.Util.CallBacks (this)
	};

	// 设置参数
	if (obj !== undefined) {
		this.val = obj;
	}
};
LZR.Util.ValCtrl.prototype.className = "LZR.Util.ValCtrl";
LZR.Util.ValCtrl.prototype.version = "0.0.0";

// 获取值
LZR.Util.ValCtrl.prototype.get = function () {
	return val;
};

// 设置值
LZR.Util.ValCtrl.prototype.set = function (obj, doEvent) {
	if (doEvent === false) {
		this.val = obj;
	} else {
		if (this.enableEvent) {
			if (this.beforeSet (obj, this) !== false) {
				if (obj !== this.val) {
					this.val = obj;
					this.onChange (obj, this);
				}
				this.onSet (obj, this);
			}
		} else {
			this.enableEvent = this.autoEvent;
			this.val = obj;
		}
	}
};

// 设置事件调用对象
LZR.Util.ValCtrl.prototype.setEventObj = function (obj) {
	this.event.before.obj = obj;
	this.event.change.obj = obj;
	this.event.set.obj = obj;
};

// -------------------- 事件 ------------------

// 设置值之前触发的事件
LZR.Util.ValCtrl.prototype.beforeSet = function (val, self) {
	return this.event.before.execute (val, self);
};

// 值变动后触发的事件
LZR.Util.ValCtrl.prototype.onChange = function (val, self) {
	return this.event.change.execute (val, self);
};

// 设置值后触发的事件
LZR.Util.ValCtrl.prototype.onSet = function (val, self) {
	return this.event.set.execute (val, self);
};

