package lzr.java.mvc.bean.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 模拟JPA的 javax.persistence.Column 字段注解
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/3/18	上午9:27:41
 */

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@Inherited
public @interface Column {
	/**
	 * 字段名
	 * <br>2015/3/18 上午9:38:33, 子牛连
	 */
	public String name() default "";

	/**
	 * 是否唯一
	 * <br>2015/3/18 上午9:39:10, 子牛连
	 */
	public boolean unique() default false;

	/**
	 * 是否可以为空
	 * <br>2015/3/18 上午9:39:23, 子牛连
	 */
	public boolean nullable() default true;

	/**
	 * 是否可以插入
	 * <br>2015/3/18 上午9:39:36, 子牛连
	 */
	public boolean insertable() default true;

	/**
	 * 是否可以更新
	 * <br>2015/3/18 上午9:39:49, 子牛连
	 */
	public boolean updatable() default true;

	/**
	 * 定义建表时创建此列的DDL（数据定义语言）
	 * <br>2015/3/18 上午9:40:01, 子牛连
	 */
	public String columnDefinition() default "";

	/**
	 * 从表名。如果此列不建在主表上（默认建在主表），该属性定义该列所在从表的名字。
	 * <br>2015/3/18 上午9:40:23, 子牛连
	 */
	public String table() default "";

	/**
	 * 字符串长度
	 * <br>2015/3/18 上午9:43:32, 子牛连
	 */
	public int length() default (int) 255;

	/**
	 * 数字位数
	 * <br>2015/3/18 上午9:43:07, 子牛连
	 */
	public int precision() default (int) 0;

	/**
	 * 小数点精度
	 * <br>2015/3/18 上午9:43:18, 子牛连
	 */
	public int scale() default (int) 0;

}
