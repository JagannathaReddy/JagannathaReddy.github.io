(function () {
  // ---- Theme toggle ----
  var root = document.documentElement;
  var toggles = document.querySelectorAll('[data-theme-toggle]');
  var setThemeLabel = function () {
    var dark = root.getAttribute('data-theme') === 'dark';
    toggles.forEach(function (b) { b.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme'); });
  };
  setThemeLabel();
  toggles.forEach(function (b) {
    b.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      setThemeLabel();
    });
  });

  // ---- Short / long bio (about) ----
  var bioSwitch = document.querySelector('[data-bio-switch]');
  if (bioSwitch) {
    var current = 'short';
    bioSwitch.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-bio]');
      if (!b) return;
      current = b.getAttribute('data-bio');
      bioSwitch.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      document.querySelectorAll('[data-bio-text]').forEach(function (el) { el.hidden = el.getAttribute('data-bio-text') !== current; });
    });
    var copy = document.querySelector('[data-bio-copy]');
    if (copy) copy.addEventListener('click', function () {
      var text = document.querySelector('[data-bio-text="' + current + '"]').innerText.trim();
      var done = function (t) { copy.textContent = t; setTimeout(function () { copy.textContent = 'Copy bio'; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { done('Copied ✓'); }, function () { done('Copy failed'); });
      else done('Copy not supported');
    });
  }

  // ---- Fail → pass demo card (home) ----
  var runner = document.querySelector('[data-runner]');
  if (runner) {
    var btn = runner.querySelector('[data-run]');
    var label = runner.querySelector('[data-run-label]');
    var pass = runner.querySelector('[data-pass]');
    var hint = runner.querySelector('[data-hint]');
    btn.addEventListener('click', function () {
      var ran = runner.classList.toggle('is-ran');
      pass.hidden = !ran;
      label.textContent = ran ? 'Reset' : 'Run the fix';
      hint.textContent = ran ? 'Step 2: watch the fix pass. Only then trust it.' : 'Step 1 of my rule: watch it fail first.';
    });
  }

  // ---- Project tabs (home) ----
  var tablist = document.querySelector('.tabs[role="tablist"]');
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var select = function (tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        select(next); next.focus(); e.preventDefault();
      });
    });
  }

  // ---- Topic filters (blog) ----
  var filters = document.querySelector('[data-filters]');
  if (filters) {
    var items = Array.prototype.slice.call(document.querySelectorAll('.article-list li[data-tag]'));
    var empty = document.querySelector('[data-empty]');
    var apply = function (topic) {
      var shown = 0;
      items.forEach(function (el) {
        var ok = topic === 'All' || el.getAttribute('data-tag') === topic;
        el.hidden = !ok;
        if (ok) shown++;
      });
      if (empty) empty.hidden = shown > 0;
      filters.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-filter') === topic ? 'true' : 'false');
      });
    };
    filters.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-filter]');
      if (b) apply(b.getAttribute('data-filter'));
    });
  }
})();
