package lzr.java.mvc.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lzr.java.mvc.servlet.imp.SrvConfig;

/**
 * SQLConfig 服务接口
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/4/25	下午1:55:27
 */
public class ConfigSrv extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private SrvConfig srv = new SrvConfig();

	public void service (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");
		response.addHeader("Access-Control-Allow-Origin","*");
		PrintWriter out = response.getWriter();

		String opt = request.getParameter("opt");
		String obj = request.getParameter("obj");
		if (request.getMethod().equals("GET")) {
			if (null != opt) opt = new String(opt.getBytes("ISO8859-1"),"UTF-8");
			if (null != obj) obj = new String(obj.getBytes("ISO8859-1"),"UTF-8");
		}

		StringBuilder r = srv.srvMain(opt, obj);
		String m = srv.getMethod();
		if ( null != m && m.equals("url") ) {
			out.print(r);
		} else {
			out.print('{');
			out.print(r);
			out.print('}');
		}
	}

}
