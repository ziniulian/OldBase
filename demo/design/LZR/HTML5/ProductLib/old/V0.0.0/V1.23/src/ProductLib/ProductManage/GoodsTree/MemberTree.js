// ----------- 成员树 ------------
function MemberTree (obj) {
	if (obj) {
		this._MemberTree (obj);
	}
}
MemberTree.prototype = new PropertyTree();
MemberTree.prototype._MemberTree = function (obj) {
	this._PropertyTree (obj);
};

MemberTree.prototype.css = function () {			// 设置页面样式
	this.div.style.background = "#0F0";
	this.div.style.padding = "10px 0px 10px 5px";
};
