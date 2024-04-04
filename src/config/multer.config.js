import multer from 'multer';
import path from 'path';
import fs from 'fs';
import __dirname from '../utils/utils.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';

    if (file.fieldname === 'profileImage') {
      uploadPath += 'profiles/';
    } else if (file.fieldname === 'productImage') {
      uploadPath += 'products/';
    } else if (file.fieldname === 'document') {
      uploadPath += 'documents/';
    }

    const fullPath = path.join(__dirname, '..', uploadPath);
    fs.mkdirSync(fullPath, { recursive: true });

    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'profileImage' && !file.mimetype.startsWith('image/')) {
    return cb(new Error('Only photos allowed for the profile picture.'), false);
  }
  if (file.fieldname === 'productImage' && !file.mimetype.startsWith('image/')) {
    return cb(new Error('Only photos allowed for the products picture'), false);
  }
  if (file.fieldname === 'document' && file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF files allowed for the documents'), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
