package lzr.java.mvc.dao;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import lzr.java.mvc.bean.TestExcelBean;
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

	/**
	 * 测试函数
	 * @param args
	 * <br>2015/2/11 下午5:22:27, 子牛连
	 */
	@SuppressWarnings("unchecked")
	public static void main (String[] args) {
		Date t = new Date();
		System.out.println(t);

		// Bean 转 JSON
		System.out.println("\n-----Bean 转 JSON");
		GsonImp g = new GsonImp();
		String s = g.beanTo(t);
		System.out.println(s);

		// JSON 转 Bean
		System.out.println("\n-----JSON 转 Bean");
		Object obj = g.toBean(s);
		System.out.println(obj);

		// Maps 转 JSON
		System.out.println("\n-----Maps 转 JSON");
		List<Map<String, Object>> lt = new ArrayList<Map<String, Object>> ();
		Map<String, Object> mp1 = new LinkedHashMap<String, Object>();
		mp1.put("t", t);
		mp1.put("r", "RRRR");
		mp1.put("int", 65);
		Map<String, Object> mp2 = new LinkedHashMap<String, Object>();
		mp2.put("r2", "2RRRR");
		mp2.put("int2", 265);
		mp2.put("t2", t);
		lt.add(mp1);
		lt.add(mp2);
		s = g.mapsTo(lt);
		System.out.println(s);

		// JSON 转 Maps
		System.out.println("\n-----JSON 转 Maps");
		List<Map<String, Object>> lt2 = g.toMaps(s);
		System.out.println(lt2.get(0).get("int"));
		System.out.println(lt2.get(0).get("t"));
		System.out.println(lt2.get(1).get("r2"));
		s = g.objTo(lt2.get(1).get("t2"));
		System.out.println( g.toObj(s, Date.class) );

		// Obj 转 JSON
		System.out.println("\n-----Obj 转 JSON");
		s = g.objTo(lt);
		System.out.println(s);

		// JSON 转 Obj
		System.out.println("\n-----JSON 转 Obj");
		List<Object> lt3 = (List<Object>) g.toObj(s, new TypeToken<List<Object>>(){});
		System.out.println(lt3.get(0));
		s = g.objTo(lt3.get(1));
		System.out.println(s);
		Map<String, Object> m3 = (Map<String, Object>) g.toObj(s, new TypeToken<Map<String, Object>>(){});
		s = g.objTo(m3.get("t2"));
		System.out.println(s);
		System.out.println( g.toObj(s, new TypeToken<Date>(){}));

		// beans 转 JSON
		System.out.println("\n----- beans 转 JSON");
		List<Object> lt1 = new ArrayList<Object>();
		lt1.add(t);
		TestExcelBean b = new TestExcelBean();
		b.setAge(30.0);
		b.setId(17);
		b.setId2(1985);
		b.setName("LZR");
		b.setTime(new Timestamp(50045560));
		b.setTt1("己巳");
		b.setTt2("丙寅");
		b.setTt3("乙未");
		b.setTt4("丙寅");
		lt1.add(b);
		lt1.add(new Boolean(true));
		s = g.beansTo(lt1);
		System.out.println(s);

		// JSON 转 beans
		System.out.println("\n----- JSON 转 beans");
		List<Object> lt0 = g.toBeans(s);
		((TestExcelBean)lt0.get(1)).printest();
		System.out.println(lt0.get(2));
		System.out.println(lt0.get(0));
		
		// Json转后数据类型测试：
		System.out.println("\n----- Json转后数据类型测试");
		s = "[0, 10, \"你好\", true, 3.5, \"2014-1-5\", \"2014\", \"2014-1-5 3:5:35.111\"]";
		lt0 = (List<Object>)g.toObj(s, List.class);
		for (Object o: lt0) {
			System.out.println( o + " , " + o.getClass().getName());
		}

		s = "{a:0, b:10, c:\"你好\", d:true, e:3.5, f:\"2014-1-5\", g:\"2014\", h:\"2014-1-5 3:5:35.111\"}";
		for (Object o: ((Map<String, Object>)g.toObj(s, Map.class)).values()) {
			System.out.println( o + " , " + o.getClass().getName());
		}

		s = "{a:" + (g.objTo(t)) +"}";
//		s = "{\"a\":\"2014-3-15 5:12:4.0\"}";
		System.out.println(s);
		for (Object o: ( (Map<String, Date>)g.toObj(s, new TypeToken<Map<String, Date>>(){}) ).values()) {
			System.out.println( o + " , " + o.getClass().getName());
		}
	}

}
