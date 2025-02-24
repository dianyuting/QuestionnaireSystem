package edu.wtbu.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import edu.wtbu.dao.AnswersDao;
import edu.wtbu.dao.QuestionnaireDao;
import edu.wtbu.pojo.Result;
import edu.wtbu.service.AnswersService;

@Service
public class AnswersServiceImpl implements AnswersService {
	@Resource
	AnswersDao answersDao;
	@Resource
	QuestionnaireDao questionnaireDao;
	
//	添加被调查者的回答
	@Override
	public Object addAnswer(String respondent,int distributionId, int relId, String answer) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("respondent", respondent);
		map.put("relId", relId);
		map.put("distributionId", distributionId);
		map.put("answer", answer);
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = new Date();
		map.put("createTime", df.format(date));
		int r  = answersDao.addAnswer(map);
		if(r > 0) {
			result.setFlag("success");
		}
		return result;
	}

	@Override
	public Object findRespondent(String respondent) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		//根据回答者id获取，判断id是否重复
		List<HashMap<String, Object>> list = answersDao.findRespondent(respondent);
		if(list != null && list.size() > 0) {
			result.setFlag("success");
			result.setData(list);
		}else {
			result.setData("该答题者不存在");
		}
		return result;
	}

	@Override
	public Object statisticalAnalysis(int distributionId) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		//获取数据情况
		List<HashMap<String, Object>> list = answersDao.getAnswersByDistributionId(distributionId);
		if(list != null && list.size() > 0) {
//			定义返回的数据
			List<HashMap<String, Object>> r = processingData(list);
			result.setFlag("success");
			result.setData(r);
		}else {
			result.setData("该问卷无可分析题，或分析失败");
		}
		return result;
	}

	public List<HashMap<String, Object>> processingData(List<HashMap<String, Object>> list){
//		定义返回的数据
		List<HashMap<String, Object>> r = new ArrayList<HashMap<String,Object>>();
//		遍历数据库返回的用户回答情况，分析并返回统计结果
		for (HashMap<String, Object> hashMap : list) {
//			获取题目和题目类型
			String str = hashMap.get("sequence").toString() + "、" + hashMap.get("question").toString();
			int type = 0;
			try {
				type = Integer.parseInt(hashMap.get("question_types_id").toString());
			} catch (Exception e) {
				// TODO: handle exception
				type = 0;
			}
//			判断返回的数据是否有该题目，有则获取回答情况，对题目答题情况的进行统计，没有则添加题目信息
			if(r.stream().anyMatch(q -> q.get("questionName").equals(str))) {
				switch (type) {
				case 1:
				case 2:
//					单选题和多选题统计选项选择数量
					r.stream().filter(q -> q.get("questionName").equals(str)).map(q -> {
						String[] answers = hashMap.get("respondent_answer").toString().split(";");
						for(int i = 0; i < answers.length; i++) {
							for (HashMap<String, Object> hashMap3 : (List<HashMap<String,Object>>)q.get("answersParticular")) {
								if(hashMap3.get("option").equals(answers[i])) {
									hashMap3.put("count", (int)hashMap3.get("count") + 1);
								}
							}
						}
						return q;
					}).count();
					break;
				case 3:
//					赋分题目统计总分和答题人数，前端计算平均分
					r.stream().filter(q -> q.get("questionName").equals(str)).map(q -> {
						for (HashMap<String, Object> hashMap3 : (List<HashMap<String,Object>>)q.get("answersParticular")) {
							if(hashMap3.get("option").equals(hashMap.get("question_options"))) {
								hashMap3.put("count", Integer.parseInt(hashMap3.get("count").toString()) + 1);
								hashMap3.put("total", Integer.parseInt(hashMap3.get("total").toString()) + Integer.parseInt(hashMap.get("respondent_answer").toString()));
							}
						}
						return q;
					}).count();
					break;
				default:
					break;
				}
			}else {
//				获取题目信息和选项信息
				HashMap<String, Object> questionParticular = new HashMap<String, Object>();
				questionParticular.put("questionName", str);
				questionParticular.put("answerPeopleNum", list.stream().collect(Collectors.groupingBy(p -> p.get("respondent_id"))).size());
				questionParticular.put("question_types_id", hashMap.get("question_types_id"));
				List<HashMap<String, Object>> answersParticular = new ArrayList<HashMap<String,Object>>();
				if(type == 3) {
					answersParticular.add(new HashMap<String,Object>(){
						{
							Integer t = Integer.parseInt(hashMap.get("respondent_answer").toString());
							put("option", hashMap.get("question_options"));
							put("count", 1);
							put("total", t);
						}
					});
				}else {
					String[] options = hashMap.get("question_options").toString().split(";");
					String[] answers = hashMap.get("respondent_answer").toString().split(";");
					for(int i = 0; i < options.length; i++) {
						String option = options[i];
//						初始化选项信息时，判断该选项是否被用户选择，选择则数量为1
						if(Arrays.asList(answers).contains(option)) {
							answersParticular.add(new HashMap<String,Object>(){
								{
									put("option", option);
									put("count", 1);
								}
							});
						}else {
							answersParticular.add(new HashMap<String,Object>(){
								{
									put("option", option);
									put("count", 0);
								}
							});
						}
					}
				}
				questionParticular.put("answersParticular", answersParticular);
				r.add(questionParticular);
			}
		}
		return r;
	}

	@Override
	public Object comparativeAnalysis(int distributionId1, int distributionId2) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		
		//获取数据情况
		List<HashMap<String, Object>> list = answersDao.comparativeAnalysis(new HashMap<String, Object>(){{
			put("distributionId1", distributionId1);
			put("distributionId2", distributionId2);
		}});
