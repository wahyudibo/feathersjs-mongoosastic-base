// items-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const Promise = require('bluebird');
const mongoosastic = require('mongoosastic');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const ItemSchema = new Schema({
    name: { type: String, required: true, es_indexed:true },
    price: { type: Number, required: true, es_indexed:true },
    description: { type: String, required: true },
    itemType: { type: String, es_indexed: true },
    quantity: { type: Number, required: true },
  }, {
    timestamps: true
  });

  ItemSchema.plugin(mongoosastic, app.get('elasticsearch'));

  const Item = mongooseClient.model('Item', ItemSchema);
  Item.search = Promise.promisify(Item.search, { context: Item });
  Item.esSearch = Promise.promisify(Item.esSearch, { context: Item });

  return Item;
};
