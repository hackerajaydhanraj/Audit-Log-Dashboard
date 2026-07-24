// Force Node to use public DNS resolvers
// Helps resolve MongoDB Atlas SRV records on some networks
const dns = require("dns");
dns.setServers(["157.49.98.1"]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Debug (Remove after development)
console.log(
    "MONGO_URI loaded:",
    process.env.MONGO_URI ? "YES ✅" : "NO ❌"
);

// Database Connection
const connectDB = require("./config/db");
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Import Routes
const logRoutes = require("./routes/logRoutes");

// Default Route
app.get("/", (req, res) => {
    res.send("Audit Log API is Running...");
});

// API Routes
app.use("/api/logs", logRoutes);

app.use((err, req, res, next) => {

    console.error("GLOBAL ERROR");
    console.error(err);

    res.status(500).json({
        success:false,
        message:err.message
    });

});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on Port ${PORT}`);
});