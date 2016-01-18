package lzr.java.mvc.dao.config;

import java.lang.reflect.Type;


import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

/**
 * JSON 配置信息
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/1/31	下午4:08:47
 */
public class GsonConfig {
	
	/**
	 * 生成 Gson 对象
	 * @return Gson 对象
	 * <br>2015/2/4 下午2:23:14, 子牛连
	 */
	public Gson create () {
		return new GsonBuilder()
		.setDateFormat("yyyy-MM-dd kk:mm:ss.SSS")	//时间转化为特定格式
//		.enableComplexMapKeySerialization()	//支持Map的key为复杂对象的形式
//		.serializeNulls()	// 转换 null 值
//		.excludeFieldsWithoutExposeAnnotation()	//不导出实体中没有用@Expose注解的属性
//		.setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)	//会把字段首字母大写,注:对于实体上使用了@SerializedName注解的不会生效.  
//		.setVersion(1.0)	//有的字段不是一开始就有的,会随着版本的升级添加进来,那么在进行序列化和返序列化的时候就会根据版本号来选择是否要序列化.  
							//@Since(版本号)能完美地实现这个功能.还的字段可能,随着版本的升级而删除,那么  
							//@Until(版本号)也能实现这个功能,GsonBuilder.setVersion(double)方法需要调用.  
//		.setPrettyPrinting()	//对json结果格式化
		.registerTypeAdapter(BeanJson.class, new BeanSerializer())	// 对Bean的特殊转换
		.create();
	}
}

/**
 * 对Bean的Json转换器
 * @author 子牛连
 */
class BeanSerializer implements JsonSerializer<BeanJson>, JsonDeserializer<BeanJson> {

	/**
	 * 对象转为Json时调用,实现JsonSerializer<BeanJson>接口
	 */
	@Override
	public JsonElement serialize(BeanJson arg0, Type arg1, JsonSerializationContext arg2) {
		Object obj = arg0.getBeandata();
		String name = arg0.getBeanName();
		JsonObject jo = null;
		if (null != obj) {
			JsonElement je = arg2.serialize(obj);
			try {
				jo = (JsonObject)je;
				if (jo.has("className")) throw new Exception("存在 className 属性");
				jo.addProperty("className", name);
			} catch (Exception e) {
				jo = new JsonObject();
				jo.add("beanData", je);
				jo.addProperty("beanName", name);
				jo.addProperty("className", "BeanJson");
			}
		}
		return jo;
	}

	/**
	 * json转为对象时调用,实现JsonDeserializer<BeanJson>接口
	 */
	@Override
	public BeanJson deserialize(JsonElement arg0, Type arg1, JsonDeserializationContext arg2) throws JsonParseException {
		String name = "";
		try {
			JsonObject jo = (JsonObject)arg0;
			name = jo.get("className").getAsString();
			if (name.equals("BeanJson")) {
				name = jo.get("beanName").getAsString();
				return new BeanJson(arg2.deserialize(jo.get("beanData"), Class.forName(name)), name);
			} else {
				return new BeanJson(arg2.deserialize(arg0, Class.forName(name)), name);
			}
		} catch (ClassNotFoundException e) {
			throw new JsonParseException("lzr.java.mvc.dao.config.GsonConfig.JsonDeserializer<BeanJson>：" + name + " 类解析失败。", e.getCause());
		}
	}

}
