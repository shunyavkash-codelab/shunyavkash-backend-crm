import 'dotenv/config';
import express from 'express';
import connectDB from './configs/db.js';
import router from './router.js';
import cors from './middlewares/corsMiddleware.js';
import './cronJobs/invoiceCleanup.js';
import { PORT } from './configs/environmentConfig.js';
import { requestTimingLogger } from './middlewares/requestTimingLoggerMiddleware.js';
import logger from './utils/loggerUtils.js';

const app = express();
app.use(cors());
app.use(requestTimingLogger);
app.use(express.json());

// Router
app.use('/api', router);

app.listen(PORT || 5000, async () => {
  await connectDB();
  logger.log(`Server running on http://localhost:${PORT}`);
});
