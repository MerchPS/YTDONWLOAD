document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('downloadForm');
    const urlInput = document.getElementById('youtubeUrl');
    const resultContainer = document.getElementById('result');
    const loadingScreen = document.getElementById('loadingScreen');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const youtubeUrl = urlInput.value.trim();

        if (!youtubeUrl) {
            alert('Masukkan URL YouTube terlebih dahulu!');
            return;
        }

        // Tampilkan loading screen
        loadingScreen.style.display = 'flex';

        try {
            const response = await fetch('https://ditzdevs-ytdl-api.hf.space/youtube', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: youtubeUrl })
            });

            if (!response.ok) throw new Error('Gagal mengambil data dari API.');

            const data = await response.json();

            // Sembunyikan loading screen
            loadingScreen.style.display = 'none';

            // Tampilkan judul video dan opsi format
            resultContainer.innerHTML = `
                <h2 class="text-xl font-bold">${data.title}</h2>
                <button id="downloadMp3" class="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">Download MP3</button>
                <button id="downloadMp4" class="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 ml-2">Download MP4</button>
            `;

            document.getElementById('downloadMp3').addEventListener('click', () => {
                window.open(data.download.mp3, '_blank');
            });

            document.getElementById('downloadMp4').addEventListener('click', () => {
                window.open(data.download.mp4, '_blank');
            });

        } catch (error) {
            loadingScreen.style.display = 'none';
            alert('Terjadi kesalahan: ' + error.message);
        }
    });
});
