import Client from "../../../models/Client.js";

export const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllClients = async (req, res) => {
  const clients = await Client.find();
  res.json(clients);
};

export const updateClient = async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(client);
};

export const deleteClient = async (req, res) => {
  await Client.findByIdAndDelete(req.params.id);
  res.json({ message: "Client deleted" });
};
