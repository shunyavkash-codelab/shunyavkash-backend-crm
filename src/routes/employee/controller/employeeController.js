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

const extractAvatarPublicId = (url) => {
  if (!url) return null;

  const parts = url.split("/");
  const fileNameWithExt = parts.pop(); // e.g., 1744350654695-samurai-model.png.png
  const fileName = fileNameWithExt.replace(/\.[^/.]+$/, ""); // Remove one extension
  const folder = parts.slice(-1)[0]; // get folder like 'employee_avatars'
  return `${folder}/${fileName}`;
};

const extractDocumentPublicId = (url) => {
  if (!url) return null;

  const parts = url.split("/");
  const fileNameWithExt = parts.pop(); // e.g., 1744362151885-eye-open.png
  const [publicId] = fileNameWithExt.split("."); // remove extension completely
  return `employee_documents/${publicId}`;
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const updatedData = { ...req.body };

    // Replace Avatar
    const newAvatar = req.files?.avatar?.[0];
    if (newAvatar) {
      if (employee.avatar) {
        const publicId = extractAvatarPublicId(employee.avatar);
        await cloudinary.uploader.destroy(publicId);
      }
      updatedData.avatar = newAvatar.path;
    }

    //  Replace Documents
    const newDocs = req.files?.documents || [];
    if (newDocs.length) {
      await Promise.all(
        employee.documents.map(async (doc) => {
          const publicId = extractDocumentPublicId(doc.url);
          console.log("Deleting document from Cloudinary:", publicId);

          await cloudinary.uploader.destroy(publicId, {
            resource_type: "raw",
          });
        })
      );

      updatedData.documents = newDocs.map((file) => ({
        name: file.originalname,
        url: file.path,
      }));
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
      const publicId = extractAvatarPublicId(employee.avatar);
      await cloudinary.uploader.destroy(publicId);
    }

    // Delete all documents
    for (const doc of employee.documents) {
      const publicId = extractDocumentPublicId(doc.url);
      console.log("Deleting document from Cloudinary:", publicId);

      await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    }

    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete employee", error: err.message });
  }
};
