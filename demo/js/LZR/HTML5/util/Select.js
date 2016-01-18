// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/Select.js" ]);

// ------------------- 选择元素 ---------------------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/Css.js",
	LZR.HTML5.jsPath + "HTML5/util/Event.js"
]);
LZR.HTML5.Util.Select = function (obj) {
	/*
		参数说明：
		{
			data: {		// 数据
				title: "",		// 描述
				pic: "",		// 图片默认样式
				checked: false,	// 是否被选中（null:不可选，true:选中，false:未选中）
				picOver: "",	// 图片经过样式
				picDown: "",	// 图片按下样式
			}
			type: 0,	// 描述的位置类型（0:浮动title，8:在图上边，2:在图下边，4:在图左边，6:在图右边，5:在图里边）
			titleClass: "",		// 描述默认样式
			defaultClass: "",	// 选择默认样式
			overClass: "",		// 鼠标经过样式
			downClass: "",		// 鼠标按下样式
		}
	*/

	// 数据
	this.data = obj.data;

	// 描述的位置类型（0:浮动title，8:在图上边，2:在图下边，4:在图左边，6:在图右边，5:在图里边）
	if (obj.type) {
		this.type = obj.type;
	} else {
		this.type = 0;
	}

	// 描述默认样式
	this.titleClass = obj.titleClass;

	// 选择默认样式
	this.defaultClass = obj.defaultClass;

	// 鼠标经过样式
	this.overClass = obj.overClass;

	// 鼠标按下样式
	this.downClass = obj.downClass;

	// 图片
	this.pic = document.createElement("span");
	LZR.HTML5.Util.Css.addClass(this.pic, this.data.pic);

	// 容器
	this.div = document.createElement("span");
	LZR.HTML5.Util.Css.addClass(this.div, this.defaultClass);
	if (this.data.checked) {
		this.addDownCss();
	}

	// 描述
	this.createTitle();

	// 生成事件
	this.createEvent();
};
LZR.HTML5.Util.Select.prototype.className = "LZR.HTML5.Util.Select";
LZR.HTML5.Util.Select.prototype.version = "0.0.0";

// 生成描述
LZR.HTML5.Util.Select.prototype.createTitle = function() {
	switch (this.type) {
		case 0:
			this.pic.title = this.data.title;
			break;
		case 5:
			this.pic.innerHTML = this.data.title;
			break;
		default:
			this.title = document.createElement("span");
			this.title.innerHTML = this.data.title;
			LZR.HTML5.Util.Css.addClass(this.title, this.titleClass);
			switch (this.type) {
				case 8:
					this.div.appendChild(this.title);
					this.div.innerHTML += "<br>";
					this.div.appendChild(this.pic);
					break;
				case 2:
					this.div.appendChild(this.pic);
					this.div.innerHTML += "<br>";
					this.div.appendChild(this.title);
					break;
				case 4:
					this.div.appendChild(this.title);
					this.div.appendChild(this.pic);
					break;
				case 6:
					this.div.appendChild(this.pic);
					this.div.appendChild(this.title);
					break;
			}
			return;
	}

	this.div.appendChild(this.pic);
};

// 生成事件
LZR.HTML5.Util.Select.prototype.createEvent = function() {
	LZR.HTML5.Util.Event.addEvent (this.div, "mousedown", LZR.bind(this, this.handleDown), false);
	LZR.HTML5.Util.Event.addEvent (this.div, "mouseup", LZR.bind(this, this.handleUp), false);
	LZR.HTML5.Util.Event.addEvent (this.div, "mouseover", LZR.bind(this, this.handleOver), false);
	LZR.HTML5.Util.Event.addEvent (this.div, "mouseout", LZR.bind(this, this.handleOut), false);
};

// 处理按下事件
LZR.HTML5.Util.Select.prototype.handleDown = function() {
	this.addDownCss();
	if ( this.data.checked === false ) {
		this.data.checked = true;
	} else if ( this.data.checked === true ) {
		this.data.checked = false;
	}
	this.onDown(this.data);
	if (this.manager) {
		this.manager.handleDown (this);
	}
};

// 处理抬起事件
LZR.HTML5.Util.Select.prototype.handleUp = function() {
	if (!this.data.checked) {
		this.delDownCss();
	}
	this.onUp(this.data);
	if (this.manager) {
		this.manager.handleUp (this);
	}
};

// 处理经过事件
LZR.HTML5.Util.Select.prototype.handleOver = function() {
	this.addOverCss();
};

// 处理离开事件
LZR.HTML5.Util.Select.prototype.handleOut = function() {
	this.delAllCss();
};

// 添加经过样式
LZR.HTML5.Util.Select.prototype.addOverCss = function() {
	LZR.HTML5.Util.Css.addClass(this.div, this.overClass);
	LZR.HTML5.Util.Css.addClass(this.pic, this.data.picOver);
};

// 添加按下样式
LZR.HTML5.Util.Select.prototype.addDownCss = function() {
	LZR.HTML5.Util.Css.addClass(this.div, this.downClass);
	LZR.HTML5.Util.Css.addClass(this.pic, this.data.picDown);
};

// 删除经过样式
LZR.HTML5.Util.Select.prototype.delOverCss = function() {
	LZR.HTML5.Util.Css.removeClass(this.div, this.overClass);
	LZR.HTML5.Util.Css.removeClass(this.pic, this.data.picOver);
};

// 删除按下样式
LZR.HTML5.Util.Select.prototype.delDownCss = function() {
	LZR.HTML5.Util.Css.removeClass(this.div, this.downClass);
	LZR.HTML5.Util.Css.removeClass(this.pic, this.data.picDown);
};

// 取消所有样式
LZR.HTML5.Util.Select.prototype.delAllCss = function() {
	this.delOverCss();
	if (!this.data.checked) {
		this.delDownCss();
	}
};

// 设置是否选中
LZR.HTML5.Util.Select.prototype.setChecked = function(b) {
	if (b) {
		this.data.checked = true;
		this.addDownCss();
	} else {
		this.data.checked = false;
		this.delDownCss();
	}
};

// 按下时回调函数（接口）
LZR.HTML5.Util.Select.prototype.onDown = function(data) {};

// 抬起时回调函数（接口）
LZR.HTML5.Util.Select.prototype.onUp = function(data) {};

