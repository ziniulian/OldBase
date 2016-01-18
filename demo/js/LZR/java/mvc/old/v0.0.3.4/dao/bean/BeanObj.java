package lzr.java.mvc.dao.bean;

import java.sql.ResultSet;
import java.util.List;
import java.util.Map;

/**
 * Bean 实例
 * 
 * @version	1.0
 * @author	子牛连
 * 2015/1/31	下午4:42:39
 */
public class BeanObj {

	/**
	 * 唯一的 Bean库
	 */
	private static final BeanLib bl = new BeanLib();

	/**
	 * Bean表
	 */
	private BeanTab bt;

	/**
	 * Bean
	 */
	private Object bean;

	/**
	 * 表别名
	 */
	private String alias = "t";

	public BeanObj (Object obj) throws Exception {
		bt = bl.getBean(obj.getClass());
		bean = obj;
	}

	public BeanObj (Class<?> c) throws Exception {
		bt = bl.getBean(c);
	}

	public BeanObj (String className) throws Exception {
		bt = bl.getBean(className);
	}

	/**
	 * 修改表别名
	 * @param alias 表别名
	 * <br>2015/3/25 下午4:15:34, 子牛连
	 */
	public void setAlias(String alias) {
		this.alias = alias;
	}

	/**
	 * 获取属性值
	 * @param fieldName 属性名
	 * @return 属性值
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * <br>2015/3/27 上午11:21:21, 子牛连
	 */
	public Object get (String fieldName) throws IllegalArgumentException, IllegalAccessException {
		return bt.get(bean, fieldName);
	}

	/**
	 * 设置属性值
	 * @param fieldName 属性名
	 * @param value 属性值
	 * @throws Exception 
	 */
	public void set (String fieldName, Object value) throws Exception {
		bt.set(bean, fieldName, value);
	}

	/**
	 * 获取插入QL语句
	 * @param prm SQL参数
	 * @return SQL语句
	 * @throws Exception
	 * <br>2015/5/6 上午8:46:46, 子牛连
	 */
	public String getInsertSql (List<Object> prm) throws Exception {
		return bt.insertSQL(bean, prm);
	}

	/**
	 * 获取更新QL语句
	 * @param condition 查询条件
	 * @param prm SQL参数
	 * @return SQL语句
	 * @throws Exception
	 * <br>2015/5/6 上午8:49:59, 子牛连
	 */
	public String getUpdateSql (Object condition, List<Object> prm) throws Exception {
		return bt.updateSQL(bean, condition, alias, prm);
	}

	/**
	 * 获取保存SQL语句
	 * @param prm SQL参数
	 * @return SQL语句
	 * <br>2015/3/26 上午10:55:53, 子牛连
	 * @throws Exception 
	 */
	public String getSaveSql (List<Object> prm) throws Exception {
		return bt.saveSQL(bean, alias, prm);
	}

	/**
	 * 获取删除SQL语句
	 * @param prm SQL参数
	 * @return SQL语句
	 * <br>2015/3/26 上午10:56:19, 子牛连
	 * @throws Exception 
	 */
	public String getDeleteSql (List<Object> prm) throws Exception {
		return bt.deleteSQL(bean, alias, prm);
	}

	/**
	 * 获取查询SQL语句
	 * @param prm SQL参数
	 * @return SQL语句
	 * <br>2015/3/26 上午10:56:37, 子牛连
	 * @throws IllegalAccessException 
	 * @throws IllegalArgumentException 
	 */
	public String getQuerySql (List<Object> prm) throws IllegalArgumentException, IllegalAccessException {
		return bt.querySQL(bean, alias, prm);
	}

	/**
	 * 根据 Map 集合生成 Bean 集合
	 * @param maps Map 集合
	 * @return Bean 集合
	 * @throws Exception 
	 */
	public List<Object> mapsToBeans (List<Map<String, Object>> maps) throws Exception {
		return bt.mapsToBeans(maps);
	}

	/**
	 * 根据查询结果生成 Bean 集合
	 * @param rs 结果集
	 * @return Bean集合
	 * @throws Exception
	 * <br>2015/4/11 上午11:16:44, 子牛连
	 */
	public List<Object> rsToBeans (ResultSet rs, boolean end) throws Exception {
		return bt.rsToBeans(rs, end);
	}

}
