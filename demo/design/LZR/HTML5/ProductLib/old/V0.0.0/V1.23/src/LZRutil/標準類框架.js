


// ----------- 標準類 ------------
function Class (obj) {
	if (obj) {
		this._Class (obj);
	}
}
Class.prototype.className = "Class";
Class.prototype._Class = function (obj) {
	// 構造函數
};




// ----------- 標準子類 ------------
function SubClass (obj) {
	if (obj) {
		this._SubClass (obj);
	}
}
SubClass.prototype = new Class();
SubClass.prototype.className = "SubClass";
SubClass.prototype._SubClass = function (obj) {
	this._Class(obj);
};
