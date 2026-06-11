(function() {
  const menuButton = document.querySelector("[data-menu-button]");
  const siteNav = document.querySelector("[data-site-nav]");

  if (menuButton && siteNav) {
    menuButton.addEventListener("click", function() {
      siteNav.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-filter-scope]").forEach(function(scope) {
    const inputs = scope.querySelectorAll("[data-filter-input]");
    const cards = scope.querySelectorAll("[data-movie-card]");
    const empty = scope.querySelector("[data-empty-state]");

    function applyFilter(value) {
      const keyword = value.trim().toLowerCase();
      let visible = 0;

      cards.forEach(function(card) {
        const text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
        const matched = keyword === "" || text.indexOf(keyword) !== -1;
        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    inputs.forEach(function(input) {
      input.addEventListener("input", function() {
        applyFilter(input.value);
      });
    });
  });

  const slider = document.querySelector("[data-hero-slider]");

  if (slider) {
    const slides = Array.from(slider.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(slider.querySelectorAll("[data-hero-dot]"));
    let current = 0;
    let timer = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function() {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function(dot, dotIndex) {
      dot.addEventListener("click", function() {
        showSlide(dotIndex);
        startTimer();
      });
    });

    slider.addEventListener("mouseenter", function() {
      window.clearInterval(timer);
    });

    slider.addEventListener("mouseleave", startTimer);
    showSlide(0);
    startTimer();
  }
}());
