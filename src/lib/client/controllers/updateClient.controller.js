import mongoose from 'mongoose';
import SendResponse from '../../../utils/sendResponse.util.js';
import Client from '../Client.js';
import logger from '../../../utils/logger.util.js';

export const updateClient = async (req, res) => {
  const { id } = req.params;
  let payload = req.body;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return SendResponse(res, 400, false, 'Invalid or missing client ID');
    }

    if (!payload || Object.keys(payload).length === 0) {
      return SendResponse(res, 400, false, 'Request body cannot be empty');
    }

    const updatedClient = await Client.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });

    if (!updatedClient) {
      return SendResponse(res, 404, false, 'No client found with the given ID');
    }

    return SendResponse(
      res,
      200,
      true,
      'Client details updated successfully',
      updatedClient
    );
  } catch (error) {
    logger.error('[Update Client Error]:', error);
    return SendResponse(
      res,
      500,
      false,
      'An error occurred while updating the client',
      error.message || error
    );
  }
};
