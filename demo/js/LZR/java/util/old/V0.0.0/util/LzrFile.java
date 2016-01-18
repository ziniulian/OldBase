package lzr.java.util;

import java.io.File;

/**
 * 文件-常用函数
 */
public class LzrFile {
	/**
	 * 获取文件后缀名
	 * @param filepath 文件路径
	 * @return 文件后缀
	 */
	public static String getExt (String filepath) {
		File file = new File(filepath);
		String name = file.getName();
		int i = name.lastIndexOf(".")+1;
		if (0 == i) {
			return "";
		} else {
			return name.substring(i);
		}
	}
	
	/**
	 * 创建文件夹
	 * @param path 路径
	 * @return 文件夹
	 */
	public static File mkDir (String path) {
		File dir = new File (path);
		if (!dir.exists()) {
			if (!dir.mkdirs()) dir=null;
		}
		return dir;
	}
	
	/**
	 * 创建文件
	 * @param path 文件路径
	 * @return 文件
	 */
	public static File mkFile (String path) {
		File f = new File (path);
		if (!f.exists()) {
			try {
				f.createNewFile();
			} catch (Exception e) {
				f = null;
			}
		}
		return f;
	}
	
	/**
	 * 判斷文件是否存在
	 * @param path 文件路径
	 * @return 是否存在
	 */
	public static File hasFile (String path) {
		File f = new File (path);
		if (!f.exists()) f=null;
		return f;
	}
	
	/**
	 * 獲取文件的目錄
	 * @param path 文件路径
	 * @return 路径
	 */
	public static String getDir (String path) {
		int i = path.lastIndexOf("/");
		if (-1 == i) i = path.lastIndexOf("\\");
		if (i<1) return "";
		return path.substring(0, i+1);
	}
	
}
