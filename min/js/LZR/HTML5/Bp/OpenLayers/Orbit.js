window.ol||(LZR.HTML5.loadJs([LZR.HTML5.jsPath+"HTML5/expand/ol3/ol.js"]),LZR.HTML5.loadCss([LZR.HTML5.jsPath+"HTML5/expand/ol3/ol.css"]));LZR.HTML5.loadJs([LZR.HTML5.jsPath+"util/Graphics.js"]);
LZR.HTML5.Bp.OpenLayers.Orbit=function(a){a.map&&(this.map=a.map,this.clrStr={"0":"245,255,255","3.5":"210,255,255","7.0":"190,255,255","10.5":"150,243,255","14.0":"131,232,255","17.5":"74,221,255","21.0":"26,212,255","24.5":"0,195,255","28.0":"0,202,255","31.5":"0,220,220","35.0":"0,232,190","39.0":"0,230,175","43.0":"0,230,140","47.0":"0,230,110","51.0":"0,230,80","55.0":"0,230,60","59.0":"0,230,50","63.0":"0,230,0","67.0":"30,230,0","71.0":"100,235,0","75.0":"180,240,0","79.0":"220,250,0","83.0":"255,255,0",
"87.0":"255,250,0","91.0":"255,245,0","95.0":"255,242,0","99.0":"255,240,0","103.0":"255,238,0","107.0":"255,235,0","111.0":"255,230,0","115.0":"255,220,0","118.5":"255,200,0","122.0":"255,190,0","125.5":"255,185,0","129.0":"255,180,0","132.5":"255,175,0","136.0":"255,170,0","139.5":"255,165,0","143.0":"255,145,0","146.5":"255,115,0","150.0":"255,95,0","160.0":"255,70,0","170.0":"255,20,0","180.0":"255,0,0","190.0":"245,0,0","200.0":"247,0,0","210.0":"249,0,0","220.0":"250,0,0","230.0":"252,0,0",
"240.0":"240,0,20","250.0":"240,0,50","260.0":"220,0,100","270.0":"200,0,145","280.0":"180,0,150","290.0":"160,0,150","300.0":"150,0,150","310.0":"140,0,160","320.0":"135,0,160","330.0":"130,0,160","340.0":"125,0,160","350.0":"120,0,160","10000.0":"110,0,160"},this.initData(a.data,this.clrStr),this.sourceColor=a.sourceColor?a.sourceColor:"red",this.sourceSize=a.sourceSize?a.sourceSize:20,this.sourceWidth=a.sourceWidth?a.sourceWidth:2,this.sourceSpeed=a.sourceSpeed?a.sourceSpeed:0.01,this.orbitAnimationColor=
this.initColor(a.orbitAnimationColor),this.orbitShadowColor=this.initColor(a.orbitShadowColor),this.orbitColor=this.initColor(a.orbitColor),this.orbitBlur=a.orbitBlur?a.orbitBlur:20,this.orbitScale=a.orbitScale?a.orbitScale:0.5,this.orbitSpeed=a.orbitSpeed?a.orbitSpeed:0.01,this.nodeShadowColor=a.nodeShadowColor?a.nodeShadowColor:this.orbitShadowColor,this.nodeColor=a.nodeColor?a.nodeColor:this.orbitColor,this.nodeBlur=a.nodeBlur?a.nodeBlur:this.orbitBlur,this.nodeScale=a.nodeScale?a.nodeScale:3E3,
this.nodeMax=a.nodeMax?a.nodeMax:8,this.nodeMin=a.nodeMin?a.nodeMin:6,a.showNode?this.setShowNode(a.showNode):this.setShowNode(0),this.title=a.title?a.title:document.createElement("div"),this.titleArea=a.titleArea?a.titleArea:0,this.curentPosition=[-1,-1],this.nodeOverIndex=this.orbitOverIndex=-1,this.ctx=this.canvas=this.layer=null,this.gp=new LZR.Util.Graphics)};LZR.HTML5.Bp.OpenLayers.Orbit.prototype.className="LZR.HTML5.Bp.OpenLayers.Orbit";LZR.HTML5.Bp.OpenLayers.Orbit.prototype.version="0.0.7";
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.initColor=function(a){var b=0,d=[];if(a){if("string"==LZR.HTML5.Util.getClassName(a)){for(b=0;b<this.data.length;b++)d.push(a);return d}d=a;b=d.length;isNaN(b)&&(b=0)}for(;b<this.data.length;b++)a="rgba("+Math.floor(255*Math.random())+", "+Math.floor(255*Math.random())+", "+Math.floor(255*Math.random())+", 1)",d.push(a);return d};
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.init=function(){null===this.layer&&(this.layer=new ol.layer.Image({source:new ol.source.ImageStatic({url:"",imageExtent:[0,0,0,0]})}),this.map.on("pointermove",LZR.bind(this,function(a){this.curentPosition=a.pixel})),this.layer.on("postcompose",LZR.bind(this,function(){if(null===this.ctx){this.canvas=document.createElement("canvas");var a=this.map.getViewport();a.insertBefore(this.canvas,a.childNodes[1]);this.canvas.style.width="100%";this.canvas.style.height=
"100%";this.canvas.style.position="absolute";this.canvas.style.top="0";this.canvas.style.left="0";this.canvas.width=this.canvas.clientWidth;this.canvas.height=this.canvas.clientHeight;LZR.HTML5.Util.Event.addEvent(window,"resize",LZR.bind(this,function(){this.canvas.width=this.canvas.clientWidth;this.canvas.height=this.canvas.clientHeight}),!1);this.ctx=this.canvas.getContext("2d");a=this.title.style;a.visibility="hidden";a.position="relative";a=this.map.getTargetElement();a.appendChild(this.title);
this.mapW=a.scrollWidth;this.mapH=a.scrollHeight;this.mouseObi=this.titleNdi=this.titleObi=-1}this.flush(this.ctx)&&this.map.render()})),this.map.addLayer(this.layer))};
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.flush=function(a){a.clearRect(0,0,this.canvas.width,this.canvas.height);var b=this.map.getView().getResolution();this.calcNodeWidth(b);for(var d=this.nodeOverIndex=this.orbitOverIndex=-1,c=0;c<this.data.length;c++)if(this.data[c].visible){var d=c,f=this.data[c].nodes;this.calcData(f,b);this.drawOrbitPath(f,a,c);this.calcNode(f,a,c);if(this.orbitOverIndex===c){if(this.drawNode(f,a,c),0<=this.nodeOverIndex&&(this.titleObi!==this.orbitOverIndex||this.titleNdi!==
this.nodeOverIndex)){this.titleObi=this.orbitOverIndex;this.titleNdi=this.nodeOverIndex;var e=this.title.style;e.left=this.curentPosition[0]+"px";e.top=this.curentPosition[1]-this.canvas.height+"px";this.onShowTitle(this.title,this.oldDat[this.titleObi].points[this.titleNdi],this.titleObi,this.titleNdi);"hidden"===e.visibility&&(e.visibility="visible")}}else this.ap[c]+=this.orbitSpeed,1<this.ap[c]&&(this.ap[c]=0);this.drawOrbit(f,a,c)}if(-1!==d){this.drawSource(a,d);-1!==this.titleNdi&&-1===this.nodeOverIndex&&
(this.onHidTitle(this.title,this.oldDat[this.titleObi].points[this.titleNdi],this.titleObi,this.titleNdi),this.titleNdi=this.titleObi=-1,this.title.style.visibility="hidden");if(-1===this.orbitOverIndex)-1!==this.mouseObi&&(this.onMouseOut(this.mouseObi),this.mouseObi=-1);else if(this.mouseObi!==this.orbitOverIndex){if(-1!==this.mouseObi)this.onMouseOut(this.mouseObi);this.onMouseOver(this.orbitOverIndex);this.mouseObi=this.orbitOverIndex}return!0}return!1};
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.initData=function(a,b){b&&(this.clrStr=b);this.crtNamLayer(a);this.oldDat=a;this.data=[];this.ap=[];if(a)for(var d=0;d<a.length;d++){var c={visible:!0};c.zlevel=a[d];c.nodes=[];for(var f=a[d].points,e=0;e<f.length;e++){var g={},j;for(j in f[e])g[j]=f[e][j];g.lon=f[e].lon;g.lat=f[e].lat;if(0<e){var h=c.nodes[e-1],k=g.lat-h.lat,l=g.lon-h.lon;h.lineAngle=Math.asin(k/Math.sqrt(k*k+l*l));0>l&&(h.lineAngle=Math.PI-h.lineAngle)}b&&f[e].values&&(g.fom={val:f[e].values[0],
clr:this.getClrByStr(f[e].values[0])});c.nodes.push(g)}this.data.push(c);this.ap.push(0)}};
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.crtNamLayer=function(a){var b;if(this.namLayer)for(b=0;b<this.namLayer.length;b++)this.map.removeLayer(this.namLayer[b]);this.namLayer=[];for(b=0;b<a.length;b++)if(a[b].name){var d=document.createElement("div"),c=document.createElement("div");d.style.position="relative";d.appendChild(c);c.innerHTML=a[b].name;c=a[b].points.length-1;c=ol.proj.fromLonLat([a[b].points[c].lon,a[b].points[c].lat]);d=new ol.Overlay({position:c,positioning:"bottom-center",element:d,
stopEvent:!1});this.map.addOverlay(d);this.namLayer.push(d)}};LZR.HTML5.Bp.OpenLayers.Orbit.prototype.getClrByAQI=function(a){return 0>a?"rgba(0,0,0,0)":50>=a?"rgba(0,228,0,1)":100>=a?"rgba(255,255,0,1)":150>=a?"rgba(255,126,0,1)":200>=a?"rgba(255,0,0,1)":300>=a?"rgba(153,0,76,1)":500>=a?"rgba(126,0,35,1)":"rgba(0,0,0,0)"};
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.getClrByStr=function(a){var b=null,d;for(d in this.clrStr){if(a<d)if(b)break;else return"rgba(0,0,0,0)";b=d}return"rgba("+this.clrStr[b]+",1)"};LZR.HTML5.Bp.OpenLayers.Orbit.prototype.calcNodeWidth=function(a){this.nodeWidth=this.nodeScale/a;this.nodeWidth>this.nodeMax?this.nodeWidth=this.nodeMax:this.nodeWidth<this.nodeMin&&(this.nodeWidth=this.nodeMin)};
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.calcData=function(a,b){for(var d=0,c=0;c<a.length;c++){var f=a[c],e=this.calcPixel(f.lon,f.lat);f.x=e[0];f.y=e[1];f.u=f.su/b*this.windScale;f.v=f.sv/b*this.windScale;if(0<c){var e=a[c-1],g=f.y-e.y,f=f.x-e.x;e.lineLong=Math.sqrt(g*g+f*f);e.lineAngle=Math.asin(g/e.lineLong);0>f&&(e.lineAngle=Math.PI-e.lineAngle);e.lineLong>d&&(d=e.lineLong)}}a.max=d};
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.drawOrbitPath=function(a,b,d){var c=this.nodeWidth*this.orbitScale;b.save();b.fillStyle=this.orbitColor[d];b.shadowColor=this.orbitShadowColor[d];b.shadowBlur=this.orbitBlur;for(var f=0;f<a.length-1;f++){b.beginPath();var e=this.gp.calcTransform(a[f].lineAngle,1,1,a[f].x,a[f].y);b.setTransform(e[0],e[1],e[2],e[3],e[4],e[5]);b.moveTo(0,c);b.arc(0,0,c,Math.PI/2,3*Math.PI/2);b.lineTo(a[f].lineLong,-c);b.arc(a[f].lineLong,0,c,-Math.PI/2,Math.PI/2);b.closePath();
a[f].fom&&(e=b.createLinearGradient(0,0,a[f].lineLong,0),e.addColorStop(0,a[f].fom.clr),e.addColorStop(1,a[f+1].fom.clr),b.shadowBlur=0,b.fillStyle=e);b.fill()}b.restore();-1===this.orbitOverIndex&&b.isPointInPath(this.curentPosition[0],this.curentPosition[1])&&(this.orbitOverIndex=d)};
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.calcNode=function(a,b,d){for(var c=this.nodeWidth+this.titleArea,f=2*Math.PI,e=0;e<a.length;e++)if(b.beginPath(),b.arc(a[e].x,a[e].y,c,0,f),(-1===this.orbitOverIndex||this.orbitOverIndex===d)&&b.isPointInPath(this.curentPosition[0],this.curentPosition[1])){this.orbitOverIndex=d;this.nodeOverIndex=e;break}};
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.drawNode=function(a,b,d){var c=0,f=a.length;switch(this.showNode){case 1:c++;break;case 2:f--}var e=this.nodeWidth,g=2*Math.PI;b.save();b.fillStyle=this.nodeColor[d];b.shadowColor=this.nodeShadowColor[d];b.shadowBlur=this.nodeBlur;b.beginPath();for(d=c;d<f;d++)b.arc(a[d].x,a[d].y,e,0,g),b.closePath();b.fill();b.restore()};
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.drawOrbit=function(a,b,d){b.save();b.fillStyle=this.orbitAnimationColor[d];b.beginPath();for(i=1;i<a.length;i++){var c=(a[i].x-a[i-1].x)*this.ap[d]+a[i-1].x,f=(a[i].y-a[i-1].y)*this.ap[d]+a[i-1].y,e=0.8*(a[i-1].lineLong/a.max);0.2>e&&(e=0.2);e*=this.nodeWidth;c=this.gp.calcTransform(a[i-1].lineAngle,e,e,c,f);b.setTransform(c[0],c[1],c[2],c[3],c[4],c[5]);b.moveTo(0,0);b.lineTo(-1,1);b.lineTo(3,0);b.lineTo(-1,-1);b.closePath()}b.fill();b.restore()};
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.drawSource=function(a,b){var d,c,f;c=this.data[b].nodes;switch(this.showNode){case 2:f=c.length-1;d=c[f].x;c=c[f].y;0.05>this.apSource&&(this.apSource=1);break;default:d=c[0].x,c=c[0].y,1<this.apSource&&(this.apSource=0.05)}f=this.sourceSize*this.apSource;a.save();a.lineWidth=this.sourceWidth;a.strokeStyle=this.sourceColor;a.beginPath();a.arc(d,c,f,0,2*Math.PI);a.stroke();a.restore();this.apSource+=this.sourceSpeed};
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.setVisible=function(a,b){var d=this.namLayer[a],c=this.data[a];c&&(c.visible=b);d&&(d.getElement().style.visibility=b?"visible":"hidden");b&&this.map.render()};LZR.HTML5.Bp.OpenLayers.Orbit.prototype.setShowNode=function(a){this.showNode=a;2===this.showNode?(this.apSource=1,0<this.sourceSpeed&&(this.sourceSpeed*=-1)):(this.apSource=0,0>this.sourceSpeed&&(this.sourceSpeed*=-1))};
LZR.HTML5.Bp.OpenLayers.Orbit.prototype.calcPixel=function(a,b){return this.map.getPixelFromCoordinate(ol.proj.fromLonLat([a,b]))};LZR.HTML5.Bp.OpenLayers.Orbit.prototype.onShowTitle=function(){};LZR.HTML5.Bp.OpenLayers.Orbit.prototype.onHidTitle=function(){};LZR.HTML5.Bp.OpenLayers.Orbit.prototype.onMouseOver=function(){};LZR.HTML5.Bp.OpenLayers.Orbit.prototype.onMouseOut=function(){};
