LZR.HTML5.loadJs([LZR.HTML5.jsPath+"HTML5/util/Util.js",LZR.HTML5.jsPath+"HTML5/util/Css.js",LZR.HTML5.jsPath+"util/Graphics/Edge.js"]);
LZR.HTML5.Util.Layout.GridBorder=function(a){this.div=document.createElement("div");a.divClass?LZR.HTML5.Util.Css.addClass(this.div,a.divClass):LZR.HTML5.Util.Css.addClass(this.div,"LHUL_GridBorder_Div");this.title=document.createElement("div");a.titleClass?LZR.HTML5.Util.Css.addClass(this.title,a.titleClass):LZR.HTML5.Util.Css.addClass(this.title,"LHUL_GridBorder_Title");this.footer=document.createElement("div");a.footerClass?LZR.HTML5.Util.Css.addClass(this.footer,a.footerClass):LZR.HTML5.Util.Css.addClass(this.footer,
"LHUL_GridBorder_Footer");this.pack=document.createElement("div");a.packClass?LZR.HTML5.Util.Css.addClass(this.pack,a.packClass):LZR.HTML5.Util.Css.addClass(this.pack,"LHUL_GridBorder_Pack");a.img&&(this.placeTo(a.img.div),this.setImg(a.img.url,a.img.left,a.img.top,a.img.width,a.img.height))};LZR.HTML5.Util.Layout.GridBorder.prototype.className="LZR.HTML5.Util.Layout.GridBorder";LZR.HTML5.Util.Layout.GridBorder.prototype.version="0.0.0";
LZR.HTML5.Util.Layout.GridBorder.prototype.setTitle=function(a){this.title.innerHTML=a};LZR.HTML5.Util.Layout.GridBorder.prototype.addTitleClass=function(a){LZR.HTML5.Util.Css.addClass(this.title,a)};LZR.HTML5.Util.Layout.GridBorder.prototype.addPackClass=function(a){LZR.HTML5.Util.Css.addClass(this.pack,a)};LZR.HTML5.Util.Layout.GridBorder.prototype.delTitleClass=function(a){LZR.HTML5.Util.Css.removeClass(this.title,a)};
LZR.HTML5.Util.Layout.GridBorder.prototype.delPackClass=function(a){LZR.HTML5.Util.Css.removeClass(this.pack,a)};LZR.HTML5.Util.Layout.GridBorder.prototype.placeTo=function(a){a.appendChild(this.div);this.div.appendChild(this.title);this.div.appendChild(this.pack);this.div.appendChild(this.footer)};
LZR.HTML5.Util.Layout.GridBorder.prototype.setImg=function(a,i,j,k,l){this.pack.innerHTML="";var b=document.createElement("canvas");b.style.width="100%";b.style.height="100%";this.pack.appendChild(b);LZR.HTML5.Util.mateWidth(b);var m=new LZR.Util.Graphics.Edge({width:b.width,height:b.height}),c=document.createElement("img");c.onload=LZR.bind(c,function(a,b,g,h,e,f){g||(g=0);h||(h=0);e||(e=c.width);f||(f=c.height);e+g>c.width&&(e=c.width-g);f+h>c.height&&(f=c.height-h);if(0<e&&0<f){var d=new LZR.Util.Graphics.Edge({width:e,
height:f});d.w=b.w;d.reHeight();d.rrByParent(b);d.alineInParent("center",b);a.getContext("2d").drawImage(this,g,h,e,f,d.left,d.top,d.w,d.h)}},b,m,i,j,k,l);c.src=a};