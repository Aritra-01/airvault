let currentPath = '';
let currentFiles = [];

const fileListEl = document.getElementById('file-list');
const breadcrumbEl = document.getElementById('breadcrumb');
const itemCountEl = document.getElementById('item-count');
const searchInput = document.getElementById('search-input');
const emptyStateEl = document.getElementById('empty-state');
const serverStatusEl = document.getElementById('server-status');

// Update server status with host
serverStatusEl.textContent = `Connected to ${window.location.host}`;

async function loadDirectory(path = '') {
  try {
    const res = await fetch(`/api/list?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error('Failed to load directory');
    const data = await res.json();
    currentPath = data.path;
    currentFiles = data.items;
    renderBreadcrumbs(currentPath);
    renderFiles(currentFiles);
  } catch (err) {
    console.error(err);
    alert('Error loading directory contents.');
  }
}

function renderBreadcrumbs(path) {
  breadcrumbEl.innerHTML = '';
  const parts = path ? path.split('/').filter(Boolean) : [];
  
  // Root home
  const rootBtn = document.createElement('button');
  rootBtn.className = 'text-gray-400 hover:text-white transition flex items-center gap-1 px-2 py-1 rounded hover:bg-dark-700';
  rootBtn.innerHTML = '<i class="fa-solid fa-house"></i> <span>Root</span>';
  rootBtn.onclick = () => loadDirectory('');
  breadcrumbEl.appendChild(rootBtn);

  let accumulated = '';
  parts.forEach((part, index) => {
    accumulated += (accumulated ? '/' : '') + part;
    const accPath = accumulated;

    const separator = document.createElement('span');
    separator.className = 'text-gray-600 px-1';
    separator.innerHTML = '/';
    breadcrumbEl.appendChild(separator);

    const partBtn = document.createElement('button');
    partBtn.className = 'text-gray-300 hover:text-white transition px-2 py-1 rounded hover:bg-dark-700 font-medium';
    partBtn.textContent = part;
    partBtn.onclick = () => loadDirectory(accPath);
    breadcrumbEl.appendChild(partBtn);
  });
}

function formatSize(bytes) {
  if (bytes === 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function formatDate(timestamp) {
  if (!timestamp) return '—';
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getFileIcon(name, isDir) {
  if (isDir) return '<i class="fa-solid fa-folder text-yellow-400 text-lg"></i>';
  const ext = name.split('.').pop().toLowerCase();
  if (['mp4', 'mkv', 'webm', 'mov', 'avi'].includes(ext)) return '<i class="fa-solid fa-file-video text-blue-400 text-lg"></i>';
  if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(ext)) return '<i class="fa-solid fa-file-audio text-purple-400 text-lg"></i>';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return '<i class="fa-solid fa-file-image text-green-400 text-lg"></i>';
  if (['pdf'].includes(ext)) return '<i class="fa-solid fa-file-pdf text-red-400 text-lg"></i>';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return '<i class="fa-solid fa-file-zipper text-yellow-600 text-lg"></i>';
  if (['txt', 'md', 'json', 'js', 'py', 'html', 'css'].includes(ext)) return '<i class="fa-solid fa-file-code text-cyan-400 text-lg"></i>';
  return '<i class="fa-solid fa-file text-gray-400 text-lg"></i>';
}

function renderFiles(files) {
  fileListEl.innerHTML = '';
  const query = searchInput.value.toLowerCase();
  const filtered = files.filter(f => f.name.toLowerCase().includes(query));

  itemCountEl.textContent = `${filtered.length} item${filtered.length === 1 ? '' : 's'}`;

  if (filtered.length === 0) {
    emptyStateEl.classList.remove('hidden');
    return;
  } else {
    emptyStateEl.classList.add('hidden');
  }

  filtered.forEach(file => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-dark-700/40 transition group';

    const icon = getFileIcon(file.name, file.is_dir);
    const sizeStr = file.is_dir ? `${file.item_count || '—'} items` : formatSize(file.size);
    const dateStr = formatDate(file.mtime);

    tr.innerHTML = `
      <td class="py-3 px-6 flex items-center gap-3 cursor-pointer">
        <div class="w-8 flex justify-center">${icon}</div>
        <span class="font-medium text-gray-200 group-hover:text-blue-400 transition truncate max-w-md">${file.name}</span>
      </td>
      <td class="py-3 px-4 text-gray-400 text-xs">${sizeStr}</td>
      <td class="py-3 px-4 text-gray-400 text-xs hidden md:table-cell">${dateStr}</td>
      <td class="py-3 px-6 text-right space-x-2">
        ${!file.is_dir ? `
          <button onclick="openMediaViewer('${file.path}', '${file.name}')" class="bg-dark-700 hover:bg-blue-600 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition inline-flex items-center gap-1.5" title="View / Play">
            <i class="fa-solid fa-play"></i> Play/View
          </button>
        ` : ''}
        <a href="/api/download?path=${encodeURIComponent(file.path)}" class="bg-dark-700 hover:bg-emerald-600 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition inline-flex items-center gap-1.5" title="Download">
          <i class="fa-solid fa-download"></i> Download
        </a>
      </td>
    `;

    if (file.is_dir) {
      tr.querySelector('td:first-child').onclick = () => loadDirectory(file.path);
    }

    fileListEl.appendChild(tr);
  });
}

searchInput.addEventListener('input', () => {
  renderFiles(currentFiles);
});

function refreshCurrentDir() {
  loadDirectory(currentPath);
}

// Modal Player / Viewer
const modal = document.getElementById('media-modal');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');
const modalDownloadBtn = document.getElementById('modal-download-btn');

function openMediaViewer(filePath, fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  const fileUrl = `/api/download?path=${encodeURIComponent(filePath)}`;
  
  modalDownloadBtn.href = fileUrl;
  modalTitle.textContent = fileName;
  modalContent.innerHTML = '';

  if (['mp4', 'mkv', 'webm', 'mov'].includes(ext)) {
    modalContent.innerHTML = `
      <video controls autoplay class="max-h-[75vh] max-w-full rounded-lg shadow-2xl">
        <source src="${fileUrl}" type="video/${ext === 'mkv' ? 'x-matroska' : ext}">
        Your browser does not support video playback.
      </video>
    `;
  } else if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(ext)) {
    modalContent.innerHTML = `
      <div class="bg-dark-800 p-8 rounded-2xl flex flex-col items-center gap-6 border border-gray-800 shadow-xl w-96">
        <div class="w-20 h-20 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center text-3xl">
          <i class="fa-solid fa-music"></i>
        </div>
        <div class="text-center">
          <h3 class="font-semibold text-white truncate max-w-xs">${fileName}</h3>
          <p class="text-xs text-gray-400 mt-1">Audio Stream</p>
        </div>
        <audio controls autoplay class="w-full">
          <source src="${fileUrl}">
          Your browser does not support audio playback.
        </audio>
      </div>
    `;
  } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
    modalContent.innerHTML = `
      <img src="${fileUrl}" alt="${fileName}" class="max-h-[75vh] max-w-full rounded-lg shadow-2xl object-contain">
    `;
  } else if (['txt', 'md', 'json', 'js', 'py', 'html', 'css', 'log'].includes(ext)) {
    fetch(fileUrl)
      .then(res => res.text())
      .then(text => {
        modalContent.innerHTML = `
          <pre class="bg-dark-800 text-gray-200 p-6 rounded-xl text-xs font-mono overflow-auto max-h-[70vh] w-full border border-gray-800">${escapeHtml(text)}</pre>
        `;
      })
      .catch(() => {
        modalContent.innerHTML = `<p class="text-red-400">Failed to load text file content.</p>`;
      });
  } else {
    modalContent.innerHTML = `
      <div class="text-center p-8 bg-dark-800 rounded-2xl border border-gray-800">
        <i class="fa-solid fa-file-arrow-down text-4xl text-blue-400 mb-3"></i>
        <p class="text-gray-300 font-medium mb-4">Direct preview not available for .${ext} files</p>
        <a href="${fileUrl}" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition inline-block">
          Download File
        </a>
      </div>
    `;
  }

  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
  modalContent.innerHTML = '';
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

// Load initial root directory
loadDirectory('');
