const fs = require('fs');
const fetch = require('node-fetch');

const resultsPath = 'jest-results.json';
const receiverUrl = process.env.RECEIVER_URL;

if (!fs.existsSync(resultsPath)) {
    console.error("No test results found at", resultsPath);
    process.exit(1);
}

const results = JSON.parse(fs.readFileSync(resultsPath));

const payload = {
    repository: process.env.GITHUB_REPOSITORY,
    branch: process.env.GITHUB_REF_NAME,
    commit: process.env.GITHUB_SHA,
    run_id: process.env.GITHUB_RUN_ID,
    timestamp: new Date().toISOString(),
    total: results.numTotalTests,
    passed: results.numPassedTests,
    failed: results.numFailedTests,
    status: results.success ? "Passed" : "Failed",
    tests: results.testResults.flatMap(suite =>
        suite.assertionResults.map(test => ({
            name: test.title,
            result: test.status,
            failureMessage: test.failureMessages.length > 0 ? test.failureMessages.join('\n') : null
        }))
    )
};

fetch(receiverUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
})
.then(res => {
    if (res.ok) {
        console.log("Report successfully forwarded to local receiver.");
    } else {
        console.error("Failed to send report. Status:", res.status);
    }
})
.catch(err => console.error("Network error sending report:", err.message));
