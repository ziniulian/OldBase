package lzr.java.util;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public abstract class Subject {
	
	private SubjectUpdater update=null;
	private List<Observer> ls=null;
	private Queue<Object> es=null;
	protected Object oend;
	
	public Subject () {
		ls = new ArrayList<Observer>();
		es = new LinkedList<Object>();
		oend = new Object();
		update = new SubjectUpdater(ls, es, oend);
	}

	public boolean start () {
		es.clear();
		new Thread(update).start();
		return true;
	}
	
	public void stop () {
		synchronized (es) {
			update.end();
			es.notify();
		}
	}
	
	public void update (Object o) {
		synchronized (es) {
			es.offer(o);
			es.notify();
		}
	}
	
	public void addObserver (Observer bl) {
		synchronized (ls) {
			ls.add(bl);
		}
	}

	public void delObserver(Observer bl) {
		synchronized (ls) {
			ls.remove(bl);
		}
	}

}

class SubjectUpdater implements Runnable {

	private List<Observer> ls;
	private Queue<Object> es;
	private Queue<Object> qe;
	private boolean end = false;
	private Object oend;
	
	public SubjectUpdater (List<Observer> listen, Queue<Object> event, Object oend) {
		ls = listen;
		es = event;
		qe = new LinkedList<Object>();
		end = false;
		this.oend = oend;
	}
	
	public void end () {
		end = true;
	}
	
	public void run() {
		//Log.i("lzr_upd", "start");
		end = false;
		while (!end) {
			try {
				synchronized (es) {
					if (es.isEmpty()) es.wait();
					while (!es.isEmpty()) {
						qe.offer(es.poll());
					}
				}
				//Log.i("lzr_upd", "size = "+qe.size());
				synchronized (ls) {
					for (Observer bl:ls) {
						Queue<Object> q = bl.getQueue();
						synchronized (q) {
							for (Object o: qe) {
								q.offer(o);
							}
							q.notify();
						}
					}
					qe.clear();
				}
			} catch (Exception e) {
				e.printStackTrace();
				end = true;
			}
		}
		
		synchronized (oend) {
			oend.notify();
		}
		//Log.i("lzr_upd", "stop");
	}
}
