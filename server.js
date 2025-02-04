const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('downloads'));

app.post('/download', (req, res) => {
    const videoUrl = req.body.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL YouTube diperlukan!' });
    }

    // Folder untuk menyimpan file hasil download
    const downloadPath = path.join(__dirname, 'downloads');
    if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath);
    }

    // Jalankan perintah yt-dlp untuk download audio
    const command = `yt-dlp -x --audio-format mp3 -o "${downloadPath}/%(title)s.%(ext)s" ${videoUrl}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ error: 'Gagal mendownload video.' });
        }

        if (stderr) {
            console.error(`Stderr: ${stderr}`);
        }

        console.log(`Stdout: ${stdout}`);

        // Ambil nama file dari output yt-dlp
        const match = stdout.match(/Destination:\s(.+\.mp3)/);
        if (match) {
            const filename = path.basename(match[1]);
            const fileUrl = `http://localhost:${PORT}/${filename}`;
            res.json({ message: 'Download berhasil!', downloadUrl: fileUrl });
        } else {
            res.status(500).json({ error: 'Gagal menemukan file hasil download.' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
