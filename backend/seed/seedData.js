const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const connectDB = require("../config/db");
const AuditLog = require("../models/AuditLog");

const roles = ["Admin", "Developer", "Manager", "HR", "Support"];

const actions = [
  "LOGIN",
  "LOGOUT",
  "CREATE_USER",
  "DELETE_USER",
  "UPDATE_USER",
  "EXPORT_REPORT",
  "RESET_PASSWORD",
  "CREATE_PROJECT",
  "DELETE_PROJECT",
  "UPLOAD_FILE"
];

const resourceTypes = [
  "USER",
  "PROJECT",
  "AUTH",
  "REPORT",
  "FILE"
];

const regions = [
  "India",
  "USA",
  "UK",
  "Germany",
  "Canada",
  "Australia",
  "Singapore"
];

const severities = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL"
];

const statuses = [
  "Resolved",
  "Unresolved"
];

const generateLogs = async () => {

    await connectDB();

    const logs = [];

    for (let i = 0; i < 100; i++) {

        logs.push({

            actor: faker.internet.email(),

            role: faker.helpers.arrayElement(roles),

            action: faker.helpers.arrayElement(actions),

            resource: `/api/${faker.word.noun()}/${faker.number.int({ min: 1, max: 500 })}`,

            resourceType: faker.helpers.arrayElement(resourceTypes),

            ipAddress: faker.internet.ip(),

            region: faker.helpers.arrayElement(regions),

            severity: faker.helpers.arrayElement(severities),

            status: faker.helpers.arrayElement(statuses),

            timestamp: faker.date.recent({ days: 60 })

        });

    }

    await AuditLog.insertMany(logs);

    console.log("✅ 100 Audit Logs Inserted");

    mongoose.connection.close();

};

generateLogs();