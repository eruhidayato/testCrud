const API_URL = 'https://script.google.com/macros/s/AKfycbwwZMXwHkXkqPeZAX9lpFP7paTOgXwgWIK9WiL6s9xiQ95hAFzCrMyZiSBE89KqHKmz/exec';

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('santriList');
    data.forEach(santri => {
      const li = document.createElement('li');
      li.textContent = `${santri.nama} (${santri.kelas}) `;
      const btn = document.createElement('button');
      btn.textContent = 'Hadir';
      btn.onclick = () => kirimPresensi(santri.id, 'hadir');
      li.appendChild(btn);
      list.appendChild(li);
    });
  });

function kirimPresensi(id_santri, status) {
  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      id: Date.now(),
      id_santri,
      tanggal: new Date().toISOString().split('T')[0],
      status
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => alert('Presensi tersimpan'));
}
