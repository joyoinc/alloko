
/**
 * Util functions 
 */

var md5 = require('./md5');

var self = module.exports = {

    simpleID: function(length) {
        var arr = 'qwertyuiopasdfghjklzxcvbnm1234567890'.split('');
        return self.shuffleArray(arr).slice(0, length).join('');
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

    addToArray: function(array, elem, wantUniq) {
        if(!wantUniq || !array.includes(elem))
            array.push(elem);
    },

    ensureArray: function(elemOrArray) {
        return elemOrArray instanceof Array ? elemOrArray : [ elemOrArray ];
    },

    handleChkboxControl: function(req, chkNames, obj) {
        self.ensureArray(chkNames).forEach((elem) => {
            obj[elem] = self.ensureArray(req.param(elem) || '');
        });
    },

    encString: function(inputString) {
        return md5(inputString);
    }

}