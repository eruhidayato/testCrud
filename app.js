const API_URL = 'https://script.google.com/macros/s/AKfycbwwZMXwHkXkqPeZAX9lpFP7paTOgXwgWIK9WiL6s9xiQ95hAFzCrMyZiSBE89KqHKmz/exec';

// Ambil data santri (GET)
fetch(API_URL)
  .then(res => res.text())
  .then(text => {
    // Karena Google Apps Script mengembalikan string via document.write,
    // kita bisa treat response sebagai JSON string
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      document.getElementById("santriList").innerHTML = "Gagal memuat data santri.";
      return;
    }

    const list = document.getElementById('santriList');
    list.innerHTML = ""; // Kosongkan list

    json.forEach(santri => {
      const li = document.createElement('li');
      li.textContent = `${santri.nama} (${santri.kelas}) `;

      const btn = document.createElement('button');
      btn.textContent = 'Hadir';
      btn.onclick = () => kirimPresensi(santri.id, 'hadir');
      li.appendChild(btn);

      list.appendChild(li);
    });
  })
  .catch(err => {
    document.getElementById("santriList").innerHTML = "Gagal memuat data. Periksa koneksi.";
    console.error("Fetch error:", err);
  });

// Kirim data presensi (POST)
function kirimPresensi(id_santri, status) {
  const tanggal = new Date().toISOString().split('T')[0];
  const payload = {
    id: Date.now(),
    id_santri,
    tanggal,
    status
  };

  // Kirim sebagai form URL-encoded untuk menghindari CORS preflight
  const formBody = Object.keys(payload)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key]))
    .join('&');

  fetch(API_URL, {
    method: 'POST',
    body: formBody,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'  // hindari preflight
    },
    mode: 'no-cors' // jangan tunggu respon dari server
  })
  .then(() => alert('Presensi berhasil dikirim!'))
  .catch(err => {
    console.error("POST error:", err);
    alert('Gagal mengirim presensi.');
  });
}
