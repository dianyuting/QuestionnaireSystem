package edu.wtbu.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import edu.wtbu.service.QuestionnaireService;

@Controller
public class QuestionnaireController {
	@Resource
	QuestionnaireService questionnaireService;
	
	@RequestMapping("/getAllQuestionnaire")
	@ResponseBody
	public Object getAllQuestionnaire(String name, String companyId, String uid, String startPage, String pageSize) {
		int i = 0;
		int j = 0;
		int start = 1;
		int size = 10;
		try {
			i = Integer.parseInt(uid);
		} catch (Exception e) {
			// TODO: handle exception
			i = 0;
		}
		try {
			j = Integer.parseInt(companyId);
		} catch (Exception e) {
			// TODO: handle exception
			j = 0;
		}
		try {
			start = Integer.parseInt(startPage);
		} catch (Exception e) {
			// TODO: handle exception
			start = 1;
		}
		try {
			size = Integer.parseInt(pageSize);
		} catch (Exception e) {
			// TODO: handle exception
			size = 10;
		}
		return questionnaireService.getAllQuestionnaire(name, j, i, start, size);
	}
	@RequestMapping("/getQuestionsByQuestionnaireId")
	@ResponseBody
	public Object getQuestionsByQuestionnaireId(String questionnaireId) {
		int i = 0;
		try {
			i = Integer.parseInt(questionnaireId);
		} catch (Exception e) {
			// TODO: handle exception
			i = 0;
		}
		return questionnaireService.getQuestionnaireQuestionById(i);
	}
	@RequestMapping("/getQuestionnaireByName")
	@ResponseBody
	public Object getQuestionnaireByName(String name) {
		return questionnaireService.getQuestionnaireByName(name);
	}
	
	@RequestMapping("/addQuestionnaire")
	@ResponseBody
	public Object addQuestionnaire(String questionnaireName, String userId) {
		int i = 0;
		try {
			i = Integer.parseInt(userId);
		} catch (Exception e) {
			// TODO: handle exception
			i = 0;
		}
		return questionnaireService.addQuestionnaire(questionnaireName, i);
	}
	@RequestMapping("/startQuestionnaire")
	@ResponseBody
	public Object startQuestionnaire(String questionnaireId, String startDate, String endDate) {
		int i = 0;
		try {
			i = Integer.parseInt(questionnaireId);
		} catch (Exception e) {
			// TODO: handle exception
			i = 0;
		}
		return questionnaireService.addQuestionnaireDistribution(i, startDate, endDate);
	}
	@RequestMapping("/addQuestionnaireQuestions")
	@ResponseBody
	public Object addQuestion(String questionnaireId, String questionId, String sequence) {
		int i = 0;
		try {
			i = Integer.parseInt(questionnaireId);
		} catch (Exception e) {
			// TODO: handle exception
			i = 0;
		}
		int j = 0;
		try {
			j = Integer.parseInt(questionId);
		} catch (Exception e) {
			// TODO: handle exception
			j = 0;
		}
		int n = 0;
		try {
			n = Integer.parseInt(sequence);
		} catch (Exception e) {
			// TODO: handle exception
			n = 0;
		}
		return questionnaireService.addQuestionnaireRel(i, j, n);
	}
	

	@RequestMapping("/deletQuestionnaire")
	@ResponseBody
	public Object deletQuestionnaire(String questionnaireId) {
		int i = 0;
		try {
			i = Integer.parseInt(questionnaireId);
		} catch (Exception e) {
			// TODO: handle exception
			i = 0;
		}
		return questionnaireService.deletQuestionnaire(i);
	}
}
