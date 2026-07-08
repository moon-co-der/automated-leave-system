const axios = require("axios");
const LeaveRequest = require("../models/LeaveRequest");
const Employee = require("../models/Employee");
const generateLeaveId = require("../utils/generateLeaveId");

// ==============================
// n8n Webhook Helper
// ==============================

const N8N_WEBHOOK_URL =
  "https://neesoftltd.app.n8n.cloud/webhook/da72ab76-6310-49b0-9972-b3ad388b2c48";

async function triggerN8nWebhook(payload) {
  console.log("========== n8n Webhook ==========");
  console.log("Webhook URL:", N8N_WEBHOOK_URL);
  console.log("Payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(N8N_WEBHOOK_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Webhook Status:", response.status);
    console.log("Webhook Response:", response.data);
    console.log("✅ n8n Webhook Triggered Successfully");
  } catch (error) {
    console.error("❌ n8n Webhook Error:");
    console.error("response.data:", error.response?.data);
    console.error("response.status:", error.response?.status);
    console.error("message:", error.message);
    throw error;
  }
}

// ==============================
// Create Leave Request
// ==============================

const createLeaveRequest = async (req, res) => {
    try {

        const {
            employeeEmail,
            leaveType,
            fromDate,
            toDate,
            reason
        } = req.body;

        // Find employee using email
        const employee = await Employee.findOne({ email: employeeEmail });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        // Generate Leave ID
        const leaveId = await generateLeaveId();

        // Create Leave Request
        const leave = await LeaveRequest.create({
            leaveId,
            employeeId: employee.employeeId,
            employeeName: employee.name,
            employeeEmail: employee.email,
            department: employee.department,
            managerEmail: employee.managerEmail,
            leaveType,
            fromDate,
            toDate,
            reason,
            status: "Pending"
        });

        res.status(201).json({
            success: true,
            message: "Leave request submitted successfully.",
            data: leave
        });

    } catch (error) {

        console.error("Create Leave Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ==============================
// Get All Leave Requests
// ==============================

const getLeaveRequests = async (req, res) => {

    try {

        const leaves = await LeaveRequest.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// Get Leave Request By ID
// ==============================

const getLeaveRequestById = async (req, res) => {

    try {

        const leave = await LeaveRequest.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found"
            });
        }

        res.status(200).json({
            success: true,
            data: leave
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// Approve Leave Request
// ==============================

const approveLeaveRequest = async (req, res) => {

    try {

        console.log("Approve leave request invoked for id:", req.params.id);
        console.log("Request body:", req.body);

        const leave = await LeaveRequest.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found"
            });
        }

        leave.status = "Approved";
        leave.approvedAt = new Date();
        leave.managerReason = req.body.managerReason || "";

        await leave.save();

        // Fire n8n webhook after successful approval
        await triggerN8nWebhook({
            leaveId: leave.leaveId,
            employeeId: leave.employeeId,
            employeeName: leave.employeeName,
            employeeEmail: leave.employeeEmail,
            department: leave.department,
            leaveType: leave.leaveType,
            fromDate: leave.fromDate,
            toDate: leave.toDate,
            reason: leave.reason,
            status: leave.status,
            managerReason: leave.managerReason
        });

        res.status(200).json({
            success: true,
            message: "Leave approved successfully.",
            data: leave
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// Reject Leave Request
// ==============================

const rejectLeaveRequest = async (req, res) => {

    try {

        console.log("Reject leave request invoked for id:", req.params.id);
        console.log("Request body:", req.body);

        const leave = await LeaveRequest.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found"
            });
        }

        leave.status = "Rejected";
        leave.managerReason = req.body.managerReason || "";

        await leave.save();

        // Fire n8n webhook after successful rejection
        await triggerN8nWebhook({
            leaveId: leave.leaveId,
            employeeId: leave.employeeId,
            employeeName: leave.employeeName,
            employeeEmail: leave.employeeEmail,
            department: leave.department,
            leaveType: leave.leaveType,
            fromDate: leave.fromDate,
            toDate: leave.toDate,
            reason: leave.reason,
            status: leave.status,
            managerReason: leave.managerReason
        });

        res.status(200).json({
            success: true,
            message: "Leave rejected successfully.",
            data: leave
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// Export Controllers
// ==============================

module.exports = {
    createLeaveRequest,
    getLeaveRequests,
    getLeaveRequestById,
    approveLeaveRequest,
    rejectLeaveRequest
};