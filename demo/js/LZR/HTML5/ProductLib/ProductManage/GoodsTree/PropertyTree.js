// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/ProductLib/ProductManage/GoodsTree/PropertyTree.js" ]);

// ----------- 属性树 ------------

LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/ProductLib/ProductManage/GoodsTree/GoodsTree.js" ]);
LZR.HTML5.ProductLib.ProductManage.PropertyTree = function (obj) {
/*
	参数说明：
	obj: {
		name: "",				// 节点名称
		children: [obj1, obj2, ...],		// 子节点集合
		type: "",				// 节点类型
		pro: {					// 节点的属性
			type: "",			// 属性类型
			children: [			// 子属性集合

				pro1: {					// 属性（与节点相比，无 pro字段）
					name: "",			// 属性名称
					type: "",			// 属性类型
					children: [......],		// 子属性集合
					member: {			// 属性的成员
						type:"members",	// 成员类型
						children:[...]		// 成员集合
					}
				},
				pro2,
				pro3, ...
			]
		},
	}
*/

	LZR.HTML5.ProductLib.ProductManage.GoodsTree.call(this, obj);
};
LZR.HTML5.ProductLib.ProductManage.PropertyTree.prototype = LZR.createPrototype (LZR.HTML5.ProductLib.ProductManage.GoodsTree.prototype);
LZR.HTML5.ProductLib.ProductManage.PropertyTree.prototype.className = "LZR.HTML5.ProductLib.ProductManage.PropertyTree";
LZR.HTML5.ProductLib.ProductManage.PropertyTree.prototype.version = "0.0.1";

// 设置页面样式
LZR.HTML5.ProductLib.ProductManage.PropertyTree.prototype.css = function () {
	this.div.style.background = "#FF0";
	this.div.style.padding = "10px 0px 10px 5px";
};

LZR.HTML5.ProductLib.ProductManage.PropertyTree.prototype.buildRoot  = function (o, father) {
	return new LZR.HTML5.ProductLib.ProductManage.PropertyTree.Node (o, father);
};









// ----------- 属性树的节点 ------------
LZR.HTML5.ProductLib.ProductManage.PropertyTree.Node = function (obj, father) {
	LZR.HTML5.ProductLib.ProductManage.GoodsTree.Node.call(this, obj, father);
};
LZR.HTML5.ProductLib.ProductManage.PropertyTree.Node.prototype = LZR.createPrototype (LZR.HTML5.ProductLib.ProductManage.GoodsTree.Node.prototype);
LZR.HTML5.ProductLib.ProductManage.PropertyTree.Node.prototype.className = "LZR.HTML5.ProductLib.ProductManage.PropertyTree.Node";

// 显示树中树
LZR.HTML5.ProductLib.ProductManage.PropertyTree.Node.prototype.showSubTree = function () {
	if (this.data.member) {
		var protree = new LZR.HTML5.ProductLib.ProductManage.MemberTree (this.data.member);	// 成员树
		protree.setManage (this.tree.mg);
		this.view.addTree (protree);
		this.isExpand = true;
	}
};

LZR.HTML5.ProductLib.ProductManage.PropertyTree.Node.prototype.buildChild = function (o, father) {
	return new LZR.HTML5.ProductLib.ProductManage.PropertyTree.Node(o, father);
};

LZR.HTML5.ProductLib.ProductManage.PropertyTree.Node.prototype.buildView = function () {
	return new LZR.HTML5.ProductLib.ProductManage.PropertyTree.View(this);
};









// ----------- 属性树的视图 ------------
LZR.HTML5.ProductLib.ProductManage.PropertyTree.View = function (node) {
	LZR.HTML5.ProductLib.ProductManage.GoodsTree.View.call(this, node);
};
LZR.HTML5.ProductLib.ProductManage.PropertyTree.View.prototype = LZR.createPrototype (LZR.HTML5.ProductLib.ProductManage.GoodsTree.View.prototype);
LZR.HTML5.ProductLib.ProductManage.PropertyTree.View.prototype.className = "LZR.HTML5.ProductLib.ProductManage.PropertyTree.View";

LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/ProductLib/ProductManage/GoodsTree/MemberTree.js" ]);
