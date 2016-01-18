var	sys = require("sys"),
	http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs");

// ------------------------- HTML 服务 --------------------------

// 返回普通HTML文件
function loadStaticFile(uri, response) {
	var filename = path.join(process.cwd(), uri);
	path.exists (filename, function (exists) {
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
						// "Access-Control-Allow-Origin": "*",	// HTML5 允许跨域访问的范围，* 代表允许任何网域访问
						"Content-Type":"text/html; charset=utf-8"	// 文件格式； 字符编码
					});
					response.write(file, "binary");
					response.end();
				}
			});
		}
	});
}

// ------------------------------------------  风场服务 -----------------------------------------

// 风场服务
function windSrv (arg, response) {
	var filename = path.join(process.cwd(), "/windData/" + arg.cTime + ".txt");

	path.exists (filename, function (exists) {
		response.writeHeader (200, {
			"Access-Control-Allow-Origin": "*",	// HTML5 允许跨域访问的范围，* 代表允许任何网域访问
			"Content-Type": "text/plain;charset=utf-8"	// 文件格式； 字符编码
		});
		if (!exists) {
			response.write ("[]", "utf-8");
			response.end();
		} else {
			fs.readFile (filename, "utf-8", function (err, data) {
				if (err) {
					response.write ("[]", "utf-8");
				} else {
					var v = calcValue (createQuery(arg), handleData(data));
					response.write(JSON.stringify(v), "utf-8");
				}
				response.end();
			});
		}
	});
}

// 整理风场源数据
function handleData (data) {
	var d = {};
	d.val = JSON.parse(data);
	d.rows = 328;
	d.cols = 374;
	d.lonmin = 50.5;
	d.latmin = -4;
	d.lonmax = 161.5;
	d.latmax = 58;
	d.lonstep = (d.lonmax - d.lonmin) / (d.cols - 1);
	d.latstep = (d.latmax - d.latmin) / (d.rows - 1);
	return d;
}

// 生成风场插值条件
function createQuery (arg) {
	var q = {};
	q.rows = parseInt(arg.columnNo, 10);
	q.cols = parseInt(arg.rowNo, 10);
	q.lonmin = parseFloat(arg.lonmin, 10);
	q.latmin = parseFloat(arg.latmin, 10);
	q.lonmax = parseFloat(arg.lonmax, 10);
	q.latmax = parseFloat(arg.latmax, 10);
	q.lonstep = (q.lonmax - q.lonmin) / (q.cols - 1);
	q.latstep = (q.latmax - q.latmin) / (q.rows - 1);
	return q;
}

// 计算风场插值
function calcValue (qry, data) {
	qry.val = [];
	if ( !(
		(qry.lonmin > data.lonmax) ||
		(qry.lonmax < data.lonmin) ||
		(qry.latmin > data.latmax) ||
		(qry.latmax < data.latmin)
	) ) {
		for (var j=0; j<qry.rows; j++) {
			for (var i=0; i<qry.cols; i++) {
				var lon = qry.lonmin + i*qry.lonstep;
				var lat = qry.latmin + j*qry.latstep;
				if (
					(lon > data.lonmax) ||
					(lon < data.lonmin) ||
					(lat > data.latmax) ||
					(lat < data.latmin)
				) {
					// qry.val.push( [lon, lat, 0, 0] );
				} else {
					var x = (lon - data.lonmin)/data.lonstep;
					var y = (lat - data.latmin)/data.latstep;
					var px = Math.floor(x);
					var py = Math.floor(y);
					var n = 2*(py * data.cols + px);

					var d = x - px;
					var pu = data.val[n];
					var pv = data.val[n+1];
					if (d>0) {
						pu += (data.val[n+2] - pu) * d;
						pv += (data.val[n+3] - pv) * d;
					}
					if (y>py) {
						n += data.cols * 2;
						var u = data.val[n];
						var v = data.val[n+1];
						u += (data.val[n+2] - u) * d;
						v += (data.val[n+3] - v) * d;

						d = y - py;
						pu += (u - pu) * d;
						pv += (v - pv) * d;
					}
					if (pu || pv) {
						qry.val.push( [lon, lat, pu, pv] );
					}
				}
			}
		}
	}
	return qry.val;
}

// ------------------------------------------  服务入口 -----------------------------------------

// HTTP服务
http.createServer (function(request, response) {
	var uri = url.parse(request.url).pathname;

	if (uri == "/server/windServer") {
		// 获取GET参数
		var arg = url.parse(request.url, true).query;

		// 执行风场服务
		windSrv (arg, response);
	}
}).listen(8088);

sys.puts("Wind Server : http://127.0.0.1:8088/server/windServer?model=naqpms&isAverage=true&prediction=1&z=1&zone=1&pTime=2015-01-07 00&rowNo=40&columnNo=30&lonmin=50.5&latmin=-4&lonmax=161.5&latmax=58&cTime=2015-01-07 04");
