/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var current_db = sails.config.connections[sails.config.models.connection];
var fsdb = `mongodb://${current_db.user}:${current_db.password}@${current_db.host}:${current_db.port}/${current_db.database}.snapshot`
var blobAdapter = require('skipper-gridfs')({uri: fsdb})


module.exports = {

  createRichMessage: function(req, res) {
    req.file('snap').upload({ adapter: blobAdapter },function whenDone(err, uploadedFiles){
      if (err) return res.negotiate(err);
      var fd = uploadedFiles[0].fd;

      Message.create({ title: req.param('title'),
          detail: req.param('detail'),
          snapshot: fd
          }).exec(function(error, msg){
        if (error) return res.serverError(error)
        sails.log(`${msg.id} created`)
        return res.ok({code:"ok", message: msg});
      })
    })
  },

  uploadSnapshot: function(req, res) {
    req.file('snap').upload({ adapter: blobAdapter },function whenDone(err, uploadedFiles){
      if (err) return res.negotiate(err);
      return res.ok({code:"ok", files: uploadedFiles});
    })
  },

  downloadSnapshot: function(req,res) {
    var fd = req.param('fd')
    blobAdapter.read(fd, function(err, file){
      if(err) res.json(error)
      else {
        res.contentType('image/png')
        res.send(new Buffer(file))
      }
    })
  }
};

