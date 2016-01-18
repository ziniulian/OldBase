package lzr.java.mvc.test.bean;

import java.sql.Timestamp;

import lzr.java.mvc.bean.annotation.Column;
import lzr.java.mvc.bean.annotation.Id;
import lzr.java.mvc.bean.annotation.Table;

/**
 * Excel Bean测试类
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/3/19	上午11:27:58
 */
@Table(name="[TAB_TEST$]")
public class TestExcelBean {

	@Id
	@Column(name="ID_", updatable=false, insertable=false, nullable=false)
	private Integer id;

	@Id
	@Column(name="ID2_", nullable=false)
	private Integer id2;

	@Column(name="NAME_", nullable=false, length=20)
	private String name;

	@Column(name="TIME_")
	private Timestamp time;

	@Column(name="AGE_", updatable=false, insertable=false)
	private Double age;

	@Column(name="TT1")
	private String tt1;

	@Column(name="TT2", updatable=false)
	private String tt2;

	@Column(name="TT3", insertable=false)
	private String tt3;

	@Id
	@Column(name="TT4", updatable=false)
	private String tt4;

	@Column(name="TT5")
	private String tt5;

	@Column(name="R_TT6", unique=true)
	private String tt6;

	@Column(name="TT7")
	private String tt7;

	@Column(name="TT8_", unique=true)
	private String tt8;

	/**
	 * 测试 函数
	 * 
	 * <br>2015/3/25 下午2:07:56, 子牛连
	 */
	public void printest () {
		System.out.println(	name + " : AGE = "
							+ age  + " ; TIME = "
							+ time  + " ;\n TT1 = "
							+ tt1  + " ;\n TT2 = "
							+ tt2  + " ;\n TT3 = "
							+ tt3  + " ;\n TT4 = "
							+ tt4  + " ;\n TT5 = "
							+ tt5  + " ;\n TT6 = "
							+ tt6  + " ;\n TT7 = "
							+ tt7  + " ;\n TT8 = "
							+ tt8  + " ;\n ID = "
							+ id  + " ; ID2 = "
							+ id2  + " 。\n" );
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Timestamp getTime() {
		return time;
	}

	public void setTime(Timestamp time) {
		this.time = time;
	}

	public Double getAge() {
		return age;
	}

	public void setAge(Double age) {
		this.age = age;
	}

	public Integer getId2() {
		return id2;
	}

	public void setId2(Integer id2) {
		this.id2 = id2;
	}

	public String getTt1() {
		return tt1;
	}

	public void setTt1(String tt1) {
		this.tt1 = tt1;
	}

	public String getTt2() {
		return tt2;
	}

	public void setTt2(String tt2) {
		this.tt2 = tt2;
	}

	public String getTt3() {
		return tt3;
	}

	public void setTt3(String tt3) {
		this.tt3 = tt3;
	}

	public String getTt4() {
		return tt4;
	}

	public void setTt4(String tt4) {
		this.tt4 = tt4;
	}

	public String getTt5() {
		return tt5;
	}

	public void setTt5(String tt5) {
		this.tt5 = tt5;
	}

	public String getTt6() {
		return tt6;
	}

	public void setTt6(String tt6) {
		this.tt6 = tt6;
	}

	public String getTt7() {
		return tt7;
	}

	public void setTt7(String tt7) {
		this.tt7 = tt7;
	}

	public String getTt8() {
		return tt8;
	}

	public void setTt8(String tt8) {
		this.tt8 = tt8;
	}

}
