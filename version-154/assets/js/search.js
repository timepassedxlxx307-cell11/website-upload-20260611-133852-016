(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var form = document.getElementById('search-page-form');
    var input = document.getElementById('search-query');
    var count = document.getElementById('search-count');
    var results = document.getElementById('search-results');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (!form || !input || !count || !results) {
      return;
    }

    input.value = initialQuery;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      render(input.value);
      var url = new URL(window.location.href);
      if (input.value.trim()) {
        url.searchParams.set('q', input.value.trim());
      } else {
        url.searchParams.delete('q');
      }
      window.history.replaceState({}, '', url.toString());
    });

    input.addEventListener('input', function () {
      render(input.value);
    });

    render(initialQuery);

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function render(query) {
      var q = normalize(query);
      var source = Array.isArray(window.MOVIE_SEARCH_INDEX) ? window.MOVIE_SEARCH_INDEX : [];
      var matched = source.filter(function (movie) {
        if (!q) {
          return true;
        }
        var haystack = normalize([
          movie.title,
          movie.year,
          movie.region,
          movie.genre,
          movie.category,
          movie.tags,
          movie.oneLine
        ].join(' '));
        return haystack.indexOf(q) !== -1;
      });
      var visible = matched.slice(0, 240);
      count.textContent = q ? '找到 ' + matched.length + ' 部相关影片，当前显示前 ' + visible.length + ' 部。' : '显示最新 ' + visible.length + ' 部影片，可输入关键词进一步筛选。';
      results.innerHTML = visible.map(renderCard).join('');
    }

    function renderCard(movie) {
      return '' +
        '<article class="movie-card compact-card">' +
          '<a class="poster-wrap" href="' + escapeHtml(movie.url) + '" aria-label="观看 ' + escapeHtml(movie.title) + '">' +
            '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + ' 在线观看封面" loading="lazy" onerror="this.style.display=\'none\'; this.parentElement.classList.add(\'image-missing\');">' +
            '<span class="poster-badge">' + escapeHtml(movie.year) + '</span>' +
            '<span class="poster-play">▶</span>' +
          '</a>' +
          '<div class="movie-card-body">' +
            '<div class="card-meta-row"><span class="card-category">' + escapeHtml(movie.category) + '</span><span>' + escapeHtml(movie.region) + '</span></div>' +
            '<h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>' +
            '<p>' + escapeHtml(movie.oneLine) + '</p>' +
            '<div class="tag-row"><span>' + escapeHtml(movie.genre) + '</span></div>' +
          '</div>' +
        '</article>';
    }
  });
})();
