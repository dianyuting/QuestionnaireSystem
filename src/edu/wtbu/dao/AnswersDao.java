package edu.wtbu.dao;

import java.util.HashMap;
import java.util.List;

public interface AnswersDao {
	public List<HashMap<String,Object>> getAnswersByDistributionId(int distributionId);
	public List<HashMap<String, Object>> comparativeAnalysis(HashMap<String, Object> map);
	public List<HashMap<String, Object>> crossAnalysis(HashMap<String, Object> map);
	public List<HashMap<String, Object>> findRespondent(String respondent);
	
	public List<HashMap<String, Object>> getAllAnswersByDistributionId(int distributionId);
	
	public int addAnswer(HashMap<String, Object> map);
	
	public int deletAnswersByQuestionnaireId(int id);
}
