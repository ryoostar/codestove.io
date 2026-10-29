/* CodeStove motion scripts
   - AOS init (scroll reveal)
   - Masthead shadow once the page is scrolled
   - Hero rolling keyword
   Respects prefers-reduced-motion. */
(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- AOS ---------- */
  if (window.AOS) {
    window.AOS.init({
      once: true,
      duration: 700,
      easing: "ease-out-cubic",
      offset: 60,
      disable: reduceMotion,
    });
  }

  /* ---------- Masthead: add shadow after scrolling ---------- */
  var masthead = document.querySelector(".masthead");
  if (masthead) {
    var onScroll = function () {
      masthead.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Hero rolling keyword ---------- */
  function initRoll() {
    var track = document.querySelector(".cs-roll__track");
    if (!track) return;

    var items = track.querySelectorAll(".cs-roll__item");
    var count = items.length;
    if (count < 2) return;

    if (reduceMotion) {
      // Show the first keyword only.
      for (var k = 1; k < count; k++) items[k].style.display = "none";
      return;
    }

    // Clone first item to the end for a seamless loop.
    track.appendChild(items[0].cloneNode(true));

    var index = 0;
    var INTERVAL = 3000; // ms between keywords
    var DURATION = 700; // ms slide duration

    function itemHeight() {
      return items[0].getBoundingClientRect().height;
    }

    function step() {
      index += 1;
      track.style.transition =
        "transform " + DURATION + "ms cubic-bezier(0.65, 0, 0.35, 1)";
      track.style.transform = "translateY(-" + index * itemHeight() + "px)";

      if (index === count) {
        // Landed on the clone: jump back to the real first item without transition.
        window.setTimeout(function () {
          track.style.transition = "none";
          track.style.transform = "translateY(0)";
          index = 0;
        }, DURATION + 40);
      }
    }

    // Keep position correct if the viewport resizes mid-cycle.
    window.addEventListener("resize", function () {
      track.style.transition = "none";
      track.style.transform = "translateY(-" + index * itemHeight() + "px)";
    });

    window.setInterval(step, INTERVAL);
  }

  initRoll();

  /* ---------- Count-up numbers (.stat-number[data-count]) ---------- */
  function initCountUp() {
    var nodes = document.querySelectorAll(".stat-number[data-count]");
    if (!nodes.length || !("IntersectionObserver" in window)) return;

    function finalText(el) {
      return el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
    }

    if (reduceMotion) {
      nodes.forEach(function (el) {
        el.textContent = finalText(el);
      });
      return;
    }

    function run(el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var DURATION = 1400;
      var start = null;

      function frame(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / DURATION, 1);
        var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) window.requestAnimationFrame(frame);
      }
      window.requestAnimationFrame(frame);
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          run(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    nodes.forEach(function (el) {
      el.textContent = "0" + (el.getAttribute("data-suffix") || "");
      io.observe(el);
    });
  }

  initCountUp();
})();
