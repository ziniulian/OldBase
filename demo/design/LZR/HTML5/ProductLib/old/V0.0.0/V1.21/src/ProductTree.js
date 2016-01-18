// ----------- 產品樹 ------------
function ProductTree (tobj, sid) {
	try {
		this._ProductTree (tobj, sid);
	} catch (e) {}
}
ProductTree.prototype = new JsonTree();
ProductTree.prototype._ProductTree = function (tobj, sid) {
	this._JsonTree (tobj, sid);
};

ProductTree.prototype.buildData  = function (o) {
	this.data = new ProTreeData (o);
};

ProductTree.prototype.onclick = function (obj) {
	// 生成屬性視圖
	obj.tree.buildProView (obj);
	// 生成屬性樹
	obj.tree.manager.buildProTree (obj);
};

// 創建屬性視圖
ProductTree.prototype.buildProView = function (obj) {
	var view = document.createElement("div");
	view.innerHTML = obj.name + " ： " + obj.type;

	this.manager.flushProView (view);
};




// ----------- 產品樹的數據 ------------
function ProTreeData (obj) {
	if (obj) {
		this._ProTreeData(obj);
	}
}
ProTreeData.prototype = new JTreeData();
ProTreeData.prototype._ProTreeData = function (obj) {
	this._JTreeData(obj.name, obj.type);
	this.pro = obj.pro;						// 屬性
};

ProTreeData.prototype.buildView = function () {
	return new ProTreeView(this);
};

ProTreeData.prototype.buildChild = function (o) {
	return new ProTreeData(o);
};



// ----------- 產品樹的視圖 ------------
function ProTreeView (obj) {
	if (obj) {
		this._ProTreeView(obj);
	}
}
ProTreeView.prototype = new JTreeView();
ProTreeView.prototype._ProTreeView = function (obj) {

	this.div = document.createElement("div");
	this.nameDiv = document.createElement("div");
	this.proDiv = document.createElement("div");		// 屬性樹容器
	this.subDiv = document.createElement("div");
	this.div.appendChild(this.nameDiv);
	this.div.appendChild(this.proDiv);				// 位置在名字容器和子容器之間
	this.div.appendChild(this.subDiv);
	this.div.jTreeData = obj;

	// 設置CSS樣式 ......
/*
	this._JTreeView(obj);
	this.proDiv = document.createElement("div");		// 屬性視圖容器
	this.div.removeChild (this.subDiv);
	this.div.appendChild (this.proDiv);
	this.div.appendChild (this.subDiv);

	this.proDiv.innerHTML = "顯示測試屬性";

	// 設置proDIv CSS樣式 ......
*/
};

ProTreeView.prototype.setExpand = function (exp) {
	if (exp) {
		this.subDiv.style.display = "";
		// this.proDiv.style.display = "";		// 與子容器共同擴展
	} else {
		this.subDiv.style.display = "none";
		// this.proDiv.style.display = "none";		// 與子容器共同隱藏
	}
};
