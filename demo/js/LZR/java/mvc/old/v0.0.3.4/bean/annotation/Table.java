package lzr.java.mvc.bean.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 模拟JPA的 javax.persistence.Column 表注解
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/3/18	上午10:31:11
 */

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Table {
	  /**
	   * 表名
	   * <br>2015/3/18 上午10:32:44, 子牛连
	   */
	  public String name() default "";

	  /**
	   * 对应关系型数据库的 catalog（类似数据库的容器或命名空间）
	   * <br>2015/3/18 上午10:32:51, 子牛连
	   */
	  public String catalog() default "";

	  /**
	   * 对应关系型数据库的 schema（类似数据库的容器或命名空间）
	   * <br>2015/3/18 上午10:32:56, 子牛连
	   */
	  public String schema() default "";

}
