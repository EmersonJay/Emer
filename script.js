// Site nav: makes the "List of Outputs" dropdown tappable on touch/mobile,
// where CSS :hover / :focus-within alone isn't reliable.
document.addEventListener('DOMContentLoaded', function () {
  var hasSubItems = document.querySelectorAll('.site-nav li.has-sub');

  hasSubItems.forEach(function (item) {
    var link = item.querySelector(':scope > a');
    if (!link) return;

    // Add a small caret so it's clear this link opens a submenu.
    if (!link.querySelector('.caret')) {
      var caret = document.createElement('span');
      caret.className = 'caret';
      caret.textContent = '▾';
      caret.setAttribute('aria-hidden', 'true');
      link.appendChild(caret);
    }

    link.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');

    link.addEventListener('click', function (e) {
      var isMobile = window.matchMedia('(max-width: 720px)').matches;
      if (!isMobile) return; // let desktop hover handle it, and allow normal navigation

      e.preventDefault();
      var isOpen = item.classList.toggle('open');
      link.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  // Close any open dropdown when tapping/clicking outside the nav.
  document.addEventListener('click', function (e) {
    if (e.target.closest('.site-nav')) return;
    hasSubItems.forEach(function (item) {
      item.classList.remove('open');
      var link = item.querySelector(':scope > a');
      if (link) link.setAttribute('aria-expanded', 'false');
    });
  });
});

// Click-to-zoom lightbox for certificate and proof images.
document.addEventListener('DOMContentLoaded', function () {
  var images = document.querySelectorAll('.wrap img');
  if (!images.length) return;

  images.forEach(function (img) {
    img.addEventListener('click', function () {
      openLightbox(img.currentSrc || img.src, img.alt);
    });
  });

  function openLightbox(src, alt) {
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    var fullImg = document.createElement('img');
    fullImg.src = src;
    fullImg.alt = alt || '';

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '\u00D7';

    var hint = document.createElement('div');
    hint.className = 'lightbox-hint';
    hint.textContent = 'Click the image to zoom in / out \u00B7 click outside or press Esc to close';

    overlay.appendChild(fullImg);
    overlay.appendChild(closeBtn);
    overlay.appendChild(hint);
    document.body.appendChild(overlay);

    var scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = -scrollY + 'px';
    document.body.style.width = '100%';

    function closeLightbox() {
      overlay.remove();
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
      document.removeEventListener('keydown', onKeyDown);
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') closeLightbox();
    }

    fullImg.addEventListener('click', function (e) {
      e.stopPropagation();
      var isZoomed = fullImg.classList.toggle('is-zoomed');
      if (isZoomed) {
        var naturalWidth = fullImg.naturalWidth || fullImg.clientWidth;
        fullImg.style.width = naturalWidth + 'px';
        fullImg.style.height = 'auto';
      } else {
        fullImg.style.width = '';
        fullImg.style.height = '';
      }
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLightbox();
    });

    closeBtn.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', onKeyDown);
  }
});
