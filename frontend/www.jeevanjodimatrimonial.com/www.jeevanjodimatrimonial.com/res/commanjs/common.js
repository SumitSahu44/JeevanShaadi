function CheckCnote(cno) {
    if (cno.length == 9 || cno.length == 10) {
        return true;
    }
    return false;
}

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

function scrolltobottom(x) {
    var s = $("#" + x);
    s.scrollTop(s.prop("scrollHeight"));
}
if (!Array.prototype.Contains) {
    Array.prototype.Contains = function(searchElement /*, fromIndex */ ) {
        "use strict";
        if (this === void 0 || this === null) throw new TypeError();
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) return false;
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n !== n) n = 0;
            else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
        if (n >= len) return false;
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (typeof(t[k]) != "undefined" && typeof(searchElement) != "undefined" && t[k].toLowerCase() == searchElement.toLowerCase()) return true;
        }
        return false;
    };
}

function comman() {

    $("input").attr("autocomplete", "off");
    $('input.call_click').unbind("keypress").bind("keypress", function(e) {

        if (e.which == 13) {
            var $targ = $(e.target);
            var at = $($targ).attr("click_button");
            if (!$targ.is("textarea") && !$targ.is(":button,:submit")) {
                $("#" + at).click();
            }
            return false;
        }
    });
    $("input.float").bind('keypress', function(e) {
        if (e.keyCode == '9' || e.keyCode == '16') {
            return;
        }
        var charCode = (e.which) ? e.which : e.keyCode;
        var s = this.value.split(".");
        var is = false;
        if (s.length > 1) {
            is = true;
        }
        if (charCode == 46 && !is) {
            if (s[0] == "") {
                s[0] = "0";
            }
            $(this).val(s[0] + ".");
            return false;
        } else if (is && s[1].length > 2) {
            return false;
        } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
    });
    $("input.float").bind('mouseenter keyup', function(e) {
        var val = $(this).val();
        if (val != '0') {
            val = val.replace(/[^0-9]^.+/g, "");
            $(this).val(val);
        }
    });
    $("input.numberwithcomma").bind('keypress', function(e) {
        if (e.keyCode == '9' || e.keyCode == '16') {
            return;
        }
        var charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode > 31 && ((charCode < 48 && charCode != 44) || charCode > 57))) {
            return false;
        }
        return true;
    });
    $("input.numberwithcomma").bind('keyup', function(e) {
        var val = $(this).val();
        if (val != '0') {
            val = val.replace(/[^0-9|^,]/g, "");
            $(this).val(val);
        }
    });
    $("input.number").bind('keypress', function(e) {
        if (e.keyCode == '9' || e.keyCode == '16') {
            return;
        }
        var charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
            return false;
        }
        return true;
    });
    $('input.alpha').bind('keyup blur', function() {
        $(this).val($(this).val().replace(/[^a-z]/g, ''));
    });
    $("input.number").bind("keyup", function(e) {
        var val = $(this).val();
        if (val != '0') {
            val = val.replace(/[^0-9]+/g, "");
            $(this).val(val);
        }
    });
    $("input.number").bind('mouseenter', function(e) {
        var val = $(this).val();
        if (val != '0') {
            val = val.replace(/[^0-9]+/g, "");
            $(this).val(val);
        }
    });
    $("input.number").css("text-align", "right");
    $("input.float").css("text-align", "right");
    $("input.noright").css("text-align", "left");
    //$('form').keypress(function (e) { if (e.which == 13) { var $targ = $(e.target); if (!$targ.is("textarea") && !$targ.is(":button,:submit") && !$targ.hasClass("call_click")) { var focusNext = false; $(this).find(":input:visible:not([disabled],[readonly]), a").each(function () { if (this === e.target) { focusNext = true; } else if (focusNext) { $(this).focus(); return false; } }); return false; } } });
    var dt = $("input.dt");
    if (dt.length > 0) {
        for (i = 0; i < dt.length; i++) {
            $(dt[i]).datepicker({
                changeMonth: true,
                changeYear: true
            });
            var x = $(dt[i]).val();
            $(dt[i]).datepicker("option", "dateFormat", "dd-M-yy");
            $(dt[i]).val(x);
            $(dt[i]).addClass("ro");
        }
    }
    var dt = $("input.time");
    if (dt.length > 0) {
        for (i = 0; i < dt.length; i++) {
            var x = $(dt[i]).val();
            $(dt[i]).timeEntry({
                show24Hours: true
            });
            var e = jQuery.Event("keydown");
            e.keyCode = 36;
            e.ctrlKey = true;
            $(dt[i]).trigger(e);
            if (x != "") {
                //$(dt[i]).val(x);
            }
        }
    }
    $(".ro").bind("paste", function(e) {
        e.preventDefault();
    });
    $(".ro").keypress(function(event) {
        if (event.which != 9 && event.which != 13) return false;
    });
    $(".ro").keyup(function(event) {
        if (event.which != 9 && event.which != 13) return false;
    });
    $(".ro").keydown(function(event) {
        if (event.which != 9 && event.which != 13) return false;
    });
    $("input:disabled").addClass("dis");
    //$(".dis").attr("disabled","disabled");
    $("input").click(function() {
        $(this).select();
    });
}
$(function() {
    comman();
});
// function for data with no hidden field
function get_datanh(str, colunm_no) {
    var val1 = str;
    var b = new Array();
    if (val1 != "undefined" && val1 != undefined) {
        var data = val1.split("$%^$%^");
        for (i = 0; i < data.length; i++) {
            var d = data[i].split("$%$%$%");
            b.push(d[colunm_no]);
        }
    }
    return b;
}
//end data
function get_data(hidden_field_id, colunm_no) {
    var val1 = $("#" + hidden_field_id).val();
    var b = new Array();
    if (val1 != "undefined" && val1 != undefined) {
        var data = val1.split("$%^$%^");
        for (i = 0; i < data.length; i++) {
            var d = data[i].split("$%$%$%");
            b.push(d[colunm_no]);
        }
    }
    return b;
}

function check_data(hidden_field_id, text_box_id, colunm_no) {
    var b = get_data(hidden_field_id, colunm_no);
    if (b.length == 0) return false;
    return b.Contains($("#" + text_box_id).val());
}

function get_val(hidden_field_id, check_value, check_colunm_no, get_colunm_no) {
    var d = get_data(hidden_field_id, check_colunm_no);
    var d1 = get_data(hidden_field_id, get_colunm_no);
    var s;
    var str = "";
    if (d.length == d1.length) {
        for (s = 0; s < d.length; s++) {
            if (d[s] == check_value) {
                str = d1[s];
                break;
            }
        }
    }
    return str;
}

function get_val_arr(hidden_field_id, check_value, check_colunm_no, get_colunm_no) {
    var d = get_data(hidden_field_id, check_colunm_no);
    var a = Array();
    var d1 = get_data(hidden_field_id, get_colunm_no);
    var s;
    var str = "";
    if (d.length == d1.length) {
        for (s = 0; s < d.length; s++) {
            if (d[s] == check_value) {
                a.push(d1[s]);
            }
        }
    }
    return a;
}

function parse_Float(x) {
    var d = parseFloat(x);
    if (d !== d) d = 0;
    return d;
}

function parse_Int(x) {
    var d = parseInt(x);
    if (d !== d) d = 0;
    return d;
}

function call_click() {

}
jQuery.fn.highlight = function() {
    $(this).each(function() {
        var el = $(this);
        el.before("<div/>")
        el.prev()
            .css({
                "background-color": "#ffff99",
                "opacity": ".9"
            })
            .fadeOut(500);
    });
}