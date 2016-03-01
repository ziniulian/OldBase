window.ol||(LZR.HTML5.loadJs([LZR.HTML5.jsPath+"HTML5/expand/ol3/ol.js"]),LZR.HTML5.loadCss([LZR.HTML5.jsPath+"HTML5/expand/ol3/ol.css"]));LZR.HTML5.loadJs([LZR.HTML5.jsPath+"util/Layer/Manager.js",LZR.HTML5.jsPath+"HTML5/Bp/Util/BpTimeAxis.js"]);LZR.HTML5.Bp.AirqMg.RegStat2=function(a){this.data=this.olmap=null;this.layersMgr=new LZR.Util.Layer.Manager;this.countOfOlLayer=this.allFlushed=0;a&&LZR.setObj(this,a);this.initViewByData()};LZR.HTML5.Bp.AirqMg.RegStat2.prototype.className="LZR.HTML5.Bp.AirqMg.RegStat2";
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.version="0.1.3";LZR.HTML5.loadJs([LZR.HTML5.jsPath+"HTML5/Bp/AirqMg/RegStat2/OlLayer.js",LZR.HTML5.jsPath+"HTML5/Bp/AirqMg/RegStat2/OlGeoJsonLayer.js",LZR.HTML5.jsPath+"HTML5/Bp/AirqMg/RegStat2/WindLayer.js",LZR.HTML5.jsPath+"HTML5/Bp/AirqMg/RegStat2/ViewData.js",LZR.HTML5.jsPath+"HTML5/Bp/AirqMg/RegStat2/SelectView.js",LZR.HTML5.jsPath+"HTML5/Bp/AirqMg/RegStat2/Query.js"]);
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByData=function(){if(this.data)for(var a in this.data)switch(a){case "fom":this.initViewByFom(this.data.fom);break;case "line":this.initViewByLine(this.data.line);break;case "wind":this.initViewByWind(this.data.wind);break;case "mod":this.initViewByMod(this.data.mod);break;case "area":this.initViewByArea(this.data.area);break;case "timeStep":this.initViewByTimeStep(this.data.timeStep);break;case "time":this.initViewByTime(this.data.time);break;case "date":this.initViewByDate(this.data.date);
break;case "timeAxis":this.initViewByTimeAxis(this.data.timeAxis);break;case "timeHover":this.initViewByTimeHover(this.data.timeHover);break;case "qry":this.initViewByQry(this.data.qry);break;case "mark":this.initViewByMark(this.data.mark)}};LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByFom=function(a){this.initLayer(a)};LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByLine=function(a){this.initLayer(a)};LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByWind=function(a){this.initLayer(a)};
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initLayer=function(a){if(!a.ctrl){var b,c;switch(a.id){case "fom":b="OlLayer";c={num:a.root.cur[a.id][a.root.cur.timeStep.id],visible:a.root.cur[a.id].visible.val,alpha:a.root.cur[a.id].alpha.val,dataProjection:a.root.cur[a.id].dataProjection,mapProjection:a.root.cur[a.id].mapProjection,area:a.root.cur.area.range};break;case "line":b="OlGeoJsonLayer";c={num:a.root.cur[a.id][a.root.cur.timeStep.id],visible:a.root.cur[a.id].visible.val,alpha:a.root.cur[a.id].alpha.val,
dataProjection:a.root.cur[a.id].dataProjection,mapProjection:a.root.cur[a.id].mapProjection};break;case "wind":b="WindLayer",c={visible:a.root.cur[a.id].visible.val,alpha:a.root.cur[a.id].alpha.val,windUrl:a.root.cur[a.id].windUrl,column:a.root.cur[a.id].column,row:a.root.cur[a.id].row,pad:a.root.cur[a.id].pad,windCanvasStyle:a.root.cur[a.id].windCanvasStyle,color:a.root.cur[a.id].color,dataProjection:a.root.cur[a.id].dataProjection,mapProjection:a.root.cur[a.id].mapProjection}}a.ctrl=new LZR.HTML5.Bp.AirqMg.RegStat2[b](c);
a.ctrl.dataParent=a.root.cur[a.id];this.layersMgr.append(a.ctrl);switch(a.id){case "fom":this.countOfOlLayer++;break;case "line":case "wind":a.ctrl.autoFlush=!1}a.ctrl.init(this.olmap);a.ctrl.event.flushed.obj=this;a.ctrl.event.flushed.append(this.layerFlushed)}for(var d in a.children)b=a.children[d],b.ctrl||(b.ctrl=a.ctrl,b.alpha=b.ctrl.alpha),b.view||(b.view=new LZR.HTML5.Bp.AirqMg.RegStat2.SelectView({html:b.html,selected:b.visible})),b.visible.setEventObj(this),b.alpha.event.change.append(LZR.bind(this,
this.setLayerAlpha,b),b.id+"_alpha"),b.visible.event.change.append(LZR.bind(this,this.setLayerVisible,b),"visible")};LZR.HTML5.Bp.AirqMg.RegStat2.prototype.setLayerVisible=function(a,b){if(b){var c=a.parent.id;a!==a.root.cur[c]&&(a.root.cur[c].visible.set(!1),a.root.cur[c]=a,a.ctrl.dataParent=a,a.ctrl.num&&a.ctrl.num.set(a[a.root.cur.timeStep.id]));this.flush()}a.ctrl.visible.set(b)};LZR.HTML5.Bp.AirqMg.RegStat2.prototype.setLayerAlpha=function(a,b){a.ctrl.alpha.set(b)};
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.flush=function(){this.allFlushed=0;this.data.qry.ctrl.open()};LZR.HTML5.Bp.AirqMg.RegStat2.prototype.layerFlushed=function(){this.allFlushed++;if(this.allFlushed===this.layersMgr.layers.length)this.allLayersFlushed();else if(this.allFlushed===this.layersMgr.layers.length-this.countOfOlLayer)for(var a=this.layersMgr.layers,b=0;b<a.length;b++){var c=a[b];switch(c.className){case "LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer":c.timeId.set(this.data.timeAxis.ctrl.ta.getCurrentPosition())}}};
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.allLayersFlushed=function(){for(var a=this.layersMgr.layers,b=function(a,b){a.alpha.set(b)},c=0;c<a.length;c++){var d=a[c];switch(d.className){case "LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer":if(d.visible.val){var e=d.alpha.val;d.alpha.set(0);setTimeout(LZR.bind(this,b,d,e),50)}case "LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer":d.autoFlush=!0,d.data=d.newData,d.draw()}}this.data.timeAxis.playing&&(this.data.timeAxis.playing=setTimeout(LZR.bind(this,function(){this.data.timeAxis.playing&&
this.data.timeAxis.ctrl.next()}),this.data.timeAxis.playWaitTime.val))};LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByMod=function(a){this.initSelect(a);a.ctrl.event.change.append(this.setMod)};LZR.HTML5.Bp.AirqMg.RegStat2.prototype.setMod=function(a){this.data.timeAxis.ctrl.stop();this.data.timeAxis.ctrl.autoStop();a.root.setTimeLongByTimeAxis();a.root.qry.ctrl.setQry({mod:a.id,end:a.root.getEndByInterface()})};
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByArea=function(a){this.initSelect(a);a.ctrl.event.change.append(this.setArea)};LZR.HTML5.Bp.AirqMg.RegStat2.prototype.setArea=function(a){this.data.timeAxis.ctrl.stop();this.data.timeAxis.ctrl.autoStop();a.root.fom.ctrl.area.set(a.range);a.root.setTimeLongByTimeAxis();a.root.qry.ctrl.setQry({area:a.num,end:a.root.getEndByInterface()})};LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByTimeStep=function(a){this.initSelect(a);a.ctrl.event.change.append(this.setTimeStep)};
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.setTimeStep=function(a){this.data.timeAxis.ctrl.stop();this.data.timeAxis.ctrl.autoStop();var b=a.root.timeAxis.timeLong.val;switch(a.id){case "hour":a.root.timeAxis.ctrl.setter("timeStep",3600);a.root.timeAxis.ctrl.setter("timeLong",24*b);break;case "day":a.root.timeAxis.ctrl.setter("timeStep",86400),a.root.timeAxis.ctrl.setter("timeLong",b)}this.resetLayerTimeId();b=a.root.cur.fom;b.ctrl.num.enableEvent=!1;b.ctrl.num.set(b[a.id]);b=a.root.cur.line;b.ctrl.num.enableEvent=
!1;b.ctrl.num.set(b[a.id])};LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByTime=function(a){this.initSelect(a);a.ctrl.event.change.append(this.setTime)};LZR.HTML5.Bp.AirqMg.RegStat2.prototype.setTime=function(){this.data.timeAxis.ctrl.stop();this.data.timeAxis.ctrl.autoStop();this.data.qry.ctrl.setQry({tim:this.data.getTimByInterface()});this.data.timeAxis.ctrl.setter("startTime",this.data.getStartTimeByTimeAxis());this.resetLayerTimeId()};
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initSelect=function(a){a.ctrl||(a.ctrl={event:{flush:new LZR.Util.CallBacks(this),change:new LZR.Util.CallBacks(this)}},a.ctrl.event.flush.append(this.flush));for(var b in a.children){var c=a.children[b];c.view||(c.view=new LZR.HTML5.Bp.AirqMg.RegStat2.SelectView(c));c.selected.event.before.append(LZR.bind(this,this.selectBefore,c),"selectBefore");c.selected.event.change.append(LZR.bind(this,this.selectHandle,c),"selectHandle")}};
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.selectBefore=function(a,b){var c=a.parent.id;if(b)if(a!==a.root.cur[c]){var d=a.root.cur[c];a.root.cur[c]=a;d.selected.set(!1)}else return!1;else if(a===a.root.cur[c])return!1};LZR.HTML5.Bp.AirqMg.RegStat2.prototype.selectHandle=function(a,b){b&&(a.parent.ctrl.event.change.execute(a),a.parent.ctrl.event.flush.execute(a))};
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByDate=function(a){a.view||(a.view=document.createElement("input"),a.view.value=a.content.val,LZR.HTML5.Util.Event.addEvent(a.view,"change",LZR.bind(this,function(a){a.content.set(a.view.value)},a),!1),a.content.setEventObj(this),a.content.event.change.append(this.setTime),a.content.event.change.append(this.flush,"flush"))};
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByTimeAxis=function(a){if(!a.ctrl){var b={style:a.style,count:a.timeLong.val,startTime:a.root.getStartTimeByTimeAxis(),noDrop:a.noDrop,hoverTime:a.hoverTime,div:a.view};switch(a.root.cur.timeStep.id){case "hour":b.timeStep=3600;b.timeLong=24*a.timeLong.val;break;case "day":b.timeStep=86400,b.timeLong=a.timeLong.val}a.ctrl=new LZR.HTML5.Bp.Util.BpTimeAxis(b);a.view=a.ctrl;a.timeLong.setEventObj(this);a.timeLong.event.change.append(this.setTimeLong);a.ctrl.beforePlay=
LZR.bind(this,function(a){a.playing=!0;a.ctrl.next();return!1},a);a.ctrl.autoStop=LZR.bind(this,function(a){clearTimeout(a.playing);a.playing=!1},a);a.ctrl.onchange=LZR.bind(this,this.changeTimeAxis)}};LZR.HTML5.Bp.AirqMg.RegStat2.prototype.setTimeLong=function(a){switch(this.data.cur.timeStep.id){case "hour":this.data.timeAxis.ctrl.setter("timeLong",24*a);break;case "day":this.data.timeAxis.ctrl.setter("timeLong",a)}this.data.timeAxis.ctrl.setter("count",a);this.resetLayerTimeId()};
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.resetLayerTimeId=function(){this.data.fom.ctrl.timeId.set(0,!1);this.data.line.ctrl.timeId.set(0,!1);this.data.wind.ctrl.timeId.set(0,!1)};
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.changeTimeAxis=function(a,b){this.allFlushed=0;for(var c=this.layersMgr.layers,d=0;d<c.length;d++){var e=c[d];switch(e.className){case "LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer":this.countOfOlLayer===c.length&&e.timeId.set(b);break;case "LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer":case "LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer":e.autoFlush=!1,e.timeId.set(b)}}this.data.cur.tp.set(b)};LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByTimeHover=function(){};
LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByQry=function(a){a.ctrl||(a.ctrl=new LZR.HTML5.Bp.AirqMg.RegStat2.Query({data:a.root,layers:this.layersMgr.layers}),a.ctrl.foc.setUrlPre(a.urlPre),a.ctrl.setQry({area:a.root.cur.area.num,mod:a.root.cur.mod.id,tim:a.root.getTimByInterface(),start:a.start,end:a.root.getEndByInterface(),url:a.wsUrl}))};LZR.HTML5.Bp.AirqMg.RegStat2.prototype.initViewByMark=function(){};
