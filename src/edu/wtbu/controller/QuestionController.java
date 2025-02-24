package edu.wtbu.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import edu.wtbu.service.QuestionService;

@Controller
public class QuestionController {
	@Resource
	QuestionService questionService;

	@RequestMapping("/getQuestionsType")
	@ResponseBody
	public Object getQuestionsType() {
		return questionService.getQuestionsType();
	}
	@RequestMapping("/getAllQuestions")
	@ResponseBody
	public Object getAllQuestions(String startPage, String pageSize, String questionType, String name) {
		int i = 0;
		int start = 1;
		int size = 10;
		try {
			i = Integer.parseInt(questionType);
		} catch (Exception e) {
			// TODO: handle exception
			i = 0;
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
		return questionService.getAllQuestions(start, size, i, name);
	}
	@RequestMapping("/getQuestionById")
	@ResponseBody
	public Object getAllQuestions(String id) {
		int i = 0;
		try {
			i = Integer.parseInt(id);
		} catch (Exception e) {
			// TODO: handle exception
			i = 0;
		}
		return questionService.getQuestionById(i);
	}
	
	@RequestMapping("/addQuestion")
	@ResponseBody
	public Object addQuestion(String question, String questionType, String options) {
		int i = 0;
		try {
			i = Integer.parseInt(questionType);
		} catch (Exception e) {
			// TODO: handle exception
			i = 0;
		}
		return questionService.addQuestion(question, i, options);
	}
	
}
