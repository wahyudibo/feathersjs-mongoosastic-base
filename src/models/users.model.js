// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const mongoosastic = require('mongoosastic');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  // MODIFIED :: comply with mongoosastic standard naming
  const User = new Schema({
    firstname: { type: String, required: true, es_indexed:true },
    lastname: { type: String, required: true, es_indexed:true },
    email: { type: String, required: true, es_indexed:true },
    age: { type: Number },
  }, {
    timestamps: true
  });

  User.plugin(mongoosastic, app.get('elasticsearch'));

  return mongooseClient.model('User', User);
};
