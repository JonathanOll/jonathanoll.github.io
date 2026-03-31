document.addEventListener("DOMContentLoaded", () => {
  // SLIDER
  document.querySelectorAll(".slider").forEach(slider => {
    const slides = slider.querySelector(".slides");
    const images = slides.querySelectorAll("img");
    const dotsContainer = slider.querySelector(".dots");

    let index = 0;

    images.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll("span");

    function updateSlider() {
      slides.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(d => d.classList.remove("active"));
      dots[index].classList.add("active");
    }

    function goToSlide(i) {
      index = i;
      updateSlider();
    }

    slider.querySelector(".next").addEventListener("click", () => {
      index = (index + 1) % images.length;
      updateSlider();
    });

    slider.querySelector(".prev").addEventListener("click", () => {
      index = (index - 1 + images.length) % images.length;
      updateSlider();
    });

    setInterval(() => {
      index = (index + 1) % images.length;
      updateSlider();
    }, 4000);
  });

  // --- PARTICLE SYSTEM ---
  const canvas = document.getElementById("particles");
  if (!canvas) return;

  function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);


  const ctx = canvas.getContext("2d");

  let particles = [];
  const particleCount = 200;
  const maxDistance = 150;
  const maxMouseDistance = 100;

  let mouse = { x: null, y: null };

  canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });


  canvas.addEventListener("mouseleave", e => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.size = Math.random() * 2 + 1; // taille random
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      const margin = 20; // sortie douce

      if (this.x < -margin) this.x = canvas.width + margin;
      if (this.x > canvas.width + margin) this.x = -margin;
      if (this.y < -margin) this.y = canvas.height + margin;
      if (this.y > canvas.height + margin) this.y = -margin;
    }

    draw() {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          let color = `rgba(255,255,255,${(maxDistance-dist)/maxDistance})`;

          if (mouse.x !== null && mouse.y !== null) {
            const mx = (particles[a].x + particles[b].x) / 2;
            const my = (particles[a].y + particles[b].y) / 2;
            const mouseDist = Math.hypot(mx - mouse.x, my - mouse.y);

            if (mouseDist < maxMouseDistance) {
              color = `rgba(0,150,255,${(maxMouseDistance-mouseDist)/maxMouseDistance})`;
            }
          }

          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }

    // Connexion souris → particules
    if (mouse.x !== null && mouse.y !== null) {
      particles.forEach(p => {
        const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);

        if (dist < maxDistance) {
          ctx.strokeStyle = "rgba(0,150,255,0.8)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();
});
