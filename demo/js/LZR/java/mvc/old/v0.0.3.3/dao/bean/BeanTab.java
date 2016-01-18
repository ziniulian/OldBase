package lzr.java.mvc.dao.bean;

import java.lang.reflect.Field;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import lzr.java.mvc.bean.annotation.Table;
import lzr.java.mvc.servlet.imp.Ctrl;

/**
 * Bean 表
 * 
 * @version	1.0
 * @author	子牛连
 * 2015/1/31	下午4:43:24
 */
public class BeanTab {

	/**
	 * 主键、唯一键缓存初始大小
	 */
	public static final int ONLY_KEY_SIZE=3;

	/**
	 * 数据库表名
	 */
	private String tabName;

	/**
	 * 对应类名
	 */
	private String name;

	/**
	 * 字段集合
	 */
	private Map<String, BeanField> fieldMap = new LinkedHashMap<String, BeanField>();

	/**
	 * 主键集合
	 */
	private List<BeanField> keyList = new ArrayList<BeanField>(ONLY_KEY_SIZE);

	/**
	 * 唯一键集合
	 */
	private List<BeanField> onlyList = null;

	/**
	 * 根据类型生成 Bean表之构造函数
	 * @param c 类
	 * @throws Exception
	 */
	public BeanTab (Class<?> c) throws Exception {
		Table t = c.getAnnotation(Table.class);
		name = c.getName();
		if (null != t) {
			String n = t.name();
			if ( n.length()>0 ) {
				tabName = n;
				for (Field f : c.getDeclaredFields()) {
					try {
						n = f.getName();
						BeanField bf = new BeanField(f);
						fieldMap.put(n, bf);
						if ( bf.isKey() ) {
							keyList.add(bf);
						}
						if ( bf.isOnly() ) {
							if (null == onlyList) {
								onlyList = new ArrayList<BeanField>(ONLY_KEY_SIZE);
							}
							onlyList.add(bf);
						}
					} catch (Exception e) {
						// 此异常处理用于忽略缺少 @Column 注解的属性
					}
				}
			} else {
				throw new Exception("bean 模型（" + name + "）@Table 注解缺少 name。");
			}
		} else {
			throw new Exception("bean 模型（" + name + "）缺少 @Table 注解。");
		}
	}

	/**
	 * 获取属性值
	 * @param bean
	 * @param field 属性名
	 * @return 属性值
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * <br>2015/3/27 上午11:07:06, 子牛连
	 */
	public Object get(Object bean, String field) throws IllegalArgumentException, IllegalAccessException {
		return fieldMap.get(field).get(bean);
	}

	/**
	 * 设置属性值
	 * @param bean
	 * @param field 属性名
	 * @param value 属性值
	 * @throws Exception 
	 */
	public void set(Object bean, String field, Object value) throws Exception {
		fieldMap.get(field).set(bean, value);
	}

	/**
	 * 根据查询结果生成 Bean 集合
	 * @param rs 结果集
	 * @return Bean集合
	 * <br>2015/4/11 上午10:47:12, 子牛连
	 * @throws Exception
	 */
	public List<Object> rsToBeans (ResultSet rs, boolean end) throws Exception {
		List<Object> list = new ArrayList<Object>();

		// 循环所有记录
		while (rs.next()) {
			// 创建Bean对象
			Object bean = Class.forName(name).newInstance();
			
			// 循环所有属性
			for (BeanField f : fieldMap.values()) {
				String t = f.getType().getName();
				String n = f.getName();
				if (null != rs.getObject(n)) {
					// 在不为空时做类型匹配

					if ( t.equals("java.lang.String") ) {
						f.set(bean, rs.getString(n));
					} else if ( t.equals("java.lang.Integer") ) {
						f.set(bean, rs.getInt(n));
					} else if ( t.equals("java.lang.Long") ) {
						f.set(bean, rs.getLong(n));
					} else if ( t.equals("java.lang.Double") ) {
						f.set(bean, rs.getDouble(n));
					} else if ( t.equals("java.sql.Timestamp") ) {
						f.set(bean, rs.getTimestamp(n));
					} else if ( t.equals("java.sql.Date") ) {
						f.set(bean, rs.getDate(n));
					} else if ( t.equals("java.sql.Time") ) {
						f.set(bean, rs.getTime(n));
					} else if ( t.equals("java.lang.Float") ) {
						f.set(bean, rs.getFloat(n));
					} else if ( t.equals("java.lang.Boolean") ) {
						f.set(bean, rs.getBoolean(n));
					} else {
						f.set(bean, rs.getObject(n));
//Object v = rs.getObject(n);
//System.out.println ("field : " + t);
//System.out.println ("value : " + v.getClass().getName() + " = " + v);
					}
				}
			}

			// 将Bean对象保存到List中
			list.add(bean);
		}

		// 关闭结果集
		if (end) {
			rs.close();
		}

		// 返回结果
		return list;
	}

