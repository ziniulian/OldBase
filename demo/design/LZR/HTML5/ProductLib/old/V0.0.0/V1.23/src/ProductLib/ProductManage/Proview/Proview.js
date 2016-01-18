// ----------- class Proview：屬性视图------------
function Proview (node) {
	if (node) {
		this._Proview (node);
	}
}
Proview.prototype._Proview = function (node) {
	this.node = node;					// 树节点
	this.data = node.data;				// 数据
	this.div = document.createElement("div");		// 容器
	this.div.proview = this;				// 容器.数据
	this.css();
};

Proview.prototype.css = function () {			// 设置CSS样式
	this.div.innerHTML = this.data.name + "<br><br>";
	this.div.appendChild(this.createAddButton());
	this.div.appendChild(this.createDelButton());
	this.div.appendChild(this.createChangeButton());
};

Proview.prototype.parseEvent = function (e) {		// 事件解析
	var event = window.event || e;
	var target = event.srcElement || event.target;
	while (!target.proview) {
		target = target.parentNode || target.parentElement;
	}
	return target.proview;
};

Proview.prototype.createAddButton = function () {		// 生成添加按钮
	var b = document.createElement("input");
	b.type="button";
	b.value="添加";
	b.onclick = function (e) {
		Proview.prototype.parseEvent(e).add();
	};
	return b;
};

Proview.prototype.createDelButton = function () {		// 生成删除按钮
	var b = document.createElement("input");
	b.type="button";
	b.value="刪除";
	b.onclick = function (e) {
		Proview.prototype.parseEvent(e).del();
	};
	return b;
};

Proview.prototype.createChangeButton = function () {	// 生成修改按钮
	var b = document.createElement("input");
	b.type="button";
	b.value="修改";
	b.onclick = function (e) {
		Proview.prototype.parseEvent(e).change();
	};
	return b;
};

Proview.prototype.add = function () {		// 添加
	var s = prompt("请输入名字：", "输入个名字");
	this.node.addNode ({name:s, type:"product"});
};

Proview.prototype.del = function () {		// 删除
	this.node.del ();
	this.node.tree.mg.remveProview();
};

Proview.prototype.change = function () {		// 修改
	var s = prompt("请输入名字：", "输入个名字");
	this.node.setName(s);
};
