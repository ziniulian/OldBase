package lzr.java.mvc.servlet.imp;

/**
 * 服务实现接口
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/4/20	上午10:02:08
 */
public interface InfSrv {

	/**
	 * 服务主函数
	 * @param opt 操作
	 * @param obj 对象
	 * @return 服务返回的信息
	 * <br>2015/4/21 上午8:22:24, 子牛连
	 */
	public StringBuilder srvMain (String opt, String obj);

}
