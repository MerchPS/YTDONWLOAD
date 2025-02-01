document.addEventListener("DOMContentLoaded", () => {
    const debug = true; // Aktifkan debug mode (ubah ke false jika tidak perlu)

    const inputUrl = document.getElementById("urlInput");
    const getInfoBtn = document.getElementById("getInfoBtn");
    const resultContainer = document.getElementById("result");
    const debugContainer = document.getElementById("debug");

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

            if (!data || data.error || !data.medias || data.medias.length === 0) {
                resultContainer.innerHTML = "<p>Gagal mendapatkan data video.</p>";
                return;
            }

            // Ambil informasi utama
            const videoTitle = data.title || "Judul Tidak Tersedia";
            const videoThumbnail = data.thumbnail || "";
            const mediaOptions = data.medias.map((media, index) => `
                <div>
                    <p><b>Format:</b> ${media.extension.toUpperCase()} (${media.quality || "Unknown"})</p>
                    <button class="downloadBtn" data-url="${media.url}">Download</button>
                </div>
            `).join("");

            resultContainer.innerHTML = `
                <h3>${videoTitle}</h3>
                <img src="${videoThumbnail}" alt="Thumbnail">
                ${mediaOptions}
            `;

            // Event listener tombol download
            document.querySelectorAll(".downloadBtn").forEach(button => {
                button.addEventListener("click", (event) => {
                    const downloadUrl = event.target.getAttribute("data-url");
                    startDownload(downloadUrl);
                });
            });

        } catch (error) {
            console.error("Error:", error);
            resultContainer.innerHTML = "<p>Terjadi kesalahan. Coba lagi.</p>";
        }
    });

    function startDownload(url) {
        if (!url) {
            alert("Tidak ada file untuk diunduh.");
            return;
        }

        window.open(url, "_blank"); // Membuka di tab baru untuk menghindari error 403

        alert("Download dimulai! Jika tidak berjalan, coba klik kanan > Save As.");
    }
});
