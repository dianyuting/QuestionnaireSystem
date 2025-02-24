$(document).ready(function(){
    // 登录
    $(".login").click(function(){
        var param = {};
        param.username = $(".username").val();
        param.password = $(".password").val();
        if(param.username == ""){
            alert("请输入用户名");
        }else if(param.password == ""){
            alert("请输入密码");
        }else{
            $.ajax({
                url:"http://localhost:8080/QuestionnaireSystem/login",
                data:param,
                type:"post",
                success:function(msg){
                    var obj = msg;
                    if(typeof(msg) != 'object') obj = JSON.parse(msg);
                    if(obj.flag == "success"){
                        localStorage.setItem("user",JSON.stringify(obj.data));
                        location.href = './main.html';
                    }else{
                        alert(obj.data);
                    }
                }
            })
        }
    })
    $(".cancel").click(function(){
        $(".username").val("");
        $(".password").val("");
    })
    // 打开注册窗口
    $(".register").click(function(){
        window.open("./register.html");
    })
    // 忘记密码的点击事件，获取密保信息，保存至浏览器
    $(".forget").click(function(){
        var param = {};
        param.username = $(".username").val();
        if(param.username == ""){
            alert("请输入用户名");
            document.getElementById("pop-up").style.display = "none";
            return;
        }
        $.ajax({
            url:"http://localhost:8080/QuestionnaireSystem/getMessage",
            data:param,
            type:"post",
            success:function(msg){
                var obj = msg;
                if(typeof(msg) != 'object') obj = JSON.parse(msg);
                if(obj.flag == "success"){
                    localStorage.setItem("forgetMessage",JSON.stringify(obj.data));
                    window.open("./forget.html");
                }else{
                    alert(obj.data);
                    document.getElementById("pop-up").style.display = "none";
                }
            }
        })
    })
})