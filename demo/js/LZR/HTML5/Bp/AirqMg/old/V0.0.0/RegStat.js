// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat.js" ]);

// ----------- 区域形势 ------------

LZR.HTML5.loadJs([
	LZR.HTML5.jsPath + "HTML5/Canvas/LayerManager.js",
	LZR.HTML5.jsPath + "HTML5/Canvas/Thumbnail.js",
	LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegImg.js",
	LZR.HTML5.jsPath + "HTML5/Canvas/ImgLoader.js"
]);
LZR.HTML5.Bp.AirqMg.RegStat = function (obj) {
	/*
		参数说明：
			{
				// 查询条件
				condition: {
					date,	// 产品日期（火狐浏览器只识别 "yyyy/MM/dd" 形式）
					tim,	// 时效
					ttyp,	// 日均/小时	（小时:1, 日均:0）
					area,	// 区域		（全国:1, 华东:2, 京津冀:3）
					mod,	// 模式
					fom,	// 污染物
				},

				map,	// 地图DIV
				layer,	// 图层管理DIV
				eys,	// 鹰眼DIV
				tbn	// 缩略图DIV
			}
	*/
	// 查询条件
	this.condition = obj.condition;

	// 地图
	this.map = new LZR.HTML5.Canvas.LayerManager (obj.map);
	this.map.maxRight = 1112;
	this.map.maxBottom = 866;
	this.map.minWidth = 250;
	this.map.minHeight = 250;

	// 缩略图
	this.tbn = new LZR.HTML5.Canvas.Thumbnail(obj.tbn);
	this.tbn.direction = 2;
	this.tbn.width = 111;
	this.tbn.height = 87;
	this.tbn.paddingU = 40;
	this.tbn.offsetU = 5;
	this.tbn.offsetV = 20;
	this.tbn.ctx.fillStyle="black";
	this.tbn.onchange = LZR.HTML5.Util.bind (this, function (i) {
		// LZR.HTML5.log(this.tbn.imgs[i].url);
		// this.map.layers = this.tbn.imgs[i].getLayers();
		this.map.layers[0].obj = this.tbn.imgs[i].getLayers()[0].obj;
	});

	// 地图图片
	this.maps = new LZR.HTML5.Canvas.ImgLoader( LZR.HTML5.Util.bind (this, this.onMaps) );

	// 分布图图片
	this.tbns = new LZR.HTML5.Canvas.ImgLoader( LZR.HTML5.Util.bind (this, this.onTbns) );

	// 是否可循环控制
	this.ctrlEanble = true;
};
LZR.HTML5.Bp.AirqMg.RegStat.prototype.className = "LZR.HTML5.Bp.AirqMg.RegStat";
LZR.HTML5.Bp.AirqMg.RegStat.prototype.version = "0.0.0";

// 初始化
LZR.HTML5.Bp.AirqMg.RegStat.prototype.init = function () {
	this.initTbn();
	this.map.init();
	this.tbn.init();
	this.loadMaps();
};

// 缩略图初始化
LZR.HTML5.Bp.AirqMg.RegStat.prototype.initTbn = function () {
	if (this.condition.ttyp) {
		this.tbn.index = new Date().getHours();
		this.tbn.count = 24 * 7;
		this.tbn.ctx.font="13px Verdana";
		this.tbn.wheelScale = 3;
		this.tbn.wheelStyle = 3;
		this.tbn.draw = function (tb, i, x, y, w, h) {
			tb.ctx.fillText( tb.imgs[i].tim, x - 15 , y + h + 20);
		};
	} else {
		this.tbn.index = 0;
		this.tbn.count = 7;
		this.tbn.ctx.font="18px Verdana";
		this.tbn.wheelScale = 1;
		this.tbn.wheelStyle = 3;
		this.tbn.draw = function (tb, i, x, y, w, h) {
			tb.ctx.fillText( tb.imgs[i].tim, x , y + h + 20);
		};
	}
};

// 启动循环控制
LZR.HTML5.Bp.AirqMg.RegStat.prototype.ctrlStart = function () {
	this.ctrlEanble = true;
	this.map.ctrlEnable();
	this.tbn.ctrlEnable();
	this.ctrl();
};

// 关闭循环控制
LZR.HTML5.Bp.AirqMg.RegStat.prototype.ctrlStop = function () {
	this.ctrlEanble = false;
	this.map.ctrlDisable();
	this.tbn.ctrlDisable();
};

// 循环控制
LZR.HTML5.Bp.AirqMg.RegStat.prototype.ctrl = function () {
	if (this.ctrlEanble) {
		requestAnimationFrame( LZR.HTML5.Util.bind ( this, this.ctrl ) );
		this.map.ctrlUpdate();
		this.tbn.ctrlUpdate();
		this.map.flush();
		this.tbn.flush();
	}
};

