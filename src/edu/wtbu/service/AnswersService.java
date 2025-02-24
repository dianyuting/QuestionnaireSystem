package edu.wtbu.service;

public interface AnswersService {
	public Object statisticalAnalysis(int distributionId);
	public Object comparativeAnalysis(int distributionId1, int distributionId2);
	public Object crossAnalysis(int distributionId, int relId1, int relId2);
	public Object cycleAnalysis(int distributionId, String start, String end);
	
	public Object findRespondent(String respondent);
	public Object getAllAnswers(int distributionId);
	
	public Object addAnswer(String respondent,int distributionId,int relId,String answer);
}
