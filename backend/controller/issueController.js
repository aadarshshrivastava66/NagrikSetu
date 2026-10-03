const Issue = require("../models/Issue");
const User = require("../models/User");

const getUserId = (req) => req.user.userId || req.user.id || req.user._id;
// POST /api/issues — Create new issue
module.exports.createIssue = async (req, res) => {
  const { title, description, category, photoFileId, photoFilename, latitude, longitude, address, city, ward } = req.body;

  try {
    if (!title || !description || !category || !photoFileId) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const newIssue = new Issue({
      title,
      description,
      category,
      photo: {
        fileId: photoFileId,
        filename: photoFilename,
      },
      location: {
        latitude,
        longitude,
        address,
      },
      city,
      ward,
      reportedBy: req.user.userId,
    });

    await newIssue.save();

    res.status(201).json({
      message: "Issue reported successfully",
      issue: newIssue,
    });
  } catch (err) {
    console.log("Create issue error:", err);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

// GET /api/issues — Get all issues (with filters)
module.exports.getAllIssues = async (req, res) => {
  try {
    const { category, status, city, ward } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (city) filter.city = city;
    if (ward) filter.ward = ward;

    const issues = await Issue.find(filter)
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ issues });
  } catch (err) {
    console.log("Get issues error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/issues/:id — Get single issue
module.exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("reportedBy", "name email city ward")
      .populate("upvotedBy", "name")
      .populate("assignedTo", "name email"); ;

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json({ issue });
  } catch (err) {
    console.log("Get issue error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/issues/:id/upvote — Upvote an issue
module.exports.upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const userId = req.user.userId;

    if (issue.upvotedBy.includes(userId)) {
      issue.upvotedBy = issue.upvotedBy.filter((id) => id.toString() !== userId);
      issue.votes -= 1;
    } else {
      issue.upvotedBy.push(userId);
      issue.votes += 1;
    }

    await issue.save();

    res.status(200).json({ message: "Vote updated", votes: issue.votes });
  } catch (err) {
    console.log("Upvote error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/issues/:id/comment — Add comment
module.exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Get user name from DB
    const User = require("../models/User");
    const user = await User.findById(req.user.userId).select("name");

    const newComment = {
      userId: req.user.userId,
      userName: user ? user.name : "Anonymous",
      text: text.trim(),
    };

    issue.comments.push(newComment);
    await issue.save();

    res.status(201).json({
      message: "Comment added",
      comment: newComment,
    });
  } catch (err) {
    console.log("Comment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/issues/user/my-issues — Get user's issues (protected)
module.exports.getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({ issues });
  } catch (err) {
    console.log("Get my issues error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET /api/issues/gov/all — Get issues scoped to gov's department & city (Admin sees all)
module.exports.getGovIssues = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    console.log(currentUser);
    console.log(req.user)
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let filter = {};

    // Gov users only see their department + city
    if (currentUser.role === "gov") {
      if (!currentUser.department || !currentUser.city) {
        return res.status(400).json({
          message: "Your account has no department/city assigned. Contact admin.",
        });
      }
      filter.category = currentUser.department;
      filter.city = currentUser.city;
    }

    // Admin can optionally filter via query params
    if (currentUser.role === "admin") {
      const { category, city, status } = req.query;
      if (category && category !== "All") filter.category = category;
      if (city && city !== "All") filter.city = city;
      if (status && status !== "All") filter.status = status;
    } else {
      // Gov can still filter by status within their scope
      const { status } = req.query;
      if (status && status !== "All") filter.status = status;
    }

    const issues = await Issue.find(filter)
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ issues, scope: currentUser.role === "gov" ? {
      department: currentUser.department,
      city: currentUser.city,
    } : null });
  } catch (err) {
    console.log("Get gov issues error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/issues/:id/status — Update issue status (scoped for gov, unrestricted for admin)
module.exports.updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["Submitted", "Acknowledged", "Assigned", "In Progress", "Resolved", "Closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const currentUser = await User.findById(req.user.userId);

    // Gov can only update issues matching their department + city
    if (currentUser.role === "gov") {
      if (issue.category !== currentUser.department || issue.city !== currentUser.city) {
        return res.status(403).json({
          message: "You can only update issues in your assigned department and city",
        });
      }
    }
    // Admin — no restriction

    issue.status = status;
    await issue.save();

    res.status(200).json({ message: "Status updated successfully", issue });
  } catch (err) {
    console.log("Update status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/issues/gov/stats — Dashboard stats (scoped for gov, global for admin)
module.exports.getGovStats = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);

    let filter = {};
    if (currentUser.role === "gov") {
      filter.category = currentUser.department;
      filter.city = currentUser.city;
    }

    const totalIssues = await Issue.countDocuments(filter);
    const submitted = await Issue.countDocuments({ ...filter, status: "Submitted" });
    const inProgress = await Issue.countDocuments({ ...filter, status: "In Progress" });
    const resolved = await Issue.countDocuments({ ...filter, status: "Resolved" });
    const closed = await Issue.countDocuments({ ...filter, status: "Closed" });

    res.status(200).json({
      stats: { totalIssues, submitted, inProgress, resolved, closed },
    });
  } catch (err) {
    console.log("Get stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




//new
module.exports.getFieldWorkers = async (req, res) => {
  try {
    const userId = getUserId(req);
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let filter = { role: "fieldworker", isActive: true };

    // Gov only sees field workers in their own department + city
    if (currentUser.role === "gov") {
      filter.department = currentUser.department;
      filter.city = currentUser.city;
    }
    // Admin sees all field workers (optionally filter by query)
    if (currentUser.role === "admin") {
      const { department, city } = req.query;
      if (department) filter.department = department;
      if (city) filter.city = city;
    }

    const fieldWorkers = await User.find(filter).select("name email department city");

    res.status(200).json({ fieldWorkers });
  } catch (err) {
    console.log("Get field workers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// PATCH /api/issues/:id/assign — Gov/Admin assigns issue to a field worker
module.exports.assignIssue = async (req, res) => {
  try {
    const { fieldWorkerId } = req.body;

    if (!fieldWorkerId) {
      return res.status(400).json({ message: "Field worker is required" });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const fieldWorker = await User.findById(fieldWorkerId);
    if (!fieldWorker || fieldWorker.role !== "fieldworker") {
      return res.status(400).json({ message: "Invalid field worker" });
    }

    const userId = getUserId(req);
    const currentUser = await User.findById(userId);

    // Gov can only assign issues in their own scope
    if (currentUser.role === "gov") {
      const deptMatch = issue.category.toLowerCase() === (currentUser.department || "").toLowerCase();
      const cityMatch = issue.city.toLowerCase() === (currentUser.city || "").toLowerCase();
      if (!deptMatch || !cityMatch) {
        return res.status(403).json({ message: "You can only assign issues in your department and city" });
      }
    }

    issue.assignedTo = fieldWorker._id;
    issue.assignedBy = currentUser._id;
    issue.status = "Assigned";
    await issue.save();

    const populatedIssue = await Issue.findById(issue._id)
      .populate("assignedTo", "name email")
      .populate("reportedBy", "name email");

    res.status(200).json({ message: "Issue assigned successfully", issue: populatedIssue });
  } catch (err) {
    console.log("Assign issue error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET /api/issues/fieldworker/my-tasks — Field worker sees their assigned issues
module.exports.getMyTasks = async (req, res) => {
  try {
    const userId = getUserId(req);

    const issues = await Issue.find({ assignedTo: userId })
      .populate("reportedBy", "name")
      .populate("assignedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ issues });
  } catch (err) {
    console.log("Get my tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// PATCH /api/issues/:id/resolve — Field worker uploads resolution photo and marks resolved
module.exports.resolveIssue = async (req, res) => {
  try {
    const { resolutionFileId, resolutionFilename } = req.body;

    if (!resolutionFileId) {
      return res.status(400).json({ message: "Resolution photo is required" });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const userId = getUserId(req);

    // Only the assigned field worker can resolve it
    if (!issue.assignedTo || issue.assignedTo.toString() !== userId.toString()) {
      return res.status(403).json({ message: "This issue is not assigned to you" });
    }

    issue.resolutionPhoto = {
      fileId: resolutionFileId,
      filename: resolutionFilename,
      uploadedAt: new Date(),
    };
    issue.status = "Resolved";
    await issue.save();

    res.status(200).json({ message: "Issue marked as resolved", issue });
  } catch (err) {
    console.log("Resolve issue error:", err);
    res.status(500).json({ message: "Server error" });
  }
};