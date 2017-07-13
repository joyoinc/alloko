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
        host = req.session.me;

        res.view("dashboard", { chost: host, layout: 'host-layout' } );
    },

	main : function(req, res) {
        var host = Util.simpleID(3);
        req.session.me = host;

        res.view("dashboard", { chost: host, layout: 'host-layout' } );
    },

    becomeHost : function(req, res) {
        var host = req.session.me;

        res.view("user.join.ejs", { chost: host, layout: 'host-layout' } );
    },

    signIn : function(req, res) {
        var host = req.session.me;

        res.view("user.signin.ejs", { chost: host, layout: 'host-layout' } );
    },

    signUp : function(req, res) {
        var host = req.session.me;

        res.view("user.signup.ejs", { chost: host, layout: 'host-layout' } );
    },

    editHouse: function (req, res) {
        var host = req.session.me;

        House.findOne({ owner: host }).exec(function (err, myHouse) {
            if (err) return res.serverError(err);

            if (!myHouse) {
                sails.log(`Could not find house for ${host}`);

                res.view("hostMgr-edit-house", { chost: host, layout: 'host-layout' });
            } else {
                sails.log(`Find house ${myHouse.id} for ${host}`);

                res.view("hostMgr-edit-house", { chost: host, layout: 'host-layout', myHouse: myHouse });
            }
        });

    },

    editCar: function (req, res) {
        var host = req.session.me;

        Car.findOne({ owner: host }).exec(function (err, myCar) {
            if (err) return res.serverError(err);

            if (!myCar) {
                sails.log(`Could not find car for ${host}`);

                res.view("hostMgr-edit-car", { chost: host, layout: 'host-layout' });
            } else {
                sails.log(`Find car ${myCar.id} for ${host}`);

                res.view("hostMgr-edit-car", { chost: host, layout: 'host-layout', myCar: myCar });
            }
        });

    },
    /** End Page */
};

