package lzr.java.mvc.bean;

import java.sql.Date;

import lzr.java.mvc.bean.annotation.Column;
import lzr.java.mvc.bean.annotation.Id;
import lzr.java.mvc.bean.annotation.InsConst;
import lzr.java.mvc.bean.annotation.Table;

/**
 * Oracle Bean测试类
 * 
 * @version	1.0
 * @author	子牛连
 * <br>2015/4/15	上午11:50:02
 */
@Table(name="LZR_TEST")
public class TestOracleBean {
	@Id
	@InsConst(value="SEQ_LZR_TEST.nextval")
	@Column(name="T_ID", updatable=false, insertable=false, nullable=false)
	private Long index;

	@Column(name="T_S")
	private String name;

	@Column(name="T_TIME")
	private Date birthday;

	@Column(name="T_D")
	private Float age;

	@Column(name="T_B")
	private Boolean man;
}
