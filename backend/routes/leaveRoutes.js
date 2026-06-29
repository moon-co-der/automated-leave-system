const express = require("express");

const router = express.Router();

const {
    createLeaveRequest,
    getLeaveRequests,
    getLeaveRequestById,
    approveLeaveRequest,
    rejectLeaveRequest
} = require("../controllers/leaveController");

router.post("/", createLeaveRequest);

router.get("/", getLeaveRequests);

router.get("/:id", getLeaveRequestById);

router.put("/:id/approve", approveLeaveRequest);

router.put("/:id/reject", rejectLeaveRequest);

module.exports = router;