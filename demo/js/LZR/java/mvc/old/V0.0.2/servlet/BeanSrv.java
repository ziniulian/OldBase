package lzr.java.mvc.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lzr.java.mvc.dao.bean.BeanObj;

/**
 * Bean服务接口
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/4/7	上午11:37:14
 */
public class BeanSrv extends HttpServlet {

	private static final long serialVersionUID = 1L;

	public void service (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");
		PrintWriter out = response.getWriter();

		out.print('{');
		out.print( srvBean(request.getParameter("opt"), request.getParameter("obj")) );
		out.print('}');
	}

	/**
	 * Bean服务接口主函数
	 * @param opt 数据操作信息
	 * @param obj Bean对象
	 * @return JSON
	 * <br>2015/4/13 上午9:55:00, 子牛连
	 */
	private StringBuilder srvBean (String opt, String obj) {
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
				r = dbHandel (m, parseBean(obj, c) );
				String back = (String) mp.get("back");
				if (null != back) {
					r.append(", back:\"");
					r.append(back);
					r.append('\"');
				}
			}
		} catch (Exception e) {
//e.printStackTrace();
			r = new StringBuilder();
			r.append(SrvStatue.LOSE.toJson());
			r.append(", memo:\"");
			r.append(e.getMessage());
			r.append('\"');
		}
		return r;
	}

	/**
	 * 解析Bean
	 * @param json JSON字符串
	 * @param typ 类型
	 * @return Bean对象
	 * @throws ClassNotFoundException
	 * <br>2015/4/7 下午5:22:42, 子牛连
	 */
	private Object parseBean(String json, String typ) throws ClassNotFoundException {
		if (null == typ) {
			return Ctrl.json.toBean(json);
		} else {
			return Ctrl.json.toObj(json, typ);
		}
	}

	/**
	 * 数据库操作处理
	 * @param method 数据库操作方法
	 * @param bean
	 * @return 操作结果
	 * @throws Exception
	 * <br>2015/4/9 上午10:48:00, 子牛连
	 */
	private StringBuilder dbHandel (String method, Object bean) throws Exception {
		BeanObj bo = new BeanObj(bean);
		List<Object> prm = new ArrayList<Object>();
		String sql = null;
		StringBuilder r = new StringBuilder();
		Ctrl.dao.open();

//System.out.println (bo.getClass().getName());
		if (method.equals("sav") || method.equals("del")) {
			sql = bo.getSaveSql(prm);
//System.out.println (sql);
//System.out.println (prm.size());
			int n = Ctrl.dao.exe(sql, prm.toArray());
			r.append(SrvStatue.SUCCESS.toJson());
			r.append(", memo:\"共变更了 ");
			r.append(n);
			r.append(" 条记录。\", obj:");
			r.append(n);
		} else if (method.equals("qry")) {
			sql = bo.getQuerySql(prm);
//System.out.println (sql);
//System.out.println (prm.size());
			List<Object> ms = bo.rsToBeans(Ctrl.dao.qryRs(sql, prm.toArray()), true);
			r.append(SrvStatue.SUCCESS.toJson());
			r.append(", obj:");
			r.append(Ctrl.json.beansTo(ms));
		} else {
			r.append(SrvStatue.LOSE.toJson());
			r.append(", memo:\"缺少正确的操作方法。\"");
		}

		Ctrl.dao.close();
		return r;
	}
}

