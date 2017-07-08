/**
 * HouseController
 *
 * @description :: Server-side logic for managing houses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	hi: function(req,res) {
        console.log(req.allParams())
        res.ok();
  }
};

