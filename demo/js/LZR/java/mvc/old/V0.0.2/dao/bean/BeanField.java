package lzr.java.mvc.dao.bean;

import java.lang.reflect.Field;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

import lzr.java.mvc.bean.annotation.Column;
import lzr.java.mvc.bean.annotation.Id;

/**
 * Bean字段
 * 
 * @version	1.0
 * @author	子牛连
 * 2015/1/31	下午4:45:33
 */
public class BeanField {

	/**
	 * 字段
	 */
	private Field field;

	/**
	 * 数据库栏位名
	 */
	private String name;

	/**
	 * 是否主键
	 */
	private boolean key=false;

	/**
	 * 根据属性生成 Bean字段之构造函数
	 * @param f 属性
	 * @throws Exception
	 */
	public BeanField(Field f) throws Exception {
		Column c = f.getAnnotation(Column.class);
		if (null != c) {
			name = c.name();
			if (name.length()>0) {
				f.setAccessible(true);
				field = f;
				if ( null != f.getAnnotation(Id.class) ) {
					key = true;
				}
			} else {
				throw new Exception("bean 属性（" + f.getName() + "）@Column 注解缺少 name。");
			}
		} else {
			throw new Exception("bean 属性（" + f.getName() + "）缺少 @Column 注解。");
		}
	}

	public String getName() {
		return name;
	}

	public boolean isKey() {
		return key;
	}

	public boolean isOnly() {
		return field.getAnnotation(Column.class).unique();
	}

	public boolean isInsert() {
		return field.getAnnotation(Column.class).insertable();
	}

	public boolean isUpdate() {
		return field.getAnnotation(Column.class).updatable();
	}

	/**
	 * 获取属性类型
	 * @return 属性类型
	 * <br>2015/3/26 上午11:46:23, 子牛连
	 */
	public Class<?> getType() {
		return field.getType();
	}

	/**
	 * 获取属性名
	 * @return 属性名
	 * <br>2015/3/26 上午11:46:35, 子牛连
	 */
	public String getFieldName() {
		return field.getName();
	}

	/**
	 * 设置属性值（不完整）
	 * @param bean
	 * @param value 属性值
	 * @throws Exception 
	 */
	public void set(Object bean, Object value) throws Exception {
		try {
			field.set(bean, value);
		} catch (Exception e) {
			// 数据转换处理（不完整，有BUG）
			String t = field.getType().getName();
			String vt = value.getClass().getName();
//System.out.println ("field : " + t);
//System.out.println ("value : " + vt + " = " + value);
			if ( vt.equals("java.lang.String") ) {
				String v = (String)value;
				if ( t.equals("java.lang.Integer") ) {
					field.set(bean, Integer.parseInt(v));
				} else if ( t.equals("java.lang.Long") ) {
					field.set(bean, Long.parseLong(v));
				} else if ( t.equals("java.lang.Double") ) {
					field.set(bean, Double.parseDouble(v));
				} else if ( t.equals("java.sql.Timestamp") ) {
					field.set(bean, Timestamp.valueOf(v));
				} else if ( t.equals("java.sql.Date") ) {
					field.set(bean, Date.valueOf(v));
				} else if ( t.equals("java.sql.Time") ) {
					field.set(bean, Time.valueOf(v));
				} else if ( t.equals("java.lang.Float") ) {
					field.set(bean, Float.parseFloat(v));
				} else {
					throw e;
				}
			} else if ( vt.equals("java.lang.Double") ){
				double v = (Double)value;
				if ( t.equals("java.lang.Integer") ) {
					field.set(bean, (int)v);
				} else if ( t.equals("java.lang.Long") ) {
					field.set(bean, (long)v);
				} else if ( t.equals("java.lang.Float") ) {
					field.set(bean, (float)v);
				} else {
					throw e;
				}
			} else {
				throw e;
			}
		}
	}

	/**
	 * 获取属性值
	 * @param bean
	 * @return 属性值
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * <br>2015/3/25 下午3:20:39, 子牛连
	 */
	public Object get(Object bean) throws IllegalArgumentException, IllegalAccessException {
		return field.get(bean);
	}

	/**
	 * 测试 Bean字段的所有属性
	 * 
	 * <br>2015/3/25 上午11:10:36, 子牛连
	 */
	public void printest () {
		System.out.println(	"\t栏位名：" + name +
							"\n\t属性名：" + getFieldName() +
							"\n\t类型：" + getType().getName() +
							"\n\t可新增：" + isInsert() +
							"\n\t可修改：" + isUpdate() +
							"\n\t是主键：" + key +
							"\n\t唯一键：" + isOnly() );
	}
}
