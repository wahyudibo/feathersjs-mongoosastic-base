// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const Promise = require('bluebird');
const mongoosastic = require('mongoosastic');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const UserSchema = new Schema({
    firstname: { type: String, required: true, es_indexed:true },
    lastname: { type: String, required: true, es_indexed:true },
    email: { type: String, required: true, es_indexed:true },
    age: { type: Number },
  }, {
    timestamps: true
  });

  UserSchema.plugin(mongoosastic, app.get('elasticsearch'));

  const User = mongooseClient.model('User', UserSchema);
  User.search = Promise.promisify(User.search, { context: User });
  User.esSearch = Promise.promisify(User.esSearch, { context: User });

  return User;
};
