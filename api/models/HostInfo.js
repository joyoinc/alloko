/**
 * HostInfo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    hostId: {
      type: 'string',
      primaryKey: true
    },
    lastname: {
      type: 'string'
    },
    firstname: {
      type: 'string'
    },
    servicetype:{
      type:'array',
    },
    servicecity:{
      type:'array',
    },
    servicelanguage:{
      type:'array',
    },
    hobby:{
      type:'array',
    },

    ofUser: {
      model:'user',
      unique: true,
    },

    myHouse: {
      model: 'house',
      via: 'owner',
    },

    myCar: {
      model: 'car',
      via: 'owner',
    },
  }
};

