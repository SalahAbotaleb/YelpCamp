const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
});
module.exports.storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'campground_images',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});
module.exports.cloudinary = cloudinary;