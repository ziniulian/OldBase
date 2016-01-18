package lzr.java.util.tmp;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.Socket;
import java.net.URLEncoder;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 简单的HTTP请求
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/4/24	下午2:06:25
 */
public class SimpleHttpRequest {

	/**
	 * 套接字
	 */
	private Socket socket;

	/**
	 * 输入流
	 */
	private BufferedReader br;

	/**
	 * 输出流
	 */
	private OutputStream out;

	/**
	 * HTTP协议名
	 */
	private String http;

	/**
	 * IP/域名
	 */
	private String host;

	/**
	 * 端口号
	 */
	private int port;

	/**
	 * 路径
	 */
	private String path;

	/**
	 * 连接数据
	 */
	private LinkedHashMap<String, Object> data = new LinkedHashMap<String, Object>();

	public SimpleHttpRequest (String url) throws Exception {
		parseUrl(url);
//		open();
	}

	/**
	 * 创建连接
	 * @throws Exception
	 * <br>2015/4/25 下午1:33:25, 子牛连
	 */
	public void open() throws Exception {
		if ( null == socket || socket.isClosed() ) {
			socket = new Socket(host, port);
			br = new BufferedReader(new InputStreamReader(socket.getInputStream(),"UTF-8"));
			out = socket.getOutputStream();
		}
	}

	/**
	 * 关闭连接
	 * 
	 * <br>2015/4/24 下午2:25:47, 子牛连
	 */
	public void close() {
		try {
			out.close();
			br.close();
			socket.close();
		} catch (Exception e) {
		} finally {
			socket = null;
		}
	}

	/**
	 * 添加 HTTP参数
	 * @param d 字串型 HTTP参数
	 * @return
	 * <br>2015/4/24 下午4:51:12, 子牛连
	 */
	public SimpleHttpRequest setData (String d) {
		parseData(d);
		return  this;
	}

	/**
	 * 添加 HTTP参数
	 * @param map Map型 HTTP参数
	 * @return
	 * <br>2015/4/24 下午4:53:06, 子牛连
	 */
	public SimpleHttpRequest setData (Map<String, Object> map) {
		data.putAll(map);
		return this;
	}

	/**
	 * 执行 POST请求
	 * @param httpHead 是否输出 HTTP头
	 * @return
	 * <br>2015/4/24 下午5:00:46, 子牛连
	 * @throws Exception 
	 */
	public StringBuilder doPost (boolean httpHead) throws Exception {
		open();
		StringBuilder sb = new StringBuilder("POST");
		StringBuilder d = dataTo();
		sb.append(' ');
		sb.append(path);
		sb.append(' ');
		sb.append(http);
		sb.append("/1.1\r\n");
		sb.append("Host: www.lzr.com:617\r\n");
	    sb.append("Content-Length: ");
		if (null != d) {
		    sb.append( d.length() );
		} else {
		    sb.append( '0' );
		}
	    sb.append("\r\n");
	    sb.append("Content-Type: application/x-www-form-urlencoded\r\n");
	    sb.append("Connection: Close\r\n");
	    sb.append("\r\n");
		if (null != d) {
			sb.append(d);
		}
	    out.write(sb.toString().getBytes());

	    StringBuilder r = parseResponse(httpHead);
	    close();
	    return r;
	}

	/**
	 * 执行 GET请求
	 * @param httpHead 是否输出 HTTP头
	 * @return
	 * <br>2015/4/24 下午5:00:57, 子牛连
	 */
	public StringBuilder doGet (boolean httpHead) throws Exception {
		open();
		StringBuilder sb = new StringBuilder("GET");
		StringBuilder d = dataTo();
		sb.append(' ');
		sb.append(path);
		if (null != d) {
			sb.append('?');
			sb.append(d);
		}
		sb.append(' ');
		sb.append(http);
		sb.append("/1.1\r\n");
		sb.append("Host: www.lzr.com:617\r\n");
	    sb.append("Connection: Close\r\n");
	    sb.append("\r\n");
	    out.write(sb.toString().getBytes());

	    StringBuilder r = parseResponse(httpHead);
	    close();
	    return r;
	}

	/**
	 * 解析 URL
	 * @param url
	 * @throws Exception
	 * <br>2015/4/24 下午4:52:11, 子牛连
	 */
	private void parseUrl (String url) throws Exception {
		// 抓取协议，是 HTTP协议还是 HTTPS协议
		int i = url.indexOf("://");
		if (-1 == i) {
			http = "HTTP";
			i=0;
		} else {
			http = url.substring(0, i).toUpperCase();
			if (!http.startsWith("HTTP")) {
				throw new Exception("不是正确的 HTTP 请求！");
			}
			i+=3;
		}
		int pi = i;

		// 抓取 host
		i = url.indexOf("/", pi);
		if (-1 == i) {
			host = url.substring(pi);
		} else {
			host = url.substring(pi, i);
		}
		pi = i;

		// 抓取端口号
		i = host.indexOf(":");
		if (-1 == i) {
			port = 80;
		} else {
			port = Integer.parseInt(host.substring(i+1));
			host = host.substring(0, i);
		}

		// 抓取 path
		if (-1 == pi) {
			path = "/";
		} else {
			i = url.indexOf("?", pi);
			if (-1 == i) {
				path = url.substring(pi);
			} else {
				path = url.substring(pi, i);
			}
			pi = i;
		}

		// 解析 data
		if (-1 != pi) {
			parseData (url.substring(pi+1));
		}
	}

