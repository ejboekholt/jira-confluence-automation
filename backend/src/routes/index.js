const express = require('express');
const { getHealth } = require('../controllers/healthController');
const { getProjectIssues } = require('../controllers/jiraController');
const { generateReport } = require('../controllers/reportController');

const router = express.Router();

router.get('/health', getHealth);
router.get('/jira/issues', getProjectIssues);
router.post('/reports/generate', generateReport);

module.exports = router;
