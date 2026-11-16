const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.post('/report', (req, res) => {
    fs.writeFileSync('test-report.json', JSON.stringify(req.body, null, 2));
    console.log('✅ Test report received and saved locally to test-report.json');
    res.status(200).send('Report safely received.');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Local HTTP Receiver listening on port ${PORT}`);
    console.log(`Run: 'ngrok http ${PORT}' in a separate terminal to expose this port to GitHub Actions.`);
});
