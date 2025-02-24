var seachObj = {};
$(document).ready(function(){
    getUser("",1,8);
    // 页面切换及查找功能
    $(".step-backward").click(function(){
        if(seachObj.startPage == 1){
            alert("已经是第一页");
        }else{
            getUser(seachObj.name,1,seachObj.pageSize);
        }
    })
    $(".chevron-left").click(function(){
        if(seachObj.startPage == 1){
            alert("已经是第一页");
        }else{
            getUser(seachObj.name,seachObj.startPage - 1,seachObj.pageSize);
        }
    })
    $(".pageSelect").change(function(){
        getUser(seachObj.name,$(this).val(),seachObj.pageSize);
    })
    $(".chevron-right").click(function(){
        if(seachObj.startPage == seachObj.totalPages){
            alert("已经是最后一页");
        }else{
            getUser(seachObj.name,seachObj.startPage + 1,seachObj.pageSize);
        }
    })
    $(".step-forward").click(function(){
        if(seachObj.startPage == seachObj.totalPages){
            alert("已经是最后一页");
        }else{
            getUser(seachObj.name,seachObj.totalPages,seachObj.pageSize);
        }
    })
    $(".find").click(function(){
        getUser($(".username").val(),1,8);
    })

    // 打开创建用户窗口
    $(".create").click(function(){
        window.open("./register.html");
    })
    // 刷新
    $(".refresh").click(function(){
        getUser("",1,8);
    })
})

function getUser(name,startPage,pageSize){
    var param = {};
    param.Companyid = 0;
    try {
        param.Companyid = JSON.parse(localStorage.getItem("user")).company_id;
    } catch (error) {
        
    }
    param.name = name;
    param.startPage = startPage;
    param.pageSize = pageSize;
    seachObj.name = name;
    seachObj.startPage = startPage;
    seachObj.pageSize = pageSize;
    $.ajax({
        url:" http://localhost:8080/QuestionnaireSystem/getAllUserByCompanyid",
        data:param,
        type:"post",
        success:function(msg){
            var obj = msg;
            if(typeof(msg) != 'object') obj = JSON.parse(msg);
            if(obj.flag == "success"){
                var html = "";
                var data = obj.data;
                for(let i = 0; i < data.length; i++){
                    var sex = data[i].sex == 1 ? "男" : "女";
                    // 管理员信息特殊处理
                    if(data[i].role == 1){
                        html += "<tr style='color:red;'><td>" + data[i].username + "</td>";
                        html += "<td>" + data[i].name + "</td>";
                        html += "<td>" + sex + "</td>";
                        html += "<td>" + data[i].phone + "</td>";
                        html += "<td>" + "管理员" + "</td>";
                        html += "<td><button disabled>修改权限</button><button disabled>重置密码</button></td></tr>";
                        continue;
                    }
                    var role = data[i].role == 2 ? "问卷编辑" : "问卷分析";
                    html += "<tr><td>" + data[i].username + "</td>";
                    html += "<td>" + data[i].name + "</td>";
                    html += "<td>" + sex + "</td>";
                    html += "<td>" + data[i].phone + "</td>";
                    html += "<td>" + role + "</td>";
                    html += "<td><button onclick='updateRole(" + data[i].id + "," + data[i].role + ")'>修改权限</button><button onclick='resetPassword(" + data[i].id + ")'>重置密码</button></td>";
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
// 修改权限
function updateRole(userId,role){
    var param = {};
    param.id = userId;
    param.role = role == 2 ? 3 : 2;
    $.ajax({
        url:"http://localhost:8080/QuestionnaireSystem/updateRole",
        data:param,
        type:"post",
        success:function(msg){
            var obj = msg;
            if(typeof(msg) != 'object') obj = JSON.parse(msg);
            if(obj.flag == "success"){
                getUser(seachObj.name,seachObj.totalPages,seachObj.pageSize);
            }
        }
    })
}
// 重置密码为666666
function resetPassword(userId){
    var param = {};
    param.id = userId;
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
                getUser(seachObj.name,seachObj.totalPages,seachObj.pageSize);
            }
        }
    })
}