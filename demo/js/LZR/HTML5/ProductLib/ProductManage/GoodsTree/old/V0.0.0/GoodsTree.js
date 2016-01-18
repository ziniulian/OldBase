// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5\\ProductLib\\ProductManage\\GoodsTree\\GoodsTree.js" ]);

// ----------- 產品樹 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5\\util\\Util.js",
	LZR.HTML5.jsPath + "HTML5\\util\\JsonTree.js"
]);
LZR.HTML5.ProductLib.ProductManage.GoodsTree = function (obj) {
/*
	参数说明：
	obj: {
		name: "",				// 节点名称
		children: [obj1, obj2, ...],		// 子节点集合
		pro: {					// 节点的属性
			type: "",			// 属性类型
			children: [......]		// 子属性集合
		},
	}
*/
	LZR.HTML5.Util.JsonTree.call(this, obj);
};
LZR.HTML5.ProductLib.ProductManage.GoodsTree.prototype = Object.create(LZR.HTML5.Util.JsonTree.prototype);
LZR.HTML5.ProductLib.ProductManage.GoodsTree.prototype.className = "LZR.HTML5.ProductLib.ProductManage.GoodsTree";
LZR.HTML5.ProductLib.ProductManage.GoodsTree.prototype.version = "0.0.0";

// 设置属性视图容器
LZR.HTML5.ProductLib.ProductManage.GoodsTree.prototype.setManage = function (mg) {
	this.mg = mg;					// 属性视图容器
};

LZR.HTML5.ProductLib.ProductManage.GoodsTree.prototype.onclick = function (target, e) {
	target.tree.mg.remveProview ();
	target.tree.mg.addProview (new LZR.HTML5.ProductLib.ProductManage.Proview (target));
	LZR.HTML5.Util.stopBubble(e);
};

LZR.HTML5.ProductLib.ProductManage.GoodsTree.prototype.ondblclick = function (target, e) {
	LZR.HTML5.Util.stopBubble(e);
};

LZR.HTML5.ProductLib.ProductManage.GoodsTree.prototype.buildRoot  = function (o, father) {
	return new LZR.HTML5.ProductLib.ProductManage.GoodsTree.Node (o, father);
};









// ----------- 產品樹的節點 ------------
LZR.HTML5.ProductLib.ProductManage.GoodsTree.Node = function (obj, father) {
	LZR.HTML5.Util.JsonTree.Node.call(this, obj, father);
};
LZR.HTML5.ProductLib.ProductManage.GoodsTree.Node.prototype = Object.create(LZR.HTML5.Util.JsonTree.Node.prototype);
LZR.HTML5.ProductLib.ProductManage.GoodsTree.Node.prototype.className = "LZR.HTML5.ProductLib.ProductManage.GoodsTree.Node";

LZR.HTML5.ProductLib.ProductManage.GoodsTree.Node.prototype.expand = function () {
	LZR.HTML5.Util.JsonTree.Node.prototype.expand.call(this);
	this.showSubTree();
};

LZR.HTML5.ProductLib.ProductManage.GoodsTree.Node.prototype.shrink = function() {
	LZR.HTML5.Util.JsonTree.Node.prototype.shrink.call(this);
	this.hiddenSubTree();
};

// 隐藏树中树
LZR.HTML5.ProductLib.ProductManage.GoodsTree.Node.prototype.hiddenSubTree = function () {
	this.view.removeTree();
};

// 显示树中树
LZR.HTML5.ProductLib.ProductManage.GoodsTree.Node.prototype.showSubTree = function () {
	if (this.data.pro) {
		var protree = new LZR.HTML5.ProductLib.ProductManage.PropertyTree (this.data.pro);	// 属性树
		protree.setManage (this.tree.mg);
		this.view.addTree (protree);
		this.isExpand = true;
	}
};

LZR.HTML5.ProductLib.ProductManage.GoodsTree.Node.prototype.buildChild = function (o, father) {
	return new LZR.HTML5.ProductLib.ProductManage.GoodsTree.Node(o, father);
};

LZR.HTML5.ProductLib.ProductManage.GoodsTree.Node.prototype.buildView = function () {
	return new LZR.HTML5.ProductLib.ProductManage.GoodsTree.View(this);
};









// ----------- 產品樹的視圖 ------------
LZR.HTML5.ProductLib.ProductManage.GoodsTree.View = function (node) {
	this.treeDiv = document.createElement("div");	// 属性树容器
	LZR.HTML5.Util.JsonTree.View.call(this, node);

};
LZR.HTML5.ProductLib.ProductManage.GoodsTree.View.prototype = Object.create(LZR.HTML5.Util.JsonTree.View.prototype);
LZR.HTML5.ProductLib.ProductManage.GoodsTree.View.prototype.className = "LZR.HTML5.ProductLib.ProductManage.GoodsTree.View";

// 设置页面样式
LZR.HTML5.ProductLib.ProductManage.GoodsTree.View.prototype.css = function () {
	this.div.appendChild(this.nameDiv);
	this.div.appendChild(this.treeDiv);			// 位置在名字容器和子容器之間
	this.div.appendChild(this.subDiv);
};

// 添加属性树
LZR.HTML5.ProductLib.ProductManage.GoodsTree.View.prototype.addTree = function (node) {
	this.treeDiv.appendChild(node.div);
};

// 清空属性树
LZR.HTML5.ProductLib.ProductManage.GoodsTree.View.prototype.removeTree = function () {
	while (this.treeDiv.firstChild) {
		delete (this.treeDiv.firstChild.jsonTreeData);
		this.treeDiv.removeChild(this.treeDiv.firstChild);
	}
};

LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5\\ProductLib\\ProductManage\\GoodsTree\\PropertyTree.js" ]);
