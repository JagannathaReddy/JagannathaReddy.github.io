(function () {
  var KEY = 'jmv-blog-draft';
  var $ = function (s) { return document.querySelector(s); };
  var f = {
    title: $('[data-f="title"]'), tag: $('[data-f="tag"]'), date: $('[data-f="date"]'),
    summary: $('[data-f="summary"]'), body: $('[data-f="body"]')
  };
  var pv = {
    title: $('[data-pv="title"]'), tag: $('[data-pv="tag"]'),
    summary: $('[data-pv="summary"]'), body: $('[data-pv="body"]')
  };
  var errorEl = $('[data-error]');
  var savedEl = $('[data-saved]');
  var editor = $('[data-editor]');

  var today = function () {
    var d = new Date();
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  };
  var STARTER = 'Start writing here. Everything you type shows up in the preview.\n\n## A heading\n\nA blank line starts a new paragraph. Use `inline code`, **bold**, [links](https://example.com) and\n\n```ts\n// fenced code blocks\n```\n\n> and quotes.';

  // restore draft (per-browser convenience only)
  var draft = null;
  try { draft = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
  f.title.value = (draft && draft.title) || '';
  f.tag.value = (draft && draft.tag) || (window.SITE_TOPICS || ['Notes'])[0];
  f.date.value = (draft && draft.date) || today();
  f.summary.value = (draft && draft.summary) || '';
  f.body.value = (draft && draft.body) || STARTER;

  var slugify = function (s) {
    return (s || 'untitled').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'untitled';
  };
  var yamlStr = function (s) { return '"' + String(s || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'; };
  var markdown = function () {
    return '---\n' +
      'title: ' + yamlStr(f.title.value.trim()) + '\n' +
      'summary: ' + yamlStr(f.summary.value.trim()) + '\n' +
      'tag: ' + f.tag.value + '\n' +
      '---\n\n' + f.body.value.trim() + '\n';
  };
  var filename = function () { return (f.date.value || today()) + '-' + slugify(f.title.value) + '.md'; };

  var render = function () {
    pv.title.textContent = f.title.value || 'Untitled post';
    pv.tag.textContent = (f.tag.value || '').toUpperCase();
    pv.summary.textContent = f.summary.value;
    if (window.marked) {
      // marked output is shown only to you, in your own browser, from your own text
      pv.body.classList.remove('is-plain');
      pv.body.innerHTML = window.marked.parse(f.body.value || '');
    } else {
      pv.body.classList.add('is-plain');
      pv.body.textContent = f.body.value;
    }
  };
  var saveTimer;
  var save = function () {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        localStorage.setItem(KEY, JSON.stringify({
          title: f.title.value, tag: f.tag.value, date: f.date.value, summary: f.summary.value, body: f.body.value
        }));
        savedEl.textContent = 'Draft saved in this browser';
      } catch (e) { savedEl.textContent = 'Draft not saved (browser storage unavailable)'; }
    }, 300);
  };
  Object.keys(f).forEach(function (k) {
    f[k].addEventListener('input', function () { errorEl.hidden = true; render(); save(); });
  });
  render();

  var check = function () {
    var msg = !f.title.value.trim() ? 'Add a title before publishing.' : (!f.body.value.trim() ? 'Write something in the body first.' : '');
    errorEl.textContent = msg; errorEl.hidden = !msg;
    return !msg;
  };

  // view toggle
  var modes = ['split', 'write', 'preview'];
  var labels = { split: 'Split view', write: 'Editor only', preview: 'Preview only' };
  $('[data-view]').addEventListener('click', function (e) {
    var next = modes[(modes.indexOf(editor.getAttribute('data-mode')) + 1) % modes.length];
    editor.setAttribute('data-mode', next);
    e.currentTarget.textContent = labels[next];
  });

  $('[data-copy]').addEventListener('click', function (e) {
    var b = e.currentTarget;
    var done = function (t) { b.textContent = t; setTimeout(function () { b.textContent = 'Copy Markdown'; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(markdown()).then(function () { done('Copied ✓'); }, function () { done('Copy failed'); });
    else done('Copy not supported');
  });

  $('[data-download]').addEventListener('click', function () {
    if (!check()) return;
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([markdown()], { type: 'text/markdown' }));
    a.download = filename();
    document.body.appendChild(a); a.click(); a.remove();
  });

  $('[data-publish]').addEventListener('click', function () {
    if (!check()) return;
    var url = 'https://github.com/' + window.SITE_REPO + '/new/' + encodeURIComponent(window.SITE_BRANCH) +
      '?filename=' + encodeURIComponent('_posts/' + filename()) +
      '&value=' + encodeURIComponent(markdown());
    if (url.length > 7500) {
      errorEl.textContent = 'This post is long for a link. Use "Copy Markdown", then on GitHub open _posts → Add file → Create new file, name it ' + filename() + ' and paste.';
      errorEl.hidden = false;
      window.open('https://github.com/' + window.SITE_REPO + '/new/' + encodeURIComponent(window.SITE_BRANCH) + '?filename=' + encodeURIComponent('_posts/' + filename()), '_blank', 'noopener');
      return;
    }
    window.open(url, '_blank', 'noopener');
  });
})();
