package edu.wtbu.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import edu.wtbu.service.UserService;

@Controller
public class UserController {
	@Resource
	UserService userService;
	
	@RequestMapping("/login")
	@ResponseBody
	public Object login(String username, String password) {
		return userService.login(username, password);
	}
	@RequestMapping("/getMessage")
	@ResponseBody
	public Object getMessage(String username) {
		return userService.findUserByUsername(username);
	}
	@RequestMapping("/getRandomUsername")
	@ResponseBody
	public Object getRandomUsername() {
		return userService.getRandomUsername();
	}
	@RequestMapping("/getUserById")
	@ResponseBody
	public Object getUserById(String id) {
		int i = 0;
		try {
			i = Integer.parseInt(id);
		} catch (Exception e) {
			// TODO: handle exception
		}
		return userService.getUserById(i);
	}
	@RequestMapping("/getAllUserByCompanyid")
	@ResponseBody
	public Object getAllUser(String Companyid, String name, String startPage, String pageSize) {
		int i = 0;
		int start = 1;
		int size = 10;
		try {
			i = Integer.parseInt(Companyid);
		} catch (Exception e) {
			// TODO: handle exception
			i = 0;
		}
		try {
			start = Integer.parseInt(startPage);
		} catch (Exception e) {
			// TODO: handle exception
			start = 1;
		}
		try {
			size = Integer.parseInt(pageSize);
		} catch (Exception e) {
			// TODO: handle exception
			size = 10;
		}
		return userService.getAllUser(i, name, start, size);
	}
	@RequestMapping("/getAllUserName")
	@ResponseBody
	public Object getAllUserName(String Companyid) {
		int i = 0;
		try {
			i = Integer.parseInt(Companyid);
		} catch (Exception e) {
			// TODO: handle exception
			i = 0;
		}
		return userService.getAllUserName(i);
	}
	
	@RequestMapping("/addUser")
	@ResponseBody
	public Object addUser(String username, String password, String name, String sex, String phone, String role, String photo, String company) {
		int i = 0;
		int j = 0;
		try {
			i = Integer.parseInt(sex);
		} catch (Exception e) {
			// TODO: handle exception
		}
		try {
			j = Integer.parseInt(role);
		} catch (Exception e) {
			// TODO: handle exception
		}
		return userService.addUser(username, password, name, i, phone, j, photo, company);
	}
	
	@RequestMapping("/updateUser")
	@ResponseBody
	public Object updateUser(String id,String username, String name, String sex, String phone, String photo) {
		int i = 0;
		int j = 0;
		try {
			i = Integer.parseInt(sex);
		} catch (Exception e) {
			// TODO: handle exception
		}
		try {
			j = Integer.parseInt(id);
		} catch (Exception e) {
			// TODO: handle exception
		}
		return userService.updateUser(j, username, name, i, phone, photo);
	}
	@RequestMapping("/updatePassword")
	@ResponseBody
	public Object updatePassword(String id, String password) {
		int i = 0;
		try {
			i = Integer.parseInt(id);
		} catch (Exception e) {
			// TODO: handle exception
		}
		return userService.updatePassword(i, password);
	}
	@RequestMapping("/updatePasswordQuestion")
	@ResponseBody
	public Object updatePasswordQuestion(String id, String phone,String question,String answer) {
		int i = 0;
		try {
			i = Integer.parseInt(id);
		} catch (Exception e) {
			// TODO: handle exception
		}
		return userService.updatePasswordQustion(i, phone, question, answer);
	}
	@RequestMapping("/updateRole")
	@ResponseBody
	public Object updateRole(String id, String role) {
		int i = 0;
		int j = 0;
		try {
			i = Integer.parseInt(id);
		} catch (Exception e) {
			// TODO: handle exception
		}
		try {
			j = Integer.parseInt(role);
		} catch (Exception e) {
			// TODO: handle exception
		}
		return userService.updateRole(i, j);
	}
	
	@RequestMapping("deleteUser")
	@ResponseBody
	public Object deleteUser(String id) {
		int i = 0;
		try {
			i = Integer.parseInt(id);
		} catch (Exception e) {
			// TODO: handle exception
		}
		return userService.deleteUser(i);
	}
}
