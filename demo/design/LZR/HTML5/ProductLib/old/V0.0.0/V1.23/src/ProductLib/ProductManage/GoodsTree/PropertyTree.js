// ----------- 属性树 ------------
function PropertyTree (obj) {
	if (obj) {
		this._PropertyTree (obj);
	}
}
PropertyTree.prototype = new GoodsTree();
PropertyTree.prototype._PropertyTree = function (obj) {
	this._GoodsTree (obj);
};

PropertyTree.prototype.css = function () {			// 设置页面样式
	this.div.style.background = "#FF0";
	this.div.style.padding = "10px 0px 10px 5px";
};

PropertyTree.prototype.buildRoot  = function (o, father) {
	return new PropertyTreeNode (o, father);
};









// ----------- 属性树的节点 ------------
function PropertyTreeNode (obj, father) {
	if (obj) {
		this._PropertyTreeNode(obj, father);
	}
}
PropertyTreeNode.prototype = new GoodsTreeNode();
PropertyTreeNode.prototype._PropertyTreeNode = function (obj, father) {
	this._GoodsTreeNode(obj, father);
};

PropertyTreeNode.prototype.showSubTree = function () {		// 显示树中树
	if (this.data.member) {
		var protree = new MemberTree (this.data.member);	// 成员树
		protree.setManage (this.tree.mg);
		this.view.addTree (protree);
		this.isExpand = true;
	}
};

PropertyTreeNode.prototype.buildChild = function (o, father) {
	return new PropertyTreeNode(o, father);
};

PropertyTreeNode.prototype.buildView = function () {
	return new PropertyTreeView(this);
};









// ----------- 属性树的视图 ------------
function PropertyTreeView (node) {
	if (node) {
		this._PropertyTreeView(node);
	}
}
PropertyTreeView.prototype = new GoodsTreeView();
PropertyTreeView.prototype._PropertyTreeView = function (node) {
	this._GoodsTreeView(node);
};
