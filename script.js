const GALLERY = [
  { src: 'assets/1 Other Side of the Road.jpg', alt: 'Other Side of the Road' },
  { src: 'assets/2 Above the Horizon.jpg', alt: 'Above the Horizon' },
  { src: 'assets/3 Sunset.jpg', alt: 'Sunset' },
  { src: 'assets/4 In Rainbow.jpg', alt: 'In Rainbow' },
];

(function () {
  const galleryEl = document.getElementById('gallery');
  const lightboxEl = document.getElementById('lightbox');
  const lightboxImg = lightboxEl.querySelector('.lightbox-image');
  const closeBtn = lightboxEl.querySelector('.lightbox-close');
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const yearEl = document.getElementById('year');

  let currentIndex = -1;
  let lastFocused = null;

  function normalize(item) {
    return typeof item === 'string' ? { src: item, alt: '' } : item;
  }

  function renderGallery() {
    if (!galleryEl) return;

    if (!Array.isArray(GALLERY) || GALLERY.length === 0) {
      galleryEl.innerHTML =
        '<p style="color:#6b7280;text-align:center">Add images to the GALLERY array in <code>script.js</code> and place files in <code>/assets</code>.</p>';
      return;
    }

    const frag = document.createDocumentFragment();

    GALLERY.map(normalize).forEach((item, index) => {
      const a = document.createElement('a');
      a.href = item.src;
      a.className = 'gallery-item';
      a.setAttribute('data-index', String(index));
      a.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index, a);
      });

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

      a.appendChild(img);
      frag.appendChild(a);
    });

    galleryEl.innerHTML = '';
    galleryEl.appendChild(frag);
  }

  function openLightbox(index, triggerEl) {
    currentIndex = index;
    lastFocused = triggerEl || document.activeElement;
    const item = normalize(GALLERY[currentIndex]);
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt || '';
    lightboxEl.classList.add('open');
    lightboxEl.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeLightbox() {
    lightboxEl.classList.remove('open');
    lightboxEl.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  function next(delta) {
    if (!Array.isArray(GALLERY) || GALLERY.length === 0) return;
    currentIndex = (currentIndex + delta + GALLERY.length) % GALLERY.length;
    const item = normalize(GALLERY[currentIndex]);
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt || '';
  }

  function onKeydown(e) {
    if (e.key === 'Escape') return closeLightbox();
    if (e.key === 'ArrowRight') return next(1);
    if (e.key === 'ArrowLeft') return next(-1);
  }

  lightboxEl.addEventListener('click', (e) => {
    if (e.target === lightboxEl) closeLightbox();
  });
  closeBtn.addEventListener('click', closeLightbox);

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navList.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navList.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGallery);
  } else {
    renderGallery();
  }
})();
