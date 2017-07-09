/**
 * HostManagerController
 *
 * @description :: Server-side logic for managing hostmanagers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Util = require('../helpers/util');

module.exports = {
    /** Page */
    me : function(req, res) {
        var host = 'ths';
        req.session.me = host;

        res.view("dashboard", { chost: host } );
    },

	main : function(req, res) {
        var host = Util.simpleID(3);
        req.session.me = host;

        res.view("dashboard", { chost: host } );
    },

    editHouse: function (req, res) {
        var host = req.session.me;

        House.findOne({ owner: host }).exec(function (err, myHouse) {
            if (err) return res.serverError(err);

            if (!myHouse) {
                sails.log(`Could not find house for ${host}`);
                res.view("house/edit", { chost: host });
            } else {
                res.view("house/edit", { chost: host, myHouse: myHouse });
            }
        });

    },

    editCar: function (req, res) {
        var host = req.session.me;

        Car.findOne({ owner: host }).exec(function (err, myCar) {
            if (err) return res.serverError(err);

            if (!myCar) {
                sails.log(`Could not find car for ${host}`);
                res.view("car/edit", { chost: host });
            } else {
                res.view("car/edit", { chost: host, myCar: myCar });
            }
        });

    },
    /** End Page */
};

