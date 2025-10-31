$(function() {
    var url = window.location.pathname;
    var myPageName = url.substring(url.lastIndexOf('/') + 1);
    if (myPageName != "" && myPageName.indexOf('.') > -1) {
        var t = myPageName.split('.');
        var s = t[0] + ".aspx";
        var qrst = unescape(window.location);
        var qs = qrst.split('?');
        if (qs[1] != undefined) {
            s += "?" + qs[1];
        }
        $("li.current").removeClass("current");
        $("a[href='" + s + "']").parent().addClass("current");
        $("a[href='" + s + "']").parent().parent().parent().addClass("current");
    }
});

function showtoppopupdiv(th) {
    var containerid = $($(th).attr("popdiv"));
    if (containerid.attr('class') == 'logdivhide') {
        $('#logindiv').removeClass('logdivshow').addClass('logdivhide');
        $('#callinfodiv').removeClass('logdivshow').addClass('logdivhide');
        containerid.removeClass('logdivhide').addClass('logdivshow');
    } else {
        containerid.removeClass('logdivshow').addClass('logdivhide');
    }
}
$(document).mouseup(function(e) {
    if (!$(e.target).hasClass("youcanhide")) {
        if (!$('#logindiv').hasClass('logdivhide')) {
            var container = $("#logindiv");
            if (!container.is(e.target) &&
                container.has(e.target).length === 0) {
                container.removeClass('logdivshow').addClass('logdivhide');
            }
        }
        if (!$('#callinfodiv').hasClass('logdivhide')) {
            var container = $("#callinfodiv");
            if (!container.is(e.target) &&
                container.has(e.target).length === 0) {
                container.removeClass('logdivshow').addClass('logdivhide');
            }
        }
    }
});