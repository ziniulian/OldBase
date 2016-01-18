// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5\\ProductLib\\ProductManage\\Proview\\Proview.js", ]);

// ----------- 屬性视图------------

LZR.HTML5.ProductLib.ProductManage.Proview = function (node) {
	this.node = node;					// 树节点
	this.data = node.data;				// 数据
	this.div = document.createElement("div");		// 容器
	this.div.proview = this;				// 容器.数据
	this.css();
};
LZR.HTML5.ProductLib.ProductManage.Proview.prototype.className = "LZR.HTML5.ProductLib.ProductManage.Proview";
LZR.HTML5.ProductLib.ProductManage.Proview.prototype.version = "0.0.0";

// 设置CSS样式
LZR.HTML5.ProductLib.ProductManage.Proview.prototype.css = function () {
	this.div.innerHTML = this.data.name + "<br><br>";
	this.div.appendChild(this.createAddButton());
	this.div.appendChild(this.createDelButton());
	this.div.appendChild(this.createChangeButton());
};

// 事件解析
LZR.HTML5.ProductLib.ProductManage.Proview.prototype.parseEvent = function (e) {
	var event = window.event || e;
	var target = event.srcElement || event.target;
	while (!target.proview) {
		target = target.parentNode || target.parentElement;
	}
	return target.proview;
};

// 生成添加按钮
LZR.HTML5.ProductLib.ProductManage.Proview.prototype.createAddButton = function () {
	var b = document.createElement("input");
	b.type="button";
	b.value="添加";
	b.onclick = function (e) {
		LZR.HTML5.ProductLib.ProductManage.Proview.prototype.parseEvent(e).add();
	};
	return b;
};

// 生成删除按钮
LZR.HTML5.ProductLib.ProductManage.Proview.prototype.createDelButton = function () {
	var b = document.createElement("input");
	b.type="button";
	b.value="刪除";
	b.onclick = function (e) {
		LZR.HTML5.ProductLib.ProductManage.Proview.prototype.parseEvent(e).del();
	};
	return b;
};

// 生成修改按钮
LZR.HTML5.ProductLib.ProductManage.Proview.prototype.createChangeButton = function () {
	var b = document.createElement("input");
	b.type="button";
	b.value="修改";
	b.onclick = function (e) {
		LZR.HTML5.ProductLib.ProductManage.Proview.prototype.parseEvent(e).change();
	};
	return b;
};

// 添加
LZR.HTML5.ProductLib.ProductManage.Proview.prototype.add = function () {
	var s = prompt("请输入名字：", "输入个名字");
	this.node.addNode ({name:s, type:"product"});
};

// 删除
LZR.HTML5.ProductLib.ProductManage.Proview.prototype.del = function () {
	this.node.del ();
	this.node.tree.mg.remveLZR.HTML5.ProductLib.ProductManage.Proview();
};

// 修改
LZR.HTML5.ProductLib.ProductManage.Proview.prototype.change = function () {
	var s = prompt("请输入名字：", "输入个名字");
	this.node.setName(s);
};
