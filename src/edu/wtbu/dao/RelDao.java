package edu.wtbu.dao;

import java.util.HashMap;
import java.util.List;

public interface RelDao {
	public List<HashMap<String, Object>> getQuestionsByQuestionnaireId(int id);
	public HashMap<String, Object> getRelByQuestionsId(int id);
	
	
	public int addRel(HashMap<String, Object> map);
	
	public int deletRelByQuestionnaire(int id);
}
