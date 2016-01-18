// ----------- 產品管理 ------------
function ProductManage () {
	try {
		this._ProductManage ();
	} catch (e) {}
}
ProductManage.prototype._ProductManage = function () {
	// 構造函數
	this.mod = null;					// mod 模型
	this.div = document.createElement("div");		// 容器
	this.pro = document.createElement("div");		// 屬性視圖容器
	this.productTree = this.buildTree ();			// 產品樹
	this.productTree.manager = this;

	this.initView();
};

// 初始化視圖
ProductManage.prototype.initView = function () {
	this.div.appendChild(this.productTree.div);
	this.div.appendChild(this.pro);

	// 設置 CSS 樣式 ....
	this.productTree.div.style.float =  "left";
	this.pro.style.float =  "right";
	this.pro.style.width = "50%";
	this.pro.style.height = "100%";
	this.pro.style.background = "#FF0";
};

// 刷新屬性視圖
ProductManage.prototype.flushProView = function (view) {
	if (this.proView) {
		this.pro.removeChild(this.proView);
		delete (this.proView);
	}
	if  (view) {
		this.proView = view;		// 屬性視圖
		this.pro.appendChild (this.proView);
	}
};

// 創建屬性樹
ProductManage.prototype.buildProTree = function (obj) {
	var view = obj.view.proDiv;

	if (this.proTree) {
		if (this.proTree.parentDiv != view) {
			this.proTree.parentDiv.removeChild(this.proTree.div);
			delete (this.proTree);
		} else {
			return;
		}
	}

	if (obj.pro) {
		this.proTree = new AttributeTree(obj.pro);
		view.appendChild(this.proTree.div);
		this.proTree.parentDiv = view;
		this.proTree.manager = this;
	}
};







// 創建產品樹
ProductManage.prototype.buildTree = function () {
	var o = {
		name:"Test", type:"product", children:[
			{name:"A", type:"product", children:[
				{name:"A1", type:"product"},
				{name:"A2", type:"product"}
			]},
			{name:"B", type:"product", children:[
				{name:"B1", type:"product"},
				{name:"B2", type:"product"},
				{name:"B3", type:"product", pro:{type:"defaultPro", children:[
					{name:"基本屬性", type:"basePro"},
					{name:"功能應用", type:"use"},
					{name:"人力排配", type:"manpower"},
					{name:"工藝解析", type:"craft"},
					{name:"其它", type:"otherPro"}
				]}, children:[
					{name:"B3_1"},
					{name:"B3_2", type:"product", children:[
						{name:"B3_2.a"},
						{name:"B3_2.b"},
						{name:"B3_2.c"}
					]}
				]},
				{name:"B4", type:"product", pro:{type:"defaultPro", children:[
					{name:"基本屬性", type:"basePro"},
					{name:"功能應用", type:"use"},
					{name:"供應商", type:"supplier"},
					{name:"構成", type:"struct"},
					{name:"性能指標", type:"performance"},
					{name:"原料成本", type:"rawCost"},
					{name:"成本統計", type:"statistic"},
					{name:"營銷成本", type:"busiCost"},
					{name:"加工成本", type:"procCost"},
					{name:"原料用量", type:"rawConsump"},
					{name:"加工參數", type:"parameter"},
					{name:"人力排配", type:"manpower"},
					{name:"工藝解析", type:"craft"},
					{name:"原材料", type:"rawMaterial"},
					{name:"制程", type:"proc"},
					{name:"其它", type:"otherPro", children:[
						{name:"001", type:"subPro", children:[
							{type:"subMember",children:[
								{name:"101", type:"member"},
								{name:"102", type:"member"},
								{name:"103", type:"member"},
								{name:"104", type:"member"}
							]},
							{name:"011", type:"subPro"},
							{name:"012", type:"subPro"},
							{name:"013", type:"subPro"}
						]}
					]}
				]}},
				{name:"B5", type:"product", children:[
					{name:"B5_1", type:"product"},
					{name:"B5_2", type:"product"},
					{name:"B5_3", type:"product"}
				]}
			]},
			{name:"C", type:"product"},
			{name:"D", type:"product", children:[
				{name:"D1", type:"product"},
				{name:"D2", type:"product"},
				{name:"D3", type:"product"}
			]}
		]
	};
	return new ProductTree(o);
};
