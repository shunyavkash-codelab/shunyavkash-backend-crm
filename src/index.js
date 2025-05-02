import 'dotenv/config';
import express from 'express';
import connectDB from './configs/db.js';
import router from './router.js';
import corsMiddleware from './middlewares/corsMiddleware.js';
import './cronJobs/invoiceCleanup.js';
import { PORT } from './configs/environmentConfig.js';

const app = express();
app.use(corsMiddleware);
app.use(express.json());

// Router
app.use('/api', router);

app.listen(PORT || 5000, async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});
