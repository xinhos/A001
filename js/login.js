$(function () {

    ////////////////////////////// js前端 01-- 步骤一验证动画 ////////////////////////////////
   $("#thumb").mousedown(function (event) {
       var checkSuccBox = $("#check-success-box");
       var thumb = $(this);
       var oldMouseX = event.pageX;
       if (thumb.hasClass("transition-left")){
           checkSuccBox.removeClass("transition-width");
           thumb.removeClass("transition-left");
       }
       $(document).mousemove(function (e) {
           var mouseOverWidth = e.pageX - oldMouseX;
           var thumbLeft = parseInt(thumb.css("left"));
           var newThumbLeft = mouseOverWidth + thumbLeft;
           if (newThumbLeft <= 0){
               newThumbLeft = 0;
           } else if (newThumbLeft > 256){
               newThumbLeft = 255;
           } else if (newThumbLeft >= 254 && newThumbLeft <= 256){ // 当划过验证通过
               newThumbLeft = 255;
               $("#check-text").css("color","#fff").html("验证通过！");
               $("#next-button").removeAttr("disabled").css({"color":"#fff","background":"#1ab5ff"});
               thumb.removeClass("fa-angle-double-right").addClass("fa-check-circle");
               $(document).unbind("mousemove");
               thumb.unbind("mousedown");
           }
           // 改变滑块的位置
           thumb.css("left",newThumbLeft+"px");
           // 改变绿色条条的宽度
           checkSuccBox.css("width", thumb.css("left"));

           // 当鼠标移开的时候解除事件绑定,并且退回滑块和条条
           $(document).mouseup(function(){
               $(document).unbind("mousemove");
               if ($("#next-button")[0].hasAttribute("disabled")){
                   checkSuccBox.addClass("transition-width").css("width","0");
                   thumb.addClass("transition-left").css("left","0");
               }
           });
           oldMouseX = e.pageX;
       });
   });
    ////////////////////////////// js前端 01 -- 步骤一验证动画 ////////////////////////////////

    //////////////////////////// js前端 02 -- 检测手机号合法性 /////////////////////////////////
    $("#phone-number").blur(function () {
        var phone = $(this).val();
        var patt = /^1\d{10}$/;
        $("#id-01").removeAttr("style");
        if (patt.test(phone)){
            $("#phone-check-icon").removeClass("fa-exclamation-circle").addClass("fa-check-circle").removeAttr("style");
            $("#phone-check-info").attr("style","display:none;");
        } else {
            $("#phone-check-icon").removeClass("fa-check-circle").addClass("fa-exclamation-circle").removeAttr("style");
            $("#phone-check-info").html(Messager["ms100021"]).removeAttr("style");
        }
    });




});

///////////////////////////////// js前端 03 -- 点击关闭，移除当前元素 //////////////////////////////
function closeThis(target) {
    $(target).parent().remove();
}








/**
 * ************************************************* 后端接口01--用户登陆 ************************************************
 * 1. 获取用户名和密码，将密码md5加密
 * 2. 发送数据至到后台
 */
function login() {
    var username = $("#username").val();
    var passwordTemp = $("#passwordTemp").val();
    $("#password").val($.md5(passwordTemp));
    if (username == "" || username == null || passwordTemp == "" || passwordTemp == null){
        var warnMessage = Messager["ms100012"];
        $("#info-h3").css("display","none");
        $("#warn-message").html(warnMessage).css("display","flex");
        return;
    }
    var loginForm = $("#login-form");
    var url = "http://www.baidu.com"; // TODO 填入后台url
    loginForm.attr({
        "action":url,
        "method":"post"
    });
    loginForm.submit();
}

/**
 * ************************************************* 后台接口02--要求服务器对号码发送验证码 **************************
 * 1. 获取国家代码以及手机号，拼接为完整手机号
 * 2. 发送至后台，并弹框
 * 3. 成功（100023）-失败（手机号错误，服务器错误，已经注册）
 */
