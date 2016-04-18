// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2/OlLayer.js" ]);

// ----------- OpenLayers图片图层 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "util/Layer.js",
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2.js"
]);
LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer = function (obj) {
	var vc = LZR.Util.ValCtrl;
	LZR.Util.Layer.call(this);

	// OpenLayers图层
	this.layer = null;

	// 查询编号
	this.num = new vc();

	// 时间序号
	this.timeId = new vc(0);

	// 图片范围（包含4个元素的数组，顺序为：左、下、右、上）
	this.area = new vc();

	// 数据投影模式
	this.dataProjection = "EPSG:4326";

	// 地图投影模式
	this.mapProjection = "EPSG:4326";

	// 事件回调
	this.event = {
		"flushed": new LZR.Util.CallBacks (this)
	};

	// 事件回调总设置
	this.callback();

	// 设置参数
	if (obj) {
		LZR.setObj (this, obj);
	}
};
LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer.prototype = LZR.createPrototype (LZR.Util.Layer.prototype);
LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer.prototype._super = LZR.Util.Layer.prototype;
LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer.prototype.className = "LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer";
LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer.prototype.version = "0.0.2";

// 初始化
LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer.prototype.init = function (olmap) {
	if (!this.layer) {
		this.layer = new ol.layer.Image({
			visible: this.visible.val,
			opacity: this.alpha.val
		});
		olmap.addLayer(this.layer);
	}
	this.dataProj = ol.proj.get(this.dataProjection);
	this.mapProj = ol.proj.get(this.mapProjection);
};

// 刷新显示
LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer.prototype.flush = function () {
	if (this.visible.val && this.alpha.val>0) {
		if (this.layer) {
			var s = this.info.val[this.timeId.val];
			if (s) {
				this.sourceCre (s.ret);
				return;
			}
		}
	}

	// 刷新异常结束的回调
	this.flushed();
};

// 生成数据源
LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer.prototype.sourceCre = function (url) {
	var src = new ol.source.ImageStatic ({
		url: url,
		imageExtent: ol.proj.transformExtent (this.area.val, this.dataProj, this.mapProj)
	});

	// 添加图片加载完成的事件
	src.on ("imageloadend", this.flushed, this);
	src.on ("imageloaderror", this.flushed, this);

	// 修改图层的数据源
	this.layer.setSource (src);
};

// -------------------- 事件 ------------------

// 图片刷新结束时触发的事件
LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer.prototype.flushed = function (self) {
	return this.event.flushed.execute (this);
};

// -------------------- 事件回调 ------------------

