// Enlarges a picture in place; without JavaScript the link just opens the picture.
(function () {
  var lb = document.getElementById("lb");
  if (!lb || !lb.showModal) return;
  var img = lb.querySelector("img");
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a.zoom");
    if (!a) return;
    e.preventDefault();
    var pic = a.querySelector("img");
    img.src = a.href;
    img.alt = pic ? pic.alt : "";
    lb.showModal();
  });
  lb.addEventListener("click", function () { lb.close(); });
})();

// The language menu: the other page opens at the same section.
(function () {
  var menu = document.querySelector(".langmenu");
  if (!menu) return;
  menu.querySelectorAll("a[data-lang]").forEach(function (a) {
    a.addEventListener("click", function () {
      a.href = a.href.split("#")[0] + location.hash;
    });
  });
  document.addEventListener("click", function (e) { if (!menu.contains(e.target)) menu.open = false; });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") menu.open = false; });
})();

// Download tabs: one file at a time, the visitor's system first. Without JavaScript all three are listed.
(function () {
  var tabs = document.querySelectorAll(".tabs button");
  if (!tabs.length) return;
  function pick(id) {
    tabs.forEach(function (t) { t.setAttribute("aria-selected", t.dataset.pf === id ? "true" : "false"); });
    document.querySelectorAll(".pf").forEach(function (p) { p.classList.toggle("on", p.id === id); });
  }
  tabs.forEach(function (t) { t.addEventListener("click", function () { pick(t.dataset.pf); }); });
  var ua = navigator.userAgent;
  pick(/Windows/i.test(ua) ? "pf-zip" : /Linux/i.test(ua) && !/Android/i.test(ua) ? "pf-linux" : "pf-mac");
})();

// Small tab sets ([data-tabs]): the visitor's system first.
(function () {
  document.querySelectorAll("[data-tabs]").forEach(function (set) {
    var buttons = set.querySelectorAll("button[data-tab]");
    function pick(id) {
      buttons.forEach(function (b) {
        var on = b.dataset.tab === id;
        b.setAttribute("aria-selected", on ? "true" : "false");
        var panel = document.getElementById(b.dataset.tab);
        if (panel) panel.classList.toggle("on", on);
      });
    }
    buttons.forEach(function (b) { b.addEventListener("click", function () { pick(b.dataset.tab); }); });
    var win = Array.prototype.find.call(buttons, function (b) { return /-win$/.test(b.dataset.tab); });
    pick(/Windows/i.test(navigator.userAgent) && win ? win.dataset.tab : buttons[0].dataset.tab);
  });
})();

// Copies a SHA-256 sum or a snippet.
(function () {
  document.querySelectorAll(".copy").forEach(function (b) {
    b.addEventListener("click", function () {
      var text = b.dataset.copy;
      var done = function () {
        b.setAttribute("data-done", b.dataset.ok);
        setTimeout(function () { b.removeAttribute("data-done"); }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      } else {
        var t = document.createElement("textarea");
        t.value = text; document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        t.remove();
      }
    });
  });
})();
