// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/Selector.js" ]);

// ------------------- 选择器 ---------------------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/Select.js"
]);
LZR.HTML5.Util.Selector = function (obj) {
	/*
		参数说明：
		{
			data: [],	// 数据
			type: 0,		// 描述的位置类型（0:浮动title，8:在图上边，2:在图下边，4:在图左边，6:在图右边，5:在图里边）
			checked: 0,		// 选中状态（0:不可选，1:单选，2:多选）
			titleClass: "",		// 描述默认样式
			defaultClass: "",	// 选择默认样式
			overClass: "",		// 鼠标经过样式
			downClass: "",	// 鼠标按下样式
			rowNum: 0,		// 每行个数
			div: null,		// 容器
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

	// 选中状态（0:不可选，1:单选，2:多选）
	if (obj.checked) {
		this.checked = obj.checked;
	} else {
		this.checked = 0;
	}

	// 每行个数
	if (obj.rowNum) {
		this.rowNum = obj.rowNum;
	} else {
		this.rowNum = 0;
	}

	// 描述默认样式
	this.titleClass = obj.titleClass;

	// 选择默认样式
	this.defaultClass = obj.defaultClass;

	// 鼠标经过样式
	this.overClass = obj.overClass;

	// 鼠标按下样式
	this.downClass = obj.downClass;

	// 容器
	if (obj.div) {
		this.div = obj.div;
	} else {
		this.div = document.createElement("div");
	}

	// 单选时被选中的序号
	this.onlyCheck = -1;

	// 包含的元素
	this.children = [];

	// 添加元素
	for (var i=0; i<this.data.length; i++) {
		this.addin (this.data[i], i);
	}
};
LZR.HTML5.Util.Selector.prototype.className = "LZR.HTML5.Util.Selector";
LZR.HTML5.Util.Selector.prototype.version = "0.0.0";

// 添加一个选择元素（不修改 data）
LZR.HTML5.Util.Selector.prototype.addin = function(d, i) {
	switch (this.checked) {
		case 0:
			d.checked = null;
			break;
		case 1:
			if (this.onlyCheck === -1 && d.checked) {
				this.onlyCheck = i;
			} else {
				d.checked = false;
			}
			break;
		case 2:
			if (!d.checked)  {
				d.checked = false;
			}
			break;
	}

	var obj = {};
	obj.data = d;
	obj.type = this.type;
	obj.titleClass = this.titleClass;
	obj.defaultClass = this.defaultClass;
	obj.overClass = this.overClass;
	obj.downClass = this.downClass;

	var s = new LZR.HTML5.Util.Select(obj);
	s.index = i;
	s.manager = this;
	this.children.splice(i, 0, s);

	if (i>0 && i%this.rowNum===0) {
		this.div.appendChild( document.createElement("br") );
	}
	this.div.appendChild( s.div );
};

// 添加一个选择元素（修改 data）
LZR.HTML5.Util.Selector.prototype.add = function(d) {
	var i = this.data.length;
	this.data.push(d);
	this.addin(d, i);
};

// 清除一个选择元素
LZR.HTML5.Util.Selector.prototype.del = function(index) {
	this.div.removeChild(this.children[index].div);
	this.children.splice(index, 1);
	this.data.splice(index, 1);
};

// 获取已选中的元素序号
LZR.HTML5.Util.Selector.prototype.getCheckedIndex = function() {
	var a = [];
	switch (this.checked) {
		case 1:
			a.push( this.onlyCheck );
			break;
		case 2:
			for (var i=0; i<this.data.length; i++) {
				if (this.data[i].checked) {
					a.push(i);
				}
			}
			break;
	}
	return a;
};

// 处理按下事件
LZR.HTML5.Util.Selector.prototype.handleDown = function(s) {
	var pre;
	if (this.checked === 1) {
		pre = this.onlyCheck;
		if (this.onlyCheck >= 0 && this.onlyCheck !== s.index) {
			var d = this.children[this.onlyCheck];
			d.setChecked (false);
		}
		this.onlyCheck = s.index;
		this.data[s.index].checked = true;
	}
	this.onDown (this.data, s.index, pre);
};

// 处理抬起事件
LZR.HTML5.Util.Selector.prototype.handleUp = function(s) {
	this.onUp (this.data, s.index);
};

// 按下时回调函数（接口）
LZR.HTML5.Util.Selector.prototype.onDown = function(data, index, pre) {};

// 抬起时回调函数（接口）
LZR.HTML5.Util.Selector.prototype.onUp = function(data, index) {};

