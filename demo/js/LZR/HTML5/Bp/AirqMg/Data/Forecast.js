// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/Data/Forecast.js" ]);

// ----------- 预报数据 ------------

LZR.HTML5.Bp.AirqMg.Data.Forecast = function (obj) {
	/*
	数据结构：
	{
		时效,
		区域,
		产品时间:{
			日期,
			时次
		},
		地点:[
			{
				地点名称（name）,
				地点编号（code）,
				地点类型（type）,（城市、站点）
				模式（modes）:[
					{
						模式类型（type）,（NAQPMS、CMAQ、CAMx、WRF、实测）
						时间（times）:[
							{
								时间类型（type）,（日均值、小时值）
								日期（date）,
								时间（time）,
								污染物（fomes）:[
									{
										名称（name）,（SO2、NO2、PM25、PM10、CO、O3）
										IAQI（aqi）,
										浓度,（chroma）（AQI，无此值）
										主要污染物（）,（AQI专用）
										O3生成速率,（O3专用）
										PM25组份（PM25专用）
									}
								]
							}
						]
					}
				]
			}
		]
	}
	*/

};
LZR.HTML5.Bp.AirqMg.Data.Forecast.prototype.className = "LZR.HTML5.Bp.AirqMg.Data.Forecast";
LZR.HTML5.Bp.AirqMg.Data.Forecast.prototype.version = "0.0.0";


