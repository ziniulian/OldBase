var sys=require("sys"),http=require("http"),url=require("url"),path=require("path"),fs=require("fs");
function loadStaticFile(b,a){var c=path.join(process.cwd(),b);path.exists(c,function(b){b?fs.readFile(c,"binary",function(b,c){b?(a.writeHeader(500,{"Content-Type":"text/plain;charset=utf-8"}),a.write(b+"\n","utf-8")):(a.writeHeader(200,{"Content-Type":"text/html; charset=utf-8"}),a.write(c,"binary"));a.end()}):(a.writeHeader(404,{"Content-Type":"text/plain;charset=utf-8"}),a.write("404 \u9875\u9762\u4e0d\u5b58\u5728\n","utf-8"),a.end())})}
http.createServer(function(b,a){var c=url.parse(b.url).pathname;loadStaticFile(c,a)}).listen(8088);sys.puts("Server running at http://localhost:8088/");