	/**
	 * 根据 Map 集合生成 Bean 集合
	 * @param maps Map集合
	 * @return Bean集合
	 * @throws Exception 
	 */
	public List<Object> mapsToBeans (List<Map<String, Object>> maps) throws Exception {
		List<Object> beans = new ArrayList<Object>();
		for (Map<String, Object> m : maps) {
			beans.add(mapToBean(m));
		}
		return beans;
	}

	/**
	 * 根据 Map 生成 Bean 实体
	 * @param map
	 * @return Bean 实体
	 * @throws Exception 
	 */
	private Object mapToBean (Map<String, Object> map) throws Exception {
		Object bean = Class.forName(name).newInstance();
		for (BeanField f : fieldMap.values()) {
			Object v = map.get(f.getName());
			if (null != v) {
				f.set(bean, v);
			}
		}
		return bean;
	}

	/**
	 * 生成插入SQL语句
	 * @param bean
	 * @param prm SQL参数
	 * @return SQL语句
	 * @throws Exception
	 * <br>2015/5/6 上午8:20:06, 子牛连
	 */
	public String insertSQL (Object bean, List<Object> prm) throws Exception {
		StringBuilder sql = new StringBuilder();
		if ( !createInsertSQL(bean, prm, sql) ) {
			throw new Exception("bean 模型（" + bean.getClass() + "）生成插入SQL语句失败。");
		}
		return sql.toString();
	}

	/**
	 * 生成更新SQL语句
	 * @param bean
	 * @param condition 查询条件
	 * @param alias 表别名
	 * @param prm SQL参数
	 * @return SQL语句
	 * @throws Exception
	 * <br>2015/5/6 上午8:36:41, 子牛连
	 */
	public String updateSQL (Object bean, Object condition, String alias, List<Object> prm) throws Exception {
		StringBuilder sql = new StringBuilder();
		StringBuilder where = new StringBuilder();
		List<Object> prmWer = new ArrayList<Object>();
		if ( !checkOnly(condition, alias, prmWer, where) ) {
			if ( !checkKey(condition, alias, prmWer, where) ) {
				prmWer.clear();
				where = new StringBuilder();
				if ( !createWhereSQL(condition, alias, prmWer, where) ) {
					throw new Exception("condition 模型（" + condition.getClass() + "）生成更新SQL的where子句失败。");
				}
			}
		}

		if ( createUpdateSQL(bean, alias, prm, sql) ) {
			for ( Object o : prmWer ) {
				prm.add(o);
			}
			sql.append(where);
			return sql.toString();
		} else {
			throw new Exception("bean 模型（" + bean.getClass() + "）生成更新SQL语句失败。");
		}
	}

	/**
	 * 生成保存SQL语句
	 * @param bean
	 * @param alias 表别名
	 * @param prm SQL参数
	 * @return SQL语句
	 * <br>2015/3/26 上午10:58:25, 子牛连
	 * @throws Exception 
	 */
	public String saveSQL (Object bean, String alias, List<Object> prm) throws Exception {
		StringBuilder sql = new StringBuilder();
		StringBuilder where = new StringBuilder();
		List<Object> prmWer = new ArrayList<Object>();
		if ( checkKey(bean, alias, prmWer, where) ) {
			// 若主键信息完整，则生成更新语句
			if ( createUpdateSQL(bean, alias, prm, sql) ) {
				for ( Object o : prmWer ) {
					prm.add(o);
				}
				sql.append(where);
			} else {
				throw new Exception("bean 模型（" + bean.getClass() + "）生成保存SQL语句（UPDATE）失败。");
			}
		} else {
			// 若主键信息不完整，则生成插入语句
			if ( !createInsertSQL(bean, prm, sql) ) {
				throw new Exception("bean 模型（" + bean.getClass() + "）生成保存SQL语句（INSERT）失败。");
			}
		}
		return sql.toString();
	}

