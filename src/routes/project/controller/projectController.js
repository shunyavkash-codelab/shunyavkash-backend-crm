import Project from "../../../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// export const getAllProjects = async (req, res) => {
//   const projects = await Project.find().populate("client", "name");
//   res.json(projects);
// };
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

export const updateProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(project);
};

export const deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Project deleted" });
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
