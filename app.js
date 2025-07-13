const API_URL = 'https://script.google.com/macros/s/AKfycbwwZMXwHkXkqPeZAX9lpFP7paTOgXwgWIK9WiL6s9xiQ95hAFzCrMyZiSBE89KqHKmz/exec';


// fungsi callback JSONP
function handleSantri(data) {
  const list = document.getElementById('santriList');
  list.innerHTML = '';
  data.forEach(s => {
    const li = document.createElement('li');
    li.textContent = `${s.nama} (${s.kelas}) `;
    const btn = document.createElement('button');
    btn.textContent = 'Hadir';
    btn.onclick = () => kirimPresensi(s.id, 'hadir');
    li.appendChild(btn);
    list.appendChild(li);
  });
}

// load data via JSONP
(function loadJSONP() {
  const script = document.createElement('script');
  script.src = `${API_URL}?callback=handleSantri`;
  script.onerror = () => {
    document.getElementById('santriList').textContent = 'Gagal memuat data santri.';
  };
  document.body.appendChild(script);
})();

// kirim presensi pakai no‑cors
function kirimPresensi(id_santri, status) {
  const tanggal = new Date().toISOString().split('T')[0];
  const payload = { id: Date.now(), id_santri, tanggal, status };
  const formBody = Object.entries(payload)
    .map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

  fetch(API_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody
  })
  .then(() => alert('Presensi berhasil dikirim!'))
  .catch(() => alert('Gagal mengirim presensi.'));
}
