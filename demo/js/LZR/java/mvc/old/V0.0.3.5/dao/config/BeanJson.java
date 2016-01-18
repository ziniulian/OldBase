package lzr.java.mvc.dao.config;

/**
 * 用于对Bean进行特殊Json转换的类
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/2/9	上午9:32:16
 */

public class BeanJson {
	/**
	 * Bean 类名
	 */
	private String beanName = null;
	
	/**
	 * Bean实体
	 */
	private Object beanData = null;

	public BeanJson (Object bean) {
		if (null != bean) {
			beanData = bean;
			beanName = bean.getClass().getName();
		}
	}

	public BeanJson (Object bean, String name) {
		beanName = name;
		beanData = bean;
	}

	public String getBeanName() {
		return beanName;
	}

	public Object getBeandata() {
		return beanData;
	}

}
