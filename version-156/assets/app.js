(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");

        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("is-open");
                document.body.classList.toggle("menu-open", mobileNav.classList.contains("is-open"));
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var activeIndex = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            activeIndex = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === activeIndex);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === activeIndex);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(activeIndex + 1);
            }, 6200);
        }

        var homeSearch = document.querySelector("[data-home-search]");

        if (homeSearch) {
            homeSearch.addEventListener("keydown", function (event) {
                var keyword = String(homeSearch.value || "").trim();

                if (event.key === "Enter" && keyword) {
                    window.location.href = "search.html?q=" + encodeURIComponent(keyword);
                }
            });
        }

        var filterRoot = document.querySelector("[data-filter-root]");

        if (filterRoot) {
            var cards = Array.prototype.slice.call(filterRoot.querySelectorAll("[data-title]"));
            var input = document.querySelector("[data-filter-input]");
            var year = document.querySelector("[data-filter-year]");
            var region = document.querySelector("[data-filter-region]");
            var type = document.querySelector("[data-filter-type]");
            var category = document.querySelector("[data-filter-category]");
            var empty = document.querySelector("[data-empty-tip]");

            function valueOf(node) {
                return node ? String(node.value || "").trim().toLowerCase() : "";
            }

            function applyFilter() {
                var query = valueOf(input);
                var yearValue = valueOf(year);
                var regionValue = valueOf(region);
                var typeValue = valueOf(type);
                var categoryValue = valueOf(category);
                var visible = 0;

                cards.forEach(function (card) {
                    var text = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-tags"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-category"),
                        card.getAttribute("data-year")
                    ].join(" ").toLowerCase();

                    var matched = true;

                    if (query && text.indexOf(query) === -1) {
                        matched = false;
                    }

                    if (yearValue && card.getAttribute("data-year") !== yearValue) {
                        matched = false;
                    }

                    if (regionValue && card.getAttribute("data-region") !== regionValue) {
                        matched = false;
                    }

                    if (typeValue && card.getAttribute("data-type") !== typeValue) {
                        matched = false;
                    }

                    if (categoryValue && card.getAttribute("data-category") !== categoryValue) {
                        matched = false;
                    }

                    card.style.display = matched ? "" : "none";

                    if (matched) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            var params = new URLSearchParams(window.location.search);
            var queryFromUrl = params.get("q");

            if (queryFromUrl && input) {
                input.value = queryFromUrl;
            }

            [input, year, region, type, category].forEach(function (node) {
                if (node) {
                    node.addEventListener("input", applyFilter);
                    node.addEventListener("change", applyFilter);
                }
            });

            applyFilter();
        }

        Array.prototype.slice.call(document.querySelectorAll(".player-shell")).forEach(function (shell) {
            var video = shell.querySelector("video");
            var button = shell.querySelector("[data-player-button]");

            if (!video || !button) {
                return;
            }

            var stream = video.getAttribute("data-stream");
            var loaded = false;
            var hlsInstance = null;

            function loadStream() {
                if (loaded || !stream) {
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls();
                    hlsInstance.loadSource(stream);
                    hlsInstance.attachMedia(video);
                } else {
                    video.src = stream;
                }

                video.controls = true;
                loaded = true;
            }

            function startPlay() {
                loadStream();
                shell.classList.add("is-playing");

                var playResult = video.play();

                if (playResult && typeof playResult.catch === "function") {
                    playResult.catch(function () {});
                }
            }

            button.addEventListener("click", startPlay);

            video.addEventListener("click", function () {
                if (!loaded || video.paused) {
                    startPlay();
                } else {
                    video.pause();
                }
            });

            window.addEventListener("beforeunload", function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        });
    });
})();
