$(document).ready(function() {
    smilierfeaturedprofiles();
});

function smilierfeaturedprofiles() {
    if ($("#divsmilierfeaturedprofiles").size() > 0) {
        var totprofile = parse_Int($("#hdtotprofile").val()); //set on Page
        if (totprofile == 0 && parse_Int($("#divcontailer").height()) > 0 && parse_Int($("#divcontailer").height()) < 350) {
            //Automatic get count by page length
            totprofile = 1;
        }
        var profileid = $("#hdsimilarprofile").val();
        /*get Profiles*/
        $.ajax({
            type: "GET",
            url: "handler/getprofiles.ashx?type=smilierfeaturedprofiles",
            data: {
                "totprofile": totprofile,
                "profileid": profileid
            },
            success: function(data1) {
                if (data1 != "") {
                    $("#divsmilierfeaturedprofiles").html(data1);
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                $("#divsmilierfeaturedprofiles").html("");
            }
        });
    }
    /*get whatsappno*/
    $.ajax({
        type: "GET",
        url: "handler/getprofiles.ashx?type=whatsappno",
        data: {},
        success: function(data1) {
            if (data1 != "") {
                $(".spnwhatsappno").html(" & Whatsapp @ " + data1);
                $(".spnwhatsappnophoto").html(data1);
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {

        }
    });
}