function checkPhone() {
    var content = $("#content");
    var phone = $("#phone-number").val();
    $("#phone-number").blur();
    if (!$("#phone-check-info")[0].hasAttribute("style")){ // 警告信息被展示，代表手机号码输入错误
        return;
    } else { // 手机号码输入正确，获取之,开始手机验证
        // 请求后台验证
        $.ajax({
            url:"json/phone.txt", // TODO 替换url
            method:"post",
            dataType:"json",
            data:{
                "phone":phone
            },
            success:function (data) {
                var code = data[Messager["CODE"]];
                switch(code){
                    case "ms100021": showErrorPhoneInfo(code);break;
                    case "ms100022": showErrorPhoneExist(code);break;
                    case "ms100023": alertCheckBox(content,data[Messager["PHONE"]]);break;
                    case "ms100026": showTimesOver(code);break;
                }
            }
        });

    }
}
// 输入的手机号码错误，展示提示信息
function showErrorPhoneInfo(code) {
    $("#alert-box-text").addClass("hidden");
    $("#id-01").removeAttr("style");
    $("#phone-check-icon").removeClass("fa-check-circle").addClass("fa-exclamation-circle").removeAttr("style");
    $("#phone-check-info").html(Messager[code]).removeAttr("style");
}
// 手机号已经被注册，弹框提示
function showErrorPhoneExist(code) {
    $("#alert-box-text").removeClass("hidden").html(Messager[code]);
}
function showTimesOver(code) {
    $("#alert-box-text").removeClass("hidden").html(Messager[code]);
}
// 后台成功发送验证码，弹出输入框让用户输入验证码
function alertCheckBox(content, phone) {
    var strPhone = "\"" +phone+"\""; // js中append的 ' 会变成 " ，所以此处必须多此一举
    $("#alert-box-text").addClass("hidden");
    if ( $("#flag-temp").length != 0){
        $("#flag-temp").remove(); // 移除标记
        $("#time").html("（59s）").parent().removeClass("class-02").attr("disabled","disabled"); // 初始化秒数
    } else { // 没有标记代表是从第一步进入的获取验证码，而不是点击重新获取验证码进入的验证码
        content.append("" +
            "             <!--手机验证弹出框 -->\n" +
            "            <div class='phone-check-box'>\n" +
            "            <h4>验证手机</h4>\n" +
            "            <div class='phone-check-header'><span class='tip-icon fa fa-exclamation-circle'></span><span class='phone-check-text'>校检码已经发送到您的手机上，15分钟内有效，请勿泄露</span></div>\n" +
            "            <div class='phone'>\n" +
            "            <span class='text-header phone-check-text'>手机号</span>\n" +
            "            <span class='text-body phone-check-phone'>"+phone+"</span>\n" +
            "            </div>\n" +
            "            <div class='check-code'>\n" +
            "            <span class='text-header phone-check-text'>验证码</span>\n" +
            "            <input type='text' id='checkCode' class='cc-input ipt-default'>\n" +
            "            <button type='button' onclick='recentCode()' disabled='disabled' class='btn-default'>重新发送验证码<span id='time'>（59s）</span></button>\n" +
            "            </div>\n" +
            "            <div class='warn-info-box'>\n" +
            "            <span class='fa fa-exclamation-circle result-icon green-0' id='id-02-icon'></span><span class='warn-info' id='info-01'>验证码已经发送到您的手机</span>\n" +
            "            </div>\n" +
            "            <div class='check-submit'>\n" +
            "            <button type='button' class='btn-default' onclick='submitCheckCode("+strPhone+")'>确认</button>\n" +
            "            </div>\n" +
            "            <div class='close' onclick='closeThis(this)'>×</div>"+
            "            </div>" +
            "");
    }
    // 调用倒计时方法
    countTime();
}

