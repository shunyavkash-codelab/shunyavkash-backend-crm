// import Interview from "../../../models/Interview.js";
// import Employee from "../../../models/Employee.js";
// import { deleteFileFromCloudinary } from "../../../utils/cloudinaryHelpers.js";

// // 🔹 Create Interview
// export const createInterview = async (req, res) => {
//   try {
//     const {
//       candidateName,
//       candidateEmail,
//       position,
//       interviewDate,
//       interviewTime,
//       interviewer,
//       status,
//       mode,
//       location,
//       feedback,
//     } = req.body;

//     const interviewerExists = await Employee.findById(interviewer);
//     if (!interviewerExists) {
//       return res.status(404).json({ message: "Interviewer not found" });
//     }

//     const resumeFile = req.files?.resume?.[0];

//     const newInterview = new Interview({
//       candidateName,
//       candidateEmail,
//       position,
//       interviewDate,
//       interviewTime,
//       interviewer,
//       status,
//       mode,
//       location,
//       feedback,
//       resume: resumeFile
//         ? { name: resumeFile.originalname, url: resumeFile.path }
//         : undefined,
//       resumePublicId: resumeFile?.filename,
//     });

//     const savedInterview = await newInterview.save();
//     res.status(201).json(savedInterview);
//   } catch (err) {
//     res
//       .status(400)
//       .json({ message: "Failed to create interview", error: err.message });
//   }
// };

// // 🔹 Get All Interviews
// export const getAllInterviews = async (req, res) => {
//   try {
//     const interviews = await Interview.find().populate(
//       "interviewer",
//       "firstName lastName email"
//     );
//     res.json(interviews);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch interviews", error: err.message });
//   }
// };

// // 🔹 Get Single Interview
// export const getInterviewById = async (req, res) => {
//   try {
//     const interview = await Interview.findById(req.params.id).populate(
//       "interviewer",
//       "firstName lastName email"
//     );
//     if (!interview) {
//       return res.status(404).json({ message: "Interview not found" });
//     }
//     res.json(interview);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch interview", error: err.message });
//   }
// };

// // 🔹 Update Interview
// export const updateInterview = async (req, res) => {
//   try {
//     const interview = await Interview.findById(req.params.id);
//     if (!interview) {
//       return res.status(404).json({ message: "Interview not found" });
//     }

//     const newResumeFile = req.files?.resume?.[0];

//     // 🗑️ Delete old resume if new uploaded
//     if (newResumeFile && interview.resumePublicId) {
//       await deleteFileFromCloudinary(interview.resumePublicId);
//     }

//     // ✏️ Update fields
//     const {
//       candidateName,
//       candidateEmail,
//       position,
//       interviewDate,
//       interviewTime,
//       interviewer,
//       status,
//       mode,
//       location,
//       feedback,
//     } = req.body;

//     interview.candidateName = candidateName || interview.candidateName;
//     interview.candidateEmail = candidateEmail || interview.candidateEmail;
//     interview.position = position || interview.position;
//     interview.interviewDate = interviewDate || interview.interviewDate;
//     interview.interviewTime = interviewTime || interview.interviewTime;
//     interview.interviewer = interviewer || interview.interviewer;
//     interview.status = status || interview.status;
//     interview.mode = mode || interview.mode;
//     interview.location = location || interview.location;
//     interview.feedback = feedback || interview.feedback;

//     if (newResumeFile) {
//       interview.resume = {
//         name: newResumeFile.originalname,
//         url: newResumeFile.path,
//       };
//       interview.resumePublicId = newResumeFile.filename;
//     }

//     const updatedInterview = await interview.save();
//     res.json(updatedInterview);
//   } catch (err) {
//     res
//       .status(400)
//       .json({ message: "Failed to update interview", error: err.message });
//   }
// };

// // 🔹 Delete Interview
// export const deleteInterview = async (req, res) => {
//   try {
//     const interview = await Interview.findById(req.params.id);
//     if (!interview) {
//       return res.status(404).json({ message: "Interview not found" });
//     }

//     if (interview.resumePublicId) {
//       await deleteFileFromCloudinary(interview.resumePublicId);
//     }

//     await Interview.findByIdAndDelete(req.params.id);
//     res.json({ message: "Interview deleted successfully" });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to delete interview", error: err.message });
//   }
// };

import Interview from "../../../models/Interview.js";
import Employee from "../../../models/Employee.js";
import { deleteFileFromCloudinary } from "../../../utils/cloudinaryHelpers.js";

// 🔹 Create Interview
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
      feedback,
    } = req.body;

    const interviewerExists = await Employee.findById(interviewer);
    if (!interviewerExists) {
      return res.status(404).json({ message: "Interviewer not found" });
    }

    const resumeFile = req.files?.resume?.[0];

    const newInterview = new Interview({
      candidateName,
      candidateEmail,
      position,
      interviewDate,
      interviewTime,
      interviewer,
      status,
      mode,
      location,
      feedback,
      resume: resumeFile
        ? { name: resumeFile.originalname, url: resumeFile.path }
        : undefined,
      resumePublicId: resumeFile?.filename || resumeFile?.public_id,
    });

    const savedInterview = await newInterview.save();
    res.status(201).json(savedInterview);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create interview", error: err.message });
  }
};

// 🔹 Get All Interviews
export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().populate(
      "interviewer",
      "firstName lastName email"
    );
    res.json(interviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch interviews", error: err.message });
  }
};

// 🔹 Get Single Interview
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate(
      "interviewer",
      "firstName lastName email"
    );
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }
    res.json(interview);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch interview", error: err.message });
  }
};

// 🔹 Update Interview
export const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const newResumeFile = req.files?.resume?.[0];

    // 🗑️ Delete old resume if new uploaded
    if (newResumeFile && interview.resumePublicId) {
      try {
        console.log("Deleting old resume:", interview.resumePublicId);
        await deleteFileFromCloudinary(interview.resumePublicId);
      } catch (err) {
        console.error("Error deleting old resume:", err);
        // Continue with the update even if deletion fails
      }
    }

    // ✏️ Update fields
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
      feedback,
    } = req.body;

    interview.candidateName = candidateName || interview.candidateName;
    interview.candidateEmail = candidateEmail || interview.candidateEmail;
    interview.position = position || interview.position;
    interview.interviewDate = interviewDate || interview.interviewDate;
    interview.interviewTime = interviewTime || interview.interviewTime;
    interview.interviewer = interviewer || interview.interviewer;
    interview.status = status || interview.status;
    interview.mode = mode || interview.mode;
    interview.location = location || interview.location;
    interview.feedback = feedback || interview.feedback;

    if (newResumeFile) {
      interview.resume = {
        name: newResumeFile.originalname,
        url: newResumeFile.path,
      };
      interview.resumePublicId =
        newResumeFile.filename || newResumeFile.public_id;
    }

    const updatedInterview = await interview.save();
    res.json(updatedInterview);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update interview", error: err.message });
  }
};

// 🔹 Delete Interview
export const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Delete resume from Cloudinary if it exists
    if (interview.resumePublicId) {
      try {
        console.log("Deleting resume:", interview.resumePublicId);
        await deleteFileFromCloudinary(interview.resumePublicId);
      } catch (err) {
        console.error("Error deleting resume:", err);
        // Continue with the deletion even if file removal fails
      }
    }

    await Interview.findByIdAndDelete(req.params.id);
    res.json({ message: "Interview deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete interview", error: err.message });
  }
};
