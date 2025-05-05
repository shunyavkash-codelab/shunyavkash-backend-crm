import mongoose from 'mongoose';
import SendResponse from '../../../utils/sendResponse.util.js';
import logger from '../../../utils/logger.util.js';
import Project from '../../project/Project.js';
import Client from '../Client.js';

export const deleteClient = async (req, res) => {
  const clientId = req.params.id;

  try {
    if (!clientId || !mongoose.Types.ObjectId.isValid(clientId)) {
      return SendResponse(res, 400, false, 'Invalid or missing client ID');
    }

    const linkedProject = await Project.findOne({ client: clientId });

    if (linkedProject) {
      return SendResponse(
        res,
        400,
        false,
        'Cannot delete client. One or more projects are associated with this client.'
      );
    }

    const deletedClient = await Client.findByIdAndDelete(clientId);

    if (!deletedClient) {
      return SendResponse(res, 404, false, 'Client not found');
    }

    return SendResponse(res, 200, true, 'Client deleted successfully');
  } catch (error) {
    logger.error('[Delete Client Error]:', error);
    return SendResponse(
      res,
      500,
      false,
      'Failed to delete client',
      error.message || error
    );
  }
};
