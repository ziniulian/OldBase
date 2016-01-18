package lzr.java.mvc.servlet.imp;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import lzr.java.mvc.bean.annotation.Config;
import lzr.java.mvc.dao.bean.BeanObj;
import lzr.java.util.TimeTool;
import lzr.java.util.tmp.SimpleHttpRequest;

/**
 * SQLConfig服务
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/4/21	下午1:34:20
 */
public class SrvConfig implements InfSrv {

	/**
	 * JSON形对象
	 */
	private String obj;

	/**
	 * JSON形操作
	 */
	private String opt;

	/**
	 * 默认包名
	 */
	private String defaultPackageName = Ctrl.configPack;

	/**
	 * 默认类名
	 */
	private String defaultClassName = Ctrl.configClass;

	/**
	 * 默认方法
	 */
	private String defaultMethod = "qry";

	/**
	 * 实际执行的方法
	 */
	private String method;

	/**
	 * 可用方法范围：qry（执行SQL的查询方法）, exe（执行SQL的更新方法）, url（返回URL请求结果）, fun（执行函数运行结果。Config 统一方法样式：StringBuilder function(String obj);）
	 */
	private String methodRange="qry,exe,url,fun";

	public SrvConfig() {}

	public SrvConfig(String opt, String obj) {
		this.opt = opt;
		this.obj = obj;
	}

	public StringBuilder srvMain() {
		return srvMain(opt, obj);
	}

	/**
	 * 设置操作
	 * @param opt 操作
	 * @return this
	 * <br>2015/4/21 上午11:10:24, 子牛连
	 */
	public SrvConfig setOpt(String opt) {
		this.opt = opt;
		return this;
	}

	/**
	 * 设置对象
	 * @param obj 对象
	 * @return this
	 * <br>2015/4/21 上午11:10:19, 子牛连
	 */
	public SrvConfig setObj(String obj) {
		this.obj = obj;
		return this;
	}

	/**
	 * 设置可用方法范围
	 * @param methods 方法范围
	 * @return this
	 * <br>2015/4/21 上午10:35:13, 子牛连
	 */
	public SrvConfig setMethodRange(String methods) {
		this.methodRange = methods;
		return this;
	}

	/**
	 * 设置默认包名
	 * @param defaultPackageName
	 * @return
	 * <br>2015/4/21 下午2:15:12, 子牛连
	 */
	public SrvConfig setDefaultPackageName(String defaultPackageName) {
		this.defaultPackageName = defaultPackageName;
		return this;
	}

	/**
	 * 设置默认类名
	 * @param defaultClassName 默认类名（完整名称）
	 * @return
	 * <br>2015/4/21 下午2:15:38, 子牛连
	 */
	public SrvConfig setDefaultClassName(String defaultClassName) {
		this.defaultClassName = defaultClassName;
		return this;
	}

	/**
	 * 获取实际执行的方法
	 * @return
	 * <br>2015/4/25 下午2:13:27, 子牛连
	 */
	public String getMethod() {
		return method;
	}

	@Override
	public StringBuilder srvMain(String opt, String obj) {
		/**
		 * 参数说明：
		 * obj：SQL参数 （数组形式）
		 * opt：{
		 * 		back：回调信息，
		 * 		con：SQLConfig常量名，
		 * 		class：常量所在的类（省略将使用默认类名）
		 * }
		 * 
		 * 返回值：
		 * 	{
		 * 		statue：服务状态（0：成功，非零：失败），
		 * 		memo：备注，
		 * 		obj：结果，
		 * 		back：回调信息
		 * 	}
		 */
		StringBuilder r;	// 返回值
		try {
			if (null == opt) {
				throw new Exception("缺少操作信息（opt）。");
			} else {
				Map<String, Object> mp = Ctrl.json.toMap(opt);
				String con = (String) mp.get("con");
				if (null == con) throw new Exception("操作缺少常量名（con）。");
				String c = (String) mp.get("class");
				if (null == c) {
					c = defaultClassName;
				} else {
					c = Ctrl.jsonToClassName(c, defaultPackageName);
				}
				r = handle ( c, con, obj );
				ComSrvReturn.callback(r, mp.get("back"));
			}
		} catch (Exception e) {
			r = ComSrvReturn.exception(e);
		}
		return r;
	}