//		定义返回的数据
		List<HashMap<String, Object>> r = new ArrayList<HashMap<String,Object>>();
		if(list != null && list.size() > 0) {
//			遍历数据库返回的用户回答情况，分析并返回统计结果
			for (HashMap<String, Object> hashMap : list) {
//				获取题目和题目类型
				String str = hashMap.get("question").toString();
				int type = 0;
				try {
					type = Integer.parseInt(hashMap.get("question_types_id").toString());
				} catch (Exception e) {
					// TODO: handle exception
					type = 0;
				}
//				判断返回的数据是否有该题目，有则获取回答情况，对题目答题情况的进行统计，没有则添加题目信息
				if(r.stream().anyMatch(q -> q.get("questionName").equals(str))) {
					switch (type) {
					case 1:
					case 2:
//						单选题和多选题统计选项选择数量
						r.stream().filter(q -> q.get("questionName").equals(str)).map(q -> {
							String[] answers = hashMap.get("respondent_answer").toString().split(";");
							if(Integer.parseInt(hashMap.get("questionnaire_distribution_id").toString()) == distributionId1) {
								for(int i = 0; i < answers.length; i++) {
									for (HashMap<String, Object> hashMap3 : (List<HashMap<String,Object>>)q.get("answersParticular")) {
										if(hashMap3.get("option").equals(answers[i])) {
											hashMap3.put("d1Count", Integer.parseInt(hashMap3.get("d1Count").toString()) + 1);
										}
									}
								}
							}else if(Integer.parseInt(hashMap.get("questionnaire_distribution_id").toString()) == distributionId2) {
								for(int i = 0; i < answers.length; i++) {
									for (HashMap<String, Object> hashMap3 : (List<HashMap<String,Object>>)q.get("answersParticular")) {
										if(hashMap3.get("option").equals(answers[i])) {
											hashMap3.put("d2Count", Integer.parseInt(hashMap3.get("d2Count").toString()) + 1);
										}
									}
								}
							}
							return q;
						}).count();
						break;
					case 3:
//						赋分题目统计总分和答题人数，前端计算平均分
						r.stream().filter(q -> q.get("questionName").equals(str)).map(q -> {
							for (HashMap<String, Object> hashMap3 : (List<HashMap<String,Object>>)q.get("answersParticular")) {
								if(hashMap3.get("option").equals(hashMap.get("question_options"))) {
									if(Integer.parseInt(hashMap.get("questionnaire_distribution_id").toString()) == distributionId1) {
										hashMap3.put("d1Count", Integer.parseInt(hashMap3.get("d1Count").toString()) + 1);
										hashMap3.put("d1Total", Integer.parseInt(hashMap3.get("d1Total").toString()) + Integer.parseInt(hashMap.get("respondent_answer").toString()));
									}else if(Integer.parseInt(hashMap.get("questionnaire_distribution_id").toString()) == distributionId2) {
										hashMap3.put("d2Count", Integer.parseInt(hashMap3.get("d2Count").toString()) + 1);
										hashMap3.put("d2Total", Integer.parseInt(hashMap3.get("d2Total").toString()) + Integer.parseInt(hashMap.get("respondent_answer").toString()));
									}
								}
							}
							return q;
						}).count();
						break;
					default:
						break;
					}
				}else {
//					获取题目信息和选项信息
					HashMap<String, Object> questionParticular = new HashMap<String, Object>();
					questionParticular.put("questionName", str);
					List<HashMap<String,Object>> d1list = list.stream().filter(p -> p.get("questionnaire_distribution_id").toString().equals(String.valueOf(distributionId1))).collect(Collectors.toList());
					List<HashMap<String,Object>> d2list = list.stream().filter(p -> p.get("questionnaire_distribution_id").toString().equals(String.valueOf(distributionId2))).collect(Collectors.toList());
					questionParticular.put("d1AnswerPeopleNum", d1list.stream().collect(Collectors.groupingBy(p -> p.get("respondent_id"))).size());
					questionParticular.put("d2AnswerPeopleNum", d2list.stream().collect(Collectors.groupingBy(p -> p.get("respondent_id"))).size());
					questionParticular.put("question_types_id", hashMap.get("question_types_id"));
					questionParticular.put("d1QuestionnaireName", d1list.get(0).get("questionnaire_name"));
					questionParticular.put("d1StartDate", d1list.get(0).get("start_date"));
					questionParticular.put("d1EndDate", d1list.get(0).get("end_date"));
					questionParticular.put("d2QuestionnaireName", d2list.get(0).get("questionnaire_name"));
					questionParticular.put("d2StartDate", d2list.get(0).get("start_date"));
					questionParticular.put("d2EndDate", d2list.get(0).get("end_date"));
					List<HashMap<String, Object>> answersParticular = new ArrayList<HashMap<String,Object>>();
					if(type == 3) {
						if(Integer.parseInt(hashMap.get("questionnaire_distribution_id").toString()) == distributionId1) {
							answersParticular.add(new HashMap<String,Object>(){{
								put("option", hashMap.get("question_options"));
								put("d1Count", 1);
								put("d1Total", Integer.parseInt(hashMap.get("respondent_answer").toString()));
								put("d2Count", 0);
								put("d2Total", 0);
							}});
							}else if(Integer.parseInt(hashMap.get("questionnaire_distribution_id").toString()) == distributionId2) {
								answersParticular.add(new HashMap<String,Object>(){{
									put("option", hashMap.get("question_options"));
									put("d2Count", 1);
									put("d2Total", Integer.parseInt(hashMap.get("respondent_answer").toString()));
									put("d1Count", 0);
									put("d1Total", 0);
								}});
							}
					}else {
						String[] options = hashMap.get("question_options").toString().split(";");
						String[] answers = hashMap.get("respondent_answer").toString().split(";");
						if(Integer.parseInt(hashMap.get("questionnaire_distribution_id").toString()) == distributionId1) {
							for(int i = 0; i < options.length; i++) {
								String option = options[i];
								if(Arrays.asList(answers).contains(option)) {
									answersParticular.add(new HashMap<String,Object>(){
										{
											put("option", option);
											put("d1Count", 1);
											put("d2Count", 0);
										}
									});
								}else {
									answersParticular.add(new HashMap<String,Object>(){
										{
											put("option", option);
											put("d1Count", 0);
											put("d2Count", 0);
										}
									});
								}
							}
						}else if(Integer.parseInt(hashMap.get("questionnaire_distribution_id").toString()) == distributionId2) {
							for(int i = 0; i < options.length; i++) {
								String option = options[i];
								if(Arrays.asList(answers).contains(option)) {
									answersParticular.add(new HashMap<String,Object>(){
										{
											put("option", option);
											put("d1Count", 0);
											put("d2Count", 1);
										}
									});
								}else {
									answersParticular.add(new HashMap<String,Object>(){
										{
											put("option", option);
											put("d1Count", 0);
											put("d2Count", 0);
										}
									});
								}
							}
						}
					}
					questionParticular.put("answersParticular", answersParticular);
					r.add(questionParticular);
				}
			}
			result.setFlag("success");
			result.setData(r);
		}else {
			result.setData("该问卷无可分析题，或分析失败");
		}
		return result;
	}

	@Override
	public Object crossAnalysis(int distributionId, int relId1, int relId2) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		
		//获取数据情况
		List<HashMap<String, Object>> list = answersDao.crossAnalysis(new HashMap<String, Object>(){{
			put("distributionId", distributionId);
			put("relId1", relId1);
			put("relId2", relId2);
		}});
