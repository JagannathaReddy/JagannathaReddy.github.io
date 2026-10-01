(function () {
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
    var items = Array.prototype.slice.call(document.querySelectorAll('.featured[data-tag], .post-list li[data-tag]'));
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
