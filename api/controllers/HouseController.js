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
  },

	echo: function(req,res) {
        res.ok(req.allParams())
  },

	publish: function(req,res) {
    var obj = req.allParams()

    House.create(obj).exec(function (err, house){
      if(err) return res.serverError(err)

      sails.log(`${house.id} created`)
      return res.ok({code:"ok"});
    })
  },

	recent: function(req,res) {
    House.find().exec(function (err, house){
      if(err) return res.serverError(err)

      return res.json(house);
    })
  },
};

