// ----------- 產品管理 ------------
function ProductManage (obj) {
	try {
		this._ProductManage (obj);
	} catch (e) {}
}
ProductManage.prototype._ProductManage = function (obj) {
	// 構造函數
	this.data = obj;					// 源數據
	this.div = document.createElement("div");		// 容器
	this.pro = document.createElement("div");		// 屬性視圖容器
	this.goodsTree = new GoodsTree(obj);		// 產品樹
	this.goodsTree.setManage(this);			// 设置属性视图容器
	this.css();
};

ProductManage.prototype.css = function () {		// 設置 CSS 樣式
	this.div.appendChild(this.goodsTree.div);
	this.div.appendChild(this.pro);

	this.goodsTree.div.style.float =  "left";
	this.pro.style.float =  "right";
	this.pro.style.width = "50%";
	this.pro.style.height = "100%";
	this.pro.style.background = "#0FF";
};

ProductManage.prototype.addProview = function (view) {		// 添加属性视图
	if (view.data.name) {
		this.pro.appendChild (view.div);
	}
};

ProductManage.prototype.remveProview = function () {		// 清空屬性視圖
	while (this.pro.firstChild) {
		delete (this.pro.firstChild.proview);
		this.pro.removeChild(this.pro.firstChild);
	}
};
