import Client from "../../../models/Client.js";

// Create Client
export const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Clients
export const getAllClients = async (req, res) => {
  const clients = await Client.find();
  res.json(clients);
};

// Get Single Client by ID
export const getSingleClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Client
export const updateClient = async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(client);
};

// Delete Client
export const deleteClient = async (req, res) => {
  await Client.findByIdAndDelete(req.params.id);
  res.json({ message: "Client deleted" });
};
