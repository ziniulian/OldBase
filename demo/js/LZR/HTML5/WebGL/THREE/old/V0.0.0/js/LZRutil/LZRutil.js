
// 阻止事件冒泡
function stopBubble (e)  {
	if (e && e.stopPropagation)  {
		e.stopPropagation();
	} else {
		window.event.cancelBubble=true;
	}
}

// 获取类对象
function getClass (obj) {
	return obj.__proto__;
}

// 标记 this 指针。BUG：只支持单个对象，不支持多个对象。
function targThis (thisObj) {
	var classObj = getClass(thisObj);
	if (!classObj.lzrTarg) {
		classObj.lzrTarg = thisObj;
	}
}

// 获取 this 指针。BUG：只支持单个对象，不支持多个对象。
function getThis (newObj) {
	return getClass(newObj).lzrTarg;
}

// 添加一个事件

// 移除一个事件

