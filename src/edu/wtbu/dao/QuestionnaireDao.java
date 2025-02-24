package edu.wtbu.dao;

import java.util.HashMap;
import java.util.List;

public interface QuestionnaireDao {
	//查找问卷列表，根据用户、问卷名查找
	public List<HashMap<String, Object>> getAllQuestionnaire(HashMap<String, Object> map);
	public int getAllQuestionnaireCount(HashMap<String, Object> map);
	public List<HashMap<String, Object>> getAllQuestionnaireByUserId(HashMap<String, Object> map);
	public int getAllQuestionnaireByUserIdCount(HashMap<String, Object> map);
	public List<HashMap<String, Object>> getAllQuestionnaireByName(HashMap<String, Object> map);
	public int getAllQuestionnaireByNameCount(HashMap<String, Object> map);
	//查找问卷题目，根据发布问卷id查找
	public List<HashMap<String, Object>> getQuestionnaireQuestionById(int id);
	
	//根据问卷名获取问卷
	public HashMap<String, Object> getQuestionnaireByName(String name);
	public HashMap<String, Object> getCountByQuestionnaireDistributionId(int id);
	
	public int getQuestionnaireIdByDistributionId(int id);
	public List<HashMap<String,Object>> getDistributionIdByDate(HashMap<String, Object> map);
	public List<HashMap<String,Object>> getQuestionnaireIdByUserId(int id);
	
	
	public int addQuestionnaire(HashMap<String, Object> map);
	public int addQuestionnaireRel(HashMap<String, Object> map);
	public int addQuestionnaireDistribution(HashMap<String, Object> map);
	
	public int deletRel(int id);
	public int deletQuestionnaire(int id);
	public int deletQuestionnaireDistribution(int id);
	public int deletDistributionByQuestionnaireId(int id);
}
