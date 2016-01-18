package lzr.java.mvc.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lzr.java.mvc.servlet.imp.SrvBean;

/**
 * Bean服务接口
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/4/7	上午11:37:14
 */
public class BeanSrv extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private SrvBean srv = new SrvBean();

	public void service (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");
		response.addHeader("Access-Control-Allow-Origin","*");	// 允许 ajax 跨域访问
		PrintWriter out = response.getWriter();

		String opt = request.getParameter("opt");
		String obj = request.getParameter("obj");
		if (request.getMethod().equals("GET")) {
			// GET方法乱码修正
			if (null != opt) opt = new String(opt.getBytes("ISO8859-1"),"UTF-8");
			if (null != obj) obj = new String(obj.getBytes("ISO8859-1"),"UTF-8");
		}

		out.print('{');
		out.print( srv.srvMain(opt, obj) );
		out.print('}');
	}

}

