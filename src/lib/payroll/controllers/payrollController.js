import Payroll from '../Payroll.js';
import { generatePayrollData } from '../../../services/payrollGenerator.js';
import logger from '../../../utils/loggerUtils.js';

// Generate Payroll for an Employee
export const generatePayroll = async (req, res) => {
  try {
    // Validate the input data
    if (!req.body.employeeId || !req.body.salary || !req.body.month) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const payrollData = await generatePayrollData(req.body);
    const payroll = await Payroll.create(payrollData);
    res.status(201).json(payroll);
  } catch (error) {
    logger.error('Error generating payroll:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get All Payrolls
export const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate(
      'employee',
      'firstName lastName email'
    );

    if (!payrolls.length) {
      return res.status(404).json({ message: 'No payroll records found' });
    }

    res.json(payrolls);
  } catch (error) {
    logger.error('Error fetching payrolls:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Payroll for One Employee
export const getPayrollByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Ensure employeeId is provided
    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID is required' });
    }

    const payrolls = await Payroll.find({ employee: employeeId });

    if (!payrolls.length) {
      return res
        .status(404)
        .json({ message: 'No payroll records found for this employee' });
    }

    res.json(payrolls);
  } catch (error) {
    logger.error('Error fetching payroll for employee:', error);
    res.status(500).json({ error: error.message });
  }
};

// Mark Payroll as Paid
export const markAsPaid = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found' });
    }

    if (payroll.status === 'Paid') {
      return res
        .status(400)
        .json({ message: 'Payroll is already marked as paid' });
    }

    payroll.status = 'Paid';
    await payroll.save();

    res.json({ message: 'Payroll marked as paid', payroll });
  } catch (error) {
    logger.error('Error marking payroll as paid:', error);
    res.status(500).json({ error: error.message });
  }
};
