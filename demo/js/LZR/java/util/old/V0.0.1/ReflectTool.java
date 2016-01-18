package lzr.java.util;

import java.lang.reflect.Method;

/**
 * 反射-常用函数
 */
public class ReflectTool {
	/**
	 * 利用反射，执行对象的方法。 
	 * @param owner 要执行的对象
	 * @param methodName 要执行的对象的方法名
	 * @param args 方法需要的参数集合
	 * @return 方法执行的返回值
	 * @throws Exception
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static Object invokeMethod(Object owner, String methodName, Object[] args) throws Exception {
		/**
		 * 优化：将获取 Method 与 执行 Method 功能分开
		 */
		Class ownerClass = owner.getClass();
		Method method = null;
		boolean nogo = false;
		
		if (null == args) {
			method = ownerClass.getMethod(methodName);
		} else {
			int n = args.length;
			Class c[] = new Class [n];
			for (int i=0; i<n; i++) {
				if (null == args[i]) {
					c[i] = null;
					nogo = true;
				} else {
					c[i] = args[i].getClass();
				}
			}
			
			// 对null参数的特殊处理
			if (nogo) {
				Method ms[] = ownerClass.getMethods();
				for (Method m:ms) {
					if (methodName.equals(m.getName())) {
						Class<?>[] parameterTypes = m.getParameterTypes();
						if (parameterTypes.length == n) {
							nogo = false;
							for (int i=0; i<n; i++) {
								if (null != c[i]) {
									if (!c[i].equals(parameterTypes[i])) {
										nogo = true;
										break;
									}
								}
							}
							if (!nogo) {
								method = ownerClass.getMethod(methodName, parameterTypes);
								break;
							}
						}
					}
				}
				if (nogo) {
					throw new Exception("Error：参数匹配失败！");
				}
			} else {
				method = ownerClass.getMethod(methodName, c);
			}
		}
			
		return method.invoke(owner, args);
	}
	
	/**
	 * 获取不带包名的类名。
	 * @param className：类名
	 * @return 不带包名的类名。
	 */
	public static String getAbClassName (String className) {
		int i = className.lastIndexOf('.');
		return className.substring(i+1);
	}
}
