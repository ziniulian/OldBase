LZR.HTML5.loadJs([LZR.HTML5.jsPath+"HTML5/util/Select.js"]);LZR.HTML5.Util.Selector=function(a){this.data=a.data;this.type=a.type?a.type:0;this.checked=a.checked?a.checked:0;this.rowNum=a.rowNum?a.rowNum:0;this.titleClass=a.titleClass;this.defaultClass=a.defaultClass;this.overClass=a.overClass;this.downClass=a.downClass;this.div=a.div?a.div:document.createElement("div");this.onlyCheck=-1;this.children=[];for(a=0;a<this.data.length;a++)this.addin(this.data[a],a)};
LZR.HTML5.Util.Selector.prototype.className="LZR.HTML5.Util.Selector";LZR.HTML5.Util.Selector.prototype.version="0.0.0";
LZR.HTML5.Util.Selector.prototype.addin=function(a,b){switch(this.checked){case 0:a.checked=null;break;case 1:-1===this.onlyCheck&&a.checked?this.onlyCheck=b:a.checked=!1;break;case 2:a.checked||(a.checked=!1)}var c={};c.data=a;c.type=this.type;c.titleClass=this.titleClass;c.defaultClass=this.defaultClass;c.overClass=this.overClass;c.downClass=this.downClass;c=new LZR.HTML5.Util.Select(c);c.index=b;c.manager=this;this.children.splice(b,0,c);0<b&&0===b%this.rowNum&&this.div.appendChild(document.createElement("br"));
this.div.appendChild(c.div)};LZR.HTML5.Util.Selector.prototype.add=function(a){var b=this.data.length;this.data.push(a);this.addin(a,b)};LZR.HTML5.Util.Selector.prototype.del=function(a){this.div.removeChild(this.children[a].div);this.children.splice(a,1);this.data.splice(a,1)};LZR.HTML5.Util.Selector.prototype.getCheckedIndex=function(){var a=[];switch(this.checked){case 1:a.push(this.onlyCheck);break;case 2:for(var b=0;b<this.data.length;b++)this.data[b].checked&&a.push(b)}return a};
LZR.HTML5.Util.Selector.prototype.handleDown=function(a){var b;1===this.checked&&(b=this.onlyCheck,0<=this.onlyCheck&&this.onlyCheck!==a.index&&this.children[this.onlyCheck].setChecked(!1),this.onlyCheck=a.index,this.data[a.index].checked=!0);this.onDown(this.data,a.index,b)};LZR.HTML5.Util.Selector.prototype.handleUp=function(a){this.onUp(this.data,a.index)};LZR.HTML5.Util.Selector.prototype.onDown=function(){};LZR.HTML5.Util.Selector.prototype.onUp=function(){};