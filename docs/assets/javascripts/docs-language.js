(() => {
  const key = 'subscrio.docs.language';
  const root = document.documentElement;
  const normalize = value => value === 'net' ? 'net' : 'ts';
  let language = normalize(root.dataset.docsLanguage);

  function apply(value, preservePosition = false) {
    const candidates = [...document.querySelectorAll('.md-content h2, .md-content h3')];
    const anchor = preservePosition
      ? candidates.filter(el => el.getClientRects().length && el.getBoundingClientRect().top <= 140).pop()
      : null;
    const before = anchor?.getBoundingClientRect().top;
    language = normalize(value);
    root.dataset.docsLanguage = language;
    document.querySelectorAll('[data-lang]').forEach(el => {
      el.hidden = el.dataset.lang !== language;
    });
    document.querySelectorAll('[data-docs-language-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.docsLanguageChoice === language));
    });
    document.querySelectorAll('.md-content [data-method-ts]').forEach(heading => {
      const text = language === 'net' ? heading.dataset.methodNet : heading.dataset.methodTs;
      heading.textContent = text;
      document.querySelectorAll('.md-nav--secondary a, .md-nav--primary .md-nav--secondary a').forEach(link => {
        if (link.getAttribute('href') === '#' + heading.id) link.textContent = text;
      });
    });
    // Older pages may have headings inside language variants. Hide only their TOC entries.
    document.querySelectorAll('.md-nav--secondary a[href^="#"]').forEach(link => {
      const target = document.getElementById(decodeURIComponent(link.getAttribute('href').slice(1)));
      const item = link.closest('.md-nav__item');
      if (item) item.hidden = Boolean(target?.closest('[data-lang][hidden]'));
    });
    if (anchor) window.scrollBy({ top: anchor.getBoundingClientRect().top - before, behavior: 'instant' });
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-docs-language-choice]');
    if (!button) return;
    apply(button.dataset.docsLanguageChoice, true);
    try { localStorage.setItem(key, language); } catch { /* Switching works without storage. */ }
  });
  window.addEventListener('storage', event => {
    if (event.key === key) apply(event.newValue, true);
  });

  function revealAnchor() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    const variant = target?.closest('[data-lang]');
    if (variant && variant.dataset.lang !== language) {
      apply(variant.dataset.lang);
      try { localStorage.setItem(key, language); } catch { /* Optional persistence. */ }
    }
    let parent = target?.parentElement;
    while (parent) {
      if (parent.tagName === 'DETAILS') parent.open = true;
      parent = parent.parentElement;
    }
    target?.scrollIntoView({ behavior: 'instant' });
  }
  function initialize() { apply(language); revealAnchor(); }
  window.addEventListener('hashchange', revealAnchor);
  window.addEventListener('load', revealAnchor, { once: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
  // Material's instant navigation replaces content without a full page load.
  if (typeof document$ !== 'undefined') document$.subscribe(initialize);

  let closedForPrint = [];
  window.addEventListener('beforeprint', () => {
    closedForPrint = [...document.querySelectorAll('.md-content details:not([open])')];
    closedForPrint.forEach(el => { el.open = true; });
  });
  window.addEventListener('afterprint', () => {
    closedForPrint.forEach(el => { el.open = false; });
  });
})();
