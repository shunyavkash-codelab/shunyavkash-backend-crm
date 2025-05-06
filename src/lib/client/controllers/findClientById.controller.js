import mongoose from 'mongoose';
import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import Client from '../Client.js';

export const findClientById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, 'Invalid or missing client ID');
    }

    const client = await Client.findById(id);

    if (!client) {
      return SendResponse(res, 404, false, 'Client not found');
    }

    return SendResponse(res, 200, true, 'Client retrieved successfully', {
      client
    });
  } catch (error) {
    logger.error('[Find Client By ID Error]:', error);
    return SendResponse(
      res,
      500,
      false,
      'Failed to retrieve client',
      error.message || error
    );
  }
};
