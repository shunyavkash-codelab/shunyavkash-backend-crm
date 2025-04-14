import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinary.js";

// Unified Cloudinary Storage Config
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "employee_misc";

    // Employee avatars
    if (file.fieldname === "avatar") {
      folder = "employee_avatars";
    }
    // Employee documents
    else if (file.fieldname === "documents") {
      folder = "employee_documents";
    }
    // Interview resumes
    else if (file.fieldname === "resume") {
      folder = "interview_resumes";
    }

    return {
      folder,
      resource_type: file.mimetype.startsWith("image/") ? "image" : "raw",
      allowed_formats: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
      public_id: `${Date.now()}-${file.originalname}`,
      transformation:
        file.fieldname === "avatar"
          ? [{ width: 300, height: 300, crop: "limit" }]
          : undefined,
    };
  },
});

const upload = multer({ storage });

// 🔹 Employee Upload (avatar + multiple documents)
export const multiUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "documents", maxCount: 10 },
]);

// 🔹 Interview Upload (resume)
export const interviewUpload = upload.fields([{ name: "resume", maxCount: 1 }]);

export default upload;
