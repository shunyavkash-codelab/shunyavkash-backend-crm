import Payroll from "../../../models/Payroll.js";
import { generatePayrollData } from "../../../services/payrollGenerator.js";

//  Generate Payroll for an Employee
export const generatePayroll = async (req, res) => {
  try {
    const payrollData = await generatePayrollData(req.body);
    const payroll = await Payroll.create(payrollData);
    res.status(201).json(payroll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get All Payrolls
export const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate(
      "employee",
      "firstName lastName email"
    );
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get Payroll for One Employee
export const getPayrollByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const payrolls = await Payroll.find({ employee: employeeId });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Mark as Paid
export const markAsPaid = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) return res.status(404).json({ message: "Payroll not found" });

    payroll.status = "Paid";
    await payroll.save();

    res.json({ message: "Payroll marked as paid", payroll });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
