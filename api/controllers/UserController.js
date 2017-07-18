/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Util = require('../helpers/util');

var self = module.exports = {

    _setMe : function(id, req, res) {
        req.session.me = id;
    },

    /* API */
	me : function(req, res) {
        self._setMe(req.param('id'), req);

        res.ok(req.session.me);
    },

    updateProfile: function(req, res) {

        
    },

    /* End API */

    /* Page */
    signIn: function(req, res) {
        console.log(req.allParams());

        User.findOne({email: req.param('email'), password: Util.encString(req.param('password'))}).exec(function (err, record) {
            if (err) return res.serverError(err);

            if (record) {
                self._setMe(record.email, req, res);

                sails.log(`User ${record.email} sign in `);

                var target = decodeURIComponent(req.session.redirectTo || '/');
                res.redirect(target);
            } else {
                res.notFound('user not found');
            }
        });

    },

    signUp: function(req, res) {
        sails.log(req.allParams());

        User.create({ email: req.param('email'), password: Util.encString(req.param('password')),
            profile: { nick: Util.simpleID(7), cell: req.param('cell'), },
        }).exec(function (err, record) {
            if (err) return res.serverError(err);

            sails.log(`User ${record.email} sign up done`);
            
            self._setMe(record.email, req, res);
            res.ok('ok');
        });

    },

    /* End Page */
};

