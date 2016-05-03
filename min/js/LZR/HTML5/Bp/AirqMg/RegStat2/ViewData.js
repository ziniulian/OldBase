LZR.HTML5.loadJs([LZR.HTML5.jsPath+"HTML5/Bp/AirqMg/RegStat2.js"]);
LZR.HTML5.Bp.AirqMg.RegStat2.ViewData=function(d){var a=LZR.Util.ValCtrl;this.fom={id:"fom",content:null,parent:null,root:this,view:null,ctrl:null};this.fom.children={PM25:{id:"PM25",parent:this.fom,root:this,html:"PM<sub>2.5</sub>",unit:"ug/m\u00b3",hour:"35",day:"3A",visible:new a(!1),alpha:new a(0.7),enable:new a(!0),dataProjection:"EPSG:4326",mapProjection:"EPSG:4326",legendUrl:null,view:null,ctrl:null},PM10:{id:"PM10",parent:this.fom,root:this,html:"PM<sub>10</sub>",unit:"ug/m\u00b3",hour:"32",
day:"38",visible:new a(!1),alpha:new a(0.7),enable:new a(!0),dataProjection:"EPSG:4326",mapProjection:"EPSG:4326",legendUrl:null,view:null,ctrl:null},SO2:{id:"SO2",parent:this.fom,root:this,html:"SO<sub>2</sub>",unit:"ug/m\u00b3",hour:"30",day:"36",visible:new a(!1),alpha:new a(0.7),enable:new a(!0),dataProjection:"EPSG:4326",mapProjection:"EPSG:4326",legendUrl:null,view:null,ctrl:null},NO2:{id:"NO2",parent:this.fom,root:this,html:"NO<sub>2</sub>",unit:"ug/m\u00b3",hour:"31",day:"37",visible:new a(!1),
alpha:new a(0.7),enable:new a(!0),dataProjection:"EPSG:4326",mapProjection:"EPSG:4326",legendUrl:null,view:null,ctrl:null},CO:{id:"CO",parent:this.fom,root:this,html:"CO",unit:"mg/m\u00b3",hour:"33",day:"39",visible:new a(!1),alpha:new a(0.7),enable:new a(!0),dataProjection:"EPSG:4326",mapProjection:"EPSG:4326",legendUrl:null,view:null,ctrl:null},O3:{id:"O3",parent:this.fom,root:this,html:"O<sub>3</sub>",unit:"ug/m\u00b3",hour:"34",day:"",visible:new a(!1),alpha:new a(0.7),enable:new a(!0),dataProjection:"EPSG:4326",
mapProjection:"EPSG:4326",legendUrl:null,view:null,ctrl:null},AQI:{id:"AQI",parent:this.fom,root:this,html:"AQI",unit:"",hour:"",day:"3E",visible:new a(!1),alpha:new a(0.7),enable:new a(!0),dataProjection:"EPSG:4326",mapProjection:"EPSG:4326",legendUrl:null,view:null,ctrl:null},O38H:{id:"O38H",parent:this.fom,root:this,html:"O<sub>3</sub>\u6ed1\u52a88\u5c0f\u65f6",unit:"",hour:"",day:"3D",visible:new a(!1),alpha:new a(0.7),enable:new a(!0),dataProjection:"EPSG:4326",mapProjection:"EPSG:4326",legendUrl:null,
view:null,ctrl:null}};this.line={id:"line",root:this,ctrl:null};this.line.children={Te:{id:"Te",parent:this.line,root:this,html:"\u6e29\u5ea6",unit:"\u2103",hour:"4W",day:"50",visible:new a(!1),alpha:new a(0.5),enable:new a(!0),dataProjection:"EPSG:4326",mapProjection:"EPSG:4326",legendUrl:null,view:null,ctrl:null},Rh:{id:"Rh",parent:this.line,root:this,html:"\u6e7f\u5ea6",unit:"%",hour:"4X",day:"51",visible:new a(!1),alpha:new a(0.5),enable:new a(!0),dataProjection:"EPSG:4326",mapProjection:"EPSG:4326",
legendUrl:null,view:null,ctrl:null},Pr:{id:"Pr",parent:this.line,root:this,html:"\u538b\u5f3a",unit:"hPa",hour:"4Y",day:"52",visible:new a(!1),alpha:new a(0.5),enable:new a(!0),dataProjection:"EPSG:4326",mapProjection:"EPSG:4326",legendUrl:null,view:null,ctrl:null}};this.wind={id:"wind",root:this,ctrl:null};this.wind.children={Lagrange:{id:"Lagrange",parent:this.wind,root:this,html:"\u62c9\u683c\u6717\u65e5\u98ce\u573a",windUrl:"http://192.168.1.222/bpycserver/api/GrdHandle/getWindData",column:40,
row:30,pad:20,windCanvasStyle:"windCanvasStyle",visible:new a(!1),alpha:new a(1),enable:new a(!0),color:"yellow",dataProjection:"EPSG:4326",mapProjection:"EPSG:4326",legendUrl:null,view:null,ctrl:null},Euler:{id:"Euler",parent:this.wind,root:this,html:"\u6b27\u62c9\u98ce\u573a",visible:new a(!1),alpha:new a(0.8),legendUrl:null,view:null,ctrl:null}};this.mod={id:"mod",root:this};this.mod.children={Ensemble:{id:"Ensemble",parent:this.mod,root:this,html:"\u96c6\u5408\u9884\u62a5",timeLong:{d01:7,d02:4,
d03:4},selected:new a(!1),view:null,ctrl:null},NAQPMS:{id:"NAQPMS",parent:this.mod,root:this,html:"NAQPMS",timeLong:{d01:7,d02:4,d03:4},selected:new a(!0),view:null,ctrl:null},CAMx:{id:"CAMx",parent:this.mod,root:this,html:"CAMX",timeLong:{d01:7,d02:4,d03:4},selected:new a(!1),view:null,ctrl:null},CMAQ:{id:"CMAQ",parent:this.mod,root:this,html:"CMAQ",timeLong:{d01:7,d02:4,d03:4},selected:new a(!1),view:null,ctrl:null},WRFchem:{id:"WRFchem",parent:this.mod,root:this,html:"WRF-CHEM",timeLong:{d01:4,
d02:3,d03:3},selected:new a(!1),view:null,ctrl:null}};this.area={id:"area",root:this};this.area.children={d01:{id:"d01",parent:this.area,root:this,html:"\u7b2c\u4e00\u533a\u57df",range:[47.02134865,-16.45396135,164.58891465,60.37036195],num:"d01",selected:new a(!0),enable:new a(!0),view:null,ctrl:null},d02:{id:"d02",parent:this.area,root:this,html:"\u7b2c\u4e8c\u533a\u57df",range:[37.02134865,-6.45396135,134.58891465,50.37036195],num:"d02",selected:new a(!1),enable:new a(!0),view:null,ctrl:null},
d03:{id:"d03",parent:this.area,root:this,html:"\u7b2c\u4e09\u533a\u57df",range:[27.02134865,6.45396135,104.58891465,40.37036195],num:"d03",selected:new a(!1),enable:new a(!0),view:null,ctrl:null}};this.timeStep={id:"timeStep",root:this};this.timeStep.children={hour:{id:"hour",parent:this.timeStep,root:this,html:"\u5c0f\u65f6\u503c",selected:new a(!0),view:null,ctrl:null},day:{id:"day",parent:this.timeStep,root:this,html:"\u65e5\u5747\u503c",selected:new a(!1),view:null,ctrl:null}};this.time={id:"time",
root:this};this.time.children={20:{id:"20",parent:this.time,root:this,html:"20\u65f6",selected:new a(!0),view:null,ctrl:null},8:{id:"8",parent:this.time,root:this,html:"8\u65f6",selected:new a(!1),view:null,ctrl:null}};this.date={id:"date",root:this,content:new a("2015-07-02"),view:null,ctrl:null};this.timeAxis={id:"timeAxis",root:this,style:1,noDrop:2,hoverTime:800,timeLong:new a(7),playing:!1,playWaitTime:new a(200),view:null,ctrl:null};this.timeHover={id:"timeHover",root:this,hoverClass:"hover",
imgClass:"hover_img",txtClass:"hover_txt",vClass:"hover_v",padd:10,layerId:0,view:null,ctrl:null};this.qry={id:"qry",root:this,wsUrl:"ws://192.168.1.211:8980",urlPre:"http://192.168.1.101/v0020/figure/",start:4,ctrl:null};this.cur={fom:this.fom.children.PM25,line:this.line.children.Te,wind:this.wind.children.Lagrange,mod:this.mod.children.NAQPMS,area:this.area.children.d01,timeStep:this.timeStep.children.hour,time:this.time.children[20],date:this.date,timeAxis:this.timeAxis,tp:new a(0),qry:this.qry,
mark:this.mark};d&&LZR.setObj(this,d)};LZR.HTML5.Bp.AirqMg.RegStat2.ViewData.prototype.className="LZR.HTML5.Bp.AirqMg.RegStat2.ViewData";LZR.HTML5.Bp.AirqMg.RegStat2.ViewData.prototype.version="0.0.3";LZR.HTML5.Bp.AirqMg.RegStat2.ViewData.prototype.getTimByInterface=function(){return this.date.content.val.replace(/-/g,"")+LZR.HTML5.Util.format(this.cur.time.id,2,"0")};LZR.HTML5.Bp.AirqMg.RegStat2.ViewData.prototype.getEndByInterface=function(){return this.qry.start+24*this.timeAxis.timeLong.val};
LZR.HTML5.Bp.AirqMg.RegStat2.ViewData.prototype.getStartTimeByTimeAxis=function(){return LZR.Util.Date.getDate(this.date.content.val+" 00:00:00").valueOf()+864E5};LZR.HTML5.Bp.AirqMg.RegStat2.ViewData.prototype.setTimeLongByTimeAxis=function(){this.timeAxis.timeLong.set(this.cur.mod.timeLong[this.cur.area.id])};
LZR.HTML5.Bp.AirqMg.RegStat2.ViewData.prototype.setAreaChild=function(d){var a=LZR.Util.ValCtrl,c={},e=!0,b;for(b in d)c[b]={},c[b].id=b,c[b].parent=this.area,c[b].root=this,c[b].enable=new a(!0),c[b].view=null,c[b].ctrl=null,c[b].num=b,c[b].html=d[b].html,c[b].range=d[b].range,e&&d[b].selected?(c[b].selected=new a(!0),this.cur.area=c[b],e=!1):c[b].selected=new a(!1);e&&b&&(c[b].selected.set(!0,!1),this.cur.area=c[b]);this.area.children=c};
