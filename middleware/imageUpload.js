const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Specify the directory path
const uploadDir = path.join(__dirname, '../images');

// Check if the directory exists, create it if it doesn't
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Define storage for uploaded photos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Save uploaded photos in the 'images' directory
    },
    filename: function (req, file, cb) {
        const fileName = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
        console.log(`File uploaded: ${fileName}, Size: ${file.size} bytes`);
        cb(null, fileName);
    }
});

// Initialize multer with defined storage options
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: function (req, file, cb) {
        // Check file types here if needed (e.g., only images)
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type.'));
        }
    }
});

// Middleware function to handle single file upload
const uploadPhoto = upload.single('photo');

module.exports = { uploadPhoto };
