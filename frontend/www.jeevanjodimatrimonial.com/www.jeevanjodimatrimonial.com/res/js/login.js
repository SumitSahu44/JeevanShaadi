$(document).ready(function() {
    $(document).bind('keypress', function(e) {
        if (e.keyCode == 13) {
            if ($("#logindiv").hasClass('logdivshow')) {
                $('#btnloginhome').trigger('click');
            } else if ($("#popdivlogin").is(':visible')) {
                $('#srchrsltlogin').trigger('click');
            }
        }
    });
});

function loginhomepage(th) {
    if ($('#txtmemberid').val() != "" && $('#txtpassword').val() != "" && $('#txtmemberid').val() != "Login ID/Email-ID" && $('#txtpassword').val() != "******") {
        $(th).val("Wait...");
        $(th).attr('Disabled', 'Disabled');
        $('#loginloader').show();
        /*Check Login*/
        $.ajax({
            type: "GET",
            url: "handler/login.ashx?type=loginhome",
            data: {
                "memberid": $('#txtmemberid').val(),
                "password": $('#txtpassword').val()
            },
            success: function(data1) {
                $(th).removeAttr('Disabled');
                $(th).val("Login");
                $('#loginloader').hide();
                //$('#loginmsg').removeClass();
                if (data1 != "") {
                    str = data1.split('@@');
                    if (str.length == 2) {
                        if (str[0] == "err") {
                            showmsg('loginmsg', 'err', str[1]);
                        } else if (str[0] == "suc") {
                            window.location.href = str[1];
                        }
                    } else {
                        showmsg('loginmsg', 'err', 'Something went wrong.Please try again...');
                    }
                } else {
                    showmsg('loginmsg', 'err', 'Something went wrong.Please try again...');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                // $('#loginmsg').removeClass();
                showmsg('loginmsg', 'err', 'Something went wrong.Please try again...');
                $(th).removeAttr('Disabled');
                $(th).val("Login");
            }
        });
    } else {
        showmsg('loginmsg', 'att', 'Please Enter Login-ID and Password.');
    }
}

function searchlogin(th) {
    if ($('#txtuserid').val() != "" && $('#txtsrchpassword').val() != "" && $('#txtuserid').val() != "Login ID/Mobile #/Profile ID" && $('#txtsrchpassword').val() != "******") {
        $(th).val("Wait...");
        $(th).attr('Disabled', 'Disabled');
        $('#loginmsg').removeClass();
        $('#loginmsg').addClass("ajaxloader");
        /*Check Login*/
        $.ajax({
            type: "GET",
            url: "handler/login.ashx?type=loginhome",
            data: {
                "memberid": $('#txtuserid').val(),
                "password": $('#txtsrchpassword').val()
            },
            success: function(data1) {
                $(th).removeAttr('Disabled');
                $(th).val("Login");
                $('#loginmsg').removeClass();
                if (data1 != "") {
                    str = data1.split('@@');
                    if (str.length == 2) {
                        if (str[0] == "err") {
                            showmsg('popmsglogin', 'err', str[1]);
                        } else if (str[0] == "suc") {
                            if (getCookie("searchgender") == $("#hdgender").val()) {
                                window.location.href = str[1];
                            } else {
                                $("[data-dismiss='modal']").click();
                                $("#btnafterlogin").click();
                                $(".linkregister").hide();
                                $(".facebook").hide();
                                $("a[popdiv='#logindiv']").parent().hide();
                            }
                        }
                    } else {
                        showmsg('popmsglogin', 'err', 'Something went wrong.Please try again...');
                    }
                } else {
                    showmsg('popmsglogin', 'err', 'Something went wrong.Please try again...');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                $('#loginmsg').removeClass();
                showmsg('popmsglogin', 'err', 'Something went wrong.Please try again...');
                $(th).removeAttr('Disabled');
                $(th).val("Login");
            }
        });
    } else {
        showmsg('popmsglogin', 'att', 'Please Enter Login-ID and Password.');
    }
}