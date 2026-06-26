const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Cloudinary check:', {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? 'present' : 'missing',
  secret: process.env.CLOUDINARY_API_SECRET ? 'present' : 'missing',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const type = req.query.type || req.body.type || 'products';

    const allowedFolders = {
      products: 'timeaura/products',
      brands: 'timeaura/brands',
      banners: 'timeaura/banners',
    };

    return {
      folder: allowedFolders[type] || 'timeaura/products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        {
          width: type === 'brands' ? 500 : 1000,
          height: type === 'brands' ? 300 : 1000,
          crop: 'fit',
          quality: 'auto',
        },
      ],
    };
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };