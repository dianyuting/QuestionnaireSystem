$(document).ready(function(){
    try{
        var userStr = localStorage.getItem("user");
        var user = JSON.parse(userStr);
        if(user.role == 1){
            $(".roleBox input[name='role']").attr("disabled",false);
            $(".company").val(user.companyName);
            $(".company").css("pointer-events","none");
        }
    }catch{

    }
    // 公司值改变事件，个人用户为编辑，公司普通用户默认为分析
    $(".company").change(function(){
        if($(".company").val() != ""){
            $(".roleBox input[value='2'][name='role']:radio").attr("checked",false);
            $(".roleBox input[value='3'][name='role']:radio").attr("checked",true);
        }else{
            $(".roleBox input[value='2'][name='role']:radio").attr("checked",true);
            $(".roleBox input[value='3'][name='role']:radio").attr("checked",false);
        }
    });
    // 创建用户，判断信息填写是否完整
    $(".submit").click(function(){
        var param = {}
        param.username = $(".username").val();
        param.password = $(".password").val();
        param.name = $(".name").val();
        param.sex = $(".roleBox input[name='sex']:radio:checked").val();
        param.phone = $(".phone").val();
        param.role = $(".roleBox input[name='role']:radio:checked").val();
        param.company = $(".company").val();
        param.photo = encodeURIComponent($(".photo").attr("src"));
        if(param.username == ""|| param.password == "" || param.role == ""){
            alert("请填写所有带*的信息");
            return;       
        }else if(param.password != $(".confirmPassword").val() ) {
            alert("请保持密码一致");
            return;
        }
        $.ajax({
            url:"http://localhost:8080/QuestionnaireSystem/addUser",
            data:param,
            type:"post",
            success:function(msg){
                var obj = msg;
                if(typeof(msg) != 'object') obj = JSON.parse(msg);
                if(obj.flag == "success"){
                    alert("创建成功");
                    window.close();
                }else if(obj.data == "用户名重复，请重新输入"){
                    $("#pop-up").css("display","flex");
                }else{
                    alert(obj.data);
                }
            }
        })
    })
    $(".cancel").click(function(){
        window.close();
    })
    // 用户头像文件选择改变事件
    $("#upload-input").change(function(){
        var file = this.files[0];
        $(".photo").attr("src",file.name);
        var reader = new FileReader();
        reader.onload = function(even){
            $(".photo").attr("src",even.target.result);
        }
        reader.readAsDataURL(file);
    })
})