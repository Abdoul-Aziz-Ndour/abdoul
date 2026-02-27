/* ============================================================
   CHARITICS - script.js
   Contient TOUT le JavaScript du site
   ============================================================ */


/* ════════════════════════════════════════════════════════════
   1. HAMBURGER — Ouvre/ferme le menu mobile
════════════════════════════════════════════════════════════ */
const ham     = document.getElementById('ham');       // Bouton ☰
const navList = document.getElementById('navList');   // Le menu ul

ham.addEventListener('click', function () {
  ham.classList.toggle('open');       // Anime ☰ → ✕
  navList.classList.toggle('open');   // Fait glisser le panneau
  document.body.style.overflow = navList.classList.contains('open') ? 'hidden' : ''; // Bloque le scroll du body quand menu ouvert
});

// Ferme le menu si on clique en dehors
document.addEventListener('click', function (e) {
  if (!ham.contains(e.target) && !navList.contains(e.target)) {
    ham.classList.remove('open');
    navList.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Dropdowns dans le menu mobile : clic sur un nav-item avec dropdown
document.querySelectorAll('.nav-item').forEach(function (item) {
  const link = item.querySelector('.nav-link');
  const drop = item.querySelector('.dropdown');
  if (!drop) return; // Pas de dropdown → on skip

  link.addEventListener('click', function (e) {
    // Seulement en mode mobile (hamburger visible)
    if (ham.style.display !== 'none' && getComputedStyle(ham).display !== 'none') {
      e.preventDefault();               // Empêche la navigation
      item.classList.toggle('mo');      // .mo = dropdown ouvert en mobile
    }
  });
});


/* ════════════════════════════════════════════════════════════
   2. ACCORDION — Section "Why Join"
   Ouvre un item et ferme les autres
════════════════════════════════════════════════════════════ */
function accToggle(head) {
  const body     = head.nextElementSibling;   // Le .acc-b juste après
  const isOpen   = head.classList.contains('open');

  // Ferme TOUS les accordéons
  document.querySelectorAll('.acc-h').forEach(function (h) {
    h.classList.remove('open');
    h.nextElementSibling.classList.remove('show');
  });

  // Si l'item cliqué était fermé → on l'ouvre
  if (!isOpen) {
    head.classList.add('open');
    body.classList.add('show');
  }
}


/* ════════════════════════════════════════════════════════════
   3. BOUTONS DE MONTANT — Section formulaire de don
════════════════════════════════════════════════════════════ */
function selAmt(btn) {
  // Retire .active de tous les boutons
  document.querySelectorAll('.amt-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  // Ajoute .active sur le bouton cliqué
  btn.classList.add('active');
}


/* ════════════════════════════════════════════════════════════
   4. SCROLL REVEAL — Anime les éléments à l'entrée dans l'écran
   Les classes .rv .rvl .rvr sont rendues visibles avec .in
════════════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');         // Rend visible
      revealObserver.unobserve(entry.target);   // Arrête d'observer (1 fois suffit)
    }
  });
}, { threshold: 0.12 }); // Se déclenche quand 12% de l'élément est visible

document.querySelectorAll('.rv, .rvl, .rvr').forEach(function (el) {
  revealObserver.observe(el);
});


/* ════════════════════════════════════════════════════════════
   5. BARRES DE PROGRESSION — Donations & Formulaire de don
   Anime la largeur de 0% → valeur cible (data-w)
════════════════════════════════════════════════════════════ */
const barObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      const bar = entry.target;
      bar.style.width = bar.dataset.w || '70%';   // data-w="83%" par exemple
      barObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.bar, #dpBar').forEach(function (bar) {
  bar.style.width = '0%'; // Part de 0
  barObserver.observe(bar);
});


/* ════════════════════════════════════════════════════════════
   6. CERCLES SVG — Stats (stroke-dashoffset animé)
   data-pct="87" → 87% du cercle est rempli
════════════════════════════════════════════════════════════ */
const circleObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-circle-fill').forEach(function (circle) {
        const pct    = parseFloat(circle.dataset.pct) / 100;  // ex: 87 → 0.87
        const total  = 245;                                    // stroke-dasharray
        circle.style.strokeDashoffset = total - (total * pct); // Remplit le cercle
      });
      circleObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-bx').forEach(function (bx) {
  circleObserver.observe(bx);
});


