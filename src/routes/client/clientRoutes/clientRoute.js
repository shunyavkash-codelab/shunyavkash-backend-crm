import express from "express";
import {
  createClient,
  getAllClients,
  updateClient,
  deleteClient,
  getSingleClient,
} from "../controller/clientController.js";

const router = express.Router();

router.post("/", createClient);
router.get("/", getAllClients);
router.get("/:id", getSingleClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;
