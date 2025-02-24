// 没登录状态，不可进入改界面
var user = {};
try {
    user = JSON.parse(localStorage.getItem("user"));
} catch (error) {
    
}
if(user == undefined || $.isEmptyObject(user) || user == null){
    window.top.location.href = "./index.html";
}