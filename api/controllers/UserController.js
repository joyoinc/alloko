/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Util = require('../helpers/util');

var self = module.exports = {

    _setMe: function (id, req) {
        req.session.me = id;
    },

    /* API */
    me: function (req, res) {
        self._setMe(req.param('id'), req);
        res.ok(req.session.me);
    },
    /* End API */

    /* Page */
    signIn: function (req, res) {
        User.findOne({ email: req.param('email'), password: Util.encString(req.param('password')) }).exec(function (err, aUser) {
            if (err) return res.serverError(err);

            if (aUser) {
                sails.log(`User ${aUser.email} sign in `);

                self._setMe(aUser.email, req);
                var target = decodeURIComponent(req.session.redirectTo || '/');
                res.redirect(target);
            } else {
                res.notFound('user not found');
            }
        });
    },

    signUp: function (req, res) {
        var newUser = {
            email: req.param('email'),
            password: Util.encString(req.param('password')),
            nick: Util.simpleID(5),
            cell: req.param('cell'),
        };

        User.create(newUser).exec(function (err, aUser) {
            if (err) return res.serverError(err);

            sails.log(`User ${aUser.email} signed up `);
            self._setMe(aUser.email, req, res);
            return res.redirect('/dashboard');
        });
    },

    updateProfile: function (req, res) {
        var userId = req.session.me;

        var newProfile = {
            cell: req.param('cell'),
            nick: req.param('nick'),
        };

        User.update(userId, newProfile).exec(function (err, aUser) {
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
            age: req.param('age'),
            sex: req.param('sex'),
            servicetype: Util.ensureArray(req.param('servicetype')),
            servicecity: Util.ensureArray(req.param('servicecity')),
            servicelanguage: Util.ensureArray(req.param('servicelanguage')),
            hobby: Util.ensureArray(req.param('hobby')),
        };

        User.findOne(userId).exec(function (err, aUser) {
            aUser.roles.push('host');
            aUser.hosts.add(newHost);
            aUser.save(function (err) {
                if (err) return res.serverError(err);

                sails.log(`host ${newHost.hostId} joined`);
                return res.redirect('/dashboard');
            });
        });

    },

    /* End Page */
};

