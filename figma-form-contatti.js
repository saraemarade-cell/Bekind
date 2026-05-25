// ────────────────────────────────────────────────────────────
// BeKind Foundation — Form Contatti per Figma
// Incolla questo codice nel Plugin Console di Figma:
//   Plugins → Development → Open Console
// ────────────────────────────────────────────────────────────

(async () => {
await Promise.all([
  figma.loadFontAsync({ family: "Inter", style: "Regular" }),
  figma.loadFontAsync({ family: "Inter", style: "Medium" }),
  figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
  figma.loadFontAsync({ family: "Inter", style: "Bold" }),
  figma.loadFontAsync({ family: "Inter", style: "Extra Bold" }),
]);

const C = {
  blueDark:  { r: 27/255,  g: 63/255,  b: 114/255 },
  blueMid:   { r: 27/255,  g: 79/255,  b: 138/255 },
  bluePale:  { r: 214/255, g: 238/255, b: 248/255 },
  orange:    { r: 245/255, g: 130/255, b: 13/255  },
  white:     { r: 1, g: 1, b: 1 },
  grey50:    { r: 248/255, g: 250/255, b: 252/255 },
  grey100:   { r: 241/255, g: 245/255, b: 249/255 },
  grey200:   { r: 226/255, g: 232/255, b: 240/255 },
  grey600:   { r: 71/255,  g: 85/255,  b: 105/255 },
  textDark:  { r: 30/255,  g: 41/255,  b: 59/255  },
};
const fill = c => [{ type: 'SOLID', color: c }];

function mkTxt(chars, size, style, color, opts) {
  opts = opts || {};
  const n = figma.createText();
  n.characters = chars;
  n.fontSize = size;
  n.fontName = { family: "Inter", style };
  n.fills = fill(color);
  if (opts.lh) n.lineHeight = { value: opts.lh, unit: 'PIXELS' };
  if (opts.opacity !== undefined) n.opacity = opts.opacity;
  if (opts.w) { n.resize(opts.w, 1); n.textAutoResize = 'HEIGHT'; }
  else n.textAutoResize = 'WIDTH_AND_HEIGHT';
  return n;
}

function vBox(name, gap, bg, radius, padH, padV) {
  const f = figma.createFrame();
  f.name = name; f.layoutMode = 'VERTICAL'; f.itemSpacing = gap || 0;
  f.fills = bg ? fill(bg) : []; if (radius) f.cornerRadius = radius;
  f.paddingLeft = f.paddingRight = padH || 0;
  f.paddingTop = f.paddingBottom = padV || 0;
  f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO';
  return f;
}
function hBox(name, gap, bg, radius, padH, padV) {
  const f = figma.createFrame();
  f.name = name; f.layoutMode = 'HORIZONTAL'; f.itemSpacing = gap || 0;
  f.fills = bg ? fill(bg) : []; if (radius) f.cornerRadius = radius;
  f.paddingLeft = f.paddingRight = padH || 0;
  f.paddingTop = f.paddingBottom = padV || 0;
  f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO';
  f.counterAxisAlignItems = 'CENTER';
  return f;
}
function sp(parent, w, h) {
  const s = figma.createFrame();
  s.name = 'Spacer'; s.resize(w, h); s.fills = [];
  parent.appendChild(s);
}

function inputField(label, ph, fw, fh) {
  fh = fh || 44;
  const wrap = vBox('Field: ' + label, 8);
  wrap.counterAxisSizingMode = 'FIXED'; wrap.resize(fw, 1);
  wrap.appendChild(mkTxt(label, 13, 'Semi Bold', C.textDark, { w: fw }));
  const box = figma.createFrame();
  box.name = 'Input'; box.layoutMode = 'HORIZONTAL';
  box.paddingTop = box.paddingBottom = 12;
  box.paddingLeft = box.paddingRight = 16;
  box.fills = fill(C.grey100); box.cornerRadius = 10;
  box.strokeWeight = 1.5; box.strokes = fill(C.grey200);
  box.primaryAxisSizingMode = 'FIXED'; box.counterAxisSizingMode = 'FIXED';
  box.resize(fw, fh); box.counterAxisAlignItems = 'MIN';
  box.appendChild(mkTxt(ph, 14, 'Regular', C.grey600, { opacity: 0.55 }));
  wrap.appendChild(box);
  return wrap;
}
function selectField(label, ph, fw) {
  const wrap = vBox('Field: ' + label, 8);
  wrap.counterAxisSizingMode = 'FIXED'; wrap.resize(fw, 1);
  wrap.appendChild(mkTxt(label, 13, 'Semi Bold', C.textDark, { w: fw }));
  const box = figma.createFrame();
  box.name = 'Select'; box.layoutMode = 'HORIZONTAL';
  box.paddingTop = box.paddingBottom = 12;
  box.paddingLeft = box.paddingRight = 16;
  box.fills = fill(C.grey100); box.cornerRadius = 10;
  box.strokeWeight = 1.5; box.strokes = fill(C.grey200);
  box.primaryAxisSizingMode = 'FIXED'; box.counterAxisSizingMode = 'FIXED';
  box.resize(fw, 44);
  box.primaryAxisAlignItems = 'SPACE_BETWEEN'; box.counterAxisAlignItems = 'CENTER';
  box.appendChild(mkTxt(ph, 14, 'Regular', C.grey600, { opacity: 0.55 }));
  box.appendChild(mkTxt('▾', 14, 'Regular', C.grey600));
  wrap.appendChild(box);
  return wrap;
}
function contactRow(emoji, label, val) {
  const row = hBox('Contact: ' + label, 14);
  row.counterAxisAlignItems = 'CENTER';
  const ib = hBox('Icon', 0, C.bluePale, 10, 0, 0);
  ib.primaryAxisSizingMode = 'FIXED'; ib.counterAxisSizingMode = 'FIXED';
  ib.primaryAxisAlignItems = 'CENTER'; ib.counterAxisAlignItems = 'CENTER';
  ib.resize(44, 44);
  ib.appendChild(mkTxt(emoji, 18, 'Regular', C.blueMid));
  row.appendChild(ib);
  const tc = vBox('Text', 4);
  tc.appendChild(mkTxt(label, 12, 'Semi Bold', C.blueDark));
  tc.appendChild(mkTxt(val, 14, 'Regular', C.grey600));
  row.appendChild(tc);
  return row;
}

// ─── LEFT COLUMN ────────────────────────────────────────────
const LW = 420;
const leftCol = vBox('Left Column', 0);
leftCol.counterAxisSizingMode = 'FIXED'; leftCol.resize(LW, 1);

leftCol.appendChild(mkTxt('Contattaci', 42, 'Extra Bold', C.blueDark, { lh: 52, w: LW }));
sp(leftCol, LW, 16);
leftCol.appendChild(mkTxt(
  'Hai domande sui programmi, vuoi collaborare\no hai bisogno di supporto?\nScrivici, siamo qui per te.',
  16, 'Regular', C.grey600, { lh: 26, w: LW }
));
sp(leftCol, LW, 40);

leftCol.appendChild(contactRow('✉', 'Email', 'info@bekindfoundation.org'));
sp(leftCol, LW, 16);
leftCol.appendChild(contactRow('📍', 'Sede', 'Via della Salute Mentale, 1 — Roma'));
sp(leftCol, LW, 16);
leftCol.appendChild(contactRow('📞', 'Telefono', '+39 06 1234 5678'));
sp(leftCol, LW, 40);

const socialRow = hBox('Social', 12);
[['f'],['◉'],['in']].forEach(([ic]) => {
  const btn = hBox('Btn', 0, C.blueMid, 10, 0, 0);
  btn.primaryAxisSizingMode = 'FIXED'; btn.counterAxisSizingMode = 'FIXED';
  btn.primaryAxisAlignItems = 'CENTER'; btn.counterAxisAlignItems = 'CENTER';
  btn.resize(44, 44);
  btn.appendChild(mkTxt(ic, 15, 'Bold', C.white));
  socialRow.appendChild(btn);
});
leftCol.appendChild(socialRow);

// ─── FORM CARD ──────────────────────────────────────────────
const CARDW = 580, PAD = 40, FW = CARDW - PAD * 2; // FW = 500
const HW = Math.floor((FW - 16) / 2);              // HW = 242

const card = vBox('Form Card', 20, C.white, 20, PAD, PAD);
card.counterAxisSizingMode = 'FIXED'; card.resize(CARDW, 1);
card.strokeWeight = 1; card.strokes = fill(C.grey200);
card.effects = [{
  type: 'DROP_SHADOW',
  color: { r: 27/255, g: 63/255, b: 114/255, a: 0.10 },
  offset: { x: 0, y: 8 }, radius: 40, spread: 0,
  visible: true, blendMode: 'NORMAL',
}];

const nameRow = hBox('Name Row', 16);
nameRow.counterAxisAlignItems = 'MIN';
nameRow.appendChild(inputField('Nome *', 'Il tuo nome', HW));
nameRow.appendChild(inputField('Cognome *', 'Il tuo cognome', HW));
card.appendChild(nameRow);

card.appendChild(inputField('Email *', 'la-tua@email.com', FW));
card.appendChild(selectField('Oggetto', 'Seleziona un argomento…', FW));
card.appendChild(inputField('Messaggio *', 'Scrivi il tuo messaggio…', FW, 120));

// Privacy checkbox row
const privRow = hBox('Privacy Row', 10);
privRow.counterAxisAlignItems = 'CENTER';
const cb = figma.createFrame();
cb.name = 'Checkbox'; cb.resize(18, 18); cb.cornerRadius = 4;
cb.strokeWeight = 1.5; cb.strokes = fill(C.grey200); cb.fills = fill(C.grey100);
privRow.appendChild(cb);
privRow.appendChild(mkTxt('Ho letto e accetto la Privacy Policy *', 13, 'Regular', C.grey600));
card.appendChild(privRow);

// Submit button
const submitBtn = hBox('Submit', 0, C.orange, 50, 28, 0);
submitBtn.primaryAxisSizingMode = 'FIXED'; submitBtn.counterAxisSizingMode = 'FIXED';
submitBtn.primaryAxisAlignItems = 'CENTER'; submitBtn.counterAxisAlignItems = 'CENTER';
submitBtn.resize(FW, 54);
submitBtn.appendChild(mkTxt('Invia Messaggio  →', 16, 'Semi Bold', C.white));
card.appendChild(submitBtn);

// ─── SECTION CONTAINER ──────────────────────────────────────
const SW  = 1921;
const SPH = Math.floor((SW - LW - 64 - CARDW) / 2); // ≈ 428

const section = figma.createFrame();
section.name = 'Form Contatti';
section.layoutMode = 'HORIZONTAL';
section.primaryAxisSizingMode = 'FIXED';
section.counterAxisSizingMode = 'AUTO';
section.fills = fill(C.grey50);
section.paddingTop = section.paddingBottom = 96;
section.paddingLeft  = SPH;
section.paddingRight = SW - LW - 64 - CARDW - SPH;
section.itemSpacing = 64;
section.counterAxisAlignItems = 'MIN';
section.resize(SW, 1);

section.appendChild(leftCol);
section.appendChild(card);

// Position below existing content on this page
let maxY = 0, refX = 0;
for (const n of figma.currentPage.children) {
  const b = n.y + n.height;
  if (b > maxY) { maxY = b; refX = n.x; }
}
section.x = refX;
section.y = maxY + 120;

figma.currentPage.appendChild(section);
figma.viewport.scrollAndZoomIntoView([section]);
console.log('✅ Form Contatti creato con successo!');
})();
