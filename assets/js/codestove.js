/* CodeStove motion scripts
   - AOS init (scroll reveal)
   - Masthead shadow once the page is scrolled
   - Hero rolling keyword
   - Count-up numbers ([data-count])
   - Parallax images ([data-parallax])
   - IoT process stepper (auto-highlight every 3s)
   - Project carousel (scroll-snap + prev/next buttons)
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

  /* ---------- Count-up numbers ([data-count]) ----------
     Optional: data-suffix="+" and data-count-delay="500" (ms after entering view). */
  function initCountUp() {
    var nodes = document.querySelectorAll("[data-count]");
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
          var delay = parseInt(entry.target.getAttribute("data-count-delay"), 10) || 0;
          if (delay) {
            window.setTimeout(function () { run(entry.target); }, delay);
          } else {
            run(entry.target);
          }
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

  /* ---------- Parallax ([data-parallax="0.1"]) ----------
     Writes a --py custom property on the element; the stylesheet applies it
     to the child image, so the element's own rect stays unaffected. */
  function initParallax() {
    var els = document.querySelectorAll("[data-parallax]");
    if (!els.length || reduceMotion) return;

    var ticking = false;

    function update() {
      ticking = false;
      var vh = window.innerHeight;
      var enabled = window.innerWidth >= 768;
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (!enabled) {
          el.style.removeProperty("--py");
          continue;
        }
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.1;
        var offset = r.top + r.height / 2 - vh / 2;
        el.style.setProperty("--py", (-offset * speed).toFixed(1) + "px");
      }
    }

    function request() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    update();
  }

  initParallax();

  /* ---------- IoT process stepper (.cs-process) ----------
     Highlights the next step every 3s once in view; pauses on hover;
     click / Enter / Space selects a step and restarts the cycle. */
  function initProcess() {
    var root = document.querySelector(".cs-process");
    if (!root) return;
    var steps = root.querySelectorAll(".cs-step");
    if (steps.length < 2) return;

    var INTERVAL = 3000;
    var index = 0;
    var timer = null;

    function activate(i) {
      index = i;
      for (var k = 0; k < steps.length; k++) {
        steps[k].classList.toggle("is-active", k === i);
        steps[k].setAttribute("aria-current", k === i ? "step" : "false");
      }
    }

    function next() {
      activate((index + 1) % steps.length);
    }

    function start() {
      if (timer || reduceMotion) return;
      timer = window.setInterval(next, INTERVAL);
    }

    function stop() {
      window.clearInterval(timer);
      timer = null;
    }

    Array.prototype.forEach.call(steps, function (step, i) {
      function select() {
        stop();
        activate(i);
        start();
      }
      step.addEventListener("click", select);
      step.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select();
        }
      });
    });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);

    activate(0);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) start();
            else stop();
          });
        },
        { threshold: 0.3 }
      ).observe(root);
    } else {
      start();
    }
  }

  initProcess();

  /* ---------- Project carousel (.cs-carousel) ---------- */
  function initCarousel() {
    var carousels = document.querySelectorAll(".cs-carousel");
    Array.prototype.forEach.call(carousels, function (c) {
      var track = c.querySelector(".cs-carousel__track");
      var buttons = c.querySelectorAll(".cs-carousel__btn");
      if (!track || !buttons.length) return;

      function cardStep() {
        var card = track.firstElementChild;
        if (!card) return track.clientWidth;
        var gap = parseFloat(window.getComputedStyle(track).columnGap) || 0;
        return card.getBoundingClientRect().width + gap;
      }

      function update() {
        var max = track.scrollWidth - track.clientWidth - 1;
        Array.prototype.forEach.call(buttons, function (b) {
          var dir = parseInt(b.getAttribute("data-dir"), 10);
          b.disabled = dir < 0 ? track.scrollLeft <= 1 : track.scrollLeft >= max;
        });
      }

      Array.prototype.forEach.call(buttons, function (b) {
        b.addEventListener("click", function () {
          var dir = parseInt(b.getAttribute("data-dir"), 10) || 1;
          track.scrollBy({
            left: dir * cardStep(),
            behavior: reduceMotion ? "auto" : "smooth",
          });
        });
      });

      track.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      update();
    });
  }

  initCarousel();
})();
