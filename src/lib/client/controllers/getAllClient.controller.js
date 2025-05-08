import Client from '../Client.js';
import logger from '../../../utils/logger.util.js';
import SendResponse from '../../../utils/sendResponse.util.js';
import { ApiFeatures } from '../../../utils/apifeature.util.js';

export const getAllClients = async (req, res) => {
  try {
    const searchFields = ['email', 'name', 'phone'];
    const apiFeature = new ApiFeatures(Client.find(), req.query)
      .search(searchFields)
      .filter()
      .sort();

    let clients = await apiFeature.query;
    let filterClientCount = clients.length;
    apiFeature.pagination();
    clients = await apiFeature.query.clone();

    const clientCount = await Client.countDocuments();
    const totalPage = Math.ceil(filterClientCount / req.query.limit);
    const currentPage = Number(req.query.page) || 1;

    return SendResponse(res, 200, true, 'Get all client successfully', {
      clients,
      totalCount: clientCount,
      currentPage,
      filterClientCount,
      totalPage
    });
  } catch (error) {
    logger.error('[Get All Clients Error]:', error);
    return SendResponse(res, 500, false, `[Get All Clients Error]`, error);
  }
};
