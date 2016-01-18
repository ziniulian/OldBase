package lzr.java.mvc.servlet;

import lzr.java.mvc.dao.GsonImp;
import lzr.java.mvc.dao.InfDao;
import lzr.java.mvc.dao.InfJson;
import lzr.java.mvc.dao.Jdbc;
import lzr.java.mvc.dao.config.DbConfig;
import lzr.java.util.FileTool;

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
	 * 获取数据访问工具
	 * @return 数据访问接口
	 * <br>2015/4/7 上午11:16:32, 子牛连
	 */
	public static InfDao dao() {
		if (null == dao) {
			try {
//				dao = new Jdbc();
				// 测试用Excel数据库 对应测试代码：test1.txt
				dao = new Jdbc( new DbConfig().setUrl(
						"jdbc:odbc:driver={Microsoft Excel Driver (*.xls)};DBQ="
						+FileTool.getClassPath(DbConfig.class, "testDB.xls").getCanonicalPath()
						+";READONLY=FALSE"	// 设置Excel只读项
						).setInfo("charSet", "Big5")	// 设置Excel字符编码
						.setDriver( "sun.jdbc.odbc.JdbcOdbcDriver" ) );
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
	public static InfJson json() {
		if (null == json) {
			try {
				json = new GsonImp();
			} catch (Exception e) {
				json = null;
			}
		}
		return json;
	}

}
