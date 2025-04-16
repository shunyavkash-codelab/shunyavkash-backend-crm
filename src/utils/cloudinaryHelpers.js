import cloudinary from "../configs/cloudinary.js";

// Extract public ID from Cloudinary URL
export const extractPublicIdFromUrl = (url) => {
  if (!url) return null;

  try {
    // Extract the public ID from URL
    // Format: https://res.cloudinary.com/CLOUD_NAME/image|raw/upload/v1234567890/folder/filename
    const urlParts = url.split("/");
    const uploadIndex = urlParts.indexOf("upload");

    if (uploadIndex !== -1 && uploadIndex < urlParts.length - 1) {
      // Join all parts after 'upload' to get the full path including folder
      return urlParts
        .slice(uploadIndex + 1)
        .join("/")
        .split(".")[0];
    }
    return null;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};

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

// Delete from Cloudinary with proper error handling
export const deleteFileFromCloudinary = async (publicId) => {
  if (!publicId) return { result: "skipped" };

  try {
    // Try to delete as raw resource first
    try {
      const rawResult = await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw",
      });
      if (rawResult.result === "ok") {
        return rawResult;
      }
    } catch (err) {
      console.log("Not a raw resource, trying as image...");
    }

    // If raw deletion fails, try as image
    const imageResult = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return imageResult;
  } catch (err) {
    console.error("Cloudinary Deletion Error:", err);
    throw new Error("Failed to delete file from Cloudinary");
  }
};

// Safe delete file - doesn't throw errors if deletion fails
export const safeDeleteFile = async (publicId) => {
  if (!publicId) return { result: "skipped" };

  try {
    console.log("Deleting file:", publicId);
    return await deleteFileFromCloudinary(publicId);
  } catch (err) {
    console.error("Error deleting file:", err);
    return { result: "error", error: err.message };
  }
};

// Delete file using either publicId or extract from URL
export const deleteFileByIdOrUrl = async (publicId, url) => {
  if (publicId) {
    return await safeDeleteFile(publicId);
  } else if (url) {
    const extractedId = extractPublicIdFromUrl(url);
    if (extractedId) {
      return await safeDeleteFile(extractedId);
    }
  }
  return { result: "skipped" };
};

// Process uploaded file and return structured data
export const processUploadedFile = (file) => {
  if (!file) return null;
  return {
    url: file.path,
    publicId: file.filename || extractPublicIdFromUrl(file.path),
    name: file.originalname,
  };
};

// Process multiple uploaded files
export const processUploadedFiles = (files = []) => {
  return files.map(processUploadedFile);
};

// Delete avatar from employee
export const deleteEmployeeAvatar = async (employee) => {
  if (!employee) return { result: "skipped" };

  return await deleteFileByIdOrUrl(employee.avatarPublicId, employee.avatar);
};

// Delete all documents from employee
export const deleteEmployeeDocuments = async (documents = []) => {
  const results = [];
  for (const doc of documents) {
    const result = await deleteFileByIdOrUrl(doc.publicId, doc.url);
    results.push(result);
  }
  return results;
};
