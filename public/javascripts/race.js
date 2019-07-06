
$(function() {
    $('.timestamp').html((formatTimestamp($('.timestamp').html().trim())));
    $('.time').each(function() {
        rt = this.innerText;
        $(this).html(formatRaceTime(rt));
    })

});

function formatRaceTime(t) {
    let w = Math.floor(t/100);
    let ms = Math.floor(((t/100) - w) * 100);
    let s = Math.floor(t/100 % 60);
    let m = Math.floor((t/(100*60)) % 60);
    let h = Math.floor((t/(100*60*60)) % 24);
    let fTime = "";
    if (h > 0 ) {
        fTime += String(h).padStart(2, '0') + ":";
    }
    if (m > 0) {
        fTime += String(m).padStart(2, '0') + ":";
    }
    fTime += String(s).padStart(2, '0') + ".";
    fTime += String(ms).padStart(2, '0');
    return fTime
}

function formatTimestamp(t) {
    let offset = new Date().getTimezoneOffset()/60;
    let dt = new Date(t)
    // dt.setHours(dt.getHours() - offset)
    let m = moment(dt)
    return m.format('LLLL')
}
