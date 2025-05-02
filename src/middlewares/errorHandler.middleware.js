import logger from '../utils/logger.utils.js';
import SendResponse from '../utils/sendResponseUtils.js';

// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  logger.error(err.stack);
  return SendResponse(res, 500, false, 'Something went wrong!😬');
}
