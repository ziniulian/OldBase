LZR.HTML5.loadJs([LZR.HTML5.jsPath+"util/Graphics/Edge.js",LZR.HTML5.jsPath+"HTML5/Canvas/Layer.js",LZR.HTML5.jsPath+"HTML5/util/MouseDropController.js"]);
LZR.HTML5.Canvas.LayerManager=function(a){this.canvas=a;this.ctx=a.getContext("2d");this.layers=[];this.zoomScale=0.1;this.offset={left:0,top:0,right:0,bottom:0};this.s=new LZR.Util.Graphics.Edge({width:a.width,height:a.height});this.max=new LZR.Util.Graphics.Edge({width:a.width,height:a.height});this.max.addChild(this.s);this.min=new LZR.Util.Graphics.Edge({width:5,height:5});this.s.addChild(this.min);this.ctrl=new LZR.HTML5.Util.MouseDropController(a);this.constant={};this.autoZoom=this.autoMove=
!0};LZR.HTML5.Canvas.LayerManager.prototype.className="LZR.HTML5.Canvas.LayerManager";LZR.HTML5.Canvas.LayerManager.prototype.version="0.0.3";
LZR.HTML5.Canvas.LayerManager.prototype.init=function(){this.s.rrByParent();this.constant.d=LZR.HTML5.Util.getDomPositionForDocument(this.canvas);this.constant.w=this.canvas.width-this.offset.left-this.offset.right;this.constant.h=this.canvas.height-this.offset.top-this.offset.bottom;this.ctrl.state===this.ctrl.STATE.UNABLE&&(this.ctrl.noMid=!0,this.ctrl.noRight=!0,this.ctrl.noClick=!0,this.ctrl.noCurrentMove=!1,this.ctrl.enable())};
LZR.HTML5.Canvas.LayerManager.prototype.addLayer=function(a,b){return a.getType&&0<=a.getType()?(b&&(a.name=b),this.layers.push(a),!0):!1};LZR.HTML5.Canvas.LayerManager.prototype.delLayer=function(a){this.layers.splice(a,1)};LZR.HTML5.Canvas.LayerManager.prototype.getIndexByName=function(a){for(var b=0;b<this.layers.length;b++)if(this.layers[b].name==a)return b};
LZR.HTML5.Canvas.LayerManager.prototype.flush=function(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);for(var a=0;a<this.layers.length;a++)this.layers[a].draw(this.ctx,this.s.left,this.s.top,this.s.w,this.s.h,this.offset.left,this.offset.top,this.constant.w,this.constant.h);this.autoFlush(this.ctx,this.offset.left,this.offset.top,this.constant.w,this.constant.h)};
LZR.HTML5.Canvas.LayerManager.prototype.pan=function(a,b){this.autoMove?this.s.moveInParent(a,b,this.max):this.s.move(a,b)};LZR.HTML5.Canvas.LayerManager.prototype.zoom=function(a,b,c){a*=this.zoomScale;0>a?a=1/(1-a):0!==a&&(a+=1);this.autoZoom?this.s.zoomInParent(a,b,c,this.max,this.min):this.s.zoom(a,b,c)};
LZR.HTML5.Canvas.LayerManager.prototype.ctrlUpdate=function(){var a,b;if(this.ctrl.state==this.ctrl.STATE.LEFT)a=(this.ctrl.leftStart.x-this.ctrl.leftEnd.x)*this.s.scale(),b=(this.ctrl.leftStart.y-this.ctrl.leftEnd.y)*this.s.scale(),this.ctrl.leftStart=LZR.HTML5.Util.clone(this.ctrl.leftEnd),this.pan(a,b);else if(0!==this.ctrl.wheelValue){var c=-this.ctrl.wheelValue;this.ctrl.wheelValue=0;a=(this.ctrl.currentPage.x-this.constant.d.left)*this.s.scale();b=(this.ctrl.currentPage.y-this.constant.d.top)*
this.s.scale();this.zoom(c,a,b)}};LZR.HTML5.Canvas.LayerManager.prototype.ctrlEnable=function(){this.ctrl.state===this.ctrl.STATE.UNABLE&&this.ctrl.enable()};LZR.HTML5.Canvas.LayerManager.prototype.ctrlDisable=function(){this.ctrl.state!==this.ctrl.STATE.UNABLE&&this.ctrl.disable()};LZR.HTML5.Canvas.LayerManager.prototype.changeIndex=function(a,b){var c=this.layers[a];this.layers[a]=this.layers[b];this.layers[b]=c};
LZR.HTML5.Canvas.LayerManager.prototype.resize=function(){LZR.HTML5.Util.mateWidth(this.canvas);this.s.reset({left:this.max.left,top:this.max.top,width:this.canvas.width,height:this.canvas.height});this.init()};LZR.HTML5.Canvas.LayerManager.prototype.resetMax=function(a,b,c,d){this.max.reset({top:a,left:b,width:c,height:d});this.s.rrByParent()};LZR.HTML5.Canvas.LayerManager.prototype.resetMin=function(a,b,c,d){this.min.reset({top:a,left:b,width:c,height:d})};
LZR.HTML5.Canvas.LayerManager.prototype.getScalePixelFromMax=function(a,b){a-=this.s.left;b-=this.s.top;a/=this.s.w;b/=this.s.h;return[a,b]};LZR.HTML5.Canvas.LayerManager.prototype.autoFlush=function(){};