	/**
	 * 生成删除SQL语句
	 * @param bean
	 * @param alias 表别名
	 * @param prm SQL参数
	 * @return SQL语句
	 * <br>2015/3/26 上午10:59:00, 子牛连
	 * @throws Exception 
	 */
	public String deleteSQL (Object bean, String alias, List<Object> prm) throws Exception {
		StringBuilder sql = new StringBuilder();
		StringBuilder where = new StringBuilder();
		if ( !checkOnly(bean, alias, prm, where) ) {
			if ( !checkKey(bean, alias, prm, where) ) {
				prm.clear();
				where = new StringBuilder();
				if ( !createWhereSQL(bean, alias, prm, where) ) {
					throw new Exception("bean 模型（" + bean.getClass() + "）生成删除SQL语句失败。");
				}
			}
		}

		switch (Ctrl.dbType) {
			case MYSQL:
				// MySQL 写法
				sql.append("delete ");
				sql.append(alias);
				sql.append(" from ");
				sql.append(tabName);
				sql.append(" ");
				sql.append(alias);
				break;
			default:
				// Oracle 写法
				sql.append("delete from ");
				sql.append(tabName);
				sql.append(" ");
				sql.append(alias);
				break;
		}

		sql.append(where);
		return sql.toString();
	}

	/**
	 * 生成查询SQL语句
	 * @param bean
	 * @param alias 表别名
	 * @param prm SQL参数
	 * @return SQL语句
	 * <br>2015/3/26 上午10:59:09, 子牛连
	 * @throws IllegalAccessException 
	 * @throws IllegalArgumentException 
	 */
	public String querySQL (Object bean, String alias, List<Object> prm) throws IllegalArgumentException, IllegalAccessException {
		StringBuilder sql = new StringBuilder();
		StringBuilder where = new StringBuilder();
		if ( !checkOnly(bean, alias, prm, where) ) {
			if ( !checkKey(bean, alias, prm, where) ) {
				prm.clear();
				where = new StringBuilder();
				createWhereSQL(bean, alias, prm, where);
			}
		}
		sql.append("select ");
		sql.append(alias);
		sql.append(".* from ");

		sql.append(tabName);
		sql.append(" ");
		sql.append(alias);

		sql.append(where);
		return sql.toString();
	}

