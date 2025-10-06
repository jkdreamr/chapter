const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Initialize data file if it doesn't exist
async function initDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify({}));
    }
}

// Get all statuses
app.get('/api/statuses', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading data:', error);
        res.status(500).json({ error: 'Failed to read data' });
    }
});

// Update a user's status
app.post('/api/status', async (req, res) => {
    try {
        const { name, status } = req.body;
        
        if (!name || !status) {
            return res.status(400).json({ error: 'Name and status are required' });
        }

        // Read current data
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const statuses = JSON.parse(data);
        
        // Update the status
        statuses[name] = status;
        
        // Write back to file
        await fs.writeFile(DATA_FILE, JSON.stringify(statuses, null, 2));
        
        res.json({ success: true, statuses });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// Delete a user's status
app.delete('/api/status/:name', async (req, res) => {
    try {
        const { name } = req.params;
        
        // Read current data
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const statuses = JSON.parse(data);
        
        // Delete the status
        delete statuses[name];
        
        // Write back to file
        await fs.writeFile(DATA_FILE, JSON.stringify(statuses, null, 2));
        
        res.json({ success: true, statuses });
    } catch (error) {
        console.error('Error deleting status:', error);
        res.status(500).json({ error: 'Failed to delete status' });
    }
});

// Start server
initDataFile().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Access the app at http://localhost:${PORT}`);
    });
});
