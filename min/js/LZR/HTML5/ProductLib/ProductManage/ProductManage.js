LZR.HTML5.loadJs([LZR.HTML5.jsPath+"HTML5/util/Util.js"]);LZR.HTML5.ProductLib.ProductManage=function(a){this.data=a;this.div=document.createElement("div");this.pro=document.createElement("div");this.goodsTree=new LZR.HTML5.ProductLib.ProductManage.GoodsTree(a);this.goodsTree.setManage(this);this.css()};LZR.HTML5.ProductLib.ProductManage.prototype.className="LZR.HTML5.ProductLib.ProductManage";LZR.HTML5.ProductLib.ProductManage.prototype.version="0.0.0";
LZR.HTML5.loadJs([LZR.HTML5.jsPath+"HTML5/ProductLib/ProductManage/Proview/Proview.js",LZR.HTML5.jsPath+"HTML5/ProductLib/ProductManage/GoodsTree/GoodsTree.js"]);LZR.HTML5.ProductLib.ProductManage.prototype.css=function(){this.div.appendChild(this.goodsTree.div);this.div.appendChild(this.pro);this.goodsTree.div.style["float"]="left";this.pro.style["float"]="right";this.pro.style.width="50%";this.pro.style.height="100%";this.pro.style.background="#0FF"};
LZR.HTML5.ProductLib.ProductManage.prototype.addProview=function(a){a.data.name&&this.pro.appendChild(a.div)};LZR.HTML5.ProductLib.ProductManage.prototype.remveProview=function(){for(;this.pro.firstChild;)LZR.HTML5.Util.del(this.pro.firstChild.proview),this.pro.removeChild(this.pro.firstChild)};
