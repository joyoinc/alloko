/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var self = module.exports = {

    _me : function(uid) {
        req.session.me = uid;
    },

    /* API */
	me : function(req, res) {
        self._me(req.param('uid'));

        res.ok(req.session.me);
    },

    /* End API */

    signIn: function(req, res) {
        User.findOne({uid: req.param('uid'), password: req.param('password')}).exec(function (err, record) {
            if (err) return res.serverError(err);

            if (record) {
                self._me(record.uid);

            } else {
                res.notFound('user not found');
            }
        });

    },
};

