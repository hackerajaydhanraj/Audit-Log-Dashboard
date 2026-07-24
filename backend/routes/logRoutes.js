const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
    testAPI,
    uploadLogs,
    getAllLogs,
    getDashboardStats,
    exportLogs
} = require("../controllers/logController");

router.get("/test", testAPI);

router.post(
    "/upload",
    upload.single("file"),
    uploadLogs
);

router.get("/stats", getDashboardStats);

router.get("/export", exportLogs);

router.get("/", getAllLogs);

module.exports = router;