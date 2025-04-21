import Project from "../../../models/Project.js";
import Employee from "../../../models/Employee.js";

export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isArchived: false }).populate(
      "client",
      "name"
    );
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "client",
      "name"
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const archiveProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.isArchived = !project.isArchived; // toggle archive
    await project.save();

    res.json({
      message: `Project ${
        project.isArchived ? "archived" : "unarchived"
      } successfully`,
      project,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getArchivedProjects = async (req, res) => {
  try {
    const archivedProjects = await Project.find({ isArchived: true }).populate(
      "client",
      "name"
    );
    res.json(archivedProjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assign Employees
export const assignEmployeesToProject = async (req, res) => {
  try {
    const { employees } = req.body; // Array of { employeeId, role }

    // Ensure employees array is passed
    if (!employees || employees.length === 0) {
      return res.status(400).json({ error: "No employees provided" });
    }

    // Retrieve employees and validate existence
    const assigned = await Promise.all(
      employees.map(async ({ employeeId, role }) => {
        const employee = await Employee.findById(employeeId); // Using Employee model
        if (!employee) {
          throw new Error(`Employee ${employeeId} not found`);
        }
        return { _id: employee._id, name: employee.name, role };
      })
    );

    // Update the project with assigned employees
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { assignedEmployees: assigned },
      { new: true }
    ).populate("client");

    // Check if project exists
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Send updated project back
    res.json(updatedProject);
  } catch (error) {
    console.error("Error assigning employees:", error);
    res.status(400).json({ error: error.message });
  }
};