// 加载地图底图
LZR.HTML5.Bp.AirqMg.RegStat.prototype.loadMaps = function () {
	var url = LZR.HTML5.upPath(7) + "data/RegImg/";
	url += "D" + this.condition.area + ".png";
	this.maps.add(url, this.condition.area);
};

// 地图底图加载后回调内容
LZR.HTML5.Bp.AirqMg.RegStat.prototype.onMaps = function (index, img) {
	var m = new LZR.HTML5.Canvas.Layer({name:"地图", obj:img});
	m.alpha = 0.5;

	// 填充地图数据
	this.map.addLayer ( new LZR.HTML5.Canvas.Layer({name:"分布图", obj:img}) );
	this.map.addLayer ( m );

	// 填充缩略图数据
	this.fillTbn (m, img);

	// 启动控制
	this.ctrlStart();

	// 加载其它分布图
	this.loadTbns();
};

// 填充缩略图数据
LZR.HTML5.Bp.AirqMg.RegStat.prototype.fillTbn = function (m, img) {
	var d = new Date (this.condition.date).valueOf();
// LZR.HTML5.log(new Date (this.condition.date));
	var path = LZR.HTML5.upPath(7) + "data/RegImg/crop4xw/";
	var url = "";

	// 污染物
	path += this.condition.fom;	// PM25HourlySpa_d03_NAQPMS_2015061720_171

	// 区域
	url += "_d0";
	url += this.condition.area;

	// 模式
	url += "_";
	url += this.condition.mod;
	url += "_";

	// 产品日期
	t = new Date ( d - 24 * 60 * 60 *1000 );
	url += t.getFullYear();
	url += LZR.HTML5.Util.format (t.getMonth()+1, 2, "0");
	url += LZR.HTML5.Util.format (t.getDate(), 2, "0");
	url += "20";

	for (var i=0; i<this.tbn.count; i++) {
		var r = this.createImg (i, d, path, url);
		r.layers.push( new LZR.HTML5.Canvas.Layer({name:"分布图", obj:img}) );
		r.layers.push( m );
		this.tbn.imgs.push( r );
	}
};

// 生成图片信息
LZR.HTML5.Bp.AirqMg.RegStat.prototype.createImg = function (index, d, path, url) {
	var r = new LZR.HTML5.Bp.AirqMg.RegImg();
	if (this.condition.ttyp) {
		r.url = path + "HourlySpa" + url + "_";
		r.url += LZR.HTML5.Util.format (index + 4, 3, "0");
		r.url += ".png";

		d += (index+this.condition.tim) * 60 * 60 *1000;
		d = new Date( d );

		r.tim = d.getFullYear();
		r.tim += "-";
		r.tim += LZR.HTML5.Util.format (d.getMonth()+1, 2, "0");
		r.tim += "-";
		r.tim += LZR.HTML5.Util.format (d.getDate(), 2, "0");
		r.tim += " ";
		r.tim += LZR.HTML5.Util.format (d.getHours(), 2, "0");
		r.tim += ":00:00";
	} else {
		// r.url = path + "DaySpa" + url + ".png";
		r.url = path + "HourlySpa" + url + "_";
		r.url += LZR.HTML5.Util.format (index * 24 + 4, 3, "0");
		r.url += ".png";

		d += index * 24 * 60 * 60 *1000;
		d = new Date( d );

		r.tim = d.getFullYear();
		r.tim += "-";
		r.tim += LZR.HTML5.Util.format (d.getMonth()+1, 2, "0");
		r.tim += "-";
		r.tim += LZR.HTML5.Util.format (d.getDate(), 2, "0");
	}

	return r;
};

// 加载分布图
LZR.HTML5.Bp.AirqMg.RegStat.prototype.loadTbns = function () {
	this.tbns.add(this.tbn.imgs[ this.tbn.index ].url, this.tbn.index);
	for (var i=0; i<this.tbn.count; i++) {
		if (i !== this.tbn.index) {
			this.tbns.add(this.tbn.imgs[i].url, i);
		}
	}
};

// 分布图加载回调内容
LZR.HTML5.Bp.AirqMg.RegStat.prototype.onTbns = function (index, img) {
	this.tbn.imgs[index].layers[0].obj = img;
	if (index === this.tbn.index) {
		this.tbn.aline (index, true);
		this.tbn.onchange (index);
	}
};

// 清空图片数据
LZR.HTML5.Bp.AirqMg.RegStat.prototype.clear = function () {
	this.ctrlStop();
	this.map.layers = [];
	this.tbn.imgs = [];
};

