const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let submissions = [];

function isValidUrl(string) {
    try {
        const parsed = new URL(string);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

// 1. Serve the Assignment Submission Portal frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. API endpoint to fetch submissions
app.get('/submissions', (req, res) => {
    res.json(submissions);
});

// 3. API endpoint to handle user submissions
app.post('/submit', (req, res) => {
    const { name, regNo, title, url } = req.body;

    if (!name || !regNo || !title || !url) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!isValidUrl(url)) {
        return res.status(400).json({ error: 'Invalid submission URL' });
    }

    const newSubmission = { name, regNo, title, url };
    submissions.push(newSubmission);

    res.status(201).json(newSubmission);
});

// 4. Webhook endpoint to catch the test report from GitHub Actions
app.post('/report', (req, res) => {
    const reportData = req.body;

    fs.writeFileSync('test-report.json', JSON.stringify(reportData, null, 2));
    console.log('✅ Test report received via webhook and saved locally to test-report.json');

    // [skip ci] prevents an infinite loop of GitHub Actions runs
    exec('git add test-report.json && git commit -m "Auto-update test-report.json [skip ci]" && git push origin main', (error) => {
        if (error) {
            console.error(`❌ Git push failed: ${error.message}`);
            return;
        }
        console.log('🚀 Test report successfully pushed to remote GitHub repository!');
    });

    res.status(200).json({ message: 'Report received, saved locally, and pushed to remote successfully.' });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Assignment Portal & Webhook Receiver running on http://localhost:${PORT}`);
    });
}

module.exports = { app, submissions };
