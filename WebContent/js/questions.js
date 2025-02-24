var seachObj = {};
$(document).ready(function(){
    getUser("",0,1,8);
    // 切换页面及查找
    $(".step-backward").click(function(){
        if(seachObj.startPage == 1){
            alert("已经是第一页");
        }else{
            getUser(seachObj.name,seachObj.questionType,1,seachObj.pageSize);
        }
    })
    $(".chevron-left").click(function(){
        if(seachObj.startPage == 1){
            alert("已经是第一页");
        }else{
            getUser(seachObj.name,seachObj.questionType,seachObj.startPage - 1,seachObj.pageSize);
        }
    })
    $(".pageSelect").change(function(){
        getUser(seachObj.name,seachObj.questionType,$(this).val(),seachObj.pageSize);
    })
    $(".chevron-right").click(function(){
        if(seachObj.startPage == seachObj.totalPages){
            alert("已经是最后一页");
        }else{
            getUser(seachObj.name,seachObj.questionType,seachObj.startPage + 1,seachObj.pageSize);
        }
    })
    $(".step-forward").click(function(){
        if(seachObj.startPage == seachObj.totalPages){
            alert("已经是最后一页");
        }else{
            getUser(seachObj.name,seachObj.questionType,seachObj.totalPages,seachObj.pageSize);
        }
    })
    $(".find").click(function(){
        getUser($(".qiestionName").val(),$(".questionTypeSelect").val(),1,8);
    })

    // 问题类型下拉框设置
    $.ajax({
        url:" http://localhost:8080/QuestionnaireSystem/getQuestionsType",
        data:"",
        type:"post",
        success:function(msg){
            var obj = msg;
            if(typeof(msg) != 'object') obj = JSON.parse(msg);
            if(obj.flag == "success"){
                var html = "";
                var data = obj.data;
                for(let i = 0; i < data.length; i++){
                    html += "<option value='" + data[i].id + "'>"+ data[i].types +"</option>";
                }
                $(".questionTypeSelect").html(html);
            }
        }
    })

    // 打开创建问题窗口
    $(".create").click(function(){
        window.open("./createQuestion.html");
    })
    // 刷新
    $(".refresh").click(function(){
        getUser("",0,1,8);
    })
})

function getUser(name,questionType,startPage,pageSize){
    var param = {};
    param.name = name;
    param.questionType = questionType;
    param.startPage = startPage;
    param.pageSize = pageSize;
    seachObj.name = name;
    seachObj.questionType = questionType;
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
                var html = "";
                var data = obj.data;
                for(let i = 0; i < data.length; i++){
                    var type = "";
                    switch(data[i].question_types_id){
                        case 1:
                            type = "单选题";
                            break;
                        case 2:
                            type = "多选题";
                            break;
                        case 3:
                            type = "赋分题";
                            break;
                        case 4:
                            type = "简答题";
                            break;
                    }
                    html += "<tr><td>" + data[i].question + "</td>";
                    html += "<td>" + type + "</td>";
                    html += "<td>" + data[i].create_time + "</td>";
                    html += "<td><button onclick='look(" + data[i].id + ")'>预览</button></td></tr>";
                }
                $(".resultList").html(html);
                var totalPages = Math.ceil(obj.page.total / obj.page.pageSize);
                seachObj.totalPages = totalPages;
                var optionStr = "";
                for(let i = 1; i <= totalPages; i++){
                    if(obj.page.startPage == i){
                        optionStr += "<option value='" + i + "' selected>"+ i +"</option>";
                    }else{
                        optionStr += "<option value='" + i + "'>"+ i +"</option>";
                    }
                }
                $(".pageSelect").html(optionStr);
                $(".pageNum").text(totalPages);
                $(".totals").text(obj.page.total);
            }
        }
    })
}

// 问题预览，判断问题类型设置预览样式
function look(id){
    $("#pop-up .main").html("<p></p>");
    var param = {};
    param.id = id;
    $.ajax({
        url:" http://localhost:8080/QuestionnaireSystem/getQuestionById",
        data:param,
        type:"post",
        success:function(msg){
            var obj = msg;
            if(typeof(msg) != 'object') obj = JSON.parse(msg);
            if(obj.flag == "success"){
                var data = obj.data;
                $("#pop-up .main p").eq(0).text(data.question);
                var html = "";
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
                        $("#pop-up .main p").eq(0).text(data.question);
                        html += "<div class='inputBox'><input type='text' required/></div>";
                        break;
                }
                $("#pop-up .main p").eq(0).after(html);
                $(".elem").text($("input[type='range']").val());
                $("#pop-up").css("display","flex");
            }
        }
    })
    $(".main").click(function(event){
        event.stopPropagation();
    })
    $("#pop-up").click(function(){
        $("#pop-up").css("display","none");
    })
}
// 滚动条和右边数字关联
function ran(t){
    $(".elem").text($(t).val());
}
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