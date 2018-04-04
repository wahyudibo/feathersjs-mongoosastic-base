const feathersMongoose = require('feathers-mongoose');

class SearchService extends feathersMongoose.Service {
  constructor(options) {
    super(options);
  }

  async find(params) {
    const { searchBy, q, limit = 10, offset = 0 } = params.query;

    if (searchBy && q) {
      // Multi match query will accept search by multiple fields separated by commas.
      // eg. searchBy=firstname,lastname
      const fields = searchBy.split(',');

      const esQuery = {
        from: offset,
        size: limit,
        query: {
          multi_match: {
            query: q,
            fields,
          }
        }
      };

      return this.Model.esSearch(esQuery);
    }

    return super.find(params);
  }
}

module.exports = SearchService;
