package edu.wtbu.service;

public interface QuestionnaireService {
	public Object getAllQuestionnaire(String name, int companyId, int uid, int startPage, int pageSize);
	public Object getQuestionnaireQuestionById(int id);
	public Object getQuestionnaireByName(String name);
	
	public Object addQuestionnaire(String questionnaireName, int uid);
	public Object addQuestionnaireRel(int questionnaireId, int questionId, int sequence);
	public Object addQuestionnaireDistribution(int questionnaireId, String startDate, String endDate);
	
	public Object deletQuestionnaire(int id);
}
