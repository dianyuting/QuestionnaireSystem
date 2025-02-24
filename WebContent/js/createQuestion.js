$(document).ready(function(){
    // 获取问题类型，设置下拉框
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
                // 下拉框的选项第一个是单选题，单选框盒子显示
                $(".roleBox").css("display","block");
                $(".addRole").click(addRole);
            }
        }
    })
    // 问题类型下拉框改变事件
    $(".questionTypeSelect").change(function(){
        var n = $(this).val();
        // 四种问题类型，单选、多选、赋分、简答
        switch(n){
            case "1":
                var html = "<div class='add addCheck'><font class='emp'>*</font>添加</div>";
                $(".checkBox").html(html);
                $(".roleBox").css("display","block");
                $(".roleBox").unbind("click");
                $(".addRole").click(addRole);
                $(".checkBox").css("display","none");
                $(".inputFufen").css("display","none");
                break;
            case "2":
                var html = "<div class='add addRole'><font class='emp'>*</font>添加</div>";
                $(".roleBox").html(html);
                $(".checkBox").css("display","block");
                $(".checkBox").unbind("click");
                $(".addCheck").click(addCheck);
                $(".roleBox").css("display","none");
                $(".inputFufen").css("display","none");
                break;
            case "3":
                $(".inputFufen").css("display","block");
                $(".checkBox").css("display","none");
                $(".roleBox").css("display","none");
                break;
            case "4":
                $(".checkBox").css("display","none");
                $(".roleBox").css("display","none");
                $(".inputFufen").css("display","none");
                break;
        }
    })
    
    // 添加题目，判断题目信息是否填写完整
    $(".submit").click(function(){
        var param = {};
        param.question = $(".questionName").val();
        if(param.question == ""){
            alert("请输入所有带*的项目");
            return;
        }
        param.questionType = $(".questionTypeSelect").val();
        param.options = "";
        if(param.questionType == 3){
            param.options = $(".fufen").val();
            if(param.options == ""){
                alert("请输入所有带*的项目");
                return;
            }
        }else if(param.questionType == 1 || param.questionType == 2){
            var op = $(".options");
            for(let i = 0; i < op.length; i++){
                param.options += $(".options").eq(i).text() + ";";
            }
        }
        $.ajax({
            url:" http://localhost:8080/QuestionnaireSystem/addQuestion",
            data:param,
            type:"post",
            success:function(msg){
                var obj = msg;
                if(typeof(msg) != 'object') obj = JSON.parse(msg);
                if(obj.flag == "success"){
                    alert("添加成功");
                    window.close();
                }
            }
        })
    })
    // 取消按钮点击事件，关闭当前窗口
    $(".cancel").click(function(){
        window.close();
    })
})
// 添加按钮的点击事件，点击添加题目类型相符的选项
function addRole(){
    html = "<div style='display: flex;align-items: center;'><input type='radio' name='role' disabled/><div class='options' onclick='xuanxiang(this)'>选项</div></div>";
    $(".addRole").after(html);
}
function addCheck(){
    html = "<div style='display: flex;align-items: center;'><input type='checkbox' name='checkbox' disabled/><div class='options' onclick='xuanxiang(this)'>选项</div></div>";
    $(".addCheck").after(html);
}

// 选项的点击事件，弹窗输入选项内容
function xuanxiang(a){
    var x = prompt("请输入选项内容");
    $(a).text(x);
}