/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    email: {
      type:'email',
      required: true,
      primaryKey: true
    },
    password: {
      type:'string',
      required: true,
    },
    roles: {
      type: 'array',
      defaultsTo: ['customer'],
    },
    nick: {
      type: 'string'
    },
    cell: {
      type: 'string'
    },

    hosts: {
      collection:'hostInfo',
      via: 'ofUser',
    },
  }
};

