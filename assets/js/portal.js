/* ==========================================================================
   KEDAR CHEMISTRY // PORTAL HOMEPAGE LOGIC (DARK MODE ONLY)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'kedar_chemistry_completed_chapters';

  // 1. FILTERING & SEARCHING CHAPTER CARDS
  const filterButtons = document.querySelectorAll('.filter-tab-btn');
  const searchInput = document.getElementById('chapterSearchInput');
  const chapterCards = document.querySelectorAll('.chapter-tile-wrapper');
  const emptyState = document.getElementById('chaptersEmptyState');

  let activeCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;

    chapterCards.forEach(card => {
      const cardClass = card.getAttribute('data-class');
      const cardCategory = card.getAttribute('data-category');
      const cardTitle = card.getAttribute('data-title') || '';
      const cardTopics = card.getAttribute('data-topics') || '';

      // Match category/class
      let matchesCategory = false;
      if (activeCategory === 'all') {
        matchesCategory = true;
      } else if (activeCategory === '11' || activeCategory === '12') {
        matchesCategory = cardClass === activeCategory;
      } else if (activeCategory === 'physical') {
        matchesCategory = cardCategory.includes('physical');
      } else if (activeCategory === 'inorganic') {
        matchesCategory = cardCategory.includes('inorganic');
      } else if (activeCategory === 'organic') {
        matchesCategory = cardCategory.includes('organic');
      }

      // Match search
      const matchesSearch = !searchQuery || cardTitle.includes(searchQuery) || cardTopics.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  // 2. STUDY MASTERY METER
  function updateMasteryMeter() {
    try {
      const completed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const total = 19;
      const count = completed.length;
      const pct = Math.round((count / total) * 100);

      const statEl = document.getElementById('masteryCount');
      const fillEl = document.getElementById('masteryMeterFill');

      if (statEl) statEl.textContent = `${count} / ${total} (${pct}%)`;
      if (fillEl) fillEl.style.width = `${pct}%`;

      // Mark completed cards
      chapterCards.forEach(card => {
        const slug = card.getAttribute('data-slug');
        if (completed.includes(slug)) {
          card.classList.add('is-completed');
        } else {
          card.classList.remove('is-completed');
        }
      });
    } catch (err) {
      console.warn('Mastery storage error:', err);
    }
  }
  updateMasteryMeter();
  window.addEventListener('storage', updateMasteryMeter);

  // 3. CONTACT / DOUBT MODAL
  const modalToggle = document.getElementById('contactModalToggle');
  const modalOverlay = document.getElementById('contactModal');
  const modalClose = document.getElementById('modalCloseBtn');

  if (modalToggle && modalOverlay) {
    modalToggle.addEventListener('click', () => {
      modalOverlay.classList.add('is-active');
    });
  }
  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('is-active');
    });
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('is-active');
      }
    });
  }

  // 4. RESPONSIVE INTERACTIVE CHEMISTRY BACKGROUND CANVAS (CURSOR-REACTIVE)
  const waveCanvas = document.getElementById('flowingMeshCanvas');
  if (waveCanvas) {
    const waveCtx = waveCanvas.getContext('2d');
    let pr = Math.min(window.devicePixelRatio || 1, 2);
    let width = (waveCanvas.width = window.innerWidth);
    let height = (waveCanvas.height = window.innerHeight);

    function resizeCanvas() {
      pr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      waveCanvas.width = Math.round(width * pr);
      waveCanvas.height = Math.round(height * pr);
      waveCtx.setTransform(pr, 0, 0, pr, 0, 0);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Cursor / Pointer State
    const mouse = { x: width * 0.5, y: height * 0.45 };
    const targetMouse = { x: width * 0.5, y: height * 0.45 };
    const mouseVelocity = { x: 0, y: 0 };
    let mouseSpeed = 0;
    let isPointerActive = false;
    let lastPointerTime = performance.now();

    // Quantum Sparks Array
    const sparks = [];
    class QuantumSpark {
      constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx * 0.15 + (Math.random() - 0.5) * 2.2;
        this.vy = vy * 0.15 + (Math.random() - 0.5) * 2.2;
        this.life = 1.0;
        this.decay = 0.035 + Math.random() * 0.03;
        this.radius = 1.2 + Math.random() * 1.8;
        this.color = Math.random() > 0.5 ? '#00f0ff' : '#ffb703';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.94;
        this.vy *= 0.94;
        this.life -= this.decay;
      }
      draw(ctx) {
        if (this.life <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * this.life, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, this.life * 0.85);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    function onPointerMove(clientX, clientY) {
      const dx = clientX - targetMouse.x;
      const dy = clientY - targetMouse.y;
      mouseVelocity.x = dx;
      mouseVelocity.y = dy;
      targetMouse.x = clientX;
      targetMouse.y = clientY;
      isPointerActive = true;
      lastPointerTime = performance.now();

      const speed = Math.hypot(dx, dy);
      if (speed > 6 && sparks.length < 24) {
        sparks.push(new QuantumSpark(clientX, clientY, dx, dy));
        if (speed > 18 && sparks.length < 23) {
          sparks.push(new QuantumSpark(clientX, clientY, dx * 0.5, dy * 0.5));
        }
      }
    }

    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY), { passive: true });
    window.addEventListener('mouseleave', () => { isPointerActive = false; });
    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
    window.addEventListener('touchend', () => { isPointerActive = false; }, { passive: true });

    // Floating Molecular Constellation Nodes
    const nodeCount = Math.min(65, Math.max(35, Math.floor(width / 32)));
    const nodes = [];
    const colors = ['#00F0FF', '#FFB703', '#10B981', '#724CE8'];

    class AtomicNode {
      constructor() {
        this.reset(true);
      }
      reset(initial) {
        this.x = initial ? Math.random() * width : (Math.random() > 0.5 ? -10 : width + 10);
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.65;
        this.vy = (Math.random() - 0.5) * 0.65;
        this.radius = 1.4 + Math.random() * 2.2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.orbitAngle = Math.random() * Math.PI * 2;
        this.orbitSpeed = 0.03 + Math.random() * 0.04;
        this.hasOrbit = this.radius > 2.3;
      }
      update() {
        // Natural drift
        this.x += this.vx;
        this.y += this.vy;

        // Interactive cursor physics: Repulsion force and wake pull
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const repelRadius = 150;

        if (dist < repelRadius && dist > 0.1) {
          const force = (1 - dist / repelRadius) * 3.8;
          const angle = Math.atan2(dy, dx);
          this.vx += Math.cos(angle) * force * 0.45 + mouseVelocity.x * 0.025;
          this.vy += Math.sin(angle) * force * 0.45 + mouseVelocity.y * 0.025;
        }

        // Viscous damping
        this.vx *= 0.95;
        this.vy *= 0.95;

        // Soft screen bounce / wrap
        if (this.x < -20) this.x = width + 20;
        else if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        else if (this.y > height + 20) this.y = -20;

        this.orbitAngle += this.orbitSpeed;
      }
      draw(ctx) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const isNearCursor = dist < 170;
        const proximityBoost = isNearCursor ? (1 - dist / 170) : 0;

        // Core atom
        ctx.beginPath();
        const r = this.radius + proximityBoost * 1.5;
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.65 + proximityBoost * 0.35;
        ctx.fill();

        // Aura glow on proximity
        if (isNearCursor) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, r * 3, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.globalAlpha = proximityBoost * 0.25;
          ctx.fill();
        }

        // Orbiting electron for larger nodes
        if (this.hasOrbit) {
          const orbR = this.radius * 3.2;
          const ex = this.x + Math.cos(this.orbitAngle) * orbR;
          const ey = this.y + Math.sin(this.orbitAngle) * orbR;
          ctx.beginPath();
          ctx.arc(ex, ey, 1.1, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = 0.7 + proximityBoost * 0.3;
          ctx.fill();
        }

        ctx.globalAlpha = 1.0;
      }
    }

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new AtomicNode());
    }

    // Animation Clock & Loop
    let clockTime = 0;
    const waveCount = 15;

    function renderCanvas() {
      waveCtx.clearRect(0, 0, width, height);
      clockTime += 0.016;

      // 1. Cursor smoothing (lerp) & autonomous drift when idle
      const now = performance.now();
      if (!isPointerActive || now - lastPointerTime > 2800) {
        // Autonomous gentle Lissajous figure-8 motion
        const autoX = width * 0.5 + Math.sin(clockTime * 0.8) * (width * 0.26) + Math.cos(clockTime * 0.35) * (width * 0.12);
        const autoY = height * 0.42 + Math.cos(clockTime * 0.7) * (height * 0.18) + Math.sin(clockTime * 0.25) * (height * 0.08);
        targetMouse.x += (autoX - targetMouse.x) * 0.03;
        targetMouse.y += (autoY - targetMouse.y) * 0.03;
      }

      mouse.x += (targetMouse.x - mouse.x) * 0.11;
      mouse.y += (targetMouse.y - mouse.y) * 0.11;
      mouseVelocity.x *= 0.90;
      mouseVelocity.y *= 0.90;
      const curSpeed = Math.hypot(mouseVelocity.x, mouseVelocity.y);
      mouseSpeed += (curSpeed - mouseSpeed) * 0.12;

      // 2. Cursor Radial Bioluminescent Spotlight Aura
      const auraRadius = Math.max(160, Math.min(340, 210 + mouseSpeed * 2.2));
      const auraGrad = waveCtx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, auraRadius
      );
      auraGrad.addColorStop(0, 'rgba(0, 240, 255, 0.14)');
      auraGrad.addColorStop(0.35, 'rgba(114, 76, 232, 0.08)');
      auraGrad.addColorStop(0.70, 'rgba(255, 183, 3, 0.025)');
      auraGrad.addColorStop(1, 'rgba(5, 5, 8, 0)');

      waveCtx.beginPath();
      waveCtx.arc(mouse.x, mouse.y, auraRadius, 0, Math.PI * 2);
      waveCtx.fillStyle = auraGrad;
      waveCtx.fill();

      // 3. Dynamic Chemical Bond Interlinks between Nodes
      const maxBondDist = 82;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dNodes = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          if (dNodes < maxBondDist) {
            const midX = (n1.x + n2.x) * 0.5;
            const midY = (n1.y + n2.y) * 0.5;
            const dCursor = Math.hypot(midX - mouse.x, midY - mouse.y);
            const cursorGlow = dCursor < 180 ? (1 - dCursor / 180) * 2.5 : 0;
            const bondAlpha = (1 - dNodes / maxBondDist) * (0.16 + cursorGlow * 0.35);

            waveCtx.beginPath();
            waveCtx.moveTo(n1.x, n1.y);
            waveCtx.lineTo(n2.x, n2.y);
            waveCtx.strokeStyle = cursorGlow > 0.5 ? '#00F0FF' : 'rgba(114, 76, 232, 0.4)';
            waveCtx.globalAlpha = Math.min(0.85, bondAlpha);
            waveCtx.lineWidth = 0.8 + cursorGlow * 0.6;
            waveCtx.stroke();
          }
        }
      }
      waveCtx.globalAlpha = 1.0;

      // 4. Update & Draw Atomic Nodes
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
        nodes[i].draw(waveCtx);
      }

      // 5. Flowing Quantum Wave Contours with Cursor Ripple Distortion
      const points = Math.max(34, Math.min(68, Math.floor(width / 26)));
      const xSpacing = width / (points - 1);

      for (let i = 0; i < waveCount; i++) {
        waveCtx.beginPath();
        const lineProgress = i / waveCount;
        const yBase = height * 0.28 + i * (height * 0.036) + Math.sin(clockTime * 0.6 + i * 0.22) * 12;

        const grad = waveCtx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, 'rgba(114, 76, 232, 0.05)');
        grad.addColorStop(0.35, 'rgba(0, 240, 255, ' + (0.12 + (1 - lineProgress) * 0.28) + ')');
        grad.addColorStop(0.70, 'rgba(255, 183, 3, ' + (0.10 + (1 - lineProgress) * 0.24) + ')');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0.06)');

        waveCtx.strokeStyle = grad;
        waveCtx.lineWidth = 1.25;

        let prevX = 0;
        let prevY = 0;

        for (let j = 0; j < points; j++) {
          const x = j * xSpacing;

          // Natural harmonic undulation
          let waveElev =
            Math.sin(j * 0.22 + clockTime * 1.6 + i * 0.28) * 22 +
            Math.cos(j * 0.14 - clockTime * 1.1 + i * 0.20) * 15;

          // Cursor ripple deflection & orbital vortex
          const dx = x - mouse.x;
          const dy = yBase - mouse.y;
          const dist = Math.hypot(dx, dy);
          const rippleRadius = 240;

          if (dist < rippleRadius) {
            const factor = 1 - dist / rippleRadius;
            // Radial wave dispersion radiating out from cursor
            const ripple = Math.sin(dist * 0.048 - clockTime * 6.5) * (26 + Math.min(mouseSpeed, 35) * 0.75) * factor;
            // Vertical gravitational displacement
            const pushY = (dy / (dist + 20)) * 24 * (factor * factor);
            waveElev += ripple + pushY;
          }

          const y = yBase + waveElev;

          if (j === 0) {
            waveCtx.moveTo(x, y);
          } else {
            // Smooth quadratic bezier curve through midpoint
            const midX = (prevX + x) * 0.5;
            const midY = (prevY + y) * 0.5;
            waveCtx.quadraticCurveTo(prevX, prevY, midX, midY);
          }
          prevX = x;
          prevY = y;
        }
        waveCtx.lineTo(prevX, prevY);
        waveCtx.stroke();
      }

      // 6. Update & Draw Quantum Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        sparks[i].update();
        sparks[i].draw(waveCtx);
        if (sparks[i].life <= 0) sparks.splice(i, 1);
      }

      requestAnimationFrame(renderCanvas);
    }
    renderCanvas();
  }

});
