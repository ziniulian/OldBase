package lzr.java.mvc.dao.bean;

import java.util.LinkedHashMap;
import java.util.Map;

import lzr.java.mvc.bean.TestExcelBean;

import java.sql.Timestamp;

/**
 * Bean库
 * 
 * @version	1.0
 * @author	子牛连
 * 2015/1/31	下午4:44:02
 */
public class BeanLib {

	/**
	 * Bean库默认缓存容量
	 */
	public static final int BEAN_LIB_SIZE=50;

	/**
	 * 表集合
	 */
	private Map<String, BeanTab> beanMap;

	/**
	 * 构造函数
	 */
	public BeanLib () {
		this(BEAN_LIB_SIZE);
	}

	/**
	 * 构造函数
	 * @param mapSize 缓存大小
	 */
	public BeanLib (final int mapSize) {
		beanMap = new LinkedHashMap<String, BeanTab>(mapSize+2, 1, true) {
			private static final long serialVersionUID = 1L;
			private final int MAX_ENTRIES = mapSize;
			protected boolean removeEldestEntry(Map.Entry<String, BeanTab> eldest) {
			    return size() > MAX_ENTRIES;
			}
		};
	}

	/**
	 * 获取Bean表，By 类名
	 * @param className 类名
	 * @return Bean表
	 * @throws Exception
	 * <br>2015/3/25 上午11:01:21, 子牛连
	 */
	public BeanTab getBean(String className) throws Exception {
		BeanTab b = beanMap.get(className);
		if (null == b) {
			b = buildBean(className, Class.forName(className));
		}
		return b;
	}

	/**
	 * 获取Bean表，By 类
	 * @param c 类
	 * @return Bean表
	 * @throws Exception
	 * <br>2015/3/25 上午11:00:31, 子牛连
	 */
	public BeanTab getBean(Class<?> c) throws Exception {
		String n = c.getName();
		BeanTab b = beanMap.get(n);
		if (null == b) {
			b = buildBean(n, c);
		}
		return b;
	}

	/**
	 * 生成一个Bean表
	 * @param name 类名
	 * @param c 类
	 * @return Bean表
	 * <br>2015/3/25 上午10:56:57, 子牛连
	 * @throws Exception 
	 */
	private BeanTab buildBean(String name, Class<?> c) throws Exception {
		BeanTab b = new BeanTab(c);
		beanMap.put(name, b);
		return b;
	}












	/**
	 * 测试 Bean库的缓存处理
	 * 
	 * <br>2015/3/25 上午10:51:58, 子牛连
	 */
	public void printest () {
		System.out.println(	"size= " + beanMap.size() );
		for (String key : beanMap.keySet()) {
			System.out.println( "\t" + key );
		}
		System.out.println( "\n" );
	}

	/**
	 * 测试函数
	 * @param args
	 * <br>2015/3/25 上午10:54:44, 子牛连
	 */
	public static void main(String[] args) {
		try {
			BeanLib bl = new BeanLib(20);
			TestExcelBean bean = new TestExcelBean();
			BeanTab b = bl.getBean(bean.getClass());
			bl.printest ();
			b.printest();

			System.out.println( b.get(bean, "id") );
			b.set(bean, "id", 2008);
			System.out.println( b.get(bean, "id") );
			b.set(bean, "name", "LZR");
			b.set(bean, "age", 30.0);
			b.set(bean, "time", new Timestamp(50));
			b.set(bean, "tt3", "踢猫，真快乐！");
			bean.printest();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
