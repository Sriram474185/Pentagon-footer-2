
 /*<!-- ================================================================
     JAVASCRIPT
================================================================ -->*/
 /* ----------------------------------------------------------
     1. CANVAS HEX GRID — animated, breathing hexagons
  ---------------------------------------------------------- */
  (function () {
    const canvas = document.getElementById('hexCanvas');
    const ctx = canvas.getContext('2d');
    const HEX_SIZE = 34;
    const HEX_GAP = 3;
    let W, H, hexes = [];
    const NEON = 'rgba(163,32,255,';

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      buildGrid();
    }

    function hexCorner(cx, cy, size, i) {
      const ang = Math.PI / 180 * (60 * i - 30);
      return [cx + size * Math.cos(ang), cy + size * Math.sin(ang)];
    }

    function buildGrid() {
      hexes = [];
      const eff = HEX_SIZE + HEX_GAP;
      const cols = Math.ceil(W / (eff * 1.732)) + 2;
      const rows = Math.ceil(H / (eff * 1.5)) + 2;
      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const x = c * eff * 1.732 + (r % 2 === 0 ? 0 : eff * 0.866);
          const y = r * eff * 1.5;
          hexes.push({
            x, y,
            phase: Math.random() * Math.PI * 2,
            speed: 0.003 + Math.random() * 0.004,
            maxAlpha: 0.04 + Math.random() * 0.1,
          });
        }
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      hexes.forEach(h => {
        const alpha = h.maxAlpha * (0.4 + 0.6 * Math.sin(h.phase + t * h.speed));
        h.phase += 0.005;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const [px, py] = hexCorner(h.x, h.y, HEX_SIZE, i);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = NEON + alpha + ')';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });
      requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    resize();
    requestAnimationFrame(draw);
  })();

  /* ----------------------------------------------------------
     2. TICKER DUPLICATION for seamless infinite scroll
  ---------------------------------------------------------- */
  (function () {
    const track = document.getElementById('tickerTrack');
    track.innerHTML += track.innerHTML; // duplicate for loop
  })();

  /* ----------------------------------------------------------
     3. COUNT-UP ANIMATION for stat pills
  ---------------------------------------------------------- */
  (function () {
    const els = document.querySelectorAll('.stat-num[data-target]');
    const observed = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1600;
        const step = 16;
        const steps = duration / step;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + increment, target);
          el.textContent = Math.round(current).toLocaleString();
          if (current >= target) {
            el.textContent = target.toLocaleString();
            clearInterval(timer);
          }
        }, step);
        observed.unobserve(el);
      });
    }, { threshold: 0.5 });
    els.forEach(el => observed.observe(el));
  });
