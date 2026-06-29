require("dotenv").config();

const mongoose = require("mongoose");
const Employee = require("../models/Employee");

const employees = [
  {
    employeeId: "EMP001",
    name: "Rahul Kumar",
    email: "rahul@company.com",
    department: "Development",
    managerEmail: "manager@company.com",
  },
  {
    employeeId: "EMP002",
    name: "Priya Sharma",
    email: "priya@company.com",
    department: "QA",
    managerEmail: "manager@company.com",
  },
  {
    employeeId: "EMP003",
    name: "Arjun Nair",
    email: "arjun@company.com",
    department: "Development",
    managerEmail: "manager@company.com",
  },
  {
    employeeId: "EMP004",
    name: "Sneha Iyer",
    email: "sneha@company.com",
    department: "HR",
    managerEmail: "manager@company.com",
  },
  {
    employeeId: "EMP005",
    name: "Karthik R",
    email: "karthik@company.com",
    department: "UI/UX",
    managerEmail: "manager@company.com",
  },
  {
    employeeId: "EMP006",
    name: "Aisha Khan",
    email: "aisha@company.com",
    department: "Testing",
    managerEmail: "manager@company.com",
  },
  {
    employeeId: "EMP007",
    name: "Vivek Patel",
    email: "vivek@company.com",
    department: "DevOps",
    managerEmail: "manager@company.com",
  },
  {
    employeeId: "EMP008",
    name: "Meera Joshi",
    email: "meera@company.com",
    department: "Business Analyst",
    managerEmail: "manager@company.com",
  },
  {
    employeeId: "EMP009",
    name: "Rohit Singh",
    email: "rohit@company.com",
    department: "Support",
    managerEmail: "manager@company.com",
  },
  {
    employeeId: "EMP010",
    name: "Ananya Das",
    email: "ananya@company.com",
    department: "Finance",
    managerEmail: "manager@company.com",
  },
];

const seedEmployees = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Employee.deleteMany();

    await Employee.insertMany(employees);

    console.log("✅ Employee database seeded successfully!");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedEmployees();