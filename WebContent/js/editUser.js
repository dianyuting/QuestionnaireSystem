$(document).ready(function(){
    loadUser();
    $(".cancel").click(function(){
        window.close();
    })
    $(".submit").click(function(){
        var param = {}
        param.id = 0;
        try{
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            param.id = user.id;
        }catch{
    
        }
        param.username = $(".username").val();
        param.name = $(".name").val();
        param.sex = $(".roleBox input[name='sex']:radio:checked").val();
        param.phone = $(".phone").val();
        param.photo = encodeURIComponent($(".photo").attr("src"));
        if(param.username == ""){
            alert("请填写所有带*的信息");
            return;       
        }
        // 修改用户信息
        $.ajax({
            url:"http://localhost:8080/QuestionnaireSystem/updateUser",
            data:param,
            type:"post",
            async:true,
            success:function(msg){
                var obj = msg;
                if(typeof(msg) != 'object') obj = JSON.parse(msg);
                if(obj.flag == "success"){
                    alert("修改成功");
                    var user = {};
                    try{
                        var userStr = localStorage.getItem("user");
                        var user = JSON.parse(userStr);
                    }catch{
                
                    }
                    user.photo = encodeURIComponent($(".photo").attr("src"));
                    user.name = $(".name").val();
                    localStorage.setItem("user",JSON.stringify(user));
                    window.close();
                }else if(obj.data == "用户名重复，请重新输入"){
                    $("#pop-up").css("display","flex");
                }else{
                    alert(obj.data);
                }
            }
        })
    })
    // 图片选择器改变事件
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

// 获取用户基本信息，初始化界面
function loadUser(){
    var param = {};
    param.id = 0;
    var user = {};
    try{
        var userStr = localStorage.getItem("user");
        var user = JSON.parse(userStr);
        param.id = user.id;
    }catch{

    }
    $.ajax({
        url:" http://localhost:8080/QuestionnaireSystem/getUserById",
        data:param,
        type:"post",
        success:function(msg){
            var obj = msg;
            if(typeof(msg) != 'object') obj = JSON.parse(msg);
            if(obj.flag == "success"){
                user.id = obj.data.id;
                user.photo = obj.data.photo;
                user.name = obj.data.name;
                localStorage.setItem("user",JSON.stringify(user));
                $(".username").val(obj.data.username);
                $(".name").val(obj.data.name);
                $(".phone").val(obj.data.phone);
                $(".company").text(obj.data.company_name);
                if(obj.data.sex != 0)$(".roleBox input[value='" + obj.data.sex + "'][name='sex']:radio").attr("checked",true);
                $(".roleBox input[value='" + obj.data.role + "'][name='role']:radio").attr("checked",true);
                if(obj.data.photo != "") $(".photo").attr("src",decodeURIComponent(obj.data.photo));
            }
        }
    })
}