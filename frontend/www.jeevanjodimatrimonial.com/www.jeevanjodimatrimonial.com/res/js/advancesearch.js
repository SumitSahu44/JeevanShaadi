$(document).ready(function() {
    $('#chkcastenobar').click(function() {
        chkcastenobar();
    });
    $("[id$='mstatus'] tr td input[type=radio]").click(function() {
        rdbmstatus();
    });
    $("#lstm").multipleSelect({
        placeholder: 'Any',
        selectAll: false,
        filter: true
    });
    $("#lstrel").multipleSelect({
        placeholder: 'Any',
        selectAll: false,
        filter: true
    });
    $("#lstcas").multipleSelect({
        placeholder: 'Any',
        selectAll: false,
        filter: true
    });
    $("#lstedu").multipleSelect({
        placeholder: 'Any',
        selectAll: false,
        filter: true
    });
    $("#lstoccu").multipleSelect({
        placeholder: 'Any',
        selectAll: false,
        filter: true
    });
    $("#lststt").multipleSelect({
        placeholder: 'Any',
        selectAll: false,
        filter: true
    });
});

function setmulti() {
    $("#lstcas").multipleSelect({
        placeholder: 'Any',
        selectAll: false,
        filter: true
    });
}

function rdbmstatus() {
    var chk = $('#mstatus').find(":checked").val();
    if (chk != "Never Married") {
        $("#divchildliving").show("slow");
        $("[id$='havechild']").addClass("radioreq");
    } else {
        $("#divchildliving").hide("slow");
        $("[id$='havechild']").removeClass("radioreq");
    }
}

function chkcastenobar() {
    if ($('#chkcastenobar').is(':checked')) {
        $('.castnobar').hide("slow");

    } else {
        $('.castnobar').show("slow");
    }
}