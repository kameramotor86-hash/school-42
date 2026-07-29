document.getElementById("year").textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector(".site-header");
const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll("[data-nav]");
const sections = [...document.querySelectorAll("section[id]")];
const revealItems = document.querySelectorAll(".reveal");

/* Header scroll state */
const onScroll = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* Hamburger */
navToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Открыть меню");
  });
});

/* Soft section reveal */
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  /* Active nav highlight while scrolling */
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { threshold: 0.35, rootMargin: "-20% 0px -45% 0px" }
  );

  sections.forEach((section) => navObserver.observe(section));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

/* Signup form — front-end only */
document.querySelector(".signup")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = e.currentTarget.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = "Заявка отправлена";
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
    e.currentTarget.reset();
  }, 2200);
});

if (!reduceMotion) {
  /* ——— Particles (soft teal dust in hero) ——— */
  const particlesCanvas = document.querySelector(".hero__particles");
  if (particlesCanvas) {
    const ctx = particlesCanvas.getContext("2d");
    const hero = particlesCanvas.closest(".hero");
    let particles = [];
    let raf = 0;
    let running = true;

    const resize = () => {
      const { width, height } = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      particlesCanvas.width = Math.floor(width * dpr);
      particlesCanvas.height = Math.floor(height * dpr);
      particlesCanvas.style.width = `${width}px`;
      particlesCanvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(22, Math.floor((width * height) / 34000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.7 + Math.random() * 2.2,
        vx: -0.12 + Math.random() * 0.24,
        vy: -0.2 - Math.random() * 0.35,
        a: 0.12 + Math.random() * 0.28,
      }));
    };

    const draw = () => {
      if (!running) return;
      const { width, height } = hero.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = height + 8;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 8;
        if (p.x > width + 10) p.x = -8;

        ctx.beginPath();
        ctx.fillStyle = `rgba(62, 156, 126, ${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) draw();
      else cancelAnimationFrame(raf);
    });
  }

  /* ——— Click Spark ——— */
  const sparkCanvas = document.getElementById("click-spark");
  if (sparkCanvas) {
    const ctx = sparkCanvas.getContext("2d");
    let sparks = [];
    let sparkRaf = 0;
    let sparkRunning = false;

    const resizeSpark = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sparkCanvas.width = Math.floor(window.innerWidth * dpr);
      sparkCanvas.height = Math.floor(window.innerHeight * dpr);
      sparkCanvas.style.width = `${window.innerWidth}px`;
      sparkCanvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeSpark();
    window.addEventListener("resize", resizeSpark, { passive: true });

    const spawn = (x, y) => {
      const count = 10 + Math.floor(Math.random() * 6);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.35;
        const speed = 1.6 + Math.random() * 3.2;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.02 + Math.random() * 0.025,
          r: 1.2 + Math.random() * 1.8,
        });
      }
      if (!sparkRunning) {
        sparkRunning = true;
        loopSparks();
      }
    };

    const loopSparks = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      sparks = sparks.filter((s) => s.life > 0);

      for (const s of sparks) {
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.94;
        s.vy *= 0.94;
        s.life -= s.decay;

        ctx.beginPath();
        ctx.fillStyle = `rgba(62, 156, 126, ${Math.max(s.life, 0)})`;
        ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2);
        ctx.fill();
      }

      if (sparks.length) {
        sparkRaf = requestAnimationFrame(loopSparks);
      } else {
        sparkRunning = false;
        cancelAnimationFrame(sparkRaf);
      }
    };

    document.addEventListener(
      "pointerdown",
      (e) => {
        if (e.button !== 0) return;
        spawn(e.clientX, e.clientY);
      },
      { passive: true }
    );
  }
}
