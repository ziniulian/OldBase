function test () {
	//document.body.appendChild(new ProductManage().div);
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
							{name:"011", type:"subPro"},
							{name:"012", type:"subPro"},
							{name:"013", type:"subPro"}
						], member:{type:"members", children:[
							{name:"101", type:"member"},
							{name:"102", type:"member"},
							{name:"103", type:"member"},
							{name:"104", type:"member"}
						]}}
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

	document.body.appendChild(new ProductManage(o).div);
}