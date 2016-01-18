LZR.HTML5.loadJs([LZR.HTML5.jsPath+"HTML5/util/Css.js",LZR.HTML5.jsPath+"HTML5/util/Event.js"]);
LZR.HTML5.Util.Select=function(a){this.data=a.data;this.type=a.type?a.type:0;this.titleClass=a.titleClass;this.defaultClass=a.defaultClass;this.overClass=a.overClass;this.downClass=a.downClass;this.pic=document.createElement("span");LZR.HTML5.Util.Css.addClass(this.pic,this.data.pic);this.div=document.createElement("span");LZR.HTML5.Util.Css.addClass(this.div,this.defaultClass);this.data.checked&&this.addDownCss();this.createTitle();this.createEvent()};LZR.HTML5.Util.Select.prototype.className="LZR.HTML5.Util.Select";
LZR.HTML5.Util.Select.prototype.version="0.0.0";
LZR.HTML5.Util.Select.prototype.createTitle=function(){switch(this.type){case 0:this.pic.title=this.data.title;break;case 5:this.pic.innerHTML=this.data.title;break;default:this.title=document.createElement("span");this.title.innerHTML=this.data.title;LZR.HTML5.Util.Css.addClass(this.title,this.titleClass);switch(this.type){case 8:this.div.appendChild(this.title);this.div.innerHTML+="<br>";this.div.appendChild(this.pic);break;case 2:this.div.appendChild(this.pic);this.div.innerHTML+="<br>";this.div.appendChild(this.title);
break;case 4:this.div.appendChild(this.title);this.div.appendChild(this.pic);break;case 6:this.div.appendChild(this.pic),this.div.appendChild(this.title)}return}this.div.appendChild(this.pic)};
LZR.HTML5.Util.Select.prototype.createEvent=function(){LZR.HTML5.Util.Event.addEvent(this.div,"mousedown",LZR.bind(this,this.handleDown),!1);LZR.HTML5.Util.Event.addEvent(this.div,"mouseup",LZR.bind(this,this.handleUp),!1);LZR.HTML5.Util.Event.addEvent(this.div,"mouseover",LZR.bind(this,this.handleOver),!1);LZR.HTML5.Util.Event.addEvent(this.div,"mouseout",LZR.bind(this,this.handleOut),!1)};
LZR.HTML5.Util.Select.prototype.handleDown=function(){this.addDownCss();!1===this.data.checked?this.data.checked=!0:!0===this.data.checked&&(this.data.checked=!1);this.onDown(this.data);this.manager&&this.manager.handleDown(this)};LZR.HTML5.Util.Select.prototype.handleUp=function(){this.data.checked||this.delDownCss();this.onUp(this.data);this.manager&&this.manager.handleUp(this)};LZR.HTML5.Util.Select.prototype.handleOver=function(){this.addOverCss()};LZR.HTML5.Util.Select.prototype.handleOut=function(){this.delAllCss()};
LZR.HTML5.Util.Select.prototype.addOverCss=function(){LZR.HTML5.Util.Css.addClass(this.div,this.overClass);LZR.HTML5.Util.Css.addClass(this.pic,this.data.picOver)};LZR.HTML5.Util.Select.prototype.addDownCss=function(){LZR.HTML5.Util.Css.addClass(this.div,this.downClass);LZR.HTML5.Util.Css.addClass(this.pic,this.data.picDown)};LZR.HTML5.Util.Select.prototype.delOverCss=function(){LZR.HTML5.Util.Css.removeClass(this.div,this.overClass);LZR.HTML5.Util.Css.removeClass(this.pic,this.data.picOver)};
LZR.HTML5.Util.Select.prototype.delDownCss=function(){LZR.HTML5.Util.Css.removeClass(this.div,this.downClass);LZR.HTML5.Util.Css.removeClass(this.pic,this.data.picDown)};LZR.HTML5.Util.Select.prototype.delAllCss=function(){this.delOverCss();this.data.checked||this.delDownCss()};LZR.HTML5.Util.Select.prototype.setChecked=function(a){a?(this.data.checked=!0,this.addDownCss()):(this.data.checked=!1,this.delDownCss())};LZR.HTML5.Util.Select.prototype.onDown=function(){};
LZR.HTML5.Util.Select.prototype.onUp=function(){};