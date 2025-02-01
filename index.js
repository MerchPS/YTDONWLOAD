document.addEventListener("DOMContentLoaded", () => {
    const debug = true; // Set ke false jika tidak ingin melihat log di halaman

    const inputUrl = document.getElementById("urlInput");
    const getInfoBtn = document.getElementById("getInfoBtn");
    const resultContainer = document.getElementById("result");
    const downloadBtn = document.getElementById("downloadBtn");
    const debugContainer = document.getElementById("debug"); // Untuk menampilkan debug info
    let downloadUrl = ""; // Akan menyimpan URL hasil dari API

    getInfoBtn.addEventListener("click", async () => {
        const videoUrl = inputUrl.value.trim();
        if (!videoUrl) {
            alert("Masukkan URL video terlebih dahulu!");
            return;
        }

        try {
            resultContainer.innerHTML = "<p>Loading...</p>";
            const response = await fetch("https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink", {
                method: "POST",
                headers: {
                    "x-rapidapi-key": "7de39da1f0msh27faaa990ff94d0p1e16c2jsn60b9ba7db702",
                    "x-rapidapi-host": "social-download-all-in-one.p.rapidapi.com",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url: videoUrl })
            });

            const data = await response.json();

            if (debug) {
                debugContainer.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            }

            if (!data || !data.result || !data.result[0]) {
                resultContainer.innerHTML = "<p>Gagal mendapatkan data video.</p>";
                return;
            }

            // Ambil data pertama (bisa disesuaikan jika ada banyak format)
            const videoData = data.result[0];
            downloadUrl = videoData.url;

            resultContainer.innerHTML = `
                <h3>${videoData.title || "Judul Tidak Tersedia"}</h3>
                <img src="${videoData.thumbnail || ""}" alt="Thumbnail" style="width:100%; max-width:400px; border-radius:10px;">
                <p>Format: ${videoData.type || "Tidak diketahui"}</p>
                <button id="startDownload">Download</button>
            `;

            // Event listener untuk download button
            document.getElementById("startDownload").addEventListener("click", startDownload);
        } catch (error) {
            console.error("Error:", error);
            resultContainer.innerHTML = "<p>Terjadi kesalahan. Coba lagi.</p>";
        }
    });

    function startDownload() {
        if (!downloadUrl) {
            alert("Tidak ada file untuk diunduh.");
            return;
        }

        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "video.mp4"; // Bisa diubah sesuai format file
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        alert("Sukses Mendownload!");
    }
});
