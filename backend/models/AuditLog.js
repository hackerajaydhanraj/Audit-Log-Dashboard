const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
{
    actor: {
        type: String,
        required: true,
        trim: true
    },

    role: {
        type: String,
        required: true,
        trim: true
    },

    action: {
        type: String,
        required: true,
        trim: true
    },

    resource: {
        type: String,
        required: true,
        trim: true
    },

    resourceType: {
        type: String,
        required: true,
        trim: true
    },

    ipAddress: {
        type: String,
        required: true,
        trim: true
    },

    region: {
        type: String,
        required: true,
        trim: true
    },

    severity: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
        required: true
    },

    status: {
        type: String,
        enum: ["Resolved", "Unresolved"],
        required: true
    },

    timestamp: {
        type: Date,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("AuditLog", auditLogSchema);