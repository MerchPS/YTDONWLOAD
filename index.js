async function fetchVideoInfo() {
    const urlInput = document.getElementById('yt-url').value;
    const loadingElement = document.getElementById('loading');
    const resultElement = document.getElementById('result');
    
    if (!urlInput) {
        alert('Please enter a YouTube URL');
        return;
    }
    
    loadingElement.classList.remove('hidden');
    resultElement.innerHTML = '';
    
    try {
        const response = await fetch('https://ytdonwload-git-main-merchps-projects.vercel.app/api/info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: urlInput })
        });
        
        const data = await response.json();
        loadingElement.classList.add('hidden');
        
        if (data.error) {
            resultElement.innerHTML = `<p class='text-red-500'>Error: ${data.error}</p>`;
            return;
        }
        
        resultElement.innerHTML = `
            <h2 class='text-xl font-bold text-blue-400'>${data.title}</h2>
            <button onclick="downloadMP3('${urlInput}')" class='bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded mt-2'>Download MP3</button>
            <button onclick="downloadMP4('${urlInput}')" class='bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded mt-2'>Download MP4</button>
        `;
    } catch (error) {
        loadingElement.classList.add('hidden');
        resultElement.innerHTML = `<p class='text-red-500'>Failed to fetch video info.</p>`;
    }
}

function downloadMP3(url) {
    window.location.href = `https://ytdonwload-git-main-merchps-projects.vercel.app/api/ytmp3?url=${encodeURIComponent(url)}`;
}

function downloadMP4(url) {
    window.location.href = `https://ytdonwload-git-main-merchps-projects.vercel.app/api/ytmp4?url=${encodeURIComponent(url)}&reso=720p`;
}
