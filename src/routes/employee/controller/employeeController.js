// import Employee from "../../../models/Employee.js";

// // Create Employee
// export const createEmployee = async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       email,
//       phone,
//       designation,
//       dateOfJoining,
//       salary,
//       status,
//       address,
//     } = req.body;

//     const newEmployee = new Employee({
//       firstName,
//       lastName,
//       email,
//       phone,
//       designation,
//       dateOfJoining,
//       salary,
//       status,
//       address,
//       avatar: req.file?.path, // Set Cloudinary URL if uploaded
//     });

//     const saved = await newEmployee.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res
//       .status(400)
//       .json({ message: "Failed to create employee", error: err.message });
//   }
// };

// // Get All Employees
// export const getAllEmployees = async (req, res) => {
//   try {
//     const employees = await Employee.find();
//     res.json(employees);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch employees", error: err.message });
//   }
// };

// // Get Single Employee
// export const getEmployeeById = async (req, res) => {
//   try {
//     const employee = await Employee.findById(req.params.id);
//     if (!employee)
//       return res.status(404).json({ message: "Employee not found" });
//     res.json(employee);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch employee", error: err.message });
//   }
// };

// // Update Employee
// export const updateEmployee = async (req, res) => {
//   try {
//     const updatedData = {
//       ...req.body,
//     };

//     if (req.file) {
//       updatedData.avatar = req.file.path; // Update avatar if a new file is uploaded
//     }

//     const updated = await Employee.findByIdAndUpdate(
//       req.params.id,
//       updatedData,
//       {
//         new: true,
//       }
//     );

//     res.json(updated);
//   } catch (err) {
//     res
//       .status(400)
//       .json({ message: "Failed to update employee", error: err.message });
//   }
// };

// // Delete Employee
// export const deleteEmployee = async (req, res) => {
//   try {
//     await Employee.findByIdAndDelete(req.params.id);
//     res.json({ message: "Employee deleted" });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to delete employee", error: err.message });
//   }
// };

import Employee from "../../../models/Employee.js";
import cloudinary from "../../../configs/cloudinary.js";

// Create Employee
export const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      designation,
      dateOfJoining,
      salary,
      status,
      address,
    } = req.body;

    const avatar = req.files?.avatar?.[0]?.path;

    const documents = (req.files?.documents || []).map((file) => ({
      name: file.originalname,
      url: file.path,
    }));

    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      phone,
      designation,
      dateOfJoining,
      salary,
      status,
      address,
      avatar,
      documents,
    });

    const saved = await newEmployee.save();
    res.status(201).json(saved);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create employee", error: err.message });
  }
};

// Get All Employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch employees", error: err.message });
  }
};

// Get Single Employee
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch employee", error: err.message });
  }
};

// Update Employee
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const updatedData = { ...req.body };

    // Handle new avatar upload
    if (req.files?.avatar?.[0]) {
      if (employee.avatar) {
        const publicId = employee.avatar
          .split("/")
          .pop()
          .split(".")[0];
        await cloudinary.uploader.destroy(`employee_avatars/${publicId}`);
      }
      updatedData.avatar = req.files.avatar[0].path;
    }

    // Append new documents (don't delete existing ones)
    if (req.files?.documents?.length) {
      const newDocs = req.files.documents.map((file) => ({
        name: file.originalname,
        url: file.path,
      }));
      updatedData.documents = [...employee.documents, ...newDocs];
    }

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update employee", error: err.message });
  }
};

// Delete Employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    // Delete avatar
    if (employee.avatar) {
      const publicId = employee.avatar
        .split("/")
        .pop()
        .split(".")[0];
      await cloudinary.uploader.destroy(`employee_avatars/${publicId}`);
    }

    // Delete all documents
    for (const doc of employee.documents) {
      const publicId = doc.url
        .split("/")
        .pop()
        .split(".")[0];
      await cloudinary.uploader.destroy(`employee_documents/${publicId}`, {
        resource_type: "raw",
      });
    }

    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete employee", error: err.message });
  }
};
