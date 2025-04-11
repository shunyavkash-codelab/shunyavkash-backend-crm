import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinary.js";

// Combined Storage Logic
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "employee_misc";

    if (file.fieldname === "avatar") {
      folder = "employee_avatars";
    } else if (file.fieldname === "documents") {
      folder = "employee_documents";
    }

    return {
      folder,
      resource_type: file.mimetype.startsWith("image/") ? "image" : "raw",
      allowed_formats: ["jpg", "jpeg", "png", "pdf"],
      public_id: `${Date.now()}-${file.originalname}`,
      transformation:
        file.fieldname === "avatar"
          ? [{ width: 300, height: 300, crop: "limit" }]
          : undefined,
    };
  },
});

const upload = multer({ storage });

export const multiUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "documents", maxCount: 10 },
]);
