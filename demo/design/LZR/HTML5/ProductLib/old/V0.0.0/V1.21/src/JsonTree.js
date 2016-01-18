// ----------- class JsonTree------------
function JsonTree (tobj, sid) {
	try {
		this._JsonTree (tobj, sid);
	} catch (e) {}
}
JsonTree.prototype._JsonTree = function (tobj, sid) {
	this.buildData(tobj);
	if (!sid || isNaN(sid)) sid = 0;
	this.data.tree = this;
	this.div = this.data.view.div;

	this.div.onclick = function (e) {
		var event = window.event || e;
		var target = event.srcElement || event.target;
		while (!target.jTreeData) {
			target = target.parentNode || target.parentElement;
		}
		target = target.jTreeData;

		if (target) {
			JsonTree.prototype.temp = target;
			target.tree.selected = target;
			target.tree.onclick (target, event);
		}
	};

	this.div.ondblclick = function (e) {
		var target = JsonTree.prototype.temp;
		target.view.expand();
		target.tree.ondblclick (target, e);
	};

	this.createChildren(this.data, tobj.children, sid);
};

JsonTree.prototype.buildData  = function (o) {
	this.data = new JTreeData (o.name, o.type);
};

JsonTree.prototype.createChildren = function (father, child, sid) {
	for (var i=sid; i<child.length; i++) {
		var o = child[i];
		var cho = father.addChild(o);
		if (o.children) {
			this.createChildren(cho, o.children, sid);
		}
	}
};


// ----------- class JTreeData------------
function JTreeData (name, type) {
	if (name || type) {
		this._JTreeData(name, type);
	}
}
JTreeData.prototype._JTreeData = function (name, type) {
	this.children = [];
	this.view = this.buildView();
	this.setName(name);
	this.setType(type);
};

JTreeData.prototype.buildView = function () {
	return new JTreeView(this);
};

JTreeData.prototype.buildChild = function (o) {
	return new JTreeData(o.name, o.type);
};

JTreeData.prototype.addChild = function (o) {
	var child = this.buildChild (o);
	child.father = this;
	child.tree = this.tree;
	this.children.push(child);

	// View更新
	this.view.addSub(child.view.div);
	this.setName(this.name);

	return child;
};

JTreeData.prototype.del = function () {
	if (this.father) {
		var list = this.father.children;
		for (var i=0; i<list.length; i++) {
			if (this == list[i]) {
				list.splice(i, 1);
				break;
			}
		}

		// View更新
		this.father.view.delSub(this.view.div);
		this.father.setName(this.father.name);
	} else {
		delete (this.children);
		this.children = [];
	}
};

JTreeData.prototype.setName = function (name) {
	if (name) {
		this.name = name;
		var s = name;
		if (this.children.length) {
			s += "---(" + this.children.length + ")";
		}

		// 設置CSS樣式 ..........
		this.view.setName(s, "");
	}
};

JTreeData.prototype.setType = function (type) {
	this.type = type;
	// 設置CSS樣式 ......
};


// ----------- class JTreeView------------
function JTreeView (tobj) {
	if (tobj) {
		this._JTreeView (tobj);
	}
}
JTreeView.prototype._JTreeView = function (tobj) {
	this.div = document.createElement("div");
	this.nameDiv = document.createElement("div");
	this.subDiv = document.createElement("div");
	this.div.appendChild(this.nameDiv);
	this.div.appendChild(this.subDiv);
	this.div.jTreeData = tobj;

	// 設置CSS樣式 ......
};

JTreeView.prototype.addSub = function(divObj) {
	this.subDiv.appendChild(divObj);
};

JTreeView.prototype.delSub = function(divObj) {
	this.subDiv.removeChild(divObj);
};

JTreeView.prototype.setName = function(name, style) {
	this.nameDiv.innerHTML = name;

	if (name) {
		this.subDiv.style.margin = "0 0 0 20px";
		this.setExpand (false);
		if (style) {
			//設置CSS樣式 .....
		}
	}
};

JTreeView.prototype.setDivStyle = function(style) {
	if (style) {
		//設置CSS樣式 .....
	}
};

JTreeView.prototype.expand = function () {
	this.setExpand (this.subDiv.style.display);
};

JTreeView.prototype.setExpand = function (exp) {
	if (exp) {
		this.subDiv.style.display = "";
	} else {
		this.subDiv.style.display = "none";
	}
};

JTreeView.prototype.isExpand = function () {
	return !this.subDiv.style.display;
};