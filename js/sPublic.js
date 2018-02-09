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
    var wrapEle = $(e).siblings(".hidden");
    var pageWordWrap = $("#page-word-wrap");
    if (wrapEle.children("input[name='role']").val() == "ms100054"){ // 管理员
        alert("管理员用户不允许编辑！请在数据库中修改，或在个人页面中修改");
        return;
    }

    $("#info-modify").removeClass("faded");
    $("#shadow").removeClass("hidden");

    // 获取表格行信息充填到卡片中
    if (wrapEle.children("input[name='role']").val() == "ms100051"){ // 学生用户
        $("#qq").addClass("no-data").attr("disabled","disabled").val("");
        $("#intro").addClass("no-data").attr("disabled","disabled").val("");
        $("#percentage").addClass("no-data").attr("disabled","disabled").val("");
        $("#quo").addClass("no-data").attr("disabled","disabled").val("");
        $("#recommend").addClass("hidden").attr("disabled","disabled").val("");
    } else if (wrapEle.children("input[name='role']").val() == "ms100052"){ // 供应商
        $("#qq").addClass("no-data").attr("disabled","disabled").val("");
        $("#intro").addClass("no-data").attr("disabled","disabled").val("");
        $("#quo").addClass("no-data").attr("disabled","disabled").val("");
        $("#recommend").addClass("hidden").attr("disabled","disabled").val("");

        $("#qq").removeClass("no-data").val(wrapEle.children("input[name='qq']").val()).removeAttr("disabled");
        $("#percentage").removeClass("no-data").val(wrapEle.children("input[name='precentage']").val()).removeAttr("disabled");
    } else { // 讲师用户
        $("#qq").removeClass("no-data").val(wrapEle.children("input[name='qq']").val()).removeAttr("disabled");
        $("#percentage").removeClass("no-data").val(wrapEle.children("input[name='precentage']").val()).removeAttr("disabled");
        $("#intro").removeClass("no-data").val(wrapEle.children("input[name='intro']").val()).removeAttr("disabled");
        $("#quo").removeClass("no-data").val(wrapEle.children("input[name='quo']").val()).removeAttr("disabled");

        // 处理多选框
        $("#recommend").removeClass("hidden").removeAttr("disabled");
        var recomInmain = wrapEle.children("input[name='首页推荐code']").val();
        var recomInCenter = wrapEle.children("input[name='中心推荐code']").val();
        if (recomInCenter == true){
            $("#r-center").attr("checked","checked")
        } else {
            $("#r-center").removeAttr("checked")
        }

        if (recomInmain == true){
            $("#r-main").attr("checked","checked")
        } else {
            $("#r-main").removeAttr("checked")
        }
    }
    $("#myImg").attr("src", wrapEle.children("input[name='user-img']").val());
    $("#memberName").val(wrapEle.children("input[name='member-name']").val());
    $("#password").val(wrapEle.children("input[name='password']").val());
    setRole(wrapEle.children("input[name='role']").val());
    $("#createTime").val(wrapEle.children("input[name='create-time']").val());
    pageWordWrap.children("input[name='selectOption']").val($("#select").val());
    pageWordWrap.children("input[name='selectTime']").val($("#data").val());
    pageWordWrap.children("input[name='searchWord']").val($("#search-input").val());
    pageWordWrap.children("input[name='allPage']").val($("#allPage").val());
    pageWordWrap.children("input[name='targetPage']").val($("#targetPage").val());

}
function setRole(code) {
    var roleStr = "option[value='"+code+"']";
    switch (code){
        case "ms100051": $("#role").children(roleStr).attr("selected","selected");break;
        case "ms100052": $("#role").children(roleStr).attr("selected","selected");break;
        case "ms100053": $("#role").children(roleStr).attr("selected","selected");break;
        case "ms100054": $("#role").children(roleStr).attr("selected","selected");break;
    }
    console.log($("#role").children(roleStr));
}

/**
 * *********************************************** 后端接口 -- 删除用户 **************************************************
 * 1. 获取用户id，发送至服务器请求删除
 * 2. 根据结果表现（成功则更新表格，失败则提示信息）
 * @param e
 */
