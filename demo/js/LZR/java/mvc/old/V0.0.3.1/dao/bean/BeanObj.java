package lzr.java.mvc.dao.bean;

import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import lzr.java.mvc.bean.TestExcelBean;
import lzr.java.mvc.dao.Jdbc;
import lzr.java.mvc.dao.config.DbConfig;
import lzr.java.util.FileTool;

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













	/**
	 * 测试函数
	 * @param args
	 * <br>2015/3/27 上午11:23:40, 子牛连
	 */
	public static void main (String[] args) {
		TestExcelBean b = new TestExcelBean();
		b.setAge(30.0);
		b.setId(17);
		b.setId2(1985);
		b.setName("LZR");
		b.setTime(new Timestamp(50000));
		b.setTt1("己巳");
		b.setTt2("丙寅");
		b.setTt3("乙未");
		b.setTt4("丙寅");
		b.setTt5("大林木");
		b.setTt6("爐中火");
		b.setTt7("沙中金");
		b.setTt8("爐中火");
		b.printest();
		Jdbc db=null;

		try {
			BeanObj bo = new BeanObj(b);
			List<Object> m = new ArrayList<Object>();
			System.out.println(bo.getDeleteSql(m));
			for (Object o : m) {
				System.out.println("\t" + o);
			}

			m.clear();
			System.out.println(bo.getQuerySql(m));
			for (Object o : m) {
				System.out.println("\t" + o);
			}

			m.clear();
			System.out.println(bo.getSaveSql(m));
			for (Object o : m) {
				System.out.println("\t" + o);
			}

			b.setTt6(null);
			m.clear();
			System.out.println(bo.getDeleteSql(m));
			for (Object o : m) {
				System.out.println("\t" + o);
			}

			m.clear();
			System.out.println(bo.getQuerySql(m));
			for (Object o : m) {
				System.out.println("\t" + o);
			}

			m.clear();
			System.out.println(bo.getSaveSql(m));
			for (Object o : m) {
				System.out.println("\t" + o);
			}

			b.setTt8(null);
			m.clear();
			System.out.println(bo.getDeleteSql(m));
			for (Object o : m) {
				System.out.println("\t" + o);
			}

			m.clear();
			System.out.println(bo.getQuerySql(m));
			for (Object o : m) {
				System.out.println("\t" + o);
			}

			m.clear();
			System.out.println(bo.getSaveSql(m));
			for (Object o : m) {
				System.out.println("\t" + o);
			}

			b.setTt4(null);
			m.clear();
			System.out.println(bo.getDeleteSql(m));
			for (Object o : m) {
				System.out.println("\t" + o);
			}

			m.clear();
			System.out.println(bo.getQuerySql(m));
			for (Object o : m) {
				System.out.println("\t" + o);
			}

			m.clear();
			System.out.println(bo.getSaveSql(m));
			for (Object o : m) {
				System.out.println("\t" + o);
			}

			b.setTt6("炉中火");
			m.clear();
			System.out.println(bo.getSaveSql(m));
			for (Object o : m) {
				System.out.println("\t" + o);
			}

			bo = new BeanObj(new TestExcelBean());
			m.clear();
			System.out.println(bo.getQuerySql(m));
			for (Object o : m) {
				System.out.println("\t" + o);
			}

			bo.set("tt1", "Love yourself first!");
			m.clear();
			System.out.println(bo.getDeleteSql(m));
			for (Object o : m) {
				System.out.println("\t" + o);
			}

			m.clear();
			System.out.println(bo.getSaveSql(m));
			for (Object o : m) {
				System.out.println("\t" + o);
			}

			// 创建数据库（连接测试用Excel）
			DbConfig dbc = new DbConfig();
			dbc.setUrl( "jdbc:odbc:driver={Microsoft Excel Driver (*.xls)};DBQ="
				+FileTool.getClassPath(dbc, "testDB.xls").getCanonicalPath()
				+";READONLY=FALSE"	// 设置Excel只读项
				).setInfo("charSet", "big5")	// 设置Excel字符编码
				.setDriver( "sun.jdbc.odbc.JdbcOdbcDriver" );
			db = new Jdbc(dbc);

			// 连接数据库
			db.open();
			bo = new BeanObj(b);
			String s;
			List<Map<String, Object>> l;

			// 添加数据
			System.out.println("\n---添加数据：");
			m.clear();
			s = bo.getSaveSql(m);
			System.out.println(s);
			System.out.println(db.exe(s, m.toArray()));

			// 添加数据
			b.setTt4("丙寅");
			System.out.println("\n---添加数据：");
			m.clear();
			s = bo.getSaveSql(m);
			System.out.println(s);
			System.out.println(db.exe(s, m.toArray()));

			// 查询数据
			System.out.println("\n---添加数据：");
			m.clear();
			s = bo.getQuerySql(m);
			System.out.println(s);
			l = db.qry(s, m.toArray());
			for (Map<String, Object> map : l) {
				for (Entry<String, Object> entry : map.entrySet()) {
					System.out.print(entry.getKey() + ":" + entry.getValue() + ",\t\t");
				}
				System.out.println();
			}
			
			// 根据 Map 集合生成 Bean 集合
			for (Object o : bo.mapsToBeans(l)) {
				((TestExcelBean)o).printest();
			}

			// 根据查询结果生成 Bean 集合
			System.out.println("\n---添加数据：");
			m.clear();
			bo = new BeanObj(new TestExcelBean());
			s = bo.getQuerySql(m);
			System.out.println(s);
			for (Object o : bo.rsToBeans(db.qryRs(s, m.toArray()), true)) {
				((TestExcelBean)o).printest();
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		// 关闭数据库
		db.close();
		System.out.println("END!");
	}

}
