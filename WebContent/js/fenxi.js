var seachObj = {};
var user = {};
var id = 0;
var page = 0;
var answersData = [];
$(document).ready(function(){
    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
        
    }
    // 获取url传递过来的问卷发布id
    var p = new URLSearchParams(window.location.search);
    id = p.get("id");
    var param = {}
    param.distributionId = id;
    // 翻页按钮点击事件
    $(".step-backward").click(function(){
        if(seachObj.startPage == 1){
            alert("已经是第一页");
        }else{
            getAllQuestionnaire(1,seachObj.pageSize);
        }
    })
    $(".chevron-left").click(function(){
        if(seachObj.startPage == 1){
            alert("已经是第一页");
        }else{
            getAllQuestionnaire(seachObj.startPage - 1,seachObj.pageSize);
        }
    })
    $(".pageSelect").change(function(){
        getAllQuestionnaire($(this).val(),seachObj.pageSize);
    })
    $(".chevron-right").click(function(){
        if(seachObj.startPage == seachObj.totalPages){
            alert("已经是最后一页");
        }else{
            getAllQuestionnaire(seachObj.startPage + 1,seachObj.pageSize);
        }
    })
    $(".step-forward").click(function(){
        if(seachObj.startPage == seachObj.totalPages){
            alert("已经是最后一页");
        }else{
            getAllQuestionnaire(seachObj.totalPages,seachObj.pageSize);
        }
    })

    //查看所有回答
    $(".lookAnswers").click(function(){
        $(".show").html("");
        $(".foot").css("display","none");
        $.ajax({
            url:" http://localhost:8080/QuestionnaireSystem/getAllAnswers",
            data:"distributionId=" + id,
            type:"post",
            success:function(msg){
                var obj = msg;
                if(typeof(msg) != 'object') obj = JSON.parse(msg);
                if(obj.flag == "success"){
                    data = obj.data;
                    lookAnswersByPage(0);
                }else{
                    alert(data);
                }
            }
        })
    })
    // 统计分析
    $(".statistical").click(function(){
        $(".show").html("");
        $(".bBox").css("display","none");
        $(".foot").css("display","none");
        $.ajax({
            url:" http://localhost:8080/QuestionnaireSystem/statisticalAnalysis",
            data:"distributionId=" + id,
            type:"post",
            success:function(msg){
                var obj = msg;
                if(typeof(msg) != 'object') obj = JSON.parse(msg);
                if(obj.flag == "success"){
                    var data = obj.data;
                    var html = "<p>回答人数：" + data[0].answerPeopleNum + "</p>";
                    for(let i = 0; i < data.length; i++){
                        html += "<p>" + data[i].questionName + "</p>";
                        if(data[i].question_types_id == 3){
                            html += "<p>分制：" + data[i].answersParticular[0].option + "</p>" +
                            "<p>平均值：" + (data[i].answersParticular[0].total / data[i].answersParticular[0].count).toFixed(2) + "</p>";
                        }else{
                            for(let j = 0; j < data[i].answersParticular.length; j++){
                                html += "<p>" + data[i].answersParticular[j].option + "：" + data[i].answersParticular[j].count + "</p>";
                            }
                        }
                    }
                    $(".show").html(html);
                }else{
                    alert(obj.data);
                }
            }
        })
    })
    //对比分析，再次获取所有的问卷发布列表，选择一个得到id进行分析
    $(".comparative").click(function(){
        $(".show").html("");
        $(".bBox").css("display","none");
        $(".foot").css("display","flex");
        getAllQuestionnaire(1,8);
    })
    $(".comparativeOk").click(function(){
        var i = $(".wj input[type='radio']:checked").val();
        var p = {};
        p.distributionId1 = id;
        p.distributionId2 = i;
        if(i == undefined || i == null || i == ''){
            alert("请选择对比的问卷");
            return;
        }
        var is = false;
        $.ajax({
            url:" http://localhost:8080/QuestionnaireSystem/getAllAnswers",
            data:"distributionId=" + i,
            async:false,
            type:"post",
            success:function(msg){
                var obj = msg;
                if(typeof(msg) != 'object') obj = JSON.parse(msg);
                if(obj.flag == "success"){
                    data = obj.data;
                    lookAnswersByPage(0);
                }else{
                    alert(obj.data);
                    is = true;
                    return
                }
            }
        })
        if(is) return;
        $.ajax({
            url:" http://localhost:8080/QuestionnaireSystem/comparativeAnalysis",
            data:p,
            type:"post",
            success:function(msg){
                var obj = msg;
                if(typeof(msg) != 'object') obj = JSON.parse(msg);
                if(obj.flag == "success"){
                    var data = obj.data;
                    data = data.sort((a,b) => {
                        return a.questionName.substring(0,1) - b.questionName.substring(0,1);
                    })
                    var w2 = data[0].d2QuestionnaireName + "：" + data[0].d2StartDate.substring(0,11) + "至" + data[0].d2EndDate.substring(0,11);
                    var w1 = data[0].d1QuestionnaireName + "：" + data[0].d1StartDate.substring(0,11) + "至" + data[0].d1EndDate.substring(0,11);
                    var html = "<table cellspacing='0'><tr><td></td><td>" + w1 + "</td><td>" + w2 + "</td></tr>"+
                                "<tr><td>回答人数</td><td>" + data[0].d1AnswerPeopleNum + "</td><td>" + data[0].d2AnswerPeopleNum +"</td></tr>";
                    for(let i = 0; i < data.length; i++){
                        html += "<tr><td>" + data[i].questionName + "</td><td></td><td></td></tr>";
                        if(data[i].question_types_id == 3){
                            html += "<tr><td>平均值/分制</td><td>" + (data[i].answersParticular[0].d1Total / data[i].answersParticular[0].d1Count).toFixed(2) + "/" + data[i].answersParticular[0].option + "</td>"+
                            "<td>" + (data[i].answersParticular[0].d2Total / data[i].answersParticular[0].d2Count).toFixed(2) + "/" + data[i].answersParticular[0].option + "</td></tr>";
                        }else{
                            for(let j = 0; j < data[i].answersParticular.length; j++){
                                html += "<tr><td>" + data[i].answersParticular[j].option + "</td><td>" + data[i].answersParticular[j].d1Count + "</td><td>"+
                                data[i].answersParticular[j].d2Count + "</td>";
                            }
                        }
                    }
                    html += "</table>";
                    $(".show").html(html);
                    $(".foot").css("display","none");
                }else{
                    alert(obj.data);
                }
            }
        })
    })
    //交叉分析，根据id获取该问卷所有题目，选择两个题目关系进行分析
    $(".cross").click(function(){
        $(".show").html("");
        $(".bBox").css("display","none");
        $(".foot").css("display","none");
        $.ajax({
            url:" http://localhost:8080/QuestionnaireSystem/getQuestionsByQuestionnaireId",
            data:"questionnaireId=" + id,
            type:"post",
            success:function(msg){
                var obj = msg;
                if(typeof(msg) != 'object') obj = JSON.parse(msg);
                if(obj.flag == "success"){
                    var data = obj.data;
                    var html = "";
                    for(let i = 0; i < data.length; i++){
                        if(data[i].question_types_id == 4) continue;
                        html += "<div class='tm'><input type='checkbox' name='" + data[1].questionnaire_name + "' value='" + data[i].id + "&" + data[i].question_types_id + "'/>" +
                                "<span>" + data[i].question + "</span></div>";
                    }
                    html += "<button onclick='ok()'>确定</button>";
                    $(".show").html(html);
                }
            }
        })
    })
    // 周期分析点击事件
    $(".cycle").click(function(){
        $(".show").html("");
        $(".bBox").css("display","none");
        $(".foot").css("display","none");
        $(".p").css("display","flex");
        $(".fb").css("display","flex");
    })
    // 周期分析遮罩层
    $(".p").click(function(){
        $(".p").css("display","none");
        $(".fb").css("display","none");
    })
    $(".fb").click(function(event){
        event.stopPropagation();
    })
    // 周期分析确定日期
    $('.qd').click(function(){
        var p ={};
        p.distributionId = id;
        var startDate = $(".startDate").val();
        var endDate = $(".endDate").val();
        if(startDate > endDate){
            alert("请输入正确的时间区间");
            return;
        }
        p.start = startDate;
        p.end = endDate;
        $.ajax({
            url:" http://localhost:8080/QuestionnaireSystem/cycleAnalysis",
            data:p,
            type:"post",
            success:function(msg){
                var obj = msg;
                if(typeof(msg) != 'object') obj = JSON.parse(msg);
                if(obj.flag == "success"){
                    var data = obj.data;
                    $(".p").css("display","none");
                    $(".fb").css("display","none");
                    var html = "<p>回答人数：" + data[0].answerPeopleNum + "</p>";
                    for(let i = 0; i < data.length; i++){
                        html += "<p>" + data[i].questionName + "</p>";
                        if(data[i].question_types_id == 3){
                            html += "<p>分制：" + data[i].answersParticular[0].option + "</p>" +
                            "<p>平均值：" + (data[i].answersParticular[0].total / data[i].answersParticular[0].count).toFixed(2) + "</p>";
                        }else{
                            for(let j = 0; j < data[i].answersParticular.length; j++){
                                html += "<p>" + data[i].answersParticular[j].option + "：" + data[i].answersParticular[j].count + "</p>";
                            }
                        }
                    }
                    $(".show").html(html);
                }else{
                    alert(obj.data);
                    return;
                }
            }
        })
    })
})
//显示所有回答
function lookAnswersByPage(p){
    if(p < 0){
        alert("已经是第一页");
        return;
    }
    if(p >= Math.ceil(data.length / 10)){
        alert("已经是最后一页");
        return;
    }
    page = p;
    var html = "<div class='answersBox'><ul>";
    var l = ((page + 1) * 10) < data.length ? (page + 1) * 10 : data.length;
    for(let i = page * 10; i < l; i++){
        html += "<li><div class='answer'>";
        data[i].sort((a,b) => {return a.sequence - b.sequence});
        for(let j = 0; j < data[i].length; j++){
            html += "<div>" +
            "<p>" + data[i][j].sequence + "、" + data[i][j].question + "</p>";
            switch (parseInt(data[i][j].question_types_id)) {
                case 1:
                    var a = data[i][j].respondent_answer.split(";")
                    for(let x = 0; x < a.length - 1; x++){
                        html += "<input type='radio' disabled/><span>" + a[x] + "</span><br/>";
                    }
                    break;
                case 2:
                    var a = data[i][j].respondent_answer.split(";")
                    for(let x = 0; x < a.length - 1; x++){
                        html += "<input type='checkbox' disabled/><span>" + a[x] + "</span><br/>";
                    }
                    break;
                case 3:
                    html += "<input type='range' min='0' max='" + data[i][j].question_options + "' value='" + data[i][j].question_options + "' disabled/><span>" + data[i][j].question_options + "</span>";
                    break;
                case 4:
                    html += "<input type='text' disabled/>";
                    break;
                default:
                    break;
            }
            html += "<div>" + "回答：" + data[i][j].respondent_answer + "</div></div>";
        }
        html += "</div></li>";
    }
    html += "</ul></div>";
    $(".show").html(html);
    $(".bBox").css("display","block");
    $(".bBox").html("<button onclick='lookAnswersByPage(" + (page - 1) + ")'>上一页</button><button onclick='lookAnswersByPage(" + (page + 1) + ")'>下一页</button>");
    $(".answersBox ul li").css("width", 100 / (l - page * 10) + "%");
    $(".answersBox ul li").hover(function(event){
        for(let i = 0; i < $(".answersBox ul li").length; i++){
            if($(".answersBox ul li").get(i) == event.target) continue;
            $(".answersBox ul li").eq(i).css("width", 30 / ((l - page * 10) - 1) + "%");
        }
        $(this).css("width","70%");
        $(this).css("height","calc(100% - 2px)");
        $(this).css("white-space","normal");
    },function(){
        $(".answersBox ul li").css("width", 100 / (l - page * 10) + "%");
        $(".answersBox ul li").css("height","90%");
        $(".answersBox ul li").css("white-space","nowrap");
    });
}

