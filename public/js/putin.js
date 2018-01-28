$(document).ready(function () {

    var timeoutID = null;

    if(typeof ga != 'function'){
        window.ga = function(){};
    }

    function findImage(str) {
        $("#spinnerBox").show();
        $("#resultBox").hide();
        $.get("/q", {s: str})
            .done(function (data) {
                $("#spinnerBox").hide();
                if(data[0]) {
                    var imagePath = "/cdn/" + data[0].file;
                    $("#imageBox").html("<img id='putin' src='"+ imagePath + "'/>");
                    $("#linkBox").val("https://putinemoji.com" + imagePath);
                    $("#resultBox").show();
                }
                ga('send', 'pageview', '/search?searchText=' + str);
            });
    }

    $('#searchBox').keyup(function (e) {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function () {
            findImage(e.target.value)
        }, 500);
    });

});

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).val()).select();
    document.execCommand("copy");
    $temp.remove();
}