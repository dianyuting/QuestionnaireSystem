var paramSub = {};
var answers = [];
var startDate;
var endDate;
$(document).ready(function(){
    // 获取url传递过来的问卷发布id
    var p = new URLSearchParams(window.location.search);
    var id = p.get("id");
    startDate = p.get("startDate");
    endDate = p.get("endDate");
    if(startDate < new Date().valueOf() && endDate > new Date().valueOf()){
        $(".submit").attr("disabled",false);
    }else{
        $(".submit").attr("disabled",true);
    }
    paramSub.distributionId = id;
    // 回答提交，回答者的id不重复
    while(!isRespondent(generateRandomString(8))){
    }

    // 根据问卷发布id获取所有问题，并根据问题类型显示
    $.ajax({
        url:" http://localhost:8080/QuestionnaireSystem/getQuestionsByQuestionnaireId",
        data:"questionnaireId=" + id,
        type:"post",
        success:function(msg){
            var obj = msg;
            if(typeof(msg) != 'object') obj = JSON.parse(msg);
            if(obj.flag == "success"){
                var data = obj.data;
                var html = "<h3>" + data[1].questionnaire_name + "</h3>";
                data = data.sort((a,b) => {
                    return a.sequence - b.sequence;
                })
                for(let i = 0; i < data.length; i++){
                    var obj = {};
                    obj.relId = data[i].id;
                    obj.answer = "";
                    // 设置回答组的关联（问卷和题目）id及空回答
                    answers[i] = obj;
                    switch(data[i].question_types_id){
                        case 1:
                        var str = data[i].question_options;
                        var op = str.split(";");
                        html += "<p>" + data[i].sequence + "、" + data[i].question + "</p>";
                        for(let j = 0; j < op.length - 1; j++){
                            html += "<div class='radioBox'>" +
                            "<input type='radio' name='" + data[i].id + "' value='" + op[j] + "' onchange='c(this)'/>"+
                            "<div class='options'>" + op[j] + "</div></div>";
                        }
                        break;
                    case 2:
                        var str = data[i].question_options;
                        var op = str.split(";");
                        html += "<p>" + data[i].sequence + "、" + data[i].question + "</p>";
                        for(let j = 0; j < op.length - 1; j++){
                            html += "<div class='checkBox'>" + 
                            "<input type='checkbox' name='" + data[i].id + "' value='" + op[j] + "' onchange='c(this)'/>"+
                            "<div class='options'>" + op[j] + "</div></div>";
                        }
                        break;
                    case 3:
                        html += "<p>" + data[i].sequence + "、" + data[i].question + "</p>"+
                        "<div class='inputBox'>"+
                        "<input type='range' name='" + data[i].id + "' min='0' max='" + data[i].question_options + "' onchange='ran(this)' value='0' required/>"+
                        "<div class='elem"+ data[i].id +"' onclick='num(this)'>0</div></div>";
                        break;
                    case 4:
                        html += "<p>" + data[i].sequence + "、" + data[i].question + "</p>"+
                        "<div class='inputBox'><input type='text' name='" + data[i].id + "' onchange='c(this)' required/></div>";
                        break;
                    }
                }
                $(".mainBox").prepend(html);
            }
        }
    })

    $(".submit").click(function(){
        // 获取回答组信息，提交回答
        for(let i = 0; i < answers.length; i++){
            if(answers[i].answer == ""){
                alert("请回答所有题目");
                return;
            }
        }
        for(let i = 0; i < answers.length; i++){
            paramSub.relId = answers[i].relId;
            paramSub.answer = answers[i].answer;
            $.ajax({
                url:" http://localhost:8080/QuestionnaireSystem/addAnswer",
                data:paramSub,
                type:"post",
                success:function(msg){
                    var obj = msg;
                    if(typeof(msg) != 'object') obj = JSON.parse(msg);
                    if(obj.flag == "success"){
                        alert("已提交你的答案");
                        window.close();
                    }
                }
            })    
        }
    })
    $(".cancel").click(function(){
        window.close();
    })
})

// 滑动条和右边数字关联，改变时改变回答组对应的回答信息
function ran(t){
    var i = $(t).attr("name");
    $(".elem" + i).text($(t).val());
    for(let i = 0; i < answers.length; i++){
        if(answers[i].relId == $(t).attr("name")){
            answers[i].answer = $(t).val();
        }
    }
}
function num(t){
    var i = $(t).attr("class").split("m")[1];
    var min = $("input[type='range'][name="+ i +"]").attr("min");
    var max = $("input[type='range'][name="+ i +"]").attr("max");
    var x = Number(prompt("请输入" + min + "至" + max + "的数字"));
    if(isNaN(x) || x < min || x > max){
        alert("请输入规范的数值");
    }else{
        $("input[type='range'][name="+ i +"]").val(x);
        answers[i].answer = x;
        $(t).text(x);
    }
}

function c(t){
    // 获取改变的输入框信息，根据type值判断为哪种输入框
    var typeStr = $(t).attr("type");
    if(typeStr == "radio"){
        // 单选按钮选中修改回答
        if($(t).is(":checked")){
            for(let i = 0; i < answers.length; i++){
                if(answers[i].relId == $(t).attr("name")){
                    answers[i].answer = $(t).val();
                    break;
                }
            }
        }
    }else if(typeStr == "checkbox"){
        // 多选按钮选中添加回答，取消移除回答
        if($(t).is(":checked")){
            for(let i = 0; i < answers.length; i++){
                if(answers[i].relId == $(t).attr("name")){
                    answers[i].answer += $(t).val() +";";
                    break;
                }
            }
        }else{
            for(let i = 0; i < answers.length; i++){
                if(answers[i].relId == $(t).attr("name")){
                    var a = answers[i].answer.split(";");
                    for(let j = 0; j < a.length; j++){
                        if(a[j] == $(t).val()){
                            a.splice(j,1);
                            break;
                        }
                    }
                    answers[i].answer = a.join(";");
                    break;
                }
            }
        }
    }else if(typeStr == "text"){
        for(let i = 0; i < answers.length; i++){
            if(answers[i].relId == $(t).attr("name")){
                answers[i].answer = $(t).val();
                break;
            }
        }
    }
}

// 获取随机回答者id
function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}
// 判断回答者id是否重复
function isRespondent(a){
    $.ajax({
        url:" http://localhost:8080/QuestionnaireSystem/findRespondent",
        data:"findRespondent=" + a,
        async:false,
        type:"post",
        success:function(msg){
            var obj = msg;
            if(typeof(msg) != 'object') obj = JSON.parse(msg);
            if(obj.flag == "success"){
                paramSub.respondent = "";
            }else if(obj.data == "该答题者不存在"){
                paramSub.respondent = a;
            }
        }
    })
    if(paramSub.respondent != ""){
        return true;
    }else{
        return false;
    }
}