//////////////////////////////////////// js前端 04 -- 验证码重发倒计时动画（调用后台接口02） /////////////////////////////////////////
// 定时器不断改变时间，等到时间减到0则去除disable，添加样式，绑定事件
function countTime(flag) {
    interval = setInterval(function () {  // TODO 这里将定时器作为全局变量，还有更好的解决方法？
        var time = parseInt($("#time").html().substring(1,3));
        time--;
        $("#time").html("（"+time+"s）");
        if (time == 0){
            $("#time").html("");
            $("#time").parent().addClass("class-02").removeAttr("disabled");
            // 清除定时器
            clearInterval(interval);
        }
    },1000);
}
/**
 * **************************************************** 后台接口03--发送验证码到服务器进行校检 ****************************************************
 * 1. 获取用户填写的验证码
 * 2. 发送验证码与手机号到服务器进行校检（成功-下一步，失败（手机号不匹配，验证码错误都归为一种错误））
 * 2. 播放等待动画，若存在定时器，将定时器取消
 */
function submitCheckCode(phone) {
    clearInterval(interval);
    var code = $("#checkCode").val();
    if (code == ""){
        checkFail("ms100027");
        return;
    }
    $.ajax({
       url:"json/check.txt",
       method:"post",
       dataType:"json",
       data:{
           "phone":phone,
           "code":code
       },
       success:function (data) {
           var code = data[Messager['CODE']];
           var phone = data[Messager['PHONE']];
           console.log(code);
           switch (code){
               case "ms100024": checkSuccess(phone);break;
               case "ms100025": checkFail(code);break;
               case "ms100027": checkFail(code); break;
           }
       }
    });
}
////////////////////////////////////////////// js前端 06 -- 验证失败后的显示 ///////////////////////////////////////////////////
function checkSuccess(phone) {
    $("#content").empty().append("" +
        "            <!--第二步--填写详细信息-->\n" +
        "            <form action=''>\n" +
        "                <div class='login-name'>\n" +
        "                    <span class='text-header login-name-text'>登录名</span>\n" +
        "                    <span id='phone-num' class='text-body'>"+phone+"</span>\n" +
        "                </div>\n" +
        "                <div class='set-password'>\n" +
        "                    <span class='text-header set-password-text'>设置登陆密码</span>\n" +
        "                    <span class='text-body'>登陆时验证，保护账号信息</span>\n" +
        "                </div>\n" +
        "                <div class='login-password'>\n" +
        "                    <span class='text-header login-password-text'>登陆密码</span>\n" +
        "                    <input type='password' id='loginPassword'>\n" +
        "                    <span id='password-input-info'><span class='fa result-icon' id='id-icon-01'></span><span class='warn-info' id='pw-warn1'></span></span>\n" +
        "                </div>\n" +
        "                <div class='confire-password'>\n" +
        "                    <span class='text-header confire-password-text'>确认密码</span>\n" +
        "                    <input type='password' id='confirePassword'>\n" +
        "                    <span id='confire-input-info'><span class='fa  result-icon' id='id-icon-02'></span><span class='warn-info' id='pw-warn2'></span></span>\n" +
        "                </div>\n" +
        "                <div class='set-username'>\n" +
        "                    <span class='text-header set-username-text'>设置会员名</span>\n" +
        "                </div>\n" +
        "                <div class='member-name'>\n" +
        "                    <span class='text-header member-name-text'>会员名</span>\n" +
        "                    <input id='memberName' type='text'>\n" +
        "                    <span id='menber-name-info'><span class='fa  result-icon' id='id-icon-03'></span><span class='warn-info' id='name-warn'></span></span>\n" +
        "                </div>\n" +
        "                <div class='set-role'>" +
        "                    <span class='text-header set-username-text'>设置角色</span>\n" +
        "                    <select name='role' id='role'>" +
        "                        <option value='"+Messager["ms100041"]+"'>学生用户</option>" +
        "                        <option value='"+Messager["ms100042"]+"'>文具商用户</option>" +
        "                        <option value='"+Messager["ms100043"]+"'>讲师用户</option>" +
        "                    </select>" +
        "                </div>"+
        "                <div class='step2-submit' ><button type='button' id='submit-regist' onclick='regist()'>提交</button></div>\n" +
        "            </form>" +
        "");
    $("#step-02").addClass("li-active");
    $("#loginPassword").bind("blur", checkPW01);
    $("#confirePassword").bind("blur", confirePW);
    $("#memberName").bind("blur", chechMemberName);
}
////////////////////////////////////////////// js前端 06 -- 验证失败后的显示 ///////////////////////////////////////////////////
function checkFail(code) {
    $("#id-02-icon").removeClass("green-0");
    $("#info-01").html(Messager[code]);
    // 刷新时间，并重新启动定时器
    $("#time").html("（59s）");
    countTime();
}
/**
 * ********************************************* 点击重新发送验证码，后台再次发送一次验证码，调用接口-02 **********************************
 * 1. 调用接口
 * 2. 关闭按钮，重启计时动画
 * 3. 清除点击事件
 */
