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
            const response = await fetch('http://localhost:3000/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: youtubeUrl })
            });

            if (!response.ok) throw new Error('Gagal mendownload video.');

            const data = await response.json();

            // Sembunyikan loading screen
            loadingScreen.style.display = 'none';

            // Tampilkan link download
            resultContainer.innerHTML = `
                <h2 class="text-xl font-bold">Download Berhasil!</h2>
                <a href="${data.downloadUrl}" class="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 inline-block" download>Download MP3</a>
            `;
        } catch (error) {
            loadingScreen.style.display = 'none';
            alert('Terjadi kesalahan: ' + error.message);
        }
    });
});