// 事件回调总设置
LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer.prototype.callback = function () {
	// 时间序号
	this.timeId.setEventObj (this);
	this.timeId.event.change.append (this.flush);

	// 图片信息
	this.info.setEventObj (this);
	this.info.event.set.append (this.flush);
/*
	// 刘亮图片数据测试
	this.info.event.set.append ( LZR.bind(this, function () {
		if (this.className === "LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer") {
			// console.log (this.info);
			this.info.val[0].ret = "http://192.168.1.201/bpycserver/api/Grd/getPollutantDataImg?model=naqpms&isAverage=true&pTime=2015-01-07%2000&cTime=2015-01-07 00&prediction=1&zone=1&lonmin=67.10118301731862&latmin=18.669545898719303&lonmax=151.47618302904127&latmax=48.73618374982311&rowNo=384&columnNo=168&pollutant=TPM25";
			this.info.val[1].ret = "http://192.168.1.201/bpycserver/api/Grd/getPollutantDataImg?model=naqpms&isAverage=true&pTime=2015-01-07%2000&cTime=2015-01-07 01&prediction=1&zone=1&lonmin=67.10118301731862&latmin=18.669545898719303&lonmax=151.47618302904127&latmax=48.73618374982311&rowNo=384&columnNo=168&pollutant=TPM25";
			this.info.val[2].ret = "http://192.168.1.201/bpycserver/api/Grd/getPollutantDataImg?model=naqpms&isAverage=true&pTime=2015-01-07%2000&cTime=2015-01-07 02&prediction=1&zone=1&lonmin=67.10118301731862&latmin=18.669545898719303&lonmax=151.47618302904127&latmax=48.73618374982311&rowNo=384&columnNo=168&pollutant=TPM25";
			this.info.val[3].ret = "http://192.168.1.201/bpycserver/api/Grd/getPollutantDataImg?model=naqpms&isAverage=true&pTime=2015-01-07%2000&cTime=2015-01-07 03&prediction=1&zone=1&lonmin=67.10118301731862&latmin=18.669545898719303&lonmax=151.47618302904127&latmax=48.73618374982311&rowNo=384&columnNo=168&pollutant=TPM25";
			this.info.val[4].ret = "http://192.168.1.201/bpycserver/api/Grd/getPollutantDataImg?model=naqpms&isAverage=true&pTime=2015-01-07%2000&cTime=2015-01-07 04&prediction=1&zone=1&lonmin=67.10118301731862&latmin=18.669545898719303&lonmax=151.47618302904127&latmax=48.73618374982311&rowNo=384&columnNo=168&pollutant=TPM25";
			this.info.val[5].ret = "http://192.168.1.201/bpycserver/api/Grd/getPollutantDataImg?model=naqpms&isAverage=true&pTime=2015-01-07%2000&cTime=2015-01-07 05&prediction=1&zone=1&lonmin=67.10118301731862&latmin=18.669545898719303&lonmax=151.47618302904127&latmax=48.73618374982311&rowNo=384&columnNo=168&pollutant=TPM25";
			this.info.val[6].ret = "http://192.168.1.201/bpycserver/api/Grd/getPollutantDataImg?model=naqpms&isAverage=true&pTime=2015-01-07%2000&cTime=2015-01-07 06&prediction=1&zone=1&lonmin=67.10118301731862&latmin=18.669545898719303&lonmax=151.47618302904127&latmax=48.73618374982311&rowNo=384&columnNo=168&pollutant=TPM25";
			this.info.val[7].ret = "http://192.168.1.201/bpycserver/api/Grd/getPollutantDataImg?model=naqpms&isAverage=true&pTime=2015-01-07%2000&cTime=2015-01-07 07&prediction=1&zone=1&lonmin=67.10118301731862&latmin=18.669545898719303&lonmax=151.47618302904127&latmax=48.73618374982311&rowNo=384&columnNo=168&pollutant=TPM25";
			this.info.val[8].ret = "http://192.168.1.201/bpycserver/api/Grd/getPollutantDataImg?model=naqpms&isAverage=true&pTime=2015-01-07%2000&cTime=2015-01-07 08&prediction=1&zone=1&lonmin=67.10118301731862&latmin=18.669545898719303&lonmax=151.47618302904127&latmax=48.73618374982311&rowNo=384&columnNo=168&pollutant=TPM25";
			this.info.val[9].ret = "http://192.168.1.201/bpycserver/api/Grd/getPollutantDataImg?model=naqpms&isAverage=true&pTime=2015-01-07%2000&cTime=2015-01-07 09&prediction=1&zone=1&lonmin=67.10118301731862&latmin=18.669545898719303&lonmax=151.47618302904127&latmax=48.73618374982311&rowNo=384&columnNo=168&pollutant=TPM25";
			this.info.val[10].ret = "http://192.168.1.201/bpycserver/api/Grd/getPollutantDataImg?model=naqpms&isAverage=true&pTime=2015-01-07%2000&cTime=2015-01-07 10&prediction=1&zone=1&lonmin=67.10118301731862&latmin=18.669545898719303&lonmax=151.47618302904127&latmax=48.73618374982311&rowNo=384&columnNo=168&pollutant=TPM25";
			this.info.val[11].ret = "http://192.168.1.201/bpycserver/api/Grd/getPollutantDataImg?model=naqpms&isAverage=true&pTime=2015-01-07%2000&cTime=2015-01-07 11&prediction=1&zone=1&lonmin=67.10118301731862&latmin=18.669545898719303&lonmax=151.47618302904127&latmax=48.73618374982311&rowNo=384&columnNo=168&pollutant=TPM25";
		}
		this.flush();
	}));
*/
	// 透明度
	this.alpha.setEventObj (this);
	this.alpha.event.change.append (this.changeAlpha);

	// 是否可见
	this.visible.setEventObj (this);
	this.visible.event.change.append (this.changeVisible);
};

// 修改透明度
LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer.prototype.changeAlpha = function (v) {
	if (this.layer) {
		this.layer.setOpacity(v);
	}
};

// 修改是否可见
LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer.prototype.changeVisible = function (v) {
	if (this.layer) {
		this.layer.setVisible(v);
	}
};

