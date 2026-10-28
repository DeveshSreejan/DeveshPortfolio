// ============ FOOTER YEAR ============
document.getElementById("year").textContent = new Date().getFullYear();

// ============ NAVBAR: scroll style + mobile menu ============
const navbar = document.getElementById("navbar");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const toTop = document.getElementById("toTop");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
  toTop.classList.toggle("show", window.scrollY > 500);
});

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("open");
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menuBtn.classList.remove("open");
    navLinks.classList.remove("open");
  })
);

toTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

// ============ ACTIVE NAV LINK ON SCROLL ============
const sections = document.querySelectorAll("main section[id]");
const links = navLinks.querySelectorAll("a");

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  },
  { threshold: 0.5 }
);
sections.forEach((s) => spy.observe(s));

// ============ TYPING EFFECT ============
const roles = [
  "CSE Student @ VIT Vellore",
  "Python Programmer",
  "DSA Problem Solver",
  "Aspiring Software Engineer",
];
const typedEl = document.getElementById("typed");
let roleIdx = 0, charIdx = 0, deleting = false;

function type() {
  const current = roles[roleIdx];
  typedEl.textContent = deleting
    ? current.slice(0, charIdx--)
    : current.slice(0, charIdx++);

  let delay = deleting ? 45 : 90;

  if (!deleting && charIdx > current.length) {
    deleting = true;
    delay = 1400;
  } else if (deleting && charIdx < 0) {
    deleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    charIdx = 0;
    delay = 400;
  }
  setTimeout(type, delay);
}
type();

// ============ SCROLL REVEAL + SKILL BARS + COUNTERS ============
const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("visible");

      const fill = el.querySelector(".fill");
      if (fill) fill.style.width = fill.dataset.level + "%";

      el.querySelectorAll("[data-count]").forEach(animateCount);
      obs.unobserve(el);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

function animateCount(el) {
  const target = +el.dataset.count;
  let n = 0;
  const step = Math.max(1, Math.ceil(target / 30));
  const timer = setInterval(() => {
    n += step;
    if (n >= target) { n = target; clearInterval(timer); }
    el.textContent = n;
  }, 50);
}

// ============ CURSOR GLOW ============
const glow = document.getElementById("cursorGlow");
window.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// ============ 3D TILT + SPOTLIGHT ON PROJECT CARDS ============
document.querySelectorAll(".tilt").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotY = ((x / rect.width) - 0.5) * 14;
    const rotX = ((y / rect.height) - 0.5) * -14;

    card.style.transform =
      `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    card.style.setProperty("--mx", x + "px");
    card.style.setProperty("--my", y + "px");
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ============ ANIMATED PARTICLE NETWORK BACKGROUND ============
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let particles = [];
const mouse = { x: null, y: null };

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const count = Math.min(90, Math.floor((canvas.width * canvas.height) / 18000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 1.8 + 0.6,
  }));
}
window.addEventListener("resize", resize);
window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
resize();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(192, 132, 252, 0.8)";
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 130) {
        ctx.strokeStyle = `rgba(157, 77, 255, ${0.22 * (1 - d / 130)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }

    if (mouse.x !== null) {
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < 160) {
        ctx.strokeStyle = `rgba(192, 132, 252, ${0.5 * (1 - dm / 160)})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(animate);
}
animate();