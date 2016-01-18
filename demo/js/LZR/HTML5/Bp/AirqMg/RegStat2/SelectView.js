// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2/SelectView.js" ]);

// ----------- 选择控件 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/Event.js",
	LZR.HTML5.jsPath + "HTML5/util/Layout/BaseDiv.js",
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2.js"
]);
LZR.HTML5.Bp.AirqMg.RegStat2.SelectView = function (obj) {
	var vc = LZR.Util.ValCtrl;

	// 数据
	this.data = {
		html: new vc(""),		// 显示内容
		selected: new vc(false),	// 是否被选中
		cssNormal: new vc(),		// 未被选中时样式
		cssSelected: new vc()	// 选中时样式
	};

	// 容器对象
	this.bdo = new LZR.HTML5.Util.Layout.BaseDiv({});

	// 设置参数
	if (obj) {
		LZR.setObj (this.data, obj);
	}

	// 事件回调总设置
	this.callback();

	// 初始化
	this.init ();
};
LZR.HTML5.Bp.AirqMg.RegStat2.SelectView.prototype.className = "LZR.HTML5.Bp.AirqMg.RegStat2.SelectView";
LZR.HTML5.Bp.AirqMg.RegStat2.SelectView.prototype.version = "0.0.0";

// 初始化
LZR.HTML5.Bp.AirqMg.RegStat2.SelectView.prototype.init = function () {
	LZR.HTML5.Util.Event.addEvent (this.bdo.div, "click", LZR.bind(this, function () {
		this.data.selected.set (!this.data.selected.val);
	}), false);

	if (this.data.selected.val) {
		this.bdo.addClass (this.data.cssSelected.val);
	} else {
		this.bdo.addClass (this.data.cssNormal.val);
	}

	this.bdo.div.innerHTML = this.data.html.val;
};

// -------------------- 事件回调 ------------------

// 事件回调总设置
LZR.HTML5.Bp.AirqMg.RegStat2.SelectView.prototype.callback = function () {
	// 显示内容
	this.data.html.setEventObj (this);
	this.data.html.event.change.append (function (v) {
		this.bdo.div.innerHTML = v;
	});

	// 是否被选中
	this.data.selected.event.change.append (LZR.bind (this, function (v) {
		if (v) {
			this.bdo.delClass (this.data.cssNormal.val);
			this.bdo.addClass (this.data.cssSelected.val);
		} else {
			this.bdo.delClass (this.data.cssSelected.val);
			this.bdo.addClass (this.data.cssNormal.val);
		}
	}), "selected");

	// 未被选中时样式
	this.data.cssNormal.setEventObj (this);
	this.data.cssNormal.event.before.append (function (v, self) {
		if (!this.data.selected.val) {
			this.bdo.delClass (self.val);
			this.bdo.addClass (v);
		}
	});

	// 选中时样式
	this.data.cssSelected.setEventObj (this);
	this.data.cssSelected.event.before.append (function (v, self) {
		if (this.data.selected.val) {
			this.bdo.delClass (self.val);
			this.bdo.addClass (v);
		}
	});
};

