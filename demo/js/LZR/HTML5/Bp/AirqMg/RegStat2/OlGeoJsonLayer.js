// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2/OlGeoJsonLayer.js" ]);

// ----------- OpenLayers GeoJson图层 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/util/Ajax.js",
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2/OlLayer.js"
]);
LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer = function (obj) {
	LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer.call(this);

	// 是否自动刷新
	this.autoFlush = true;

	// 样式缓存
	this.styleCache = [];

	// 数据源
	this.src = new ol.source.Vector();

	// 数据
	this.data = null;

	// 新数据
	this.newData = null;

	// 对应的主数据
	this.dataParent = null;

	// 刷新计数器
	this.countOfFlush = 0;

	// 设置参数
	if (obj) {
		LZR.setObj (this, obj);
	}
};
LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer.prototype = LZR.createPrototype (LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer.prototype);
LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer.prototype._super = LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer.prototype;
LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer.prototype.className = "LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer";
LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer.prototype.version = "0.0.2";

// 初始化
LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer.prototype.init = function (olmap) {
	if (!this.layer) {
		this.layer = new ol.layer.Vector({
			visible: this.visible.val,
			opacity: this.alpha.val,
			source: this.src,
			style: LZR.bind(this, this.styleCallback)
		});
		olmap.addLayer(this.layer);
	}
};

// 画图
LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer.prototype.draw = function () {
	if (this.data) {
		this.src.clear();
		this.src.addFeatures(new ol.format.GeoJSON().readFeatures(this.data, {dataProjection: this.dataProjection, featureProjection: this.mapProjection}));
	}
};

// 生成数据源
LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer.prototype.sourceCre = function (url) {
	this.countOfFlush ++;
	new LZR.HTML5.Util.Ajax ().get (url, LZR.bind (this, this.onload));
};

// -------------------- 事件回调 ------------------

// 样式回调函数
LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer.prototype.styleCallback = function (feature, resolution) {
	var text = feature.get("CNTR_VALUE");	// 此处需改成小申数据的 CNTR_VALUE 属性值
	text += " " + this.dataParent.unit;
	if (!this.styleCache[text]) {
		this.styleCache[text] = [new ol.style.Style({
/*
			fill: new ol.style.Fill({
				color: self.appConfig.gradeColors[text-1]
			}),
*/
			stroke: new ol.style.Stroke({
				color: '#425fff',
				width: 2
			}),
			text: new ol.style.Text({
				font: '10px Calibri,sans-serif',
				text: text,
				fill: new ol.style.Fill({
					color: '#000'
				}),
				stroke: new ol.style.Stroke({
					color: '#fff',
					width: 3
				})
			})
		})];
	}
	return this.styleCache[text];
};

// 下载完GeoJson数据时的回调函数
LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer.prototype.onload = function (txt) {
	this.countOfFlush --;

	if (txt) {
		this.newData = JSON.parse(txt);
		if (this.autoFlush) {
			this.data = this.newData;
			this.draw();
		}
	}

	// 刷新结束的回调
	if (this.countOfFlush === 0) {
		this.flushed();
	}
};

