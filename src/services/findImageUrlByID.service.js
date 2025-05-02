import cloudinary from '../configs/cloudinary.js';

/**
 * Generates a temporary signed URL for private Cloudinary assets
 * @param {string} publicId - Cloudinary public_id (e.g., employee_avatars/12345-img)
 * @param {string} resourceType - 'image' | 'raw' (avatar = image, document = raw)
 * @param {number} expiresIn - URL expiry in seconds (default 10 minutes)
 */
export const findImageUrlByID = (
  publicId,
  resourceType = 'image',
  expiresIn = 600
) => {
  const timestamp = Math.floor(Date.now() / 1000) + expiresIn;
  const signature = cloudinary.utils.api_sign_request(
    { public_id: publicId, timestamp },
    cloudinary.config().api_secret
  );

  const url = cloudinary.utils.url(publicId, {
    resource_type: resourceType,
    type: 'authenticated',
    sign_url: true,
    secure: true,
    timestamp,
    signature
  });

  return url;
};
