
// 阻止事件冒泡
function stopBubble (e)  {
	if (e && e.stopPropagation)  {
		e.stopPropagation();
	} else {
		window.event.cancelBubble=true;
	}
}