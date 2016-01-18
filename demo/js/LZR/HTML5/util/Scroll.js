// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/Scroll.js" ]);

// ------------------- 滚动条 ---------------------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/MouseDropController.js",
	LZR.HTML5.jsPath + "HTML5/util/Css.js"
]);
LZR.HTML5.Util.Scroll = function (obj) {
	/*
		参数说明：
		{
			count		// 总数
			position	// 位置
			autoLen	// 按钮自适应长度（0：不调整 padd 和 len；>0：代表按钮长度，并调整 padd 和 len）
			autoMin	// autoLen 的 最小显示比例
			hidTooBig	// autoLen 过长时，是否隐藏滚动条
			direction	// 方向（横向:1 ；纵向:2）
			padd		// 按钮补白
			len		// 可移动长度
			stripClass	// 长条 CSS 样式
			btnClass	// 按钮 CSS 样式
			div		// 容器
			noAuto	// 不要事件驱动
		}
	*/
	// 原始数据
	this.srcObj = {};

	// 总数
	this.srcObj.count = obj.count;

	// 位置
	this.position = obj.position;

	// 按钮自适应长度（0: 不调整 padd 和 len；>0: 代表按钮长度，并调整 padd 和 len）
	this.autoLen = obj.autoLen;

	// autoLen 的 最小显示比例
	this.autoMin = obj.autoMin;

	// autoLen 过长时，是否隐藏滚动条
	this.hidTooBig = obj.hidTooBig;

	// 方向（横向:1 ；纵向:2）
	this.direction = obj.direction;

	// 按钮补白
	this.srcObj.padd = obj.padd;

	// 可移动长度
	this.srcObj.len = obj.len;

	// 长条
	this.strip = document.createElement("div");
	LZR.HTML5.Util.Css.addClass (this.strip, obj.stripClass);

	// 容器
	if (obj.div) {
		this.div = obj.div;
		this.div.appendChild(this.strip);
	} else {
		this.div = this.strip;
	}

	// 按钮
	this.btn = document.createElement("div");
	this.btn.style.position = "relative";
	LZR.HTML5.Util.Css.addClass (this.btn, obj.btnClass);
	this.strip.appendChild(this.btn);

	if (!obj.noAuto) {
		// 鼠标控制器（按钮）
		this.ctrlBtn = new LZR.HTML5.Util.MouseDropController(this.btn);
		this.ctrlBtn.noMid = true;
		this.ctrlBtn.noRight = true;
		this.ctrlBtn.noClick = true;
		this.ctrlBtn.autoFlush = LZR.bind(this, this.ctrlUpdate, this.ctrlBtn);

		// 鼠标控制器（长条）
		this.ctrlStrip = new LZR.HTML5.Util.MouseDropController(this.strip);
		this.ctrlStrip.noMid = true;
		this.ctrlStrip.noRight = true;
		this.ctrlStrip.noClick = true;
		this.ctrlStrip.autoFlush = LZR.bind(this, this.ctrlUpdate, this.ctrlStrip);
	}

	// 方便计算的假常量
	this.constant = {};
};
LZR.HTML5.Util.Scroll.prototype.className = "LZR.HTML5.Util.Scroll";
LZR.HTML5.Util.Scroll.prototype.version = "0.0.0";

// 初始化
LZR.HTML5.Util.Scroll.prototype.init = function() {
	// 读取原数据
	this.count = this.srcObj.count;
	this.padd = this.srcObj.padd;
	this.len = this.srcObj.len;

	this.constant.stripPs = LZR.HTML5.Util.getDomPositionForDocument(this.strip);	// 长条位置
	this.constant.btnPs = LZR.HTML5.Util.getDomPositionForDocument(this.btn);	// 按钮位置

	// 计算可移动长度
	if ( isNaN(this.len) ) {
		if (new RegExp("%$").test(this.len)) {
			switch (this.direction) {
				case 1:		// 横向
					this.len = this.constant.stripPs.width * parseFloat(this.len, 10)/100;
					break;
				case 2:		// 纵向
					this.len = this.constant.stripPs.height * parseFloat(this.len, 10)/100;
					break;
			}
		} else {
			this.len = parseFloat(this.len, 10);
		}
	}

	// 计算按钮参数
	switch (this.direction) {
		case 1:		// 横向
			if (this.len > this.constant.stripPs.width - this.padd) {
				this.len = this.constant.stripPs.width - this.padd;
			}

			// 计算按钮的非排列方向位置
			this.btn.style.top = ((this.constant.stripPs.height - this.constant.btnPs.height) / 2) + "px";
			break;
		case 2:		// 纵向
			if (this.len > this.constant.stripPs.height - this.padd) {
				this.len = this.constant.stripPs.height - this.padd;
			}

			// 计算按钮的非排列方向位置
			this.btn.style.left = ((this.constant.stripPs.width - this.constant.btnPs.width) / 2) + "px";
			break;
	}

	// 自适应按钮长度
	this.strip.style.visibility  = "visible";
	this.initAutoLen();

	// 放置按钮
	var p = this.position;
	this.position = -1;
	this.setPosition(p);
};

