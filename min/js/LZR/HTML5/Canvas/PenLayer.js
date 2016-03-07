LZR.HTML5.loadJs([LZR.HTML5.jsPath+"HTML5/Canvas/Layer.js",LZR.HTML5.jsPath+"HTML5/util/MouseDropController.js"]);LZR.HTML5.Canvas.PenLayer=function(c){LZR.HTML5.Canvas.Layer.call(this,c);this.cav=c.cav;this.ctx=this.cav.getContext("2d");this.layerMgr=c.layerMgr;this.color=[255,0,0,255];this.ctrl=new LZR.HTML5.Util.MouseDropController(this.cav);this.ctrl.noMid=!0;this.ctrl.noClick=!0;this.constant={};this.obj||this.clear()};LZR.HTML5.Canvas.PenLayer.prototype=LZR.createPrototype(LZR.HTML5.Canvas.Layer.prototype);
LZR.HTML5.Canvas.PenLayer.prototype._super=LZR.HTML5.Canvas.Layer.prototype;LZR.HTML5.Canvas.PenLayer.prototype.className="LZR.HTML5.Canvas.PenLayer";LZR.HTML5.Canvas.PenLayer.prototype.version="0.0.1";LZR.HTML5.Canvas.PenLayer.prototype.init=function(){this.constant.d=LZR.HTML5.Util.getDomPositionForDocument(this.cav)};
LZR.HTML5.Canvas.PenLayer.prototype.draw=function(c,a,b,d,e,f,h,g){g&&(g=this.layerMgr.s.scale(),this.cav.width=g*this.layerMgr.canvas.width,this.cav.height=g*this.layerMgr.canvas.height,a+=this.layerMgr.offset.left*(1-g),b+=this.layerMgr.offset.top*(1-g),this._super.draw.call(this,this.ctx,a,b,this.cav.width,this.cav.height,0,0))};
LZR.HTML5.Canvas.PenLayer.prototype.clear=function(){this.obj=this.ctx.createImageData(this.layerMgr.max.w+this.layerMgr.offset.left+this.layerMgr.offset.right,this.layerMgr.max.h+this.layerMgr.offset.top+this.layerMgr.offset.bottom)};LZR.HTML5.Canvas.PenLayer.prototype.ctrlEnable=function(){this.ctrl.state===this.ctrl.STATE.UNABLE&&this.ctrl.enable(!1,!1,!0)};LZR.HTML5.Canvas.PenLayer.prototype.ctrlDisable=function(){this.ctrl.state!==this.ctrl.STATE.UNABLE&&this.ctrl.disable()};
LZR.HTML5.Canvas.PenLayer.prototype.ctrlUpdate=function(){var c,a;a=this.layerMgr.s.scale();if(this.ctrl.state===this.ctrl.STATE.LEFT)c=(this.ctrl.leftStart.x-this.ctrl.leftEnd.x)*a,a*=this.ctrl.leftStart.y-this.ctrl.leftEnd.y,this.ctrl.leftStart=LZR.HTML5.Util.clone(this.ctrl.leftEnd),this.layerMgr.pan(c,a);else if(this.ctrl.state===this.ctrl.STATE.RIGHT){c=(this.ctrl.rightStart.x-this.constant.d.left)*a;var b=(this.ctrl.rightStart.y-this.constant.d.top)*a,d=(this.ctrl.rightEnd.x-this.constant.d.left)*
a;a*=this.ctrl.rightEnd.y-this.constant.d.top;this.ctrl.rightStart=LZR.HTML5.Util.clone(this.ctrl.rightEnd);this.line(c,b,d,a)}else 0!==this.ctrl.wheelValue&&(b=-this.ctrl.wheelValue,this.ctrl.wheelValue=0,c=(this.ctrl.currentPage.x-this.constant.d.left-this.layerMgr.offset.left)*a,a*=this.ctrl.currentPage.y-this.constant.d.top-this.layerMgr.offset.top,this.layerMgr.zoom(b,c,a))};LZR.HTML5.Canvas.PenLayer.prototype.resize=function(){this.init()};
LZR.HTML5.Canvas.PenLayer.prototype.point=function(c,a){if(0<=c&&c<=this.obj.width){var b=4*(a*this.obj.width+c);this.obj.data[b]=this.color[0];this.obj.data[b+1]=this.color[1];this.obj.data[b+2]=this.color[2];this.obj.data[b+3]=this.color[3]}};
LZR.HTML5.Canvas.PenLayer.prototype.line=function(c,a,b,d){var e,f;e=this.layerMgr.s.scale();c=Math.floor(c+this.layerMgr.s.left+this.layerMgr.offset.left*(1-e));a=Math.floor(a+this.layerMgr.s.top+this.layerMgr.offset.top*(1-e));b=Math.floor(b+this.layerMgr.s.left+this.layerMgr.offset.left*(1-e));d=Math.floor(d+this.layerMgr.s.top+this.layerMgr.offset.top*(1-e));f=b-c;d-=a;e=f/d;if(Math.abs(f)>Math.abs(d)){0<f?(b=0,d=f):(b=f,d=0);for(;b<=d;b++)this.point(c+b,Math.floor(a+b/e))}else if(0!==d){0<d?
b=0:(b=d,d=0);for(;b<=d;b++)this.point(Math.floor(c+e*b),a+b)}};
LZR.HTML5.Canvas.PenLayer.prototype.lineByCtx=function(c,a,b,d){if(c!==b||a!==d)if(this.ctx.beginPath(),this.ctx.moveTo(c,a),this.ctx.lineTo(b,d),this.ctx.stroke(),c=this.ctx.getImageData(0,0,this.cav.width,this.cav.height),c.width===this.obj.width&&c.height===this.obj.height)this.obj=c;else for(var a=this.layerMgr.s.scale(),a=Math.floor(this.layerMgr.s.left+this.layerMgr.offset.left*(1-a))+Math.floor(this.layerMgr.s.top+this.layerMgr.offset.top*(1-a))*this.obj.width,a=4*a,b=0,d=4*(this.obj.width-
c.width),e=0;e<c.height;e++){for(var f=0;f<c.width;f++)this.obj.data[a++]=c.data[b++],this.obj.data[a++]=c.data[b++],this.obj.data[a++]=c.data[b++],this.obj.data[a++]=c.data[b++];a+=d}};
