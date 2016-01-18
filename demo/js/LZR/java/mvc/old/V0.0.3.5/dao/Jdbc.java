package lzr.java.mvc.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import lzr.java.mvc.dao.config.DbConfig;

/**
 * 数据库连接类
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/1/31	下午4:28:54
 */
public class Jdbc implements InfDao {

	/**
	 * 数据库配置信息
	 */
	private DbConfig conf;

	/**
	 * 数据库连接对象
	 */
	private Connection connnection = null;

	/**
	 * 预编译语句
	 */
	private PreparedStatement preparedStatement = null;

	/**
	 * 直接执行语句
	 */
	private Statement statement = null;

	public Jdbc (DbConfig dbc) {
		conf = dbc;
	}
	
	public Jdbc () {
		conf = new DbConfig();
	}
	
	@Override
	public void open() throws SQLException {
		if (null == connnection) {
			connnection = conf.create();
			try {
				statement = connnection.createStatement();
			} catch (SQLException e) {
				connnection.close();
				connnection = null;
				throw new SQLException("直接执行语句创建失败！");
			}
		}
	}

	@Override
	public void close() {
		// 关闭PreparedStatement对象
		if (preparedStatement != null) {
			try {
				preparedStatement.close();
				preparedStatement = null;
			} catch (SQLException e) {
				System.out.println(e.getMessage());
			}
		}

		// 关闭statement对象
		if (statement != null) {
			try {
				statement.close();
				statement = null;
			} catch (SQLException e) {
				System.out.println(e.getMessage());
			}
		}

		// 关闭Connection 对象
		if (connnection != null) {
			try {
				connnection.close();
				connnection = null;
			} catch (SQLException e) {
				System.out.println(e.getMessage());
			}
		}	 
	}

	/**
	 * 执行SQL查询语句，返回结果集
	 * @param sql SQL查询语句
	 * @return 结果集
	 * @throws SQLException
	 * <br>2015/2/5 下午2:01:07, 子牛连
	 */
	public ResultSet query (String sql) throws SQLException {
		return statement.executeQuery(sql);
	}

	/**
	 * 执行SQL查询预编译语句，返回结果集
	 * @param sql SQL查询预编译语句
	 * @param params 预编译参数
	 * @return 结果集
	 * @throws SQLException
	 * <br>2015/2/5 下午2:02:11, 子牛连
	 */
	public ResultSet query (String sql,  Object[] params) throws SQLException {
		// 调用SQL
		preparedStatement = connnection.prepareStatement(sql);

		// 参数赋值
		if (params != null) {
			for (int i = 0; i < params.length; i++) {
				preparedStatement.setObject(i + 1, params[i]);
			}
		}

		// 执行
		return preparedStatement.executeQuery();
	}

	/**
	 * 执行SQL更新语句，返回受影响的行数
	 * @param sql SQL更新语句
	 * @return 受影响的行数
	 * @throws SQLException
	 * <br>2015/2/5 下午2:03:22, 子牛连
	 */
	public Integer execute(String sql) throws SQLException {
		return statement.executeUpdate(sql);
	}

	/**
	 * 执行SQL更新预编译语句，返回受影响的行数
	 * @param sql SQL更新预编译语句
	 * @param params 预编译参数
	 * @return 受影响的行数
	 * @throws SQLException
	 * <br>2015/2/5 下午2:04:41, 子牛连
	 */
	public Integer execute(String sql, Object[] params) throws SQLException {
		// 调用SQL 
		preparedStatement = connnection.prepareStatement(sql);
		
		// 参数赋值
		if (params != null) {
			for (int i = 0; i < params.length; i++) {
				preparedStatement.setObject(i + 1, params[i]);
			}
		}

		// 执行
		return preparedStatement.executeUpdate();
	}

	/**
	 * 将查询结果转换为Map集合
	 * @param rs 结果集
	 * @param end 是否关闭结果集
	 * @return Map集合
	 * @throws SQLException
	 * <br>2015/2/6 上午10:43:02, 子牛连
	 */
	private List<Map<String, Object>> parsResultSet (ResultSet rs, boolean end) throws SQLException {
		// 创建ResultSetMetaData对象
		ResultSetMetaData rsmd = null;

		// 结果集列数
		int columnCount = 0;
		rsmd = rs.getMetaData();

		// 获得结果集列数
		columnCount = rsmd.getColumnCount();

		// 创建List
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

		// 将ResultSet的结果保存到List中
		while (rs.next()) {
			// 将 rs 转换为 Map
			Map<String, Object> map = new LinkedHashMap<String, Object>();
			for (int i = 1; i <= columnCount; i++) {
				map.put(rsmd.getColumnLabel(i), rs.getObject(i));
			}

			list.add(map);
		}

		// 关闭结果集
		if (end) {
			rs.close();
		}

		// 返回结果
		return list;
	}

	@Override
	public Integer exe(String sql) throws SQLException {
		return execute(sql, null);
	}

	@Override
	public Integer exe(String sql, Object[] prm) throws SQLException {
		return execute(sql, prm);
	}

	@Override
	public List<Map<String, Object>> qry(String sql) throws SQLException {
		return parsResultSet( query(sql, null), true ) ;
	}

	@Override
	public List<Map<String, Object>> qry(String sql, Object[] prm) throws SQLException {
		return parsResultSet( query(sql, prm), true ) ;
	}

	@Override
	public ResultSet qryRs(String sql) throws SQLException {
		return query(sql, null);
	}

	@Override
	public ResultSet qryRs(String sql, Object[] prm) throws SQLException {
		return query(sql, prm);
	}

}
