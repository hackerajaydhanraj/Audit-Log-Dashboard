const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads folder automatically
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Only JSON
const fileFilter = (req, file, cb) => {

    if (file.mimetype === "application/json" ||
        path.extname(file.originalname).toLowerCase() === ".json") {

        cb(null, true);

    } else {

        cb(new Error("Only JSON files are allowed."));
    }
};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;