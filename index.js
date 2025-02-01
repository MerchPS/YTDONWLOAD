document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('fetch-info').addEventListener('click', fetchVideoInfo);
});

async function fetchVideoInfo() {
    const urlInput = document.getElementById('yt-url').value;
    const loadingElement = document.getElementById('loading');
    const resultElement = document.getElementById('result');

    if (!urlInput) {
        alert('Silakan masukkan URL YouTube');
        return;
    }

    loadingElement.classList.remove('hidden');
    resultElement.innerHTML = '';

    try {
        let response = await fetch(`https://ditzdevs-ytdl-api.hf.space/api/info?url=${encodeURIComponent(urlInput)}`);

        if (!response.ok) {
            response = await fetch('https://ditzdevs-ytdl-api.hf.space/api/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: urlInput })
            });
        }

        const data = await response.json();
        loadingElement.classList.add('hidden');

        if (data.error) {
            resultElement.innerHTML = `<p class='text-red-500'>Error: ${data.error}</p>`;
            return;
        }

        const title = data.title || "Judul tidak ditemukan";
        const thumbnailUrl = data.thumbnail ? data.thumbnail[0].url : '';

        resultElement.innerHTML = `
            <h2 class='text-xl font-bold text-blue-400'>${title}</h2>
            <img src="${thumbnailUrl}" class="thumbnail"/>
            <button onclick="downloadMP3('${urlInput}')" class='btn-green'>Download MP3</button>
            <button onclick="downloadMP4('${urlInput}')" class='btn-yellow'>Download MP4</button>
        `;
    } catch (error) {
        loadingElement.classList.add('hidden');
        resultElement.innerHTML = `<p class='text-red-500'>Gagal mengambil info video.</p>`;
    }
}

async function downloadMP3(url) {
    try {
        const response = await fetch(`https://ditzdevs-ytdl-api.hf.space/api/ytmp3?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.status && data.download && data.download.downloadUrl) {
            const downloadLink = document.createElement("a");
            downloadLink.href = data.download.downloadUrl;
            downloadLink.download = `${data.download.title}.mp3`; 
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            setTimeout(() => {
                alert("✅ Sukses mendownload MP3!");
            }, 500);
        } else {
            alert("❌ Gagal mendapatkan link MP3.");
        }
    } catch (error) {
        alert("❌ Error saat mengunduh MP3.");
    }
}

async function downloadMP4(url) {
    try {
        const response = await fetch(`https://ditzdevs-ytdl-api.hf.space/api/ytmp4?url=${encodeURIComponent(url)}&reso=720p`);
        const data = await response.json();

        if (data.status && data.download && data.download.downloadUrl) {
            const downloadLink = document.createElement("a");
            downloadLink.href = data.download.downloadUrl;
            downloadLink.download = `${data.download.title}.mp4`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            setTimeout(() => {
                alert("✅ Sukses mendownload MP4!");
            }, 500);
        } else {
            alert("❌ Gagal mendapatkan link MP4.");
        }
    } catch (error) {
        alert("❌ Error saat mengunduh MP4.");
    }
}
