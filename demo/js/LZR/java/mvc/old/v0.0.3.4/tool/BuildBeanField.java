package lzr.java.mvc.tool;

/**
 * 生成Bean用到的属性
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/5/11	下午1:48:26
 */
public class BuildBeanField {

	/**
	 * Bean 的属性名
	 */
	private String name;

	/**
	 * 对应数据库的栏位名
	 */
	private String tabName;

	/**
	 * 数据类型
	 */
	private String type;

	/**
	 * 备注
	 */
	private String memo;

	/**
	 * 是否唯一键
	 */
	private boolean isUnique = false;

	/**
	 * 是否主键
	 */
	private boolean isId = false;

	/**
	 * 可为空
	 */
	private boolean nullable = true;

	/**
	 * 可更新
	 */
	private boolean updatable = true;

	/**
	 * 可插入
	 */
	private boolean insertable = true;

	/**
	 * 生成源码样式
	 * @return
	 * <br>2015/5/11 下午2:07:49, 子牛连
	 */
	public StringBuilder src() {
		StringBuilder r = new StringBuilder("\r\n");

		if (null != memo) {
			r.append("\t/**\r\n\t * ");
			r.append(memo);
			r.append("\r\n\t */\r\n");
		}

		if (isId) {
			r.append("\t@Id\r\n");
		}

		r.append("\t@Column(name=\"");
		r.append(tabName);
		r.append('\"');

		if (isUnique) {
			r.append(", unique=true");
		}

		if (!updatable) {
			r.append(", updatable=false");
		}

		if (!insertable) {
			r.append(", insertable=false");
		}

		if (!nullable) {
			r.append(", nullable=false");
		}

		r.append(")\r\n");
		r.append("\tprivate ");
		r.append(type);
		r.append(' ');
		r.append(name);
		r.append(";\r\n");

		return r;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setTabName(String tabName) {
		this.tabName = tabName;
	}

	public void setType(String type) {
		this.type = type;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public void setUnique() {
		this.isUnique = true;
	}

	public void setId() {
		this.isId = true;
	}

	public void setNullable() {
		this.nullable = false;
	}

	public void setUpdatable() {
		this.updatable = false;
	}

	public void setInsertable() {
		this.insertable = false;
	}

	public String getType() {
		return type;
	}

	public String getTabName() {
		return tabName;
	}











	/**
	 * 测试函数
	 * @param args
	 * <br>2015/5/12 下午3:53:18, 子牛连
	 */
	public static void main (String args[]) {
		BuildBeanField f = new BuildBeanField();
		f.setName("test");
		f.setTabName("db_test_field");
		f.setType("Integer");
		System.out.println(f.src());

		f.setId();
		System.out.println(f.src());

		f.setMemo("测试");
		System.out.println(f.src());

		f.setInsertable();
		System.out.println(f.src());

		f.setNullable();
		System.out.println(f.src());

		f.setUnique();
		System.out.println(f.src());

		f.setUpdatable();
		System.out.println(f.src());
	}

}
