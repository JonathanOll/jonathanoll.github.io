document.querySelectorAll(".slider").forEach(slider => {
  const slides = slider.querySelector(".slides");
  const images = slides.querySelectorAll("img");
  const dotsContainer = slider.querySelector(".dots");

  let index = 0;

  // Création des dots
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

  // Auto-play
  setInterval(() => {
    index = (index + 1) % images.length;
    updateSlider();
  }, 4000);
});
