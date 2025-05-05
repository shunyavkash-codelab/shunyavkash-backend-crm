import logger from './logger.util.js';

class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  search(searchFields = []) {
    if (this.queryStr.search && searchFields.length > 0) {
      const keywordRegex = {
        $regex: this.queryStr.search,
        $options: 'i'
      };

      const orConditions = searchFields.map(field => ({
        [field]: keywordRegex
      }));
      this.query = this.query.find({ $or: orConditions });
      logger.log(
        `Search applied on fields: ${searchFields.join(',')} with keyword: ${this.queryStr.search}`
      );
    }
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    const removeFields = ['search', 'page', 'limit', 'sortkey', 'sortorder'];

    removeFields.forEach(key => delete queryCopy[key]);

    let mongoQuery = {};

    for (let key in queryCopy) {
      if (queryCopy.hasOwnProperty(key)) {
        const operatorMatch = key.match(/(.*)\[(gte|lte|gt|lt)\]/);

        if (operatorMatch) {
          const field = operatorMatch[1];
          const operator = `$${operatorMatch[2]}`;
          const value = queryCopy[key];

          if (this.isValidDate(value)) {
            mongoQuery[field] = mongoQuery[field] || {};
            mongoQuery[field][operator] = new Date(value);
          } else {
            mongoQuery[field] = mongoQuery[field] || {};
            mongoQuery[field][operator] = value;
          }

          delete queryCopy[key];
        }
      }
    }

    logger.log('Generated MongoDB Query:', mongoQuery);

    this.query = this.query.find(mongoQuery);
    return this;
  }

  pagination() {
    const currentPage = Number(this.queryStr.page) || 1;
    let resultPerPage = Number(this.queryStr.limit) || 50;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(+resultPerPage).skip(+skip);
    logger.log(
      `Pagination applied: Current page: ${currentPage}, Results per page: ${resultPerPage}, Skipping: ${skip} documents`
    );

    return this;
  }

  sort() {
    let val = this.queryStr.sortorder || 'desc';
    let key = this.queryStr.sortkey || 'createdAt';
    logger.log(`Sorting applied: Sorting by ${key} in ${val} order`);
    this.query = this.query.sort({ [key]: val === 'desc' ? -1 : 1 });
    return this;
  }
}

export { ApiFeatures };
