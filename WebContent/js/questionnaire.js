var seachObj = {};
var user = {};
var paramfb = {};
$(document).ready(function(){
    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
        
    }
    // 页面切换及查找
    getQuestionnaires("",user.id,1,8);
    $(".step-backward").click(function(){
        if(seachObj.startPage == 1){
            alert("已经是第一页");
        }else{
            getQuestionnaires(seachObj.name,seachObj.userId,1,seachObj.pageSize);
        }
    })
    $(".chevron-left").click(function(){
        if(seachObj.startPage == 1){
            alert("已经是第一页");
        }else{
            getQuestionnaires(seachObj.name,seachObj.userId,seachObj.startPage - 1,seachObj.pageSize);
        }
    })
    $(".pageSelect").change(function(){
        getQuestionnaires(seachObj.name,seachObj.userId,$(this).val(),seachObj.pageSize);
    })
    $(".chevron-right").click(function(){
        if(seachObj.startPage == seachObj.totalPages){
            alert("已经是最后一页");
        }else{
            getQuestionnaires(seachObj.name,seachObj.userId,seachObj.startPage + 1,seachObj.pageSize);
        }
    })
    $(".step-forward").click(function(){
        if(seachObj.startPage == seachObj.totalPages){
            alert("已经是最后一页");
        }else{
            getQuestionnaires(seachObj.name,seachObj.userId,seachObj.totalPages,seachObj.pageSize);
        }
    })
    $(".find").click(function(){
        if(user.company_id == 1){
            getQuestionnaires($(".qiestionnaireName").val(),user.id,1,8);
        }else{
        getQuestionnaires($(".qiestionnaireName").val(),$(".userSelect").val(),1,8);}
    })
    // 个人用户没有用户查找选项
    if(user.company_id == 1){
        $(".selectBox").css("display","none");
    }else{
        var param = {};
        param.Companyid = 0;
        try {
            param.Companyid = user.company_id;
        } catch (error) {
            
        }
        $.ajax({
            url:" http://localhost:8080/QuestionnaireSystem/getAllUserName",
            data:param,
            type:"post",
            success:function(msg){
                var obj = msg;
                if(typeof(msg) != 'object') obj = JSON.parse(msg);
                if(obj.flag == "success"){
                    var html = "";
                    var data = obj.data;
                    for(let i = 0; i < data.length; i++){
                        html += "<option value='" + data[i].id + "'>"+ data[i].username +"</option>";
                    }
                    $(".userSelect").html(html);
                }
            }
        })
    }


    $(".create").click(function(){
        window.open("./createQuestionnaire.html");
    })
    $(".refresh").click(function(){
        getQuestionnaires("",user.id,1,8);
    })
})

function getQuestionnaires(name,userId,startPage,pageSize){
    var param = {};
    param.name = name;
    param.companyId = user.company_id;
    param.uid = userId;
    param.startPage = startPage;
    param.pageSize = pageSize;
    seachObj.name = name;
    seachObj.userId = userId;
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
                    html += "<tr><td>" + data[i].questionnaire_name + "</td>";
                    html += "<td>" +  data[i].start_date.substring(0,10) + "</td>";
                    html += "<td>" +  data[i].end_date.substring(0,10) + "</td>";
                    html += "<td>" +  data[i].username + "</td>";
                    html += "<td>" + data[i].create_time + "</td>";
                    html += "<td><button onclick='fenxi(" + data[i].id + ")'>问卷分析</button>" +
                    "<button onclick='re(" + data[i].questionnaire_id + ")'>再次发布</button>" +
                    "<button onclick='delet(" + data[i].id + ")'>删除</button>" +
                    "<button onclick='look(" + data[i].id + "," + new Date(data[i].start_date.substring(0,10)).valueOf() + ","+new Date(data[i].end_date.substring(0,10)).valueOf() + ")'>预览</button>" +
                    "<button onclick='shape(" + data[i].id + "," + new Date(data[i].start_date.substring(0,10)).valueOf() + ","+new Date(data[i].end_date.substring(0,10)).valueOf() +  ")'>分享</button></td></tr>";
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

    // 点击遮罩层外围遮罩层关闭，点击遮罩层内部主体，阻止事件冒泡
    $(".p").click(function(){
        $(".p").css("display","none");
        $(".code").css("display","none");
        $(".fb").css("display","none");
    })
    $(".code").click(function(event){
        event.stopPropagation();
    })
    $(".fb").click(function(event){
        event.stopPropagation();
    })
    // 再次发布时间
    $('.qd').click(function(){
        var startDate = $(".startDate").val();
        var endDate = $(".endDate").val();
        if(startDate > endDate || new Date(startDate + " 23:59:59:998") < new Date()){
            alert("请输入正确的时间区间");
            return;
        }
        paramfb.startDate = startDate;
        paramfb.endDate = endDate;
        $.ajax({
            url:" http://localhost:8080/QuestionnaireSystem/startQuestionnaire",
            data:paramfb,
            type:"post",
            success:function(msg){
                var obj = msg;
                if(typeof(msg) != 'object') obj = JSON.parse(msg);
                if(obj.flag == "success"){
                    alert("添加成功");
                    getQuestionnaires("",0,1,8);
                    $(".p").css("display","none");
                    $(".code").css("display","none");
                    $(".fb").css("display","none");
                }else{
                    return;
                }
            }
        })
    })
}
// 通过url传递信息打开问卷回答界面，根据问卷发布id获取问题
function look(id,startDate, endDate){
    window.open("./questionnaireQuestion.html?id="+id+ "&startDate=" + startDate + "&endDate=" + endDate);
}
function shape(id,startDate, endDate){
    $(".code").html("");
    $(".p").css("display","flex");
    $(".code").css("display","block");
    $(".code").qrcode("http://localhost:8080/QuestionnaireSystem/QuestionnaireSystem/questionnaireQuestion.html?id="+id+ "&startDate=" + startDate + "&endDate=" + endDate);
}
// 再次发布按钮点击事件，显示遮罩层
function re(id){
    paramfb.questionnaireId = id;
    $(".p").css("display","flex");
    $(".fb").css("display","flex");
}
// 删除问卷发布事件
function delet(id){
    $.ajax({
        url:" http://localhost:8080/QuestionnaireSystem/deletQuestionnaire",
        data:"questionnaireId="+id,
        type:"post",
        success:function(msg){
            var obj = msg;
            if(typeof(msg) != 'object') obj = JSON.parse(msg);
            if(obj.flag == "success"){
                alert("删除成功");
                getQuestionnaires("",0,1,8);
            }
        }
    })
}
// 打开问卷分析窗口
function fenxi(id){
    window.open("./fenxi.html?id="+id );
}