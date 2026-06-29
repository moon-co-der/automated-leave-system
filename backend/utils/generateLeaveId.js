const Counter = require("../models/Counter");

const generateLeaveId = async () => {
    const counter = await Counter.findOneAndUpdate(
        { id: "leaveRequest" },
        { $inc: { sequenceValue: 1 } },
        { new: true, upsert: true }
    );

    return `LV${counter.sequenceValue.toString().padStart(4, "0")}`;
};

module.exports = generateLeaveId;