
/**
 * Util functions 
 */

var md5 = require('./md5');

var self = module.exports = {

    simpleID: function (length) {
        var arr = 'qwertyuiopasdfghjklzxcvbnm1234567890'.split('');
        return self.shuffleArray(arr).slice(0, length).join('');
    },

    genID: function () {
        return `${self.encString((new Date()).getTime()).substr(0, 11)}`;
    },

    shuffleArray: function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },

    addToArray: function (array, elem, wantUniq) {
        if (!wantUniq || !array.includes(elem))
            array.push(elem);
    },

    ensureArray: function (elemOrArray) {
        return elemOrArray instanceof Array ? elemOrArray : [elemOrArray];
    },

    handleChkboxControl: function (req, chkNames, obj) {
        self.ensureArray(chkNames).forEach((elem) => {
            obj[elem] = self.ensureArray(req.param(elem) || '');
        });
    },

    encString: function (inputString) {
        return md5(inputString);
    },

    diffDays: function (date1, date2) {
        return parseInt((date1.getTime() - date2.getTime()) / 86400000);
    },

    isInRange: function (date, start, end) {

        var result = self.diffDays(date, start) >= 0 && self.diffDays(date, end) <= 0;
        sails.log(`check ${self.dateToString(date)} in (${self.dateToString(start)} , ${self.dateToString(end)}), ans = ${result} `);
        return result;
    },

    datesInRange: function (start, end) {
        var range = [];
        var current = start;
        while (self.diffDays(current, end) < 0) {
            range.push(current);
            current = self.dateAddDays(current, 1);
        }
        return range;
    },

    dateAddDays: function (date, n) {
        return new Date(n * 86400000 + date.getTime());
    },

    dateToString: function (date) {
        var dd = date.getDate();
        dd = dd < 10 ? '0' + dd : dd;
        var mm = date.getMonth() + 1;
        mm = mm < 10 ? '0' + mm : mm;
        var yyyy = date.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
    },

    stringToDate: function (str) {
        var format = /(\d\d\d\d)-(\d\d)-(\d\d)/;
        if (found = str.match(format)) {
            return new Date(found[1], found[2] - 1, found[3]);
        }
        return new Date();
    },

}
