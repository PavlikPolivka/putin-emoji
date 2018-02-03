$(document).ready(function () {

    var timeoutID = null;

    $('.has-clear input[type="text"]').on('input propertychange', function() {
        var $this = $(this);
        var visible = Boolean($this.val());
        $this.siblings('.form-control-clear').toggleClass('hidden', !visible);
    }).trigger('propertychange');

    $('.form-control-clear').click(function() {
        $(this).siblings('input[type="text"]').val('')
            .trigger('propertychange').focus();
        $("#resultBox").hide();
    });

    renderRecent();

    function findImage(str) {
        $("#spinnerBox").show();
        $("#resultBox").hide();
        $.get("/q", {s: str})
            .done(function (data) {
                $("#spinnerBox").hide();
                if(data[0]) {
                    var imagePath = "/cdn/" + data[0].file;
                    $("#imageBox").html("<img id='putin' src='"+ imagePath + "'/>");
                    $("#putin").click(function() {
                        copyToClipboard("#linkBox");
                        notifyCopied($('#copyBox'));
                    });
                    $("#linkBox").val("https://putinemoji.com" + imagePath);
                    storeRecent(data[0]);
                    $("#resultBox").show();
                    gtag('event', str, {
                        'event_category': 'search',
                        'event_label': 'results'
                    });
                    renderRecent();
                } else {
                    gtag('event', str, {
                        'event_category': 'search',
                        'event_label': 'no_results'
                    });
                }
            });
    }

    $('#searchBox').keyup(function (e) {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function () {
            findImage(e.target.value)
        }, 500);
    });

});

function renderRecent() {
    var recent = getRecent();
    var $recentBox = $('#recentBox');
    $recentBox.html('');
    for (var i=recent.length - 1; i >= 0; i--) {
        var emoji = recent[i];
        var imagePath = "/cdn/" + emoji.file;
        var recentHtml = "<div class='col-4'><img class='smallPutin' src='" + imagePath + "' title=' " + emoji.tag[0] + " '></div>";
        var html = $recentBox.html();
        $recentBox.html(recentHtml + html);
    }
    $(".smallPutin").click(function() {
        var url = "https://putinemoji.com" + $(this).attr('src');
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(url).select();
        document.execCommand("copy");
        $temp.remove();
        notifyCopied($(this));
    });
}

function getRecent() {
    var recent = localStorage.getItem("recentPutin");
    if (recent) {
        recent = JSON.parse(recent);
    } else {
        recent = [];
    }
    return recent;
}

function storeRecent(data) {
    var recent = getRecent();
    recent.unshift(data);
    if(recent.length > 6) {
        recent.length = 6;
    }
    localStorage.setItem("recentPutin", JSON.stringify(recent));
}

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).val()).select();
    document.execCommand("copy");
    $temp.remove();
}

function notifyCopied($element) {
    $element.notify("URL copied!", {
        autoHide: true,
        autoHideDelay: 1000,
        className: 'info'
    });
}