package lzr.java.mvc.dao.config;

import java.util.Locale;

/**
 * 数据库类型
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/4/30	下午3:15:42
 */
public enum DbType {

	ORACLE,
	MYSQL,
	SQLSERVER,
	ODBC;

	/**
	 * 获取数据库的类型 By 数据库驱动名
	 * @param driver
	 * @return
	 * <br>2015/5/11 上午10:50:28, 子牛连
	 */
	public static DbType getDbTypeByDriver (String driver) {
		if (driver.equals("oracle.jdbc.driver.OracleDriver")) {
			return ORACLE;
		} else if (driver.equals("com.mysql.jdbc.Driver")) {
			return MYSQL;
		} else if (driver.equals("com.microsoft.sqlserver.jdbc.SQLServerDriver")) {
			return SQLSERVER;
		} else if (driver.equals("sun.jdbc.odbc.JdbcOdbcDriver")) {
			return ODBC;
		} else {
			return null;
		}
	}

	/**
	 * 获取数据库的类型 By 数据库名
	 * @param name
	 * @return
	 * <br>2015/5/11 上午10:54:06, 子牛连
	 */
	public static DbType getDbTypeByName (String name) {
		try {
			return DbType.valueOf(name.toUpperCase(Locale.US));
		} catch (Exception e) {
			return null;
		}
	}

}
