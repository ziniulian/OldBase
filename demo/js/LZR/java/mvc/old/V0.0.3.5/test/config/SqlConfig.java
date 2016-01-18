package lzr.java.mvc.test.config;

import lzr.java.mvc.bean.annotation.Config;
import lzr.java.mvc.servlet.imp.ComSrvStatue;
import lzr.java.mvc.test.bean.TestOracleBean;

/**
 * SQL 指令集
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/1/30	下午4:08:47
 */
public class SqlConfig {

	// 参数：[成绩：int，性别：{‘M’， ‘F’}]
	@Config(method="qry")
	public static String TEST_ORACLE_QRYSQL_MAP = "select t.classe as Class, max(t.score) as MaxScore from lzr_test t where t.score<? and sex=? group by t.classe";

	// 参数：[时间下限：Date，字串模糊搜索：String，时间上限：Date]
	@Config(method="qry", type=TestOracleBean.class, timeIndex={0,2})
	public static String TEST_ORACLE_QRYSQL_BEAN = "select * from lzr_test where T_TIME>? and T_S like ? and T_TIME<?";

	// 参数：[T_S：String，T_TIME：Date，T_B：boolean]
	@Config(method="exe", timeIndex={1})
	public static String TEST_ORACLE_EXESQL = "insert into lzr_test (T_ID, T_S, T_TIME, T_B) values (SEQ_LZR_TEST.nextval, ?, ?, ?)";

	@Config(method="url")
	public static String TEST_ORACLE_URL = "http://127.0.0.1:8081/MVC/bean";

	@Config(method="fun")
	public static StringBuilder TEST_ORACLE_METHOD (String obj) {
		StringBuilder r = new StringBuilder();
		r.append( ComSrvStatue.LOSE.toJson() );
		r.append(", \r\nopt:\"Hello World! fr:TEST_ORACLE_METHOD ...\"");
		r.append(", \r\nobj:\"");
		r.append(obj);
		r.append("\"");
		return r;
	}

}
