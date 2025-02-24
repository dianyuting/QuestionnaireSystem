package edu.wtbu.dao;

import java.util.HashMap;

public interface CompanyDao {
	public HashMap<String, Object> getCompany(String name);
	
	public int addCompany(HashMap<String, Object> map);
	
	public int deletCompany(int id);
}
