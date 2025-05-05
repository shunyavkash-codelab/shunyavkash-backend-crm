import mongoose from 'mongoose';
import SendResponse from '../../../utils/sendResponse.util.js';
import Client from '../Client.js';
import logger from '../../../utils/logger.util.js';

export const updateClient = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, 'Invalid or missing Client ID');
    }

    const updatedClient = await Client.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedClient) {
      return SendResponse(res, 404, false, 'Client not found');
    }

    return SendResponse(
      res,
      200,
      true,
      'Client updated successfully',
      updatedClient
    );
  } catch (error) {
    logger.error('[Update Client Error]:', error);
    return SendResponse(
      res,
      500,
      false,
      'Failed to update client',
      error.message || error
    );
  }
};