/* ════════════════════════════════════════════════════════════
   7. COMPTEURS ANIMÉS — Bandeau sombre (260+, 110+, etc.)
   Compte de 0 jusqu'au chiffre cible
════════════════════════════════════════════════════════════ */
const counterTargets = {
  c1: 260,   // Total Happy Children
  c2: 110,   // Total Volunteers
  c3: 190,   // Products & Gifts
  c4: 560,   // Worldwide Donors
  s1: 260,   // Stat circle 1
  s2: 110,   // Stat circle 2
  s3: 190,   // Stat circle 3
  s4: 560    // Stat circle 4
};

function animateCounter(el, target) {
  let current  = 0;
  const step   = Math.ceil(target / 60);   // 60 étapes environ
  const timer  = setInterval(function () {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current;
  }, 20); // 20ms entre chaque étape → ~1.2 secondes au total
}

const counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      Object.keys(counterTargets).forEach(function (id) {
        const el = document.getElementById(id);
        if (el) animateCounter(el, counterTargets[id]);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const ctrBanner = document.querySelector('.ctr-banner');
if (ctrBanner) counterObserver.observe(ctrBanner);

const dfSec = document.querySelector('.df-sec');
if (dfSec) counterObserver.observe(dfSec);


/* ════════════════════════════════════════════════════════════
   8. BOUTON RETOUR EN HAUT — Apparaît après 300px de scroll
════════════════════════════════════════════════════════════ */
const backT = document.getElementById('backT');

window.addEventListener('scroll', function () {
  if (window.scrollY > 300) {
    backT.classList.add('show');    // Affiche le bouton
  } else {
    backT.classList.remove('show'); // Cache le bouton
  }
});


/* ════════════════════════════════════════════════════════════
   9. SLIDER DONATIONS — Boutons de pagination (points)
════════════════════════════════════════════════════════════ */
const dots      = document.querySelectorAll('.sl-dot');
const donSlider = document.getElementById('donSlider');

if (donSlider && dots.length) {
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      const index = parseInt(dot.dataset.i);         // 0 ou 1
      const cards = donSlider.querySelectorAll('.don-card');
      const cardW = cards[0] ? cards[0].offsetWidth + 20 : 0; // largeur + gap

      // Déplace le slider
      donSlider.style.transform = 'translateX(-' + (index * cardW * 2) + 'px)';
      donSlider.style.transition = 'transform .5s ease';

      // Met à jour les points actifs
      dots.forEach(function (d) { d.classList.remove('active'); });
      dot.classList.add('active');
    });
  });
}


/* ════════════════════════════════════════════════════════════
   10. NAVBAR — Ombre renforcée au scroll
════════════════════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function () {
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,.13)';
  } else {
    navbar.style.boxShadow = '0 2px 18px rgba(0,0,0,.07)';
  }
});


/* ════════════════════════════════════════════════════════════
   11. BOUTON RECHERCHE — Ouvre/ferme l'overlay de recherche
════════════════════════════════════════════════════════════ */
const searchBtn     = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose   = document.getElementById('searchClose');
const searchInput   = document.getElementById('searchInput');

// Ouvre l'overlay
searchBtn.addEventListener('click', function () {
  searchOverlay.classList.add('open');
  setTimeout(function () { searchInput.focus(); }, 300);
});

// Ferme avec le bouton ✕
searchClose.addEventListener('click', function () {
  searchOverlay.classList.remove('open');
  searchInput.value = '';
});

// Ferme en appuyant sur Échap
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    searchOverlay.classList.remove('open');
    searchInput.value = '';
  }
});

// Ferme en cliquant sur le fond sombre (pas sur la box)
searchOverlay.addEventListener('click', function (e) {
  if (e.target === searchOverlay) {
    searchOverlay.classList.remove('open');
    searchInput.value = '';
  }
});