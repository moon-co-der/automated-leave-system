const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
  {
    leaveId: {
      type: String,
      required: true,
      unique: true,
    },

    employeeId: {
      type: String,
      required: true,
    },

    employeeName: {
      type: String,
      required: true,
    },

    employeeEmail: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    managerEmail: {
      type: String,
      required: true,
    },

    leaveType: {
      type: String,
      enum: ["Casual", "Sick", "Earned", "Emergency"],
      required: true,
    },

    fromDate: {
      type: Date,
      required: true,
    },

    toDate: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    managerReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);