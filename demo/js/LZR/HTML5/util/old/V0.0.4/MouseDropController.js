// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/MouseDropController.js" ]);

// ------------------- 鼠标拖放控制器 ---------------------------

LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/Util.js" ]);
LZR.HTML5.Util.MouseDropController = function (obj) {
	// 控制对象
	if (obj) {
		this.ctrlDom = obj;
	} else {
		this.ctrlDom = document;
	}

	// 控制状态
	this.state = this.STATE.UNABLE;
	if ('\v'=='v') {
		// IE 6、7、8 版 rotate
		this.STATE.LEFT = 1;
		this.STATE.MID = 4;
	}

	// 鼠标默认样式
	this.defaultCursor = obj.style.cursor;

	// 鼠标左键按下样式
	this.leftCursor = null;

	// 鼠标中键按下样式
	this.midCursor = null;

	// 鼠标右键按下样式
	this.rightCursor = null;

	// 鼠标当前页面位置
	this.currentPage = {x:0, y:0};

	// 鼠标当前容器内位置
	this.currentSelf = {x:0, y:0};

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

	// 单击不可用
	this.noClick = false;

	// 长按不可用
	this.noLong = true;

	// 鼠标经过不可用
	this.noCurrentMove = true;

	// 单击延时（毫秒）
	this.clickTime = 300;

	// 事件回调
	this.callbacks =  {
		// 滚轮事件回调函数
		wheel: null,

		// 鼠标按下事件回调函数
		mDown: null,

		// 鼠标抬起事件回调函数
		mUp: null,

		// 鼠标平移事件回调函数
		mMove: null,

		// 获取鼠标当前位置事件回调函数
		mCurrentMove: null,

		// 单击延时函数
		click: null
	};
};
LZR.HTML5.Util.MouseDropController.prototype.className = "LZR.HTML5.Util.MouseDropController";
LZR.HTML5.Util.MouseDropController.prototype.version = "0.0.4";

// 状态枚举
LZR.HTML5.Util.MouseDropController.prototype.STATE = {UNABLE:-2, NONE: -1, LEFT: 0, MID: 1, RIGHT: 2, CLICK:101, LONG:102};

// 设置控制器可用
LZR.HTML5.Util.MouseDropController.prototype.enable = function(nodown, nowheel, nomenu) {
	if (!nowheel && !this.callbacks.wheel) {
		this.callbacks.wheel = LZR.HTML5.Util.addWheel (this.ctrlDom, LZR.HTML5.Util.bind (this, this.mouseWheel), false);
	}

	if (!nodown && !this.callbacks.mDown) {
		this.callbacks.mDown = LZR.HTML5.Util.addEvent (this.ctrlDom, "mousedown", LZR.HTML5.Util.bind (this, this.mouseDown), false);
	}

	if (!this.noCurrentMove && !this.callbacks.mCurrentMove) {
		this.callbacks.mCurrentMove = LZR.HTML5.Util.addEvent (this.ctrlDom, "mousemove", LZR.HTML5.Util.bind (this, this.mouseCurrentMove), false);
	}

	// 右键菜单屏蔽
	if (nomenu || !this.noRight) {
		LZR.HTML5.Util.addEvent(this.ctrlDom, 'contextmenu', function(e) {
			LZR.HTML5.Util.stopDefault();
		}, false );
	}
	this.state = this.STATE.NONE;
};

// 设置控制器不可用
LZR.HTML5.Util.MouseDropController.prototype.disable = function() {
	if (this.callbacks.mCurrentMove) {
		LZR.HTML5.Util.removeEvent(this.ctrlDom, "mousemove", this.callbacks.mCurrentMove, false);
		this.callbacks.mousemove = null;
	}
	if (this.callbacks.mDown) {
		LZR.HTML5.Util.removeEvent(this.ctrlDom, "mousedown", this.callbacks.mDown, false);
		this.callbacks.mDown = null;
	}
	if (this.callbacks.wheel) {
		LZR.HTML5.Util.removeWheel(this.ctrlDom, this.callbacks.wheel, false);
		this.callbacks.wheel = null;
	}
	this.state = this.STATE.UNABLE;
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
		this.callbacks.mMove = LZR.HTML5.Util.addEvent (document, "mousemove", LZR.HTML5.Util.bind (this, this.mouseMove), false);
		this.callbacks.mUp = LZR.HTML5.Util.addEvent (document, "mouseup", LZR.HTML5.Util.bind (this, this.mouseUp), false);
	}

	var p = LZR.HTML5.Util.getMousePosition(e);
	switch (this.state) {
		case this.STATE.LEFT:
			if (!this.noLeft) {
				this.leftStartHandle(p.x, p.y);
			}
			if (!this.noClick) {
				this.state = this.STATE.CLICK;
				this.callbacks.click = setTimeout( LZR.HTML5.Util.bind (this, function() {
					this.callbacks.click = null;
					if (this.noLong) {
						this.state = this.STATE.LEFT;
					} else {
						this.state = this.STATE.LONG;
					}
				}), this.clickTime);
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
		case this.STATE.CLICK:
			clearTimeout (this.callbacks.click);
			this.callbacks.click = null;
		case this.STATE.LONG:
			this.state = this.STATE.LEFT;
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

// 鼠标经过当前位置
LZR.HTML5.Util.MouseDropController.prototype.mouseCurrentMove = function(e) {
	var p = LZR.HTML5.Util.getMousePosition(e);
	this.currentPage = LZR.HTML5.Util.clone(p);
	var d = LZR.HTML5.Util.getDomPositionForDocument(this.ctrlDom);
	p.x -= d.left;
	p.y -= d.top;
	this.currentSelf = p;
	this.autoCurrentMove (p.x, p.y);
};

// 鼠标抬起
LZR.HTML5.Util.MouseDropController.prototype.mouseUp = function(e) {

	switch (this.state) {
		case this.STATE.CLICK:
			p = LZR.HTML5.Util.getMousePosition(e);
			clearTimeout (this.callbacks.click);
			this.callbacks.click = null;
			this.autoClick(p.x, p.y);
			break;
		case this.STATE.LONG:
			p = LZR.HTML5.Util.getMousePosition(e);
			this.autoLong(p.x, p.y);
			break;
	}

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

	// 恢复鼠标指针样式
	if ( this.ctrlDom.style.cursor !== this.defaultCursor ) {
		this.ctrlDom.style.cursor = this.defaultCursor;
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
	if (this.leftCursor) {
		this.ctrlDom.style.cursor = this.leftCursor;
	}
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
	if (this.midCursor) {
		this.ctrlDom.style.cursor = this.midCursor;
	}
	
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
	if (this.rightCursor) {
		this.ctrlDom.style.cursor = this.rightCursor;
	}
};

// 处理右键结束值
LZR.HTML5.Util.MouseDropController.prototype.rightEndHandle = function(x, y) {
	this.rightEnd.x = x;
	this.rightEnd.y = y;
};

// 鼠标拖动响应事件（自动刷新，接口）
LZR.HTML5.Util.MouseDropController.prototype.autoFlush = function() {};

// 鼠标单击响应事件（接口）
LZR.HTML5.Util.MouseDropController.prototype.autoClick = function (x, y) {};

// 鼠标长按响应事件（接口）
LZR.HTML5.Util.MouseDropController.prototype.autoLong = function (x, y) {};

// 鼠标经过响应事件（接口）
LZR.HTML5.Util.MouseDropController.prototype.autoCurrentMove = function(x, y) {};


