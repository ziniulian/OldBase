// 鼠标拖放控制器
MouseDropController = function (obj) {
	if (obj) {
		this._MouseDropController(obj);
	}
};
MouseDropController.prototype._MouseDropController = function (obj) {
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

// 状态枚举
MouseDropController.prototype.STATE = {NONE: -1, LEFT: 0, MID: 1, RIGHT: 2};

// 设置控制器可用
MouseDropController.prototype.enable = function(nodown, nowheel, nomenu) {
	var tag = new Lzrut.ThisTag(this);

	if (!nowheel && !this.callbacks.wheel) {
		this.callbacks.wheel = Lzrut.addWheel(this.ctrlDom, function(e) {
			tag.tagCall (function() {
				this.mouseWheel (e);
			});
		}, false);
	}

	if (!nodown && !this.callbacks.mDown) {
		this.callbacks.mDown = Lzrut.addEvent(this.ctrlDom, "mousedown", function(e) {
			tag.tagCall (function() {
				this.mouseDown (e);
			});
		}, false);
	}

	// 右键菜单屏蔽
	if (nomenu || !this.noRight) {
		Lzrut.addEvent(this.ctrlDom, 'contextmenu', function(e) {
			Lzrut.stopDefault();
		}, false );
	}
};

// 设置控制器不可用
MouseDropController.prototype.disable = function() {
	if (this.callbacks.mDown) {
		Lzrut.removeEvent(this.ctrlDom, "mousedown", this.callbacks.mDown, false);
		this.callbacks.mDown = null;
	}
	if (this.callbacks.wheel) {
		Lzrut.removeWheel(this.ctrlDom, this.callbacks.wheel, false);
		this.callbacks.wheel = null;
	}
};

// 鼠标滚动
MouseDropController.prototype.mouseWheel = function(e) {
	Lzrut.stopDefault(e);
	Lzrut.stopBubble(e);
	
	this.wheelHandle(e.delta);
	
	this.autoFlush();
};

// 鼠标按下
MouseDropController.prototype.mouseDown = function(e) {
	Lzrut.stopDefault(e);
	Lzrut.stopBubble(e);

	if (this.state == this.STATE.NONE) {
		this.state = Lzrut.getEvent(e).button;

		var tag = new Lzrut.ThisTag(this);

		this.callbacks.mMove = Lzrut.addEvent(document, "mousemove", function(e) {
			tag.tagCall (function() {
				this.mouseMove (e);
			});
		}, false);

		this.callbacks.mUp = Lzrut.addEvent(document, "mouseup", function(e) {
			tag.tagCall (function() {
				this.mouseUp (e);
			});
		}, false);
	}

	var p = Lzrut.getMousePosition(e);
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
MouseDropController.prototype.mouseMove = function(e) {
	Lzrut.stopDefault(e);
	Lzrut.stopBubble(e);

	var p = Lzrut.getMousePosition(e);
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
MouseDropController.prototype.mouseUp = function(e) {
	this.mouseMove(e);

	this.state = this.STATE.NONE;

	if (this.callbacks.mMove) {
		Lzrut.removeEvent(document, "mousemove", this.callbacks.mMove, false);
		this.callbacks.mMove = null;
	}

	if (this.callbacks.mUp) {
		Lzrut.removeEvent(document, "mouseup", this.callbacks.mUp, false);
		this.callbacks.mUp = null;
	}
};

// 处理滚轮值
MouseDropController.prototype.wheelHandle = function(delta) {
	this.wheelValue += delta;
};

// 处理左键开始值
MouseDropController.prototype.leftStartHandle = function(x, y) {
	this.leftStart.x = x;
	this.leftStart.y = y;
	this.leftEnd = Lzrut.clone(this.leftStart);
};

// 处理左键结束值
MouseDropController.prototype.leftEndHandle = function(x, y) {
	this.leftEnd.x = x;
	this.leftEnd.y = y;
};

// 处理中键开始值
MouseDropController.prototype.midStartHandle = function(x, y) {
	this.midStart.x = x;
	this.midStart.y = y;
	this.midEnd = Lzrut.clone(this.midStart);
	
};

// 处理中键结束值
MouseDropController.prototype.midEndHandle = function(x, y) {
	this.midEnd.x = x;
	this.midEnd.y = y;
};

// 处理右键开始值
MouseDropController.prototype.rightStartHandle = function(x, y) {
	this.rightStart.x = x;
	this.rightStart.y = y;
	this.rightEnd = Lzrut.clone(this.rightStart);
};

// 处理右键结束值
MouseDropController.prototype.rightEndHandle = function(x, y) {
	this.rightEnd.x = x;
	this.rightEnd.y = y;
};

// 自动刷新
MouseDropController.prototype.autoFlush = function() {};