function recentCode() {
    // 在body中追加一个标记，说明下一次弹框是刷新而不是追加。注意，标记用完即删
    $("body").append("<input type='hidden' id='flag-temp'>");
    checkPhone(); // 直接调用已经完成的接口即可
}

////////////////////////////////////////// js前端 07 -- 第三步中密码确认，会员名前端校检 ///////////////////////////////////////////
function checkPW01() {
    var pw = $("#loginPassword").val();
    if ( $("#loginPassword").val()==""){
        $("#id-icon-01").removeClass("fa-check-circle").addClass("fa-exclamation-circle");
        $("#id-icon-02").removeClass("fa-check-circle fa-exclamation-circle");
        $("#pw-warn1").html(Messager["ms100031"]);
        $("#pw-warn2").html("");
        return false;
    }
    if (isIllegalChar($("#loginPassword").val())){
        $("#id-icon-01").removeClass("fa-check-circle").addClass("fa-exclamation-circle");
        $("#id-icon-02").removeClass("fa-check-circle fa-exclamation-circle");
        $("#pw-warn1").html(Messager["ms100034"]);
        $("#pw-warn2").html("");
        return false;
    }
    if ($("#loginPassword").val().length<8 || $("#loginPassword").val().length>16){
        $("#id-icon-01").removeClass("fa-check-circle").addClass("fa-exclamation-circle");
        $("#id-icon-02").removeClass("fa-check-circle fa-exclamation-circle");
        $("#pw-warn1").html(Messager["ms100032"]);
        $("#pw-warn2").html("");
        return false;
    }
    if ($("#confirePassword").val()!=""){
        if ($("#loginPassword").val()!=$("#confirePassword").val()){
            $("#id-icon-01").removeClass("fa-check-circle").addClass("fa-exclamation-circle");
            $("#id-icon-02").removeClass("fa-check-circle").addClass("fa-exclamation-circle");
            $("#pw-warn1").html(Messager["ms100033"]);
            $("#pw-warn2").html(Messager["ms100033"]);
            return false;
        } else {
            $("#id-icon-01").removeClass("fa-exclamation-circle").addClass("fa-check-circle");
            $("#pw-warn1").html("");
            $("#id-icon-02").removeClass("fa-exclamation-circle").addClass("fa-check-circle");
            $("#pw-warn2").html("");
        }
    }
    $("#id-icon-01").removeClass("fa-exclamation-circle").addClass("fa-check-circle");
    $("#pw-warn1").html("");
    return true;
}
function confirePW()  {
    if ($("#loginPassword").val() == ""){
        $("#id-icon-01").removeClass("fa-check-circle").addClass("fa-exclamation-circle");
        $("#id-icon-02").removeClass("fa-check-circle fa-exclamation-circle");
        $("#pw-warn1").html(Messager["ms100031"]);
        $("#pw-warn2").html("");
        return false;
    }
    if ($("#loginPassword").val().length<8 || $("#loginPassword").val().length>16){
        $("#id-icon-01").removeClass("fa-check-circle").addClass("fa-exclamation-circle");
        $("#id-icon-02").removeClass("fa-check-circle fa-exclamation-circle");
        $("#pw-warn1").html(Messager["ms100032"]);
        $("#pw-warn2").html("");
        return false;
    }
    if ($("#loginPassword").val()!=$("#confirePassword").val()){
        $("#id-icon-01").removeClass("fa-check-circle").addClass("fa-exclamation-circle");
        $("#id-icon-02").removeClass("fa-check-circle").addClass("fa-exclamation-circle");
        $("#pw-warn1").html(Messager["ms100033"]);
        $("#pw-warn2").html(Messager["ms100033"]);
        return false;
    }
    $("#id-icon-01").removeClass("fa-exclamation-circle").addClass("fa-check-circle");
    $("#pw-warn1").html("");
    $("#id-icon-02").removeClass("fa-exclamation-circle").addClass("fa-check-circle");
    $("#pw-warn2").html("");
    return true;
}
function isIllegalChar(str) {
    var pat = new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5]","i");
    if(pat.test(str)==true) {
        return true;
    } else {
        return false;
    }
}
function chechMemberName() {
    var memberName = $("#memberName").val();
    if (memberName==""){
        $("#id-icon-03").removeClass("fa-check-circle").addClass("fa-exclamation-circle");
        $("#name-warn").html(Messager["ms100035"]);
        return false;
    }
    if ( memberName.length > 16){
        $("#id-icon-03").removeClass("fa-check-circle").addClass("fa-exclamation-circle");
        $("#name-warn").html(Messager["ms100036"]);
        return false;
    }
    $("#id-icon-03").removeClass("fa-exclamation-circle").addClass("fa-check-circle");
    $("#name-warn").html("");
    return true
}

