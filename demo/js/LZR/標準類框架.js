// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "自身文件路径" ]);

// ----------- 標準類 ------------

LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "..." ]);
Class = function (obj) {
	// .....
};
Class.prototype.className = "Class";
Class.prototype.version = "0.0.0";
LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "..." ]);



/*************************************************************/



// LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "自身文件路径" ]);

// ----------- 標準子類 ------------

LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "..." ]);
SubClass = function (obj) {
	Class.call(this, obj);
	// .....
};
// SubClass.prototype = Object.create(Class.prototype);
SubClass.prototype = LZR.createPrototype (Class.prototype);
SubClass.prototype._super = Class.prototype;
SubClass.prototype.className = "SubClass";
SubClass.prototype.version = "0.0.0";
LZR.HTML5.loadJs([ LZR.HTML5.jsPath + "..." ]);



/*****************************************************************/

/* 设计原则：
	1. 创建参数统一用 LZR.setObj 进行赋值（2015-9-23）
	2. 类中各参数变化，都不能影响整体功能（2015-9-23）
	3. 规范使用 SVN 对修改进行备注。不再使用 old 文本进行版本管理（2015-9-23）
	4. 任何类都能 new 空值（2015-9-24）
	5. 尽量以数据驱动方法，而不是用方法去变更数据（2015-9-28）
	6. 项目要分清 数据层、操作层、展示层（2015-10-15）
		数据层：存放项目所需要的所有查询数据及操作数据 等
		操作层：依赖数据层的数据，并实现各数据变换时的所有功能操作
		展示层：分为控制器的展示层，和功能的展示层
			功能展示层：由操作层控制，以展示相应功能
			控制器展示层：是用户可以修改数据的界面，既要能够修改数据，也要被操作层控制，以响应数据层数据的变化。
	7. 以数据为根，以事件驱动（2015-11-20）
*/


