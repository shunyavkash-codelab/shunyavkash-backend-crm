import logger from '../utils/logger.util.js';
import SendResponse from '../utils/sendResponse.util.js';

// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  logger.error(err.stack);
  return SendResponse(res, 500, false, 'Something went wrong!😬');
}
