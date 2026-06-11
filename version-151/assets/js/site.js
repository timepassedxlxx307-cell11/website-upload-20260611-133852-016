(function () {
    function toggleMenu() {
        var button = document.querySelector('.menu-toggle');
        var menu = document.querySelector('.mobile-nav');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            var opened = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', String(!opened));
            menu.hidden = opened;
        });
    }

    function startHero() {
        var slider = document.querySelector('.hero-slider');
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
        var prev = slider.querySelector('.hero-prev');
        var next = slider.querySelector('.hero-next');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function move(step) {
            show(index + step);
        }

        function play() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                move(1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-slide')) || 0);
                play();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                move(-1);
                play();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                move(1);
                play();
            });
        }

        show(0);
        play();
    }

    function setupFiltering() {
        var input = document.querySelector('.card-filter');
        var select = document.querySelector('.type-filter');
        var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
        if (!cards.length) {
            return;
        }

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function apply() {
            var keyword = normalize(input ? input.value : '');
            var type = normalize(select ? select.value : '');
            cards.forEach(function (card) {
                var text = normalize(card.getAttribute('data-filter-text'));
                var cardType = normalize(card.getAttribute('data-type'));
                var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
                var matchType = !type || cardType.indexOf(type) !== -1;
                card.classList.toggle('is-hidden', !(matchKeyword && matchType));
            });
        }

        if (input) {
            var params = new URLSearchParams(window.location.search);
            var q = params.get('q');
            if (q) {
                input.value = q;
            }
            input.addEventListener('input', apply);
        }

        if (select) {
            select.addEventListener('change', apply);
        }

        apply();
    }

    document.addEventListener('DOMContentLoaded', function () {
        toggleMenu();
        startHero();
        setupFiltering();
    });
})();
