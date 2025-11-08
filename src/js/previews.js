// src/js/previews.js

function ensureModal() {
  let modal = document.getElementById('modal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.id = 'modal';
  modal.style.cssText =
    'display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;';
  modal.innerHTML = `
    <div id="modal-card" style="max-width:900px;margin:5vh auto;background:#111;color:#fff;border-radius:12px;overflow:auto;max-height:90vh;">
      <div style="display:flex;justify-content:flex-end;padding:.5rem;">
        <button id="modal-close" style="font-size:18px;background:#222;color:#fff;border:0;padding:.25rem .5rem;border-radius:8px;cursor:pointer">✕</button>
      </div>
      <div id="modal-body" style="padding:0 1rem 1rem;"></div>
    </div>`;
  document.body.appendChild(modal);
  modal.querySelector('#modal-close').addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    modal.querySelector('#modal-body').innerHTML = '';
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.querySelector('#modal-close').click();
  });
  return modal;
}

function stripTags(html) {
  const el = document.createElement('div');
  el.innerHTML = html || '';
  return el.textContent || el.innerText || '';
}

fetch('/api/ingest')
  .then((r) => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  })
  .then((data) => {
    const list = document.getElementById('coindesk-articles');
    const items = Array.isArray(data) ? data : data.items || [];
    list.innerHTML = '';

    const modal = ensureModal();
    const modalBody = modal.querySelector('#modal-body');

    items.forEach((article, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'article';

      const h3 = document.createElement('h3');
      h3.textContent = article.title || 'No title';

      const p = document.createElement('p');
      p.textContent = stripTags(article.preview || '').slice(0, 220) + '…';

      const btn = document.createElement('button');
      btn.textContent = 'Read Full Article';
      btn.className = 'read-full-link';
      btn.addEventListener('click', () => {
        modalBody.innerHTML = `
          <h2 style="margin:0 0 .5rem 0">${article.title || ''}</h2>
          <div style="line-height:1.6">${article.preview || ''}</div>
          <p style="margin-top:1rem"><a href="${article.link || '#'}" target="_blank" rel="noopener">Original ↗</a></p>
        `;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      });

      wrap.append(h3, p, btn);
      list.appendChild(wrap);
    });
  })
  .catch((err) => {
    const list = document.getElementById('coindesk-articles');
    list.innerHTML = `<p class="error-message">Failed to load articles (${err}).</p>`;
  });

