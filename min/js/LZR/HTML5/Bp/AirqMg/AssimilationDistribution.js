LZR.HTML5.loadJs([LZR.HTML5.jsPath+"util/Date.js",LZR.HTML5.jsPath+"HTML5/Canvas/LayerMgrEys.js",LZR.HTML5.jsPath+"HTML5/Canvas/Thumbnail.js",LZR.HTML5.jsPath+"HTML5/Bp/AirqMg/RegImg.js",LZR.HTML5.jsPath+"HTML5/Bp/AirqMg/RegStatRule.js",LZR.HTML5.jsPath+"HTML5/util/Scroll.js",LZR.HTML5.jsPath+"HTML5/Canvas/ImgLoader.js"]);
LZR.HTML5.Bp.AirqMg.AssimilationDistribution=function(a){this.condition=a.condition?a.condition:{};this.title=a.title;LZR.HTML5.Util.mateWidth(a.map);a.map.style.cursor="crosshair";this.map=new LZR.HTML5.Canvas.LayerManager(a.map);this.map.max.reset({top:1,left:1,width:1438,height:1118});this.map.s.top=1;this.map.s.left=1;this.map.s.w=this.map.max.w;this.map.s.reHeight();this.map.min.reset({width:100,height:100});this.map.offset={left:40,top:1,right:1,bottom:25};this.map.ctrl.leftCursor="move";this.map.autoFlush=
LZR.HTML5.Util.bind(this,this.mapAutoFlush);this.showMap=!1;LZR.HTML5.Util.mateWidth(a.tbn);this.tbn=new LZR.HTML5.Canvas.Thumbnail(a.tbn);this.tbn.direction=2;this.tbn.width=156;this.tbn.height=120;this.tbn.paddingU=40;this.tbn.offsetU=10;this.tbn.offsetV=10;this.tbn.buff=0;this.tbn.ctx.fillStyle="black";this.tbn.onchange=LZR.HTML5.Util.bind(this,function(a){this.map.layers=this.tbn.imgs[a].getLayers();this.changeTitle()});this.maps=new LZR.HTML5.Canvas.ImgLoader(LZR.HTML5.Util.bind(this,this.onMaps));
this.playSpeed=this.ctrlEnable=1;this.playState=0;this.playFrame=1;this.compass={};this.legend={};this.ruler=null;this.scrollObj=a.scrollObj;this.boderColor=null;this.path="";this.tbnFont=[{left:25,bottom:20,font:"17px Verdana"},{left:5,bottom:20,font:"17px Verdana"}];this.dayNum=7;this.rulerArea={latt:55,latb:8,lonl:69,lonr:140,dlon:9,dlat:8};this.periodStart=4;this.layersLoader=[];this.layersLoader[0]=new LZR.HTML5.Canvas.ImgLoader(LZR.bind(this,this.onLayersLoad,0));this.layersLoader[0].finished=
LZR.bind(this,function(){this.tbnFinished()});this.createLayersLoader();this.wsInfo={url:"ws://192.168.1.211:8989",typ:"picContent",pre:"data:image/jpeg;base64,",fld:"Byte64"};LZR.HTML5.Util.Event.addEvent(window,"resize",LZR.bind(this,this.resize),!1)};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.className="LZR.HTML5.Bp.AirqMg.AssimilationDistribution";LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.version="0.0.4";
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.init=function(){this.initTbn();this.map.init();this.tbn.init();this.createRuler();this.createScroll();this.loadMaps()};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.initTbn=function(){1==this.condition.ttyp?(this.tbn.index=this.condition.count-1,this.tbn.count=this.condition.count,this.tbn.ctx.font=this.tbnFont[1].font,this.tbn.wheelScale=10,this.tbn.wheelStyle=2,this.tbn.draw=LZR.bind(this,function(a,c,b,d,e,f){a.ctx.fillText(a.imgs[c].tim,b+this.tbnFont[1].left,d+f+this.tbnFont[1].bottom)})):(this.tbn.index=this.condition.count-1,this.tbn.count=this.condition.count,this.tbn.ctx.font=this.tbnFont[0].font,
this.tbn.wheelScale=1,this.tbn.wheelStyle=2,this.tbn.draw=LZR.bind(this,function(a,c,b,d,e,f){a.ctx.fillText(a.imgs[c].tim,b+this.tbnFont[0].left,d+f+this.tbnFont[0].bottom)}))};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.ctrlStart=function(){this.map.ctrlEnable();this.tbn.ctrlEnable();this.scroll.ctrlEnable();this.ctrl(this.playSpeed,!0)};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.ctrlStop=function(){this.ctrlEnable=0;this.map.ctrlDisable();this.tbn.ctrlDisable();this.scroll.ctrlDisable()};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.ctrl=function(a,c){switch(this.ctrlEnable){case 0:this.ctrlEnable=c?1:2;break;case 1:this.map.ctrlUpdate();this.tbn.ctrlUpdate();this.map.flush();this.tbn.flush();a=this.play(a);this.fulshScroll();requestAnimationFrame(LZR.HTML5.Util.bind(this,this.ctrl,a));break;case 2:c&&(this.ctrlEnable=1)}};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.loadMaps=function(a){a||(a=this.path);a+="D"+this.condition.area+".png";this.maps.add(a,this.condition.area)};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.onMaps=function(a,c){this.map.layers=[];this.tbn.imgs=[];this.fillLayers(c);this.ctrlStart();this.loadLayers(0);this.mapFinished()};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.createLayersLoader=function(){this.layersNum=2+this.condition.layersInfo.length;for(var a=function(a){this.otherFinished(a)},c=2;c<this.layersNum;c++){var b=new LZR.HTML5.Canvas.ImgLoader(LZR.bind(this,this.onLayersLoad,c));b.finished=LZR.bind(this,a,c);this.layersLoader[c]=b}};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.fillLayers=function(a){var c,b,d;for(c=0;c<this.tbn.count;c++){var e=this.createImg(c,this.condition.date);for(b=0;b<this.layersNum;b++)d=new LZR.HTML5.Canvas.Layer,d.visible=!1,e.layers.push(d);e.layers[1].obj=a;e.layers[1].visible=this.showMap;e.layers[0].visible=!0;this.tbn.imgs.push(e)}c=this.tbn.index;this.map.layers=this.tbn.imgs[c].layers;this.tbn.aline(c,!0);this.changeTitle()};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.createImg=function(a,c){var a=this.tbn.count-a-1,b=new LZR.HTML5.Bp.AirqMg.RegImg,d,e;1===this.condition.ttyp?(d=new Date(c-36E5*a),b.tim="",e=d.getFullYear(),b.tim+=e,b.tim+="-",e=LZR.HTML5.Util.format(d.getMonth()+1,2,"0"),b.tim+=e,b.tim+="-",e=LZR.HTML5.Util.format(d.getDate(),2,"0"),b.tim+=e,b.tim+=" ",e=LZR.HTML5.Util.format(d.getHours(),2,"0"),b.tim+=e,b.tim+="\u65f6"):(d=new Date(c-864E5*a),b.tim="",e=d.getFullYear(),b.tim+=e,b.tim+="-",
e=LZR.HTML5.Util.format(d.getMonth()+1,2,"0"),b.tim+=e,b.tim+="-",e=LZR.HTML5.Util.format(d.getDate(),2,"0"),b.tim+=e);return b};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.loadLayers=function(a){var c,b,d={type:this.wsInfo.typ,sort:0};this.layersLoader[a].closeWebSocket();switch(a){case 0:c=this.condition.fom[this.condition.ttyp];b=this.condition.mod;this.createTbnQry(d,c,b);break;default:c=this.condition.layersInfo[a-2].typ[this.condition.ttyp],b=this.condition.layersInfo[a-2].mod,this.createWeatherQry(d,c,b)}this.layersLoader[a].addByWebSocket(this.wsInfo,d)};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.createTbnQry=function(a,c){a.picType=[c];var b=new Date(this.condition.date),d=36E5*(this.condition.count-1);0===this.condition.ttyp&&(d*=24);var e=new Date(this.condition.date-d),d=e.getFullYear(),d=d+LZR.HTML5.Util.format(e.getMonth()+1,2,"0"),d=d+LZR.HTML5.Util.format(e.getDate(),2,"0"),e=d+=LZR.HTML5.Util.format(e.getHours(),2,"0"),d=b.getFullYear(),d=d+LZR.HTML5.Util.format(b.getMonth()+1,2,"0"),d=d+LZR.HTML5.Util.format(b.getDate(),2,"0"),
b=d+=LZR.HTML5.Util.format(b.getHours(),2,"0");a[c]={modelType:["NAQPMS"],domain:["d"+LZR.HTML5.Util.format(this.condition.area,2,"0")],timesRange:[e,b]};return a};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.createWeatherQry=function(a,c,b){a.picType=[c];a[c]={modelType:[b],domain:["d"+LZR.HTML5.Util.format(this.condition.area,2,"0")],times:this.condition._date+this.condition._tim,periodStart:this.periodStart,periodEnd:24*this.dayNum+this.periodStart};return a};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.onLayersLoad=function(a,c,b){if(c=this.tbn.imgs[c])c.layers[a].obj=b};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.clear=function(){this.ctrlStop();this.map.layers=[];this.tbn.imgs=[];this.ruler=null;this.playSpeed=1};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.changeTitle=function(){this.title.innerHTML=this.tbn.imgs[this.tbn.index].tim+" "+this.condition.fomName+this.condition.areaName+"\u533a\u57df\u540c\u5316\u5206\u5e03\u56fe"};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.play=function(a){if(1==this.playState)if(0<a)a--;else{var a=this.playSpeed,c=this.playFrame,c=c+this.tbn.index;c>=this.tbn.count&&(c=0);this.tbn.select(c)}return a};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.changeAnimation=function(){if(-1==this.playState)return 0;1==this.playState?(this.playState=0,this.tbn.ctrlEnable(),this.scroll.ctrlEnable()):(this.tbn.ctrlDisable(),this.scroll.ctrlDisable(),this.playState=1);return this.playState};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setFrame=function(a){this.playFrame=a};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.changeHeadTail=function(a){a?this.tbn.select(this.tbn.count):this.tbn.select(0);return this.playState};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.changePage=function(a){this.tbn.select(this.tbn.index+a*this.playFrame)};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setSpeed=function(a){this.playSpeed+=a;30<this.playSpeed?this.playSpeed=30:0>this.playSpeed&&(this.playSpeed=0)};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.clrLayers=function(a){for(var c=0;c<this.tbn.count;c++){var b=this.tbn.imgs[c].layers;if(isNaN(a)){b[0].obj=void 0;for(var d=2;d<this.layersNum;d++)b[d].obj=void 0}else b[a].obj=void 0}};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setMapMax=function(a,c,b,d){this.map.max.reset({top:a,left:c,width:b,height:d});this.map.s.top=a;this.map.s.left=c;this.map.s.w=b;this.map.s.reHeight()};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setMod=function(a,c){this.condition.mod=a;c&&(this.changeTitle(),this.clrLayers(0),this.loadLayers(0))};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setFom=function(a,c,b){this.condition.fomName=a;this.condition.fom=c;b&&(this.changeTitle(),this.clrLayers(0),this.loadLayers(0))};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setTim=function(a,c,b){this.condition.dateName=a;this.condition.tim=c;this.condition.date=LZR.Util.Date.getDate(a).valueOf()+36E5*c;b&&(this.clear(),this.init())};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setTtyp=function(a,c,b){this.condition.ttyp=c;b&&(this.clear(),this.init())};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setCount=function(a,c){this.condition.count=a;c&&(this.clear(),this.init())};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setArea=function(a,c,b,d,e){this.condition.areaName=a;this.condition.area=c;b&&(this.clear(),this.setDayNum(d),this.setRulerArea(e),this.init())};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setDayNum=function(a){a&&(this.dayNum=a)};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setRulerArea=function(a){a&&(isNaN(a.latt)||(this.rulerArea.latt=a.latt),isNaN(a.latb)||(this.rulerArea.latb=a.latb),isNaN(a.lonl)||(this.rulerArea.lonl=a.lonl),isNaN(a.lonr)||(this.rulerArea.lonr=a.lonr),isNaN(a.dlon)||(this.rulerArea.dlon=a.dlon),isNaN(a.dlat)||(this.rulerArea.dlat=a.dlat))};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setLayerVisble=function(a,c){for(var b=0;b<this.tbn.count;b++)this.tbn.imgs[b].layers[a].visible=c};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setLayerAlpha=function(a,c){isNaN(c)||(0>c?c=0:1<c&&(c=1));for(var b=0;b<this.tbn.count;b++)this.tbn.imgs[b].layers[a].alpha=c};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.loadCompass=function(a){this.maps.add(a,101,LZR.HTML5.Util.bind(this,function(a,b){this.compass.resize=LZR.bind(this,function(){this.compass.h=0.15*this.map.canvas.height;this.compass.h>this.compass.baseH&&(this.compass.h=this.compass.baseH);this.compass.w=this.compass.h*this.compass.scale});this.compass.img=b;this.compass.visible=!0;this.compass.baseH=b.height;this.compass.scale=b.width/b.height;this.compass.resize()}))};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setCompassVisble=function(a){this.compass.img&&(this.compass.visible=a)};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.loadLegend=function(a){this.legend.resize=LZR.bind(this,function(){1<this.legend.scale?(this.legend.w=0.4*this.map.canvas.width,this.legend.w>this.legend.baseW&&(this.legend.w=this.legend.baseW),this.legend.h=this.legend.w/this.legend.scale):(this.legend.h=0.4*this.map.canvas.height,this.legend.h>this.legend.baseH&&(this.legend.h=this.legend.baseH),this.legend.w=this.legend.h*this.legend.scale)});this.legend.visible=!0;this.legend.alpha=1;this.maps.add(a,
102,LZR.HTML5.Util.bind(this,function(a,b){this.legend.img=b;this.legend.OverImg||(this.legend.OverImg=b);this.legend.baseW=b.width;this.legend.baseH=b.height;this.legend.scale=b.width/b.height;this.legend.resize()}))};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setLegendImg=function(a){this.maps.add(a,103,LZR.HTML5.Util.bind(this,function(a,b){this.legend.img=b;this.legend.baseW=b.width;this.legend.baseH=b.height;this.legend.scale=b.width/b.height;this.legend.resize()}))};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setLegendOverImg=function(a){this.maps.add(a,104,LZR.HTML5.Util.bind(this,function(a,b){this.legend.OverImg=b;this.legend.baseW=b.width;this.legend.baseH=b.height;this.legend.scale=b.width/b.height;this.legend.resize()}))};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.setLegendVisble=function(a){this.legend.img&&(this.legend.visible=a)};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.createRuler=function(){this.ruler=new LZR.HTML5.Bp.AirqMg.RegStatRule({rs:this,latt:this.rulerArea.latt,latb:this.rulerArea.latb,lonl:this.rulerArea.lonl,lonr:this.rulerArea.lonr,min:50,max:70,dlon:this.rulerArea.dlon,dlat:this.rulerArea.dlat})};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.createScroll=function(a){this.scroll?(this.scroll.srcObj.count=this.tbn.max+this.tbn.canvas.height,this.scroll.position=a?a:0,this.scroll.autoLen=this.tbn.canvas.height):(this.scrollObj.count=this.tbn.max+this.tbn.canvas.height,this.scrollObj.position=0,this.scrollObj.autoLen=this.tbn.canvas.height,this.scrollObj.direction=2,this.scrollObj.autoMin=20,this.scrollObj.hidTooBig=!0,this.scrollObj.padd=0,this.scrollObj.len="100%",this.scroll=new LZR.HTML5.Util.Scroll(this.scrollObj),
this.scroll.onchange=LZR.bind(this,function(a){this.tbn.position=a}));this.scroll.init()};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.fulshScroll=function(){this.tbn.position!==this.scroll.position&&this.scroll.setPosition(this.tbn.position)};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.resize=function(){this.map.resize();this.tbn.resize();this.createScroll(this.scroll.position);this.legend.resize();this.compass.resize()};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.mapAutoFlush=function(a,c,b,d,e){var f,g;a.globalAlpha=1;this.boderColor&&(a.lineWidth="2",a.fillStyle=this.boderColor,a.strokeStyle=this.boderColor,a.strokeRect(c,0,d,e+b),a.fillRect(c,0,d,b));this.compass.visible&&(f=this.compass.w,a.drawImage(this.compass.img,c+d-f-5,b+5,f,this.compass.h));if(this.legend.visible){f=this.legend.w;g=this.legend.h;var k=this.map.constant.d,j=c+d-f-15,i=b+e-g-15,h=this.map.ctrl.currentPage.x-k.left-j,k=this.map.ctrl.currentPage.y-
k.top-i;a.globalAlpha=this.legend.alpha;0<h&&h<f&&0<k&&k<g?a.drawImage(this.legend.OverImg,j,i,f,g):a.drawImage(this.legend.img,j,i,f,g);a.globalAlpha=1}j=this.ruler.update();a.lineWidth="2";a.strokeStyle="black";a.fillStyle="black";a.font="10px Verdana";f=c+15;g=b+e-15;a.beginPath();a.moveTo(f,g-10);a.lineTo(f,g);f+=j.w;a.lineTo(f,g);a.lineTo(f,g-10);a.stroke();h=j.d;a.fillText(1E3<h?h/1E3+"\u516c\u91cc":h+"\u7c73",f+10,g);this.boderColor&&(a.strokeStyle=this.boderColor);h=this.ruler.getLatRod();
j=e/(h.length-1);for(i=0;i<h.length;i++)g=j*i+b,a.beginPath(),a.moveTo(c-10,g),a.lineTo(c,g),a.stroke(),a.fillText(h[i].toFixed(1),c-40,g+10);h=this.ruler.getLonRod();j=d/(h.length-1);g=b+e;for(i=0;i<h.length;i++)f=j*i+c,a.beginPath(),a.moveTo(f,g+10),a.lineTo(f,g),a.stroke(),a.fillText(h[i].toFixed(1),f-35,g+22)};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.isBusyInLayersLoader=function(a){return this.layersLoader[a]?this.layersLoader[a].isBusy:!1};
LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.mapFinished=function(){};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.tbnFinished=function(){};LZR.HTML5.Bp.AirqMg.AssimilationDistribution.prototype.otherFinished=function(){};
