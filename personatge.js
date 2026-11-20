/* Xino-Xano · El personatge de l'alumne: evolucions i personalització.
   Dues línies d'evolució de 12 etapes (vida i robot). Cada etapa es dibuixa amb SVG i
   dona uns punts d'ancoratge (cap, ulls, boca, coll, mà) on es col·loquen els complements. */

const PCOL = {vermell:'#e8434f', taronja:'#ff8a3d', groc:'#f2c230', llima:'#9bd13f', verd:'#2fbf71', turquesa:'#1fb5b0', cel:'#45b4f0', blau:'#4f7cff',
  indi:'#5b4fd6', lila:'#9b6bff', rosa:'#ff6fae', marro:'#a86b45', gris:'#8a94a6', negre:'#3a3f52', blanc:'#f1eee6'};
const PCOL_NOM = {vermell:'Vermell', taronja:'Taronja', groc:'Groc', llima:'Llima', verd:'Verd', turquesa:'Turquesa', cel:'Cel', blau:'Blau', indi:'Indi',
  lila:'Lila', rosa:'Rosa', marro:'Marró', gris:'Gris', negre:'Negre', blanc:'Blanc'};
const INK = '#22304f';
const rgbOf = h => [1,3,5].map(i => parseInt(h.slice(i, i + 2), 16));
const mixC = (a, b, t) => { const x = rgbOf(a), y = rgbOf(b); return '#' + x.map((v,i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2,'0')).join(''); };
const dkC = (c, t = .28) => mixC(c, '#000000', t), ltC = (c, t = .45) => mixC(c, '#ffffff', t);
const f1 = n => +n.toFixed(1);

/* ---------- evolucions ---------- */
const EVO_XP = [0, 50, 150, 300, 500, 800, 1200, 1700, 2400, 3300, 4500, 6000];
const EVO_MAX = EVO_XP.length;
const LLEGENDA_XP = 1000; // un cop al màxim, una estrella de llegenda cada 1.000 punts
const EVO_NOM = {
  mascota:['Cèl·lula','Cèl·lula viatgera','Microbi','Capgròs','Peixet','Granota','Sargantana','Dragonet','Drac alat','Drac jove','Drac guardià','Drac llegendari'],
  robot:['Femella de cargol','Cargol','Engranatge','Pila','Robot de rodes','Robot de pinces','Robot caminant','Robot explorador','Robot volador','Androide','Robot gegant','Robot llegendari']};
const EVO_NOU = { // què li passa en arribar a cada etapa
  mascota:['','Li han sortit uns pèls petits per nedar.','Ja es mou com vol i té bracets.','Té cua i neda pels tolls.','Li han sortit aletes.','Ja surt de l\'aigua i salta.','Té potes, cua i mans.','Li han sortit banyes i escates.','Té les primeres ales.','Les ales són grans i ja vola.','Té cresta i una armadura d\'escates.','Té ales immenses, una gemma al front i una aura daurada.'],
  robot:['','Ja té un cos de cargol.','Ara gira com un engranatge.','Té energia pròpia i potes.','Té rodes i una antena.','Té braços amb pinces.','Ja camina amb dues cames.','Té pantalla al pit i espatlleres.','Té propulsors i vola.','Té un casc nou i un visor.','És enorme i té un nucli d\'energia.','Té ales d\'energia i brilla com cap altre robot.']};
const evoOf = xp => { let k = 0; for (let i = 0; i < EVO_XP.length; i++) if (xp >= EVO_XP[i]) k = i; return k + 1; };
const evoInfo = m => { const e = evoOf(m.xp || 0), max = e === EVO_MAX, from = EVO_XP[e - 1], to = max ? null : EVO_XP[e];
  const lleg = max ? Math.floor(((m.xp || 0) - EVO_XP[EVO_MAX - 1]) / LLEGENDA_XP) : 0;
  return {e, max, nom: EVO_NOM[m.style === 'robot' ? 'robot' : 'mascota'][e - 1], falta: max ? 0 : to - m.xp, pct: max ? (((m.xp || 0) - EVO_XP[EVO_MAX - 1]) % LLEGENDA_XP) / LLEGENDA_XP : (m.xp - from) / (to - from), lleg}; };