//交叉分析
function ok(){
    var arr = [];
    $(".tm input[type='checkbox']:checked").each(function(){
        arr.push($(this).val());
    })
    if(arr.length != 2){
        alert("请选择两个题目");
        return;
    }
    var p = {};
    p.distributionId = id;
    if(arr[0].split("&")[1] == "3" && arr[1].split("&")[1] == "3"){
        alert("两个赋分题无法进行交叉分析，请重新选择");
        return;
    }
    p.relId1 = arr[0].split("&")[0];
    p.relId2 = arr[1].split("&")[0];
    $.ajax({
        url:" http://localhost:8080/QuestionnaireSystem/crossAnalysis",
        data:p,
        type:"post",
        success:function(msg){
            var obj = msg;
            if(typeof(msg) != 'object') obj = JSON.parse(msg);
            if(obj.flag == "success"){
                html = "<p>a：" + obj.data[0].questionName + "</P>" +
                        "<p>b：" + obj.data[1].questionName + "</P>" +
                        "<p>回答人数" + obj.data[0].answerPeopleNum + "</p>";
                if(obj.data[0].question_types_id == 3 && obj.data[1].question_types_id != 3){
                    html += "<table cellspacing='0' class='crossAnalysisBox'><thead><tr><td class='xiexian'>"+
                            "<div>b</div><div>a</div></td>";
                    var bo = obj.data[1].question_options.split(";");
                    for(let i = 0; i < bo.length - 1; i++){
                        html += "<td>" + bo[i] + "</td>";
                    }
                    html += "</tr></thead><tr><td>平均</td>";
                    for(let i = 0; i < bo.length - 1; i++){
                        for(let j = 0; j < obj.data[2].answersParticular.length; j++){
                            if(bo[i] == obj.data[2].answersParticular[j].option){
                                html += "<td>" + (obj.data[2].answersParticular[j].total / obj.data[2].answersParticular[j].count).toFixed(2) + "</td>";
                            }
                        }
                    }
                    html += "</tr></table>";
                    $(".show").html(html);
                }else if(obj.data[0].question_types_id != 3 && obj.data[1].question_types_id == 3){
                    html += "<table cellspacing='0' class='crossAnalysisBox'><thead><tr><td class='xiexian'>"+
                            "<div>a</div><div>b</div></td>";
                    var bo = obj.data[0].question_options.split(";");
                    for(let i = 0; i < bo.length - 1; i++){
                        html += "<td>" + bo[i] + "</td>";
                    }
                    html += "</tr></thead><tr><td>平均</td>";
                    for(let i = 0; i < bo.length - 1; i++){
                        for(let j = 0; j < obj.data[2].answersParticular.length; j++){
                            if(bo[i] == obj.data[2].answersParticular[j].option){
                                html += "<td>" + (obj.data[2].answersParticular[j].total / obj.data[2].answersParticular[j].count).toFixed(2) + "</td>";
                            }
                        }
                    }
                    html += "</tr></table>";
                    $(".show").html(html);
                }else{
                    html += "<table cellspacing='0' class='crossAnalysisBox'><thead><tr><td class='xiexian'>"+
                            "<div>a</div><div>b</div></td>";
                    var bo1 = obj.data[0].question_options.split(";");
                    var bo2 = obj.data[1].question_options.split(";");
                    for(let i = 0; i < bo1.length - 1; i++){
                        html += "<td>" + bo1[i] + "</td>";
                    }
                    html += "</tr></thead>";
                    var have = false;
                    for(let j = 0; j < bo2.length - 1; j++){
                        html += "<tr><td>" + bo2[j] + "</td>";
                        for(let i = 0; i < bo1.length - 1; i++){
                            html += "<td>";
                            for(let k = 0; k < obj.data[2].answersParticular.length; k++){
                                var a = obj.data[2].answersParticular[k].option.split("-")[0];
                                var b = obj.data[2].answersParticular[k].option.split("-")[1];
                                if(a == bo1[i] && b == bo2[j]){
                                    html += obj.data[2].answersParticular[k].count;
                                    have = true;
                                }
                            }
                            html += "</td>";
                        }
                        html += "</tr>";
                    }
                    html += "</table>";
                    $(".show").html(html);
                }
            }else{
                alert(obj.data);
                return;
            }
        }
    })

}

