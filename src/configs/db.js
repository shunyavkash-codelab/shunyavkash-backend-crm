import mongoose from 'mongoose';
import { MONGO_URI } from './environmentConfig.js';

const connectDB = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log('Database Connected successfully'))
    .catch(err => {
      console.error(' MongoDB Connection Error:', err.message);
      process.exit(1);
    });
};

export default connectDB;
