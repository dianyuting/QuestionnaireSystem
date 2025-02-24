var seachObj = {};
var questions = [];
var user = {};
$(document).ready(function(){
    getQuestions(1,10);
    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
        
    }
    // 翻页按钮点击事件
    $(".step-backward").click(function(){
        if(seachObj.startPage == 1){
            alert("已经是第一页");
        }else{
            getQuestions(1,seachObj.pageSize);
        }
    })
    $(".chevron-left").click(function(){
        if(seachObj.startPage == 1){
            alert("已经是第一页");
        }else{
            getQuestions(seachObj.startPage - 1,seachObj.pageSize);
        }
    })
    $(".pageSelect").change(function(){
        getQuestions($(this).val(),seachObj.pageSize);
    })
    $(".chevron-right").click(function(){
        if(seachObj.startPage == seachObj.totalPages){
            alert("已经是最后一页");
        }else{
            getQuestions(seachObj.startPage + 1,seachObj.pageSize);
        }
    })
    $(".step-forward").click(function(){
        if(seachObj.startPage == seachObj.totalPages){
            alert("已经是最后一页");
        }else{
            getQuestions(seachObj.totalPages,seachObj.pageSize);
        }
    })

    // 移除、添加、显示问题，用全局变量问题数组记录及操作
    $(".removeQ").click(function(){
        for(let i = 0; i < questions.length; i++){
            if(questions[i].id == $(".styleCheck p").eq(0).attr("class")){
                questions.splice(i,1);
                return;
            }
        }
    })
    $(".addQ").click(function(){
        if(!$(".styleCheck p").eq(0).attr("class")) return;
        for(let i = 0; i < questions.length; i++){
            if(questions[i].id == $(".styleCheck p").eq(0).attr("class")){
                alert("不可重复添加");
                return;
            }
        }
        var question = {};
        question.id = $(".styleCheck p").eq(0).attr("class");
        question.name = $(".styleCheck p").eq(0).text();
        questions.push(question);
    })
    $(".showAll").click(function(){
        var str = "";
        for(let i = 0; i < questions.length; i++){
            str += (i + 1) + "、" + questions[i].name + "；";
        }
        alert(str);
    })
    // 取消按钮关闭窗口
    $(".cancel").click(function(){
        window.close();
    })
    // 先创建问卷，根据问卷名获取创建的问卷的id，根据id给问卷添加问题，开始问卷发布设置
    $(".submit").click(function(){
        // status变量用于判断操作是否成功，失败退出当前方法，不进行下方操作
        var status = true;
        var name = $(".name").val();
        var startDate = $(".startDate").val();
        var endDate = $(".endDate").val();
        if(name ==""){
            alert("问卷名不能为空");
            return;
        }
        if(startDate > endDate || new Date(startDate + " 23:59:59:998") < new Date()){
            alert("请输入正确的时间区间");
            return;
        }
        if(questions == [] || questions.length == 0){
            alert("请加入题目");
            return;
        }
        var param1 = {};
        param1.questionnaireName = name;
        param1.userId = user.id;
        $.ajax({
            url:" http://localhost:8080/QuestionnaireSystem/addQuestionnaire",
            data:param1,
            async:false,
            type:"post",
            success:function(msg){
                var obj = msg;
                if(typeof(msg) != 'object') obj = JSON.parse(msg);
                if(obj.flag == "success"){
                }else{
                    // 问卷名不可重复，重复会返回提示信息
                    alert(obj.data);
                    status = false;
                    return;
                }
            }
        })
        if(!status) return;
        var param2 = {};
        param2.questionnaireId = 0;
        var param3 = {};
        param3.questionnaireId = 0;
        // 根据问卷名获取问卷id信息
        $.ajax({
            url:" http://localhost:8080/QuestionnaireSystem/getQuestionnaireByName",
            data:"name=" + name,
            async:false,
            type:"post",
            success:function(msg){
                var obj = msg;
                if(typeof(msg) != 'object') obj = JSON.parse(msg);
                if(obj.flag == "success"){
                    param2.questionnaireId = obj.data.id;
                    param3.questionnaireId = obj.data.id;
                }else{
                    status = false;
                    return;
                }
            }
        })
        if(!status) return;
        // 给问卷添加问题
        for(let i = 0; i < questions.length; i++){
            param2.sequence = i + 1;
            param2.questionId = questions[i].id;
            $.ajax({
                url:" http://localhost:8080/QuestionnaireSystem/addQuestionnaireQuestions",
                data:param2,
                async:false,
                type:"post",
                success:function(msg){
                    var obj = msg;
                    if(typeof(msg) != 'object') obj = JSON.parse(msg);
                    if(obj.flag == "success"){
                    }else{
                        status = false;
                        return;
                    }
                }
            })
        }
        // 添加问卷发布信息
        param3.startDate = startDate;
        param3.endDate = endDate;
        $.ajax({
            url:" http://localhost:8080/QuestionnaireSystem/startQuestionnaire",
            data:param3,
            async:false,
            type:"post",
            success:function(msg){
                var obj = msg;
                if(typeof(msg) != 'object') obj = JSON.parse(msg);
                if(obj.flag == "success"){
                    alert("添加成功");
                    window.close();
                }else{
                    return;
                }
            }
        })
    })
})