function deleteIt(e) {
    var wrapEle = $(e).siblings(".hidden");
    var data = {
        "uid":wrapEle.children("input[name='user-id']").val(),
        "selectOption":$("#select").val(),
        "selectTime":$("#data").val(),
        "searchWord":$("#search-input").val()
    };

    $.ajax({
        url:"json/delete-user.txt",
        method:"get",
        data:data,
        dataType:"json",
        success:function (data) {
            var code = data[Messager["CODE"]];
            var test = Messager["CODE"];
            var test01 = data["code"];
            var icon = 0;
            if (code == "ms100064"){
                icon = 1;
                // 从页面上删除
                $(e).parent().parent().remove();
            } else {
                icon = 2;
            }
            layer.alert(Messager[code],{icon:icon})
        }
    })


}



function search(e) {
    var data = {
        "targetPage":1,
        "pageNum":30,
        "selectOption":$("#select").val(),
        "selectTime":$("#data").val(),
        "searchWord":$("#search-input").val()
    };
    console.log(data);
    initUserPage(data);
}
function selectSearch(e) {
    var data = {
        "targetPage":1,
        "pageNum":30,
        "selectOption":$("#select").val(),
        "selectTime":$("#data").val(),
        "searchWord":""
    };
    console.log(data);
    initUserPage(data);
}
function gotoPage(e) {
    var data = {
        "targetPage":$(e).html(),
        "pageNum":30,
        "selectOption":$("#select").val(),
        "selectTime":$("#data").val(),
        "searchWord":$("#search-input").val()
    };
    console.log(data);
    initUserPage(data);
}
function gotoButton(e) {
    var data = {
        "targetPage":$("#page-goto").val(),
        "pageNum":30,
        "selectOption":$("#select").val(),
        "selectTime":$("#data").val(),
        "searchWord":$("#search-input").val()
    };
    console.log(data);
    initUserPage(data);
}

/**
 * ********************************************查询数据接口，搜索、分页共用**************************************************
 * 后台转发到原页面
 * @param url
 */
function initUserPage(data) {
    $.ajax({
        url:"",
        data:data,
        method:"post"
    })
}

/**
 * **************************************************** 添加用户 ********************************************************
 */