	/**
	 * 检测唯一键
	 * @param bean
	 * @param alias 表别名
	 * @param prm 返回查询参数（return）
	 * @param sql 返回查询语句（return）
	 * @return 是否存在唯一键
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * <br>2015/4/13 上午10:19:59, 子牛连
	 */
	private boolean checkOnly (Object bean, String alias, List<Object> prm, StringBuilder sql) throws IllegalArgumentException, IllegalAccessException {
		if (null != onlyList) {
			Object v = null;
			for (BeanField f : onlyList) {
				v = f.get(bean);
				if (null != v) {
					sql.append(" where ");
					sql.append(alias);
					sql.append(".");
					sql.append(f.getName());
					sql.append("=?");
					prm.add(v);
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 检测主键
	 * @param bean
	 * @param alias 表别名
	 * @param prm 返回查询参数（return）
	 * @param sql 返回查询语句（return）
	 * @return 主键信息是否完整
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * <br>2015/4/13 上午10:23:39, 子牛连
	 */
	private boolean checkKey (Object bean, String alias, List<Object> prm, StringBuilder sql) throws IllegalArgumentException, IllegalAccessException {
		Object v = null;
		boolean w = true;
		for (BeanField f : keyList) {
			v = f.get(bean);
			if (null == v) {
				return false;
			} else {
				if (w) {
					sql.append(" where ");
					w = false;
				} else {
					sql.append(" and ");
				}
				sql.append(alias);
				sql.append(".");
				sql.append(f.getName());
				sql.append("=?");
				prm.add(v);
			}
		}
		return !w;
	}

	/**
	 * 生成 where 查询条件语句
	 * @param bean
	 * @param alias 表别名
	 * @param prm 返回查询参数（return）
	 * @param sql 返回查询语句（return）
	 * @return 是否存在查询条件
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * <br>2015/4/13 上午10:25:04, 子牛连
	 */
	private boolean createWhereSQL (Object bean, String alias, List<Object> prm, StringBuilder sql) throws IllegalArgumentException, IllegalAccessException {
		Object v = null;
		boolean w = true;
		for (BeanField f : fieldMap.values()) {
			v = f.get(bean);
			if (null != v) {
				if (w) {
					sql.append(" where ");
					w = false;
				} else {
					sql.append(" and ");
				}
				sql.append(alias);
				sql.append(".");
				sql.append(f.getName());
				sql.append("=?");
				prm.add(v);
			}
		}
		return !w;
	}

	/**
	 * 生成 update 语句
	 * @param bean
	 * @param alias 表别名
	 * @param prm 返回查询参数（return）
	 * @param sql 返回查询语句（return）
	 * @return 是否成功生成
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * <br>2015/4/13 上午10:28:19, 子牛连
	 */
	private boolean createUpdateSQL (Object bean, String alias, List<Object> prm, StringBuilder sql) throws IllegalArgumentException, IllegalAccessException {
		Object v = null;
		boolean w = true;
		for (BeanField f : fieldMap.values()) {
			v = f.get(bean);
			if ( (null != v) && (f.isUpdate()) ) {
				if (w) {
					sql.append ("update ");
					sql.append(tabName);
					sql.append(" ");
					sql.append(alias);
					sql.append(" set ");
					w = false;
				} else {
					sql.append(", ");
				}
				sql.append(alias);
				sql.append(".");
				sql.append(f.getName());
				sql.append("=?");
				prm.add(v);
			}
		}
		return !w;
	}

	/**
	 * 生成 insert 语句
	 * @param bean
	 * @param prm 返回查询参数（return）
	 * @param sql 返回查询语句（return）
	 * @return 是否成功生成
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * <br>2015/4/13 上午10:29:00, 子牛连
	 */
	private boolean createInsertSQL (Object bean, List<Object> prm, StringBuilder sql) throws IllegalArgumentException, IllegalAccessException {
		Object v;
		String c;
		StringBuilder valus = null;

		for (BeanField f : fieldMap.values()) {
			v = f.get(bean);
			if ( (null != v) && (f.isInsert()) ) {
				prm.add(v);
				c="?";
			} else {
				c = f.getInsConst();	// 对 @InsConst注解的分析：
			}

			if (null != c) {
				if (null== valus) {
					valus = new StringBuilder(") values (");
					sql.append ("insert into ");
					sql.append(tabName);
					sql.append(" (");
				} else {
					sql.append(", ");
					valus.append(", ");
				}
				sql.append(f.getName());
				valus.append(c);
			}
		}

		if (null== valus) {
			return false;
		} else {
			sql.append(valus);
			sql.append(")");
			return true;
		}
	}









	/**
	 * 测试 Bean表的字段 + 主键集合
	 * 
	 * <br>2015/3/25 上午11:09:59, 子牛连
	 */
	public void printest () {
		System.out.println( "Bean表.表名：" + tabName );
		System.out.println( "----------" );
		for (String key : fieldMap.keySet()) {
			System.out.println( "Bean表.字段：" + key );
			fieldMap.get(key).printest();
		}
		System.out.println( "----------" );
		for (BeanField f : keyList) {
			System.out.println( "Bean表.主键：" + f.getFieldName() );
		}
		if (null != onlyList) {
			System.out.println( "----------" );
			for (BeanField f : onlyList) {
				System.out.println( "Bean表.唯一键：" + f.getFieldName() );
			}
		}
		System.out.println( "----------\n" );
	}
}
