package lzr.java.mvc.dao.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

/**
 * 数据库配置信息
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/1/31	下午4:23:34
 */
public class DbConfig {

	/**
	 * 数据库驱动
	 */
	private String driver = "oracle.jdbc.driver.OracleDriver";	// Oracle
//	private String driver = "com.mysql.jdbc.Driver";	// MySQL
//	private String driver = "com.microsoft.sqlserver.jdbc.SQLServerDriver";	// SQLServer
//	private String driver = "sun.jdbc.odbc.JdbcOdbcDriver";	// odbc

	/** 
	 * 连接字 
	 */
	private String url = "jdbc:oracle:thin:@10.197.11.241:1521:dev";	// Oracle
//	private String url = "jdbc:mysql://10.134.100.190:3306/sm_hr";	// MySQL
//	private String url = "jdbc:sqlserver://localhost:1433; databaseName=Northwind";	// SQLServer
//	private String url = "jdbc:odbc:driver={Microsoft Excel Driver (*.xls)};DBQ=D:\\Test.xls;READONLY=FALSE";	// 通過 odbc 連接 Excel

	/**
	 * 用户名 
	 */
	private String user = "PRODUCTCHECK";
//	private String user = "root";

	/**
	 * 密码 
	 */
	private String pass = "PRODUCTCHECK.2014";
//	private String pass = "root";
	
	/**
	 * 配置信息
	 */
	private Properties info = null;

	/**
	 * 设置驱动
	 * @param div 数据库驱动
	 * @return this
	 * <br>2015/2/4 下午2:02:58, 子牛连
	 */
	public DbConfig setDriver (String div) {
		if (null != div) this.driver = div;
		return this;
	}

	/**
	 * 设置连接字
	 * @param url 数据库连接字
	 * @return this
	 * <br>2015/2/4 下午2:03:45, 子牛连
	 */
	public DbConfig setUrl (String url) {
		if (null != url) this.url = url;
		return this;
	}

	/**
	 * 设置登录密码
	 * @param user 用户名
	 * @param pass 密码
	 * @return this
	 * <br>2015/2/4 下午2:03:48, 子牛连
	 */
	public DbConfig setPass (String user, String pass) {
		if (null != user || null != pass) {
			this.user = user;
			this.pass = pass;
		}
		return this;
	}

	/**
	 * 设置配置信息
	 * @param pro 配置信息
	 * @return this
	 * <br>2015/2/7 上午10:19:09, 子牛连
	 */
	public DbConfig setPro (Properties pro) {
		info = pro;
		if ( info.getProperty("user")==null ) {
			info.setProperty("user", user);
		}
		if ( info.getProperty("password")==null ) {
			info.setProperty("password", pass);
		}
		return this;
	}

	/**
	 * 设置配置信息内容
	 * @param key 键
	 * @param value 值
	 * @return this
	 * <br>2015/2/7 上午10:21:56, 子牛连
	 */
	public DbConfig setInfo (String key, String value) {
		if (info == null) {
			setPro(new Properties());
		}
		info.setProperty(key, value);
		return this;
	}

	/**
	 * 创建数据库连接
	 * @return 返回数据库连接
	 * @throws SQLException 数据库加载驱动错误 / 数据库连接失败
	 * <br>2015/2/4 下午2:12:04, 子牛连
	 */
	public Connection create () throws SQLException {
		try {
			// 加载数据库驱动程序
			Class.forName(driver);
			// 返回数据库连接
			if (info == null) {
				return DriverManager.getConnection(url, user, pass);
			} else {
				return DriverManager.getConnection(url, info);
			}
		} catch (ClassNotFoundException e) {
			throw new SQLException("数据库加载驱动错误！");
		} catch (SQLException e) {
			throw new SQLException("数据库连接失败！");
		}
	}

	/**
	 * 获取数据库的类型
	 * @return
	 * <br>2015/4/30 下午3:15:02, 子牛连
	 */
	public DbType getDbType () {
		return DbType.getDbTypeByDriver(this.driver);
	}
}
