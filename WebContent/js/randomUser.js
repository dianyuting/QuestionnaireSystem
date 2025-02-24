// 获取随机用户名
$(document).ready(function(){
    $(".startRandom").click(function(){
        $.ajax({
            url:" http://localhost:8080/QuestionnaireSystem/getRandomUsername",
            data:'',
            type:"post",
            success:function(msg){
                var obj = msg;
                if(typeof(msg) != 'object') obj = JSON.parse(msg);
                if(obj.flag == 'success'){
                    $(".randomName").text(obj.data);
                }
            }
        })
    })
    // 拷贝按钮，复制获取的用户名
    $(".copy").click(function(){
        var tempInput = $('<input>');
        $('body').append(tempInput);
        tempInput.val($(".randomName").text()).select();
        document.execCommand('copy');
        tempInput.remove();
    })
    $(".ok").click(function(){
        $("#pop-up").css("display","none");
    })
})