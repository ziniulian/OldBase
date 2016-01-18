package lzr.java.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

/**
 * 读取配置文件
 */
public class SettingFile {
	private Map<String, String> pros;
	private File f=null;
	
	/**
	 * 改造函数
	 * @param file  配置文件路径
	 */
	public SettingFile (String file) {
		pros = new HashMap<String ,String>();
		init (file);
	}
	
	/**
	 * 初始化，读取配置文件
	 * @param file 配置文件路径
	 */
	private void init (String file) {
		f = FileTool.mkFile(file);
		try {
			FileReader fr = new FileReader(f);
			BufferedReader br = new BufferedReader(fr);
			String s = null;
			while ((s = br.readLine()) != null) {
				s.trim();
				if (s.length()==0 || s.startsWith("#")) continue;
				int i = s.indexOf(":");
				if(i>0) {
					String key  = s.substring(0, i).trim();
					String value = s.substring(i+1).trim();
					
					if (value.startsWith("{")) {
						value = value.substring(1);
						StringBuilder sb = new StringBuilder();
						while (null!=value) {
							value.trim();
							if (value.endsWith("}")) {
								if (value.length()==1) {
									int l = sb.length();
									if (l>0) {
										sb.delete(l-1, l);
									}
								} else {
									sb.append(value.substring(0, (value.length()-1)).trim());
								}
								value = null;
								break;
							} else if (value.length() > 0) {
								sb.append(value);
								sb.append('\n');
							}
							value = br.readLine();
						}
						value = sb.toString();
					}
					
					//Loog.i(key + "<-:->" + value);
					pros.put(key, value);
				}
			}
			
			br.close();
			fr.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 获取一个值 By 键
	 * @param key 键
	 * @return 键所对应的值
	 */
	public String get(String key) {
		return pros.get(key);
	}
	
	/**
	 * 保存一个值 By 键
	 * @param key 键
	 * @param value 键所对应的值
	 */
	public void set(String key, String value) {
		pros.put(key, value);
	}
	
	/**
	 * 保存配置文件
	 */
	public void save () {
		FileWriter fw = null;
		try {
			fw = new FileWriter(f, false);
			for (Entry<String, String> entry: pros.entrySet()) {
				fw.write(entry.getKey()+":");
				String s = entry.getValue();
				if (-1 == s.indexOf('\n')) {
					fw.write(s + '\n');
				} else {
					fw.write("{\n" + s + "\n}\n");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				fw.close();
			} catch (Exception e) {}
		}
	}
}
