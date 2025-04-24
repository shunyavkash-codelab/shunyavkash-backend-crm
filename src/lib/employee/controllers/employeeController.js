import Employee from "../Employee.js";
import Project from "../../project/Project.js";
import {
  processUploadedFile,
  processUploadedFiles,
  deleteEmployeeAvatar,
  deleteEmployeeDocuments,
  safeDeleteFile,
} from "../../../utils/cloudinaryHelpers.js";

// Create Employee
export const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      department,
      designation,
      dateOfJoining,
      salary,
      status,
      address,
    } = req.body;

    const avatarFile = processUploadedFile(req.files?.avatar?.[0]);
    const documents = processUploadedFiles(req.files?.documents);

    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      phone,
      department,
      designation,
      dateOfJoining,
      salary,
      status,
      address,
      avatar: avatarFile?.url || "",
      avatarPublicId: avatarFile?.publicId || "",
      documents,
    });

    const savedEmployee = await newEmployee.save();
    return res.status(201).json(savedEmployee);
  } catch (err) {
    return res.status(400).json({
      message: "Failed to create employee",
      error: err.message,
    });
  }
};

// Get All Employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    return res.status(200).json(employees);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch employees",
      error: err.message,
    });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).lean();
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Fetch assigned projects
    const projects = await Project.find({
      assignedEmployees: employee._id,
    }).select("name description status");

    return res.status(200).json({ ...employee, assignedProjects: projects });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch employee",
      error: err.message,
    });
  }
};

// Update Employee
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const updatedData = { ...req.body };

    // Handle Department
    if (req.body.department !== undefined) {
      const isRemoveOperation =
        Array.isArray(req.body.department) &&
        Array.isArray(employee.department) &&
        req.body.department.length < employee.department.length;

      if (isRemoveOperation) {
        // Direct replacement for tag removal operation
        updatedData.department = Array.isArray(req.body.department)
          ? req.body.department
          : [req.body.department];
      } else {
        let existingDepts = employee.department || [];
        const newDepts = Array.isArray(req.body.department)
          ? req.body.department
          : [req.body.department];

        // Append and deduplicate
        updatedData.department = [...new Set([...existingDepts, ...newDepts])];
      }
    }
    // Handle departmentsToDelete
    else if (req.body.departmentsToDelete) {
      let updatedDepartments = employee.department || [];

      // Delete departments if provided
      const departmentsToDelete = Array.isArray(req.body.departmentsToDelete)
        ? req.body.departmentsToDelete
        : [req.body.departmentsToDelete];

      updatedDepartments = updatedDepartments.filter(
        (dept) => !departmentsToDelete.includes(dept)
      );

      updatedData.department = updatedDepartments;
    }

    // Handle Designation
    if (req.body.designation !== undefined) {
      const isRemoveOperation =
        Array.isArray(req.body.designation) &&
        Array.isArray(employee.designation) &&
        req.body.designation.length < employee.designation.length;

      if (isRemoveOperation) {
        // Direct replacement for tag removal operation
        updatedData.designation = Array.isArray(req.body.designation)
          ? req.body.designation
          : [req.body.designation];
      } else {
        let existingDesigs = employee.designation || [];
        const newDesigs = Array.isArray(req.body.designation)
          ? req.body.designation
          : [req.body.designation];

        // Append and deduplicate
        updatedData.designation = [
          ...new Set([...existingDesigs, ...newDesigs]),
        ];
      }
    }
    // Handle designationsToDelete
    else if (req.body.designationsToDelete) {
      let updatedDesignations = employee.designation || [];

      // Delete designations if provided
      const designationsToDelete = Array.isArray(req.body.designationsToDelete)
        ? req.body.designationsToDelete
        : [req.body.designationsToDelete];

      updatedDesignations = updatedDesignations.filter(
        (desig) => !designationsToDelete.includes(desig)
      );

      updatedData.designation = updatedDesignations;
    }

    const newAvatar = req.files?.avatar?.[0];
    if (newAvatar) {
      await deleteEmployeeAvatar(employee);
      const processedAvatar = processUploadedFile(newAvatar);
      updatedData.avatar = processedAvatar.url;
      updatedData.avatarPublicId = processedAvatar.publicId;
    }

    let documentsToDelete = [];
    try {
      documentsToDelete = JSON.parse(req.body.documentsToDelete || "[]");
    } catch (e) {
      console.warn("Invalid documentsToDelete format:", e.message);
    }

    if (documentsToDelete.length > 0) {
      for (const publicId of documentsToDelete) {
        await safeDeleteFile(publicId);
      }
      updatedData.documents = employee.documents.filter(
        (doc) => !documentsToDelete.includes(doc.publicId)
      );
    }

    const newDocs = req.files?.documents || [];
    if (newDocs.length > 0) {
      const processedNewDocs = processUploadedFiles(newDocs);
      updatedData.documents = [
        ...(updatedData.documents || employee.documents),
        ...processedNewDocs,
      ];
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    return res.status(200).json(updatedEmployee);
  } catch (err) {
    return res.status(400).json({
      message: "Failed to update employee",
      error: err.message,
    });
  }
};

// Delete Employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await deleteEmployeeAvatar(employee);
    await deleteEmployeeDocuments(employee.documents);

    await Employee.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to delete employee",
      error: err.message,
    });
  }
};
