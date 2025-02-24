var obj = {};
$(document).ready(function(){
    //调用自定义方法，判断用户密码输入是否正确
    $(".resetPassword").click("#pop-up",passwordIsTure)
    $(".sercuritySetting").click("#pop-up2",passwordIsTure);
    // 用户注销
    $(".accountCancellation").click(function(){
        var t = confirm("公司管理员注销将会注销公司信息，确定注销吗");
        var param = {};
        param.id = '';
        try {
            param.id = JSON.parse(localStorage.getItem("user")).id;
        } catch (error) {
            
        }
        if(t){
            $.ajax({
                url:" http://localhost:8080/QuestionnaireSystem/deleteUser",
                data:param,
                type:"post",
                success:function(msg){
                    var obj = msg;
                    if(typeof(msg) != 'object') obj = JSON.parse(msg);
                    if(obj.flag == "success"){
                        localStorage.setItem("user","");
                        window.top.location.href = "./index.html";
                    }
                }
            })    
        }
    })
    // 修改密码
    $(".ok").click(function(){
        var param = {};
        param.id = '';
        try {
            param.id = JSON.parse(localStorage.getItem("user")).id;
        } catch (error) {
            
        }
        param.password = $(".password").val();
        if(param.password == ""){
            alert("请输入密码");
            return
        }
        $.ajax({
            url:" http://localhost:8080/QuestionnaireSystem/updatePassword",
            data:param,
            type:"post",
            success:function(msg){
                var obj = msg;
                if(typeof(msg) != 'object') obj = JSON.parse(msg);
                if(obj.flag == "success"){
                    alert("修改成功");
                    $("#pop-up").css("display","none");
                }
            }
        })
    });
    // 修改密保信息
    $(".ok2").click(function(){
        var param = {};
        param.id = '';
        try {
            param.id = JSON.parse(localStorage.getItem("user")).id;
        } catch (error) {
            
        }
        param.phone = $(".phone").val();
        if(param.phone == ""){
            alert("请输入手机号");
            return
        }
        param.question = $(".question").val();
        if(param.question == ""){
            alert("请输入问题");
            return
        }
        param.answer = $(".answer").val();
        if(param.answer == ""){
            alert("请输入答案");
            return
        }
        $.ajax({
            url:" http://localhost:8080/QuestionnaireSystem/updatePasswordQuestion",
            data:param,
            type:"post",
            success:function(msg){
                var obj = msg;
                if(typeof(msg) != 'object') obj = JSON.parse(msg);
                if(obj.flag == "success"){
                    alert("修改成功");
                    $("#pop-up2").css("display","none");
                }else{
                    alert(obj.data);
                }
            }
        })
    })
    // 遮罩层的取消按钮绑定自定义方法，点击使遮罩层隐藏
    $(".cancel").eq(0).click("#pop-up", quxiao);
    $(".cancel").eq(1).click("#pop-up2", quxiao);
})

function passwordIsTure(str){
    var param = {};
    param.username = '';
    try {
        param.username = JSON.parse(localStorage.getItem("user")).username;
    } catch (error) {
        
    }
    param.password = prompt("请输入当前密码");
    if(param.password == null) return;
    $.ajax({
        url:"http://localhost:8080/QuestionnaireSystem/login",
        data:param,
        type:"post",
        success:function(msg){
            var obj = msg;
            if(typeof(msg) != 'object') obj = JSON.parse(msg);
            if(obj.flag == "success"){
                $(str.data).css("display","flex");
            }else{
                alert(obj.data);
            }
        }
    })
}
function quxiao(str){
    $(str.data).css("display","none");
}