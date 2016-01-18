package lzr.java.util;

import java.util.LinkedList;
import java.util.Queue;

public abstract class Observer implements Runnable {

	private Queue<Object> es;
	private Queue<Object> qe;
	boolean end = true;
	private Subject sub;
	
	public Observer (Subject sub) {
		this.sub = sub;
		this.es = new LinkedList<Object>();
		this.qe = new LinkedList<Object>();
		this.end = true;
	}
	
	public abstract boolean update (Object o);
	
	public Queue<Object> getQueue() {
		return es;
	}
	
	public boolean start() {
		if (end) {
			end = false;
			new Thread(this).start();
			sub.addObserver(this);
			return true;
		} else {
			return false;
		}
	}

	public void stop() {
		synchronized (es) {
			end = true;
			es.clear();
			qe.clear();
			es.notify();
		}
		sub.delObserver(this);
	}
	
	public boolean isRun () {
		return !end;
	}
	
	public void run() {
		//Log.i("lzr_obs", "start");
		while (!end) {
			try {
				synchronized (es) {
					if (es.isEmpty()) es.wait();
					while (!es.isEmpty()) {
						//Log.i("lzr_ob", "...es");
						qe.offer(es.poll());
					}
				}
				while (!qe.isEmpty()) {
					//Log.i("lzr_ob", "...qe");
					if (update(qe.poll())) {
						end = true;
						break;
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
				end = true;
			}
		}
		stop();
		//Log.i("lzr_obs", "end");
	}
}
