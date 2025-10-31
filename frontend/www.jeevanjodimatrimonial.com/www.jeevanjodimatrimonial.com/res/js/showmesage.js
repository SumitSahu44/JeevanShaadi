function showmsg(spnid, msgtype, msgtext) {
    var imglblclass = "info";
    if (msgtext == "SE") {
        msgtext = "Error in connection with server";
    } else if (msgtext == "IR") {
        msgtext = "Invalid Response";
    }
    if (msgtype == "att") {
        msgtype = imglblclass = "warning";
    } else if (msgtype == "suc") {
        msgtype = "success";
        imglblclass = "check";
    } else if (msgtype == "err") {
        msgtype = "danger";
        imglblclass = "ban";
    }
    var msgcontainer = $("#" + spnid);
    msgcontainer.show();
    msgcontainer.removeAttr("class");
    msgcontainer.addClass("alert alert-" + msgtype + " alert-dismissable");
    msgcontainer.html("");
    //msgcontainer.html("<i class='fa fa-" + imglblclass + "'></i><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>×</button>" + msgtext + "</div>");
    msgcontainer.html("<i class='fa fa-" + imglblclass + "'></i>" + msgtext + "</div>");
}