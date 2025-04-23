import Project from "../Project.js";
import Employee from "../../employee/Employee.js";
import { sendEmail } from "../../../utils/sendEmail.js";
import { generateAssignmentEmail } from "../../../utils/emailTemplates.js";

// Create a new project
export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    return res.status(201).json(project); // Ensure the response is returned
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(400).json({ error: error.message });
  }
};

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isArchived: false }).populate(
      "client",
      "name"
    );
    return res.status(200).json(projects); // Ensure the response is returned
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get a project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client")
      .populate({
        path: "assignedEmployees.employee",
        select: "firstName lastName department designation avatar status",
      });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(project); // Ensure the response is returned
  } catch (error) {
    console.error("Error fetching project:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Update project by ID
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(project); // Ensure the response is returned
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(400).json({ error: error.message });
  }
};

// Delete project by ID
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({ message: "Project deleted" }); // Ensure the response is returned
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Archive/unarchive project
export const archiveProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.isArchived = !project.isArchived; // Toggle archive status
    await project.save();

    return res.status(200).json({
      message: `Project ${
        project.isArchived ? "archived" : "unarchived"
      } successfully`,
      project,
    });
  } catch (error) {
    console.error("Error archiving project:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get archived projects
export const getArchivedProjects = async (req, res) => {
  try {
    const archivedProjects = await Project.find({ isArchived: true }).populate(
      "client",
      "name"
    );
    return res.status(200).json(archivedProjects); // Ensure the response is returned
  } catch (error) {
    console.error("Error fetching archived projects:", error);
    return res.status(500).json({ error: error.message });
  }
};

// export const assignEmployeesToProject = async (req, res) => {
//   const { employees } = req.body;

//   if (!employees || employees.length === 0) {
//     return res.status(400).json({ error: "No employees provided" });
//   }

//   try {
//     const project = await Project.findById(req.params.id);
//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     const existingEmployeeIds = project.assignedEmployees.map((e) =>
//       e.employee.toString()
//     );

//     const assigned = [];

//     for (const { employeeId, role } of employees) {
//       if (existingEmployeeIds.includes(employeeId)) {
//         console.log(`Employee ${employeeId} already assigned. Skipping.`);
//         continue;
//       }

//       const employee = await Employee.findById(employeeId);
//       if (!employee) {
//         throw new Error(`Employee with ID ${employeeId} not found`);
//       }

//       // Send email notification
//       if (employee.email) {
//         const html = generateAssignmentEmail(
//           employee.firstName,
//           project.title,
//           role
//         );

//         await sendEmail({
//           to: employee.email,
//           subject: "You have been assigned to a new project",
//           html,
//         });
//       }

//       assigned.push({ employee: employee._id, role });
//     }

//     if (assigned.length > 0) {
//       project.assignedEmployees.push(...assigned);
//       await project.save();
//     }

//     const updatedProject = await Project.findById(project._id)
//       .populate("client")
//       .populate({
//         path: "assignedEmployees.employee",
//         select: "firstName lastName department designation avatar status",
//       });

//     return res.status(200).json(updatedProject);
//   } catch (error) {
//     console.error("Error assigning employees:", error);
//     return res.status(400).json({ error: error.message });
//   }
// };
export const assignEmployeesToProject = async (req, res) => {
  const { employees } = req.body;

  if (!employees || employees.length === 0) {
    return res.status(400).json({ error: "No employees provided" });
  }

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const existingEmployeeIds = project.assignedEmployees.map((e) =>
      e.employee.toString()
    );

    const assigned = [];
    const skippedEmployees = []; // ✅ Store skipped employeeIds

    for (const { employeeId, role } of employees) {
      if (existingEmployeeIds.includes(employeeId)) {
        console.log(`Employee ${employeeId} already assigned. Skipping.`);
        skippedEmployees.push(employeeId); // ✅ Track skipped
        continue;
      }

      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new Error(`Employee with ID ${employeeId} not found`);
      }

      // Send email notification
      if (employee.email) {
        const html = generateAssignmentEmail(
          employee.firstName,
          project.title,
          role
        );

        await sendEmail({
          to: employee.email,
          subject: "You have been assigned to a new project",
          html,
        });
      }

      assigned.push({ employee: employee._id, role });
    }

    if (assigned.length > 0) {
      project.assignedEmployees.push(...assigned);
      await project.save();
    }

    const updatedProject = await Project.findById(project._id)
      .populate("client")
      .populate({
        path: "assignedEmployees.employee",
        select: "firstName lastName department designation avatar status",
      });

    // ✅ Include skippedEmployees in the response
    return res.status(200).json({
      ...updatedProject.toObject(),
      skippedEmployees,
    });
  } catch (error) {
    console.error("Error assigning employees:", error);
    return res.status(400).json({ error: error.message });
  }
};
