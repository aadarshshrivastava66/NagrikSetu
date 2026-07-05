const express = require("express");
const router = express.Router();
const {
  createIssue,
  getAllIssues,
  getIssueById,
  upvoteIssue,
  addComment,
  getMyIssues,
  getGovStats,
  updateIssueStatus
} = require("../controller/issueController");
const { isLogedIn,restrictTo } = require("../middleware/authmiddleware");

router.post("/", isLogedIn, createIssue);           // Create issue
router.get("/", getAllIssues);                    // Get all issues
router.get("/user/my-issues", isLogedIn, getMyIssues); // Get my issues
router.get("/gov/stats", isLogedIn, restrictTo("gov", "admin"), getGovStats);
router.get("/:id", getIssueById);                 // Get single issue
router.post("/:id/upvote", isLogedIn, upvoteIssue); // Upvote
router.post("/:id/comment", isLogedIn, addComment); // Add comment
router.patch("/:id/status", isLogedIn, restrictTo("gov", "admin"), updateIssueStatus)

module.exports = router;