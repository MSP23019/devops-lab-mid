const { submitAssignment, getSubmissions, clearSubmissions } = require('./app');

beforeEach(() => {
    clearSubmissions();
});

test('Complete details and a valid submission URL', () => {
    const entry = submitAssignment("Muhammad Saad", "FA20-BCS-001", "DevOps Lab", "https://github.com/omerta/repo");
    expect(entry).toBeDefined();
    expect(getSubmissions().length).toBe(1);
    expect(getSubmissions()[0].url).toBe("https://github.com/omerta/repo");
});

test('Missing registration number', () => {
    expect(() => {
        submitAssignment("Muhammad Saad", "", "DevOps Lab", "https://github.com/omerta/repo");
    }).toThrow("Missing registration number or other required fields");
    expect(getSubmissions().length).toBe(0);
});

test('Invalid submission URL', () => {
    expect(() => {
        submitAssignment("Muhammad Saad", "FA20-BCS-001", "DevOps Lab", "invalid-url-format");
    }).toThrow("Invalid submission URL");
    expect(getSubmissions().length).toBe(0);
});
