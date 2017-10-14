/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Util = require('../helpers/util'),
    Mailer = require('../services/Mailer.js');

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
                //Mailer.sendWelcomeMail(aUser);
                res.json({ redirectTo: target });
            } else {
                res.json({ errCode: 'notMatch' });
            }
        });
    },

    signUp: function (req, res) {
        User.findOne({ email: req.param('email'), password: Util.encString(req.param('password')) }).exec(function (err, foundUser) {
            sails.log(`found User ${foundUser} `);
            if (foundUser)
                return res.json({ errCode: 'usrExist' });

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
                return res.json({ errCode: '' });
            });
        });
    },

    changePassword: function (req, res) {
        if (req.param('newpassword') !== req.param('newpassword1'))
            res.json({ errCode: 'notMatch' });

        var userId = req.session.me;
        User.findOne({ email: userId, password: Util.encString(req.param('password')) }).exec(function (err, aUser) {
            if (err) return res.serverError(err);

            if (aUser) {
                aUser.password = Util.encString(req.param('newpassword'));
                aUser.save(function (err) {
                    if (err) return res.serverError(err);

                    sails.log(`User ${aUser.email} password changed `);
                    return res.json({ errCode: '' });
                });
            } else {
                res.json({ errCode: 'notFound' });
            }

        });
    },

    resetPassword: function (req, res) {
        User.findOne({ email: req.param('email') }).exec(function (err, aUser) {
            if (err) return res.serverError(err);
            var newPass = Util.simpleID(9);
            aUser.password = Util.encString(newPass);

            aUser.save(function (err) {
                if (err) return res.serverError(err);

                sails.log(`User ${aUser.email} password reset `);
                var message = {
                    email: aUser.email,
                    password: newPass
                }
                Mailer.sendResetEmail(message);
                return res.json({ errCode: '' });
            });
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

