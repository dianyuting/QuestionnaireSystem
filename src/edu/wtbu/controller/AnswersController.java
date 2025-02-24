package edu.wtbu.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import edu.wtbu.service.AnswersService;

@Controller
public class AnswersController {
	@Resource
	AnswersService answersService;

	//统计分析
	@RequestMapping("/statisticalAnalysis")
	@ResponseBody
	public Object statisticalAnalysis(String distributionId) {
		int i = 0;
		try {
			i = Integer.parseInt(distributionId);
		} catch (Exception e) {
			// TODO: handle exception
			i = 0;
		}
		return answersService.statisticalAnalysis(i);
	}
//	对比分析
	@RequestMapping("/comparativeAnalysis")
	@ResponseBody
	public Object comparativeAnalysis(String distributionId1, String distributionId2) {
		int i = 0;
		int j = 0;
		try {
			i = Integer.parseInt(distributionId1);
		} catch (Exception e) {
			// TODO: handle exception
			i = 0;
		}
		try {
			j = Integer.parseInt(distributionId2);
		} catch (Exception e) {
			// TODO: handle exception
			j = 0;
		}
		return answersService.comparativeAnalysis(i, j);
	}
//	交叉分析
	@RequestMapping("/crossAnalysis")
	@ResponseBody
	public Object crossAnalysis(String distributionId, String relId1, String relId2) {
		int i = 0;
		try {
			i = Integer.parseInt(distributionId);
		} catch (Exception e) {
			// TODO: handle exception
			i = 0;
		}
		int r1 = 0;
		try {
			r1 = Integer.parseInt(relId1);
		} catch (Exception e) {
			// TODO: handle exception
			r1 = 0;
		}
		int r2 = 0;
		try {
			r2 = Integer.parseInt(relId2);
		} catch (Exception e) {
			// TODO: handle exception
			r2 = 0;
		}
		return answersService.crossAnalysis(i, r1, r2);
	}
//	周期分析
	@RequestMapping("/cycleAnalysis")
	@ResponseBody
	public Object cycleAnalysis(String distributionId, String start, String end) {
		int i = 0;
		try {
			i = Integer.parseInt(distributionId);
		} catch (Exception e) {
			// TODO: handle exception
			i = 0;
		}
		return answersService.cycleAnalysis(i, start, end);
	}
	
//	获取发布的问卷的所有回答
	@RequestMapping("/getAllAnswers")
	@ResponseBody
	public Object getAllAnswersByDistributionId(String distributionId) {
		int i = 0;
		try {
			i = Integer.parseInt(distributionId);
		} catch (Exception e) {
			// TODO: handle exception
			i = 0;
		}
		return answersService.getAllAnswers(i);
	}
	
//	根据回答者获取回答
	@RequestMapping("/findRespondent")
	@ResponseBody
	public Object findRespondent(String respondent) {
		return answersService.findRespondent(respondent);
	}
	
//	添加回答
	@RequestMapping("/addAnswer")
	@ResponseBody
	public Object addAnswer(String respondent,String distributionId,String relId,String answer) {
		int i = 0;
		int r = 0;
		try {
			i = Integer.parseInt(distributionId);
		} catch (Exception e) {
			// TODO: handle exception
			i = 0;
		}
		try {
			r = Integer.parseInt(relId);
		} catch (Exception e) {
			// TODO: handle exception
			r = 0;
		}
		return answersService.addAnswer(respondent, i, r, answer);
	}
}
