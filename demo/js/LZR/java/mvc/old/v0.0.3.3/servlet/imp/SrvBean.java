package lzr.java.mvc.servlet.imp;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import lzr.java.mvc.dao.bean.BeanObj;

/**
 * Bean服务
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/4/21	上午8:43:20
 */
public class SrvBean implements InfSrv {

	/**
	 * JSON形对象
	 */
	private String obj;

	/**
	 * JSON形操作
	 */
	private String opt;

	/**
	 * 可用方法范围：qry（查询）, del（删除）, sav（保存）, ins（新增）, upd（修改）
	 */
	private String methodRange="qry,del,sav,ins,upd";

	public SrvBean() {}

	public SrvBean(String opt, String obj) {
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
	public SrvBean setOpt(String opt) {
		this.opt = opt;
		return this;
	}

	/**
	 * 设置对象
	 * @param obj 对象
	 * @return this
	 * <br>2015/4/21 上午11:10:19, 子牛连
	 */
	public SrvBean setObj(String obj) {
		this.obj = obj;
		return this;
	}

	/**
	 * 设置可用方法范围
	 * @param methods 方法范围
	 * @return this
	 * <br>2015/4/21 上午10:35:13, 子牛连
	 */
	public SrvBean setMethodRange(String methods) {
		this.methodRange = methods;
		return this;
	}

	/**
	 * 解析Bean
	 * @param json JSON字符串
	 * @param typ 类型
	 * @return Bean对象
	 * @throws ClassNotFoundException
	 * <br>2015/4/7 下午5:22:42, 子牛连
	 */
	private List<Object> parseBean(String json, String typ) throws ClassNotFoundException {
		List<Object> r = new ArrayList<Object>();
		if (null == typ) {
			try {
				r.add( Ctrl.json.toBean(json) );
			} catch (Exception e) {
				r = Ctrl.json.toBeans(json);
			}
		} else {
			// 修复缺省包名的类名
			typ = Ctrl.jsonToClassName(typ, Ctrl.beanPack);
			r.add( Ctrl.json.toObj(json, typ) );
		}
		if (1 == r.size()) {
			r.add(null);
		}
		return r;
	}

	@Override
	public StringBuilder srvMain(String opt, String obj) {
		/**
		 * 参数说明：
		 * 	obj：Bean对象
		 * 	opt：{
		 * 		back：回调信息，
		 * 		method：操作方法（sav、del、qry），
		 * 		class：类型
		 * 	}
		 * 
		 * 返回值：
		 * 	{
		 * 		statue：服务状态，
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
				if (null == obj) throw new Exception("缺少对象（obj）。");
				Map<String, Object> mp = Ctrl.json.toMap(opt);
				String c = (String) mp.get("class");
				String m = (String) mp.get("method");
				List<Object> beans = parseBean(obj, c);
				r = dbHandle (m, beans.get(0), beans.get(1) );
				ComSrvReturn.callback(r, (String) mp.get("back"));
			}
		} catch (Exception e) {
			r = ComSrvReturn.exception(e);
		}
		return r;
	}

	/**
	 * 数据库操作处理
	 * @param method 数据库操作方法
	 * @param bean
	 * @param condition upd 的查询条件
	 * @return 操作结果
	 * @throws Exception
	 * <br>2015/5/6 上午9:23:17, 子牛连
	 */
	private StringBuilder dbHandle (String method, Object bean, Object condition) throws Exception {
		StringBuilder r;

		if (methodRange.indexOf(method) == -1) {
			r = ComSrvReturn.methodError();
		} else {
			BeanObj bo = new BeanObj(bean);
			List<Object> prm = new ArrayList<Object>();
			String sql = null;

//System.out.println (bo.getClass().getName());
			if (method.equals("sav")) {
				sql = bo.getSaveSql(prm);
			} else if (method.equals("del")) {
				sql = bo.getDeleteSql(prm);
			} else if (method.equals("ins")) {
				sql = bo.getInsertSql(prm);
			} else if (method.equals("upd")) {
				sql = bo.getUpdateSql(condition, prm);
			}

			if (null != sql) {
//System.out.println (sql);
//System.out.println (prm.size());
				r = ComSrvReturn.exeSql(sql, prm.toArray());
			} else if (method.equals("qry")) {
				sql = bo.getQuerySql(prm);
//System.out.println (sql);
//System.out.println (prm.size());
				r = ComSrvReturn.qrySqlBeans(bo, sql, prm.toArray());
			} else {
				r = ComSrvReturn.methodError();
			}
		}

		return r;
	}

}