//		定义返回的数据
		List<HashMap<String, Object>> r = new ArrayList<HashMap<String,Object>>();
		if(list != null && list.size() > 0) {
			//根据回答者分组
			
			List<List<HashMap<String, Object>>> gByPeople = list.stream().collect(Collectors.groupingBy(res -> res.get("respondent_id"))).values().stream().collect(Collectors.toList());
			gByPeople.forEach(f -> f.sort(Comparator.comparing(res -> Integer.parseInt(((HashMap<String, Object>) res).get("sequence").toString()))));
			r.add(new HashMap<String, Object>(){
				{
					put("questionName",gByPeople.get(0).get(0).get("sequence").toString() + "、" + gByPeople.get(0).get(0).get("question").toString());
					put("answerPeopleNum", gByPeople.size());
					put("question_types_id", gByPeople.get(0).get(0).get("question_types_id"));
					put("question_options",gByPeople.get(0).get(0).get("question_options"));
				}
			});
			r.add(new HashMap<String, Object>(){
				{
					put("questionName",gByPeople.get(0).get(1).get("sequence").toString() + "、" + gByPeople.get(0).get(1).get("question").toString());
					put("answerPeopleNum", gByPeople.size());
					put("question_types_id", gByPeople.get(0).get(1).get("question_types_id"));
					put("question_options",gByPeople.get(0).get(1).get("question_options"));
				}
			});
			r.add(new HashMap<String, Object>(){
				{
					put("answersParticular",new ArrayList<HashMap<String, Object>>());
				}
			});
//			遍历数据库返回的用户回答情况，分析并返回统计结果
			for (List<HashMap<String, Object>> l : gByPeople) {
				//判断题目1和题目2的类型
				if(l.get(0).get("question_types_id").toString().equals("3") && !l.get(1).get("question_types_id").toString().equals("3")) {
//					判断返回的数据是否有该答题情况，有则获取回答情况，对题目答题情况的进行统计，没有则添加该答题情况
					String[] answers2 = l.get(1).get("respondent_answer").toString().split(";");
					for(int i = 0; i < answers2.length; i++) {
						String str = answers2[i];
						if(((List<HashMap<String, Object>>) r.get(2).get("answersParticular")).size() > 0 && ((Collection<HashMap<String, Object>>) r.get(2).get("answersParticular")).stream().anyMatch(q -> q.get("option").equals(str))) {
							((Collection<HashMap<String, Object>>) r.get(2).get("answersParticular")).stream().filter(q -> q.get("option").equals(str)).map(q -> {
								q.put("count",Integer.parseInt(q.get("count").toString()) + 1);
								q.put("total",Integer.parseInt(q.get("total").toString()) + Integer.parseInt(l.get(0).get("respondent_answer").toString()));
								return q;
							}).count();
						}else {
							HashMap<String, Object> answersParticular = new HashMap<String,Object>();
							answersParticular.put("option", answers2[i]);
							answersParticular.put("count", 1);
							answersParticular.put("total", Integer.parseInt(l.get(0).get("respondent_answer").toString()));
							((List<HashMap<String, Object>>) r.get(2).get("answersParticular")).add(answersParticular);
						}
					}
				}else if(!l.get(0).get("question_types_id").toString().equals("3") && l.get(1).get("question_types_id").toString().equals("3")) {
					String[] answers1 = l.get(0).get("respondent_answer").toString().split(";");
					for(int i = 0; i < answers1.length; i++) {
						String str = answers1[i];
						if(((List<HashMap<String, Object>>) r.get(2).get("answersParticular")).size() > 0 && ((Collection<HashMap<String, Object>>) r.get(2).get("answersParticular")).stream().anyMatch(q -> q.get("option").equals(str))) {
							((Collection<HashMap<String, Object>>) r.get(2).get("answersParticular")).stream().filter(q -> q.get("option").equals(str)).map(q -> {
								q.put("count",Integer.parseInt(q.get("count").toString()) + 1);
								q.put("total",Integer.parseInt(q.get("total").toString()) + Integer.parseInt(l.get(1).get("respondent_answer").toString()));
								return q;
							}).count();
						}else {
							HashMap<String, Object> answersParticular = new HashMap<String,Object>();
							answersParticular.put("option", answers1[i]);
							answersParticular.put("count", 1);
							answersParticular.put("total", Integer.parseInt(l.get(1).get("respondent_answer").toString()));
							((List<HashMap<String, Object>>) r.get(2).get("answersParticular")).add(answersParticular);
						}
					}
				}else if(!l.get(0).get("question_types_id").toString().equals("3") && !l.get(1).get("question_types_id").toString().equals("3")) {
					String[] answers2 = l.get(1).get("respondent_answer").toString().split(";");
					String[] answers1 = l.get(0).get("respondent_answer").toString().split(";");
					for(int i = 0; i < answers1.length; i++) {
						for(int j = 0; j < answers2.length; j++) {
							String str = answers1[i] + "-" + answers2[j];
							if(((List<HashMap<String, Object>>) r.get(2).get("answersParticular")).size() > 0 && ((Collection<HashMap<String, Object>>) r.get(2).get("answersParticular")).stream().anyMatch(q -> q.get("option").equals(str))) {
								((Collection<HashMap<String, Object>>) r.get(2).get("answersParticular")).stream().filter(q -> q.get("option").equals(str)).map(q -> {
									q.put("count",Integer.parseInt(q.get("count").toString()) + 1);
									return q;
								}).count();
							}else {
								HashMap<String, Object> answersParticular = new HashMap<String,Object>();
								answersParticular.put("option", answers1[i] + "-" + answers2[j]);
								answersParticular.put("count", 1);
								((List<HashMap<String, Object>>) r.get(2).get("answersParticular")).add(answersParticular);
							}
						}
					}
				}
			}
		}
		if(r != null && r.size() > 0) {
			result.setFlag("success");
			result.setData(r);
		}else {
			result.setData("该问卷无可分析题，或分析失败");
		}
		return result;
	}

	@Override
	public Object cycleAnalysis(int distributionId, String start, String end) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		List<HashMap<String, Object>> questionnaireIds = questionnaireDao.getDistributionIdByDate(new HashMap<String, Object>(){{
			put("questionnaireId", questionnaireDao.getQuestionnaireIdByDistributionId(distributionId));
			put("startDate", start + " 00:00:00:000");
			put("endDate", end + " 23:59:59:998");
		}});
		//			定义返回的数据
		List<HashMap<String, Object>> r = null;
		for (HashMap<String, Object> hashMap : questionnaireIds) {
			//获取数据情况
			List<HashMap<String, Object>> list = answersDao.getAnswersByDistributionId(Integer.parseInt(hashMap.get("id").toString()));
			if(list != null && list.size() > 0) {
				if(r != null && r.size() > 0) {
					List<HashMap<String, Object>> let = processingData(list);
					for (HashMap<String, Object> hashMap2 : let) {
						r.stream().filter(q -> q.get("questionName").equals(hashMap2.get("questionName"))).forEach(q -> {
							q.put("answerPeopleNum", Integer.parseInt(q.get("answerPeopleNum").toString()) + Integer.parseInt(hashMap2.get("answerPeopleNum").toString()));
							List<HashMap<String, Object>> a1 = (List<HashMap<String, Object>>) q.get("answersParticular");
							List<HashMap<String, Object>> a2 = (List<HashMap<String, Object>>) hashMap2.get("answersParticular");
							if(q.get("question_types_id").toString().equals("3")) {
								a1.get(0).put("total", Integer.parseInt(a1.get(0).get("total").toString()) + Integer.parseInt(a2.get(0).get("total").toString()));
								a1.get(0).put("count", Integer.parseInt(a1.get(0).get("count").toString()) + Integer.parseInt(a2.get(0).get("count").toString()));
							}else {
								for (HashMap<String, Object> hashMap3 : a2) {
									a1.stream().filter(o -> o.get("option").equals(hashMap3.get("option"))).forEach(o -> {
										o.put("count", Integer.parseInt(o.get("count").toString()) + Integer.parseInt(hashMap3.get("count").toString()));
									});
								}
							}
						});
					}
				}else {
					r = processingData(list);
				}
			}
		}
		if(r != null && r.size() > 0) {
			result.setFlag("success");
			result.setData(r);
		}else {
			result.setData("该问卷无可分析题，或分析失败");
		}
		return result;
	}

	@Override
	public Object getAllAnswers(int distributionId) {
		// TODO Auto-generated method stub
		Result result = new Result("fail");
		List<HashMap<String, Object>> list = answersDao.getAllAnswersByDistributionId(distributionId);
		if(list != null && list.size() > 0) {
			//根据回答者的id对回答情况进行分组
			Map<Object, List<HashMap<String, Object>>> map = list.stream().collect(Collectors.groupingBy(r -> r.get("respondent_id")));
			List<List<HashMap<String, Object>>> r = map.values().stream().collect(Collectors.toList());
			if(r != null && r.size() > 0) {
				result.setFlag("success");
				result.setData(r);
			}
		}else {
			result.setData("暂无回答");
		}
		return result;
	}

}
