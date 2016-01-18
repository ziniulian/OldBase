package lzr.java.mvc.servlet.imp;

import lzr.java.mvc.dao.GsonImp;
import lzr.java.mvc.dao.InfDao;
import lzr.java.mvc.dao.InfJson;
import lzr.java.mvc.dao.Jdbc;
import lzr.java.mvc.dao.config.DbConfig;
import lzr.java.mvc.dao.config.GsonConfig;

/**
 * 控制工具
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/4/7	上午10:53:45
 */
public class Ctrl {
	/**
	 * 数据访问工具
	 */
	public static InfDao dao = dao();

	/**
	 * JSON转换工具
	 */
	public static InfJson json = json();

	/**
	 * Bean的默认包名
	 */
	public static final String beanPack = "lzr.java.mvc.bean.";

	/**
	 * 与数据库对接的日期格式
	 */
	public static final String timeFormat = "yyyy-MM-dd kk:mm:ss.SSS";

	/**
	 * 获取数据访问工具
	 * @return 数据访问接口
	 * <br>2015/4/7 上午11:16:32, 子牛连
	 */
	private static InfDao dao() {
		if (null == dao) {
			try {
				DbConfig con = new DbConfig();
				dao = new Jdbc(con);
			} catch (Exception e) {
				dao = null;
			}
		}
		return dao;
	}

	/**
	 * 获取JSON转换工具
	 * @return  JSON转换接口
	 * <br>2015/4/7 上午11:17:18, 子牛连
	 */
	private static InfJson json() {
		if (null == json) {
			try {
				GsonConfig con = new GsonConfig();
				json = new GsonImp(con);
			} catch (Exception e) {
				json = null;
			}
		}
		return json;
	}

	/**
	 * JSON转类名
	 * @param json 类名的 JSON形式
	 * @param packageName 包名
	 * @return 类名
	 * <br>2015/4/21 上午8:58:48, 子牛连
	 */
	public static String jsonToClassName (String json, String packageName) {
		// 若类名无 ‘.’ 则加入包名
		if (null!=json && null!=packageName && (json.indexOf('.') == -1)) {
			return packageName + json;
		} else {
			return json;
		}
	}

	/**
	 * 类名转JSOM
	 * @param className 类名
	 * @param packageName 包名
	 * @return 类名的 JSON形式
	 * @throws Exception
	 * <br>2015/4/21 上午9:12:36, 子牛连
	 */
	public static String classNameToJson (String className, String packageName) throws Exception {
		// 若类名的包名与参数的包名完全匹配则删除类名的包名部分
		int i = className.lastIndexOf('.')+1;
		if (0 == i) {
			throw new Exception("类名不正确：" + className);
		} else if (className.substring(0, i).equals(packageName)) {
			return className.substring(i);
		} else {
			return className;
		}
	}

}
