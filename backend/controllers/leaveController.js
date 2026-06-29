const LeaveRequest = require("../models/LeaveRequest");
const Employee = require("../models/Employee");
const generateLeaveId = require("../utils/generateLeaveId");

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

        const leave = await LeaveRequest.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found"
            });
        }

        leave.status = "Approved";
        leave.approvedAt = new Date();

        await leave.save();

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

        const leave = await LeaveRequest.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found"
            });
        }

        leave.status = "Rejected";

        await leave.save();

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