	/**
	 * 将字串型的 HTTP参数存入 data
	 * @param d
	 * <br>2015/4/24 下午3:55:20, 子牛连
	 */
	private void parseData (String d) {
		String[] ds = d.split("&");
		String perkey = null;
		for (String s : ds) {
			int i = s.indexOf('=');
			if (i>-1) {
				perkey = s.substring(0, i);
				data.put(perkey, s.substring(i+1));
			} else {
				data.put(perkey, data.get(perkey) + "&" + s);
			}
		}
	}

	/**
	 * 将 data 转换为 application/x-www-form-urlencoded MIME 格式的字串
	 * @return
	 * <br>2015/4/25 上午8:10:01, 子牛连
	 * @throws Exception 
	 */
	private StringBuilder dataTo () throws Exception {
		StringBuilder sb = null;
		for (Map.Entry<String, Object> entry : data.entrySet()) {
			if (null != sb) {
				sb.append('&');
			} else {
				sb = new StringBuilder();
			}
			sb.append( URLEncoder.encode(entry.getKey(), "UTF-8") );
			sb.append('=');
			sb.append( URLEncoder.encode(entry.getValue().toString(), "UTF-8") );
		}
		return sb;
	}

	/**
	 * 解析 HTTP头
	 * @param httpHead 是否输出 HTTP头
	 * @return
	 * @throws Exception
	 * <br>2015/4/27 上午11:17:14, 子牛连
	 */
	private StringBuilder parseResponse (boolean httpHead) throws Exception {
	    StringBuilder r = null;
	    String tmp = null;

	    if (httpHead) {
	    	r = new StringBuilder();
	    } else {
		    while((tmp = br.readLine())!=null){
		    	// 简单粗暴的去除 HTTP报头（不周全，仅判断是否存在“\r\n\r\n”）
		    	 if ( tmp.length()==0 ) {
		    		r = new StringBuilder();
		    		break;
		    	}
		    }
	    }

	    while((tmp = br.readLine())!=null){
	        r.append(tmp);
		    r.append("\r\n");
	    }
	    return r;
	}











	/**
	 * 测试函数
	 * 
	 * <br>2015/4/24 下午4:10:17, 子牛连
	 */
	public SimpleHttpRequest printest() {
		System.out.print ("http：");
		System.out.println (http);
		System.out.print ("host：");
		System.out.println (host);
		System.out.print ("port：");
		System.out.println (port);
		System.out.print ("path：");
		System.out.println (path);
		System.out.println ("data：");
		for (Map.Entry<String, Object> entry : data.entrySet()) {
			System.out.print ('\t');
			System.out.print (entry.getKey());
			System.out.print ("：");
			System.out.println (entry.getValue());
		}
		System.out.println ('\n');
		return this;
	}

	/**
	 * 测试函数
	 * @param args
	 * <br>2015/4/24 下午4:58:41, 子牛连
	 */
	public static void main (String[] args) {
		try {
//			// 测试 URL解析是否正确，需注释掉构造函数的 Socket连接部分再测试
//			new SimpleHttpRequest("").printest().close();
//			new SimpleHttpRequest("127.0.0.1:8081").printest().close();
//			new SimpleHttpRequest("https://127.0.0.1:8081").printest().close();
//			new SimpleHttpRequest("http://127.0.0.1/MVC/bean?").printest().close();
			System.out.println(	new SimpleHttpRequest("127.0.0.1/MVC/bean?f=dr%e&rd").printest().dataTo() );
//			new SimpleHttpRequest("127.0.0.1/MVC/bean?opt={method:\"qry\"}&obj={className:\"lzr.java.mvc.bean.TestOracleBean\", name:\"小二车車\"}").printest().close();
//			new SimpleHttpRequest("https://127.0.0.1:8081/MVC/bean?opt={method:\"qr==y\"}&method=\"qry\"&obj={className:\"lzr.jav & a.mvc.bean.TestO & racleBean\", name:\"小二车車\"}&name=\"小二车車\"").printest().close();
//			new SimpleHttpRequest("http://127.0.0.1:8081/MVC/bean?opt={method:\"qr==&y\"}&method=\"qry\"&obj={className:\"lzr.jav & a.mvc.bean.TestO & racleBean\", name:\"小二车車\"}&name=\"小二车車\"").printest().close();
//			new SimpleHttpRequest("https://127.0.0.1:8081/MVC/bean?opt={method:\"qr=&=y\"}&method=\"qry\"&obj={className:\"lzr.jav & a.mvc.bean.TestO & racleBean\", name:\"小二车車\"}&name=\"小二车車\"").printest().close();
//			new SimpleHttpRequest("ftp://127.0.0.1:8081").printest().close();

//			System.out.println ( new SimpleHttpRequest("http://ie.foxconn.com/Student/Index.aspx").printest().doGet(false) );

//		    String data = "opt={method:\"qry\"}&obj={className:\"lzr.java.mvc.bean.TestOracleBean\", name:\"二大\"}";
//			SimpleHttpRequest h = new SimpleHttpRequest("http://127.0.0.1:8081/MVC/bean");
//			h.setData(data);
//			System.out.println( h.doGet(false) );
//			System.out.println( h.doPost(false) );
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
