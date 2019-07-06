
$(function() {
    $('.timestamp').each(function(){
        $(this).html((formatTimestamp($(this).html().trim())));
    });
});

function formatTimestamp(t) {
    let offset = new Date().getTimezoneOffset()/60;
    let dt = new Date(t);
    // dt.setHours(dt.getHours() - offset);
    return moment(dt).format('LLLL');
}
