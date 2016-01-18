// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/ProductLib/ProductManage/ProductManage.js" ]);

// ----------- 產品管理 ------------

LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/util/Util.js" ]);
LZR.HTML5.ProductLib.ProductManage = function (obj) {
	// 源數據
	this.data = obj;

	// 容器
	this.div = document.createElement("div");

	// 屬性視圖容器
	this.pro = document.createElement("div");

	// 產品
	this.goodsTree = new LZR.HTML5.ProductLib.ProductManage.GoodsTree(obj);

	// 设置属性视图容器
	this.goodsTree.setManage(this);

	this.css();
};
LZR.HTML5.ProductLib.ProductManage.prototype.className = "LZR.HTML5.ProductLib.ProductManage";
LZR.HTML5.ProductLib.ProductManage.prototype.version = "0.0.0";
LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/ProductLib/ProductManage/Proview/Proview.js",
	LZR.HTML5.jsPath + "HTML5/ProductLib/ProductManage/GoodsTree/GoodsTree.js"
]);

// 设置 CSS 样式
LZR.HTML5.ProductLib.ProductManage.prototype.css = function () {
	this.div.appendChild(this.goodsTree.div);
	this.div.appendChild(this.pro);

	this.goodsTree.div.style["float"] =  "left";
	this.pro.style["float"] =  "right";
	this.pro.style.width = "50%";
	this.pro.style.height = "100%";
	this.pro.style.background = "#0FF";
};

// 添加属性视图
LZR.HTML5.ProductLib.ProductManage.prototype.addProview = function (view) {
	if (view.data.name) {
		this.pro.appendChild (view.div);
	}
};

// 清空属性视图
LZR.HTML5.ProductLib.ProductManage.prototype.remveProview = function () {
	while (this.pro.firstChild) {
		LZR.HTML5.Util.del  (this.pro.firstChild.proview);
		this.pro.removeChild(this.pro.firstChild);
	}
};
