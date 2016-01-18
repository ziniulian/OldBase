package lzr.java.mvc.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * 数据访问接口
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/1/31	下午4:30:42
 */
public interface InfDao {

	/**
	 * 执行数据库更新语句
	 * @param sql 数据库更新语句
	 * @return 受影响的行数
	 * <br>2015/2/4 下午3:30:13, 子牛连
	 * @throws SQLException 
	 */
	public Integer exe (String sql) throws SQLException;
	
	/**
	 * 执行数据库更新语句
	 * @param sql 数据库更新语句
	 * @param prm 数据参数
	 * @return 受影响的行数
	 * <br>2015/2/4 下午3:31:11, 子牛连
	 * @throws SQLException 
	 */
	public Integer exe (String sql, Object[] prm) throws SQLException;
	
	/**
	 * 执行数据库查询语句
	 * @param sql 数据库查询语句
	 * @return 查询结果
	 * <br>2015/2/4 下午3:32:13, 子牛连
	 * @throws SQLException 
	 */
	public List<Map<String, Object>> qry (String sql) throws SQLException;
	
	/**
	 * 执行数据库查询语句
	 * @param sql 数据库查询语句
	 * @param prm 数据参数
	 * @return 查询结果
	 * <br>2015/2/4 下午3:33:16, 子牛连
	 * @throws SQLException 
	 */
	public List<Map<String, Object>> qry (String sql, Object[] prm) throws SQLException;

	/**
	 * 执行数据库查询语句
	 * @param sql 数据库查询语句
	 * @param prm 数据参数
	 * @return 查询结果
	 * @throws SQLException
	 * <br>2015/4/11 上午11:10:48, 子牛连
	 */
	public ResultSet qryRs(String sql, Object[] prm) throws SQLException;

	/**
	 * 执行数据库查询语句
	 * @param sql 数据库查询语句
	 * @return 查询结果
	 * @throws SQLException
	 * <br>2015/4/11 上午11:11:39, 子牛连
	 */
	public ResultSet qryRs(String sql) throws SQLException;

	/**
	 * 连接数据库
	 * @throws SQLException
	 * <br>2015/3/27 下午5:06:21, 子牛连
	 */
	public void open() throws SQLException;

	/**
	 * 关闭所有数据库资源
	 * 
	 * <br>2015/3/27 下午5:06:09, 子牛连
	 */
	public void close();

}
