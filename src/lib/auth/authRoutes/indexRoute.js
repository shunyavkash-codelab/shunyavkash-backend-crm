import express from 'express';
import authRoutes from './authRoute.js';

const router = express.Router();
router.use('/', authRoutes);

export default router;
