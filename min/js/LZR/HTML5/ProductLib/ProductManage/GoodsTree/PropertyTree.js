LZR.HTML5.loadJs([LZR.HTML5.jsPath+"HTML5/ProductLib/ProductManage/GoodsTree/GoodsTree.js"]);LZR.HTML5.ProductLib.ProductManage.PropertyTree=function(a){LZR.HTML5.ProductLib.ProductManage.GoodsTree.call(this,a)};LZR.HTML5.ProductLib.ProductManage.PropertyTree.prototype=LZR.createPrototype(LZR.HTML5.ProductLib.ProductManage.GoodsTree.prototype);LZR.HTML5.ProductLib.ProductManage.PropertyTree.prototype.className="LZR.HTML5.ProductLib.ProductManage.PropertyTree";
LZR.HTML5.ProductLib.ProductManage.PropertyTree.prototype.version="0.0.1";LZR.HTML5.ProductLib.ProductManage.PropertyTree.prototype.css=function(){this.div.style.background="#FF0";this.div.style.padding="10px 0px 10px 5px"};LZR.HTML5.ProductLib.ProductManage.PropertyTree.prototype.buildRoot=function(a,b){return new LZR.HTML5.ProductLib.ProductManage.PropertyTree.Node(a,b)};
LZR.HTML5.ProductLib.ProductManage.PropertyTree.Node=function(a,b){LZR.HTML5.ProductLib.ProductManage.GoodsTree.Node.call(this,a,b)};LZR.HTML5.ProductLib.ProductManage.PropertyTree.Node.prototype=LZR.createPrototype(LZR.HTML5.ProductLib.ProductManage.GoodsTree.Node.prototype);LZR.HTML5.ProductLib.ProductManage.PropertyTree.Node.prototype.className="LZR.HTML5.ProductLib.ProductManage.PropertyTree.Node";
LZR.HTML5.ProductLib.ProductManage.PropertyTree.Node.prototype.showSubTree=function(){if(this.data.member){var a=new LZR.HTML5.ProductLib.ProductManage.MemberTree(this.data.member);a.setManage(this.tree.mg);this.view.addTree(a);this.isExpand=!0}};LZR.HTML5.ProductLib.ProductManage.PropertyTree.Node.prototype.buildChild=function(a,b){return new LZR.HTML5.ProductLib.ProductManage.PropertyTree.Node(a,b)};LZR.HTML5.ProductLib.ProductManage.PropertyTree.Node.prototype.buildView=function(){return new LZR.HTML5.ProductLib.ProductManage.PropertyTree.View(this)};
LZR.HTML5.ProductLib.ProductManage.PropertyTree.View=function(a){LZR.HTML5.ProductLib.ProductManage.GoodsTree.View.call(this,a)};LZR.HTML5.ProductLib.ProductManage.PropertyTree.View.prototype=LZR.createPrototype(LZR.HTML5.ProductLib.ProductManage.GoodsTree.View.prototype);LZR.HTML5.ProductLib.ProductManage.PropertyTree.View.prototype.className="LZR.HTML5.ProductLib.ProductManage.PropertyTree.View";LZR.HTML5.loadJs([LZR.HTML5.jsPath+"HTML5/ProductLib/ProductManage/GoodsTree/MemberTree.js"]);
