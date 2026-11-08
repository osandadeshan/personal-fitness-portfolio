(function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ===== Theme toggle =====
  var themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });

  // ===== Mobile menu =====
  var menuBtn = document.getElementById("menuBtn");
  var navLinks = document.getElementById("navLinks");
  function closeMenu() {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
  menuBtn.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  // ===== Scroll: progress bar, nav shadow, back-to-top =====
  var progress = document.getElementById("progress");
  var topbar = document.getElementById("topbar");
  var toTop = document.getElementById("toTop");
  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    topbar.classList.toggle("scrolled", y > 20);
    toTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  // ===== Active nav link =====
  var links = Array.prototype.slice.call(navLinks.querySelectorAll("a"));
  var targets = links
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.toggle(
              "active",
              a.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    targets.forEach(function (t) {
      navObserver.observe(t);
    });
  }

  // ===== Reveal on scroll =====
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  }

  // ===== Card spotlight =====
  document.querySelectorAll(".card.spot").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // ===== Typed line =====
  var typed = document.getElementById("typed");
  var phrases = [
    "Personal Training",
    "Muscle Building",
    "Clean Eating",
    "Progressive Overload",
  ];
  if (reduceMotion) {
    typed.textContent = phrases[0];
  } else {
    var p = 0,
      i = 0,
      deleting = false;
    (function tick() {
      var word = phrases[p];
      i += deleting ? -1 : 1;
      typed.textContent = word.slice(0, i);
      var delay = deleting ? 45 : 90;
      if (!deleting && i === word.length) {
        deleting = true;
        delay = 1600;
      } else if (deleting && i === 0) {
        deleting = false;
        p = (p + 1) % phrases.length;
        delay = 400;
      }
      setTimeout(tick, delay);
    })();
  }

  // ===== Footer year =====
  document.getElementById("year").textContent = new Date().getFullYear();
})();
