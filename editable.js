/* Xino-Xano · Versió editable
   Converteix les fitxes (tal com surten en paper) en un PowerPoint on cada text, línia, taula i dibuix
   és un element separat. Canva, PowerPoint i Google Presentacions l'obren i s'hi pot editar tot. */
(function(){
  const PX = 1 / 96;                       // de píxels CSS a polzades
  const PAGE_W = 8.27, PAGE_H = 11.69;     // A4
  const MX = 13 / 25.4, MY = 12 / 25.4;    // marges (els mateixos que en paper)
  const CONTENT_H = (PAGE_H - 2 * MY) / PX; // alçada útil, en píxels

  const hex = c => { const m = String(c).match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(x => parseFloat(x)); if (p.length > 3 && p[3] === 0) return null; return p.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase(); };
  const visible = el => { const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden'; };
  const isInline = el => { if (/^(svg|img|canvas)$/i.test(el.tagName)) return false; const d = getComputedStyle(el).display; return d === 'inline' || d === 'inline-block' || d === 'inline-flex'; };
  const fontOf = cs => (cs.fontFamily.split(',')[0] || 'Arial').replace(/["']/g, '').trim();

  async function toDataURL(img){
    try { const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; c.getContext('2d').drawImage(img, 0, 0); return c.toDataURL('image/png'); }
    catch (e) { const r = await fetch(img.src); const b = await r.blob(); return await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(b); }); } }

  // SVG -> PNG (amb els colors calculats, perquè les variables CSS no viatgen amb el dibuix)
  async function svgToPng(svg){
    const r = svg.getBoundingClientRect(), clone = svg.cloneNode(true), src = [svg, ...svg.querySelectorAll('*')], dst = [clone, ...clone.querySelectorAll('*')];
    src.forEach((n, i) => { const cs = getComputedStyle(n), d = dst[i]; ['fill', 'stroke', 'stroke-width', 'opacity', 'font-family', 'font-size', 'font-weight'].forEach(p => { const v = cs.getPropertyValue(p); if (v) d.style.setProperty(p, v); }); });
    clone.setAttribute('width', r.width); clone.setAttribute('height', r.height); clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
    const img = new Image(); await new Promise((ok, ko) => { img.onload = ok; img.onerror = ko; img.src = url; });
    const k = 3, c = document.createElement('canvas'); c.width = Math.max(1, Math.round(r.width * k)); c.height = Math.max(1, Math.round(r.height * k));
    const g = c.getContext('2d'); g.scale(k, k); g.drawImage(img, 0, 0, r.width, r.height); return c.toDataURL('image/png');
  }

  // fragments de text (amb negretes i colors) d'un element que només té contingut en línia
  function runs(el){
    const out = [];
    const walk = (n, inh) => {
      if (n.nodeType === 3) { const t = n.nodeValue.replace(/\s+/g, ' '); if (t) out.push({text: t, options: {...inh}}); return; }
      if (n.nodeType !== 1 || !visible(n)) return;
      const cs = getComputedStyle(n), o = {...inh, bold: parseInt(cs.fontWeight) >= 600, color: hex(cs.color) || inh.color, fontSize: parseFloat(cs.fontSize) * .75, fontFace: fontOf(cs)};
      if (n.matches('.lt, .ol')) { out.push({text: n.textContent.trim() + ' ', options: o}); return; }
      if (n.matches('.pgap')) { out.push({text: '_'.repeat(Math.max(4, Math.round(n.getBoundingClientRect().width / 8))), options: o}); return; }
      if (n.matches('.frac')) { const [a, b] = [...n.children].map(x => x.textContent); out.push({text: a + '/' + b, options: o}); return; }
      if (n.tagName === 'BR') { out.push({text: '', options: {...o, breakLine: true}}); return; }
      if (n.tagName === 'SUP') { out.push({text: n.textContent, options: {...o, superscript: true}}); return; }
      n.childNodes.forEach(c => walk(c, o));
    };
    const cs = getComputedStyle(el);
    if (el.tagName === 'LI') out.push({text: ([...el.parentNode.children].indexOf(el) + 1) + '. ', options: {bold: false, color: hex(cs.color) || '1B1B1B', fontSize: parseFloat(cs.fontSize) * .75, fontFace: fontOf(cs)}});
    el.childNodes.forEach(c => walk(c, {bold: parseInt(cs.fontWeight) >= 600, color: hex(cs.color) || '1B1B1B', fontSize: parseFloat(cs.fontSize) * .75, fontFace: fontOf(cs)}));
    // espais sobrants al principi i al final
    while (out.length && !out[0].options.breakLine && !out[0].text.trim()) out.shift();
    if (out.length) out[0].text = out[0].text.replace(/^\s+/, '');
    if (out.length) out[out.length - 1].text = out[out.length - 1].text.replace(/\s+$/, '');
    return out.filter(r => r.text || r.options.breakLine);
  }
  const hasText = el => [...el.childNodes].some(n => (n.nodeType === 3 && n.nodeValue.trim()) || (n.nodeType === 1 && visible(n) && isInline(n) && (n.textContent.trim() || n.matches('.pgap'))));
  const onlyInline = el => [...el.children].every(c => !visible(c) || (isInline(c) && !c.querySelector('svg,img,table,div')) || c.tagName === 'BR');

  // dibuixa un element (i el que conté) a la diapositiva
  async function draw(slide, el, ox, oy, done){
    if (!visible(el) || done.has(el)) return;
    done.add(el);
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return;
    const x = (r.left - ox) * PX + MX, y = (r.top - oy) * PX + MY, w = r.width * PX, h = r.height * PX;
    const cs = getComputedStyle(el);
    if (el.tagName === 'svg' || el.tagName === 'SVG') { slide.addImage({data: await svgToPng(el), x, y, w, h}); return; }
    if (el.tagName === 'IMG') { slide.addImage({data: await toDataURL(el), x, y, w, h}); return; }
    // fons i vores
    const bg = hex(cs.backgroundColor), bw = ['Top', 'Right', 'Bottom', 'Left'].map(s => parseFloat(cs['border' + s + 'Width']) || 0), bc = ['Top', 'Right', 'Bottom', 'Left'].map(s => hex(cs['border' + s + 'Color']));
    const rad = parseFloat(cs.borderTopLeftRadius) || 0, dash = cs.borderTopStyle === 'dashed' ? 'dash' : cs.borderTopStyle === 'dotted' ? 'sysDot' : 'solid';
    const all = bw.every(v => v > 0) && bc.every(c => c && c === bc[0]);
    if (bg && bg !== 'FFFFFF' || all) slide.addShape(rad > 5 ? 'roundRect' : 'rect', {x, y, w, h, fill: bg && bg !== 'FFFFFF' ? {color: bg} : {type: 'none'}, line: all ? {color: bc[0], width: bw[0] * .75, dashType: dash} : {type: 'none'}, rectRadius: rad > 5 ? Math.min(rad, Math.min(r.width, r.height) / 2) * PX : undefined});
    if (!all) [[0, x, y, w, 0], [1, x + w, y, 0, h], [2, x, y + h, w, 0], [3, x, y, 0, h]].forEach(([i, lx, ly, lw, lh]) => { if (bw[i] > 0 && bc[i]) slide.addShape('line', {x: lx, y: ly, w: lw, h: lh, line: {color: bc[i], width: bw[i] * .75, dashType: cs['border' + ['Top', 'Right', 'Bottom', 'Left'][i] + 'Style'] === 'dashed' ? 'dash' : 'solid'}}); });
    // text
    if (hasText(el) && onlyInline(el)) {
      const pl = parseFloat(cs.paddingLeft) + bw[3], pt = parseFloat(cs.paddingTop) + bw[0], pr = parseFloat(cs.paddingRight) + bw[1], pb = parseFloat(cs.paddingBottom) + bw[2];
      const rr = runs(el); if (rr.length) {
        const align = cs.textAlign === 'center' ? 'center' : cs.textAlign === 'right' || cs.textAlign === 'end' ? 'right' : 'left';
        slide.addText(rr, {x: x + pl * PX, y: y + pt * PX, w: Math.max(.2, w - (pl + pr) * PX + .12), h: Math.max(.15, h - (pt + pb) * PX), margin: 0, valign: 'top', align, lineSpacingMultiple: 1.05, fit: 'none', wrap: true});
      }
      el.querySelectorAll('*').forEach(n => done.add(n));
      return;
    }
    for (const c of el.children) await draw(slide, c, ox, oy, done);
    // text solt barrejat amb blocs (poc habitual): una caixa per a cada tros
    for (const n of el.childNodes) if (n.nodeType === 3 && n.nodeValue.trim()) { const rg = document.createRange(); rg.selectNodeContents(n); const q = rg.getBoundingClientRect();
      slide.addText(n.nodeValue.trim(), {x: (q.left - ox) * PX + MX, y: (q.top - oy) * PX + MY, w: q.width * PX + .12, h: q.height * PX, margin: 0, valign: 'top', fontSize: parseFloat(cs.fontSize) * .75, fontFace: fontOf(cs), color: hex(cs.color) || '1B1B1B'}); }
  }

  // blocs que no es poden partir entre dues pàgines (com en paper)
  function blocks(sheet){
    const out = [], push = el => out.push(el);
    const rows = grid => { const m = new Map(); [...grid.children].forEach(c => { const t = Math.round(c.getBoundingClientRect().top); if (!m.has(t)) m.set(t, []); m.get(t).push(c); }); return [...m.values()]; };
    const walk = el => {
      if (!visible(el)) return;
      if (el.matches('.pkeep, .pit, .pcg, .gr, .padult, h2, h3, p, .phead, .pname, table, li, .pbankw, .ppieces')) { push([el]); return; }
      if (el.matches('.pgrid')) { rows(el).forEach(rw => push(rw)); return; }
      if (el.matches('.readtext')) { push([el]); return; }
      if (!el.children.length) { push([el]); return; }
      [...el.children].forEach(walk);
    };
    [...sheet.children].forEach(walk);
    return out;
  }

  window.XXEditable = async function(sheets, nom){
    if (!window.PptxGenJS) await new Promise((ok, ko) => { const s = document.createElement('script'); s.src = 'assets/vendor/pptxgen.bundle.js'; s.onload = ok; s.onerror = ko; document.head.appendChild(s); });
    const pptx = new PptxGenJS(); pptx.defineLayout({name: 'A4', width: PAGE_W, height: PAGE_H}); pptx.layout = 'A4'; pptx.title = nom; pptx.company = 'Vedruna Escorial Vic';
    // còpia de la fitxa amb l'amplada del paper
    const box = document.createElement('div'); box.className = 'pxport'; box.style.cssText = `position:absolute;left:-20000px;top:0;width:${(PAGE_W - 2 * MX) / PX}px`;
    sheets.forEach(s => { const c = s.cloneNode(true); c.style.cssText = 'border:none;border-radius:0;padding:0;margin:0;box-shadow:none'; box.appendChild(c); });
    document.body.appendChild(box);
    await Promise.all([...box.querySelectorAll('img')].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
    try {
      for (const sheet of box.children) {
        let slide = pptx.addSlide(), top = null; const done = new Set();
        for (const bl of blocks(sheet)) {
          const rs = bl.map(e => e.getBoundingClientRect()), t = Math.min(...rs.map(q => q.top)), b = Math.max(...rs.map(q => q.bottom));
          if (top === null) top = t;
          if (b - top > CONTENT_H && t > top) { slide = pptx.addSlide(); top = t; }
          const ox = box.getBoundingClientRect().left;
          for (const el of bl) await draw(slide, el, ox, top, done);
        }
      }
      await pptx.writeFile({fileName: nom.replace(/[\\/:*?"<>|]+/g, '-') + '.pptx'});
    } finally { box.remove(); }
  };
})();
