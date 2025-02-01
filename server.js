const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/info', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    
    try {
        const response = await axios.post('https://ditzdevs-ytdl-api.hf.space/api/info', { url });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch video info', details: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
