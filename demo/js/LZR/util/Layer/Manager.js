// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "util/Layer/Manager.js" ]);

// --------------------- 通用图层管理器 ----------------------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/Layer.js"
]);
LZR.Util.Layer.Manager = function (obj) {
	// 是否触发事件
	this.enableEvent = true;

	// 事件自动恢复
	this.autoEvent = true;

	// 图层集合
	this.layers = [];

	// 事件回调
	this.event = {
		"create": new LZR.Util.CallBacks (this),
		"append": new LZR.Util.CallBacks (this),
		"delete": new LZR.Util.CallBacks (this),
		"replace": new LZR.Util.CallBacks (this)
	};

	// 设置参数
	if (obj) {
		LZR.setObj (this, obj);
	}
};
LZR.Util.Layer.Manager.prototype.className = "LZR.Util.Layer.Manager";
LZR.Util.Layer.Manager.prototype.version = "0.0.0";

// 创建图层集合
LZR.Util.Layer.Manager.prototype.createLayers = function (obj) {
	var ee = this.enableEvent;
	var ae = this.autoEvent;
	this.enableEvent = false;
	this.autoEvent = false;
	this.layers = [];
	for (var i=0; i<obj.length; i++) {
		var o = obj[i];
		var cls = LZR.Util.Layer;	// 默认图层类型
		if (o.cls) {
			// 自定义图层类型
			cls = eval(o.cls);
		}
		this.append( new cls(obj[i]) );
	}
	this.enableEvent = ee;
	this.autoEvent = ae;
	this.trigger ("create");
};

// 添加一个图层
LZR.Util.Layer.Manager.prototype.append = function (layer) {
	layer.index = this.layers.length;
	this.layers.push(layer);
	this.trigger ("append");
};

// 删除一个图层
LZR.Util.Layer.Manager.prototype["delete"] = function (index) {
	if (index < this.layers.length) {
		this.layers.splice(index, 1);
		for (var i=index; i<this.layers.length; i++) {
			this.layers[i].index --;
		}
		this.trigger ("delete");
	}
};

// 交换图层位置
LZR.Util.Layer.Manager.prototype.replace = function (from, to) {
	var y = this.layers[from];
	if (y) {
		if (to<0) {
			to = 0;
		} else if (to >= this.layers.length) {
			to = this.layers.length-1;
		}
		if (y !== to) {
			this.layers[from] = this.layers[to];
			this.layers[to] = y;
			this.trigger ("replace");
		}
	}
};

// 刷新显示
LZR.Util.Layer.Manager.prototype.flush = function () {
	for (var i=0; i<this.layers.length; i++) {
		this.layers[i].flush();
	}
};

// 设置事件调用对象
LZR.Util.Layer.Manager.prototype.setEventObj = function (obj) {
	for (var s in this.event) {
		this.event[s].obj = obj;
	}
};

// 事件触发器
LZR.Util.Layer.Manager.prototype.trigger = function (eventName) {
	if (this.enableEvent) {
		switch (eventName) {
			case "create":
				this.onCreate (this.layers);
				break;
			case "append":
				this.onAppend (this.layers);
				break;
			case "delete":
				this.onDelete (this.layers);
				break;
			case "replace":
				this.onReplace (this.layers);
				break;
		}
	} else if (this.autoEvent) {
		this.enableEvent = true;
	}
};

// -------------------- 事件 ------------------

// 创建图层时触发的事件
LZR.Util.Layer.Manager.prototype.onCreate = function (layers) {
	return this.event.create.execute (layers);
};

// 添加图层时触发的事件
LZR.Util.Layer.Manager.prototype.onAppend = function (layers) {
	return this.event.append.execute (layers);
};

// 删除图层时触发的事件
LZR.Util.Layer.Manager.prototype.onDelete = function (layers) {
	return this.event["delete"].execute (layers);
};

// 图层交换时触发的事件
LZR.Util.Layer.Manager.prototype.onReplace = function (layers) {
	return this.event.replace.execute (layers);
};

