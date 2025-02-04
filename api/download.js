export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Metode tidak diizinkan' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL YouTube diperlukan!' });
    }

    try {
        const response = await fetch(`https://ditzdevs-ytdl-api.hf.space/api/download?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: data.error });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data dari API eksternal.' });
    }
}
