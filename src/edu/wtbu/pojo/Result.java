package edu.wtbu.pojo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(Include.NON_NULL)
public class Result {
	private String flag;
	private Object data;
	private Page page;
	public Result() {
		super();
	}
	public Result(String flag) {
		super();
		this.flag = flag;
	}
	public Result(String flag, Object data) {
		super();
		this.flag = flag;
		this.data = data;
	}
	public Result(String flag, Object data, Page page) {
		super();
		this.flag = flag;
		this.data = data;
		this.page = page;
	}
	public String getFlag() {
		return flag;
	}
	public void setFlag(String flag) {
		this.flag = flag;
	}
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
	public Page getPage() {
		return page;
	}
	public void setPage(Page page) {
		this.page = page;
	}

}
