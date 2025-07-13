const API_URL = 'https://script.google.com/macros/s/AKfycbwwZMXwHkXkqPeZAX9lpFP7paTOgXwgWIK9WiL6s9xiQ95hAFzCrMyZiSBE89KqHKmz/exec';


// Callback JSONP untuk load data
function handleSantri(data) {
  const list = document.getElementById('santriList');
  list.innerHTML = '';
  data.forEach(s => {
    const li = document.createElement('li');
    li.id = `item-${s.id}`;

    // Teks dasar
    li.innerHTML = `
      ${s.nama} (${s.kelas}) — status: <span class="status-${s.id}">${s.status || '-'}</span>
      &nbsp;
      <button class="btn-create">Hadir</button>
      <button class="btn-update">Ubah</button>
      <button class="btn-delete">Hapus</button>
    `;

    // Event handler Create (akan menambahkan row baru)
    li.querySelector('.btn-create').onclick = () => crudPresensi('create', s.id, 'hadir');

    // Event handler Update (prompt status baru)
    li.querySelector('.btn-update').onclick = () => {
      const newStatus = prompt('Masukkan status baru (hadir/izin/sakit/alpa):');
      if (newStatus) crudPresensi('update', s.id, newStatus);
    };

    // Event handler Delete
    li.querySelector('.btn-delete').onclick = () => {
      if (confirm('Yakin ingin menghapus presensi ID ' + s.id + '?')) {
        crudPresensi('delete', s.id);
      }
    };

    list.appendChild(li);
  });
}

// Fungsi umum untuk create/update/delete
function crudPresensi(action, id_santri, status) {
  const params = {
    action,
    id: id_santri,
    id_santri,
    tanggal: new Date().toISOString().split('T')[0],
    status: status || ''
  };

  // Bangun URL JSONP untuk GET (karena no‑cors POST tidak bisa dibaca responsnya)
  const qs = new URLSearchParams(params);
  const callbackName = `cb_${action}_${id_santri}_${Date.now()}`;
  params.callback = callbackName;

  // Definisikan fungsi callback dinamis
  window[callbackName] = function(res) {
    alert(`Presensi ${res.action} → ${res.status}`);
    // Jika update, update tampilan status
    if (res.status === 'updated') {
      document.querySelector(`.status-${id_santri}`).textContent = params.status;
    }
    // Jika deleted, hapus elemen dari DOM
    if (res.status === 'deleted') {
      const el = document.getElementById(`item-${id_santri}`);
      if (el) el.remove();
    }
    // Bersihkan callback dari global
    delete window[callbackName];
  };

  // Tambahkan callback ke query string
  qs.append('callback', callbackName);

  // Panggil via JSONP (script injection)
  const script = document.createElement('script');
  script.src = `${API_URL}?${qs.toString()}`;
  document.body.appendChild(script);
}

// Load data pertama kali
(function loadJSONP() {
  const script = document.createElement('script');
  script.src = `${API_URL}?callback=handleSantri`;
  document.body.appendChild(script);
})();
