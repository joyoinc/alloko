/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Util = require('../helpers/util.js');

module.exports = {


  bookHouse: function (req, res) {

    if (!req.session.me) {
      return res.ok({ message: 'need to login first' });
    }

    Order.create({
      id: Util.genID(),
      type: 'house',
      customerId: req.session.me,
      customerName: req.param('customerFullName'),
      serverHost: req.param('houseOwner'),
      serviceStartDate: req.param('checkin'),
      serviceEndDate: req.param('checkout'),
      totalPrice: req.param('totalPrice'),
      paymentToken: [req.param('ccnum'), req.param('ccname'), req.param('expiredate')].join('+'),
    }).exec(function (err, aOrder) {
      if (err) return res.serverError(err);
      sails.log(`order ${aOrder.id} created`);

      return res.ok({ ok: 'ok', op: 'c' });
    });


  },
};

