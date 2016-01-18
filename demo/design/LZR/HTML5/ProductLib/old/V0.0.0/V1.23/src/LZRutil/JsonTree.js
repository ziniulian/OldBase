// ----------- class JsonTree ：树 ------------
function JsonTree (obj) {
	if (obj) {
		this._JsonTree (obj);
	}
}
JsonTree.prototype._JsonTree = function (obj) {
	this.root = this.buildRoot(obj, this);		// 根
	this.sid = 0;					// 子项起始值
	this.div = this.root.view.div;			// 容器
	this.buildOnclick();				// 單擊
	this.buildOndblclick();			// 雙擊
	this.css();
};

JsonTree.prototype.css = function () {			// 设置页面样式

};

JsonTree.prototype.parseEvent = function (e) {		// 事件解析
	var event = window.event || e;
	var target = event.srcElement || event.target;
	while (!target.jsonTreeData) {
		target = target.parentNode || target.parentElement;
	}
	return target.jsonTreeData;
};

JsonTree.prototype.buildOnclick = function () {		// 生成單擊事件
	this.div.onclick = function (e) {
		var target = JsonTree.prototype.parseEvent(e);
		if (target) {
			JsonTree.prototype.temp = target;	// 临时被选中的数据
			target.se();
			target.tree.onclick (target, event);
		}
	};
};

JsonTree.prototype.buildOndblclick = function () {		// 生成雙擊事件
	this.div.ondblclick = function (e) {
		var target = JsonTree.prototype.temp;
		target.tree.ondblclick (target, e);
	};
};

JsonTree.prototype.onclick = function (target, event) {};		// 單擊事件
JsonTree.prototype.ondblclick = function (target, event) {};	// 雙擊事件

JsonTree.prototype.buildRoot = function (obj, father) {		// 生成根
	return new JTreeNode (obj, father);
};









// ----------- class JTreeNode：树节点------------
function JTreeNode (obj, father) {
	if (obj) {
		this._JTreeNode(obj, father);
	}
}
JTreeNode.prototype._JTreeNode = function (obj, father) {		// 构造函数
	this.data = obj;				// 數據源
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

JTreeNode.prototype.expand = function() {			// 展开
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

JTreeNode.prototype.shrink = function() {			// 收起
	if (this.isExpand) {
		this.view.removeSub();
		this.isExpand = false;
	}
};

JTreeNode.prototype.se = function () {			// 收起/展開
	if (this.isExpand) {
		this.shrink();
	} else {
		this.expand();
	}
};

JTreeNode.prototype.setName = function (name) {	// 修改名字
	if (name) {
		this.data.name  = name;
	}
	if (this.data.name) {
		name = this.data.name;
		if (this.data.children) {
			if (this.data.children.length) {
				name += "---(" + this.data.children.length + ")";
			} else {
				delete (this.data.children);
			}
		}
		this.view.setName (name);
	} else {
		this.expand ();
	}
};

JTreeNode.prototype.addNode = function (obj) {		// 添加子节点
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

JTreeNode.prototype.del = function () {			// 删除自己
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

JTreeNode.prototype.buildView = function () {		// 生成视图
	return new JTreeView (this);
};

JTreeNode.prototype.buildChild = function (o, father) {	// 生成子节点
	return new JTreeNode (o, father);
};









// ----------- class JTreeView：树视图------------
function JTreeView (node) {
	if (node) {
		this._JTreeView (node);
	}
}
JTreeView.prototype._JTreeView = function (node) {
	this.div = document.createElement("div");		// 容器
	this.nameDiv = document.createElement("div");	// 名字容器
	this.subDiv = document.createElement("div");	// 子容器
	this.div.jsonTreeData = node;			// 容器.数据
	this.css();
};

JTreeView.prototype.css = function () {			// 设置页面样式
	this.div.appendChild(this.nameDiv);
	this.div.appendChild(this.subDiv);
};

JTreeView.prototype.addChild = function (div) {		// 添加子项
	this.subDiv.appendChild(div);
};

JTreeView.prototype.delChild = function (div) {		// 删除子项
	delete (div.jsonTreeData);
	this.subDiv.removeChild(div);
};

JTreeView.prototype.removeSub = function () {		// 清空子容器
	while (this.subDiv.firstChild) {
		delete (this.subDiv.firstChild.jsonTreeData);
		this.subDiv.removeChild(this.subDiv.firstChild);
	}
};

JTreeView.prototype.setName = function (name) {	// 设置名字
	if (name) {
		this.nameDiv.innerHTML = name;
		this.subDiv.style.margin = "0 0 0 20px";
	}
};
