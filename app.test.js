const request = require('supertest');
const { app, submissions } = require('./app');

describe('Assignment Submission API', () => {
    beforeEach(() => {
        submissions.length = 0;
    });

    test('POST /submit - should create a submission successfully', async () => {
        const payload = {
            name: 'Muhammad Saad',
            regNo: 'FA21-BCS-000',
            title: 'DevOps Assignment 1',
            url: 'https://github.com/example/repo'
        };

        const response = await request(app)
            .post('/submit')
            .send(payload);

        expect(response.status).toBe(201);
        expect(response.body.name).toBe(payload.name);
        expect(submissions.length).toBe(1);
    });

    test('POST /submit - should fail when required fields are missing', async () => {
        const payload = {
            name: 'Muhammad Saad',
            url: 'https://github.com/example/repo'
        };

        const response = await request(app)
            .post('/submit')
            .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Missing required fields');
    });

    test('POST /submit - should fail on malformed URL', async () => {
        const payload = {
            name: 'Alex Bhatti',
            regNo: 'FA21-BCS-000',
            title: 'DevOps Assignment 1',
            url: 'invalid-url-string'
        };

        const response = await request(app)
            .post('/submit')
            .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid submission URL');
    });

    test('GET /submissions - should fetch all recorded submissions', async () => {
        submissions.push({
            name: 'Muhammad Saad',
            regNo: 'FA21-BCS-000',
            title: 'DevOps Assignment 1',
            url: 'https://github.com/example/repo'
        });

        const response = await request(app).get('/submissions');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
    });
});