// 问卷列表显示
function getAllQuestionnaire(startPage,pageSize){
    var param = {};
    param.name = "";
    param.companyId = user.company_id;
    param.uid = 0;
    param.startPage = startPage;
    param.pageSize = pageSize;
    seachObj.startPage = startPage;
    seachObj.pageSize = pageSize;
    $.ajax({
        url:" http://localhost:8080/QuestionnaireSystem/getAllQuestionnaire",
        data:param,
        type:"post",
        success:function(msg){
            var obj = msg;
            if(typeof(msg) != 'object') obj = JSON.parse(msg);
            if(obj.flag == "success"){
                var html = "";
                var data = obj.data;
                for(let i = 0; i < data.length; i++){
                    if(data[i].id == id) continue;
                    html += "<div class='wj'><input type='radio' name='wj' value='" + data[i].id + "'/>" +
                    "<span>" + data[i].questionnaire_name + "：" + data[i].start_date.substring(0,10) + "至" + data[i].end_date.substring(0,10) + "</span></div>";
                }
                $(".show").html(html);
                var totalPages = Math.ceil(obj.page.total / obj.page.pageSize);
                var optionStr = "";
                for(let i = 1; i <= totalPages; i++){
                    if(obj.page.startPage == i){
                        optionStr += "<option value='" + i + "' selected>"+ i +"</option>";
                    }else{
                        optionStr += "<option value='" + i + "'>"+ i +"</option>";
                    }
                }
                $(".pageSelect").html(optionStr);
            }
        }
    })
}