const Employee = require("../models/Employee");

// Create Employee
const createEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);

        res.status(201).json({
            success: true,
            data: employee
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Employees
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Employee By ID
const getEmployeeById = async (req, res) => {
    try {

        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            success: true,
            data: employee
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createEmployee,
    getEmployees,
    getEmployeeById
};