var	sys = require("sys"),
	http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs");

function loadStaticFile(uri, response) {
	var filename = path.join(process.cwd(), uri);
	fs.exists (filename, function (exists) {
// console.log(exists + " : " + filename);
		if (!exists) {
			response.writeHeader (404, {"Content-Type":"text/plain;charset=utf-8"});
			response.write ("404 页面不存在\n", "utf-8");
			response.end();
		} else {
			fs.readFile (filename, "binary", function (err, file) {
				if (err) {
					response.writeHeader (500, {"Content-Type":"text/plain;charset=utf-8"});
					response.write((err + "\n"), "utf-8");
					response.end();
				} else {
					// response.writeHeader (200, {"Content-Type":"text/html;charset=utf-8"});
					// response.writeHeader (200, {"Content-Type":"x-world/x-vrml"});
					// response.writeHeader (200);
					response.writeHeader (200, {
						"Access-Control-Allow-Origin": "*",		// HTML5 允许跨域访问的范围，* 代表允许任何网域访问
						"Content-Type":"text/html; charset=utf-8"	// 文件格式； 字符编码
					});
					response.write(file, "binary");
					response.end();
// console.log("OK");
				}
			});
		}
	});
}

http.createServer (function(request, response) {
	var uri = decodeURIComponent ( url.parse(request.url).pathname );

	// 适应之前的 test 连接（2015-5-21）
	if (uri.indexOf("/js/") === 0) {
		uri = "/demo" + uri;
	}

	loadStaticFile(uri, response);
}).listen(8085);

sys.puts("Server running at http://localhost:8085/");
