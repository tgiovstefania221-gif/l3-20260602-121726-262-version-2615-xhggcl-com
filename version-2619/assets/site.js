function ready(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

ready(function () {
  var toggle = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-main-nav]");
  var search = document.querySelector(".header-search");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
      if (search) {
        search.classList.toggle("is-open");
      }
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var active = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    active = (index + slides.length) % slides.length;
    slides.forEach(function (slide, pos) {
      slide.classList.toggle("is-active", pos === active);
    });
    dots.forEach(function (dot, pos) {
      dot.classList.toggle("is-active", pos === active);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(active + 1);
    }, 5200);
  }

  var input = document.querySelector("[data-filter-input]");
  var scope = document.querySelector("[data-filter-scope]");

  if (input && scope) {
    var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
    input.addEventListener("input", function () {
      var value = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        var matched = !value || text.indexOf(value) !== -1;
        card.style.display = matched ? "" : "none";
      });
    });
  }

  renderSearchResults();
});

function initMoviePlayer(source) {
  var video = document.getElementById("movie-player");
  var button = document.getElementById("playCover");
  var hlsInstance = null;
  var assigned = false;

  if (!video || !source) {
    return;
  }

  function assignSource() {
    if (assigned) {
      return;
    }
    assigned = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function beginPlay() {
    assignSource();
    if (button) {
      button.classList.add("is-hidden");
    }
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  if (button) {
    button.addEventListener("click", beginPlay);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      beginPlay();
    }
  });

  video.addEventListener("play", function () {
    if (button) {
      button.classList.add("is-hidden");
    }
  });

  window.addEventListener("beforeunload", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}

function renderSearchResults() {
  var box = document.getElementById("searchResults");
  var input = document.getElementById("searchInput");

  if (!box || !window.SEARCH_MOVIES) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var query = (params.get("q") || "").trim();

  if (input) {
    input.value = query;
  }

  var list = window.SEARCH_MOVIES;
  if (query) {
    var q = query.toLowerCase();
    list = list.filter(function (movie) {
      return movie.searchText.indexOf(q) !== -1;
    });
  }

  var result = list.slice(0, 120).map(function (movie) {
    return '<a class="search-card" href="' + movie.url + '">' +
      '<img src="' + movie.poster + '" alt="' + escapeHtml(movie.title) + '">' +
      '<span>' +
        '<h2>' + escapeHtml(movie.title) + '</h2>' +
        '<p>' + escapeHtml(movie.year + ' · ' + movie.region + ' · ' + movie.type + ' · ' + movie.genre) + '</p>' +
        '<p>' + escapeHtml(movie.one) + '</p>' +
      '</span>' +
    '</a>';
  }).join("");

  box.innerHTML = result || '<div class="search-card"><span><h2>未找到匹配影片</h2><p>可以换一个片名、地区、年份或题材继续搜索。</p></span></div>';
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
