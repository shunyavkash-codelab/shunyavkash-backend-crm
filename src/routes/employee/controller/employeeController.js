import Employee from "../../../models/Employee.js";
import {
  processUploadedFile,
  processUploadedFiles,
  deleteEmployeeAvatar,
  deleteEmployeeDocuments,
} from "../../../utils/cloudinaryHelpers.js";

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

    // Process avatar and documents
    const avatarFile = processUploadedFile(req.files?.avatar?.[0]);
    const documents = processUploadedFiles(req.files?.documents);

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
      avatar: avatarFile?.url || "",
      avatarPublicId: avatarFile?.publicId || "",
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
// export const updateEmployee = async (req, res) => {
//   try {
//     const employee = await Employee.findById(req.params.id);
//     if (!employee)
//       return res.status(404).json({ message: "Employee not found" });

//     // Update Employee
//     const updatedData = { ...req.body };

//     // Handle Avatar Update
//     const newAvatar = req.files?.avatar?.[0];
//     if (newAvatar) {
//       // Delete old avatar if it exists
//       await deleteEmployeeAvatar(employee);

//       // Set new avatar
//       const processedAvatar = processUploadedFile(newAvatar);
//       updatedData.avatar = processedAvatar.url;
//       updatedData.avatarPublicId = processedAvatar.publicId;
//     }

//     // Handle Documents Update
//     const newDocs = req.files?.documents;
//     // if (newDocs && newDocs.length > 0) {
//     //   // Delete old documents
//     //   await deleteEmployeeDocuments(employee.documents);

//     //   // Set new documents
//     //   updatedData.documents = processUploadedFiles(newDocs);
//     // }

//     let currentDocs = employee.documents || [];

//     if (documentsToDelete.length > 0) {
//       for (const publicId of documentsToDelete) {
//         await safeDeleteFile(publicId);
//       }

//       currentDocs = currentDocs.filter(
//         (doc) => !documentsToDelete.includes(doc.publicId)
//       );
//     }

//     if (req.files?.documents?.length > 0) {
//       const processedNewDocs = processUploadedFiles(req.files.documents);
//       currentDocs = [...currentDocs, ...processedNewDocs];
//     }

//     updatedData.documents = currentDocs;

//     // Handle Documents Deletion
//     let documentsToDelete = [];
//     try {
//       documentsToDelete = JSON.parse(req.body.documentsToDelete || "[]");
//     } catch (e) {
//       console.error("Invalid documentsToDelete format:", e.message);
//     }

//     if (documentsToDelete.length > 0) {
//       for (const publicId of documentsToDelete) {
//         await safeDeleteFile(publicId);
//       }

//       // Remove deleted docs from existing list
//       const filteredDocs = employee.documents.filter(
//         (doc) => !documentsToDelete.includes(doc.publicId)
//       );

//       updatedData.documents = filteredDocs;
//     }

//     const updated = await Employee.findByIdAndUpdate(
//       req.params.id,
//       updatedData,
//       { new: true }
//     );

//     res.json(updated);
//   } catch (err) {
//     res
//       .status(400)
//       .json({ message: "Failed to update employee", error: err.message });
//   }
// };

// Update Employee
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const updatedData = { ...req.body };

    // Handle Avatar Update
    const newAvatar = req.files?.avatar?.[0];
    if (newAvatar) {
      await deleteEmployeeAvatar(employee); // Delete old avatar
      const processedAvatar = processUploadedFile(newAvatar);
      updatedData.avatar = processedAvatar.url;
      updatedData.avatarPublicId = processedAvatar.publicId;
    }

    // Handle Document Deletion
    let documentsToDelete = [];
    try {
      documentsToDelete = JSON.parse(req.body.documentsToDelete || "[]");
    } catch (e) {
      console.error("Invalid documentsToDelete format:", e.message);
    }

    // Delete documents from Cloudinary
    if (documentsToDelete.length > 0) {
      for (const publicId of documentsToDelete) {
        await safeDeleteFile(publicId); // Directly delete by publicId
      }

      // Remove deleted docs from the existing list
      updatedData.documents = employee.documents.filter(
        (doc) => !documentsToDelete.includes(doc.publicId)
      );
    }

    // Handle Document Update (Add new docs)
    const newDocs = req.files?.documents;
    if (newDocs && newDocs.length > 0) {
      const processedNewDocs = processUploadedFiles(newDocs);
      updatedData.documents = [
        ...(updatedData.documents || employee.documents),
        ...processedNewDocs,
      ];
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

    // Delete avatar and documents
    await deleteEmployeeAvatar(employee);
    await deleteEmployeeDocuments(employee.documents);

    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete employee", error: err.message });
  }
};
