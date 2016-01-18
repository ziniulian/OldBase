// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5\\util\\MouseDropController.js" ]);

// ------------------- 鼠标拖放控制器 ---------------------------

LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5\\util\\Util.js" ]);
LZR.HTML5.Util.MouseDropController = function (obj) {
	// 控制对象
	if (obj) {
		this.ctrlDom = obj;
	} else {
		this.ctrlDom = document;
	}

	// 控制状态
	this.state = this.STATE.NONE;
	if ('\v'=='v') {
		// IE 6、7、8 版 rotate
		this.STATE = {NONE: -1, LEFT: 1, MID: 4, RIGHT: 2};
	}

	// 左鍵开始点
	this.leftStart = {x:0, y:0};

	// 左鍵结束点
	this.leftEnd = {x:0, y:0};

	// 中鍵开始点
	this.midStart = {x:0, y:0};

	// 中鍵结束点
	this.midEnd = {x:0, y:0};

	// 右鍵开始点
	this.rightStart = {x:0, y:0};

	// 右鍵结束点
	this.rightEnd = {x:0, y:0};

	// 滚轮值
	this.wheelValue = 0;

	// 左鍵不可用
	this.noLeft = false;

	// 中鍵不可用
	this.noMid = false;

	// 右鍵不可用
	this.noRight = false;

	// 事件回调
	this.callbacks =  {
		// 滚轮事件回调函数
		wheel: null,

		// 鼠标按下事件回调函数
		mDown: null,

		// 鼠标抬起事件回调函数
		mUp: null,

		// 鼠标平移事件回调函数
		mMove: null
	};
};
LZR.HTML5.Util.MouseDropController.prototype.className = "LZR.HTML5.Util.MouseDropController";
LZR.HTML5.Util.MouseDropController.prototype.version = "0.0.0";

// 状态枚举
LZR.HTML5.Util.MouseDropController.prototype.STATE = {NONE: -1, LEFT: 0, MID: 1, RIGHT: 2};

// 设置控制器可用
LZR.HTML5.Util.MouseDropController.prototype.enable = function(nodown, nowheel, nomenu) {
	var tag = new LZR.HTML5.Util.ThisTag(this);

	if (!nowheel && !this.callbacks.wheel) {
		this.callbacks.wheel = LZR.HTML5.Util.addWheel(this.ctrlDom, function(e) {
			tag.tagCall (function() {
				this.mouseWheel (e);
			});
		}, false);
	}

	if (!nodown && !this.callbacks.mDown) {
		this.callbacks.mDown = LZR.HTML5.Util.addEvent(this.ctrlDom, "mousedown", function(e) {
			tag.tagCall (function() {
				this.mouseDown (e);
			});
		}, false);
	}

	// 右键菜单屏蔽
	if (nomenu || !this.noRight) {
		LZR.HTML5.Util.addEvent(this.ctrlDom, 'contextmenu', function(e) {
			LZR.HTML5.Util.stopDefault();
		}, false );
	}
};

// 设置控制器不可用
LZR.HTML5.Util.MouseDropController.prototype.disable = function() {
	if (this.callbacks.mDown) {
		LZR.HTML5.Util.removeEvent(this.ctrlDom, "mousedown", this.callbacks.mDown, false);
		this.callbacks.mDown = null;
	}
	if (this.callbacks.wheel) {
		LZR.HTML5.Util.removeWheel(this.ctrlDom, this.callbacks.wheel, false);
		this.callbacks.wheel = null;
	}
};

// 鼠标滚动
LZR.HTML5.Util.MouseDropController.prototype.mouseWheel = function(e) {
	LZR.HTML5.Util.stopDefault(e);
	LZR.HTML5.Util.stopBubble(e);
	
	this.wheelHandle(e.delta);
	
	this.autoFlush();
};

