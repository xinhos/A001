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
        $("#warn-message").html(warnMessage).css("display","block");
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

///////////////////////////// 获取用户信息并填写到 info-box 中，然后显示 info-box //////////////////////////////////////////
function modify(e){

}

/**
 * *********************************************** 后端接口 -- 删除用户 **************************************************
 * 1. 获取用户id，发送至服务器请求删除
 * 2. 根据结果表现（成功则更新表格，失败则提示信息）
 * @param e
 */
function deleteIt(e) {

}