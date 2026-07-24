const AuditLog = require("../models/AuditLog");
const fs = require("fs");

// Test API
const testAPI = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Audit Log Controller Working"
    });
};

// Upload Logs
const uploadLogs = async (req, res) => {
    try {

        console.log("FILE:");
        console.log(req.file);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file received"
            });
        }

        const fileData = fs.readFileSync(req.file.path, "utf8");

        console.log("========== FILE CONTENT ==========");
        console.log(fileData);

        const logs = JSON.parse(fileData);

        console.log("========== PARSED DATA ==========");
        console.log(logs);

        const result = await AuditLog.insertMany(logs);

        console.log("========== INSERT RESULT ==========");
        console.log(result);

        fs.unlinkSync(req.file.path);

        return res.status(201).json({
            success: true,
            message: `${result.length} logs uploaded successfully`
        });

    } catch (error) {

        console.log("========== ERROR ==========");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// Get All Logs
// Get Logs with Pagination
// Get Logs with Pagination + Search + Filter + Sort
const getAllLogs = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const search = req.query.search || "";
        const severity = req.query.severity || "";
        const status = req.query.status || "";
        const region = req.query.region || "";
        const sort = req.query.sort || "newest";

        let query = {};

        if (search) {
            query.$or = [
                { actor: { $regex: search, $options: "i" } },
                { role: { $regex: search, $options: "i" } },
                { action: { $regex: search, $options: "i" } },
                { region: { $regex: search, $options: "i" } }
            ];
        }

        if (severity) query.severity = severity;
        if (status) query.status = status;
        if (region) query.region = region;

        let sortOption = { timestamp: -1 };

        if (sort === "oldest")
            sortOption = { timestamp: 1 };

        const totalLogs = await AuditLog.countDocuments(query);

        const logs = await AuditLog.find(query)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return res.json({
            success: true,
            totalPages: Math.ceil(totalLogs / limit),
            totalLogs,
            data: logs
        });

    }
    catch(err){

        console.error("GET LOGS ERROR");
        console.error(err);

        return res.status(500).json({
            success:false,
            message:err.message
        });

    }

};

// Dashboard Statistics
const getDashboardStats = async (req, res) => {

    try {

        const totalLogs = await AuditLog.countDocuments();

        const resolved = await AuditLog.countDocuments({
            status: "Resolved"
        });

        const unresolved = await AuditLog.countDocuments({
            status: "Unresolved"
        });

        const low = await AuditLog.countDocuments({
            severity: "LOW"
        });

        const medium = await AuditLog.countDocuments({
            severity: "MEDIUM"
        });

        const high = await AuditLog.countDocuments({
            severity: "HIGH"
        });

        const critical = await AuditLog.countDocuments({
            severity: "CRITICAL"
        });

        res.status(200).json({

            success: true,

            data: {

                totalLogs,

                resolved,

                unresolved,

                severity: {
                    low,
                    medium,
                    high,
                    critical
                }

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

const { Parser } = require("json2csv");


const exportLogs = async (req, res) => {
    try {

       const logs = await AuditLog.find().lean();

        const fields = [
            "actor",
            "role",
            "action",
            "severity",
            "status",
            "region",
            "timestamp"
        ];

        const parser = new Parser({ fields });

        const csv = parser.parse(logs);

        res.header("Content-Type", "text/csv");
        res.attachment("audit_logs.csv");

        return res.send(csv);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to export logs"
        });

    }
};


module.exports = {
    testAPI,
    uploadLogs,
    getAllLogs,
    getDashboardStats,
    exportLogs

};