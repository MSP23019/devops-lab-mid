const submissions = [];

function submitAssignment(name, regNo, title, url) {
    if (!name || !regNo || !title || !url) {
        throw new Error("Missing registration number or other required fields");
    }
    try {
        new URL(url);
    } catch (e) {
        throw new Error("Invalid submission URL");
    }

    const entry = { name, regNo, title, url };
    submissions.push(entry);
    return entry;
}

function getSubmissions() {
    return submissions;
}

function clearSubmissions() {
    submissions.length = 0;
}

module.exports = { submitAssignment, getSubmissions, clearSubmissions };
