package lzr.java.mvc.servlet.imp;

import java.util.List;

import lzr.java.mvc.dao.bean.BeanObj;


/**
 * 服务的通用返回样式
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/4/24	上午10:43:14
 */
public class ComSrvReturn {

	/**
	 * 异常返回
	 * @param exception 异常
	 * @return 返回信息
	 * <br>2015/4/24 上午10:59:47, 子牛连
	 */
	public static StringBuilder exception (Exception exception) {
//exception.printStackTrace();
		StringBuilder r = new StringBuilder();
		r.append(ComSrvStatue.LOSE.toJson());
		r.append(", \"memo\":\"");
		r.append(exception.getMessage());
		r.append('\"');
		return r;
	}

	/**
	 * 方法错误
	 * @return
	 * <br>2015/4/24 上午11:03:18, 子牛连
	 */
	public static StringBuilder methodError () {
		StringBuilder r = new StringBuilder();
		r.append(ComSrvStatue.LOSE.toJson());
		r.append(", \"memo\":\"方法匹配失败。\"");
		return r;
	}

	/**
	 * 追加回调信息
	 * @param r 返回信息
	 * @param back 回调信息
	 * <br>2015/4/24 上午11:03:32, 子牛连
	 */
	public static void callback (StringBuilder r, Object back) {
		if (null != back) {
			r.append(", \"back\":");
			r.append(Ctrl.json.objTo(back));
		}
	}

	/**
	 * SQL执行
	 * @param sql SQL语句
	 * @param prm SQL参数
	 * @return
	 * @throws Exception
	 * <br>2015/4/24 上午11:04:12, 子牛连
	 */
	public static StringBuilder exeSql (String sql, Object[] prm) throws Exception {
		StringBuilder r = new StringBuilder();
		Ctrl.dao.open();
		int n = Ctrl.dao.exe(sql, prm);
		r.append(ComSrvStatue.SUCCESS.toJson());
		r.append(", \"memo\":\"共变更了 ");
		r.append(n);
		r.append(" 条记录。\", \"obj\":");
		r.append(n);
		Ctrl.dao.close();
		return r;
	}

	/**
	 * SQL查询，返回 Beans
	 * @param bo Bean实体
	 * @param sql SQL语句
	 * @param prm SQL参数
	 * @return
	 * @throws Exception
	 * <br>2015/4/24 上午11:04:54, 子牛连
	 */
	public static StringBuilder qrySqlBeans (BeanObj bo, String sql, Object[] prm) throws Exception {
		StringBuilder r = new StringBuilder();
		Ctrl.dao.open();
		List<Object> ms = bo.rsToBeans(Ctrl.dao.qryRs(sql, prm), true);
		r.append(ComSrvStatue.SUCCESS.toJson());
		r.append(", \"obj\":");
		r.append(Ctrl.json.beansTo(ms));
		Ctrl.dao.close();
		return r;
	}

	/**
	 * SQL查询，返回 Maps
	 * @param sql SQL语句
	 * @param prm SQL参数
	 * @return
	 * @throws Exception
	 * <br>2015/4/24 上午11:05:52, 子牛连
	 */
	public static StringBuilder qrySqlMaps (String sql, Object[] prm) throws Exception {
		StringBuilder r = new StringBuilder();
		Ctrl.dao.open();
		r.append(ComSrvStatue.SUCCESS.toJson());
		r.append(", \"obj\":");
		r.append(Ctrl.json.mapsTo( Ctrl.dao.qry(sql, prm) ));
		Ctrl.dao.close();
		return r;
	}

}
