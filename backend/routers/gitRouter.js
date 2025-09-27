const express = require("express");
const {CheckMyBranch, CreateNewBranch, ChangeBranch,GitDiff,GitAdd,gitCommit,gitPush} = require("../controllers/gitController.js");
const router = express.Router();

router.get("/",CheckMyBranch);
router.post("/createbranch",CreateNewBranch);
router.post("/gitcheckout",ChangeBranch);
router.post("/changebranch",ChangeBranch);
router.post("/gitdiff",GitDiff);
router.post("/gitadd",GitAdd);
router.post("/gitcommit",gitCommit);
router.post("/gitpush", gitPush);
module.exports = router;