// 问题列表显示
function getQuestions(startPage,pageSize){
    var param = {};
    param.name = "";
    param.questionType = 0;
    param.startPage = startPage;
    param.pageSize = pageSize;
    seachObj.startPage = startPage;
    seachObj.pageSize = pageSize;
    $.ajax({
        url:" http://localhost:8080/QuestionnaireSystem/getAllQuestions",
        data:param,
        type:"post",
        success:function(msg){
            var obj = msg;
            if(typeof(msg) != 'object') obj = JSON.parse(msg);
            if(obj.flag == "success"){
                var html = "<div style='user-select: none;cursor: pointer;margin-top: 5px;font-weight: bold;' onclick='addQuestion()'>创建题目</div><ul>";
                var data = obj.data;
                for(let i = 0; i < data.length; i++){
                    html += "<li class='" + data[i].id + "' onclick='show(this)'>" + data[i].question + "</li>";
                }
                html += "</ul>";
                $(".questions").prepend(html);
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
// 打开添加问题窗口
function addQuestion(){
    window.open("./createQuestion.html");
}

// 左边问题的点击事件，选择该问题并在右边显示问题的样式及选项信息
function show(t){
    // 右边显示框清空
    $(".styleCheck").html("<p></p>");
    var param = {};
    param.id = $(t).attr("class");
    $.ajax({
        url:" http://localhost:8080/QuestionnaireSystem/getQuestionById",
        data:param,
        type:"post",
        success:function(msg){
            var obj = msg;
            if(typeof(msg) != 'object') obj = JSON.parse(msg);
            if(obj.flag == "success"){
                var data = obj.data;
                $(".styleCheck p").eq(0).attr("class",data.id);
                $(".styleCheck p").eq(0).text(data.question);
                var html = "";
                // 根据题目类型设置样式信息
                switch(data.question_types_id){
                    case 1:
                        var str = data.question_options;
                        var op = str.split(";");
                        for(let i = 0; i < op.length - 1; i++){
                            html += "<div style='display: flex;align-items: center;'><input type='radio' name='role' disabled/><div class='options'>" + op[i] + "</div></div>";
                        }
                        break;
                    case 2:
                        var str = data.question_options;
                        var op = str.split(";");
                        for(let i = 0; i < op.length - 1; i++){
                            html += "<div style='display: flex;align-items: center;'><input type='checkbox' name='role' disabled/><div class='options'>" + op[i] + "</div></div>";
                        }
                        break;
                    case 3:
                        html += "<div class='inputBox'><input type='range' min='0' max='" + data.question_options + "' onchange='ran(this)' required/><div class='elem' onclick='num()'></div></div>";
                        break;
                    case 4:
                        html += "<div class='inputBox'><input type='text' required/></div>";
                        break;
                }
                $(".styleCheck p").eq(0).after(html);
                // 设置滑动条旁边的数字为滑动条的默认值
                $(".elem").text($("input[type='range']").val());
            }
        }
    })
}
// 滑动条值改变事件，修改滑动条右边的值
function ran(t){
    $(".elem").text($(t).val());
}
// 右边值点击事件，弹出弹窗，修改滑动条
function num(){
    var min = $("input[type='range']").attr("min");
    var max = $("input[type='range']").attr("max");
    var t = Number(prompt("请输入" + min + "至" + max + "的数字"));
    if(isNaN(t) || t < min || t > max){
        alert("请输入规范的数值");
    }else{
        $("input[type='range']").val(t);
        $(".elem").text(t);
    }
}