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
      console.log('orConditions', orConditions);

      this.query = this.query.find({ $or: orConditions });
      console.log('this.query', this.query);

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

    let queryObj = {};

    Object.keys(queryCopy).forEach(param => {
      const match = param.match(/(\w+)\[(gte|gt|lte|lt)\]/);
      if (match) {
        const field = match[1];
        const operator = `$${match[2]}`;
        if (!queryObj[field]) queryObj[field] = {};

        const value = this.isValidDate(queryCopy[param])
          ? new Date(queryCopy[param])
          : queryCopy[param];

        queryObj[field][operator] = value;
      } else {
        queryObj[param] = queryCopy[param];
      }
    });

    this.query = this.query.find(queryObj);
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
