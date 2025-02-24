package edu.wtbu.service;

import edu.wtbu.pojo.Result;

public interface UserService {
	public Result login(String username, String password);
	public Result findUserByUsername(String username);
	public Result getRandomUsername();
	public Result getUserById(int id);
	public Result getAllUser(int Companyid, String name, int startPage, int pageSize);
	public Result getAllUserName(int companyId);
	
	public Result addUser(String username, String password, String name, int sex, String phone, int role, String photo, String company);
	
	public Result updateUser(int id,String username, String name, int sex, String phone, String photo);
	public Result updateRole(int id, int role);
	public Result updatePassword(int id, String Password);
	public Result updatePasswordQustion(int id, String phone, String question, String answer);
	
	public Result deleteUser(int id);
	
}
