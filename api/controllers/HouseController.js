/**
 * HouseController
 *
 * @description :: Server-side logic for managing houses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Util = require('../helpers/util')

var self = module.exports = {

  /* API */
	hi: function(req,res) {   
      sails.log(Util.simpleID(7))
      res.ok();
  },

	echo: function(req,res) {
        res.ok(req.allParams())
  },

	_publish: function(house, res) {

    House.create(house).exec(function (err, record){
      if(err) return res.serverError(err);

      sails.log(`house ${record.id} created`);
      return res.ok({ok:'ok', op:'c'});
    })
  },

  _update: function(house, res) {
    House.update({ owner: house.owner },house).exec(function (err, record){
      if(err) return res.serverError(err);

      sails.log(`${record.length} house(s) updated`);
      return res.ok({ok:'ok', op:'u'});
    })
  },

  publishOrUpdate: function (req, res) {
    var newHouse = req.allParams();
    newHouse['modifiedBy'] = req.session.me || 'A ghost!'; 
    newHouse['owner'] = req.param('houseowner') || req.session.me ;

    Util.handleChkboxControl(req, ['forbids', 'facility'], newHouse);

    House.findOne({ owner: newHouse['owner'] }).exec(function (err, record) {
      if (err) return res.serverError(err);

      if (record) {
        self._update(newHouse, res);
      } else {
        self._publish(newHouse, res);
      }
    });
  },

	recent: function(req,res) {
    var query = House.find();
    var toSkip = req.param('skipCount');
    query.sort('updatedAt DESC').limit(6).skip(toSkip);

    query.exec(function (err, house){
      if(err) return res.serverError(err)

      return res.json(house);
    })
  },

  /* End API */

  /* Page */

  /* override Blueprint */
  findOne: function(req, res) {
    var id = req.param('id');

    House.findOne(id).exec(function (err, record) {
      if (err) return res.serverError(err);

      if (record) {
        res.view('house.detail.ejs', { house: record });
      } else {
        res.notFound(id);
      }
    });
  },

  /* End Blueprint */

  /* End Page */
};

