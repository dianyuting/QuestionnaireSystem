package edu.wtbu.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Random;
import java.util.UUID;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import edu.wtbu.dao.AnswersDao;
import edu.wtbu.dao.CompanyDao;
import edu.wtbu.dao.QuestionnaireDao;
import edu.wtbu.dao.UserDao;
import edu.wtbu.pojo.Page;
import edu.wtbu.pojo.Result;

@Service
public class UserServiceImpl implements UserService {
	@Resource
	UserDao userDao;
	@Resource
	CompanyDao companyDao;
	@Resource
	QuestionnaireDao questionnaireDao;
	@Resource
	AnswersDao answersDao;
	
	@Override
	public Result login(String username, String password) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		HashMap<String, Object> r = userDao.findUserByUsername(username);
		if(r != null && !r.isEmpty()) {
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("username",username);
			map.put("password", password);
			r  = userDao.login(map);
			if(r != null && !r.isEmpty()) {
				result.setFlag("success");
				result.setData(r);
			}else result.setData("密码错误");
		}else result.setData("用户名不存在");
		
		return result;
	}

	@Override
	public Result addUser(String username, String password, String name, int sex, String phone, int role, String photo, String company) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		if(userDao.findUserByUsername(username) != null && !userDao.findUserByUsername(username).isEmpty()) {
			result.setData("用户名重复，请重新输入");
			return result;
		}else if(userDao.findUserByPhone(phone.equals("") ? null : phone) != null && !userDao.findUserByPhone(phone.equals("") ? null : phone).isEmpty()) {
			result.setData("手机号重复，请重新输入");
			return result;
		}
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("role",role);
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = new Date();
		HashMap<String, Object> comMap = new HashMap<String, Object>();
		comMap.put("name", company);
		comMap.put("date", df.format(date));
		if(company.equals("")) {
			map.put("company_id", 1);
		}else if(companyDao.getCompany(company) != null && !companyDao.getCompany(company).isEmpty()){
			map.put("company_id", companyDao.getCompany(company).get("id"));
		}else if(companyDao.addCompany(comMap) > 0){
			map.put("role",1);
			map.put("company_id", companyDao.getCompany(company).get("id"));
		}
		map.put("username",username);
		map.put("password", password);
		map.put("name",name.equals("") ? null : name); 
		map.put("sex",sex);
		map.put("phone",phone.equals("") ? null : phone);
		map.put("photo",photo.equals("") ? null : photo);
		map.put("createTime",df.format(date));
		int r  = userDao.addUser(map);
		if(r > 0) {
			result.setFlag("success");
		}
		return result;
	}

	@Override
	public Result updateUser(int id ,String username, String name, int sex, String phone, String photo) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		HashMap<String, Object> map = new HashMap<String, Object>();
		HashMap<String, Object> u = userDao.findUserById(id);
		if(u != null && !u.isEmpty()) {
			if(!u.get("username").equals(username)) {
				if(userDao.findUserByUsername(username) != null && !userDao.findUserByUsername(username).isEmpty()) {
					result.setData("用户名重复，请重新输入");
					return result;
				}
			}
			if(userDao.findUserByPhone(phone.equals("") ? null : phone) != null && !userDao.findUserByPhone(phone.equals("") ? null : phone).isEmpty()) {
				result.setData("手机号重复，请重新输入");
				return result;
			}
		}else return result;
		map.put("id", id);
		map.put("username",username);
		map.put("name",name.equals("") ? null : name);
		map.put("sex",sex);
		map.put("phone",phone.equals("") ? null : phone);
		map.put("photo",photo.equals("") ? null : photo);
		int r  = userDao.updateUser(map);
		if(r > 0) {
			result.setFlag("success");
		}
		return result;
	}

	@Override
	public Result deleteUser(int id) {
		// TODO Auto-generated method stubResult result = new Result("fail");
		Result result = new Result("fail");
		List<HashMap<String,Object>> l = questionnaireDao.getQuestionnaireIdByUserId(id);
		for (HashMap<String, Object> h : l) {
			int x = 0;
			try {
				x = Integer.parseInt(h.get("id").toString());
			} catch (Exception e) {
				// TODO: handle exception
			}
			answersDao.deletAnswersByQuestionnaireId(x);
			questionnaireDao.deletDistributionByQuestionnaireId(x);
			questionnaireDao.deletRel(x);
			questionnaireDao.deletQuestionnaire(x);
		}
		HashMap<String, Object> user = userDao.findUserById(id);
		int companyId = Integer.parseInt(user.get("company_id").toString());
		if(companyId != 1 && Integer.parseInt(user.get("role").toString()) == 1) {
			if(userDao.updateRoleByCompany(companyId) > 0 && companyDao.deletCompany(companyId) > 0) {
				if(userDao.deleteUser(id) > 0) {
					result.setFlag("success");
				}
			}
		}else if(userDao.deleteUser(id) > 0){
			result.setFlag("success");
		}
		return result;
	}

	@Override
	public Result findUserByUsername(String username) {
		// TODO Auto-generated method stub
		HashMap<String, Object> map = userDao.findUserByUsername(username);
		Result result = new Result("fail");
		if(map != null && !map.isEmpty()) {
			if(map.get("phone").equals("") || map.get("verify_question").equals("")) {
				result.setData("未设置验证信息，或验证信息不全");
			}else {
				result.setFlag("success");
				result.setData(map);
			}
		}else result.setData("用户名不存在");
		return result;
	}

	@Override
	public Result updatePassword(int id, String password) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("id", id);
		map.put("password", password);
		if(userDao.updatePassword(map) > 0) {
			result.setFlag("success");
		}
		return result;
	}

	@Override
	public Result updatePasswordQustion(int id, String phone, String question, String answer) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		if(userDao.findUserByPhone(phone.equals("") ? null : phone) != null && !userDao.findUserByPhone(phone.equals("") ? null : phone).isEmpty()) {
			result.setData("手机号重复，请重新输入");
			return result;
		}
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("id",id);
		map.put("phone",phone.equals("") ? null : phone);
		map.put("question", question.equals("") ? null : question);
		map.put("answer", answer.equals("") ? null : answer);
		if(userDao.updatePasswordQustion(map) > 0) {
			result.setFlag("success");
		}
		return result;
	}

	@Override
	public Result updateRole(int id, int role) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("id", id);
		map.put("role", role);
		if(userDao.updateRole(map) > 0) {
			result.setFlag("success");
		}
		return result;
	}

	@Override
	public Result getRandomUsername() {
		// TODO Auto-generated method stub
		Result result = new Result();
		String name = randomUsername();
		while(userDao.findUserByUsername(name) != null && !userDao.findUserByUsername(name).isEmpty()) {
			name = randomUsername();
		}
		result.setFlag("success");
		result.setData(name);
		return result;
	}
	
	public String randomUsername() {
		String str = UUID.randomUUID().toString().replace("-", "");
		Random random = new Random();
		int n = random.nextInt(str.length());
		int m = random.nextInt(str.length());
		String name = str.substring(n > m ? m : n, n > m ? n : m);
		return name;
	}

	@Override
	public Result getUserById(int id) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		HashMap<String, Object> r = userDao.findUserById(id);
		if(r != null && !r.isEmpty()) {
			result.setFlag("success");
			result.setData(r);
		}
		return result;
	}

	@Override
	public Result getAllUser(int companyid, String name, int startPage, int pageSize) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("companyid", companyid);
		map.put("name", "%" + name + "%");
		map.put("startPage", (startPage - 1) * pageSize);
		map.put("pageSize", pageSize);
		Page page = new Page(pageSize, startPage, userDao.getAllUserCount(new HashMap<String, Object>() {
			{
				put("companyid", companyid);
				put("name",  "%" + name + "%");
			}
		}));
		List<HashMap<String, Object>> r = userDao.getAllUser(map);
		if(r != null && !r.isEmpty()) {
			result.setFlag("success");
			result.setData(r);
			result.setPage(page);;
		}
		return result;
	}

	@Override
	public Result getAllUserName(int companyId) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		List<HashMap<String, Object>> list = userDao.getAllUserName(companyId);
		if(list != null && list.size() > 0) {
			result.setFlag("success");
			result.setData(list);
		}
		return result;
	}

}
