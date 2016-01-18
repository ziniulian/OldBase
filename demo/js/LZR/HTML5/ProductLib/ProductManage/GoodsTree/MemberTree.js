// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/ProductLib/ProductManage/GoodsTree/MemberTree.js" ]);

// ----------- 成员树 ------------

LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "HTML5/ProductLib/ProductManage/GoodsTree/PropertyTree.js" ]);
LZR.HTML5.ProductLib.ProductManage.MemberTree = function (obj) {
/*
	参数说明：
	obj: {
		name: "",				// 节点名称
		children: [obj1, obj2, ...],		// 子节点集合
		type: "",				// 节点类型
		pro: {					// 节点的属性
			type: "",			// 属性类型
			children: [			// 子属性集合

				pro1: {					// 属性（与节点相比，无 pro字段）
					name: "",			// 属性名称
					type: "",			// 属性类型
					children: [......],		// 子属性集合
					member: {			// 属性的成员
						type:"members",	// 成员类型
						children:[		// 成员集合

							mem1:{			// 成员（与属性相比，无children、member字段）
								name:"",		// 成员名
								type:"member",	// 成员类型
							}
							mem2:{},
							mem3:{},
							....
						]
					}
				},
				pro2,
				pro3, ...
			]
		},
	}
*/

	LZR.HTML5.ProductLib.ProductManage.PropertyTree.call(this, obj);
};
LZR.HTML5.ProductLib.ProductManage.MemberTree.prototype = LZR.createPrototype (LZR.HTML5.ProductLib.ProductManage.PropertyTree.prototype);
LZR.HTML5.ProductLib.ProductManage.MemberTree.prototype.className = "LZR.HTML5.ProductLib.ProductManage.MemberTree";
LZR.HTML5.ProductLib.ProductManage.MemberTree.prototype.version = "0.0.1";

// 设置页面样式
LZR.HTML5.ProductLib.ProductManage.MemberTree.prototype.css = function () {
	this.div.style.background = "#0F0";
	this.div.style.padding = "10px 0px 10px 5px";
};
