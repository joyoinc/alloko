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

    signIn: function(req, res) {

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

        User.create({ email: req.param('email'), password: Util.encString(req.param('password')),
            profile: { nick: Util.simpleID(7), cell: req.param('cell'), },
        }).exec(function (err, record) {
            if (err) return res.serverError(err);

            sails.log(`User ${record.email} sign up done`);
            
            self._setMe(record.email, req, res);
            res.ok('ok');
        });

    },
    /* End API */

    /* Page */

    updateProfile: function(req, res) {
        var userId = req.session.me;

        var newProfile = {
            cell: req.param('cell'),
            nick: req.param('nick'),
        }

        User.update({ email: userId }, { profile: newProfile }).exec(function (err, aUser) {
            if (err) return res.serverError(err);

            sails.log(`user ${userId} profile updated`);
            return res.redirect('/dashboard');
        });
    },

        join: function (req, res) {
        var userId = req.session.me;

        var newHost = {
            hostId: Util.simpleID(11),
            firstname: req.param('firstname'),
            lastname: req.param('lastname'),
            servicetype: Util.ensureArray(req.param('servicetype')),
            servicecity: Util.ensureArray(req.param('servicecity')),
            servicelanguage: Util.ensureArray(req.param('servicelanguage')),
            hobby: Util.ensureArray(req.param('hobby')),
        };

        User.update({ email: userId }, { hostInfo: newHost }).exec(function (err, aUser) {
            if (err) return res.serverError(err);

            sails.log(`user ${userId} joined as host`)
            return res.redirect('/dashboard');
        });
    },

    /* End Page */
};

