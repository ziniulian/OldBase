LZR.Util.Date={version:"0.0.0",getDate:function(a){return eval("new Date("+a.replace(/\d+(?=-[^-]+$)/,function(a){return parseInt(a,10)-1}).match(/\d+/g)+")")}};
