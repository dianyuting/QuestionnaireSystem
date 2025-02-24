$(document).ready(function(){
    try{
        var forgetMessage = JSON.parse(localStorage.getItem("forgetMessage"));
        $(".question").text(forgetMessage.verify_question);
    }catch{

    }
    $(".cancel").click(function(){
        window.close();
    })
    $(".submit").click(function(){
        if($(".phone").val() == "" || $(".answer").val() == ""){
            alert("请将信息填写完整");
            return
        }
        // 验证密保信息，信息正确则重置密码为666666
        if($(".phone").val() == forgetMessage.phone && $(".answer").val() == forgetMessage.verify_answer){
            var param = {};
            param.id = forgetMessage.id;
            param.password = 666666;
            $.ajax({
                url:"http://localhost:8080/QuestionnaireSystem/updatePassword",
                data:param,
                type:"post",
                success:function(msg){
                    var obj = msg;
                    if(typeof(msg) != 'object') obj = JSON.parse(msg);
                    if(obj.flag == "success"){
                        alert("密码已重置为" + param.password);
                       window.close();
                    }
                }
            })    
        }else{
            alert("回答错误")
        }
    })
})