// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "util/Graphics/Edge.js" ]);

// ----------- 边框 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/Graphics.js"
]);
LZR.Util.Graphics.Edge = function (obj) {
	this.reset(obj);

	// 子类
	this.children = [];

	// 父类
	this.parent = null;

	// 在父类中的位置
	this.parentIndex = -1;

};
LZR.Util.Graphics.Edge.prototype.className = "LZR.Util.Graphics.Edge";
LZR.Util.Graphics.Edge.prototype.version = "0.0.0";

// 重设上下宽高
LZR.Util.Graphics.Edge.prototype.reset = function (obj) {
/*
	参数说明：
	{
		top:		// 上边位置
		left:		// 左边位置
		width:		// 宽度
		height:		// 高度
	}
*/

	// 上边位置
	if (obj.top) {
		this.top = obj.top;
	} else {
		this.top = 0;
	}

	// 左边位置
	if (obj.left) {
		this.left = obj.left;
	} else {
		this.left = 0;
	}

	// 实际宽度
	this.w = obj.width;

	// 实际高度
	this.h = obj.height;

	// 宽长比
	this.r = this.w/this.h;

	// 基本宽度
	this.baseW = this.w;
};

// 缩放比例
LZR.Util.Graphics.Edge.prototype.scale = function () {
	return this.w / this.baseW;
};

// 右边位置
LZR.Util.Graphics.Edge.prototype.right = function () {
	return this.left + this.w;
};

// 下边位置
LZR.Util.Graphics.Edge.prototype.bottom = function () {
	return this.top + this.h;
};

// 调整高度
LZR.Util.Graphics.Edge.prototype.reHeight = function () {
	this.h = this.w / this.r;
};

// 基本平移
LZR.Util.Graphics.Edge.prototype.move = function (x, y) {
	this.left += x;
	this.top += y;
};

// 基本缩放
LZR.Util.Graphics.Edge.prototype.zoom = function (s, x, y) {
	this.w *= s;
	this.h *= s;
	this.move (x - s*x, y - s*y);
};

// 添加子类
LZR.Util.Graphics.Edge.prototype.addChild = function (child, index) {
	if (child.parent) {
		child.delParent();
	}
	child.parent = this;

	if (index) {
		child.parentIndex = index;
		this.children.splice(indec, 0, child);
	} else {
		child.parentIndex = this.children.length;
		this.children.push(child);
	}
};

// 删除子类
LZR.Util.Graphics.Edge.prototype.delChild = function (child) {
	if (this === child.parent) {
		this.children.splice(child.parentIndex, 1);
		child.parent = null;
		child.parentIndex = -1;
		return true;
	} else {
		return false;
	}
};

// 设置父类
LZR.Util.Graphics.Edge.prototype.setParent = function (father, index) {
	father.addChild (this, index);
};

// 删除父类
LZR.Util.Graphics.Edge.prototype.delParent = function () {
	if (this.parent) {
		this.parent.delChild (this);
	}
};

// 位置适应父类
LZR.Util.Graphics.Edge.prototype.positionByParent = function (father) {
	if (!father) {
		father = this.parent;
		if (!father) return false;
	}

	var d=0;
	// 高度适应
	if (this.top < father.top) {
		this.top = father.top;
	} else {
		d = father.bottom() - this.bottom();
		if (d<0) {
			this.top += d;
		}
	}

	// 宽度适应
	if (this.left < father.left) {
		this.left = father.left;
	} else {
		d = father.right() - this.right();
		if (d<0) {
			this.left += d;
		}
	}
};

// 宽高适应父类
LZR.Util.Graphics.Edge.prototype.rrByParent = function (father) {
	if (!father) {
		father = this.parent;
		if (!father) return false;
	}

	if (this.r < father.r) {
		// 高对比
		if (this.h > father.h) {
			this.h = father.h;
			this.w = this.r * this.h;
			return true;
		}
	} else {
		// 宽对比
		if (this.w > father.w) {
			this.w = father.w;
			this.h = this.w / this.r;
			return true;
		}
	}
	return false;
};

// 宽高适应子类
LZR.Util.Graphics.Edge.prototype.rrByChild = function (child) {
	if (!child) {
		child = this.children[0];
		if (!child) return false;
	}

	if (this.r < child.r) {
		// 高对比
		if (this.h < child.h) {
			this.h = child.h;
			this.w = this.r * this.h;
			return true;
		}
	} else {
		// 宽对比
		if (this.w < child.w) {
			this.w = child.w;
			this.h = this.w / this.r;
			return true;
		}
	}
	return false;
};

// 在父类内平移
LZR.Util.Graphics.Edge.prototype.moveInParent = function (x, y, father) {
	this.move(x, y);
	this.positionByParent (father);
};

// 在父类边框内缩放
LZR.Util.Graphics.Edge.prototype.zoomInParent = function (s, x, y, father, child) {
	var sx = x/this.w;
	var sy = y/this.h;
	this.w *= s;
	this.h *= s;
	if ( s>1 ) {
		this.rrByParent( father );
	} else if (s<1 ) {
		this.rrByChild( child );
	}
	sx *= this.w;
	sy *= this.h;
	this.move (x - sx, y - sy);
	if ( s>1 ) {
		this.positionByParent (father);
	}
};

// 取整（取整后误差很大）
LZR.Util.Graphics.Edge.prototype.floor = function () {
	this.top = Math.floor(this.top);
	this.left = Math.floor(this.left);
	this.w = Math.floor(this.w);
	this.h = Math.floor(this.h);
};

// 在父类中布局
LZR.Util.Graphics.Edge.prototype.alineInParent = function (aline, father) {
	if (!father) {
		father = this.parent;
		if (!father) return false;
	}

	switch (aline) {
		case "center":
			this.left = (father.w - this.w)/2;
			this.top = (father.h - this.h)/2;
			break;
		default:
			return false;
	}
	return true;
};

