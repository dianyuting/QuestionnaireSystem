package edu.wtbu.service;


public interface QuestionService {
	public Object getQuestionsType();
	public Object getAllQuestions(int startPage, int pageSize, int questionType, String name);
	public Object getQuestionById(int id);
	
	public Object addQuestion(String question, int question_type, String options);

}
