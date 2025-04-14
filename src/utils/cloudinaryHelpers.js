import cloudinary from "../configs/cloudinary.js";

// Upload to Cloudinary
export const uploadToCloudinary = async (
  file,
  folder = "interview_resumes"
) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: file.mimetype.startsWith("image/") ? "image" : "raw",
      public_id: `${Date.now()}-${file.originalname}`,
    });

    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    throw new Error("Cloudinary upload failed: " + error.message);
  }
};

// Delete from Cloudinary
export const deleteFileFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });
    return result;
  } catch (err) {
    console.error("Cloudinary Deletion Error:", err);
    throw new Error("Failed to delete file from Cloudinary");
  }
};
