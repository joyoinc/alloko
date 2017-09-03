
// js date related functions
var dateToString = function(date) {
    var dd = date.getDate();
    dd = dd < 10 ? '0' + dd : dd;
    var mm = date.getMonth()+1;
    mm = mm < 10 ? '0' + mm : mm;
    var yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
}

var stringToDate = function(str) {
    var format = /(\d\d\d\d)-(\d\d)-(\d\d)/;
    if(found = str.match(format)) {
        return new Date(found[1], found[2]-1, found[3]);
    }
    return new Date();
}

var addDays = function(date, n) {
    return new Date(n * 86400000 + date.getTime());
}

var diffDays = function(date1, date2) {
    return parseInt((date1.getTime() - date2.getTime()) / 86400000);
}