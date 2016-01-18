package lzr.java.mvc.bean.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 数据库插入操作时用的常量注解。
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/4/15	上午10:11:13
 */

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@Inherited
public @interface InsConst {
	/**
	 * 插入时，当属性值为空时，可用该值替代
	 * <br>2015/4/15 上午10:13:25, 子牛连
	 */
	public String value();
}
