$(document).ready(function(){
    // 设置头像图片
    try{
        var userStr = localStorage.getItem("user");
        var user = JSON.parse(userStr);
        $(".username").text(user.username);
        if(user.photo != ""){
            $(".photo").css("background-image","url(" + decodeURIComponent(user.photo) + ")");
        }
    }catch{

    }
    // 用户名和头像点击打开修改用户信息界面
    $(".username").click(editUser);
    $(".photo").click(editUser);
    // 窗口的焦点事件，用于更新用户名和头像，目前好像没什么用
    window.addEventListener("focus",function(){
        try{
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            $(".username").text(user.username);
            if(user.photo != ""){
                $(".photo").css("background-image","url(" + decodeURIComponent(user.photo) + ")");
            }
        }catch{
    
        }
    })
})

function editUser(){
    window.open("./editUser.html");
}
