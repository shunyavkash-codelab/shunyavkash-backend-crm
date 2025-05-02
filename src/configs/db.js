import mongoose from 'mongoose';
import { MONGO_URI } from './environmentConfig.js';
import logger from '../utils/logger.util.js';

const connectDB = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => logger.log('Database Connected successfully'))
    .catch(err => {
      logger.error(' MongoDB Connection Error:', err.message);
      process.exit(1);
    });
};

export default connectDB;