/* ---------- cossos: línia de la vida ---------- */
// Cada funció torna {back, shape, fill?, over, front, a:{head:[x,y,w], eyes:[x,y,dx,s], mouth:[x,y,s], neck:[x,y,w], hand:[x,y]|null}}
function vidaBody(e, c, c2){
  const D = dkC(c), L = ltC(c), B = c2;
  if (e === 1) return {fill: ltC(c, .25),
    back:`<circle cx="60" cy="68" r="32" fill="${c}" opacity=".18"/>`,
    shape:`<circle cx="60" cy="68" r="27"/>`,
    over:`<circle cx="60" cy="68" r="27" fill="none" stroke="${D}" stroke-width="2.5"/><circle cx="74" cy="83" r="6.5" fill="${B}" opacity=".7"/><circle cx="75" cy="82" r="2.4" fill="${dkC(B)}" opacity=".7"/><ellipse cx="45" cy="82" rx="3.5" ry="2" fill="${D}" opacity=".35"/><ellipse cx="80" cy="60" rx="2.5" ry="1.6" fill="${D}" opacity=".35"/><path d="M42 52 a22 22 0 0 1 14 -9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>`,
    a:{head:[60,42,36], eyes:[60,64,8,.8], mouth:[60,74,.8], neck:[60,92,34], hand:null}};
  if (e === 2) { const cil = Array.from({length:18}, (_,i) => { const t = i / 18 * Math.PI * 2, x1 = 60 + 29 * Math.cos(t), y1 = 68 + 26 * Math.sin(t), x2 = 60 + 36 * Math.cos(t + .12), y2 = 68 + 33 * Math.sin(t + .12);
      return `<path d="M${f1(x1)} ${f1(y1)} Q${f1((x1 + x2) / 2 + 3 * Math.sin(t))} ${f1((y1 + y2) / 2 - 3 * Math.cos(t))} ${f1(x2)} ${f1(y2)}" stroke="${D}" stroke-width="2" fill="none" stroke-linecap="round"/>`; }).join('');
    return {fill: ltC(c, .2), back: cil, shape:`<ellipse cx="60" cy="68" rx="29" ry="26"/>`,
      over:`<ellipse cx="60" cy="68" rx="29" ry="26" fill="none" stroke="${D}" stroke-width="2.5"/><circle cx="77" cy="80" r="6" fill="${B}" opacity=".7"/><circle cx="43" cy="81" r="4" fill="${B}" opacity=".45"/><path d="M40 54 a24 22 0 0 1 14 -9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>`,
      a:{head:[60,43,38], eyes:[60,63,9,.9], mouth:[60,74,.9], neck:[60,92,36], hand:null}}; }
  if (e === 3) return {back:`<path d="M48 92 q-6 8 -2 16 q2 4 -2 8" stroke="${D}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M72 92 q6 8 2 16 q-2 4 2 8" stroke="${D}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
    shape:`<ellipse cx="60" cy="66" rx="26" ry="25"/><circle cx="35" cy="78" r="9"/><circle cx="85" cy="76" r="9"/><circle cx="50" cy="91" r="7"/><circle cx="70" cy="91" r="7"/>`,
    over:`<ellipse cx="62" cy="76" rx="15" ry="10" fill="${B}" opacity=".35"/><path d="M40 50 a24 22 0 0 1 14 -9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>`,
    a:{head:[60,42,40], eyes:[60,62,10,1], mouth:[60,74,1], neck:[60,88,38], hand:null}};
  if (e === 4) return {back:`<path d="M76 74 C92 66 98 84 112 76 C108 92 92 98 76 88 Z" fill="${D}"/><path d="M84 78 C94 76 100 82 106 80" stroke="${L}" stroke-width="2" fill="none" opacity=".6"/>`,
    shape:`<ellipse cx="56" cy="70" rx="30" ry="25"/>`,
    over:`<ellipse cx="56" cy="82" rx="19" ry="11" fill="${B}" opacity=".55"/><path d="M34 56 a26 22 0 0 1 14 -9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>`,
    a:{head:[56,45,42], eyes:[56,63,11,1.05], mouth:[56,76,1], neck:[56,90,40], hand:null}};
  if (e === 5) return {back:`<path d="M84 70 L108 52 Q104 70 108 90 Z" fill="${D}"/><path d="M42 48 Q58 26 76 46 Z" fill="${D}"/>`,
    shape:`<ellipse cx="58" cy="70" rx="32" ry="25"/>`,
    over:`<ellipse cx="58" cy="82" rx="21" ry="11" fill="${B}" opacity=".6"/><path d="M80 62 q-5 8 0 16 M75 64 q-4 6 0 12" stroke="${D}" stroke-width="2" fill="none" opacity=".55"/>`,
    front:`<path d="M38 80 Q26 84 24 96 Q36 94 44 86 Z" fill="${L}" stroke="${D}" stroke-width="1.5"/>`,
    a:{head:[56,46,44], eyes:[56,64,11,1.05], mouth:[56,77,1], neck:[58,92,42], hand:null}};
  if (e === 6) return {back:`<ellipse cx="30" cy="92" rx="13" ry="9" fill="${D}"/><ellipse cx="90" cy="92" rx="13" ry="9" fill="${D}"/>`,
    shape:`<ellipse cx="60" cy="76" rx="32" ry="24"/><circle cx="45" cy="53" r="12"/><circle cx="75" cy="53" r="12"/>`,
    over:`<ellipse cx="60" cy="86" rx="21" ry="12" fill="${B}" opacity=".6"/>`,
    front:`<path d="M42 96 q-6 6 -10 6 h18 q-2 -4 -2 -6 z M78 96 q6 6 10 6 h-18 q2 -4 2 -6 z" fill="${D}"/>`,
    a:{head:[60,41,50], eyes:[60,53,15,1.05], mouth:[60,70,1.25], neck:[60,82,46], hand:null}};
  if (e === 7) return {back:`<path d="M74 96 Q104 104 102 82 Q100 72 92 76 Q98 84 90 92 Q82 96 72 92 Z" fill="${D}"/>`,
    shape:`<circle cx="60" cy="48" r="20"/><ellipse cx="60" cy="84" rx="21" ry="22"/>`,
    over:`<ellipse cx="60" cy="88" rx="12" ry="15" fill="${B}" opacity=".75"/>${[80,86,92].map(y=>`<path d="M51 ${y} h18" stroke="${dkC(B,.15)}" stroke-width="1.4" opacity=".6"/>`).join('')}`,
    front:limbs(c, D, 'curt'),
    a:{head:[60,28,38], eyes:[60,46,8.5,.95], mouth:[60,58,.9], neck:[60,67,30], hand:[85,88]}};
  return dragon(e, c, c2);
}
function limbs(c, D, k){
  const arm = (x, s) => `<path d="M${x} 74 q${12 * s} 6 ${14 * s} 16" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M${x} 74 q${12 * s} 6 ${14 * s} 16" stroke="${D}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".35"/>`;
  const leg = x => `<ellipse cx="${x}" cy="104" rx="9" ry="5.5" fill="${D}"/>`;
  return arm(43, -1) + arm(77, 1) + leg(49) + leg(71);
}
function dragon(e, c, c2){
  const D = dkC(c), L = ltC(c), B = c2, k = e - 8; // 0..4
  const bodyR = [21, 22, 23, 25, 26][k], headR = [21, 21, 22, 22, 23][k];
  const wx = [0, 24, 32, 36, 39][k], wy = [0, 22, 32, 42, 50][k];
  const wing = s => { if (!wx) return ''; const x0 = 60 + s * 16, y0 = 70, w = wx / 40;
    const tip = [x0 + s * wx, y0 - wy], m1 = [x0 + s * 30 * w, y0 + 2], m2 = [x0 + s * 16 * w, y0 + 10];
    return `<path d="M${x0} ${y0} L${f1(tip[0])} ${f1(tip[1])} Q${f1(tip[0] - s * 4)} ${f1(y0 - 6)} ${f1(m1[0])} ${f1(m1[1])} Q${f1(m1[0] - s * 8)} ${f1(y0 + 2)} ${f1(m2[0])} ${f1(m2[1])} Q${x0 + s * 6} ${y0 + 6} ${x0} ${y0 + 12} Z" fill="${e === 12 ? `url(#gw${s > 0 ? 'r' : 'l'})` : ltC(mixC(c, B, .2), .3)}" stroke="${D}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M${x0} ${y0} L${f1(m1[0])} ${f1(m1[1])} M${x0} ${y0} L${f1(m2[0])} ${f1(m2[1])}" stroke="${D}" stroke-width="1.6" opacity=".6"/>`; };
  const tail = `<path d="M70 98 Q100 108 104 86 Q106 76 98 74 Q102 84 94 92 Q84 98 70 92 Z" fill="${D}"/>` +
    (e === 12 ? `<path d="M98 74 q-6 -10 2 -16 q-1 7 5 6 q4 6 -7 10 z" fill="#ffb02e"/><path d="M99 72 q-3 -6 1 -9 q0 4 3 4 q2 3 -4 5 z" fill="#fff3a0"/>`
      : `<path d="M98 74 l-4 -9 l10 3 z" fill="${B}"/>`);
  const hornL = [5, 8, 11, 13, 16][k];
  const horns = `<path d="M${50} ${48 - headR + 6} q-4 -${hornL} -${2 + k} -${hornL + 2} q${4 + k} ${hornL * .5} ${8} ${hornL - 2} z" fill="${ltC(B, .3)}" stroke="${dkC(B)}" stroke-width="1.2"/>
    <path d="M${70} ${48 - headR + 6} q4 -${hornL} ${2 + k} -${hornL + 2} q-${4 + k} ${hornL * .5} -8 ${hornL - 2} z" fill="${ltC(B, .3)}" stroke="${dkC(B)}" stroke-width="1.2"/>`;
  const spikes = k >= 2 ? [0, 1, 2, 3].map(i => { const y = 54 + i * 9; return `<path d="M${78 + i * 1.5} ${y} l7 -3 l-3 7 z" fill="${B}"/>`; }).join('') : '';
  const crest = k >= 3 ? `<path d="M52 ${48 - headR + 2} l3 -7 l3 6 l2 -8 l3 8 l2 -7 l3 7" fill="${B}" stroke="${dkC(B)}" stroke-width="1"/>` : '';
  const aura = e === 12 ? `<defs><linearGradient id="gwl" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mixC(c, B, .3)}"/><stop offset="1" stop-color="${ltC(B, .35)}"/></linearGradient><linearGradient id="gwr" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${mixC(c, B, .3)}"/><stop offset="1" stop-color="${ltC(B, .35)}"/></linearGradient></defs>` : '';
  const plates = k >= 3 ? `<path d="M${60 - bodyR + 4} 70 q${bodyR - 4} -8 ${2 * bodyR - 8} 0" stroke="${B}" stroke-width="4" fill="none" stroke-linecap="round"/>` : '';
  const gem = e === 12 ? `<path d="M60 ${48 - headR + 5} l4 5 l-4 5 l-4 -5 z" fill="#7ff5ff" stroke="#fff" stroke-width="1"/>` : '';
  const arm = (s) => { const x = 60 + s * (bodyR - 4); return `<path d="M${x} 76 q${s * 12} 4 ${s * 14} 15" stroke="${c}" stroke-width="${8 + k}" fill="none" stroke-linecap="round"/><path d="M${x + s * 14} 91 l${s * 3} 4 M${x + s * 12} 92 l0 5" stroke="${dkC(B)}" stroke-width="1.6" stroke-linecap="round"/>`; };
  const legs = `<ellipse cx="48" cy="105" rx="${10 + k}" ry="6" fill="${D}"/><ellipse cx="72" cy="105" rx="${10 + k}" ry="6" fill="${D}"/>` +
    [42, 48, 54, 66, 72, 78].map(x => `<circle cx="${x}" cy="108" r="1.6" fill="${ltC(B, .3)}"/>`).join('');
  return {defs: aura, back: wing(-1) + wing(1) + tail + horns + spikes,
    shape:`<circle cx="60" cy="48" r="${headR}"/><ellipse cx="60" cy="84" rx="${bodyR}" ry="${bodyR + 1}"/><ellipse cx="60" cy="57" rx="12" ry="8"/>`,
    over:`<ellipse cx="60" cy="89" rx="${bodyR * .58}" ry="${bodyR * .72}" fill="${B}" opacity=".85"/>${[78, 85, 92, 99].map(y => `<path d="M${60 - bodyR * .45} ${y} q${bodyR * .45} 3 ${bodyR * .9} 0" stroke="${dkC(B, .2)}" stroke-width="1.3" fill="none" opacity=".6"/>`).join('')}
      <circle cx="56" cy="58" r="1.3" fill="${D}"/><circle cx="64" cy="58" r="1.3" fill="${D}"/>${plates}${crest}${gem}`,
    front: arm(-1) + arm(1) + legs,
    a:{head:[60, 48 - headR - 1, 40], eyes:[60, 45, 9, 1], mouth:[60, 60, .9], neck:[60, 66, 30], hand:[60 + bodyR + 11, 92]}};
}

/* ---------- cossos: línia del robot ---------- */
function robotBody(e, c, c2){
  const D = dkC(c, .35), L = ltC(c), B = c2, M = '#c9d1de', MD = '#7b879c';
  if (e === 1) { const hex = (r, cx = 60, cy = 68) => Array.from({length:6}, (_,i) => { const t = Math.PI / 3 * i; return `${f1(cx + r * Math.cos(t))},${f1(cy + r * Math.sin(t))}`; }).join(' ');
    return {back:'', shape:`<polygon points="${hex(31)}"/>`,
      over:`<polygon points="${hex(31)}" fill="none" stroke="${D}" stroke-width="2.5" stroke-linejoin="round"/><path d="M75.5 41.2 L91 68 L75.5 94.8" fill="none" stroke="${D}" stroke-width="5" opacity=".25"/><path d="M44.5 41.2 L29 68" stroke="#fff" stroke-width="3" opacity=".5" stroke-linecap="round"/>
        <circle cx="60" cy="68" r="19" fill="${ltC(c, .25)}" stroke="${D}" stroke-width="2"/>${[0, 1, 2].map(i => `<path d="M${46 + i * 2} ${78 + i * 3} q14 4 ${28 - i * 4} -1" stroke="${D}" stroke-width="1" fill="none" opacity=".25"/>`).join('')}`,
      a:{head:[60,38,40], eyes:[60,64,8,.8], mouth:[60,74,.8], neck:[60,95,36], hand:null}}; }
  if (e === 2) return {back:`<path d="M52 66 h16 v30 l-8 12 l-8 -12 z" fill="${M}" stroke="${MD}" stroke-width="2" stroke-linejoin="round"/>${[70, 77, 84, 91].map(y => `<path d="M52 ${y + 3} L68 ${y}" stroke="${MD}" stroke-width="2"/>`).join('')}`,
    shape:`<rect x="32" y="34" width="56" height="34" rx="10"/>`,
    over:`<rect x="32" y="34" width="56" height="34" rx="10" fill="none" stroke="${D}" stroke-width="2.5"/><path d="M38 40 h44" stroke="#fff" stroke-width="3" opacity=".45" stroke-linecap="round"/><rect x="34" y="62" width="52" height="6" rx="3" fill="${D}" opacity=".35"/>`,
    a:{head:[60,32,48], eyes:[60,49,11,.95], mouth:[60,59,.85], neck:[60,72,24], hand:null}};
  if (e === 3) { const teeth = Array.from({length:10}, (_,i) => `<rect x="54" y="${68 - 36}" width="12" height="12" rx="2" transform="rotate(${i * 36} 60 68)"/>`).join('');
    return {back:'', shape: teeth + `<circle cx="60" cy="68" r="28"/>`,
      over:`<circle cx="60" cy="68" r="28" fill="none" stroke="${D}" stroke-width="2.5"/><circle cx="60" cy="68" r="21" fill="none" stroke="${D}" stroke-width="1.5" opacity=".35"/>${[45, 135, 225, 315].map(a => `<circle cx="${f1(60 + 24 * Math.cos(a * Math.PI / 180))}" cy="${f1(68 + 24 * Math.sin(a * Math.PI / 180))}" r="2" fill="${D}" opacity=".5"/>`).join('')}`,
      a:{head:[60,32,40], eyes:[60,64,9,.9], mouth:[60,75,.9], neck:[60,96,40], hand:null}}; }
  if (e === 4) return {back:`<path d="M48 98 v8 h-4 M72 98 v8 h4" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    shape:`<rect x="38" y="40" width="44" height="60" rx="10"/><rect x="52" y="33" width="16" height="9" rx="3"/>`,
    over:`<rect x="38" y="80" width="44" height="13" fill="${B}"/><path d="M56 86.5 h8 M60 82.5 v8" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><rect x="38" y="40" width="44" height="60" rx="10" fill="none" stroke="${D}" stroke-width="2.5"/><path d="M44 46 v28" stroke="#fff" stroke-width="3" opacity=".4" stroke-linecap="round"/><rect x="52" y="33" width="16" height="9" rx="3" fill="${M}" stroke="${MD}" stroke-width="1.5"/>`,
    front:`<path d="M38 66 h-8 v10 M82 66 h8 v10" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    a:{head:[60,38,44], eyes:[60,56,10,.95], mouth:[60,68,.9], neck:[60,78,40], hand:null}};
  if (e === 5) return {back:`<path d="M60 50 V36" stroke="${INK}" stroke-width="2.5"/><circle cx="60" cy="34" r="4" fill="${B}"/>`,
    shape:`<rect x="30" y="48" width="60" height="48" rx="12"/>`,
    over:`<rect x="36" y="54" width="48" height="28" rx="8" fill="${ltC(c, .7)}" stroke="${D}" stroke-width="2"/><rect x="30" y="48" width="60" height="48" rx="12" fill="none" stroke="${D}" stroke-width="2.5"/><circle cx="44" cy="89" r="2.5" fill="${B}"/><circle cx="52" cy="89" r="2.5" fill="${ltC(B)}"/>`,
    front:wheels(INK, M, [40, 80], 102, 10),
    a:{head:[60,47,52], eyes:[60,65,11,1], mouth:[60,75,.95], neck:[60,96,44], hand:null}};
  return robotBig(e, c, c2);
}
function wheels(D, M, xs, y, r){ return xs.map(x => `<circle cx="${x}" cy="${y}" r="${r}" fill="${D}"/><circle cx="${x}" cy="${y}" r="${r * .45}" fill="${M}"/><circle cx="${x}" cy="${y}" r="${r * .15}" fill="${D}"/>`).join(''); }
function robotBig(e, c, c2){
  const D = dkC(c, .35), L = ltC(c), B = c2, M = '#c9d1de', MD = '#7b879c', k = e - 6; // 0..6
  const torsoW = [36, 36, 38, 38, 38, 42, 44][k], tx = 60 - torsoW / 2;
  const headW = [42, 42, 44, 44, 44, 46, 46][k], hx = 60 - headW / 2;
  const andro = e >= 10;
  const head = andro ? `<path d="M${hx} 46 Q${hx} 24 60 24 Q${hx + headW} 24 ${hx + headW} 46 V52 Q${hx + headW} 62 ${hx + headW - 8} 62 H${hx + 8} Q${hx} 62 ${hx} 52 Z"/>` : `<rect x="${hx}" y="28" width="${headW}" height="34" rx="10"/>`;
  const torso = andro ? `<path d="M${tx} 68 H${tx + torsoW} L${tx + torsoW - 5} 98 H${tx + 5} Z"/>` : `<rect x="${tx}" y="66" width="${torsoW}" height="32" rx="8"/>`;
  const arm = s => { const x = s < 0 ? tx : tx + torsoW, hx2 = x + s * 13;
    if (e === 6) return `<path d="M${x} 72 L${hx2} 80 L${hx2} 90" stroke="${MD}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M${hx2 - 5} 90 q5 8 10 0" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    const w = e >= 11 ? 11 : 8;
    return `<path d="M${x} 72 Q${hx2} 74 ${hx2} 88" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="M${x} 72 Q${hx2} 74 ${hx2} 88" stroke="${D}" stroke-width="1.5" fill="none" opacity=".4"/><circle cx="${hx2}" cy="91" r="${w * .62}" fill="${M}" stroke="${MD}" stroke-width="1.5"/>`; };
  const lower = e === 6 ? `<rect x="36" y="96" width="48" height="13" rx="6.5" fill="${INK}"/>` + [43, 53, 63, 73].map(x => `<circle cx="${x + 2}" cy="102.5" r="3" fill="${M}"/>`).join('')
    : e === 9 || e === 12 ? `<path d="M50 98 l-2 8 h8 l-2 -8 z M70 98 l-2 8 h8 l-2 -8 z" fill="${MD}"/><path d="M50 106 q2 10 2 12 q2 -2 2 -12 z M70 106 q2 10 2 12 q2 -2 2 -12 z" fill="#ffb02e"/><path d="M51 106 q1 6 1 7 q1 -1 1 -7 z M71 106 q1 6 1 7 q1 -1 1 -7 z" fill="#fff3a0"/>`
    : `<rect x="48" y="96" width="8" height="10" fill="${MD}"/><rect x="64" y="96" width="8" height="10" fill="${MD}"/><rect x="42" y="104" width="16" height="7" rx="3.5" fill="${INK}"/><rect x="62" y="104" width="16" height="7" rx="3.5" fill="${INK}"/>`;
  const pads = e >= 8 ? (s => { const x = s < 0 ? tx - 6 : tx + torsoW - 8, w = e >= 11 ? 18 : 14; return `<rect x="${s < 0 ? x - (w - 14) : x}" y="64" width="${w}" height="${e >= 11 ? 12 : 9}" rx="4" fill="${B}" stroke="${dkC(B)}" stroke-width="1.5"/>`; }) : () => '';
  const chest = e >= 8 ? (e >= 11 ? `<circle cx="60" cy="80" r="7" fill="#7ff5ff" stroke="${M}" stroke-width="3"/><circle cx="60" cy="80" r="3" fill="#fff"/>`
      : `<rect x="50" y="72" width="20" height="14" rx="3" fill="${INK}"/><path d="M52 80 h4 l2 -4 l3 8 l2 -4 h5" stroke="#7ff5ff" stroke-width="1.6" fill="none" stroke-linejoin="round"/>`)
    : `<circle cx="60" cy="80" r="4" fill="${B}"/><circle cx="52" cy="88" r="2" fill="${ltC(B)}"/><circle cx="68" cy="88" r="2" fill="${ltC(B)}"/>`;
  const antenna = e === 8 || e === 9 ? `<path d="M60 28 V16" stroke="${INK}" stroke-width="2.5"/><circle cx="60" cy="14" r="4" fill="${B}"/>` : '';
  const vfin = e >= 11 ? `<path d="M60 30 L44 14 L50 26 Z M60 30 L76 14 L70 26 Z" fill="#ffd84d" stroke="#c99a10" stroke-width="1.2"/>` : '';
  const ears = `<rect x="${hx - 4}" y="38" width="5" height="14" rx="2" fill="${INK}"/><rect x="${hx + headW - 1}" y="38" width="5" height="14" rx="2" fill="${INK}"/>`;
  const visor = andro ? `<rect x="${hx + 5}" y="36" width="${headW - 10}" height="18" rx="9" fill="${INK}"/>` : `<rect x="${hx + 5}" y="34" width="${headW - 10}" height="22" rx="7" fill="${INK}"/>`;
  const jets = e === 9 || e === 12 ? `<rect x="${tx - 6}" y="70" width="8" height="20" rx="3" fill="${MD}"/><rect x="${tx + torsoW - 2}" y="70" width="8" height="20" rx="3" fill="${MD}"/>` : '';
  const ewings = e === 12 ? `<path d="M${tx} 72 L8 40 L22 70 L6 78 L24 88 Z" fill="#7ff5ff" opacity=".45" stroke="#7ff5ff" stroke-width="1.5"/><path d="M${tx + torsoW} 72 L112 40 L98 70 L114 78 L96 88 Z" fill="#7ff5ff" opacity=".45" stroke="#7ff5ff" stroke-width="1.5"/>` : '';
  return {back: ewings + jets + antenna + vfin + ears,
    shape: head + torso,
    over:`<rect x="55" y="61" width="10" height="7" fill="${MD}"/>${visor}${chest}${andro ? `<path d="M${tx + 6} 92 H${tx + torsoW - 6}" stroke="${B}" stroke-width="3" stroke-linecap="round"/>` : ''}${pads(-1)}${pads(1)}<path d="M${hx + 4} ${andro ? 32 : 32} q${headW / 2 - 4} -${andro ? 4 : 2} ${headW - 8} 0" stroke="#fff" stroke-width="2.5" fill="none" opacity=".35" stroke-linecap="round"/>`,
    front: arm(-1) + arm(1) + lower,
    eyeCol:'#7ff5ff',
    a:{head:[60, andro ? 23 : 27, headW], eyes:[60, 45, 9.5, .95], mouth:[60, andro ? 53 : 54, .8], neck:[60, 66, 22], hand: e === 6 ? [60 + torsoW / 2 + 13, 94] : [60 + torsoW / 2 + 13, 92]}};
}

/* ---------- cara ---------- */
const ULLS = [
  {id:'rodons', nom:'Rodons', preu:0}, {id:'brillants', nom:'Brillants', preu:0}, {id:'petits', nom:'Petits', preu:0}, {id:'ametlla', nom:'Ametlla', preu:0},
  {id:'adormits', nom:'Adormits', preu:10}, {id:'pestanyes', nom:'Amb pestanyes', preu:10}, {id:'estrella', nom:'Estrelles', preu:25}, {id:'cors', nom:'Cors', preu:25},
  {id:'led', nom:'Llums quadrades', preu:15}, {id:'espiral', nom:'Espirals', preu:30}];
function eyeSVG(st, mood, x, y, s, col){
  const P = col || INK, w = (d) => d * s;
  if (mood === 'happy' && st !== 'estrella' && st !== 'cors') return `<path d="M${f1(x - w(6))} ${f1(y + w(1))} q${w(6)} ${-w(7)} ${w(12)} 0" stroke="${P}" stroke-width="${f1(3 * s)}" fill="none" stroke-linecap="round"/>`;
  if (mood === 'oops') return `<path d="M${f1(x - w(5))} ${f1(y - w(4))} l${w(10)} ${w(2)}" stroke="${P}" stroke-width="${f1(2.4 * s)}" stroke-linecap="round"/><circle cx="${x}" cy="${f1(y + w(2))}" r="${w(3)}" fill="${P}"/>`;
  switch (st) {
    case 'brillants': return `<ellipse cx="${x}" cy="${y}" rx="${w(7)}" ry="${w(8.5)}" fill="${P}"/><circle cx="${f1(x + w(2.4))}" cy="${f1(y - w(3))}" r="${w(2.8)}" fill="#fff"/><circle cx="${f1(x - w(2.2))}" cy="${f1(y + w(3))}" r="${w(1.4)}" fill="#fff"/>`;
    case 'petits': return `<circle cx="${x}" cy="${y}" r="${w(3.4)}" fill="${P}"/>`;
    case 'ametlla': return `<path d="M${f1(x - w(8))} ${y} Q${x} ${f1(y - w(9))} ${f1(x + w(8))} ${y} Q${x} ${f1(y + w(7))} ${f1(x - w(8))} ${y} Z" fill="#fff"/><circle cx="${x}" cy="${f1(y - w(.5))}" r="${w(3.6)}" fill="${P}"/>`;
    case 'adormits': return `<circle cx="${x}" cy="${y}" r="${w(6.5)}" fill="#fff"/><circle cx="${x}" cy="${f1(y + w(2))}" r="${w(3.2)}" fill="${P}"/><path d="M${f1(x - w(7))} ${y} a${w(7)} ${w(7)} 0 0 1 ${w(14)} 0 z" fill="${dkC('#ffffff', .25)}"/><path d="M${f1(x - w(7))} ${y} h${w(14)}" stroke="${P}" stroke-width="${f1(1.8 * s)}" stroke-linecap="round"/>`;
    case 'pestanyes': return `<circle cx="${x}" cy="${y}" r="${w(6.5)}" fill="#fff"/><circle cx="${f1(x + w(1))}" cy="${f1(y + w(1))}" r="${w(3.6)}" fill="${P}"/>` + [-1, 0, 1].map(i => `<path d="M${f1(x + i * w(4))} ${f1(y - w(6))} l${f1(i * w(2))} ${-w(4)}" stroke="${P}" stroke-width="${f1(1.6 * s)}" stroke-linecap="round"/>`).join('');
    case 'estrella': { const pts = Array.from({length:10}, (_,i) => { const r = i % 2 ? w(3.4) : w(8), t = -Math.PI / 2 + i * Math.PI / 5; return `${f1(x + r * Math.cos(t))},${f1(y + r * Math.sin(t))}`; }).join(' '); return `<polygon points="${pts}" fill="#ffd84d" stroke="${P}" stroke-width="${f1(1.4 * s)}" stroke-linejoin="round"/>`; }
    case 'cors': return `<path d="M${x} ${f1(y + w(6))} C${f1(x - w(10))} ${f1(y - w(1))} ${f1(x - w(5))} ${f1(y - w(9))} ${x} ${f1(y - w(3))} C${f1(x + w(5))} ${f1(y - w(9))} ${f1(x + w(10))} ${f1(y - w(1))} ${x} ${f1(y + w(6))} Z" fill="#ff4f7b" stroke="${P}" stroke-width="${f1(1.2 * s)}"/>`;
    case 'led': return `<rect x="${f1(x - w(4.5))}" y="${f1(y - w(4.5))}" width="${w(9)}" height="${w(9)}" rx="${w(1.5)}" fill="${col || '#7ff5ff'}" stroke="${INK}" stroke-width="${f1(1.2 * s)}"/>`;
    case 'espiral': return `<circle cx="${x}" cy="${y}" r="${w(7)}" fill="#fff"/><path d="M${x} ${y} m${w(1)} 0 a${w(1)} ${w(1)} 0 1 0 ${-w(2)} 0 a${w(2.5)} ${w(2.5)} 0 1 0 ${w(5)} 0 a${w(4)} ${w(4)} 0 1 0 ${-w(8)} 0" stroke="${P}" stroke-width="${f1(1.4 * s)}" fill="none"/>`;
    default: return `<circle cx="${x}" cy="${y}" r="${w(7)}" fill="#fff"/><circle cx="${f1(x + w(1.5))}" cy="${f1(y + w(1))}" r="${w(3.8)}" fill="${P}"/><circle cx="${f1(x + w(2.6))}" cy="${f1(y - w(.4))}" r="${w(1.2)}" fill="#fff"/>`;
  }
}
const BOQUES = [{id:'somriure', nom:'Somriure', preu:0}, {id:'rialla', nom:'Rialla', preu:0}, {id:'dentetes', nom:'Dentetes', preu:0}, {id:'llengua', nom:'Llengua fora', preu:10},
  {id:'ullal', nom:'Ullals', preu:15}, {id:'gat', nom:'Boca de gat', preu:10}, {id:'bigoti', nom:'Bigoti', preu:30}, {id:'pantalla', nom:'Boca de llums', preu:20}];
function mouthSVG(st, mood, x, y, s, col){
  const P = INK, w = d => f1(d * s);
  if (mood === 'oops') return `<ellipse cx="${x}" cy="${f1(y + 2 * s)}" rx="${w(3.4)}" ry="${w(4.2)}" fill="${P}"/>`;
  const big = mood === 'happy';
  switch (st) {
    case 'rialla': return `<path d="M${f1(x - 9 * s)} ${y} Q${x} ${f1(y + 15 * s)} ${f1(x + 9 * s)} ${y} Z" fill="${P}"/><path d="M${f1(x - 4 * s)} ${f1(y + 6 * s)} q${w(4)} ${w(4)} ${w(8)} 0" fill="#ff7a90"/>`;
    case 'dentetes': return `<path d="M${f1(x - 7 * s)} ${y} Q${x} ${f1(y + (big ? 12 : 8) * s)} ${f1(x + 7 * s)} ${y} Z" fill="${P}"/><rect x="${f1(x - 3.6 * s)}" y="${y}" width="${w(3.2)}" height="${w(3.4)}" fill="#fff"/><rect x="${f1(x + .4 * s)}" y="${y}" width="${w(3.2)}" height="${w(3.4)}" fill="#fff"/>`;
    case 'llengua': return `<path d="M${f1(x - 7 * s)} ${y} q${w(7)} ${w(7)} ${w(14)} 0" stroke="${P}" stroke-width="${w(2.6)}" fill="none" stroke-linecap="round"/><path d="M${f1(x + .5 * s)} ${f1(y + 3 * s)} q${w(1)} ${w(7)} ${w(5)} ${w(5)} q${w(1)} ${-w(3)} ${-w(1)} ${-w(6)} z" fill="#ff7a90" stroke="${P}" stroke-width="${w(1)}"/>`;
    case 'ullal': return `<path d="M${f1(x - 8 * s)} ${y} q${w(8)} ${w(big ? 9 : 6)} ${w(16)} 0" stroke="${P}" stroke-width="${w(2.6)}" fill="none" stroke-linecap="round"/><path d="M${f1(x - 5 * s)} ${f1(y + 1.6 * s)} l${w(1.6)} ${w(4)} l${w(1.6)} ${-w(3.2)} z M${f1(x + 5 * s)} ${f1(y + 1.6 * s)} l${-w(1.6)} ${w(4)} l${-w(1.6)} ${-w(3.2)} z" fill="#fff" stroke="${P}" stroke-width="${w(.8)}"/>`;
    case 'gat': return `<path d="M${f1(x - 8 * s)} ${y} q${w(4)} ${w(5)} ${w(8)} 0 q${w(4)} ${w(5)} ${w(8)} 0" stroke="${P}" stroke-width="${w(2.4)}" fill="none" stroke-linecap="round"/><path d="M${f1(x - 2 * s)} ${f1(y - 3 * s)} h${w(4)} l${-w(2)} ${w(2.4)} z" fill="#ff7a90"/>`;
    case 'bigoti': return `<path d="M${x} ${f1(y - 1 * s)} q${-w(5)} ${-w(4)} ${-w(11)} ${w(1)} q${w(5)} ${w(2)} ${w(11)} 0 q${w(6)} ${w(2)} ${w(11)} 0 q${-w(6)} ${-w(5)} ${-w(11)} ${-w(1)} z" fill="#5b3a26"/><path d="M${f1(x - 4 * s)} ${f1(y + 4 * s)} q${w(4)} ${w(big ? 5 : 3)} ${w(8)} 0" stroke="${P}" stroke-width="${w(2)}" fill="none" stroke-linecap="round"/>`;
    case 'pantalla': return [-6, -2, 2, 6].map((dx, i) => `<rect x="${f1(x + dx * s - 1.6 * s)}" y="${f1(y - (big && (i === 1 || i === 2) ? -2 : 0) * s)}" width="${w(3.2)}" height="${w(3.2)}" rx="${w(.6)}" fill="${col || '#7ff5ff'}"/>`).join('');
    default: return big ? `<path d="M${f1(x - 8 * s)} ${y} Q${x} ${f1(y + 12 * s)} ${f1(x + 8 * s)} ${y} Z" fill="${P}"/>` : `<path d="M${f1(x - 6 * s)} ${y} q${w(6)} ${w(6)} ${w(12)} 0" stroke="${P}" stroke-width="${w(2.6)}" fill="none" stroke-linecap="round"/>`;
  }
}
const GALTES = [{id:'rosades', nom:'Galtes rosades', preu:0}, {id:'cap', nom:'Sense galtes', preu:0}, {id:'pigues', nom:'Pigues', preu:10}, {id:'tirita', nom:'Tireta', preu:15}];
function cheekSVG(st, a){
  const [x, y, dx, s] = a.eyes, cy = y + 9 * s, L = x - dx - 3 * s, R = x + dx + 3 * s;
  if (st === 'cap') return '';
  if (st === 'pigues') return [L, R].map(cx => [[-3, 0], [0, 2], [3, 0]].map(([u, v]) => `<circle cx="${f1(cx + u * s)}" cy="${f1(cy + v * s)}" r="${f1(1 * s)}" fill="#a0603d" opacity=".7"/>`).join('')).join('');
  if (st === 'tirita') return `<g transform="translate(${f1(R)} ${f1(cy)}) rotate(-25) scale(${s})"><rect x="-7" y="-3" width="14" height="6" rx="3" fill="#f6c89a" stroke="#c99063" stroke-width=".8"/><rect x="-2.5" y="-3" width="5" height="6" fill="#f0b47f"/></g>`;
  return `<ellipse cx="${f1(L)}" cy="${f1(cy)}" rx="${f1(4.5 * s)}" ry="${f1(3 * s)}" fill="#ff8fa8" opacity=".55"/><ellipse cx="${f1(R)}" cy="${f1(cy)}" rx="${f1(4.5 * s)}" ry="${f1(3 * s)}" fill="#ff8fa8" opacity=".55"/>`;
}

/* ---------- patrons del cos ---------- */
const PATRONS = [{id:'llis', nom:'Llis', preu:0}, {id:'taques', nom:'Taques', preu:10}, {id:'ratlles', nom:'Ratlles', preu:10}, {id:'puntets', nom:'Puntets', preu:10},
  {id:'escates', nom:'Escates', preu:15}, {id:'estrelles', nom:'Estrelles', preu:20}, {id:'degradat', nom:'Degradat', preu:20}, {id:'quadres', nom:'Quadres', preu:15}, {id:'cors', nom:'Cors', preu:20}];
function patternSVG(id, c2){
  const C = c2, op = .55;
  if (id === 'taques') return [[34,50,8],[78,46,6],[44,86,7],[82,80,9],[60,62,5],[30,74,5],[66,100,6],[52,34,4]].map(([x,y,r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .8}" fill="${C}" opacity=".75"/>`).join('');
  if (id === 'ratlles') return Array.from({length:12}, (_,i) => `<path d="M${-10 + i * 12} 0 L${30 + i * 12} 120" stroke="${C}" stroke-width="4.5" opacity="${op}"/>`).join('');
  if (id === 'puntets') return Array.from({length:80}, (_,i) => { const x = 8 + (i % 10) * 11 + (Math.floor(i / 10) % 2) * 5.5, y = 10 + Math.floor(i / 10) * 13; return `<circle cx="${x}" cy="${y}" r="2.2" fill="${C}" opacity=".8"/>`; }).join('');
  if (id === 'escates') return Array.from({length:70}, (_,i) => { const x = 4 + (i % 10) * 12 + (Math.floor(i / 10) % 2) * 6, y = 20 + Math.floor(i / 10) * 9; return `<path d="M${x - 6} ${y} a6 6 0 0 0 12 0" stroke="${C}" stroke-width="1.6" fill="none" opacity=".75"/>`; }).join('');
  if (id === 'estrelles') return [[34,48],[80,42],[46,84],[84,82],[60,66],[28,70],[68,102],[54,30],[92,60]].map(([x,y]) => `<path d="M${x} ${y - 4} l1.2 2.8 l3 .3 l-2.3 2 l.7 3 l-2.6 -1.6 l-2.6 1.6 l.7 -3 l-2.3 -2 l3 -.3 z" fill="${C}" opacity=".9"/>`).join('');
  if (id === 'degradat') return `<rect x="0" y="0" width="120" height="120" fill="url(#pgrad)"/>`;
  if (id === 'quadres') return Array.from({length:12}, (_,i) => `<path d="M${i * 10} 0 V120 M0 ${i * 10} H120" stroke="${C}" stroke-width="2.4" opacity=".45"/>`).join('');
  if (id === 'cors') return [[34,50],[80,44],[46,86],[84,82],[60,66],[28,72],[68,102],[56,32]].map(([x,y]) => `<path d="M${x} ${y + 3} c-6 -4 -4 -9 0 -6 c4 -3 6 2 0 6 z" fill="${C}" opacity=".85"/>`).join('');
  return '';
}

/* ---------- complements ---------- */
// coordenades locals: cap = centre de la part de dalt del cap, amplada 40; coll = centre del coll, amplada 40; ulleres = punt mig dels ulls, separació 10; mà = punt on agafa.
const CAPS = [
  {id:'cap', nom:'Res', preu:0, svg:''},
  {id:'barretina', nom:'Barretina', preu:20, svg:`<path d="M-15 2 Q-15 -8 0 -9 Q16 -10 20 -22 Q24 -10 15 -3 Q15 2 15 2 Z" fill="#c8102e"/><path d="M-16 -1 H16 V3 H-16 Z" fill="#8a0b20"/>`},
  {id:'gorra', nom:'Gorra', preu:15, svg:`<path d="M-17 2 Q-17 -16 0 -16 Q17 -16 17 2 Z" fill="#e2483d"/><path d="M8 0 h22 a3 3 0 0 1 0 5 h-22 z" fill="#b8322a"/><circle cx="0" cy="-16" r="2.5" fill="#b8322a"/>`},
  {id:'festa', nom:'Barret de festa', preu:15, svg:`<path d="M0 -28 L-11 3 L11 3 Z" fill="#ffd84d" stroke="#e8762d" stroke-width="1.6"/><path d="M-7 -8 l12 4 M-9 -2 l16 4" stroke="#ff6fae" stroke-width="2"/><circle cx="0" cy="-28" r="3.6" fill="#ff6fae"/>`},
  {id:'llac', nom:'Llaç', preu:15, svg:`<g transform="translate(12 -2)"><path d="M0 0 l-10 -8 v16 z M0 0 l10 -8 v16 z" fill="#ff6fae"/><circle r="3.2" fill="#e0457f"/></g>`},
  {id:'flors', nom:'Corona de flors', preu:25, svg:[-14, -5, 5, 14].map((x, i) => `<g transform="translate(${x} ${i % 3 ? -3 : 0})">${[0, 72, 144, 216, 288].map(a => `<circle cx="${f1(4 * Math.cos(a * Math.PI / 180))}" cy="${f1(4 * Math.sin(a * Math.PI / 180))}" r="3" fill="${['#fff6a8', '#ffb3c7', '#c9b8ff', '#fff6a8'][i]}"/>`).join('')}<circle r="2.2" fill="#f08a24"/></g>`).join('')},
  {id:'orelles', nom:'Orelles de gat', preu:20, svg:`<path d="M-17 0 Q0 -8 17 0" stroke="${INK}" stroke-width="2.4" fill="none"/><path d="M-15 -2 L-13 -16 L-4 -6 Z M15 -2 L13 -16 L4 -6 Z" fill="${INK}"/><path d="M-13 -4 L-12 -12 L-7 -6 Z M13 -4 L12 -12 L7 -6 Z" fill="#ff8fa8"/>`},
  {id:'auriculars', nom:'Auriculars', preu:25, svg:`<path d="M-21 14 Q-21 -10 0 -10 Q21 -10 21 14" stroke="${INK}" stroke-width="3.6" fill="none"/><rect x="-26" y="8" width="9" height="14" rx="4.5" fill="#e2483d"/><rect x="17" y="8" width="9" height="14" rx="4.5" fill="#e2483d"/>`},
  {id:'antena', nom:'Antena', preu:15, svg:`<path d="M0 2 V-16" stroke="${INK}" stroke-width="2.4"/><circle cx="0" cy="-18" r="4" fill="#ff5d73"/><circle cx="-1.2" cy="-19.2" r="1.2" fill="#fff"/>`},
  {id:'xef', nom:'Barret de xef', preu:25, svg:`<rect x="-12" y="-6" width="24" height="9" fill="#fff" stroke="#c9d1de" stroke-width="1.2"/><path d="M-13 -6 C-22 -10 -16 -24 -8 -20 C-6 -30 6 -30 8 -20 C16 -24 22 -10 13 -6 Z" fill="#fff" stroke="#c9d1de" stroke-width="1.2"/>`},
  {id:'bruixa', nom:'Barret de bruixa', preu:30, svg:`<ellipse cx="0" cy="1" rx="24" ry="4.5" fill="#3a2a5c"/><path d="M-12 0 L4 -32 Q6 -34 7 -31 L12 0 Z" fill="#4b3778"/><rect x="-11" y="-5" width="22" height="4" fill="#ffd84d"/>`},
  {id:'copa', nom:'Barret de copa', preu:30, svg:`<ellipse cx="0" cy="1" rx="21" ry="4" fill="#1f2433"/><rect x="-12" y="-24" width="24" height="25" rx="2" fill="#2a3044"/><rect x="-12" y="-7" width="24" height="5" fill="#e0003f"/>`},
  {id:'birret', nom:'Birret de graduació', preu:35, svg:`<path d="M-11 2 V-6 H11 V2 Z" fill="#1f2433"/><path d="M0 -16 L26 -8 L0 0 L-26 -8 Z" fill="#2a3044"/><path d="M0 -8 L18 -4 V8" stroke="#ffd84d" stroke-width="1.6" fill="none"/><circle cx="18" cy="9" r="2.5" fill="#ffd84d"/>`},
  {id:'helix', nom:'Gorra d\'hèlix', preu:30, svg:`<path d="M-16 2 Q-16 -14 0 -14 Q16 -14 16 2 Z" fill="#4f7cff"/><path d="M-16 2 Q-16 -14 0 -14 V2 Z" fill="#ffd84d"/><path d="M0 -14 V-19" stroke="${INK}" stroke-width="2"/><path d="M-14 -21 Q0 -17 14 -21 Q0 -25 -14 -21 Z" fill="#e2483d"/>`},
  {id:'casc', nom:'Casc d\'astronauta', preu:45, min:4, svg:`<circle cx="0" cy="18" r="30" fill="#bfe6ff" opacity=".28" stroke="#e8f4ff" stroke-width="3"/><path d="M-18 0 a26 26 0 0 1 12 -9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>`},
  {id:'vikings', nom:'Casc de víking', preu:40, svg:`<path d="M-17 3 Q-17 -15 0 -15 Q17 -15 17 3 Z" fill="#9aa5b8"/><path d="M-17 3 H17" stroke="#6b7489" stroke-width="3"/><path d="M-16 -4 Q-30 -8 -26 -26 Q-22 -12 -12 -11 Z M16 -4 Q30 -8 26 -26 Q22 -12 12 -11 Z" fill="#f4ecd8" stroke="#c9bfa6" stroke-width="1"/>`},
  {id:'cresta', nom:'Cresta punk', preu:30, svg:`<path d="M-10 2 l3 -16 l4 10 l3 -16 l3 16 l4 -10 l3 16 z" fill="#ff5d73"/>`},
  {id:'corona', nom:'Corona', preu:50, min:6, svg:`<path d="M-15 3 L-15 -10 L-7.5 -2 L0 -15 L7.5 -2 L15 -10 L15 3 Z" fill="#f2c230" stroke="#c99a10" stroke-width="1.6"/><circle cx="0" cy="-15" r="2.4" fill="#e0003f"/><circle cx="-15" cy="-10" r="2" fill="#4f7cff"/><circle cx="15" cy="-10" r="2" fill="#2fbf71"/>`},
  {id:'halo', nom:'Aurèola', preu:60, min:12, svg:`<ellipse cx="0" cy="-12" rx="16" ry="4.5" fill="none" stroke="#ffd84d" stroke-width="3.5"/><ellipse cx="0" cy="-12" rx="16" ry="4.5" fill="none" stroke="#fff6a8" stroke-width="1.2"/>`}];
const ULLERES = [
  {id:'cap', nom:'Res', preu:0, svg:''},
  {id:'rodones', nom:'Rodones', preu:15, svg:`<circle cx="-10" cy="0" r="8" fill="#fff" fill-opacity=".15" stroke="${INK}" stroke-width="2.2"/><circle cx="10" cy="0" r="8" fill="#fff" fill-opacity=".15" stroke="${INK}" stroke-width="2.2"/><path d="M-2 0 h4" stroke="${INK}" stroke-width="2.2"/>`},
  {id:'sol', nom:'Ulleres de sol', preu:20, svg:`<path d="M-19 -4 H-1 V1 Q-1 8 -10 8 Q-19 8 -19 1 Z M1 -4 H19 V1 Q19 8 10 8 Q1 8 1 1 Z" fill="#1f2433"/><path d="M-1 -2 h2" stroke="#1f2433" stroke-width="2"/><path d="M-16 -1 l4 0 M4 -1 l4 0" stroke="#fff" stroke-width="1.4" opacity=".6"/>`},
  {id:'estrella', nom:'Ulleres d\'estrella', preu:30, svg:[-10, 10].map(x => `<path d="M${x} -10 l2.9 6 l6.6 .9 l-4.8 4.6 l1.2 6.5 l-5.9 -3.1 l-5.9 3.1 l1.2 -6.5 l-4.8 -4.6 l6.6 -.9 z" fill="#ff6fae" fill-opacity=".85" stroke="#e0457f" stroke-width="1.2"/>`).join('')},
  {id:'cors', nom:'Ulleres de cor', preu:30, svg:[-10, 10].map(x => `<path d="M${x} 8 C${x - 12} 0 ${x - 7} -10 ${x} -3 C${x + 7} -10 ${x + 12} 0 ${x} 8 Z" fill="#ff4f7b" fill-opacity=".8" stroke="#c4224c" stroke-width="1.2"/>`).join('')},
  {id:'monocle', nom:'Monocle', preu:25, svg:`<circle cx="10" cy="0" r="8" fill="#fff" fill-opacity=".15" stroke="#c99a10" stroke-width="2"/><path d="M17 4 q4 10 -2 18" stroke="#c99a10" stroke-width="1" fill="none"/>`},
  {id:'visor', nom:'Visor', preu:30, svg:`<rect x="-21" y="-7" width="42" height="14" rx="7" fill="#ffd84d" fill-opacity=".5" stroke="#e8b400" stroke-width="2"/>`},
  {id:'antifaç', nom:'Antifaç de superheroi', preu:35, svg:`<path d="M-22 -3 Q-12 -10 0 -4 Q12 -10 22 -3 Q20 8 10 7 Q4 6 0 2 Q-4 6 -10 7 Q-20 8 -22 -3 Z M-10 -2 a3.6 3 0 1 0 .1 0 Z M10 -2 a3.6 3 0 1 0 .1 0 Z" fill="#e0003f" fill-rule="evenodd"/>`},
  {id:'busseig', nom:'Ulleres de busseig', preu:30, svg:`<rect x="-20" y="-8" width="40" height="16" rx="8" fill="#7fd8ff" fill-opacity=".35" stroke="#ff8a3d" stroke-width="3"/><path d="M-20 0 h-8 M20 0 h8" stroke="#ff8a3d" stroke-width="3"/>`}];
const COLLS = [
  {id:'cap', nom:'Res', preu:0, svg:''},
  {id:'bufanda', nom:'Bufanda', preu:15, svg:`<path d="M-18 -4 Q0 6 18 -4 L18 3 Q0 13 -18 3 Z" fill="#e2483d"/><path d="M8 4 l4 16 l7 -2 l-4 -15 z" fill="#c33a30"/><path d="M-12 0 v6 M-4 2 v7 M4 2 v7" stroke="#fff" stroke-width="2" opacity=".5"/>`},
  {id:'corbati', nom:'Corbatí', preu:15, svg:`<path d="M0 2 l-11 -7 v14 z M0 2 l11 -7 v14 z" fill="#4f7cff"/><circle cx="0" cy="2" r="3" fill="#3657c9"/>`},
  {id:'corbata', nom:'Corbata', preu:20, svg:`<path d="M-4 -2 h8 l-2 4 l4 18 l-6 6 l-6 -6 l4 -18 z" fill="#e0003f"/><path d="M-1 8 l5 3 M-2 14 l5 3" stroke="#fff" stroke-width="1.4" opacity=".5"/>`},
  {id:'perles', nom:'Collaret de perles', preu:25, svg:Array.from({length:11}, (_,i) => { const t = Math.PI * (0.05 + i * 0.09); return `<circle cx="${f1(-18 * Math.cos(t))}" cy="${f1(-3 + 8 * Math.sin(t))}" r="2.6" fill="#fff" stroke="#d9d2c4" stroke-width=".8"/>`; }).join('')},
  {id:'medalla', nom:'Medalla', preu:30, svg:`<path d="M-8 -3 L0 12 L8 -3" stroke="#e0003f" stroke-width="4" fill="none"/><circle cx="0" cy="16" r="6.5" fill="#f2c230" stroke="#c99a10" stroke-width="1.6"/><path d="M0 12.5 l1.1 2.4 l2.6 .3 l-1.9 1.8 l.5 2.6 l-2.3 -1.3 l-2.3 1.3 l.5 -2.6 l-1.9 -1.8 l2.6 -.3 z" fill="#fff6a8"/>`},
  {id:'mocador', nom:'Mocador de coll', preu:15, svg:`<path d="M-17 -3 Q0 4 17 -3 L0 16 Z" fill="#2fbf71"/>${[[-8,1],[0,6],[8,1],[-2,0],[4,10]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="#fff"/>`).join('')}`},
  {id:'capa', nom:'Capa de superheroi', preu:40, back:true, svg:`<path d="M-16 -2 Q-34 40 -30 52 Q0 60 30 52 Q34 40 16 -2 Z" fill="#e0003f"/><path d="M-16 -2 Q-34 40 -30 52 Q-14 56 -2 56 Q-18 40 -12 -2 Z" fill="#a8002f" opacity=".6"/>`},
  {id:'collar', nom:'Collar amb placa', preu:20, svg:`<path d="M-17 -3 Q0 6 17 -3" stroke="#e0003f" stroke-width="4" fill="none"/><circle cx="0" cy="6" r="4.5" fill="#f2c230" stroke="#c99a10" stroke-width="1.2"/>`}];
const MANS = [
  {id:'cap', nom:'Res', preu:0, svg:''},
  {id:'llibre', nom:'Llibre', preu:15, svg:`<path d="M-10 -14 h9 a2 2 0 0 1 2 2 v16 h-11 z" fill="#4f7cff"/><path d="M1 -12 a2 2 0 0 1 2 -2 h9 v18 h-11 z" fill="#3657c9"/><path d="M-8 -9 h6 M-8 -5 h6" stroke="#fff" stroke-width="1.2"/>`},
  {id:'llapis', nom:'Llapis', preu:10, svg:`<g transform="rotate(30)"><rect x="-3" y="-24" width="6" height="22" fill="#f2c230"/><path d="M-3 -2 L0 5 L3 -2 Z" fill="#f4d7a8"/><path d="M-1 3 L0 5 L1 3 Z" fill="${INK}"/><rect x="-3" y="-27" width="6" height="4" fill="#ff8fa8"/></g>`},
  {id:'pinzell', nom:'Pinzell', preu:15, svg:`<g transform="rotate(25)"><rect x="-2" y="-26" width="4" height="20" rx="2" fill="#a86b45"/><rect x="-2.5" y="-8" width="5" height="5" fill="#c9d1de"/><path d="M-3 -3 Q0 8 3 -3 Z" fill="#9b6bff"/></g>`},
  {id:'pilota', nom:'Pilota', preu:15, svg:`<circle cx="0" cy="-6" r="9" fill="#fff" stroke="${INK}" stroke-width="1.5"/><path d="M0 -10 l3.5 2.5 l-1.3 4 h-4.4 l-1.3 -4 z" fill="${INK}"/><path d="M0 -10 V-15 M3.5 -7.5 l4.5 -1.5 M2.2 -3.5 l3 4 M-2.2 -3.5 l-3 4 M-3.5 -7.5 l-4.5 -1.5" stroke="${INK}" stroke-width="1"/>`},
  {id:'globus', nom:'Globus', preu:15, svg:`<path d="M0 0 Q-4 -14 2 -26" stroke="#8a94a6" stroke-width="1" fill="none"/><ellipse cx="3" cy="-34" rx="8" ry="10" fill="#ff5d73"/><path d="M1 -24 l2 3 l2 -3 z" fill="#ff5d73"/><ellipse cx="0" cy="-38" rx="2" ry="3" fill="#fff" opacity=".6"/>`},
  {id:'gelat', nom:'Gelat', preu:15, svg:`<path d="M-6 -8 L0 6 L6 -8 Z" fill="#e8b46a"/><path d="M-4 -7 l7 7 M2 -8 l-5 6" stroke="#c48a3c" stroke-width=".8"/><circle cx="-2" cy="-11" r="5" fill="#ffb3c7"/><circle cx="3" cy="-13" r="5" fill="#fff3c4"/><circle cx="0" cy="-17" r="2" fill="#e0003f"/>`},
  {id:'vareta', nom:'Vareta màgica', preu:30, svg:`<g transform="rotate(20)"><rect x="-1.6" y="-24" width="3.2" height="24" rx="1.6" fill="${INK}"/><path d="M0 -36 l2.6 5.4 l6 .8 l-4.3 4.2 l1 5.9 l-5.3 -2.8 l-5.3 2.8 l1 -5.9 l-4.3 -4.2 l6 -.8 z" fill="#ffd84d" stroke="#e8b400" stroke-width="1"/></g>`},
  {id:'lupa', nom:'Lupa', preu:20, svg:`<g transform="rotate(-20)"><rect x="-2" y="-6" width="4" height="12" rx="2" fill="#a86b45"/><circle cx="0" cy="-14" r="8" fill="#bfe6ff" fill-opacity=".5" stroke="${INK}" stroke-width="2.4"/></g>`},
  {id:'guitarra', nom:'Guitarra', preu:35, svg:`<g transform="rotate(-35)"><rect x="-1.6" y="-34" width="3.2" height="22" fill="#5b3a26"/><rect x="-3" y="-38" width="6" height="6" rx="1" fill="#3a2418"/><circle cx="0" cy="-8" r="8" fill="#e8762d"/><circle cx="0" cy="1" r="10" fill="#e8762d"/><circle cx="0" cy="-5" r="3" fill="#3a2418"/></g>`},
  {id:'bandera', nom:'Bandera', preu:20, svg:`<rect x="-1.2" y="-34" width="2.4" height="36" fill="#8a94a6"/><path d="M1 -34 h22 l-5 7 l5 7 h-22 z" fill="#e0003f"/><path d="M5 -30 l3 3 l6 -6" stroke="#fff" stroke-width="2" fill="none"/>`},
  {id:'trofeu', nom:'Trofeu', preu:60, min:10, svg:`<path d="M-8 -22 h16 v6 a8 8 0 0 1 -16 0 z" fill="#f2c230" stroke="#c99a10" stroke-width="1.2"/><path d="M-8 -20 h-4 a4 4 0 0 0 4 6 M8 -20 h4 a4 4 0 0 1 -4 6" stroke="#c99a10" stroke-width="1.6" fill="none"/><rect x="-2" y="-9" width="4" height="5" fill="#c99a10"/><rect x="-7" y="-4" width="14" height="5" rx="1" fill="#a86b45"/>`}];
const FONSOS = [
  {id:'cap', nom:'Sense fons', preu:0},
  {id:'classe', nom:'Festa de la classe', preu:null},
  {id:'prat', nom:'Prat', preu:10}, {id:'mar', nom:'Mar', preu:15}, {id:'bosc', nom:'Bosc', preu:15}, {id:'neu', nom:'Neu', preu:20},
  {id:'ciutat', nom:'Ciutat de nit', preu:20}, {id:'vic', nom:'Plaça Major de Vic', preu:25}, {id:'posta', nom:'Posta de sol', preu:20}, {id:'arc', nom:'Arc de Sant Martí', preu:25},
  {id:'neo', nom:'Neó', preu:20}, {id:'laboratori', nom:'Laboratori', preu:25}, {id:'espai', nom:'Espai', preu:30}, {id:'volca', nom:'Volcà', preu:35, min:8}, {id:'castell', nom:'Castell', preu:40, min:10}];
function bgSVG(id, c){
  const R = `<circle cx="60" cy="60" r="58" fill="`;
  switch (id) {
    case 'prat': return `${R}#d3efcf"/><path d="M4 86 Q60 70 116 86 L110 100 Q60 124 10 100 Z" fill="#8fcf8a"/><circle cx="92" cy="26" r="9" fill="#ffd84d"/>`;
    case 'mar': return `${R}#cfe6ff"/><path d="M6 88 q14 -8 27 0 t27 0 t27 0 t27 0 L104 104 Q60 126 16 104 Z" fill="#7fb7ef"/><path d="M80 30 q4 -4 8 0 q4 -4 8 0" stroke="#5a7aa8" stroke-width="1.5" fill="none"/>`;
    case 'bosc': return `${R}#dff1d6"/>${[[16,70,18],[34,58,22],[86,60,22],[104,72,16]].map(([x,y,h]) => `<path d="M${x} ${y - h} L${x - 10} ${y + 14} H${x + 10} Z" fill="#3f9a5b"/><rect x="${x - 2}" y="${y + 14}" width="4" height="8" fill="#7a5233"/>`).join('')}<path d="M4 96 Q60 84 116 96 L108 108 Q60 126 12 108 Z" fill="#8fcf8a"/>`;
    case 'neu': return `${R}#e6f0fb"/><path d="M4 90 Q40 80 70 88 T116 86 L110 104 Q60 126 10 104 Z" fill="#fff"/>${[[20,20],[40,40],[90,18],[100,46],[30,64],[84,70],[60,14]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#fff" stroke="#c9dcf0" stroke-width=".8"/>`).join('')}`;
    case 'ciutat': return `${R}#2b3a67"/>${[[8,70,16,40],[26,56,14,54],[84,62,16,48],[100,76,14,34],[44,74,12,40]].map(([x,y,w,h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#1b2547"/><rect x="${x + 3}" y="${y + 6}" width="3" height="3" fill="#ffd84d"/><rect x="${x + 8}" y="${y + 14}" width="3" height="3" fill="#ffd84d"/>`).join('')}<circle cx="90" cy="26" r="7" fill="#fff6c4"/><circle cx="93" cy="24" r="6" fill="#2b3a67"/>`;
    case 'vic': return `${R}#fde8d6"/><path d="M8 94 V60 H30 V94 Z M30 94 V54 H54 V94 Z M66 94 V56 H90 V94 Z M90 94 V62 H112 V94 Z" fill="#e7c9a6"/>${[12, 22, 34, 44, 70, 80, 94, 104].map(x => `<path d="M${x} 94 v-12 a4 4 0 0 1 8 0 v12" fill="#b88b62"/>`).join('')}<rect x="54" y="40" width="12" height="54" fill="#d9b48c"/><path d="M52 40 L60 26 L68 40 Z" fill="#a8734c"/><path d="M6 94 H114 L106 108 Q60 124 14 108 Z" fill="#cfa57a"/>`;
    case 'posta': return `<defs><linearGradient id="gposta" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb26b"/><stop offset=".6" stop-color="#ff7a8a"/><stop offset="1" stop-color="#7a5ab8"/></linearGradient></defs>${R}url(#gposta)"/><circle cx="60" cy="76" r="20" fill="#ffd84d" opacity=".9"/><path d="M4 86 H116 L108 104 Q60 126 12 104 Z" fill="#4b3a78"/>`;
    case 'arc': return `${R}#e8f6ff"/>${['#ff5d73', '#ff8a3d', '#ffd84d', '#2fbf71', '#4f7cff', '#9b6bff'].map((col, i) => `<path d="M${10 + i * 5} 96 A${50 - i * 5} ${50 - i * 5} 0 0 1 ${110 - i * 5} 96" stroke="${col}" stroke-width="5" fill="none"/>`).join('')}<ellipse cx="18" cy="96" rx="14" ry="7" fill="#fff"/><ellipse cx="102" cy="96" rx="14" ry="7" fill="#fff"/>`;
    case 'neo': return `${R}#141a33"/>${[30, 50, 70, 90].map(x => `<path d="M${x} 6 V114 M6 ${x} H114" stroke="${c}" stroke-opacity=".4" stroke-width="1"/>`).join('')}`;
    case 'laboratori': return `${R}#e9f3f6"/><rect x="6" y="80" width="108" height="6" fill="#9fb3bf"/><path d="M18 80 v-14 h6 v14 M16 66 h10" stroke="#5a7a8a" stroke-width="2" fill="#bdf0d0"/><path d="M92 80 l-8 -16 v-8 h8 v8 l8 16 z" fill="#ffd2e3" stroke="#5a7a8a" stroke-width="2"/><circle cx="100" cy="40" r="3" fill="#bdf0d0" stroke="#5a7a8a"/><circle cx="20" cy="40" r="2" fill="#ffd2e3" stroke="#5a7a8a"/>`;
    case 'espai': return `${R}#202a5c"/>${[[22,30],[90,24],[100,60],[30,92],[16,62],[78,98],[56,16]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#fff"/>`).join('')}<circle cx="96" cy="34" r="8" fill="#ff8a3d"/><ellipse cx="96" cy="34" rx="13" ry="3" fill="none" stroke="#ffd84d" stroke-width="1.5"/>`;
    case 'volca': return `${R}#4a2a3a"/><path d="M10 100 L44 50 H76 L110 100 Z" fill="#5b3a2a"/><path d="M44 50 Q52 60 60 52 Q68 60 76 50" fill="#ff6a2b"/><path d="M50 50 Q46 30 56 20 Q58 34 64 26 Q72 36 70 50 Z" fill="#ffb02e" opacity=".85"/>`;
    case 'castell': return `${R}#dbe8ff"/><path d="M14 100 V58 H24 V52 H30 V58 H40 V52 H46 V58 H50 V100 Z M70 100 V58 H74 V52 H80 V58 H90 V52 H96 V58 H106 V100 Z" fill="#a9b3c9"/><rect x="40" y="70" width="40" height="30" fill="#b9c2d6"/><path d="M52 100 v-12 a8 8 0 0 1 16 0 v12 Z" fill="#6b7489"/><path d="M30 52 V36 L42 42 L30 46" fill="#e0003f"/>`;
    case 'classe': return `${R}#fde8ee"/>` + [[20,26,'#E0003F'],[40,14,'#f2c230'],[84,18,'#4f7cff'],[100,40,'#2fbf71'],[14,54,'#9b6bff'],[104,70,'#E0003F'],[22,90,'#f08a24'],[96,96,'#9b6bff'],[60,8,'#2fbf71']].map(([x,y,col],i) => `<rect x="${x}" y="${y}" width="6" height="3" rx="1" fill="${col}" transform="rotate(${i * 37} ${x} ${y})"/>`).join('');
    default: return '';
  }
}
const EFECTES = [
  {id:'cap', nom:'Cap', preu:0}, {id:'brillantor', nom:'Brillantor', preu:20}, {id:'bombolles', nom:'Bombolles', preu:20}, {id:'cors', nom:'Cors', preu:25},
  {id:'notes', nom:'Notes musicals', preu:25}, {id:'estrelles', nom:'Pluja d\'estrelles', preu:30}, {id:'llamps', nom:'Llamps', preu:35, min:6}, {id:'flames', nom:'Aura de foc', preu:50, min:12}];