function addUser(){
    var formdata = new FormData();
    var userImg = $("#user-img-add")[0].files[0]; // 文件对象
    var username = $("#username-add").val();
    var password = $("#password-add").val();
    var memberName = $("#memberName-add").val();
    var role = $("#role-add").val();
    var qq = $("#qq-add").val();
    var precentage = $("#precentage-add").val();
    var intro = $("#intro-add").val();
    var quo = $("#quo-add").val();

    var img = $("#user-img-add")[0].value;
    if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(img) && userImg != undefined) {
        layer.alert("图片类型必须是.gif,jpeg,jpg,png中的一种",{icon:2});
        return;
    }
    if (username == ""){
        layer.alert("手机号不能为空",{icon:2});
        return
    } else if (username.length != 11){
        layer.alert("请输入正确的手机号",{icon:2});
        return
    }
    if (password == ""){
        layer.alert("密码不能为空",{icon:2});
        return
    } else if (password.length<8 || password.length>16){
        layer.alert("密码长度应在8~16位",{icon:2});
        return
    }
    if (memberName == ""){
        layer.alert("会员名不能为空",{icon:2});
        return
    } else if (memberName.length>16){
        layer.alert("会员名长度不能超过16个字",{icon:2});
        return
    }
    if (role!="ms100051" && precentage == ""){
        layer.alert("必须设置分销比",{icon:2});
        return
    } else if (parseInt(precentage)>100 || precentage < 0){
        layer.alert("请输入正确的分销比",{icon:2});
        return
    }

    formdata.append("formdata", formdata);
    formdata.append("userImg", userImg);
    formdata.append("username", username);
    formdata.append("password", password);
    formdata.append("memberName", memberName);
    formdata.append("role", role);
    formdata.append("qq", qq);
    formdata.append("precentage", precentage);
    formdata.append("intro", intro);
    formdata.append("quo", quo);

    console.log(formdata);
    $.ajax({
        url: 'json/add.txt',
        type: 'POST',
        cache: false,
        data: formdata,
        dataType:"json",
        processData: false,
        contentType: false,
        success:function (data) {
            var code = data[Messager["CODE"]];
            if (code == "ms100060"){
                $("#add-one-wrap").empty().append("" +
                    "<h3 class='add-one-title'>添加用户</h3>\n" +
                    "                <!--<p class='error-info'><span class='fa fa-exclamation-circle'></span>这是提示信息</p>-->\n" +
                    "                <div class='ipt-wrap'>\n" +
                    "                    <span>头像</span>\n" +
                    "                    <label for='user-img-add' class='user-img'>选择头像</label>\n" +
                    "                    <input type='file' id='user-img-add' class='hidden'>\n" +
                    "                </div>\n" +
                    "                <div class='ipt-wrap'>\n" +
                    "                    <span>手机号</span>\n" +
                    "                    <input type='text' class='ipt-default' id='username-add'>\n" +
                    "                </div>\n" +
                    "                <div class='ipt-wrap'>\n" +
                    "                    <span>密码</span>\n" +
                    "                    <input type='password' class='ipt-default' id='password-add'>\n" +
                    "                </div>\n" +
                    "                <div class='ipt-wrap'>\n" +
                    "                    <span>会员名</span>\n" +
                    "                    <input type='text' class='ipt-default' id='memberName-add'>\n" +
                    "                </div>\n" +
                    "                <div class='ipt-wrap'>\n" +
                    "                    <span>角色</span>\n" +
                    "                    <select style='font-size: 10px;height: 20px;border-color: #ccc;color: #555;' id='role-add' onchange='changeRole(this)'>\n" +
                    "                        <option value='ms100053'>教师用户</option>\n" +
                    "                        <option value='ms100051'>学生用户</option>\n" +
                    "                        <option value='ms100052'>供应商</option>\n" +
                    "                        <option value='ms100054'>管理员</option>\n" +
                    "                    </select>\n" +
                    "                    <script>\n" +
                    "                        function changeRole(e) {\n" +
                    "                            var code = $(e).val();\n" +
                    "                            switch (code){\n" +
                    "                                case 'ms100053':$('#qq-wrap').removeClass('hidden');\n" +
                    "                                                $('#pre-wrap').removeClass('hidden');\n" +
                    "                                                $('#intro-wrap').removeClass('hidden');\n" +
                    "                                                $('#quo-wrap').removeClass('hidden');\n" +
                    "                                    break;\n" +
                    "                                case 'ms100054':;\n" +
                    "                                case 'ms100051':$('#qq-wrap').addClass('hidden');\n" +
                    "                                                $('#pre-wrap').addClass('hidden');\n" +
                    "                                                $('#intro-wrap').addClass('hidden');\n" +
                    "                                                $('#quo-wrap').addClass('hidden');\n" +
                    "                                                break;\n" +
                    "                                case 'ms100052':$('#qq-wrap').removeClass('hidden');\n" +
                    "                                                $('#pre-wrap').removeClass('hidden');\n" +
                    "                                                $('#intro-wrap').addClass('hidden');\n" +
                    "                                                $('#quo-wrap').addClass('hidden');\n" +
                    "                                                break;\n" +
                    "                            }\n" +
                    "                        }\n" +
                    "                    </script>\n" +
                    "                </div>\n" +
                    "                <div class='ipt-wrap' id='qq-wrap'>\n" +
                    "                    <span>腾讯QQ</span>\n" +
                    "                    <input type='text' class='ipt-default' id='qq-add'>\n" +
                    "                </div>\n" +
                    "                <div class='ipt-wrap' id='pre-wrap'>\n" +
                    "                    <span>分销比</span>\n" +
                    "                    <input type='number' placeholder='分销比在 0~100之间' class='ipt-default' id='precentage-add'>\n" +
                    "                </div>\n" +
                    "                <div class='ipt-wrap' id='intro-wrap'>\n" +
                    "                    <span class='exp-span'>讲师简介</span>\n" +
                    "                    <textarea type='text' class='scroller-default' id='intro-add'></textarea>\n" +
                    "                </div>\n" +
                    "                <div class='ipt-wrap' id='quo-wrap'>\n" +
                    "                    <span class='exp-span'>讲师语录</span>\n" +
                    "                    <textarea type='text' class='scroller-default' id='quo-add'></textarea>\n" +
                    "                </div>\n" +
                    "                <button class='btn-default class-11 btn' onclick='addUser()'>确定添加</button>" +
                    "");
                layer.alert(Messager[code],{icon:1});
            } else {
                layer.alert(Messager[code],{icon:2});
            }
        }
    })
}





