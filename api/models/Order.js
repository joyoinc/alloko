/**
 * Order.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: 'string',
      primaryKey: true
    },

    type: {
      type: 'string',
      enum: ['house', 'car_drive', 'guide']
    },

    status: {
      type: 'string',
      defaultTo: 'booked',
      enum: ['booked', 'cancelled', 'rated']
    },

    customerId: {
      type: 'email',
    },

    customerName: {
      type: 'string',
    },

    serverHost: {
      type: 'string',
    },

    serviceStartDate: {
      type: 'date',
    },

    serviceEndDate: {
      type: 'date',
    },

    totalPrice: {
      type: 'float',
    },

    paymentToken: {
      type: 'string',
    },

    ratings: {
      type: 'array'
    },

    ratingOnUser: {
      type: 'integer'
    },

    commentOnUser: {
      type: 'string'
    },

    commentOnHost: {
      type: 'string'
    },
  }
};

