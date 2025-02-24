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

	//ͳ�Ʒ���
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
//	�Աȷ���
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
//	�������
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
//	���ڷ���
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
	
//	��ȡ�������ʾ�����лش�
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
	
//	���ݻش��߻�ȡ�ش�
	@RequestMapping("/findRespondent")
	@ResponseBody
	public Object findRespondent(String respondent) {
		return answersService.findRespondent(respondent);
	}
	
//	��ӻش�
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
