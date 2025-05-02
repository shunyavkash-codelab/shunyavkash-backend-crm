import Client from '../Client.js';
import Project from '../../project/Project.js';
import logger from '../../../utils/logger.util.js';

// Create Client
export const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    return res.status(201).json(client);
  } catch (error) {
    logger.error('[Create Client Error]:', error);
    return res.status(400).json({ error: error.message });
  }
};

// Get All Clients
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    return res.status(200).json(clients);
  } catch (error) {
    logger.error('[Get All Clients Error]:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Get Single Client by ID
export const getSingleClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    return res.status(200).json(client);
  } catch (error) {
    logger.error('[Get Single Client Error]:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Update Client
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    return res.status(200).json(client);
  } catch (error) {
    logger.error('[Update Client Error]:', error);
    return res.status(400).json({ error: error.message });
  }
};

// Delete Client
export const deleteClient = async (req, res) => {
  try {
    const clientId = req.params.id;

    // Check if any project is linked to this client
    const linkedProjects = await Project.findOne({ client: clientId });

    if (linkedProjects) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete client. Projects are associated with this client.'
      });
    }

    const deletedClient = await Client.findByIdAndDelete(clientId);
    if (!deletedClient) {
      return res
        .status(404)
        .json({ success: false, message: 'Client not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Client deleted successfully.'
    });
  } catch (error) {
    logger.error('[Delete Client Error]:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
