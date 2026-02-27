/* ============================================================
   SCRIPT.JS — Charitics
   ============================================================ */

/* NAV SCROLL */
window.addEventListener('scroll', function() {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
});

/* MOBILE MENU */
function openMobMenu() {
  document.getElementById('mobMenu').classList.add('open');
  document.getElementById('mobOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobMenu() {
  document.getElementById('mobMenu').classList.remove('open');
  document.getElementById('mobOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function toggleMobItem(el) {
  el.parentElement.classList.toggle('open');
}

/* DONATE AMOUNT */
function sA(btn, val) {
  document.querySelectorAll('.ambt').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById('damAmt').value = val;
}

/* ACCORDION */
function tA(header) {
  var item = header.parentElement;
  var body = header.nextElementSibling;
  var isOpen = item.classList.contains('op');
  document.querySelectorAll('.aci2').forEach(function(i) {
    i.classList.remove('op');
    var b = i.querySelector('.acb');
    if (b) b.style.display = 'none';
    var arrow = i.querySelector('.ach span:last-child');
    if (arrow) arrow.textContent = '→';
  });
  if (!isOpen) {
    item.classList.add('op');
    body.style.display = 'block';
    var arrow = header.querySelector('span:last-child');
    if (arrow) arrow.textContent = '↓';
  }
}

/* TEAM */
function activateCard(card) {
  document.querySelectorAll('.tcd').forEach(function(c){ c.classList.remove('act'); });
  card.classList.add('act');
}

/* STATS */
function showStat(el) {
  var bg = el.querySelector('.stc-bg');
  if (bg) bg.style.backgroundImage = 'url(' + el.dataset.img + ')';
  el.classList.add('img-on');
}
function hideStat(el) {
  el.classList.remove('img-on');
}

/* ══════════════════════════════════════════════════════════
   DONATIONS SLIDER — ALLER-RETOUR AUTOMATIQUE
   - Va de gauche à droite, puis droite à gauche, en boucle
   - La souris ne stoppe PAS l'animation
   ══════════════════════════════════════════════════════════ */
(function(){
  var track = document.getElementById('dtr');
  var dotsWrap = document.getElementById('dDots');
  if (!track) return;

  var current  = 0;
  var direction = 1;
  var timer    = null;

  function getCards() { return Array.from(track.querySelectorAll('.dca')); }

  function getVisible() {
    var w = window.innerWidth;
    if (w <= 480) return 1;
    if (w <= 700) return 2;
    if (w <= 1100) return 3;
    return 4;
  }

  /* Largeur réelle d'une carte (incluant gap) */
  function getCardWidth() {
    var dst = track.parentElement;
    var vis = getVisible();
    /* (largeur conteneur - gaps totaux) / nb visible + 1 gap */
    return (dst.offsetWidth - (vis - 1) * 20) / vis + 20;
  }

  function getMax() {
    return Math.max(0, getCards().length - getVisible());
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (var i = 0; i <= getMax(); i++) {
      var d = document.createElement('button');
      d.className = 'sdot' + (i === 0 ? ' on' : '');
      dotsWrap.appendChild(d);
    }
  }

  function updateDots() {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll('.sdot').forEach(function(d, i){
      d.classList.toggle('on', i === current);
    });
  }

  function slideTo(idx) {
    var max = getMax();
    current = Math.max(0, Math.min(idx, max));
    var moveX = current * getCardWidth();
    track.style.transition = 'transform .6s cubic-bezier(.25,.46,.45,.94)';
    track.style.transform  = 'translateX(-' + moveX + 'px)';
    updateDots();
  }

  function autoStep() {
    var max = getMax();
    if (current >= max) direction = -1;
    if (current <= 0)   direction =  1;
    slideTo(current + direction);
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(autoStep, 3000);
  }

  window.slD = function(dir) {
    slideTo(current + dir);
    startAuto();
  };

  buildDots();
  slideTo(0);
  startAuto();

  window.addEventListener('resize', function(){
    current = 0;
    direction = 1;
    buildDots();
    slideTo(0);
    startAuto();
  });
})();


/* ══════════════════════════════════════════════════════════
   BLOG SLIDER — ALLER-RETOUR AUTOMATIQUE
   - La souris ne stoppe PAS l'animation
   ══════════════════════════════════════════════════════════ */
(function(){
  var track = document.getElementById('bgt');
  if (!track) return;

  var bIdx = 0;
  var bDir = 1;
  var bTimer = null;
  var visible = 2;

  function getMax() {
    return track.querySelectorAll('.bgc').length - visible;
  }

  function slideTo(idx) {
    var max = getMax();
    bIdx = Math.max(0, Math.min(idx, max));
    var cardW = track.parentElement.offsetWidth / visible;
    track.style.transform = 'translateX(-' + (bIdx * (cardW + 24)) + 'px)';
  }

  function autoStep() {
    var max = getMax();
    if (bIdx >= max) bDir = -1;
    if (bIdx <= 0)   bDir =  1;
    slideTo(bIdx + bDir);
  }

  function startAuto() {
    clearInterval(bTimer);
    bTimer = setInterval(autoStep, 3500);
  }

  window.slB = function(dir) {
    slideTo(bIdx + dir);
    startAuto();
  };

  slideTo(0);
  startAuto();
})();