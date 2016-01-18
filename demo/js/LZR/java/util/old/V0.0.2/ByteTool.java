package lzr.java.util;

import java.io.IOException;
import java.io.InputStream;

/**
 * 字节-常用函数
 */
public class ByteTool {
	/**
	 * 整数到字节数组的转换
	 * @param number 整数
	 * @return 字节数组
	 */
	public static byte[] intToByte(int number) {
		int temp = number;
		byte[] b = new byte[4];
		//for (int i=b.length-1;i>-1;i--){
		for (int i=0; i<4; i++){
			b[i] = Integer.valueOf(temp & 0xff).byteValue(); //将最高位保存在最低位
			temp = temp >> 8; //向右移8位
		}
		return b;
	}

	/**
	 * 字节数组到整数的转换
	 * @param b 字节数组
	 * @return 整数
	 */
	public static int byteToInt(byte[] b) {
		int s = 0;
		//for (int i = 0; i < 3; i++) {
		for (int i = 3; i > 0; i--) {
			if (b[i] >= 0)
			s = s + b[i];
			else
			s = s + 256 + b[i];  //此处可以使用mod 256来省去if判断
			s = s * 256;
		}
		/*
		if (b[3] >= 0) //最后一个之所以不乘，是因为可能会溢出
		s = s + b[3];
		else
		s = s + 256 + b[3];  //同上
		*/
		if (b[0] >= 0) //最后一个之所以不乘，是因为可能会溢出
			s = s + b[0];
		else
			s = s + 256 + b[0];  //同上
		
		return s;
	}

	/**
	 * 从输入流中读取一个整型
	 * @param is 输入流
	 * @return 一个整数
	 */
	public static int readInt (InputStream is) {
		byte[] buf = new byte[4];
		try {
			is.read(buf);
			return byteToInt(buf);
		} catch (IOException e) {
			e.printStackTrace();
			return 0;
		}
	}

	/**
	 * 字符到字节转换
	 * @param ch 字符
	 * @return 字节数组
	 */
	public static byte[] charToByte(char ch){
		int temp=(int)ch;
		byte[] b=new byte[2];
		for (int i=b.length-1;i>-1;i--){
			b[i] = Integer.valueOf(temp & 0xff).byteValue(); //将最高位保存在最低位
			temp = temp >> 8;  //向右移8位
		}
		return b;
	}

	/**
	 * 字节到字符转换
	 * @param b 字节数组
	 * @return 字符
	 */
	public static char byteToChar(byte[] b){
		int s=0;
		if(b[0]>0)
		s+=b[0];
		else
		s+=256+b[0];
		s*=256;
		if(b[1]>0)
		s+=b[1];
		else
		s+=256+b[1];
		char ch=(char)s;
		return ch;
	}

	/**
	 * 浮点到字节转换
	 * @param d 浮点数
	 * @return 字节数组
	 */
	public static byte[] doubleToByte(double d){
		byte[] b=new byte[8];
		long l=Double.doubleToLongBits(d);
		for(int i=0;i < 8;i++){
			b[i]=Long.valueOf(l).byteValue();
			l=l>>8;
		}
		return b;
	}

	/**
	 * 字节到浮点转换
	 * @param b 字节数组
	 * @return 浮点数
	 */
	public static double byteToDouble(byte[] b){
		long l;
		l=b[0];
		l&=0xff;
		l|=((long)b[1]<<8);
		l&=0xffff;
		l|=((long)b[2]<<16);
		l&=0xffffff;
		l|=((long)b[3]<<24);
		l&=0xffffffffl;
		l|=((long)b[4]<<32);
		l&=0xffffffffffl;
		l|=((long)b[5]<<40);
		l&=0xffffffffffffl;
		l|=((long)b[6]<<48);
		l&=0xffffffffffffffl;
		l|=((long)b[7]<<56);
		return Double.longBitsToDouble(l);
	}

	/**
	 * 从输入流中读取一个小数
	 * @param is 输入流
	 * @return 一个小数
	 * 2015/1/27 上午11:06:06, F1632393
	 */
	public static double readDouble (InputStream is) {
		byte[] buf = new byte[8];
		try {
			is.read(buf);
			return byteToDouble(buf);
		} catch (IOException e) {
			e.printStackTrace();
			return 0;
		}
	}

	/**
	 * 合并字节数组
	 * @param bs 若干个字节数组
	 * @return 合并后的字节数组
	 */
	public static byte[] merger (byte[]... bs) {
		int i = 0;
		for (byte[] b : bs) {
			i += b.length;
		}
		
		byte[] s = new byte[i];
		i = 0;
		for (byte[] b : bs) {
			for (byte e : b) {
				s[i] = e;
				i++;
			}
		}
		return s;
	}
}
