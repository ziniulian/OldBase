package lzr.java.mvc.dao;

import java.util.List;
import java.util.Map;

/**
 * Json 转换接口
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/2/7	下午2:04:28
 */
public interface InfJson {

	/**
	 * 将 Json 转换为 Map 列表
	 * @param json
	 * @return
	 * <br>2015/2/7 下午2:19:20, 子牛连
	 */
	public List<Map<String, Object>> toMaps (String json);

	/**
	 * 将 Json 转换为 Map
	 * @param json
	 * @return
	 * <br>2015/2/7 下午2:19:20, 子牛连
	 */
	public Map<String, Object> toMap (String json);

	/**
	 * 将 Json 转换为 Bean 对象集合，包含Bean名
	 * @param json
	 * @return Bean 对象集合
	 * <br>2015/2/7 下午2:20:16, 子牛连
	 */
	public List<Object> toBeans (String json);

	/**
	 * 将 Json 转换为 Bean 对象，包含Bean名
	 * @param json
	 * @return
	 * <br>2015/2/7 下午2:20:16, 子牛连
	 */
	public Object toBean (String json);

	/**
	 * 将 Json 转换为对象，不包含Bean名，通过字符串确定返回类型
	 * @param json
	 * @param className 类名
	 * @return
	 * <br>2015/2/7 下午2:46:52, 子牛连
	 * @throws ClassNotFoundException 
	 */
	public Object toObj (String json, String className) throws ClassNotFoundException;

	/**
	 * 将 Json 转换为对象，不包含Bean名，通过 Class 确定返回类型
	 * @param json
	 * @param type 要转换的类型
	 * @return
	 * <br>2015/2/10 上午8:08:14, 子牛连
	 */
	public Object toObj (String json, Class<?> type);

	/**
	 * 将 map 列表转换为 Json
	 * @param list Map 列表
	 * @return json
	 * <br>2015/2/7 下午2:21:15, 子牛连
	 */
	public String mapsTo (List<Map<String, Object>> list);

	/**
	 * 将 map 列表转换为 Json
	 * @param map
	 * @return json
	 * <br>2015/2/7 下午2:21:15, 子牛连
	 */
	public String mapTo (Map<String, Object> map);

	/**
	 * 将 Bean 对象集合转换为 Json，包含Bean名
	 * @param bean Bean 对象集合
	 * @return json
	 * <br>2015/2/7 下午2:22:18, 子牛连
	 */
	public String beansTo (List<Object> bean);

	/**
	 * 将 Bean 对象转换为 Json，包含Bean名
	 * @param bean Bean 对象
	 * @return json
	 * <br>2015/2/7 下午2:22:18, 子牛连
	 */
	public String beanTo (Object bean);
	
	/**
	 * 将对象转换为 Json，不包含Bean名
	 * @param obj 对象
	 * @return json
	 * <br>2015/2/7 下午2:50:33, 子牛连
	 */
	public String objTo (Object obj);
}
