package lzr.java.mvc.dao;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import lzr.java.mvc.dao.config.BeanJson;
import lzr.java.mvc.dao.config.GsonConfig;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;


/**
 * JSON 转换器
 * 
 * @version	1.0
 * @author	子牛连
 * 2015/1/31	下午4:38:12
 */
public class GsonImp implements InfJson {

	/**
	 * 谷歌Json转换工具
	 */
	private Gson gs;

	public GsonImp () {
		gs = new GsonConfig().create();
	}

	public GsonImp (GsonConfig con) {
		gs = con.create();
	}

	@Override
	public List<Map<String, Object>> toMaps(String json) {
		return gs.fromJson(json, new TypeToken<List<LinkedHashMap<String, Object>>>(){}.getType());
	}

	@Override
	public Map<String, Object> toMap(String json) {
		return gs.fromJson(json, new TypeToken<LinkedHashMap<String, Object>>(){}.getType());
	}

	@Override
	public Object toBean(String json) {
		return gs.fromJson(json, BeanJson.class).getBeandata();
	}

	@Override
	public List<Object> toBeans(String json) {
		List<BeanJson> lb = gs.fromJson(json, new TypeToken<List<BeanJson>>(){}.getType());
		List<Object> lo = new ArrayList<Object>();
		for ( BeanJson b : lb) {
			lo.add(b.getBeandata());
		}
		return lo;
	}

	@Override
	public Object toObj(String json, String className) throws ClassNotFoundException {
		return toObj(json, Class.forName(className));
	}

	@Override
	public Object toObj(String json, Class<?> type) {
		return gs.fromJson(json, type);
	}

	@Override
	public String mapsTo(List<Map<String, Object>> list) {
		return gs.toJson(list);
	}

	@Override
	public String beanTo(Object bean) {
		return gs.toJson(new BeanJson(bean));
	}

	@Override
	public String beansTo(List<Object> beans) {
		List<BeanJson> lb = new ArrayList<BeanJson>();
		for ( Object o : beans) {
			lb.add(new BeanJson(o));
		}
		return gs.toJson(lb);
	}

	@Override
	public String objTo(Object obj) {
		return gs.toJson(obj);
	}

	@Override
	public String mapTo(Map<String, Object> map) {
		return gs.toJson(map);
	}

	/**
	 * 将 Json 转换为对象，通过泛型确定转换类型<br>
	 * <br><code>
	 * 		toObj( json, new TypeToken < <b>T</b> >(){} );
	 * </code>
	 * @param json
	 * @param typ 转换类型
	 * @return 对象
	 * <br>2015/2/10 下午1:57:45, 子牛连<br>
	 */
	public Object toObj(String json, TypeToken<?> typ) {
		return gs.fromJson(json, typ.getType());
	}

}
