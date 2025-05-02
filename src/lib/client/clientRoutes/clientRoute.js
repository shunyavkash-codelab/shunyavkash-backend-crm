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
router.use(protect);

router.post("/", authorizeRoles("Admin"), createClient);
router.get("/", authorizeRoles("Admin"), getAllClients);
router.get("/:id", authorizeRoles("Admin"), getSingleClient);
router.put("/:id", authorizeRoles("Admin"), updateClient);
router.delete("/:id", authorizeRoles("Admin"), deleteClient);

export default router;
