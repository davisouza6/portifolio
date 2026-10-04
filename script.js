const lightToggle = document.getElementById("light");

lightToggle.addEventListener("change", () => {
  document.body.classList.toggle("light", lightToggle.checked);
});

/* ====== Carrossel de Skills ====== */
const skillsTrack = document.getElementById("skills-track");
const skillsPrev = document.getElementById("skills-prev");
const skillsNext = document.getElementById("skills-next");
const skillsDots = document.querySelectorAll(".skills-dot");

if (skillsTrack && skillsPrev && skillsNext) {
  const totalSlides = skillsTrack.children.length;
  let currentSlide = 0;

  function goToSlide(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    skillsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    skillsDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide);
    });
  }

  skillsPrev.addEventListener("click", () => goToSlide(currentSlide - 1));
  skillsNext.addEventListener("click", () => goToSlide(currentSlide + 1));
  skillsDots.forEach((dot) => {
    dot.addEventListener("click", () => goToSlide(Number(dot.dataset.slide)));
  });
}

/* ====== Glow que segue o mouse ====== */
const cursorGlow = document.getElementById("cursor-glow");
if (cursorGlow) {
  window.addEventListener("pointermove", (e) => {
    cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
}

/* ====== Revelar elementos ao rolar (scroll reveal) ====== */
const revealTargets = document.querySelectorAll(
  "#hero h1, #badge, #text, #sobre, .skills-title, .bloco, .projetos-title, .projeto, .contato-title, #contato, #texto-contato, footer"
);

revealTargets.forEach((el, i) => {
  el.classList.add("reveal");
  el.style.transitionDelay = `${(i % 8) * 0.08}s`;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
);
revealTargets.forEach((el) => revealObserver.observe(el));

/* ====== Tilt 3D nos cartões de skill ====== */
document.querySelectorAll(".bloco").forEach((bloco) => {
  bloco.addEventListener("mousemove", (e) => {
    const rect = bloco.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -12;
    const rotateY = ((x / rect.width) - 0.5) * 12;
    bloco.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });
  bloco.addEventListener("mouseleave", () => {
    bloco.style.transform = "perspective(700px) rotateX(0) rotateY(0) scale(1)";
  });
});

/* ====== Efeito ripple nos botões ====== */
document
  .querySelectorAll(".projeto-botao, #contato button")
  .forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });

/* ====== Rastro de brilhos seguindo o mouse ====== */
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function spawnSparkle(x, y, { dx, dy, size, dur } = {}) {
  const s = document.createElement("span");
  s.className = "sparkle";
  const spread = dx ?? (Math.random() - 0.5) * 40;
  const rise = dy ?? -(30 + Math.random() * 40);
  const px = size ?? 4 + Math.random() * 5;
  const duration = dur ?? 700 + Math.random() * 400;
  s.style.setProperty("--dx", `${spread}px`);
  s.style.setProperty("--dy", `${rise}px`);
  s.style.setProperty("--dur", `${duration}ms`);
  s.style.width = s.style.height = `${px}px`;
  s.style.left = `${x}px`;
  s.style.top = `${y}px`;
  document.body.appendChild(s);
  setTimeout(() => s.remove(), duration + 50);
}

if (!prefersReducedMotion) {
  let lastSparkle = 0;
  window.addEventListener("pointermove", (e) => {
    const now = Date.now();
    if (now - lastSparkle < 45) return;
    lastSparkle = now;
    spawnSparkle(e.clientX, e.clientY);
  });
}

/* ====== Easter egg: clicar na carinha explode confete roxo ====== */
document.querySelectorAll("#logo > img, #logo-rodape > img").forEach((img) => {
  img.addEventListener("click", () => {
    img.classList.remove("logo-bounce");
    void img.offsetWidth; // reinicia a animação se clicar de novo rápido
    img.classList.add("logo-bounce");

    const rect = img.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    if (!prefersReducedMotion) {
      const total = 18;
      for (let i = 0; i < total; i++) {
        const angle = (Math.PI * 2 * i) / total + Math.random() * 0.3;
        const distance = 50 + Math.random() * 60;
        spawnSparkle(cx, cy, {
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          size: 5 + Math.random() * 6,
          dur: 700 + Math.random() * 400,
        });
      }
    }
  });
});

/* ====== Efeito magnético em links e botões ====== */
if (!prefersReducedMotion) {
  document
    .querySelectorAll("#opcao > a, .projeto-botao, .skills-arrow")
    .forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0, 0)";
      });
    });
}