function fxSVG(id, back){
  const star = (x, y, r, col) => `<path d="M${x} ${y - r} L${f1(x + r * .3)} ${f1(y - r * .3)} L${x + r} ${y} L${f1(x + r * .3)} ${f1(y + r * .3)} L${x} ${y + r} L${f1(x - r * .3)} ${f1(y + r * .3)} L${x - r} ${y} L${f1(x - r * .3)} ${f1(y - r * .3)} Z" fill="${col}"/>`;
  if (back) return id === 'flames' ? `<path d="M22 108 Q12 70 30 50 Q30 66 40 66 Q34 40 52 22 Q52 44 60 46 Q62 26 74 16 Q72 42 82 48 Q84 34 92 30 Q90 52 98 60 Q112 80 98 108 Z" fill="#ff8a3d" opacity=".55"/><path d="M34 108 Q28 80 42 66 Q44 78 52 78 Q50 58 62 44 Q64 62 72 66 Q76 56 82 54 Q86 76 86 108 Z" fill="#ffd84d" opacity=".55"/>`
    : id === 'llamps' ? `<circle cx="60" cy="66" r="46" fill="#bfe6ff" opacity=".35"/>` : id === 'brillantor' ? `<circle cx="60" cy="66" r="48" fill="#fff6a8" opacity=".45"/>` : '';
  switch (id) {
    case 'brillantor': return star(22, 30, 6, '#ffd84d') + star(98, 24, 5, '#fff') + star(102, 82, 6, '#ffd84d') + star(16, 84, 4, '#fff');
    case 'bombolles': return [[18,40,5],[24,24,3],[100,50,6],[96,30,3.5],[14,74,4],[106,80,3]].map(([x,y,r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#bfe6ff" fill-opacity=".4" stroke="#7fb7ef" stroke-width="1.2"/>`).join('');
    case 'cors': return [[16,34,1],[102,28,.8],[104,74,1.1],[14,80,.8]].map(([x,y,s]) => `<path d="M${x} ${y + 5 * s} c${-7 * s} ${-5 * s} ${-5 * s} ${-11 * s} 0 ${-7 * s} c${5 * s} ${-4 * s} ${7 * s} ${2 * s} 0 ${7 * s} z" fill="#ff4f7b"/>`).join('');
    case 'notes': return [[16,36],[100,30],[104,76]].map(([x,y], i) => `<g transform="translate(${x} ${y}) rotate(${i * 8 - 8})"><ellipse cx="0" cy="8" rx="4" ry="3" fill="${INK}"/><path d="M3.6 8 V-6 l6 2" stroke="${INK}" stroke-width="1.8" fill="none"/></g>`).join('');
    case 'estrelles': return [[14,22,5],[34,10,4],[86,12,5],[106,30,4],[100,96,5],[16,98,4],[60,6,3]].map(([x,y,r]) => star(x, y, r, '#ffd84d')).join('');
    case 'llamps': return `<path d="M18 26 l8 -2 l-6 12 l8 -2 l-12 18 l4 -14 l-7 2 z M100 62 l8 -2 l-6 12 l8 -2 l-12 18 l4 -14 l-7 2 z" fill="#ffd84d" stroke="#e8b400" stroke-width="1"/>`;
    case 'flames': return star(20, 30, 4, '#ffd84d') + star(100, 26, 4, '#fff6a8');
    default: return '';
  }
}

/* ---------- catàleg i dibuix final ---------- */
const PCAT = [
  {k:'color', nom:'Color', tipus:'color'}, {k:'color2', nom:'Segon color', tipus:'color'}, {k:'patro', nom:'Dibuix de la pell', items:PATRONS},
  {k:'ulls', nom:'Ulls', items:ULLS}, {k:'boca', nom:'Boca', items:BOQUES}, {k:'galtes', nom:'Galtes', items:GALTES},
  {k:'cap', nom:'Al cap', items:CAPS}, {k:'ulleres', nom:'Ulleres i màscares', items:ULLERES}, {k:'coll', nom:'Al coll', items:COLLS},
  {k:'ma', nom:'A la mà', items:MANS, needHand:true}, {k:'fons', nom:'Fons', items:FONSOS}, {k:'efecte', nom:'Efectes', items:EFECTES}];
const LOOK0 = {color:'blau', color2:'groc', patro:'llis', ulls:'rodons', boca:'somriure', galtes:'rosades', cap:'cap', ulleres:'cap', coll:'cap', ma:'cap', fons:'cap', efecte:'cap'};
const pItem = (k, id) => { const c = PCAT.find(x => x.k === k); return c && c.items ? c.items.find(x => x.id === id) : null; };
const handAt = (style, e) => (style === 'robot' ? e >= 6 : e >= 7);
const handFrom = style => style === 'robot' ? 6 : 7;
let charN = 0;
function charSVG(m, size = 110, mood = 'ok', opt = {}){
  const L = {...LOOK0, ...(m.look || {})}, style = m.style === 'robot' ? 'robot' : 'mascota';
  const e = opt.e || evoOf(m.xp || 0), c = PCOL[L.color] || PCOL.blau, c2 = PCOL[L.color2] || PCOL.groc;
  const b = style === 'robot' ? robotBody(e, c, c2) : vidaBody(e, c, c2), a = b.a, id = 'pc' + (++charN);
  const T = (p, s, svg) => svg ? `<g transform="translate(${f1(p[0])} ${f1(p[1])}) scale(${f1(s)})">${svg}</g>` : '';
  const capI = pItem('cap', L.cap), ullI = pItem('ulleres', L.ulleres), colI = pItem('coll', L.coll), maI = a.hand ? pItem('ma', L.ma) : null;
  const headS = a.head[2] / 40, neckS = a.neck[2] / 40, [ex, ey, edx, es] = a.eyes;
  const eyeCol = (L.ulls === 'led' || L.ulls === 'rodons') && b.eyeCol && L.ulls === 'led' ? b.eyeCol : null;
  const onDark = !!b.eyeCol; // els robots grans tenen la cara sobre una pantalla fosca
  const faceCol = onDark ? '#7ff5ff' : null;
  const eyes = eyeSVG(L.ulls, mood, ex - edx, ey, es, faceCol || eyeCol) + eyeSVG(L.ulls, mood, ex + edx, ey, es, faceCol || eyeCol);
  const mouth = mouthSVG(L.boca, mood, a.mouth[0], a.mouth[1], a.mouth[2], faceCol);
  const grad = L.patro === 'degradat' ? `<linearGradient id="pgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c2}" stop-opacity="0"/><stop offset="1" stop-color="${c2}" stop-opacity=".85"/></linearGradient>` : '';
  const label = opt.label != null ? opt.label : `${m.nom || 'Personatge'}: ${EVO_NOM[style][e - 1].toLowerCase()}`;
  return `<svg class="mascot" width="${size}" height="${size}" viewBox="0 0 120 120" role="img" aria-label="${(window.esc ? esc(label) : label)}">
    <defs><clipPath id="${id}">${b.shape}</clipPath>${grad}</defs>${b.defs || ''}
    ${opt.noBg ? '' : bgSVG(L.fons, c)}${e === EVO_MAX ? `<defs><radialGradient id="${id}a"><stop offset="0" stop-color="#fff3b0" stop-opacity=".95"/><stop offset=".6" stop-color="#ffd84d" stop-opacity=".35"/><stop offset="1" stop-color="#ffd84d" stop-opacity="0"/></radialGradient></defs><circle cx="60" cy="68" r="50" fill="url(#${id}a)"/>` : ''}${fxSVG(L.efecte, true)}
    ${colI && colI.back ? T(a.neck, neckS, colI.svg) : ''}${b.back || ''}
    <g fill="${b.fill || c}">${b.shape}</g><g clip-path="url(#${id})">${patternSVG(L.patro, c2)}</g>${b.over || ''}
    ${onDark ? '' : cheekSVG(L.galtes, a)}${eyes}${mouth}${T(a.eyes, edx / 10, ullI && ullI.svg)}
    ${colI && !colI.back ? T(a.neck, neckS, colI.svg) : ''}${b.front || ''}${T(a.head, headS, capI && capI.svg)}${maI ? T(a.hand, 1, maI.svg) : ''}
    ${fxSVG(L.efecte, false)}</svg>`;
}
