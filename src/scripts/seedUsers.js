import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../lib/auth/User.js';
import { hashPassword } from '../utils/bcryptUtils.js';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  HR_EMAIL,
  HR_PASSWORD,
  MONGO_URI
} from '../configs/environmentConfig.js';
import logger from '../utils/logger.util.js';

dotenv.config();

await mongoose.connect(MONGO_URI);
logger.log('MongoDB connected');

const predefinedUsers = [
  {
    role: 'Admin',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD
  },
  {
    role: 'HR',
    email: HR_EMAIL,
    password: HR_PASSWORD
  }
];

for (const userData of predefinedUsers) {
  const existingUser = await User.findOne({ role: userData.role });

  if (existingUser) {
    // Only update if email or password actually changed
    if (
      existingUser.email !== userData.email ||
      !(await existingUser.comparePassword(userData.password)) // optional if you want to skip if password same
    ) {
      // Before changing email, ensure it's not taken
      const emailTaken =
        userData.email !== existingUser.email &&
        (await User.findOne({ email: userData.email }));

      if (emailTaken) {
        logger.error(
          `Cannot update ${userData.role}. Email "${userData.email}" is already in use.`
        );
        continue;
      }

      existingUser.email = userData.email;
      existingUser.password = await hashPassword(userData.password);
      await existingUser.save();
      logger.log(`Updated ${userData.role}`);
    }
  } else {
    await User.create({
      role: userData.role,
      email: userData.email,
      password: await hashPassword(userData.password)
    });
    logger.log(`Created ${userData.role}`);
  }
}

mongoose.disconnect();
logger.log('🚀 Seeding complete');
