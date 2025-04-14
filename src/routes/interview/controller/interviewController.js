import Interview from "../../../models/Interview.js";
import Employee from "../../../models/Employee.js";

// Create Interview
export const createInterview = async (req, res) => {
  try {
    const {
      candidateName,
      candidateEmail,
      position,
      interviewDate,
      interviewTime,
      interviewer,
      status,
      mode,
      location,
      resumeUrl,
      feedback,
    } = req.body;

    // Optional: validate interviewer exists
    const interviewerExists = await Employee.findById(interviewer);
    if (!interviewerExists)
      return res.status(404).json({ message: "Interviewer not found" });

    const interview = new Interview({
      candidateName,
      candidateEmail,
      position,
      interviewDate,
      interviewTime,
      interviewer,
      status,
      mode,
      location,
      resumeUrl,
      feedback,
    });

    const saved = await interview.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({
      message: "Failed to create interview",
      error: err.message,
    });
  }
};

// Get All Interviews
export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().populate(
      "interviewer",
      "firstName lastName email"
    );
    res.json(interviews);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch interviews",
      error: err.message,
    });
  }
};

// Get Single Interview
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate(
      "interviewer",
      "firstName lastName email"
    );
    if (!interview)
      return res.status(404).json({ message: "Interview not found" });
    res.json(interview);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch interview",
      error: err.message,
    });
  }
};

// Update Interview
export const updateInterview = async (req, res) => {
  try {
    const updated = await Interview.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("interviewer", "firstName lastName email");

    if (!updated)
      return res.status(404).json({ message: "Interview not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({
      message: "Failed to update interview",
      error: err.message,
    });
  }
};

// Delete Interview
export const deleteInterview = async (req, res) => {
  try {
    const deleted = await Interview.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Interview not found" });
    res.json({ message: "Interview deleted" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete interview",
      error: err.message,
    });
  }
};
