import express from "express";
import {
  createClient,
  getAllClients,
  updateClient,
  deleteClient,
  getSingleClient,
} from "../controllers/clientController.js";
import authorizeRoles from "../../../middlewares/roleMiddleware.js";
import protect from "../../../middlewares/authMiddleware.js";

const router = express.Router();
// router.use(protect);

router.post("/", createClient);
router.get("/", getAllClients);
router.get("/:id", getSingleClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;
