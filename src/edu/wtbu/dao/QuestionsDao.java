package edu.wtbu.dao;

import java.util.HashMap;
import java.util.List;

public interface QuestionsDao {
	public List<HashMap<String, Object>> getAllQuestions(HashMap<String, Object> map);
	public List<HashMap<String, Object>> getAllQuestionsByType(HashMap<String, Object> map);
	public int getAllQuestionsCount(HashMap<String, Object> map);
	public int getAllQuestionsCountByType(HashMap<String, Object> map);
	public HashMap<String, Object> getQuestionById(int id);
	public List<HashMap<String, Object>> getQuestionsType();
	
	public int addQuestions(HashMap<String, Object> map);
	
}
