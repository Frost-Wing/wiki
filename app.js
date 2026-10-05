(() => {
"use strict";
const $ = s => document.querySelector(s);
const esc = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ── Nerd Font glyphs (nf-fa range) ── */
const I = {
  home:'\uf015', book:'\uf02d', terminal:'\uf120', code:'\uf121', folder:'\uf07b', open:'\uf07c', file:'\uf15b', text:'\uf15c',
  cog:'\uf013', microchip:'\uf2db', hdd:'\uf0a0', database:'\uf1c0', sitemap:'\uf0e8', rocket:'\uf135', bug:'\uf188',
  plug:'\uf1e6', globe:'\uf0ac', lock:'\uf023', key:'\uf084', cube:'\uf1b2', cubes:'\uf1b3', bolt:'\uf0e7', wrench:'\uf0ad',
  download:'\uf019', link:'\uf0c1', ext:'\uf08e', clock:'\uf017', tag:'\uf02b', heart:'\uf004', star:'\uf005', users:'\uf0c0',
  question:'\uf059', info:'\uf05a', warn:'\uf071', tip:'\uf0eb', search:'\uf002', list:'\uf03a', tasks:'\uf0ae', puzzle:'\uf12e',
  flask:'\uf0c3', wifi:'\uf1eb', server:'\uf233', desktop:'\uf108', git:'\uf1d3', github:'\uf09b', snow:'\uf2dc',
  image:'\uf03e', bars:'\uf0c9', times:'\uf00d', copy:'\uf0c5', check:'\uf00c', left:'\uf060', right:'\uf061', dot:'\uf111', json:'\uf1c9'
};
const ic = n => I[n] || (n && n.length <= 2 ? n : I.file);
document.querySelectorAll('[data-i]').forEach(e => e.textContent = ic(e.dataset.i));
$('#burger').textContent = I.bars; $('#close').textContent = I.times;

/* ── syntax highlighting ── */
const W = a => new RegExp('\\b(?:' + a.join('|') + ')\\b');
const sp = s => s.split(' ');
const compile = rules => rules.map(([c, re]) => [c, new RegExp(re.source, re.flags + 'y')]);
const STR = /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/;
const LANGS = {
  c: compile([
    ['cm', /\/\/.*|\/\*[\s\S]*?\*\//], ['str', STR],
    ['pp', /#\s*(?:include|define|undef|ifn?def|if|elif|else|endif|pragma|error)\b/],
    ['str', /<[\w./-]+\.h>/],
    ['num', /0[xX][0-9a-fA-F_]+[uUlL]*|0[bB][01]+|\d+(?:\.\d+)?[uUlLfF]*/],
    ['kw', W(sp('if else for while do switch case default break continue return goto sizeof typedef struct union enum static extern const volatile inline register asm __asm__ __attribute__ class namespace template public private new delete'))],
    ['ty', W(sp('void char short int long float double unsigned signed bool'))],
    ['ty', /[A-Za-z_]\w*_t\b/],
    ['co', /\b(?:NULL|true|false)\b|[A-Z][A-Z0-9_]{2,}\b/],
    ['fn', /[A-Za-z_]\w*(?=\s*\()/], ['', /[A-Za-z_]\w*/],
    ['pu', /[{}()\[\];,.<>+\-*\/%=!&|^~?:]+/]
  ]),
  asm: compile([
    ['cm', /;.*|\/\/.*/], ['str', /"(?:\\.|[^"\\\n])*"|'[^'\n]*'/],
    ['lb', /[.\w@$]+(?=:(?:\s|$))/m],
    ['dr', /\.[A-Za-z_]\w*|\b(?:section|segment|global|extern|bits|org|equ|times|align|resb|resw|resd|resq|db|dw|dd|dq)\b/i],
    ['rg', /\b(?:[re]?[abcd]x|[abcd][lh]|[re]?[sd]il?|[re]?[sb]pl?|r(?:8|9|1[0-5])[dwb]?|[cdefgs]s|cr[0-4]|rip|rflags|eflags|xmm\d+)\b/i],
    ['kw', /\b(?:mov[a-z]*|lea|push[a-z]*|pop[a-z]*|call|ret[a-z]*|jmp|j[a-z]{1,3}|cmp|test|add|sub|i?mul|i?div|inc|dec|and|or|xor|not|neg|sh[lr]|sa[lr]|ro[lr]|int3?|iret[a-z]*|syscall|sysret[a-z]*|cli|sti|hlt|nop|lgdt|lidt|ltr|in|out|rep[a-z]*|stos[bwdq]|lods[bwdq]|swapgs|wrmsr|rdmsr|cpuid|leave|enter|xchg|cld|std)\b/i],
    ['num', /\b0[xX][0-9a-fA-F]+\b|\b\d[0-9a-fA-F]*h\b|\b\d+\b/],
    ['', /[A-Za-z_.][\w.]*/], ['pu', /[\[\](),:+\-*\/]+/]
  ]),
  sh: compile([
    ['cm', /#.*/], ['pr', /^\$(?=\s)/m], ['str', /"(?:\\.|[^"\\])*"|'[^']*'/],
    ['va', /\$\{?\w+\}?|\$\(/], ['fl', /--?[A-Za-z][\w-]*/],
    ['kw', /(?:if|then|else|elif|fi|for|do|done|while|exec|until|case|esac|in|function|export|return|exit|set|unset|source|alias)(?![\w-])/],
    ['fn', /(?:make|gcc|g\+\+|ld|as|nasm|git|sudo|qemu-system-x86_64|qemu-img|xorriso|grub-mkrescue|mount|umount|cat|echo|ls|cd|cp|mv|rm|mkdir|dd|chmod|objdump|nm|gdb|tar|sh|bash|apt|pacman|pip|npm|mkfs\.ext2|e2fsck|losetup|exec)(?![\w.-])/],
    ['num', /\b\d+\b/], ['', /[A-Za-z_.\/~][\w.\/+~@%:=-]*/], ['pu', /[|&;<>(){}\[\]=\\]+/]
  ]),
  py: compile([
    ['cm', /#.*/], ['str', /"""[\s\S]*?"""|'''[\s\S]*?'''|[fbru]*(?:"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')/i],
    ['pp', /@\w+/],
    ['kw', W(sp('def class return if elif else for while in not and or is import from as with try except finally raise yield lambda pass break continue global async await'))],
    ['co', /\b(?:self|None|True|False)\b/], ['num', /\d+(?:\.\d+)?/],
    ['fn', /[A-Za-z_]\w*(?=\()/], ['', /[A-Za-z_]\w*/], ['pu', /[{}()\[\],.:+\-*\/%=<>!&|^~]+/]
  ]),
  json: compile([
    ['key', /"(?:\\.|[^"\\\n])*"(?=\s*:)/], ['str', /"(?:\\.|[^"\\\n])*"/],
    ['num', /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/], ['lit', /\b(?:true|false|null)\b/], ['pu', /[{}\[\],:]/]
  ]),
  log: compile([
    ['tree', /[└│├─]+/], ['ok', /\[\+\]|\bdone\b/], ['inf', /\[i\]|\binfo\b/], ['wrn', /\[!\]|\bwarn\b/],
    ['bad', /\[-\]|\b(?:error|fail(?:ed)?|panic)\b/], ['file', /[\w-]+\.[ch](?=:)/],
    ['num', /0x[0-9A-Fa-f]+|\b\d+(?:\.\d+)?\b/], ['', /\w+/]
  ])
};
const ALIAS = {h:'c', cpp:'c', 'c++':'c', hpp:'c', s:'asm', nasm:'asm', bash:'sh', shell:'sh', make:'sh', makefile:'sh', zsh:'sh', python:'py', jsonc:'json', serial:'log'};
const META = {c:['code','C'], asm:['microchip','asm'], sh:['terminal','shell'], py:['code','python'], json:['json','json'], log:['text','log']};
function hl(code, lang) {
  const rules = LANGS[lang];
  if (!rules) return esc(code);
  let out = '', pos = 0; const n = code.length;
  while (pos < n) {
    let hit = null;
    for (const [cls, re] of rules) {
      re.lastIndex = pos; const m = re.exec(code);
      if (m && m[0].length) { hit = [cls, m[0]]; break; }
    }
    if (!hit) { out += esc(code[pos]); pos++; continue; }
    out += hit[0] ? `<span class="t-${hit[0]}">${esc(hit[1])}</span>` : esc(hit[1]);
    pos += hit[1].length;
  }
  return out;
}

/* ── markdown ── */
let codeRaw = [];
/* images: ![alt](src "caption")   ![alt|480](src)   or a pasted <img ...> tag */
const safeSrc = u => /^(https?:|data:image\/)/i.test(u) || !/^[a-z][a-z0-9+.-]*:/i.test(u);
function imageBlock(src, alt, caption, w, h, maxw) {
  if (!safeSrc(src)) return `<p><span class="y">[!] warn</span> <span class="p">wiki.c:</span> <span class="w">blocked image source</span></p>`;
  const dims = (w && h) ? ` width="${+w}" height="${+h}"` : '';
  const style = maxw ? ` style="max-width:${+maxw}px"` : '';
  return `<figure class="img"><div class="chead" data-notype><span class="cl">${I.image} image</span><span class="ct">${esc(alt || src.split('/').pop())}</span><a class="btn" href="${esc(src)}" target="_blank" rel="noopener noreferrer">${I.ext} open</a></div>` +
    `<div class="ibody"><a href="${esc(src)}" target="_blank" rel="noopener noreferrer"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"${dims}${style}></a></div>` +
    (caption ? `<figcaption>${inline(caption)}</figcaption>` : '') + `</figure>`;
}
function parseImageLine(l) {
  let m = l.match(/^!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"([^"]*)")?\s*\)\s*$/);
  if (m) {
    let alt = m[1], maxw = 0; const o = alt.match(/^(.*?)\|(\d+)$/);
    if (o) { alt = o[1]; maxw = o[2]; }
    return imageBlock(m[2], alt, m[3] || '', 0, 0, maxw);
  }
  if (/^<img\s/i.test(l)) {
    const a = n => (l.match(new RegExp('\\s' + n + '\\s*=\\s*"([^"]*)"', 'i')) || [])[1] || '';
    const src = a('src');
    if (src) return imageBlock(src, a('alt'), '', a('width'), a('height'), 0);
  }
  return null;
}
function codeBlock(raw, lang, title) {
  const key = ALIAS[lang] || lang || 'text';
  const meta = META[key] || ['file', lang || 'text'];
  const idx = codeRaw.push(raw) - 1;
  return `<figure class="code"><div class="chead" data-notype><span class="cl">${ic(meta[0])} ${esc(meta[1])}</span><span class="ct">${esc(title || '')}</span><button class="copy" type="button" data-ci="${idx}">${I.copy} copy</button></div><pre><code>${hl(raw, key)}</code></pre></figure>`;
}
function inline(s) {
  s = esc(s);
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (m, c) => { codes.push(c); return '\u0000' + (codes.length - 1) + '\u0000'; });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => {
    if (u[0] === '#') return `<a class="in" href="#/${u.slice(1)}">${t}</a>`;
    if (/^(https?:|mailto:)/i.test(u)) return `<a class="ex" href="${u}" target="_blank" rel="noopener noreferrer">${t} ${I.ext}</a>`;
    return t;
  });
  return s.replace(/\u0000(\d+)\u0000/g, (m, i) => `<code>${codes[i]}</code>`);
}
const CALL = {info:['[i]','info'], warn:['[!]','warn'], tip:['[+]','tip'], err:['[-]','error']};
const isBlock = l => /^(`{3,}|!\[|<img\s|#{1,3}\s|>|\s*[-*]\s+|\s*\d+\.\s+|\||---+\s*$)/.test(l);
function md(src) {
  const L = src.replace(/\r/g, '').split('\n'); let i = 0; const out = [];
  while (i < L.length) {
    const l = L[i]; let m;
    if (!l.trim()) { i++; continue; }
    { const im = parseImageLine(l.trim()); if (im) { out.push(im); i++; continue; } }
    if ((m = l.match(/^(`{3,})\s*([\w+-]*)\s*(.*)$/))) {
      const buf = []; i++;
      while (i < L.length && L[i].trim() !== m[1]) buf.push(L[i++]);
      i++; out.push(codeBlock(buf.join('\n'), m[2].toLowerCase(), m[3])); continue;
    }
    if ((m = l.match(/^(#{1,3})\s+(.*)$/))) {
      const n = m[1].length, t = inline(m[2]);
      out.push(n === 1 ? `<h1>${t}</h1><div class="eq" aria-hidden="true" data-notype>${'='.repeat(160)}</div>`
        : n === 2 ? `<h2><span class="dim">└─</span> <span class="ic">${I.right}</span>${t}</h2>`
        : `<h3><span class="ic">${I.dot}</span>${t}</h3>`);
      i++; continue;
    }
    if (/^---+\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
    if (l[0] === '>') {
      const rows = [];
      while (i < L.length && L[i][0] === '>') rows.push(L[i++].replace(/^>\s?/, ''));
      let kind = 'info'; const k = rows[0].match(/^\[!(\w+)\]\s*(.*)$/);
      if (k) { kind = CALL[k[1]] ? k[1] : 'info'; rows[0] = k[2]; }
      const paras = rows.join('\n').split(/\n\s*\n/).map(x => x.trim()).filter(Boolean).map(x => `<p>${inline(x.replace(/\n/g, ' '))}</p>`);
      out.push(`<div class="call ${kind}"><div class="ch">${CALL[kind][0]} ${CALL[kind][1]}</div>${paras.join('')}</div>`);
      continue;
    }
    if (/^\s*[-*]\s+/.test(l)) {
      const it = []; while (i < L.length && /^\s*[-*]\s+/.test(L[i])) it.push(`<li>${inline(L[i++].replace(/^\s*[-*]\s+/, ''))}</li>`);
      out.push(`<ul>${it.join('')}</ul>`); continue;
    }
    if (/^\s*\d+\.\s+/.test(l)) {
      const it = []; while (i < L.length && /^\s*\d+\.\s+/.test(L[i])) it.push(`<li>${inline(L[i++].replace(/^\s*\d+\.\s+/, ''))}</li>`);
      out.push(`<ol>${it.join('')}</ol>`); continue;
    }
    if (l[0] === '|') {
      const rows = []; while (i < L.length && L[i][0] === '|') rows.push(L[i++]);
      const cells = r => r.replace(/^\||\|\s*$/g, '').split('|').map(c => inline(c.trim()));
      const head = cells(rows[0]); const body = rows.slice(/^\|[\s:|-]+\|?\s*$/.test(rows[1] || '') ? 2 : 1);
      out.push(`<div class="tw"><table><thead><tr>${head.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${body.map(r => `<tr>${cells(r).map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    const para = [];
    while (i < L.length && L[i].trim() && !(para.length && isBlock(L[i]))) para.push(L[i++].trim());
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return out.join('\n');
}

/* ── pages ── */
let PAGES = [], GROUPS = [], FIG = '';
function parsePage(slug, text) {
  const m = text.replace(/\r/g, '').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta = {}; let src = text;
  if (m) { src = m[2]; m[1].split('\n').forEach(l => { const k = l.match(/^(\w+):\s*(.*)$/); if (k) meta[k[1]] = k[2].trim(); }); }
  return { slug, title: meta.title || slug, icon: ic(meta.icon), group: meta.group || 'Pages', desc: meta.desc || '', src };
}
async function loadAll() {
  const get = async url => { const r = await fetch(url, {cache: 'no-cache'}); if (!r.ok) throw new Error(url + ' (' + r.status + ')'); return r.text(); };
  const names = JSON.parse(await get('pages/manifest.json'));
  const texts = await Promise.all(names.map(n => get(`pages/${n}.md`)));
  PAGES = names.map((n, i) => parsePage(n, texts[i]));
  GROUPS = [...new Set(PAGES.map(p => p.group))];
  FIG = (await get('figlet.txt').catch(() => '')).replace(/\n+$/, '');
}

const ps1 = path => `<span class="w">[</span><span class="g">0</span><span class="w">]</span> <span class="w">${esc(path)}</span> <span class="w">@</span> <span class="r">root</span> <span class="w">$</span>`;
const clockText = () => {
  const d = new Date(), z = n => String(n).padStart(2, '0');
  return `${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())} ${z(d.getDate())}/${z(d.getMonth() + 1)}/${d.getFullYear()}`;
};

function navTree(cls) {
  return GROUPS.map(g => `<div class="gh"><span class="dim">└─</span> <span class="ic">${I.folder}</span>${esc(g)}</div>` +
    PAGES.filter(p => p.group === g).map(p =>
      `<a href="#/${p.slug}" data-slug="${p.slug}"><span class="tr">   └─ </span><span class="ic ${cls || 'p'}">${p.icon}</span> ${esc(p.title)}${p.desc ? `<span class="dim"> - ${esc(p.desc)}</span>` : ''}</a>`).join('')).join('');
}
function homeHTML() {
  return `<pre class="figlet">${esc(FIG)}</pre>
<p class="lead"><span class="g">Welcome to FrostWing wiki!</span> <span class="w">This is the documentation for the</span> <span class="p">FrostWing</span> <span class="w">operating system.</span></p>
<div class="kv"><span class="w">Github  </span><span class="w">:</span> <a href="https://github.com/Frost-Wing" target="_blank" rel="noopener noreferrer">https://github.com/Frost-Wing</a>
<span class="w">Pages   </span><span class="w">:</span> <span class="p">${PAGES.length}</span>
<span class="w">Time    </span><span class="w">:</span> <span class="w" id="clock">${clockText()}</span></div>
Open the <span class="g">${I.bars}</span> menu in the top-left, pick a page below, or type <span class="g">help</span> at the prompt.</p>
<h2><span class="dim">└─</span> <span class="ic">${I.right}</span>Navigation</h2>
<div class="nav">${navTree()}</div>
<p class="eof"><span class="g">[+] done</span> <span class="p">wiki.c:</span> <span class="w">loaded ${PAGES.length} pages</span></p>`;
}
function pageHTML(p, idx) {
  codeRaw = [];
  const prev = PAGES[idx - 1], next = PAGES[idx + 1];
  return `<div class="cat">${ps1('/' + p.slug)} cat ${p.slug}.md</div>
<h1><span class="ic">${p.icon}</span> ${esc(p.title)}</h1><div class="eq" aria-hidden="true" data-notype>${'='.repeat(160)}</div>
${p.desc ? `<p class="desc">${esc(p.desc)}</p>` : ''}
${md(p.src)}
<p class="eof"><span class="g">[+] done</span> <span class="p">wiki.c:</span> <span class="w">end of ${p.slug}.md</span></p>
<div class="pn"><span>${prev ? `<a href="#/${prev.slug}">${I.left} ${esc(prev.title)}</a>` : ''}</span><span>${next ? `<a href="#/${next.slug}">${esc(next.title)} ${I.right}</a>` : ''}</span></div>`;
}
function notFound(slug) {
  return `<p><span class="y">[!] warn</span> <span class="p">wiki.c:</span> <span class="w">page not found: ${esc(slug)}</span></p>
<p><a class="in" href="#/">${I.home} back to /</a></p>`;
}

/* ── typing engine ── */
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let run = 0, typing = false, skip = false, userScrolled = false;
function typeInto(root, done) {
  const my = ++run; typing = true; skip = false; userScrolled = false;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = []; let n;
  while ((n = walker.nextNode())) {
    const el = n.parentElement;
    if (el.closest('[data-notype]')) continue;
    if (!el.closest('pre') && !/\S/.test(n.nodeValue)) continue;
    nodes.push([n, n.nodeValue]);
  }
  const total = nodes.reduce((a, x) => a + x[1].length, 0);
  const waits = [...root.querySelectorAll('figure.img')].map(f =>
    [f, nodes.filter(([nd]) => f.compareDocumentPosition(nd) & Node.DOCUMENT_POSITION_PRECEDING).length]);
  const finish = () => { nodes.forEach(([nd, t]) => nd.nodeValue = t); waits.forEach(([f]) => f.classList.remove('wait')); cur.remove(); typing = false; done(); };
  const cur = document.createElement('span'); cur.className = 'cur';
  if (reduced || !total) { finish(); return; }
  nodes.forEach(([nd]) => nd.nodeValue = '');
  waits.forEach(([f]) => f.classList.add('wait'));
  const rate = Math.max(110, total / 2.2);
  let ni = 0, ci = 0, shown = 0; const t0 = performance.now();
  (function frame(now) {
    if (my !== run) { cur.remove(); return; }
    if (skip) { finish(); return; }
    let need = Math.min(total, Math.floor((now - t0) / 1000 * rate)) - shown;
    while (need > 0 && ni < nodes.length) {
      const [nd, full] = nodes[ni];
      const take = Math.min(need, full.length - ci);
      ci += take; need -= take; shown += take;
      nd.nodeValue = full.slice(0, ci);
      if (ci >= full.length) { ni++; ci = 0; }
    }
    waits.forEach(([f, at]) => { if (ni >= at) f.classList.remove('wait'); });
    if (ni >= nodes.length) { finish(); return; }
    const nd = nodes[ni][0]; nd.parentNode.insertBefore(cur, nd.nextSibling);
    if (!userScrolled) { const b = cur.getBoundingClientRect().bottom; if (b > innerHeight - 70) scrollBy(0, b - innerHeight + 70); }
    requestAnimationFrame(frame);
  })(performance.now());
}
addEventListener('wheel', () => { userScrolled = true; }, {passive: true});
addEventListener('touchmove', () => { userScrolled = true; }, {passive: true});
$('#page').addEventListener('pointerdown', () => { if (typing) skip = true; });
addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
  if (typing && !e.metaKey && !e.ctrlKey && !e.altKey && e.target.tagName !== 'INPUT') skip = true;
});

/* ── drawer ── */
const dn = $('#dn');
function openMenu() { document.body.classList.add('open'); $('#drawer').setAttribute('aria-hidden', 'false'); $('#burger').setAttribute('aria-expanded', 'true'); $('#close').focus(); }
function closeMenu() { if (!document.body.classList.contains('open')) return; document.body.classList.remove('open'); $('#drawer').setAttribute('aria-hidden', 'true'); $('#burger').setAttribute('aria-expanded', 'false'); $('#burger').focus(); }
$('#burger').addEventListener('click', openMenu);
$('#close').addEventListener('click', closeMenu);
$('#scrim').addEventListener('click', closeMenu);
dn.addEventListener('click', e => { if (e.target.closest('a')) document.body.classList.remove('open'); });

/* ── router ── */
let current = '';
function route() {
  const slug = decodeURIComponent((location.hash.replace(/^#\/?/, '') || '')).replace(/\/$/, '');
  current = slug;
  document.body.classList.remove('open');
  $('#drawer').setAttribute('aria-hidden', 'true'); $('#burger').setAttribute('aria-expanded', 'false');
  dn.querySelectorAll('a').forEach(a => {
    const on = a.dataset.slug === slug; a.classList.toggle('on', on);
    a.querySelector('.dot')?.remove();
    if (on) a.insertAdjacentHTML('beforeend', ` <span class="g dot">${I.dot}</span>`);
  });
  const idx = PAGES.findIndex(p => p.slug === slug);
  const page = $('#page'); $('#shell').hidden = true; $('#out').innerHTML = '';
  $('#path').textContent = '/' + slug;
  $('#ps1').innerHTML = ps1('/' + slug);
  if (!slug) { page.innerHTML = homeHTML(); document.title = 'FrostWing Wiki'; }
  else if (idx < 0) { page.innerHTML = notFound(slug); document.title = 'Not found - FrostWing Wiki'; }
  else { page.innerHTML = pageHTML(PAGES[idx], idx); document.title = PAGES[idx].title + ' - FrostWing Wiki'; }
  scrollTo(0, 0);
  typeInto(page, () => { $('#shell').hidden = false; });
}
addEventListener('hashchange', route);
setInterval(() => { const c = $('#clock'); if (c && !typing) c.textContent = clockText(); }, 1000);

/* ── broken images ── */
document.addEventListener('error', e => {
  const t = e.target; if (!(t instanceof HTMLImageElement) || !t.closest('figure.img')) return;
  t.closest('.ibody').innerHTML = `<div class="imgerr"><span class="y">[!] warn</span> <span class="p">wiki.c:</span> could not load image: ${esc(t.getAttribute('src') || '')}</div>`;
}, true);

/* ── copy buttons ── */
document.addEventListener('click', async e => {
  const b = e.target.closest('.copy'); if (!b) return;
  const text = codeRaw[+b.dataset.ci] ?? '';
  try { await navigator.clipboard.writeText(text); }
  catch { const t = document.createElement('textarea'); t.value = text; t.style.cssText = 'position:fixed;opacity:0'; document.body.append(t); t.select(); try { document.execCommand('copy'); } catch {} t.remove(); }
  b.classList.add('ok'); b.textContent = I.check + ' copied';
  setTimeout(() => { b.classList.remove('ok'); b.textContent = I.copy + ' copy'; }, 1400);
});

/* ── tiny shell ── */
const cmd = $('#cmd'), out = $('#out');
const say = html => { out.insertAdjacentHTML('beforeend', `<div>${html}</div>`); };
const find = q => {
  q = q.toLowerCase().replace(/\.md$/, '').replace(/^\/+/, '');
  return PAGES.find(p => p.slug === q) || PAGES.find(p => p.slug.startsWith(q)) || PAGES.find(p => p.title.toLowerCase().includes(q));
};
const COMMANDS = ['help', 'ls', 'cd', 'cat', 'pwd', 'whoami', 'uname', 'menu', 'clear'];
function exec(line) {
  const [c, ...a] = line.trim().split(/\s+/); const arg = a.join(' ');
  say(`${ps1('/' + current)} ${esc(line)}`);
  if (!c) return;
  switch (c) {
    case 'help': say(`<span class="p">help</span>  commands\n<span class="p">ls</span>    list pages\n<span class="p">cd</span>    open a page (cd /, cd memory)\n<span class="p">menu</span>  open the side menu\n<span class="p">clear</span> retype this page`); break;
    case 'ls': say(PAGES.map(p => `<a href="#/${p.slug}" class="p">${p.slug}/</a>`).join('  ')); break;
    case 'cd': case 'cat': case 'open': {
      if (!arg || arg === '/' || arg === '..' || arg === '~') { location.hash = '#/'; break; }
      const p = find(arg);
      if (p) location.hash = '#/' + p.slug; else say(`<span class="y">[!] warn</span> <span class="p">sh:</span> no such page: ${esc(arg)}`);
      break;
    }
    case 'pwd': say(esc('/' + current)); break;
    case 'whoami': say('<span class="r">root</span>'); break;
    case 'uname': say('FrostWing x86_64 (wiki, ring-3)'); break;
    case 'menu': openMenu(); break;
    case 'clear': route(); break;
    default: say(`<span class="y">[!] warn</span> <span class="p">sh:</span> command not found: ${esc(c)}`);
  }
}
cmd.addEventListener('keydown', e => {
  if (e.key === 'Enter') { const v = cmd.value; cmd.value = ''; exec(v); }
  if (e.key === 'Tab') {
    e.preventDefault();
    const parts = cmd.value.split(/\s+/);
    const pool = parts.length < 2 ? COMMANDS : PAGES.map(p => p.slug);
    const hit = pool.filter(x => x.startsWith(parts[parts.length - 1] || ''));
    if (hit.length === 1) { parts[parts.length - 1] = hit[0]; cmd.value = parts.join(' ') + ' '; }
  }
});
$('#shell').addEventListener('click', e => { if (!e.target.closest('a')) cmd.focus(); });

loadAll().then(() => {
  dn.innerHTML = `<a href="#/" data-slug=""><span class="ic g">${I.home}</span> Home</a>` + navTree('p');
  route();
}).catch(err => {
  const file = location.protocol === 'file:';
  $('#page').innerHTML = `<p><span class="y">[!] warn</span> <span class="p">wiki.c:</span> <span class="w">could not load pages: ${esc(String(err.message || err))}</span></p>` +
    (file ? `<p>This wiki loads its pages with <code>fetch</code>, which browsers block on <code>file://</code>.<br>Run <code>python3 -m http.server</code> in this folder and open <span class="g">http://localhost:8000</span>.</p>` : '');
});
})();