// ----------- 產品樹 ------------
function GoodsTree (obj) {
	if (obj) {
		this._GoodsTree (obj);
	}
}
GoodsTree.prototype = new JsonTree();
GoodsTree.prototype._GoodsTree = function (obj) {
	this._JsonTree (obj);
};

GoodsTree.prototype.setManage = function (mg) {	// 设置属性视图容器
	this.mg = mg;					// 属性视图容器
};

GoodsTree.prototype.onclick = function (target, e) {
	target.tree.mg.remveProview ();
	target.tree.mg.addProview (new Proview (target));
	Lzrut.stopBubble(e);
};

GoodsTree.prototype.ondblclick = function (target, e) {
	Lzrut.stopBubble(e);
};

GoodsTree.prototype.buildRoot  = function (o, father) {
	return new GoodsTreeNode (o, father);
};









// ----------- 產品樹的節點 ------------
function GoodsTreeNode (obj, father) {
	if (obj) {
		this._GoodsTreeNode(obj, father);
	}
}
GoodsTreeNode.prototype = new JTreeNode();
GoodsTreeNode.prototype._GoodsTreeNode = function (obj, father) {
	this._JTreeNode(obj, father);
};

GoodsTreeNode.prototype._expand = JTreeNode.prototype.expand;
GoodsTreeNode.prototype.expand = function () {
	this._expand();
	this.showSubTree();
};

GoodsTreeNode.prototype._shrink = JTreeNode.prototype.shrink;
GoodsTreeNode.prototype.shrink = function() {
	this._shrink();
	this.hiddenSubTree();
};

GoodsTreeNode.prototype.hiddenSubTree = function () {		// 隐藏树中树
	this.view.removeTree();
};

GoodsTreeNode.prototype.showSubTree = function () {		// 显示树中树
	if (this.data.pro) {
		var protree = new PropertyTree (this.data.pro);	// 属性树
		protree.setManage (this.tree.mg);
		this.view.addTree (protree);
		this.isExpand = true;
	}
};

GoodsTreeNode.prototype.buildChild = function (o, father) {
	return new GoodsTreeNode(o, father);
};

GoodsTreeNode.prototype.buildView = function () {
	return new GoodsTreeView(this);
};









// ----------- 產品樹的視圖 ------------
function GoodsTreeView (node) {
	if (node) {
		this._GoodsTreeView(node);
	}
}
GoodsTreeView.prototype = new JTreeView();
GoodsTreeView.prototype._GoodsTreeView = function (node) {
	this.treeDiv = document.createElement("div");	// 属性树容器
	this._JTreeView (node);
};

GoodsTreeView.prototype.css = function () {		// 设置页面样式
	this.div.appendChild(this.nameDiv);
	this.div.appendChild(this.treeDiv);			// 位置在名字容器和子容器之間
	this.div.appendChild(this.subDiv);
};

GoodsTreeView.prototype.addTree = function (node) {	// 添加属性树
	this.treeDiv.appendChild(node.div);
};

GoodsTreeView.prototype.removeTree = function () {	// 清空属性树
	while (this.treeDiv.firstChild) {
		delete (this.treeDiv.firstChild.jsonTreeData);
		this.treeDiv.removeChild(this.treeDiv.firstChild);
	}
};
