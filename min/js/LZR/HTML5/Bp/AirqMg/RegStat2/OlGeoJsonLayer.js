LZR.HTML5.loadJs([LZR.HTML5.jsPath+"HTML5/util/Ajax.js",LZR.HTML5.jsPath+"HTML5/Bp/AirqMg/RegStat2/OlLayer.js"]);LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer=function(a){LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer.call(this);this.autoFlush=!0;this.styleCache=[];this.src=new ol.source.Vector;this.dataParent=this.newData=this.data=null;this.countOfFlush=0;a&&LZR.setObj(this,a)};LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer.prototype=LZR.createPrototype(LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer.prototype);
LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer.prototype._super=LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer.prototype;LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer.prototype.className="LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer";LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer.prototype.version="0.0.2";
LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer.prototype.init=function(a){this.layer||(this.layer=new ol.layer.Vector({visible:this.visible.val,opacity:this.alpha.val,source:this.src,style:LZR.bind(this,this.styleCallback)}),a.addLayer(this.layer))};LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer.prototype.draw=function(){this.data&&(this.src.clear(),this.src.addFeatures((new ol.format.GeoJSON).readFeatures(this.data,{dataProjection:this.dataProjection,featureProjection:this.mapProjection})))};
LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer.prototype.sourceCre=function(a){this.countOfFlush++;(new LZR.HTML5.Util.Ajax).get(a,LZR.bind(this,this.onload))};
LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer.prototype.styleCallback=function(a){a=a.get("CNTR_VALUE");a+=" "+this.dataParent.unit;this.styleCache[a]||(this.styleCache[a]=[new ol.style.Style({stroke:new ol.style.Stroke({color:"#425fff",width:2}),text:new ol.style.Text({font:"10px Calibri,sans-serif",text:a,fill:new ol.style.Fill({color:"#000"}),stroke:new ol.style.Stroke({color:"#fff",width:3})})})]);return this.styleCache[a]};
LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer.prototype.onload=function(a){this.countOfFlush--;a&&(this.newData=JSON.parse(a),this.autoFlush&&(this.data=this.newData,this.draw()));0===this.countOfFlush&&this.flushed()};