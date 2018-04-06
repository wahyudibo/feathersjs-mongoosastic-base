const feathersMongoose = require('feathers-mongoose');

class SearchService extends feathersMongoose.Service {
  constructor(options, rangeSearchField = '') {
    super(options);
    this.rangeSearchField = rangeSearchField;
  }

  async find(params) {
    const {
      searchBy,
      q,
      min,
      max,
      limit = 10,
      offset = 0
    } = params.query;

    if (searchBy && (q || min || max)) {
      let query = {};

      // Multi match query will accept search by multiple fields separated by commas.
      // eg. searchBy=firstname,lastname
      const fields = searchBy.split(',');

      // Search a number type field (for example: price), cannot be
      // mixed with other search query. So field that have type number will be
      // ignored in multi search
      if (fields.length === 1 && (min || max) && !q) {
        const rangeQuery = {
          range: { [searchBy]: {} }
        };

        if (min) {
          rangeQuery.range[searchBy].gte = min;
        }

        if (max) {
          rangeQuery.range[searchBy].lte = max;
        }

        query = Object.assign({}, query, rangeQuery);
      } else {
        const multiSearchQuery = {
          multi_match: {
            query: q,
            fields,
          }
        };

        query = Object.assign({}, query, multiSearchQuery);
      }

      const esQuery = {
        query,
        from: offset,
        size: limit,
      };

      return this.Model.esSearch(esQuery);
    }

    return super.find(params);
  }
}

module.exports = SearchService;
