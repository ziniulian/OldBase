package lzr.java.util.tmp;

import lzr.java.util.Inf.InfCallback;

/**
 * 线程-常用函数
 */
public class ThreadTool {
	/**
	 * 创建一个线程并同步执行。
	 * @param outtime 超时毫秒数
	 * @param cb 线程执行的功能函数
	 * @return 返回超时后仍无法结束的线程
	 */
	public static Thread create (long outtime, final InfCallback cb) {
		/*
		 * 优化：将参数 InfCallback 改为 Method + args
		 */
		try {
			Thread t = new Thread(new Runnable() {
				public void run() {
					cb.callback(null);
				}
			});
			t.start();
			if (-1 == outtime) t.join();
			else if (outtime > 0) {
				t.join(outtime);
				if (t.isAlive()) return t;
			}
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return null;
	}
}
