require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });
const port = process.env.PORT || 3001;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  };
  
  const pool = mysql.createPool(dbConfig);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
  

// Test the connection and log table data
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Database connected successfully");

        // Query the database and log the results
        const [rows] = await connection.query('SELECT * FROM m4_qa_sample LIMIT 1');
        console.log('Sample data from m4_qa_sample:', rows);

        connection.release();
    } catch (err) {
        console.error("Database connection failed:", err);
    }
})();

app.get('/available-modules', async function(req, res) {
    try {
      const query = 'SELECT DISTINCT Module FROM m4_qa_sample';
      const [modules] = await pool.query(query);
      res.json(modules.map(m => m.Module));
    } catch (error) {
      console.error('Error fetching available modules:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });

app.get('/qa-questions', async function(req, res) {
    try {
        const { modules } = req.query;
        const selectedModules = modules ? modules.split(',') : [];

        let query = `
            SELECT id, Question AS question, AnswerSection AS answer, Module AS module
            FROM m4_qa_sample
        `;

        const queryParams = [];

        if (selectedModules.length > 0) {
            query += ` WHERE Module IN (${selectedModules.map(() => '?').join(',')})`;
            queryParams.push(...selectedModules);
        }

        query += ' ORDER BY RAND()';

        console.log('Executing query:', query, 'with params:', queryParams);

        const [questions] = await pool.query(query, queryParams);
        console.log('Fetched questions:', questions.length);

        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/filtered-questions', async function(req, res) {
    try {
        const { modules, seen, unseen, correct, incorrect } = req.query;
        const selectedModules = modules ? modules.split(',') : [];

        console.log('Received filters:', { modules, seen, unseen, correct, incorrect });

        let query = `
            SELECT DISTINCT m.id, m.Question AS question, m.AnswerSection AS answer, m.Module AS module,
                   IFNULL(u.status, 'unseen') AS status, u.result
            FROM m4_qa_sample m
            LEFT JOIN user_qa_responses_all u ON m.id = u.id
            WHERE 1=1
        `;

        const queryParams = [];
        const conditions = [];

        // Module filtering
        if (selectedModules.length > 0) {
            conditions.push(`m.Module IN (${selectedModules.map(() => '?').join(',')})`);
            queryParams.push(...selectedModules);
        }

        // Existing logic for seen/unseen and correct/incorrect
        const statusConditions = [];
        if (seen === 'true') {
            if (correct === 'true' && incorrect !== 'true') {
                statusConditions.push(`(u.status = 'seen' AND u.result = 'correct')`);
            } else if (incorrect === 'true' && correct !== 'true') {
                statusConditions.push(`(u.status = 'seen' AND u.result = 'incorrect')`);
            } else {
                statusConditions.push(`u.status = 'seen'`);
            }
        } else if (unseen === 'true') {
            statusConditions.push(`(u.id IS NULL OR u.status = 'unseen')`);
        }

        if (statusConditions.length > 0) {
            conditions.push(`(${statusConditions.join(' OR ')})`);
        }

        if (conditions.length > 0) {
            query += ` AND ${conditions.join(' AND ')}`;
        }

        query += ' ORDER BY RAND()';

        console.log('Executing query:', query);
        console.log('Query parameters:', queryParams);

        const [questions] = await pool.query(query, queryParams);
        console.log('Fetched filtered questions:', questions.length);
        console.log('Sample of fetched questions:', JSON.stringify(questions.slice(0, 3), null, 2));

        res.json(questions);
    } catch (error) {
        console.error('Error fetching filtered questions:', error);
        res.status(500).json({ error: 'Internal server error', stack: error.stack });
    }
});
  

app.post('/save-result', async function(req, res) {
    const { id, question, answer, module, result, status } = req.body;

    try {
        // Save or update in the "all" table
        const allQuery = `
            INSERT INTO user_qa_responses_all (id, question, answer, module, result, status)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE result = VALUES(result), status = VALUES(status);
        `;
        await pool.query(allQuery, [id, question, answer, module, result, status]);

        // Save or update in the "session" table
        const sessionQuery = `
            INSERT INTO user_qa_responses_session (id, question, answer, module, result, status)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE result = VALUES(result), status = VALUES(status);
        `;
        await pool.query(sessionQuery, [id, question, answer, module, result, status]);

        res.status(200).json({ message: 'Result saved or updated successfully in both tables' });
    } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

app.post('/clear-session', async function(req, res) {
    try {
        await pool.query(`TRUNCATE TABLE user_qa_responses_session`);
        res.status(200).json({ message: 'Session data cleared' });
    } catch (error) {
        console.error('Error clearing session data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/session-metrics', async function(req, res) {
    try {
        const [unseenCount] = await pool.query(`
            SELECT COUNT(*) AS count FROM user_qa_responses_session WHERE status = 'unseen';
        `);
        const [correctCount] = await pool.query(`
            SELECT COUNT(*) AS count FROM user_qa_responses_session WHERE result = 'correct';
        `);
        const [incorrectCount] = await pool.query(`
            SELECT COUNT(*) AS count FROM user_qa_responses_session WHERE result = 'incorrect';
        `);

        res.json({
            unseen: unseenCount[0].count,
            correct: correctCount[0].count,
            incorrect: incorrectCount[0].count
        });
    } catch (error) {
        console.error('Error fetching session metrics:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

  
if (process.env.NODE_ENV === 'production') {
    console.log('Running in production mode');
    const buildPath = path.join(__dirname, '../build');
    
    // Log build directory contents
    try {
        const buildContents = fs.readdirSync(buildPath);
        console.log('Build directory contents:', buildContents);
        
        if (fs.existsSync(path.join(buildPath, 'static'))) {
            const staticContents = fs.readdirSync(path.join(buildPath, 'static'));
            console.log('Static directory contents:', staticContents);
        }
    } catch (err) {
        console.error('Error reading build directory:', err);
    }

    // Serve static files with proper MIME types
    app.use('/static', express.static(path.join(buildPath, 'static'), {
        setHeaders: (res, path) => {
            if (path.endsWith('.js')) {
                res.setHeader('Content-Type', 'application/javascript');
            } else if (path.endsWith('.css')) {
                res.setHeader('Content-Type', 'text/css');
            }
        }
    }));

    // Serve other static files
    app.use(express.static(buildPath));

    // Handle React routing
    app.get('*', (req, res, next) => {
        if (req.url.startsWith('/static/')) {
            next();
        } else {
            console.log('Serving index.html for path:', req.path);
            res.sendFile(path.join(buildPath, 'index.html'));
        }
    });
}

app.listen(port, () => {
console.log(`Server running on port ${port}`);
console.log('Node environment:', process.env.NODE_ENV);
console.log('Current directory:', __dirname);
});