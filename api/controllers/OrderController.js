/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Util = require('../helpers/util.js');

module.exports = {
newHouseOrder: function(req, res){
               Order.create({id: Util.genID(),
                   type:'house',
                   email: 'nobody@nowhere.com'
                   }).exec(function(err, aOrder){
                     if(err) res.send(err);

                     res.ok('ok');
                     });


               },
};

