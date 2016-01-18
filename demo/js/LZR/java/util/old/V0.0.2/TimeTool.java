package lzr.java.util;

import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

/**
 * 时间-常用函数
 * @author F1632393
 *
 */
public class TimeTool {
	/**
	 * 计算两个任意时间中间的间隔天数
	 * @param smallDay 日期1
	 * @param bigDay 日期2
	 * @return 两日期间相差的天数
	 * 2015/1/27 上午9:21:32, F1632393
	 */
	public static int getDaysBetween(Calendar smallDay, Calendar bigDay) {
		/*
		 * if (smallDay.after(bigDay)) { java.util.Calendar swap = smallDay;
		 * smallDay = bigDay; bigDay = swap; }
		 */
		int days = bigDay.get(Calendar.DAY_OF_YEAR)
				- smallDay.get(Calendar.DAY_OF_YEAR);
		int y2 = bigDay.get(Calendar.YEAR);
		if (smallDay.get(Calendar.YEAR) != y2) {
			smallDay = (Calendar) smallDay.clone();
			do {
				days += smallDay.getActualMaximum(Calendar.DAY_OF_YEAR);// 得到当年的实际天数
				smallDay.add(Calendar.YEAR, 1);
			} while (smallDay.get(Calendar.YEAR) != y2);
		}
		return days;
	}

	/**
	 * 解析字符串
	 * @param time 日期字符串
	 * @param format 日期格式
	 * @return Date型日期
	 * 2015/1/27 上午9:21:18, F1632393
	 */
	public static Date parseDate(String time, String format) {
		if (null == time) return null;
		Date date;
		SimpleDateFormat f = new SimpleDateFormat(format, Locale.getDefault());
		try {
			date = f.parse(time);
			return date;
		} catch (ParseException e) {
			return null;
		}
	}

	/**
	 * 解析字符串
	 * @param time 日期字符串
	 * @param format 日期格式
	 * @return Calendar型日期
	 * 2015/1/27 上午9:21:05, F1632393
	 */
	public static Calendar parseTime(String time, String format) {
		Date date = parseDate(time, format);
		if (null == date) {
			return null;
		} else {
			Calendar cal = Calendar.getInstance();
			cal.setTime(date);
			return cal;
		}
	}

	/**
	 * 格式化输出日期
	 * @param d 日期对象
	 * @param format 输出格式
	 * @return 日期字符串
	 */
	public static String dateFormat (Date d, String format) {
		SimpleDateFormat f = new SimpleDateFormat(format, Locale.getDefault());
		return f.format(d);
	}

	 /**
	  * 字符串时间格式转换
	  * @param dateStr
	  * @param oldFormat 旧格式
	  * @param newFormat 新格式
	  * @return 新格式的日期字符串
	  */
	public static String dateStrFormat(String dateStr,String oldFormat,String newFormat){
		  SimpleDateFormat oldFormatter = new SimpleDateFormat(oldFormat);
		  ParsePosition pos = new ParsePosition(0);
		  Date strtodate = oldFormatter.parse(dateStr, pos);
		  SimpleDateFormat newFormatter = new SimpleDateFormat(newFormat);
		  String dateString = newFormatter.format(strtodate);
		  return dateString;
	 }

}
