const express =
require("express");

const router =
express.Router();

const {
runAudit,
downloadReport
} =
require("../controllers/auditController");

router.post(
"/audit",
runAudit
);

router.post(
"/download-report",
downloadReport
);

module.exports =
router;