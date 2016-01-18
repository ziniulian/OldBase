package lzr.java.mvc.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.Socket;
import java.net.URLEncoder;
import java.net.UnknownHostException;

/**
 * 测试服务的 GET、POST 处理结果
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/4/16	上午10:55:35
 */
public class TestSrvGetPost {
	
	public static void main (String[]args) {
	    Socket s;
		try {
		    String data = "opt=";
		    data += URLEncoder.encode("{method:\"qry\"}", "UTF-8");;
		    data += "&";
		    data += "obj=";
		    data += URLEncoder.encode("{className:\"lzr.java.mvc.bean.TestOracleBean\", name:\"小二车車\"}", "UTF-8");
//System.out.println(data);

			// GET测试
			s = new Socket("127.0.0.1",8081);
		    BufferedReader br = new BufferedReader(new InputStreamReader(s.getInputStream(),"UTF-8"));
		    OutputStream out = s.getOutputStream();
		    StringBuffer sb = new StringBuffer("GET /MVC/bean?"+ data +" HTTP/1.1\r\n");
//		    sb.append("User-Agent: Java/1.6.0_20\r\n");
		    sb.append("Host: www.pconline.com.cn:80\r\n");
//		    sb.append("Accept: text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2\r\n");
		    sb.append("Connection: Close\r\n");
		    sb.append("\r\n");
		    out.write(sb.toString().getBytes());
		    String tmp = "";
		    while((tmp = br.readLine())!=null){
		        System.out.println(tmp);
		    }
		    out.close();
		    br.close();
		    s.close();

		    // POST测试
		    s = new Socket("127.0.0.1",8081);
		    br = new BufferedReader(new InputStreamReader(s.getInputStream(),"UTF-8"));
		    out = s.getOutputStream();

		    sb = new StringBuffer("POST /MVC/bean HTTP/1.1\r\n");
//		    sb.append("User-Agent: Java/1.6.0_20\r\n");
		    sb.append("Host: www.pconline.com.cn:80\r\n");
		    sb.append("Content-Length: "+data.length()+"\r\n");	// POST必须
		    sb.append("Content-Type: application/x-www-form-urlencoded\r\n");	// POST必须
//		    sb.append("Accept: text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2\r\n");
		    sb.append("Connection: Close\r\n");
		    sb.append("\r\n");
		    sb.append(data);
		    out.write(sb.toString().getBytes());

		    tmp = "";
		    while((tmp = br.readLine())!=null){
		        System.out.println(tmp);
		    }
		    
		    out.close();
		    br.close();
		    s.close();
		} catch (UnknownHostException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

}
