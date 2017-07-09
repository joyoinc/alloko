
/**
 * Util functions 
 */

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

    ensureArray: function(elemOrArray) {
        return elemOrArray instanceof Array ? elemOrArray : [ elemOrArray ];
    },

}