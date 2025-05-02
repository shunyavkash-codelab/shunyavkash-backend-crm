import cloudinary from '../configs/cloudinary.js';
import logger from './loggerUtils.js';

const getResourceTypeFromPublicId = publicId => {
  return publicId?.endsWith('.pdf') ? 'raw' : 'image';
};

// Extract public ID from Cloudinary URL
export const extractPublicIdFromUrl = url => {
  if (!url) return null;
  try {
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex !== -1 && uploadIndex < urlParts.length - 1) {
      return urlParts
        .slice(uploadIndex + 1)
        .join('/')
        .split('.')[0];
    }
    return null;
  } catch (error) {
    logger.error('Error extracting public ID:', error);
    return null;
  }
};

// Upload to Cloudinary
export const uploadToCloudinary = async (
  file,
  folder = 'interview_resumes'
) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: file.mimetype.startsWith('image/') ? 'image' : 'raw',
      public_id: `${Date.now()}-${file.originalname}`
    });

    return {
      public_id: result.public_id,
      url: result.secure_url
    };
  } catch (error) {
    throw new Error('Cloudinary upload failed: ' + error.message);
  }
};

// Delete from Cloudinary
// export const deleteFileFromCloudinary = async (
//   publicId,
//   resourceType = "image"
// ) => {
//   if (!publicId) return { result: "skipped" };
//   try {
//     const result = await cloudinary.uploader.destroy(publicId, {
//       resource_type: resourceType,
//     });
//     return result;
//   } catch (err) {
//     logger.error("Error deleting file from Cloudinary:", err);
//     throw new Error("Failed to delete file from Cloudinary");
//   }
// };

export const deleteFileFromCloudinary = async (publicId, resourceType) => {
  if (!publicId) return { result: 'skipped' };
  try {
    const finalResourceType =
      resourceType || getResourceTypeFromPublicId(publicId);
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: finalResourceType
    });
    return result;
  } catch (err) {
    logger.error('Error deleting file from Cloudinary:', err);
    throw new Error('Failed to delete file from Cloudinary');
  }
};

// Safe delete file
// export const safeDeleteFile = async (publicId, resourceType = "image") => {
//   if (!publicId) return { result: "skipped" };
//   try {
//     logger.log("Deleting file:", publicId);
//     return await deleteFileFromCloudinary(publicId, resourceType);
//   } catch (err) {
//     logger.error("Error deleting file:", err);
//     return { result: "error", error: err.message };
//   }
// };
export const safeDeleteFile = async (publicId, resourceType) => {
  if (!publicId) return { result: 'skipped' };
  try {
    const finalResourceType =
      resourceType || getResourceTypeFromPublicId(publicId);
    logger.log(`Deleting file: ${publicId} (Type: ${finalResourceType})`);
    return await deleteFileFromCloudinary(publicId, finalResourceType);
  } catch (err) {
    logger.error('Error deleting file:', err);
    return { result: 'error', error: err.message };
  }
};

// Process uploaded file and return structured data
export const processUploadedFile = file => {
  if (!file) return null;
  return {
    url: file.path,
    publicId: file.filename || extractPublicIdFromUrl(file.path),
    name: file.originalname
  };
};

// Process multiple uploaded files
export const processUploadedFiles = (files = []) => {
  return files.map(processUploadedFile);
};

// Delete avatar from employee
export const deleteEmployeeAvatar = async employee => {
  if (!employee) return { result: 'skipped' };
  return await deleteFileFromCloudinary(employee.avatarPublicId, 'image');
};

// Delete all documents from employee
export const deleteEmployeeDocuments = async (documents = []) => {
  const results = [];
  for (const doc of documents) {
    const result = await deleteFileFromCloudinary(doc.publicId, 'raw');
    results.push(result);
  }
  return results;
};
