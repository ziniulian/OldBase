// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/JsonTree.js" ]);

// ----------- class JsonTree ：树 ------------

LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/Util.js" ]);
LZR.HTML5.Util.JsonTree = function (obj) {
/*
	参数说明：
	obj: {
		name: "",				// 节点名称
		children: [obj1, obj2, ...],		// 子节点集合
	}
*/

	this.root = this.buildRoot(obj, this);		// 根
	this.sid = 0;					// 子项起始值
	this.div = this.root.view.div;			// 容器
	this.buildOnclick();				// 單擊
	this.buildOndblclick();				// 雙擊
	this.css();
};
LZR.HTML5.Util.JsonTree.prototype.className = "LZR.HTML5.Util.JsonTree";
LZR.HTML5.Util.JsonTree.prototype.version = "0.0.0";

// 设置页面样式
LZR.HTML5.Util.JsonTree.prototype.css = function () {};

// 事件解析
LZR.HTML5.Util.JsonTree.prototype.parseEvent = function (e) {
	var event = window.event || e;
	var target = event.srcElement || event.target;
	while (!target.jsonTreeData) {
		target = target.parentNode || target.parentElement;
	}
	return target.jsonTreeData;
};

// 生成單擊事件
LZR.HTML5.Util.JsonTree.prototype.buildOnclick = function () {
	this.div.onclick = function (e) {
		var target = LZR.HTML5.Util.JsonTree.prototype.parseEvent(e);
		if (target) {
			LZR.HTML5.Util.JsonTree.prototype.temp = target;	// 临时被选中的数据
			target.se();
			target.tree.onclick (target, event);
		}
	};
};

// 生成雙擊事件
LZR.HTML5.Util.JsonTree.prototype.buildOndblclick = function () {
	this.div.ondblclick = function (e) {
		var target = LZR.HTML5.Util.JsonTree.prototype.temp;
		target.tree.ondblclick (target, e);
	};
};

// 單擊事件
LZR.HTML5.Util.JsonTree.prototype.onclick = function (target, event) {};

// 雙擊事件
LZR.HTML5.Util.JsonTree.prototype.ondblclick = function (target, event) {};

// 生成根
LZR.HTML5.Util.JsonTree.prototype.buildRoot = function (obj, father) {
	return new LZR.HTML5.Util.JsonTree.Node (obj, father);
};









// ----------- class JTreeNode：树节点------------
LZR.HTML5.Util.JsonTree.Node = function (obj, father) {
	this.data = obj;					// 數據源
	this.isExpand = false;				// 是否展開
	this.view = this.buildView();			// 視圖
	if (father) {
		if (father.tree) {
			this.father = father;		// 父项
			this.tree = father.tree;	// 树
		} else {
			this.tree = father;		// 树
		}
	}
	this.setName();
};
LZR.HTML5.Util.JsonTree.Node.prototype.className = "LZR.HTML5.Util.JsonTree.Node";

// 展开
LZR.HTML5.Util.JsonTree.Node.prototype.expand = function() {
	if (!this.isExpand) {
		var list = this.data.children;
		if (list) {
			for (var i=0; i<list.length; i++) {
				var sub = this.buildChild (list[i], this);
				this.view.addChild(sub.view.div);
			}
			this.isExpand = true;
		}
	}
};

// 收起
LZR.HTML5.Util.JsonTree.Node.prototype.shrink = function() {
	if (this.isExpand) {
		this.view.removeSub();
		this.isExpand = false;
	}
};

// 收起/展開
LZR.HTML5.Util.JsonTree.Node.prototype.se = function () {
	if (this.isExpand) {
		this.shrink();
	} else {
		this.expand();
	}
};

// 修改名字
LZR.HTML5.Util.JsonTree.Node.prototype.setName = function (name) {
	if (name) {
		this.data.name  = name;
	}
	if (this.data.name) {
		name = this.data.name;
		if (this.data.children) {
			if ( this.data.children.length ) {
				name += "---(" + this.data.children.length + ")";
			} else {
				LZR.HTML5.Util.del  (this.data.children);
			}
		}
		this.view.setName (name);
	} else {
		this.expand ();
	}
};

// 添加子节点
LZR.HTML5.Util.JsonTree.Node.prototype.addNode = function (obj) {
	if (!this.data.children) {
		this.data.children = [];
	}
	this.data.children.push(obj);
	this.setName();

	if (this.isExpand) {
		var sub = this.buildChild (obj, this);
		this.view.addChild(sub.view.div);
	} else {
		this.expand();
	}
};

// 删除自己
LZR.HTML5.Util.JsonTree.Node.prototype.del = function () {
	var list = this.father.data.children;
	for (var i=0; i<list.length; i++) {
		if (this.data == list[i]) {
			list.splice(i, 1);
			break;
		}
	}
	this.father.setName();
	this.father.view.delChild(this.view.div);
};

// 生成视图
LZR.HTML5.Util.JsonTree.Node.prototype.buildView = function () {
	return new LZR.HTML5.Util.JsonTree.View (this);
};

// 生成子节点
LZR.HTML5.Util.JsonTree.Node.prototype.buildChild = function (o, father) {
	return new LZR.HTML5.Util.JsonTree.Node (o, father);
};









// ----------- class JTreeView：树视图------------
LZR.HTML5.Util.JsonTree.View = function (node) {
	this.div = document.createElement("div");		// 容器
	this.nameDiv = document.createElement("div");	// 名字容器
	this.subDiv = document.createElement("div");	// 子容器
	this.div.jsonTreeData = node;				// 容器.数据
	this.css();
};
LZR.HTML5.Util.JsonTree.View.prototype.className = "LZR.HTML5.Util.JsonTree.View";

// 设置页面样式
LZR.HTML5.Util.JsonTree.View.prototype.css = function () {
	this.div.appendChild(this.nameDiv);
	this.div.appendChild(this.subDiv);
};

// 添加子项
LZR.HTML5.Util.JsonTree.View.prototype.addChild = function (div) {
	this.subDiv.appendChild(div);
};

// 删除子项
LZR.HTML5.Util.JsonTree.View.prototype.delChild = function (div) {
	LZR.HTML5.Util.del  (div.jsonTreeData);
	this.subDiv.removeChild(div);
};

// 清空子容器
LZR.HTML5.Util.JsonTree.View.prototype.removeSub = function () {
	var fc = this.subDiv.firstChild;
	while (fc) {
		LZR.HTML5.Util.del ( fc );
		this.subDiv.removeChild( fc );
		fc = this.subDiv.firstChild;
	}
};

// 设置名字
LZR.HTML5.Util.JsonTree.View.prototype.setName = function (name) {
	if (name) {
		this.nameDiv.innerHTML = name;
		this.subDiv.style.margin = "0 0 0 20px";
	}
};
