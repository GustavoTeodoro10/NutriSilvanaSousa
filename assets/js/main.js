/* ==========================================================================
   Nutricionista Silvana Sousa — comportamento e movimento
   JS puro, sem build. Bibliotecas externas: apenas Lenis (opcional, só desktop).
   ========================================================================== */
(() => {
  'use strict';

  /* ---------- Configuração (edite aqui) ---------- */
  const CONFIG = {
    WHATSAPP: '5511989300356',
    // Google Analytics 4: troque pelo ID real (ex.: 'G-ABC123XYZ'). Enquanto tiver "XXXX", nada é enviado.
    GA_MEASUREMENT_ID: 'G-XXXXXXXXXX',
    // Meta Pixel (opcional): coloque o ID numérico entre aspas. Vazio = desligado.
    META_PIXEL_ID: '',
    TIMEZONE: 'America/Sao_Paulo'
  };

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isWide = () => innerWidth >= 1024;
  const isConfigured = (v) => Boolean(v) && !/X{4,}/i.test(v);

  /* ---------- Analytics / Pixel ---------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  if (isConfigured(CONFIG.GA_MEASUREMENT_ID)) {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(CONFIG.GA_MEASUREMENT_ID);
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', CONFIG.GA_MEASUREMENT_ID);
  }
  if (isConfigured(CONFIG.META_PIXEL_ID)) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', CONFIG.META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
  function track(name, params) {
    try {
      gtag('event', name, params);
      if (window.fbq) window.fbq('track', 'Contact', params);
    } catch (_) { /* rastreio nunca deve quebrar o site */ }
  }

  /* ---------- WhatsApp: mensagem contextual por CTA ---------- */
  $$('[data-wa]').forEach((a) => {
    const message = a.dataset.wa;
    a.href = 'https://wa.me/' + CONFIG.WHATSAPP + '?text=' + encodeURIComponent(message);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.addEventListener('click', () => {
      const host = a.closest('section[id], footer, header, .fab');
      const section = (host && (host.id || host.tagName.toLowerCase())) || 'pagina';
      track('generate_lead', { method: 'whatsapp', section: section, message: message });
    });
  });

  /* ---------- Lenis: rolagem com inércia (só desktop, sem reduzir movimento) ---------- */
  let lenis = null;
  function loadScript(src, onload) {
    const s = document.createElement('script');
    s.src = src; s.async = true; s.onload = onload; s.onerror = () => {};
    document.head.appendChild(s);
  }
  if (finePointer && !reduce && isWide()) {
    loadScript('https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js', () => {
      if (!window.Lenis) return;
      lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
      html.classList.add('lenis', 'lenis-smooth');
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    });
  }

  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = $(id);
    if (!target) return;
    e.preventDefault();
    scrollToTarget(id === '#inicio' ? document.body : target);
    history.replaceState(null, '', id);
  });

  /* ---------- Menu mobile ---------- */
  const burger = $('#burger');
  const menu = $('#menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    html.classList.toggle('menu-open', open);
    if (lenis) (open ? lenis.stop() : lenis.start());
  }
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  addEventListener('resize', () => { if (isWide()) setMenu(false); });

  /* ---------- Entrada do hero (momento orquestrado) ---------- */
  const heroWrap = $('[data-hero]');
  let heroStarted = false;
  function startHero() {
    if (heroStarted) return;
    heroStarted = true;
    requestAnimationFrame(() => {
      heroWrap.classList.add('is-loaded');
      // libera o hover normal dos elementos depois que a entrada terminou
      setTimeout(() => $$('.hero-fade').forEach((el) => { el.classList.remove('hero-fade'); el.style.removeProperty('--i'); }), 3200);
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(startHero);
  setTimeout(startHero, 1400);

  /* ---------- Reveal ao rolar (IntersectionObserver) ---------- */
  const revealTargets = $$('[data-reveal], [data-stars], [data-steps], .sprouts');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Contador da nota (5,0) ---------- */
  const fmt = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  function runCount(el) {
    const target = parseFloat(el.dataset.count);
    if (Number.isNaN(target) || reduce) return;
    const start = performance.now();
    const dur = 1500;
    (function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt.format(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }
  if ('IntersectionObserver' in window) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        countIO.unobserve(el);
        setTimeout(() => runCount(el), el.closest('.hero') ? 1000 : 250);
      });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach((el) => countIO.observe(el));
  }

  /* ---------- Trepadeira: cresce com a rolagem ---------- */
  const vine = $('#vine');
  const NS = 'http://www.w3.org/2000/svg';
  const vineState = { stem: null, bud: null, leaves: [], len: 0, path: null };

  function buildVine() {
    if (!vine) return;
    const H = innerHeight;
    const W = vine.getBoundingClientRect().width || 40;
    vine.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    vine.innerHTML = '';

    const cx = W * 0.6;
    const amp = Math.min(11, W * 0.17);
    const seg = 160;
    let d = 'M' + cx + ' -6';
    let y = -6, dir = 1;
    while (y < H + seg) {
      const ny = y + seg;
      d += ' C ' + (cx + amp * dir) + ' ' + (y + seg * 0.35) + ', ' + (cx - amp * dir) + ' ' + (y + seg * 0.65) + ', ' + cx + ' ' + ny;
      y = ny; dir *= -1;
    }
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'stem');
    vine.appendChild(path);
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;

    const leaves = [];
    const gap = 78;
    let side = 1, i = 0;
    for (let l = 46; l < len - 30; l += gap, i++) {
      const p1 = path.getPointAtLength(l);
      const p2 = path.getPointAtLength(l + 3);
      const tan = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
      const angle = tan - side * 48 + Math.sin(i * 2.3) * 9;
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('transform', 'translate(' + p1.x.toFixed(1) + ' ' + p1.y.toFixed(1) + ') rotate(' + angle.toFixed(1) + ')');
      const leaf = document.createElementNS(NS, 'path');
      leaf.setAttribute('class', 'leaf');
      leaf.setAttribute('d', 'M0 0C5-7 17-8 27 0C17 8 5 7 0 0Z');
      leaf.style.setProperty('--s', (0.78 + ((i * 37) % 30) / 100).toFixed(2));
      g.appendChild(leaf);
      vine.appendChild(g);
      leaves.push({ el: leaf, at: l });
      side *= -1;
    }
    const bud = document.createElementNS(NS, 'circle');
    bud.setAttribute('class', 'bud');
    bud.setAttribute('r', '3.6');
    vine.appendChild(bud);

    Object.assign(vineState, { stem: path, bud: bud, leaves: leaves, len: len, path: path });
  }

  function updateVine() {
    const s = vineState;
    if (!s.path) return;
    const max = Math.max(1, html.scrollHeight - innerHeight);
    const p = reduce ? 1 : Math.min(1, Math.max(0, scrollY / max));
    const drawn = s.len * (0.17 + 0.83 * p);
    s.stem.style.strokeDashoffset = s.len - drawn;
    s.leaves.forEach((lf) => lf.el.classList.toggle('on', lf.at <= drawn));
    const pt = s.path.getPointAtLength(drawn);
    s.bud.setAttribute('cx', pt.x);
    s.bud.setAttribute('cy', pt.y);
  }

  /* ---------- Loop de scroll: nav, trepadeira, parallax ---------- */
  const nav = $('#nav');
  const parallaxEls = $$('[data-parallax]');
  let ticking = false;

  function frame() {
    ticking = false;
    nav.classList.toggle('is-scrolled', scrollY > 40);
    updateVine();
    if (!reduce && isWide()) {
      const vh = innerHeight;
      parallaxEls.forEach((img) => {
        const host = img.parentElement.getBoundingClientRect();
        if (host.bottom < -100 || host.top > vh + 100) return;
        const speed = parseFloat(img.dataset.parallax) || 0.05;
        const offset = (host.top + host.height / 2 - vh / 2) * -speed;
        img.style.setProperty('--py', Math.max(-36, Math.min(36, offset)).toFixed(1) + 'px');
      });
    }
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }
  addEventListener('scroll', onScroll, { passive: true });

  let resizeTimer;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { buildVine(); onScroll(); }, 180);
  });
  buildVine();
  frame();
  addEventListener('load', () => { buildVine(); frame(); });

  /* ---------- Scrollspy da navegação ---------- */
  if ('IntersectionObserver' in window) {
    const links = $$('.nav-links a');
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['sobre', 'servicos', 'planos', 'avaliacoes', 'contato'].forEach((id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Acordeão do FAQ ---------- */
  $$('.acc-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const wasOpen = btn.getAttribute('aria-expanded') === 'true';
      $$('.acc-btn').forEach((b) => b.setAttribute('aria-expanded', 'false'));
      btn.setAttribute('aria-expanded', String(!wasOpen));
    });
  });

  /* ---------- Horários: destaca o dia e mostra se está aberto ---------- */
  const rows = $$('#hours tr[data-day]');
  const pill = $('#status-pill');
  function updateHours() {
    let now;
    try { now = new Date(new Date().toLocaleString('en-US', { timeZone: CONFIG.TIMEZONE })); }
    catch (_) { now = new Date(); }
    const day = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    rows.forEach((r) => r.classList.toggle('is-today', Number(r.dataset.day) === day));
    const weekday = day >= 1 && day <= 5;
    let text = 'Fechado agora', open = false;
    if (weekday && mins >= 600 && mins < 1020)      { text = 'Aberto agora: presencial e online'; open = true; }
    else if (weekday && mins >= 1020 && mins < 1080) { text = 'Aberto agora: presencial até 18h'; open = true; }
    else if (weekday && mins >= 540 && mins < 600)   { text = 'Online aberto; presencial abre às 10h'; open = true; }
    pill.classList.toggle('is-open', open);
    $('span', pill).textContent = text;
  }
  if (pill) { updateHours(); setInterval(updateHours, 60000); }

  /* ---------- Botão magnético (só com mouse) ---------- */
  if (finePointer && !reduce) {
    $$('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.18;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.28;
        btn.style.translate = x.toFixed(1) + 'px ' + y.toFixed(1) + 'px';
      });
      btn.addEventListener('mouseleave', () => { btn.style.translate = ''; });
    });
  }
})();
