import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../configs/cloudinary.js';

const getUploadFolder = fieldname => {
  switch (fieldname) {
    case 'avatar':
      return 'employee_avatars';
    case 'documents':
      return 'employee_documents';
    case 'resume':
      return 'interview_resumes';
    default:
      return 'employee_misc';
  }
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder = getUploadFolder(file.fieldname);
    const isImage = file.mimetype.startsWith('image/');

    return {
      folder,
      resource_type: isImage ? 'image' : 'raw',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`,
      transformation:
        file.fieldname === 'avatar'
          ? [{ width: 300, height: 300, crop: 'limit' }]
          : undefined
    };
  }
});

const upload = multer({ storage });

export const multiUpload = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]);

export const interviewUpload = upload.fields([{ name: 'resume', maxCount: 1 }]);

export default upload;
