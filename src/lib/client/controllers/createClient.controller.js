import Client from '../Client.js';
import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';

export const createClient = async (req, res) => {
  try {
    let payload = req.body;
    if (!payload || Object.keys(payload).length === 0) {
      return SendResponse(res, 400, false, 'Request body cannot be empty');
    }
    const client = await Client.create(payload);
    return SendResponse(res, 201, true, 'Client create successfully', client);
  } catch (error) {
    logger.error('[Create Client Error]:', error);
    return SendResponse(
      res,
      500,
      false,
      `Create Client Error`,
      error.message || error
    );
  }
};
