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
  getGovIssues,
  updateIssueStatus,
  getFieldWorkers,
  assignIssue,
  getMyTasks,
  resolveIssue,
} = require("../controller/issueController");
const { isLogedIn,restrictTo } = require("../middleware/authmiddleware");


router.post("/", isLogedIn, createIssue);
router.get("/", getAllIssues);
router.get("/user/my-issues", isLogedIn, getMyIssues);

// Gov/Admin
router.get("/gov/all", isLogedIn, restrictTo("gov", "admin"), getGovIssues);
router.get("/gov/stats", isLogedIn, restrictTo("gov", "admin"), getGovStats);
router.get("/gov/fieldworkers", isLogedIn, restrictTo("gov", "admin"), getFieldWorkers);
router.patch("/:id/assign", isLogedIn, restrictTo("gov", "admin"), assignIssue);
router.patch("/:id/status", isLogedIn, restrictTo("gov", "admin"), updateIssueStatus);

// Field worker
router.get("/fieldworker/my-tasks", isLogedIn, restrictTo("fieldworker"), getMyTasks);
router.patch("/:id/resolve", isLogedIn, restrictTo("fieldworker"), resolveIssue);

router.get("/:id", getIssueById);
router.post("/:id/upvote", isLogedIn, upvoteIssue);
router.post("/:id/comment", isLogedIn, addComment);

module.exports = router;