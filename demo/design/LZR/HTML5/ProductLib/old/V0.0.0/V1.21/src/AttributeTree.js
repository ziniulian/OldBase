// ----------- 屬性樹 ------------
function AttributeTree (tobj, sid) {
	try {
		this._AttributeTree (tobj, sid);
	} catch (e) {}
}
AttributeTree.prototype = new JsonTree();
AttributeTree.prototype._AttributeTree = function (tobj, sid) {
	this._JsonTree (tobj, sid);

	// 屬性樹 CSS 樣式
	this.div.style.background = "#FF0";
	//this.div.style.padding = "5px";
};

AttributeTree.prototype.buildData  = function (o) {
	this.data = new AttributeTreeData (o);
};

AttributeTree.prototype.onclick = function (obj, e) {
	// 生成屬性視圖
	obj.tree.buildProView (obj);
	stopBubble (e);
};

AttributeTree.prototype.ondblclick = function (obj, e) {
	stopBubble (e);
};

// 創建屬性視圖
AttributeTree.prototype.buildProView = function (obj) {
	var view = document.createElement("div");
	view.innerHTML = obj.name + " ： " + obj.type;

	this.manager.flushProView (view);
};



// ----------- 屬性樹的數據 ------------
function AttributeTreeData (obj) {
	if (obj) {
		this._AttributeTreeData(obj);
	}
}
AttributeTreeData.prototype = new JTreeData();
AttributeTreeData.prototype._AttributeTreeData = function (obj) {
	this._JTreeData(obj.name, obj.type);
	this.pro = obj.pro;						// 屬性
};

AttributeTreeData.prototype.buildChild = function (o) {
	return new AttributeTreeData(o);
};