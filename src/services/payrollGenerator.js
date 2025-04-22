import Attendance from "../lib/attendance/Attendance.js";
import Employee from "../lib/employee/Employee.js";

export const generatePayrollData = async ({
  employeeId,
  month,
  year,
  bonuses = 0,
  deductions = 0,
}) => {
  const employee = await Employee.findById(employeeId);
  if (!employee) throw new Error("Employee not found");

  const fromDate = new Date(year, month - 1, 1);
  const toDate = new Date(year, month, 0);

  const attendanceRecords = await Attendance.find({
    employee: employeeId,
    date: { $gte: fromDate, $lte: toDate },
  });

  let presentDays = 0,
    leaveDays = 0,
    absentDays = 0;
  attendanceRecords.forEach((record) => {
    if (record.status === "Present") presentDays++;
    else if (record.status === "Leave") leaveDays++;
    else absentDays++;
  });

  const totalWorkingDays = presentDays + leaveDays + absentDays;
  const perDaySalary = employee.salary / totalWorkingDays;
  const netSalary =
    (presentDays + leaveDays) * perDaySalary + bonuses - deductions;

  return {
    employee: employeeId,
    month,
    year,
    presentDays,
    leaveDays,
    absentDays,
    basicSalary: employee.salary,
    bonuses,
    deductions,
    netSalary,
  };
};