// 自适应按钮长度初始化
LZR.HTML5.Util.Scroll.prototype.initAutoLen = function() {
	if (this.autoLen>0) {
		r = this.autoLen / this.count;
		if (r>=1) {
			r = 1;
			this.count = 0;
			if (this.hidTooBig) {
				this.strip.style.visibility  = "hidden";
			}
		} else {
			this.count -= this.autoLen;
		}
		r *= this.len;
		if (r < this.autoMin) {
			r = this.autoMin;
		}
		this.padd +=  r/2;
		this.len -= r;

		switch (this.direction) {
			case 1:		// 横向
				this.btn.style.width = r + "px";
				this.constant.btnPs.width = r;
				break;
			case 2:		// 纵向
				this.btn.style.height = r + "px";
				this.constant.btnPs.height = r;
				break;
		}
	}
};

// 设置按钮位置
LZR.HTML5.Util.Scroll.prototype.setPosition = function(p) {
	if (this.position !== p) {
		this.position = p;
		p = p/this.count;
		if (p>1) {
			p = 1;
		} else if (isNaN(p)) {
			p = 0;
		}
		p = p * this.len + this.padd;
		switch (this.direction) {
			case 1:		// 横向
				p -= this.constant.btnPs.width/2;
				this.btn.style.left = p + "px";
				break;
			case 2:		// 纵向
				p -= this.constant.btnPs.height/2;
				this.btn.style.top = p + "px";
				break;
		}
		this.onchange (this.position, this.count);
	}
};

// 鼠标响应事件
LZR.HTML5.Util.Scroll.prototype.ctrlUpdate = function(ctrl) {
	if (this.count > 0) {
		if (!ctrl) {
			if (this.ctrlBtn.state == this.ctrlBtn.STATE.LEFT) {
				ctrl = this.ctrlBtn;
			} else if (this.ctrlStrip.state == this.ctrlStrip.STATE.LEFT) {
				ctrl = this.ctrlStrip;
			} else {
				return;
			}
		}
		if (ctrl.state == ctrl.STATE.LEFT) {
			var p;
			var checkP = function (p, len) {
				if (p<0) {
					p = 0;
				} else if (p>len) {
					p = len;
				}
				return p;
			};

			switch (this.direction) {
				case 1:		// 横向
					p = checkP (ctrl.leftEnd.x - this.constant.stripPs.left - this.padd, this.len);
					this.btn.style.left = (p + this.padd - this.constant.btnPs.width/2) + "px";
					break;
				case 2:		// 纵向
					p = checkP (ctrl.leftEnd.y - this.constant.stripPs.top - this.padd, this.len);
					this.btn.style.top = (p + this.padd - this.constant.btnPs.height/2) + "px";
					break;
			}
			this.position = p  / this.len * this.count;
			this.onchange (this.position, this.count);
		}
	}
};

// 启动图层管理器的鼠标响应功能
LZR.HTML5.Util.Scroll.prototype.ctrlEnable = function () {
	if (this.ctrlBtn.state === this.ctrlBtn.STATE.UNABLE) {
		this.ctrlBtn.enable (false, true);
	}
	if (this.ctrlStrip.state === this.ctrlStrip.STATE.UNABLE) {
		this.ctrlStrip.enable (false, true);
	}
};

// 停止图层管理器的鼠标响应功能
LZR.HTML5.Util.Scroll.prototype.ctrlDisable = function () {
	if (this.ctrlBtn.state !== this.ctrlBtn.STATE.UNABLE) {
		this.ctrlBtn.disable();
	}
	if (this.ctrlStrip.state !== this.ctrlStrip.STATE.UNABLE) {
		this.ctrlStrip.disable();
	}
};

// 变更时回调函数（接口）
LZR.HTML5.Util.Scroll.prototype.onchange = function (position, count) {};

