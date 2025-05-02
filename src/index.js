import 'dotenv/config';
import express from 'express';
import connectDB from './configs/db.js';
import router from './router.js';
import cors from './middlewares/cors.middleware.js';
import './cronJobs/invoiceCleanup.js';
import { PORT } from './configs/environmentConfig.js';
import { requestTimingLogger } from './middlewares/requestTimingLogger.middleware.js';
import logger from './utils/logger.util.js';
import errorHandler from './middlewares/errorHandler.middleware.js';

const app = express();
app.use(cors());
app.use(requestTimingLogger);
app.use(express.json());

// Router
app.use('/api', router);

app.use(errorHandler);

app.listen(PORT || 5000, async () => {
  await connectDB();
  logger.log(`Server running on http://localhost:${PORT}`);
});
