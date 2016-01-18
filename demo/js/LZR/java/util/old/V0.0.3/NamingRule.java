package lzr.java.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * 命名规则转换
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/5/11	下午2:15:21
 */
public class NamingRule {

	private List<char[]> names;

	/**
	 * start 在字符串中的位置
	 */
	public int sid=-1;

	/**
	 * end 在字符串中的位置
	 */
	public int eid=-1;

	public NamingRule (String str, NamingRuleType typ, int offset, char start, char end) {
		names = new ArrayList<char[]>();
		switch (typ) {
			case UM:
			case LM:
				parseM (str.toCharArray(), offset, start, end);
				break;
			case U_:
			case L_:
				parse_ (str.toCharArray(), offset, start, end);
				break;
		}
	}

	public NamingRule (String str, NamingRuleType typ) {
		this(str, typ, 0, '\0', '\0');
	}

	/**
	 * 获取符合命名规则的字串
	 * @param typ 命名规则类型
	 * @return
	 * <br>2015/5/11 下午3:29:20, 子牛连
	 */
	public String getName (NamingRuleType typ) {
		String r = null;
		switch (typ) {
			case UM:
				r = createM(true);
				break;
			case LM:
				r = createM(false);
				break;
			case U_:
				r = create_(true);
				break;
			case L_:
				r = create_(false);
				break;
		}
		return r;
	}

	/**
	 * 解析驼峰型
	 * @param str
	 * <br>2015/5/11 下午4:15:27, 子牛连
	 */
	private void parseM (char[] cs, int offset, char start, char end) {
		int i=offset;
		if (start != '\0') {
			for (; i < cs.length; i++) {
				if (cs[i]==start) {
					sid = i;
					i++;
					break;
				}
			}
			offset = i;
		}
		for (; i < cs.length; i++) {
			if (cs[i] == end) {
				eid = i;
				break;
			} else if (cs[i]>='A' && cs[i]<='Z') {
				subStr(cs, offset, i);
				offset = i;
				cs[i] += 32;
			}
		}
		subStr(cs, offset, i);
	}

	/**
	 * 解析下划线型
	 * @param str
	 * <br>2015/5/12 上午8:19:33, 子牛连
	 */
	private void parse_ (char[] cs, int offset, char start, char end) {
		int i=offset;
		if (start != '\0') {
			for (; i < cs.length; i++) {
				if (cs[i]==start) {
					sid = i;
					i++;
					break;
				}
			}
			offset = i;
		}
		for (; i < cs.length; i++) {
			if (cs[i] == end) {
				eid = i;
				break;
			} else if (cs[i]>='A' && cs[i]<='Z') {
				cs[i] += 32;
			} else if (cs[i] == '_') {
				subStr(cs, offset, i);
				offset = i+1;
			}
		}
		subStr(cs, offset, i);
	}

	/**
	 * 截取字符数组的子数组
	 * @param cs 原始数组
	 * @param start 开始截取的下标
	 * @param end 结束的下标
	 * @return 子数组
	 * <br>2015/5/11 下午5:24:23, 子牛连
	 */
	private void subStr (char[] cs, int start, int end) {
		if (start < end) {
			char[] r = new char[end - start];
			int i=0;
			for (int j=start; j<end; j++) {
				r[i] = cs[j];
				i++;
			}
			this.names.add(r);
		}
	}

	/**
	 * 生成驼峰型
	 * @param firstU 首字母是否大写
	 * @return
	 * <br>2015/5/12 下午2:42:50, 子牛连
	 */
	private String createM (boolean firstU) {
		int n = names.size();
		if (0 == n) {
			return "";
		}
		StringBuilder r = new StringBuilder();
		char[] s = names.get(0).clone();
		if (firstU && s[0]>='a' && s[0]<='z') {
			s[0] -= 32;
		}
		r.append(s);
		for (int i=1; i<n; i++) {
			s = names.get(i).clone();
			if (s[0]>='a' && s[0]<='z') {
				s[0] -= 32;
			}
			r.append(s);
		}
		return r.toString();
	}

	/**
	 * 生成下划线型
	 * @param allU 是否大写
	 * @return
	 * <br>2015/5/12 下午2:42:50, 子牛连
	 */
	private String create_ (boolean allU) {
		int n = names.size();
		if (0 == n) {
			return "";
		}
		StringBuilder r = new StringBuilder();
		r.append(names.get(0).clone());
		for (int i=1; i<n; i++) {
			r.append('_');
			r.append(names.get(i).clone());
		}
		if (allU) {
			return r.toString().toUpperCase(Locale.US);
		} else {
			return r.toString();
		}
	}











	/**
	 * 测试函数
	 * @param args
	 * <br>2015/5/11 下午5:05:27, 子牛连
	 */
	public static void main (String[] args) {
//		System.out.println( new NamingRule("CREATE TABLE `bas_function` (", NamingRuleType.L_, 13, '`', '`').getName(NamingRuleType.UM) );
		String M = "HelloWorld!HowDoYouDo!HowAreYou!";
		NamingRule nrM = new NamingRule(M, NamingRuleType.UM);
//		NamingRule nrM = new NamingRule(M, NamingRuleType.UM, 11, '!', 'u');
		String m = nrM.getName(NamingRuleType.LM);
		String u_ = nrM.getName(NamingRuleType.U_);
		String l_ = nrM.getName(NamingRuleType.L_);

		System.out.println("\nUM：");
		System.out.println("UM：" + nrM.getName(NamingRuleType.UM));
		System.out.println("LM：" + nrM.getName(NamingRuleType.LM));
		System.out.println("U_：" + nrM.getName(NamingRuleType.U_));
		System.out.println("L_：" + nrM.getName(NamingRuleType.L_));

		System.out.println("\nLM：");
		nrM = new NamingRule(m, NamingRuleType.LM);
		System.out.println("UM：" + nrM.getName(NamingRuleType.UM));
		System.out.println("LM：" + nrM.getName(NamingRuleType.LM));
		System.out.println("U_：" + nrM.getName(NamingRuleType.U_));
		System.out.println("L_：" + nrM.getName(NamingRuleType.L_));

		System.out.println("\nU_：");
		nrM = new NamingRule(u_, NamingRuleType.U_);
		System.out.println("UM：" + nrM.getName(NamingRuleType.UM));
		System.out.println("LM：" + nrM.getName(NamingRuleType.LM));
		System.out.println("U_：" + nrM.getName(NamingRuleType.U_));
		System.out.println("L_：" + nrM.getName(NamingRuleType.L_));

		System.out.println("\nL_：");
		nrM = new NamingRule(l_, NamingRuleType.L_);
		System.out.println("UM：" + nrM.getName(NamingRuleType.UM));
		System.out.println("LM：" + nrM.getName(NamingRuleType.LM));
		System.out.println("U_：" + nrM.getName(NamingRuleType.U_));
		System.out.println("L_：" + nrM.getName(NamingRuleType.L_));
	}

}
