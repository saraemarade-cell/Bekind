// ─────────────────────────────────────────────────────────────────────────────
// BeKind Foundation — Proxima + 5×1000 + Contatti + Footer
// Incolla nel Plugin Console di Figma:
//   Menu principale (F logo) → Plugins → Development → Open console
// ─────────────────────────────────────────────────────────────────────────────
(async () => {

// ── FONTS ────────────────────────────────────────────────────────────────────
let SERIF = "Georgia";
for (const fam of ["DM Serif Display", "Playfair Display", "Georgia"]) {
  try { await figma.loadFontAsync({ family: fam, style: "Regular" }); SERIF = fam; break; } catch {}
}
try { await figma.loadFontAsync({ family: SERIF, style: "Italic" }); } catch {}
try { await figma.loadFontAsync({ family: SERIF, style: "Bold" }); } catch {}
await Promise.all([
  figma.loadFontAsync({ family: "Inter", style: "Regular" }),
  figma.loadFontAsync({ family: "Inter", style: "Medium" }),
  figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
  figma.loadFontAsync({ family: "Inter", style: "Bold" }),
  figma.loadFontAsync({ family: "Inter", style: "Extra Bold" }),
]);

// ── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  navy:      { r:26/255,  g:43/255,  b:72/255  },
  navyMid:   { r:36/255,  g:52/255,  b:87/255  },
  navyDark:  { r:15/255,  g:29/255,  b:51/255  },
  orange:    { r:232/255, g:134/255, b:10/255  },
  orangeL:   { r:245/255, g:160/255, b:48/255  },
  white:     { r:1,       g:1,       b:1       },
  offWhite:  { r:247/255, g:249/255, b:252/255 },
  grey100:   { r:238/255, g:242/255, b:247/255 },
  grey200:   { r:221/255, g:228/255, b:239/255 },
  grey400:   { r:142/255, g:155/255, b:187/255 },
  grey600:   { r:74/255,  g:88/255,  b:120/255 },
  sky:       { r:135/255, g:206/255, b:235/255 },
  skyLight:  { r:200/255, g:232/255, b:245/255 },
};
const f  = c       => [{ type:"SOLID", color: c }];
const fA = (c, a)  => [{ type:"SOLID", color: c, opacity: a }];

// ── HELPERS ──────────────────────────────────────────────────────────────────
const SW = 1921; // section width

function txt(chars, size, family, style, color, opts) {
  opts = opts || {};
  const n = figma.createText();
  n.characters = chars;
  n.fontSize    = size;
  n.fontName    = { family, style };
  n.fills       = f(color);
  if (opts.lh)      n.lineHeight    = { value: opts.lh, unit: "PIXELS" };
  if (opts.ls)      n.letterSpacing = { value: opts.ls, unit: "PERCENT" };
  if (opts.opacity) n.opacity       = opts.opacity;
  if (opts.w)       { n.resize(opts.w, 1); n.textAutoResize = "HEIGHT"; }
  else              n.textAutoResize = "WIDTH_AND_HEIGHT";
  return n;
}
function itxt(chars, size, color, opts) { return txt(chars, size, SERIF, "Italic",   color, opts); }
function stxt(chars, size, color, opts) { return txt(chars, size, SERIF, "Regular",  color, opts); }
function btxt(chars, size, color, opts) { return txt(chars, size, "Inter", "Bold",   color, opts); }
function mtxt(chars, size, color, opts) { return txt(chars, size, "Inter", "Semi Bold", color, opts); }
function rtxt(chars, size, color, opts) { return txt(chars, size, "Inter", "Regular", color, opts); }

function vf(name, gap, bg, radius, pH, pV) {
  const fr = figma.createFrame();
  fr.name = name; fr.layoutMode = "VERTICAL"; fr.itemSpacing = gap || 0;
  fr.fills = bg ? f(bg) : []; if (radius) fr.cornerRadius = radius;
  fr.paddingLeft = fr.paddingRight = pH || 0;
  fr.paddingTop = fr.paddingBottom = pV || 0;
  fr.primaryAxisSizingMode = "AUTO"; fr.counterAxisSizingMode = "AUTO";
  return fr;
}
function hf(name, gap, bg, radius, pH, pV) {
  const fr = figma.createFrame();
  fr.name = name; fr.layoutMode = "HORIZONTAL"; fr.itemSpacing = gap || 0;
  fr.fills = bg ? f(bg) : []; if (radius) fr.cornerRadius = radius;
  fr.paddingLeft = fr.paddingRight = pH || 0;
  fr.paddingTop = fr.paddingBottom = pV || 0;
  fr.primaryAxisSizingMode = "AUTO"; fr.counterAxisSizingMode = "AUTO";
  fr.counterAxisAlignItems = "MIN";
  return fr;
}
function fixed(fr, w) {
  fr.counterAxisSizingMode = "FIXED"; fr.resize(w, 1); return fr;
}
function sp(parent, w, h) {
  const s = figma.createFrame(); s.name = "_sp"; s.resize(w, h); s.fills = [];
  parent.appendChild(s);
}
function shadow(fr) {
  fr.effects = [{ type:"DROP_SHADOW", color:{ r:26/255, g:43/255, b:72/255, a:0.13 },
    offset:{ x:0, y:6 }, radius:28, spread:0, visible:true, blendMode:"NORMAL" }];
}

// pill badge
function badge(label, bg, textColor) {
  const b = hf("Badge", 0, bg, 50, 14, 6);
  b.counterAxisAlignItems = "CENTER";
  b.appendChild(mtxt(label, 11, textColor, { ls: 7 }));
  return b;
}
// orange CTA button
function ctaBtn(label, w) {
  const btn = hf("CTA", 0, C.orange, 50, 30, 0);
  btn.counterAxisAlignItems = "CENTER"; btn.primaryAxisAlignItems = "CENTER";
  btn.primaryAxisSizingMode = "FIXED"; btn.counterAxisSizingMode = "FIXED";
  btn.resize(w || 200, 52);
  btn.appendChild(mtxt(label, 15, C.white));
  return btn;
}
// outline button (white border)
function outlineBtn(label, w) {
  const btn = hf("OutlineBtn", 0, null, 50, 30, 0);
  btn.counterAxisAlignItems = "CENTER"; btn.primaryAxisAlignItems = "CENTER";
  btn.primaryAxisSizingMode = "FIXED"; btn.counterAxisSizingMode = "FIXED";
  btn.strokeWeight = 2; btn.strokes = fA(C.white, 0.6);
  btn.resize(w || 200, 52);
  btn.appendChild(mtxt(label, 15, C.white));
  return btn;
}
// input field for form
function inputField(label, placeholder, w) {
  const wrap = vf("Field:"+label, 8); fixed(wrap, w);
  wrap.appendChild(mtxt(label, 13, { r:1,g:1,b:1 }, { opacity: 0.75, w }));
  const box = figma.createFrame();
  box.name = "Input"; box.layoutMode = "HORIZONTAL";
  box.paddingTop = box.paddingBottom = 13; box.paddingLeft = box.paddingRight = 16;
  box.fills = fA(C.white, 0.08);
  box.strokeWeight = 1.5; box.strokes = fA(C.white, 0.18);
  box.cornerRadius = 10;
  box.primaryAxisSizingMode = "FIXED"; box.counterAxisSizingMode = "FIXED";
  box.resize(w, 46);
  box.appendChild(rtxt(placeholder, 14, C.grey400, { opacity: 0.7 }));
  wrap.appendChild(box);
  return wrap;
}
// textarea
function textareaField(label, placeholder, w) {
  const wrap = vf("Field:"+label, 8); fixed(wrap, w);
  wrap.appendChild(mtxt(label, 13, { r:1,g:1,b:1 }, { opacity: 0.75, w }));
  const box = figma.createFrame();
  box.name = "Textarea"; box.layoutMode = "VERTICAL";
  box.paddingTop = box.paddingBottom = 13; box.paddingLeft = box.paddingRight = 16;
  box.fills = fA(C.white, 0.08);
  box.strokeWeight = 1.5; box.strokes = fA(C.white, 0.18);
  box.cornerRadius = 10;
  box.primaryAxisSizingMode = "FIXED"; box.counterAxisSizingMode = "FIXED";
  box.resize(w, 100);
  box.appendChild(rtxt(placeholder, 14, C.grey400, { opacity: 0.55 }));
  wrap.appendChild(box);
  return wrap;
}
// numbered step circle
function stepCircle(num) {
  const c = hf("StepNum", 0, C.navy, 50, 0, 0);
  c.primaryAxisSizingMode = "FIXED"; c.counterAxisSizingMode = "FIXED";
  c.primaryAxisAlignItems = "CENTER"; c.counterAxisAlignItems = "CENTER";
  c.resize(36, 36);
  c.appendChild(btxt(String(num), 15, C.white));
  return c;
}
// contact row (icon + text)
function contactRow(emoji, label, val, w) {
  const row = hf("ContactRow", 14); row.counterAxisAlignItems = "CENTER";
  const ib = hf("Icon", 0, { r:214/255,g:238/255,b:248/255 }, 10, 0, 0);
  ib.primaryAxisSizingMode = "FIXED"; ib.counterAxisSizingMode = "FIXED";
  ib.primaryAxisAlignItems = "CENTER"; ib.counterAxisAlignItems = "CENTER";
  ib.resize(44, 44);
  ib.appendChild(rtxt(emoji, 18, C.navy));
  row.appendChild(ib);
  const col = vf("Text", 4);
  col.appendChild(btxt(label, 12, C.white, { opacity: 0.55, ls: 6 }));
  col.appendChild(rtxt(val, 14, C.white, { opacity: 0.8 }));
  row.appendChild(col);
  return row;
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: PROXIMA
// ════════════════════════════════════════════════════════════════════════════
function makeProxima() {
  const sec = figma.createFrame();
  sec.name = "Proxima";
  sec.resize(SW, 700);
  // sky gradient background (cloud approximation)
  sec.fills = [{ type:"GRADIENT_LINEAR",
    gradientTransform:[[1,0,0],[0,1,0]],
    gradientStops:[
      { position:0,   color:{ r:0.80, g:0.92, b:0.96, a:1 } },
      { position:0.5, color:{ r:0.75, g:0.88, b:0.94, a:1 } },
      { position:1,   color:{ r:0.88, g:0.95, b:0.98, a:1 } },
    ]
  }];

  // watermark
  const wm = stxt("PROXIMA", 220, C.navy, { opacity: 0.055 });
  wm.x = -30; wm.y = 180;
  sec.appendChild(wm);

  // content row (centered)
  const PAD = Math.floor((SW - 320 - 72 - 560) / 2);
  const row = hf("Content", 72);
  row.paddingLeft = row.paddingRight = PAD;
  row.paddingTop = row.paddingBottom = 96;
  row.counterAxisSizingMode = "FIXED"; row.resize(SW, 1);
  row.primaryAxisSizingMode = "AUTO";

  // ── left: profile card ──
  const profileCard = vf("ProfileCard", 0, C.white, 20, 28, 28);
  profileCard.strokeWeight = 1; profileCard.strokes = fA(C.white, 0.9);
  shadow(profileCard);
  fixed(profileCard, 320);

  const av = hf("Avatar", 0, C.orange, 50, 0, 0);
  av.primaryAxisSizingMode = "FIXED"; av.counterAxisSizingMode = "FIXED";
  av.primaryAxisAlignItems = "CENTER"; av.counterAxisAlignItems = "CENTER";
  av.resize(72, 72); av.strokeWeight = 3; av.strokes = f(C.white);
  av.appendChild(btxt("S", 26, C.white));
  profileCard.appendChild(av);
  sp(profileCard, 280, 12);
  profileCard.appendChild(btxt("Sara", 17, C.navy));
  profileCard.appendChild(rtxt("Beneficiaria del programma", 13, C.grey400));
  sp(profileCard, 280, 18);

  // quote block
  const quoteWrap = hf("Quote", 12);
  quoteWrap.counterAxisAlignItems = "MIN";
  const quoteLine = figma.createFrame();
  quoteLine.resize(3, 72); quoteLine.cornerRadius = 2;
  quoteLine.fills = f(C.orange);
  quoteWrap.appendChild(quoteLine);
  quoteWrap.appendChild(itxt(
    '"Grazie al programma Proxima ho ritrovato me stessa e la forza di andare avanti."',
    14, C.grey600, { w: 260, lh: 22 }
  ));
  profileCard.appendChild(quoteWrap);

  // ── right: content ──
  const content = vf("ProximaContent", 0);
  fixed(content, 560);

  content.appendChild(badge("Programma in evidenza", C.orange, C.white));
  sp(content, 560, 14);
  const heading = stxt("Programma Proxima\nper la Salute Mentale", 48, C.navy, { w:560, lh:56 });
  content.appendChild(heading);
  sp(content, 560, 18);
  content.appendChild(rtxt(
    "Il Programma Proxima è la nostra iniziativa di punta per il supporto psicologico delle persone più vulnerabili. Attraverso un approccio integrato, offriamo sostegno continuo e personalizzato.",
    16, C.grey600, { w:520, lh:26 }
  ));
  sp(content, 560, 24);

  // checklist 2x2
  const checks = hf("Checklist", 20);
  checks.counterAxisAlignItems = "MIN";
  const col1 = vf("Col1", 12); const col2 = vf("Col2", 12);
  [
    ["Supporto individuale personalizzato", col1],
    ["Sessioni di gruppo settimanali", col1],
    ["Follow‑up a lungo termine", col2],
    ["Rete di supporto comunitario", col2],
  ].forEach(([label, col]) => {
    const item = hf("Item", 10); item.counterAxisAlignItems = "CENTER";
    const dot = figma.createFrame(); dot.name="dot"; dot.resize(8,8); dot.cornerRadius=4; dot.fills=f(C.orange);
    item.appendChild(dot);
    item.appendChild(mtxt(label, 14, C.navy));
    col.appendChild(item);
  });
  checks.appendChild(col1); checks.appendChild(col2);
  content.appendChild(checks);
  sp(content, 560, 28);
  content.appendChild(ctaBtn("Scopri Proxima", 180));

  row.appendChild(profileCard);
  row.appendChild(content);
  sec.appendChild(row);
  return sec;
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: 5×1000
// ════════════════════════════════════════════════════════════════════════════
function makeCinquePerMille() {
  const sec = figma.createFrame();
  sec.name = "5×1000";
  sec.resize(SW, 1);
  sec.fills = f(C.offWhite);
  sec.layoutMode = "VERTICAL"; sec.primaryAxisSizingMode = "AUTO"; sec.counterAxisSizingMode = "FIXED";

  const PAD = Math.floor((SW - 560 - 72 - 380) / 2);
  const row = hf("Content", 72);
  row.paddingLeft = row.paddingRight = PAD;
  row.paddingTop = row.paddingBottom = 96;
  row.counterAxisSizingMode = "FIXED"; row.resize(SW, 1);
  row.primaryAxisSizingMode = "AUTO";

  // ── left: text ──
  const left = vf("TextCol", 0); fixed(left, 560);

  left.appendChild(badge("Senza alcun costo per te", C.orange, C.white));
  sp(left, 560, 14);
  // heading with orange 5×1000
  const h = figma.createFrame();
  h.name="Heading"; h.layoutMode="HORIZONTAL"; h.counterAxisAlignItems="MIN";
  h.primaryAxisSizingMode="AUTO"; h.counterAxisSizingMode="AUTO"; h.itemSpacing=0;
  h.fills=[];
  // We'll just write the heading as one text node since Figma text can't easily mix colors inline
  const headingTxt = stxt("Destina il tuo 5×1000 a BeKind", 42, C.navy, { w:560, lh:50 });
  left.appendChild(headingTxt);
  sp(left, 560, 16);
  left.appendChild(rtxt(
    "Il 5×1000 è una quota dell'IRPEF che lo Stato destina agli enti del Terzo Settore. Non ti costa nulla in più: è già nelle tue tasse.",
    16, C.grey600, { w:520, lh:26 }
  ));
  sp(left, 560, 32);

  // steps
  const steps = vf("Steps", 20); fixed(steps, 560);
  [
    ["Compila la dichiarazione dei redditi",
     "Nel modulo 730, Modello Unico o CUD individua la sezione dedicata al 5×1000."],
    ["Firma nel riquadro corretto",
     "Firma in "Sostegno del volontariato, ONLUS, APS e fondazioni"."],
    ["Inserisci il nostro Codice Fiscale",
     "Scrivi il codice fiscale di BeKind Foundation nello spazio apposito."],
  ].forEach(([title, desc], i) => {
    const step = hf("Step"+(i+1), 16); step.counterAxisAlignItems = "MIN";
    step.appendChild(stepCircle(i+1));
    const col = vf("StepText", 4);
    col.appendChild(btxt(title, 15, C.navy));
    col.appendChild(rtxt(desc, 14, C.grey600, { w:490, lh:22 }));
    step.appendChild(col);
    steps.appendChild(step);
  });
  left.appendChild(steps);
  sp(left, 560, 32);
  left.appendChild(ctaBtn("Maggiori informazioni", 220));

  // ── right: CF card ──
  const card = vf("CFCard", 0, C.white, 20, 32, 32);
  card.strokeWeight = 1; card.strokes = f(C.grey200);
  shadow(card); fixed(card, 380);

  // logo placeholder
  const logoPh = hf("Logo", 0, C.grey100, 8, 12, 10);
  logoPh.counterAxisAlignItems = "CENTER";
  logoPh.primaryAxisSizingMode = "FIXED"; logoPh.counterAxisSizingMode = "FIXED";
  logoPh.resize(160, 44);
  logoPh.appendChild(mtxt("BeKind Foundation", 13, C.grey400));
  card.appendChild(logoPh);
  sp(card, 316, 24);

  // CF block
  const cfBox = vf("CFBox", 8, C.grey100, 12, 18, 16);
  cfBox.primaryAxisSizingMode = "AUTO"; cfBox.counterAxisSizingMode = "FIXED"; cfBox.resize(316, 1);
  cfBox.appendChild(mtxt("CODICE FISCALE", 11, C.grey400, { ls: 7 }));
  cfBox.appendChild(btxt("BEKIND12345678", 24, C.navy, { ls: 4 }));

  // copy button
  const copyBtn = hf("CopyBtn", 6, C.navy, 8, 12, 8);
  copyBtn.counterAxisAlignItems = "CENTER";
  copyBtn.appendChild(mtxt("Copia codice", 13, C.white));
  cfBox.appendChild(copyBtn);
  card.appendChild(cfBox);
  sp(card, 316, 18);

  // divider
  const div = figma.createFrame(); div.name="Divider"; div.resize(316, 1); div.fills=f(C.grey200);
  card.appendChild(div);
  sp(card, 316, 18);
  card.appendChild(rtxt("Inserisci questo codice nella tua dichiarazione dei redditi per destinare il 5×1000 a BeKind.", 13, C.grey600, { w:316, lh:20 }));
  sp(card, 316, 20);

  // impact box
  const impactBox = vf("Impact", 6, C.navy, 12, 20, 20);
  impactBox.primaryAxisSizingMode = "AUTO"; impactBox.counterAxisSizingMode = "FIXED"; impactBox.resize(316, 1);
  impactBox.counterAxisAlignItems = "CENTER";
  impactBox.appendChild(stxt("€47.000", 38, C.orange));
  impactBox.appendChild(rtxt("raccolti grazie al 5×1000 nel 2024", 13, C.white, { opacity:0.8 }));
  card.appendChild(impactBox);

  row.appendChild(left);
  row.appendChild(card);
  sec.appendChild(row);
  return sec;
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: CONTATTI
// ════════════════════════════════════════════════════════════════════════════
function makeContatti() {
  const sec = figma.createFrame();
  sec.name = "Contatti";
  sec.resize(SW, 1);
  sec.fills = f(C.navy);
  sec.layoutMode = "VERTICAL"; sec.primaryAxisSizingMode = "AUTO"; sec.counterAxisSizingMode = "FIXED";

  const CARD_W = 580, FIELD_W = CARD_W - 80, HW = Math.floor((FIELD_W - 16)/2);
  const PAD = Math.floor((SW - 420 - 72 - CARD_W) / 2);

  const row = hf("Content", 72);
  row.paddingLeft = row.paddingRight = PAD;
  row.paddingTop = row.paddingBottom = 96;
  row.counterAxisSizingMode = "FIXED"; row.resize(SW, 1);
  row.primaryAxisSizingMode = "AUTO";

  // ── left: contact info ──
  const left = vf("ContactInfo", 0); fixed(left, 420);

  left.appendChild(stxt("Entra in Contatto\ncon Noi", 44, C.white, { w:400, lh:52 }));
  sp(left, 420, 16);
  left.appendChild(rtxt("Hai domande, vuoi collaborare o hai bisogno di supporto? Il nostro team è pronto ad ascoltarti.", 16, C.white, { w:400, lh:26, opacity: 0.7 }));
  sp(left, 420, 40);
  left.appendChild(contactRow("✉", "EMAIL", "info@bekindfoundation.org", 420));
  sp(left, 420, 14);
  left.appendChild(contactRow("📞", "TELEFONO", "+39 06 1234 5678", 420));
  sp(left, 420, 14);
  left.appendChild(contactRow("📍", "SEDE", "Via della Salute Mentale, 1 — Roma", 420));

  // ── right: form card ──
  const formCard = vf("FormCard", 20, null, 20, 40, 40);
  formCard.fills = fA(C.white, 0.06);
  formCard.strokeWeight = 1; formCard.strokes = fA(C.white, 0.12);
  fixed(formCard, CARD_W);

  // Nome + Cognome row
  const nameRow = hf("NameRow", 16); nameRow.counterAxisAlignItems = "MIN";
  nameRow.appendChild(inputField("Nome", "Il tuo nome", HW));
  nameRow.appendChild(inputField("Cognome", "Il tuo cognome", HW));
  formCard.appendChild(nameRow);
  formCard.appendChild(inputField("Email", "la-tua@email.com", FIELD_W));

  // select oggetto
  const selWrap = vf("Field:Oggetto", 8); fixed(selWrap, FIELD_W);
  selWrap.appendChild(mtxt("Oggetto", 13, C.white, { opacity: 0.75, w: FIELD_W }));
  const selBox = hf("Select", 0, null, 10, 16, 0);
  selBox.fills = fA(C.white, 0.08);
  selBox.strokeWeight = 1.5; selBox.strokes = fA(C.white, 0.18);
  selBox.primaryAxisSizingMode = "FIXED"; selBox.counterAxisSizingMode = "FIXED";
  selBox.resize(FIELD_W, 46);
  selBox.primaryAxisAlignItems = "SPACE_BETWEEN"; selBox.counterAxisAlignItems = "CENTER";
  selBox.appendChild(rtxt("Seleziona un argomento", 14, C.grey400, { opacity: 0.7 }));
  selBox.appendChild(rtxt("▾", 14, C.grey400));
  selWrap.appendChild(selBox);
  formCard.appendChild(selWrap);

  formCard.appendChild(textareaField("Messaggio", "Scrivi il tuo messaggio…", FIELD_W));

  // privacy row
  const privRow = hf("Privacy", 10); privRow.counterAxisAlignItems = "CENTER";
  const cb = figma.createFrame(); cb.name="CB"; cb.resize(18,18); cb.cornerRadius=4;
  cb.strokeWeight=1.5; cb.strokes=fA(C.white,0.25); cb.fills=fA(C.white,0.08);
  privRow.appendChild(cb);
  privRow.appendChild(rtxt("Ho letto e accetto la Privacy Policy", 13, C.white, { opacity: 0.6 }));
  formCard.appendChild(privRow);

  // submit
  const sub = hf("Submit", 0, C.orange, 50, 0, 0);
  sub.primaryAxisSizingMode = "FIXED"; sub.counterAxisSizingMode = "FIXED";
  sub.primaryAxisAlignItems = "CENTER"; sub.counterAxisAlignItems = "CENTER";
  sub.resize(FIELD_W, 54);
  sub.appendChild(mtxt("Invia Messaggio  →", 16, C.white));
  formCard.appendChild(sub);

  row.appendChild(left);
  row.appendChild(formCard);
  sec.appendChild(row);
  return sec;
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: FOOTER
// ════════════════════════════════════════════════════════════════════════════
function makeFooter() {
  const sec = figma.createFrame();
  sec.name = "Footer";
  sec.resize(SW, 1);
  sec.fills = f(C.navyDark);
  sec.layoutMode = "VERTICAL"; sec.primaryAxisSizingMode = "AUTO"; sec.counterAxisSizingMode = "FIXED";
  sec.itemSpacing = 0;

  const PAD = Math.floor((SW - 1160) / 2);

  // ── upper row ──
  const upper = hf("Upper", 64);
  upper.paddingLeft = upper.paddingRight = PAD;
  upper.paddingTop = upper.paddingBottom = 64;
  upper.counterAxisSizingMode = "FIXED"; upper.resize(SW, 1);
  upper.primaryAxisSizingMode = "AUTO";

  // brand column
  const brand = vf("Brand", 0); fixed(brand, 280);
  // logo placeholder (white version)
  const logoPh = hf("LogoPlaceholder", 0, null, 8, 0, 0);
  logoPh.primaryAxisSizingMode = "FIXED"; logoPh.counterAxisSizingMode = "FIXED"; logoPh.resize(160, 44);
  logoPh.fills = fA(C.white, 0.1);
  logoPh.counterAxisAlignItems = "CENTER"; logoPh.primaryAxisAlignItems = "CENTER";
  logoPh.appendChild(mtxt("BeKind Foundation", 13, C.white, { opacity: 0.7 }));
  brand.appendChild(logoPh);
  sp(brand, 280, 16);
  brand.appendChild(rtxt("Trasformiamo il supporto psicologico e proteggiamo il diritto fondamentale alla salute mentale.", 14, C.white, { w:260, lh:22, opacity: 0.5 }));
  upper.appendChild(brand);

  // link columns
  const cols = hf("LinkCols", 56);
  [
    ["Fondazione", ["Chi Siamo", "Programmi", "Collaborazioni"]],
    ["Supporta",   ["Dona", "5×1000", "Volontariato"]],
    ["Legale",     ["Privacy Policy", "Cookie Policy", "Statuto"]],
  ].forEach(([title, links]) => {
    const col = vf("Col:"+title, 0); fixed(col, 140);
    col.appendChild(mtxt(title.toUpperCase(), 12, C.white, { ls: 7, opacity: 0.9 }));
    sp(col, 140, 16);
    links.forEach(l => {
      col.appendChild(rtxt(l, 14, C.white, { opacity: 0.5 }));
      sp(col, 140, 8);
    });
    cols.appendChild(col);
  });
  upper.appendChild(cols);

  // ── divider ──
  const divider = figma.createFrame(); divider.name="Divider"; divider.resize(SW, 1);
  divider.fills = fA(C.white, 0.08);

  // ── bottom bar ──
  const bottom = hf("BottomBar", 0);
  bottom.paddingLeft = bottom.paddingRight = PAD;
  bottom.paddingTop = bottom.paddingBottom = 20;
  bottom.primaryAxisAlignItems = "CENTER"; bottom.counterAxisAlignItems = "CENTER";
  bottom.counterAxisSizingMode = "FIXED"; bottom.resize(SW, 1);
  bottom.primaryAxisSizingMode = "AUTO";
  bottom.appendChild(rtxt("© 2025 BeKind Foundation · Codice Fiscale: BEKIND12345678 · Tutti i diritti riservati", 12, C.white, { opacity: 0.3 }));

  sec.appendChild(upper);
  sec.appendChild(divider);
  sec.appendChild(bottom);
  return sec;
}

// ════════════════════════════════════════════════════════════════════════════
// ASSEMBLE & PLACE
// ════════════════════════════════════════════════════════════════════════════
const sections = [makeProxima(), makeCinquePerMille(), makeContatti(), makeFooter()];

// Find bottom of existing content
let refX = 0, maxY = 0;
for (const n of figma.currentPage.children) {
  const b = n.y + n.height;
  if (b > maxY) { maxY = b; refX = n.x; }
}

let y = maxY + 120;
for (const sec of sections) {
  sec.x = refX;
  sec.y = y;
  y += sec.height;
  figma.currentPage.appendChild(sec);
}

figma.viewport.scrollAndZoomIntoView(sections);
console.log("✅ 4 sezioni create: Proxima, 5×1000, Contatti, Footer");
})();
