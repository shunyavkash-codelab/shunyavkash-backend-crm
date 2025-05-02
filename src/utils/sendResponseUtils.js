import logger from './logger.utils.js';

export default function SendResponse(
  res,
  statusCode = 200,
  flag = true,
  message = '',
  data = {}
) {
  try {
    return res.status(statusCode).json({
      code: statusCode,
      success: flag,
      message,
      data
    });
  } catch (error) {
    logger.info(error);
  }
}
