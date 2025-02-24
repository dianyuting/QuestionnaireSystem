package edu.wtbu.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import edu.wtbu.dao.QuestionsDao;
import edu.wtbu.pojo.Page;
import edu.wtbu.pojo.Result;

@Service
public class QuestionServiceImpl implements QuestionService {

	@Resource
	QuestionsDao questionsDao;

	@Override
	public Object getQuestionsType() {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		List<HashMap<String, Object>> list = questionsDao.getQuestionsType();
		if(list != null && list.size() > 0) {
			result.setFlag("success");
			result.setData(list);
		}
		return result;
	}

	@Override
	public Object getAllQuestions(int startPage, int pageSize, int questionType, String name) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("questionName", "%" + name + "%");
		map.put("startPage", (startPage - 1) * pageSize);
		map.put("pageSize", pageSize);
		if(questionType != 0) {
			Page page = new Page(pageSize, startPage, questionsDao.getAllQuestionsCountByType(new HashMap<String, Object>() {
				{
					put("questionTypeId", questionType);
					put("questionName",  "%" + name + "%");
				}
			}));
			map.put("questionTypeId", questionType);
			List<HashMap<String, Object>> r = questionsDao.getAllQuestionsByType(map);
			if(r != null && !r.isEmpty()) {
				result.setFlag("success");
				result.setData(r);
				result.setPage(page);;
			}
		}else {
			Page page = new Page(pageSize, startPage, questionsDao.getAllQuestionsCount(new HashMap<String, Object>() {
				{
					put("questionName",  "%" + name + "%");
				}
			}));
			List<HashMap<String, Object>> r = questionsDao.getAllQuestions(map);
			if(r != null && !r.isEmpty()) {
				result.setFlag("success");
				result.setData(r);
				result.setPage(page);;
			}
		}
		return result;
	}

	@Override
	public Object addQuestion(String question, int question_type, String options) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("question", question);
		map.put("question_types_id", question_type);
		map.put("question_options", options.equals("") ? null : options);
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = new Date();
		map.put("create_time", df.format(date));
		int r  = questionsDao.addQuestions(map);
		if(r > 0) {
			result.setFlag("success");
		}
		return result;
	}


	@Override
	public Object getQuestionById(int id) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		HashMap<String, Object> map = questionsDao.getQuestionById(id);
		if(map != null && !map.isEmpty()) {
			result.setFlag("success");
			result.setData(map);
		}
		return result;
	}

}
