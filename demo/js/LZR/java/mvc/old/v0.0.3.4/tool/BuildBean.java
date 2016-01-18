package lzr.java.mvc.tool;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.LinkedHashMap;
import java.util.Map;

import lzr.java.mvc.dao.config.DbType;
import lzr.java.util.FileTool;
import lzr.java.util.NamingRule;
import lzr.java.util.NamingRuleType;

/**
 * 生成Bean
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/5/11	上午10:22:40
 */
public class BuildBean {

	public static void main (String[] args) {
		if (args.length < 4) {
			System.out.println("程序结束：缺少文件名。");
		} else {
			try {
				String file, dir, packName;
				DbType dbtyp = DbType.getDbTypeByName(args[0]);
				NamingRuleType nrt = NamingRuleType.valueOf(args[1]);

				packName = args[2];
				file = args[3];
				if (args.length == 4) {
					dir = System.getProperty("user.dir") + "\\";
				} else {
					dir = args[4];
				}

				switch (dbtyp) {
					case MYSQL:
						buildBeanByMySql (dir + file, dir, nrt, packName);
						break;
					default:
						System.out.println("程序结束：不支持数据库类型：" + dbtyp);
						break;
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * 生成 Bean文件
	 * @param dir Bean文件存放路径
	 * @param tabName 数据库表名
	 * @param mf Bean属性集合
	 * @param nrt 数据库表名的命名规则
	 * @param memo 表备注
	 * @param packName 包名
	 * @param importTyp 需导入的类型
	 * @throws Exception
	 * <br>2015/5/14 下午3:04:31, 子牛连
	 */
	private static void buildBeanFile (	String dir, 
										NamingRule tabName, 
										Map<String, BuildBeanField> mf, 
										NamingRuleType nrt, 
										String memo, 
										String packName, 
										int importTyp) throws Exception
	{
		String name = tabName.getName(NamingRuleType.UM);
		File f = FileTool.mkFile(dir + name + ".java");
		BufferedWriter fw = new BufferedWriter( new OutputStreamWriter(new FileOutputStream(f), "UTF-8") ); 
		try {
			fw.write("package ");
			fw.write(packName);
			fw.write(";\r\n");
			fw.write("\r\n");
			if ( (importTyp & 1) == 1 ) {
				fw.write("import java.sql.Timestamp;\r\n");
			}
			if ( (importTyp & 2) == 2 ) {
				fw.write("import java.sql.Date;\r\n");
			}
			if ( (importTyp & 4) == 4 ) {
				fw.write("import java.sql.Time;\r\n");
			}
			fw.write("\r\n");
			fw.write("import lzr.java.mvc.bean.annotation.Table;\r\n");
			fw.write("import lzr.java.mvc.bean.annotation.Id;\r\n");
			fw.write("import lzr.java.mvc.bean.annotation.Column;\r\n");
			fw.write("\r\n");
			fw.write("// ");
			fw.write(memo);
			fw.write("\r\n");
			fw.write("@Table(name=\"");
			fw.write(tabName.getName(nrt));
			fw.write("\")\r\n");
			fw.write("public class ");
			fw.write(name);
			fw.write(" {\r\n");

			for (BuildBeanField bf : mf.values()) {
				fw.write(bf.src().toString());
			}

			fw.write("\r\n}");
			System.out.println(importTyp + " - 已生成文件：" + name);
		} catch (Exception e) {
			throw e;
		} finally {
			fw.close();
		}
	}

	/**
	 * MySQL 数据库转换
	 * @param sqlFile sql文件路径
	 * @param dir Bean文件存放路径
	 * @param nrt 数据库表名和栏位名的命名规则
	 * @param packName 包名
	 * @throws Exception
	 * <br>2015/5/14 下午3:05:37, 子牛连
	 */
	private static void buildBeanByMySql (String sqlFile, String dir, NamingRuleType nrt, String packName) throws Exception {
		BufferedReader br=new BufferedReader(new InputStreamReader(new FileInputStream(sqlFile), "UTF-8"));  
		try {
			String s;

			while ((s = br.readLine()) != null) {
				if (s.startsWith("CREATE")) {
					// 需导入的类型
					int importTyp = 0;

					// Bean 属性集合
					Map<String, BuildBeanField> mf = new LinkedHashMap<String, BuildBeanField>();

					// 表名
					NamingRule tabName = new NamingRule(s, nrt, 13, '`', '`');
					while (!(s = br.readLine()).startsWith(")")) {
						switch (s.charAt(2)) {
							case '`':
								BuildBeanField f = new BuildBeanField();
								int fr = buildBeanFieldByMySql(s, nrt, f);
								if (null != f.getType()) {
									importTyp |= fr;
									mf.put(f.getTabName(), f);
								}
								break;
							case 'P':
								for (String p : s.split(",")) {
									p = new NamingRule(p, nrt, 0, '`', '`').getName(nrt);
									mf.get(p).setId();
								}
								break;
							case 'U':
								mf.get( new NamingRule(s, nrt, s.indexOf("("), '`', '`').getName(nrt) ).setUnique();
								break;
						}
					}
					int i = s.indexOf("COMMENT=");
					String memo = "";
					if (i != -1) {
						memo = s.substring(i+8);
					}
					buildBeanFile(dir, tabName, mf, nrt, memo, packName, importTyp);
				}
			}
		} catch (Exception e) {
			throw e;
		} finally {
			br.close();
		}
	}

	/**
	 * MySQL 生成 Bean 属性
	 * @param str sql栏位指令
	 * @param nrt 数据库栏位名命名规则
	 * @param f 返回值，生成的 Bean 属性
	 * @return 返回需导入的类型
	 * <br>2015/5/14 下午3:06:31, 子牛连
	 */
	private static int buildBeanFieldByMySql (String str, NamingRuleType nrt, BuildBeanField f) {
		int importTyp = 0;
		NamingRule name = new NamingRule(str, nrt, 0, '`', '`');
		String[] a = str.substring(name.eid + 2).split(" ");
		String s = name.getName(nrt);

		// 设置名称
		f.setTabName(s);
		f.setName(name.getName(NamingRuleType.LM));

		// 设置数据类型
		int i = 0;
		if (a[i].startsWith("int")) {
			f.setType("Integer");
		} else if (a[i].startsWith("varchar")) {
			f.setType("String");
		} else if (a[i].startsWith("datetime")) {
			importTyp = 1;
			f.setType("Timestamp");
		} else if (a[i].startsWith("date")) {
			importTyp = 2;
			f.setType("Date");
		} else if (a[i].startsWith("decimal")) {
			f.setType("Double");
		} else if (a[i].startsWith("time")) {
			importTyp = 4;
			f.setType("Time");
		} else {
			System.out.println("忽略属性：" + s + "。因为没有匹配的数据类型，" + str);
		}

		// 设置其他属性
		i++;
		if (a[i].startsWith("NOT")) {
			f.setNullable();
		}
		if (a.length > i+2) {
			i+=2;
			if (a[i].startsWith("AUTO_I")) {
				f.setInsertable();
				f.setUpdatable();
				if (a.length > i+1) {
					i++;
				}
			}
			if ( a[i].startsWith("COMM") ) {
				f.setMemo(a[i+1]);
			}
		}

		return importTyp;
	}

}
