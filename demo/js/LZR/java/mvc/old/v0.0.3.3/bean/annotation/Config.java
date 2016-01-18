package lzr.java.mvc.bean.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 对 SQLConfig 配置的注解
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/4/18	上午10:44:56
 */

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD,ElementType.METHOD})
@Inherited
public @interface Config {
	/**
	 * SQLConfig的处理方法
	 * @return
	 * <br>2015/4/18 上午10:46:54, 子牛连
	 */
	public String method() default "qry";

	/**
	 * qry 方法的返回值类型
	 * @return
	 * <br>2015/4/21 下午4:48:14, 子牛连
	 */
	public Class<?> type() default Config.class;

	/**
	 * SQL参数中的时间类型位置
	 * @return
	 * <br>2015/4/21 下午5:11:11, 子牛连
	 */
	public int[] timeIndex() default {};
}