/**
 ******************************************** 后台接口04 -- 第三步点击提交。将用户数据提交至服务器，************************************************
 * 1. 调用前端校检
 * 2. 发送数据至后台
 * 3. 获取返回代码，根据代码产生提示，或跳转到成功界面
 */
function regist() {
    if (checkPW01() && confirePW() && chechMemberName() ){
        $.ajax({
            url:"json/regist.txt",
            dataType:"json",
            method:"post",
            data:{
                "username":$("#phone-num").html(),
                "password":$("#loginPassword").val(), // TODO 服务端注意，服务端收到数据后对密码进行md5加密
                "memberName":$("#memberName").val(),
                "role":$("#role").val()
            },
            success:function (data) {
                if (data[Messager["CODE"]]!="ms100030"){
                    showError(data[Messager["CODE"]]);
                }
                // 转到成功界面
                $("#content").empty().append("" +
                    "        <!--第三步，注册成功之后-->\n" +
                    "            <div class='success-box'>\n" +
                    "                <div class='success-info'>\n" +
                    "                    <span class='fa fa-exclamation-circle result-icon color'></span><span class='warn-info' id='name-warn'>注册成功，您的账户为：</span>\n" +
                    "                </div>\n" +
                    "                <div class='detail-info'>\n" +
                    "                    <p>登陆名：<span id='phone-success' class='text-body phone-check-phone'>"+data[Messager["PHONE"]]+"</span>，您的账号可用于登陆云课堂以及相关服务</p>\n" +
                    // TODO 注意修改我的主页url
                    "                    <p>云课堂会员名：<span class='' id='member-name-success'>"+data[Messager["MNAME"]]+"</span><a href='' class='page-entry'>我的主页入口</a></p>\n" +
                    "                </div>\n" +
                    "            </div>" +
                    "");
                $("#step-03").addClass("li-active");
            }
        })
    }
}
function showError(code) {
    // TODO 考虑到能绕过前端验证的人要么是无聊，要么是蓄意攻击，所以提示也不用多友好。当然，这里也可以改进，然，偷个懒。有空再改（意思就是不改了）
    checkPW01();
    confirePW();
    chechMemberName();
}





