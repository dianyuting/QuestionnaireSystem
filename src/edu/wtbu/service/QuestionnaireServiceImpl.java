package edu.wtbu.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import edu.wtbu.dao.AnswersDao;
import edu.wtbu.dao.QuestionnaireDao;
import edu.wtbu.dao.UserDao;
import edu.wtbu.pojo.Page;
import edu.wtbu.pojo.Result;

@Service
public class QuestionnaireServiceImpl implements QuestionnaireService {
	@Resource
	QuestionnaireDao questionnaireDao;
	@Resource
	UserDao userDao;
	@Resource
	AnswersDao answersDao;
	@Override
	public Object getAllQuestionnaire(String name, int companyId, int uid, int startPage, int pageSize) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		Page page = null;
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("name", "%" + name + "%");
		map.put("startPage", (startPage - 1) * pageSize);
		map.put("pageSize", pageSize);
		List<HashMap<String, Object>> list = null;
		if(companyId != 1) {
			map.put("companyId", companyId);
			if(uid == 0) {
				page = new Page(pageSize, startPage, questionnaireDao.getAllQuestionnaireCount(new HashMap<String, Object>() {
					{
						put("companyId", companyId);
						put("name", "%" + name + "%");
					}
				}));
				list = questionnaireDao.getAllQuestionnaire(map);
				if(list == null || list.isEmpty()) {
					return result;
				}
			}else if(uid != 0){
				page = new Page(pageSize, startPage, questionnaireDao.getAllQuestionnaireByUserIdCount(new HashMap<String, Object>() {
					{
						put("companyId", companyId);
						put("uid", uid);
						put("name", "%" + name + "%");
					}
				}));
				map.put("uid", uid);
				list = questionnaireDao.getAllQuestionnaireByUserId(map);
				if(list == null || list.isEmpty()) {
					return result;
				}
			}
		}else {
			page = new Page(pageSize, startPage, questionnaireDao.getAllQuestionnaireByNameCount(new HashMap<String, Object>() {
				{
					put("uid", uid);
					put("name", "%" + name + "%");
				}
			}));
			map.put("uid", uid);
			list = questionnaireDao.getAllQuestionnaireByName(map);
			if(list == null || list.isEmpty()) {
				return result;
			}
		}
		result.setFlag("success");
		for (HashMap<String, Object> hashMap : list) {
			int i = Integer.parseInt(hashMap.get("uid").toString());
			if(i != 0) {
				hashMap.put("username", userDao.findUserById(i).get("username"));
			}else {
				hashMap.put("username", "用户已注销");
			}
		}
		result.setData(list);
		result.setPage(page);
		return result;
	}

	@Override
	public Object getQuestionnaireQuestionById(int id) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		List<HashMap<String, Object>> r = questionnaireDao.getQuestionnaireQuestionById(id);
		if(r != null && !r.isEmpty()) {
			result.setFlag("success");
			result.setData(r);
		}
		return result;
	}

	@Override
	public Object addQuestionnaire(String questionnaireName, int uid) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		HashMap<String, Object> m = questionnaireDao.getQuestionnaireByName(questionnaireName); 
		if(m != null && !m.isEmpty()) {
			result.setData("问卷名重复");
			return result;
		}
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("questionnaireName", questionnaireName);
		map.put("uid", uid);
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = new Date();
		map.put("createTime", df.format(date));
		int r  = questionnaireDao.addQuestionnaire(map);
		if(r > 0) {
			result.setFlag("success");
		}
		return result;
	}

	@Override
	public Object addQuestionnaireRel(int questionnaireId, int questionId, int sequence) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("questionnaireId", questionnaireId);
		map.put("questionId", questionId);
		map.put("sequence", sequence);
		int r  = questionnaireDao.addQuestionnaireRel(map);
		if(r > 0) {
			result.setFlag("success");
		}
		return result;
	}

	@Override
	public Object addQuestionnaireDistribution(int questionnaireId, String startDate, String endDate) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("questionnaireId", questionnaireId);
		map.put("startDate",startDate + " 00:00:00");
		map.put("endDate", endDate + " 23:59:59");
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = new Date();
		map.put("createTime", df.format(date));
		int r  = questionnaireDao.addQuestionnaireDistribution(map);
		if(r > 0) {
			result.setFlag("success");
		}
		return result;
	}

	@Override
	public Object deletQuestionnaire(int id) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		int r = 0;
		try {
			r = Integer.parseInt(questionnaireDao.getCountByQuestionnaireDistributionId(id).get("total").toString());
		} catch (Exception e) {
			// TODO: handle exception
		}
		if(r == 0) return result;
		int i = 0;
		if(r > 1) { 
			i = questionnaireDao.deletQuestionnaireDistribution(id);
		}else {
			int x = questionnaireDao.getQuestionnaireIdByDistributionId(id);
			questionnaireDao.deletQuestionnaireDistribution(id);
			questionnaireDao.deletRel(x);
			answersDao.deletAnswersByQuestionnaireId(x);
			i = questionnaireDao.deletQuestionnaire(x);
		}
		if(i > 0) result.setFlag("success");
		return result;
	}

	@Override
	public Object getQuestionnaireByName(String name) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		HashMap<String, Object> map = questionnaireDao.getQuestionnaireByName(name);
		if(map != null && !map.isEmpty()) {
			result.setFlag("success");
			result.setData(map);
		}
		return result;
	}

}
