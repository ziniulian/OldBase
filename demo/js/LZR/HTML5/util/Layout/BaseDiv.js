// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/Layout/BaseDiv.js" ]);

// ------------------- 容器基类 ---------------------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/Css.js"
]);
LZR.HTML5.Util.Layout.BaseDiv = function (obj) {
	/*
		参数说明：
		{
			type:,	// 容器类型（0：div；1：span）
		}
	*/
	// 创建容器
	if (obj.type) {
		this.div = document.createElement("span");
	} else {
		this.div = document.createElement("div");
	}

	// 父容器
	this.parent = null;

	// 在父容器中的位置
	this.indexInParent = -1;

	// 子容器
	this.children = [];
};
LZR.HTML5.Util.Layout.BaseDiv.prototype.className = "LZR.HTML5.Util.Layout.BaseDiv";
LZR.HTML5.Util.Layout.BaseDiv.prototype.version = "0.0.0";

// 添加CSS样式
LZR.HTML5.Util.Layout.BaseDiv.prototype.addClass = function (cls) {
	LZR.HTML5.Util.Css.addClass (this.div, cls);
};

// 删除CSS样式
LZR.HTML5.Util.Layout.BaseDiv.prototype.delClass = function (cls) {
	LZR.HTML5.Util.Css.removeClass (this.div, cls);
};

// 添加子元素
LZR.HTML5.Util.Layout.BaseDiv.prototype.addChild = function (similar, noplace) {
	/*
		参数说明：
		similar : ,	// 同类容器
		noplace : ,	// 不在DOM关系上加入容器
	*/
	if (similar.parent) {
		similar.parent.delChild(similar);
	}
	if (!noplace) {
		similar.placeTo(this.div);
	}
	similar.parent = this;
	similar.indexInParent = this.children.length;
	this.children.push(similar);
};

// 删除子元素
LZR.HTML5.Util.Layout.BaseDiv.prototype.delChild = function (similar) {
	this.div.removeChild(similar.div);
	similar.parent = null;
	if (similar.indexInParent >= 0) {
		this.children.splice(similar.indexInParent, 1);
		similar.indexInParent = -1;
	}
};

// 加入其它容器中（非同类，故无父子关系）
LZR.HTML5.Util.Layout.BaseDiv.prototype.placeTo = function (div) {
	div.appendChild(this.div);
};

