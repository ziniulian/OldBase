LZR.HTML5.loadJs([LZR.HTML5.jsPath+"HTML5/util/Selector.js",LZR.HTML5.jsPath+"HTML5/util/BaseTimeAxis.js"]);
LZR.HTML5.Util.TimeAxisBurst=function(a){this.bta=a.bta;this.count=a.count?a.count:0;this.step=0;this.data=this.createData(a.data);this.selector=new LZR.HTML5.Util.Selector({data:this.data,type:5,checked:1,defaultClass:a.defaultClass,overClass:a.overClass,downClass:a.downClass,rowNum:0});this.offsetW=a.offsetW?a.offsetW:0;a.noBorder&&(this.selector.children[0].div.style.borderLeftWidth=0,this.selector.children[this.count-1].div.style.borderRightWidth=0);this.div=this.selector.div;LZR.HTML5.Util.Css.addClass(this.div,
a.outClass);this.bta.cover.appendChild(this.div)};LZR.HTML5.Util.TimeAxisBurst.prototype.className="LZR.HTML5.Util.TimeAxisBurst";LZR.HTML5.Util.TimeAxisBurst.prototype.version="0.0.0";LZR.HTML5.Util.TimeAxisBurst.prototype.init=function(){var a=this.bta.scroll.constant.stripPs.width;this.div.style.width=a+"px";for(var a=a/this.count,b=0;b<this.count;b++)this.selector.children[b].div.style.width=a-this.offsetW+"px"};
LZR.HTML5.Util.TimeAxisBurst.prototype.createData=function(a){a&&(this.count=a.length);if(0===this.count)return[];var b=[];this.step=this.bta.timeLong/this.count;var f=this.step*this.bta.timeStep,d=this.bta.startTime,e,c,i,g,j;a||(c=new Date,c.setHours(0),c.setMinutes(0),c.setSeconds(0),c.setMilliseconds(0),c=c.valueOf(),i=c-864E5,g=c+864E5,j=g+864E5);for(var h=0;h<this.count;h++){var k="",k=a?a[h]:this.getContent(d,e,i,c,g,j);e=f+d;b.push({ts:d,te:e,title:k});d=e}return b};
LZR.HTML5.Util.TimeAxisBurst.prototype.getContent=function(a,b,f,d,e,c){if(a>=f){if(a<d)return"\u6628\u5929";if(a<e)return"\u4eca\u5929";if(a<c)return"\u660e\u5929"}a=new Date(a);b="";switch(a.getDay()){case 0:b="\u5468\u65e5 ";break;case 1:b="\u5468\u4e00 ";break;case 2:b="\u5468\u4e8c ";break;case 3:b="\u5468\u4e09 ";break;case 4:b="\u5468\u56db ";break;case 5:b="\u5468\u4e94 ";break;case 6:b="\u5468\u516d "}return b+=a.getDate()};
