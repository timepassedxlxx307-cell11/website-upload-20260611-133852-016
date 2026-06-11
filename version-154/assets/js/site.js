(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    setupMobileMenu();
    setupHeroCarousel();
    setupLocalFilters();
  });

  function setupMobileMenu() {
    var button = document.querySelector('.mobile-menu-button');
    var panel = document.querySelector('.mobile-panel');

    if (!button || !panel) {
      return;
    }

    button.addEventListener('click', function () {
      var isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
    });
  }

  function setupHeroCarousel() {
    var carousel = document.querySelector('.hero-carousel');

    if (!carousel) {
      return;
    }

    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var thumbs = Array.prototype.slice.call(carousel.querySelectorAll('.hero-thumb'));
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      thumbs.forEach(function (thumb, thumbIndex) {
        thumb.classList.toggle('active', thumbIndex === current);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        show(Number(thumb.getAttribute('data-target-slide') || 0));
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }

    show(0);
    restart();
  }

  function setupLocalFilters() {
    var grids = Array.prototype.slice.call(document.querySelectorAll('[data-filter-grid]'));

    if (!grids.length) {
      return;
    }

    var input = document.querySelector('.filter-input');
    var year = document.querySelector('.filter-year');

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function matchesYear(cardYear, selectedYear) {
      if (!selectedYear) {
        return true;
      }
      if (selectedYear === '2022') {
        return Number(cardYear) <= 2022;
      }
      return cardYear === selectedYear;
    }

    function filter() {
      var query = normalize(input ? input.value : '');
      var selectedYear = year ? year.value : '';

      grids.forEach(function (grid) {
        var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-category'),
            card.getAttribute('data-year')
          ].join(' '));
          var cardYear = card.getAttribute('data-year') || '';
          var visible = (!query || haystack.indexOf(query) !== -1) && matchesYear(cardYear, selectedYear);
          card.hidden = !visible;
        });
      });
    }

    if (input) {
      input.addEventListener('input', filter);
    }
    if (year) {
      year.addEventListener('change', filter);
    }
  }
})();
