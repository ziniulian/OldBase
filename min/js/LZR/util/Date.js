LZR.Util.Date={version:"0.0.0",getDate:function(a){return eval("new Date("+a.replace(/\d+(?=-[^-]+$)/,function(a){return parseInt(a,10)-1}).match(/\d+/g)+")")},addHour:function(a,b,c){b?c&&(b=new Date(b.valueOf())):b=new Date;b.setTime(b.valueOf()+36E5*a);return b},normalize:function(a,b,c){a?c&&(a=new Date(a.valueOf())):a=new Date;isNaN(b)&&(b=a.getHours());a.setMinutes(0);a.setSeconds(0);a.setMilliseconds(0);a.setHours(b);return a},toDate:function(a){return a.getFullYear()+"-"+LZR.HTML5.Util.format(a.getMonth()+
1,2,"0")+"-"+LZR.HTML5.Util.format(a.getDate(),2,"0")}};
