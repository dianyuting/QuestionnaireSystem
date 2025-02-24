package edu.wtbu.dao;

import java.util.HashMap;
import java.util.List;

public interface UserDao {
	public HashMap<String, Object> login(HashMap<String, Object> map);
	public HashMap<String, Object> findUserByUsername(String username);
	public HashMap<String, Object> findUserById(int id);
	public HashMap<String, Object> findUserByPhone(String phone);
	public List<HashMap<String, Object>> getAllUser(HashMap<String, Object> map);
	public int getAllUserCount(HashMap<String, Object> map);
	public List<HashMap<String, Object>> getAllUserName(int Companyid);
	
	public int addUser(HashMap<String, Object> map);
	
	public int updateUser(HashMap<String, Object> map);
	public int updateRole(HashMap<String, Object> map);
	public int updateRoleByCompany(int companyId);
	public int updatePassword(HashMap<String, Object> map);
	public int updatePasswordQustion(HashMap<String, Object> map);
	
	public int deleteUser(int id);
}
