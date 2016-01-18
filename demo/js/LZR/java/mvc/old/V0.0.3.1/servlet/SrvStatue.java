package lzr.java.mvc.servlet;

/**
 * 服务状态
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/4/9	上午10:22:28
 */
public enum SrvStatue {

	SUCCESS, LOSE;

	public String toJson() {
		String r="\"statue\":";
		switch (this) {
			case SUCCESS:
				r += "0";
				break;
			case LOSE:
				r += "1";
				break;
		}
		return r;
	}

}
