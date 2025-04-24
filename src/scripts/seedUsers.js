import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../lib/auth/User.js";
import { hashPassword } from "../utils/bcryptUtils.js";

dotenv.config(); // Load from .env

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected");

// Predefined users
const predefinedUsers = [
  {
    role: "Admin",
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  {
    role: "HR",
    email: process.env.HR_EMAIL,
    password: process.env.HR_PASSWORD,
  },
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
        console.error(
          `Cannot update ${userData.role}. Email "${userData.email}" is already in use.`
        );
        continue;
      }

      existingUser.email = userData.email;
      existingUser.password = await hashPassword(userData.password);
      await existingUser.save();
      console.log(`Updated ${userData.role}`);
    }
  } else {
    await User.create({
      role: userData.role,
      email: userData.email,
      password: await hashPassword(userData.password),
    });
    console.log(`Created ${userData.role}`);
  }
}

mongoose.disconnect();
console.log("🚀 Seeding complete");