// 鼠标按下
LZR.HTML5.Util.MouseDropController.prototype.mouseDown = function(e) {
	LZR.HTML5.Util.stopDefault(e);
	LZR.HTML5.Util.stopBubble(e);

	if (this.state == this.STATE.NONE) {
		this.state = LZR.HTML5.Util.getEvent(e).button;

		var tag = new LZR.HTML5.Util.ThisTag(this);

		this.callbacks.mMove = LZR.HTML5.Util.addEvent(document, "mousemove", function(e) {
			tag.tagCall (function() {
				this.mouseMove (e);
			});
		}, false);

		this.callbacks.mUp = LZR.HTML5.Util.addEvent(document, "mouseup", function(e) {
			tag.tagCall (function() {
				this.mouseUp (e);
			});
		}, false);
	}

	var p = LZR.HTML5.Util.getMousePosition(e);
	switch (this.state) {
		case this.STATE.LEFT:
			if (!this.noLeft) {
				this.leftStartHandle(p.x, p.y);
			}
			break;
		case this.STATE.MID:
			if (!this.noMid) {
				this.midStartHandle(p.x, p.y);
			}
			break;
		case this.STATE.RIGHT:
			if (!this.noRight) {
				this.rightStartHandle(p.x, p.y);
			}
			break;
	}
};

// 鼠标移动
LZR.HTML5.Util.MouseDropController.prototype.mouseMove = function(e) {
	LZR.HTML5.Util.stopDefault(e);
	LZR.HTML5.Util.stopBubble(e);

	var p = LZR.HTML5.Util.getMousePosition(e);
	switch (this.state) {
		case this.STATE.LEFT:
			if (!this.noLeft) {
				this.leftEndHandle(p.x, p.y);
			}
			break;
		case this.STATE.MID:
			if (!this.noMid) {
				this.midEndHandle(p.x, p.y);
			}
			break;
		case this.STATE.RIGHT:
			if (!this.noRight) {
				this.rightEndHandle(p.x, p.y);
			}
			break;
	}
	
	this.autoFlush();
};

// 鼠标抬起
LZR.HTML5.Util.MouseDropController.prototype.mouseUp = function(e) {
	this.mouseMove(e);

	this.state = this.STATE.NONE;

	if (this.callbacks.mMove) {
		LZR.HTML5.Util.removeEvent(document, "mousemove", this.callbacks.mMove, false);
		this.callbacks.mMove = null;
	}

	if (this.callbacks.mUp) {
		LZR.HTML5.Util.removeEvent(document, "mouseup", this.callbacks.mUp, false);
		this.callbacks.mUp = null;
	}
};

// 处理滚轮值
LZR.HTML5.Util.MouseDropController.prototype.wheelHandle = function(delta) {
	this.wheelValue += delta;
};

// 处理左键开始值
LZR.HTML5.Util.MouseDropController.prototype.leftStartHandle = function(x, y) {
	this.leftStart.x = x;
	this.leftStart.y = y;
	this.leftEnd = LZR.HTML5.Util.clone(this.leftStart);
};

// 处理左键结束值
LZR.HTML5.Util.MouseDropController.prototype.leftEndHandle = function(x, y) {
	this.leftEnd.x = x;
	this.leftEnd.y = y;
};

// 处理中键开始值
LZR.HTML5.Util.MouseDropController.prototype.midStartHandle = function(x, y) {
	this.midStart.x = x;
	this.midStart.y = y;
	this.midEnd = LZR.HTML5.Util.clone(this.midStart);
	
};

// 处理中键结束值
LZR.HTML5.Util.MouseDropController.prototype.midEndHandle = function(x, y) {
	this.midEnd.x = x;
	this.midEnd.y = y;
};

// 处理右键开始值
LZR.HTML5.Util.MouseDropController.prototype.rightStartHandle = function(x, y) {
	this.rightStart.x = x;
	this.rightStart.y = y;
	this.rightEnd = LZR.HTML5.Util.clone(this.rightStart);
};

// 处理右键结束值
LZR.HTML5.Util.MouseDropController.prototype.rightEndHandle = function(x, y) {
	this.rightEnd.x = x;
	this.rightEnd.y = y;
};

// 自动刷新
LZR.HTML5.Util.MouseDropController.prototype.autoFlush = function() {};