	/**
	 * 常量操作处理
	 * @param className 类名
	 * @param coname 常量名
	 * @param obj 参数
	 * @return 操作结果
	 * <br>2015/4/21 下午2:47:49, 子牛连
	 * @throws Exception 
	 */
	private StringBuilder handle (String className, String coname, String obj) throws Exception {
		StringBuilder r;

		List<Object> conObj = new ArrayList<Object>();
		method = parseCon(className, coname, conObj);
		if (null==method || methodRange.indexOf(method) == -1) {
			r = ComSrvReturn.methodError();
		} else {
			if (method.equals("fun")) {
				Method m = (Method)conObj.get(0);
				if (Modifier.isStatic(m.getModifiers())) {
					r = (StringBuilder) m.invoke(null, obj);
				} else {
					r = (StringBuilder) m.invoke( Class.forName(className).newInstance(), obj );
				}
			} else {
				String con = (String)conObj.get(0);
				if (method.equals("url")) {
					SimpleHttpRequest sr = new SimpleHttpRequest(con);
					sr.setData( parseUrlObj(obj) );
					r = sr.doPost(false);
				} else {
					Object[] lo = parseObj(obj, (int[])conObj.get(2));
					if (method.equals("qry")) {
						Class<?> typ = (Class<?>)conObj.get(1);
						if (typ.equals(Config.class)) {
							r = ComSrvReturn.qrySqlMaps(con, lo);
						} else {
							r = ComSrvReturn.qrySqlBeans(new BeanObj(typ), con, lo);
						}
					} else if (method.equals("exe")) {
						r = ComSrvReturn.exeSql(con, lo);
					} else {
						r = ComSrvReturn.methodError();
					}
				}
			}
		}

		return r;
	}

	/**
	 * 解析 Config常量值（获得方法以及常量值）
	 * @param className 常量所属的类
	 * @param coname 常量名
	 * @param conObj 返回值
	 * @return 操作方法
	 * @throws Exception
	 * <br>2015/4/24 上午10:04:00, 子牛连
	 */
	private String parseCon (String className, String coname, List<Object> conObj) throws Exception {
		Class<?> c = Class.forName(className);
		try {
			Field f = c.getDeclaredField(coname);
			f.setAccessible(true);
			if (Modifier.isStatic(f.getModifiers())) {
				conObj.add( f.get(null) );
			} else {
				conObj.add( f.get(c.newInstance()) );
			}

			Config cf = f.getAnnotation(Config.class);
			if (null == cf) {
				return defaultMethod;
			} else {
				conObj.add( cf.type() );
				conObj.add( cf.timeIndex() );
				return cf.method();
			}
		} catch (NoSuchFieldException e) {
			// 不存在常量名对应的属性
			try {
				// 常量名对应函数固定参数类型为：StringBuilder function(String obj);
				Method m = c.getDeclaredMethod(coname, String.class);
				if (null == m.getAnnotation(Config.class)) {
					return null;
				} else {
					conObj.add( m );
					return "fun";
				}
			} catch (NoSuchMethodException e1) {
				return null;
			}
		}
	}

	/**
	 * 解析 SQLConfig obj
	 * @param obj SQL参数
	 * @param times SQL参数中的时间类型位置
	 * @return
	 * <br>2015/4/24 下午1:50:03, 子牛连
	 */
	private Object[] parseObj (String obj, int[] times) {
		Object[] lo = ((List<?>)Ctrl.json.toObj(obj, List.class)).toArray();
		for (int i : times) {
			String t = (String) lo[i];
			lo[i] = new Timestamp(TimeTool.parseDate(t, Ctrl.timeFormat).getTime());
		}
		return lo;
	}

	/**
	 * 解析 URL obj
	 * @param obj
	 * @return
	 * <br>2015/5/18 上午11:41:09, 子牛连
	 */
	private Map<String, String> parseUrlObj (String obj) {
		Map<String, String> r = new LinkedHashMap<String, String>();
		for (Map.Entry<String, Object> entry : Ctrl.json.toMap(obj).entrySet()) {
			r.put(entry.getKey(), Ctrl.json.objTo(entry.getValue()));
		}
		return r;
	}

}
