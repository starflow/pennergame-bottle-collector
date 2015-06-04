module.exports.formatTime = function formatTime(time_in_s) {
    var minutes = zeroPad(Math.floor(time_in_s / 60)),
        seconds = zeroPad(time_in_s % 60);

    return minutes + ':' + seconds;
};

function zeroPad(number, digits) {
    digits = digits || 2;

    var result = number.toString(),
        diff = digits - result.length;

    if (diff > 0) {
        for (; diff > 0; diff--) {
            result = '0' + result;
        }
    }
    return result;
};
