// GameData.jsx - Static game data


export const TECHS = {
  erde: [
    { id:"wiss",      name:"Wissenschaftler",    emoji:"🔬", baseCost:80,     type:"random",  minR:0,    maxR:300,   sci:true,  desc:"Forschungsmissionen – zufälliger Ertrag, manchmal ...", bonus:"+0–300 Wissenschaft" },
    { id:"militaer",  name:"Militär ausbauen",   emoji:"⚔️",   baseCost:200,    type:"steady",  def:25,                desc:"Erdverteidigung ausbauen.", bonus:"+25 Verteidigung/Stufe" },
    { id:"solar",     name:"Solarkraftwerke",    emoji:"☀️",   baseCost:300,    type:"steady",  cr:3,   en:10,         desc:"Saubere Energie.", bonus:"+3 Kr./s · +10 En." },
    { id:"staedte",   name:"Stadtausbau",        emoji:"🏙️",   baseCost:400,    type:"steady",  cr:5,   pop:5e8,      desc:"Infrastruktur und Industrie.", bonus:"+5 Kr./s · +500M Bev." },
    { id:"atom",      name:"Atomenergie",        emoji:"⚛️",   baseCost:700,    type:"steady",  cr:8,   en:40,        desc:"Kernkraftwerke.", bonus:"+8 Kr./s · +40 En." },
    { id:"computer",  name:"Computertechnik",    emoji:"💻",   baseCost:900,    type:"multiplier", mult:1.12,         desc:"Optimiert alle Prozesse.", bonus:"×1.12 Einnahmen" },
    { id:"pdc",       name:"PDC-Batterien",      emoji:"🛡️",   baseCost:1200,   type:"steady",  def:60,              desc:"Punkt-Abwehr-Kanonen.", bonus:"+60 Vert./Stufe" },
    { id:"biotech",   name:"Biotechnologie",     emoji:"🧬",   baseCost:2000,   type:"random",  minR:200, maxR:2000, sci:true, desc:"Unberechenbare Forschung.", bonus:"+200–2K Wiss." },
    { id:"quantum",   name:"Quantencomputer",    emoji:"🔮",   baseCost:3500,   type:"multiplier", mult:1.18,         desc:"Quantenrechner.", bonus:"×1.18 Einnahmen" },
    { id:"wallfacer", name:"Schattenstratege-Prog.", emoji:"🧠",   baseCost:4000,   type:"random",  minR:0,   maxR:8000, sci:true, desc:"Geheimstrategie mit hohem Risiko.", bonus:"+0–8K Wiss." },
    { id:"rakete",    name:"Raumfahrttechnik",   emoji:"🚀",   baseCost:8000,   type:"unlock",  unlocks:"mond",       desc:"Für eine Mondbasis.", bonus:"Schaltet Mond frei!" },
  ],
  mond: [
    { id:"mondbasis", name:"Basisstruktur",      emoji:"🏗️",   baseCost:2000,   type:"steady",  cr:8,   pop:500,    desc:"Kerninfrastruktur der Mondbasis.", bonus:"+8 Kr./s" },
    { id:"helium",    name:"Helium-3 Abbau",     emoji:"⛏️",   baseCost:4000,   type:"steady",  cr:25,  en:20,      desc:"Helium-3 für Fusionsreaktoren.", bonus:"+25 Kr./s · +20 En." },
    { id:"mondatom",  name:"Mondreaktor",        emoji:"⚛️",   baseCost:5000,   type:"steady",  cr:15,  en:60,      desc:"Kernreaktor auf dem Mond.", bonus:"+15 Kr./s · +60 En." },
    { id:"mondmil",   name:"Mondmilitär",        emoji:"⚔️",   baseCost:7000,   type:"steady",  def:80,             desc:"Militär und Raketenabwehr.", bonus:"+80 Vert./Stufe" },
    { id:"mondlabs",  name:"Mondlabore",         emoji:"🔬",   baseCost:8000,   type:"random",  minR:500,maxR:3000, sci:true, desc:"Forschung in Schwerelosigkeit.", bonus:"+500–3K Wiss." },
    { id:"mondquant", name:"Mondquantenlab",     emoji:"🔮",   baseCost:12000,  type:"steady",  cr:40,  en:30,      desc:"Quantenforschung im Vakuum.", bonus:"+40 Kr./s" },
    { id:"venexp",    name:"Venus-Sonde",        emoji:"🚀",   baseCost:20000,  type:"unlock",  unlocks:"venus",    desc:"Atmosphärensonden für Venus.", bonus:"Schaltet Venus frei!" },
    { id:"marsrkt",   name:"Mars-Rakete",        emoji:"🚀",   baseCost:25000,  type:"unlock",  unlocks:"mars",     desc:"Langstreckenraketen.", bonus:"Schaltet Mars frei!" },
  ],
  venus: [
    { id:"vensonde",  name:"Atmosphärensonden",  emoji:"🌡️",   baseCost:18000,  type:"steady",  cr:30,  en:20,      desc:"Sonden ernten Sonnenenergie.", bonus:"+30 Kr./s · +20 En." },
    { id:"venlab",    name:"Schwebelabor",        emoji:"🔬",   baseCost:30000,  type:"random",  minR:1000,maxR:8000,sci:true, desc:"Labors in 50km Höhe.", bonus:"+1K–8K Wiss." },
    { id:"venmil",    name:"Orbitale Kanonen",    emoji:"⚔️",   baseCost:45000,  type:"steady",  def:120,            desc:"Orbitale Verteidigung.", bonus:"+120 Vert./Stufe" },
    { id:"venreakt",  name:"Venus-Reaktor",       emoji:"⚛️",   baseCost:60000,  type:"steady",  cr:80,  en:100,     desc:"Reaktor im Venustorbit.", bonus:"+80 Kr./s · +100 En." },
  ],
  mars: [
    { id:"kuppel",    name:"Koloniekuppel",       emoji:"🏠",   baseCost:30000,  type:"steady",  cr:40,  pop:2000,   desc:"Kuppeln für Marssiedler.", bonus:"+40 Kr./s · +2K Bev." },
    { id:"marsatom",  name:"Mars-Reaktor",        emoji:"⚛️",   baseCost:50000,  type:"steady",  cr:80,  en:120,     desc:"Nuklearreaktor für Mars.", bonus:"+80 Kr./s · +120 En." },
    { id:"terra",     name:"Terraforming",        emoji:"🌱",   baseCost:60000,  type:"random",  minR:2000,maxR:20000,sci:true, desc:"Marsatmosphäre umgestalten.", bonus:"+2K–20K Wiss." },
    { id:"marsflotte",name:"Raumflotte",          emoji:"🛸",   baseCost:80000,  type:"steady",  def:200,cr:60,      desc:"Interplanetare Kampfschiffe.", bonus:"+200 Vert. · +60 Kr./s" },
    { id:"marswaffen",name:"Railgun-Batterien",   emoji:"🎯",   baseCost:100000, type:"steady",  def:300,            desc:"Elektromagnetische Kanonen.", bonus:"+300 Vert./Stufe" },
    { id:"phobexp",   name:"Phobos-Station",      emoji:"🚀",   baseCost:120000, type:"unlock",  unlocks:"phobos",   desc:"Station auf Phobos.", bonus:"Schaltet Phobos frei!" },
    { id:"astweg",    name:"Asteroidenroute",     emoji:"☄️",   baseCost:150000, type:"unlock",  unlocks:"ceres",    desc:"Route zum Asteroidengürtel.", bonus:"Schaltet Ceres frei!" },
  ],
  phobos: [
    { id:"phobbase",  name:"Phobos-Basis",        emoji:"🏗️",   baseCost:100000, type:"steady",  cr:120, def:200,    desc:"Militärbasis auf Phobos.", bonus:"+120 Kr./s · +200 Vert." },
    { id:"phobmine",  name:"Phobos-Bergbau",      emoji:"⛏️",   baseCost:180000, type:"steady",  cr:250, en:80,      desc:"Rohstoffabbau auf Phobos.", bonus:"+250 Kr./s · +80 En." },
    { id:"deimexp",   name:"Deimos-Station",      emoji:"🚀",   baseCost:250000, type:"unlock",  unlocks:"deimos",   desc:"Zweiter Marsmond.", bonus:"Schaltet Deimos frei!" },
  ],
  deimos: [
    { id:"deimbase",  name:"Deimos-Außenposten",  emoji:"📡",   baseCost:200000, type:"steady",  cr:180,             desc:"Beobachtungsposten.", bonus:"+180 Kr./s" },
    { id:"deimlab",   name:"Deimos-Labor",        emoji:"🔬",   baseCost:300000, type:"random",  minR:5000,maxR:30000,sci:true, desc:"Forschungslabor.", bonus:"+5K–30K Wiss." },
  ],
  ceres: [
    { id:"ceresbase", name:"Ceres-Kolonie",       emoji:"🏗️",   baseCost:200000, type:"steady",  cr:300, pop:5000,   desc:"Kolonie auf Ceres.", bonus:"+300 Kr./s" },
    { id:"ceresmine", name:"Wassereisabbau",      emoji:"💧",   baseCost:350000, type:"steady",  cr:400, en:150,     desc:"Riesige Wassereisvorkommen.", bonus:"+400 Kr./s · +150 En." },
    { id:"vestexp",   name:"Vesta-Expedition",    emoji:"☄️",   baseCost:400000, type:"unlock",  unlocks:"vesta",    desc:"Asteroid Vesta.", bonus:"Schaltet Vesta frei!" },
    { id:"ceresrkt",  name:"Jupiter-Route",       emoji:"🚀",   baseCost:500000, type:"unlock",  unlocks:"jupiter",  desc:"Route zu Jupiter.", bonus:"Schaltet Jupiter frei!" },
  ],
  vesta: [
    { id:"vestabase", name:"Vesta-Bergbau",       emoji:"⛏️",   baseCost:350000, type:"steady",  cr:500, en:200,     desc:"Wertvolle Mineralien.", bonus:"+500 Kr./s" },
    { id:"vestaweap", name:"Kinetischer Impaktör",emoji:"💥",   baseCost:600000, type:"steady",  def:600,            desc:"Lenkt Asteroiden auf Feinde.", bonus:"+600 Vert./Stufe" },
  ],
  jupiter: [
    { id:"orbital",   name:"Orbitalplattform",    emoji:"🛸",   baseCost:1000000, type:"steady", cr:1500,pop:20000,  desc:"Riesige Industriestation.", bonus:"+1.500 Kr./s" },
    { id:"jupreaktor",name:"Fusionsanlage",        emoji:"⚛️",   baseCost:2000000, type:"steady", cr:500, en:500,    desc:"Jupiters Wasserstoff als Energie.", bonus:"+500 Kr./s · +500 En." },
    { id:"fusion",    name:"Megafusion",           emoji:"⚡",   baseCost:3000000, type:"steady", en:600,            desc:"Nahezu unbegrenzte Energie.", bonus:"+600 En./Stufe" },
    { id:"jupwaffen", name:"Plasmatorpedos",       emoji:"🔥",   baseCost:5000000, type:"steady", def:2000,          desc:"Plasma-Waffen.", bonus:"+2.000 Vert./Stufe" },
    { id:"ioexp",     name:"Io-Reaktor",           emoji:"🌋",   baseCost:4000000, type:"unlock", unlocks:"io",      desc:"Geothermie auf Io.", bonus:"Schaltet Io frei!" },
    { id:"europaexp", name:"Europa-Tauchboot",     emoji:"🌊",   baseCost:6000000, type:"unlock", unlocks:"europa",  desc:"Ozean unter Europas Eis.", bonus:"Schaltet Europa frei!" },
    { id:"ganyexp",   name:"Ganymed-Station",     emoji:"🚀",   baseCost:8000000, type:"unlock", unlocks:"ganymed", desc:"Jupitermond Ganymed.", bonus:"Schaltet Ganymed frei!" },
    { id:"satexp",    name:"Saturn-Route",        emoji:"🪐",   baseCost:10000000,type:"unlock", unlocks:"saturn",  desc:"Route zu Saturn.", bonus:"Schaltet Saturn frei!" },
  ],
  io: [
    { id:"iobase",    name:"Io-Geothermie",       emoji:"🌋",   baseCost:3000000, type:"steady", cr:2000,en:800,    desc:"Vulkanische Energie auf Io.", bonus:"+2.000 Kr./s · +800 En." },
    { id:"iomil",     name:"Io-Raketenwerfer",    emoji:"🎯",   baseCost:5000000, type:"steady", def:1500,          desc:"Vulkanische Raketenwerfer.", bonus:"+1.500 Vert./Stufe" },
  ],
  europa: [
    { id:"europbase", name:"Unterwasserbasis",    emoji:"🌊",   baseCost:5000000, type:"steady", cr:2500,           desc:"Basis unter dem Eisozean.", bonus:"+2.500 Kr./s" },
    { id:"europlife", name:"Lebensformen!",       emoji:"🦠",   baseCost:8000000, type:"random", minR:50000,maxR:500000,sci:true,desc:"Suche nach Leben.", bonus:"+50K–500K Wiss." },
  ],
  ganymed: [
    { id:"ganybase",  name:"Ganymed-Kolonie",     emoji:"🏗️",   baseCost:6000000, type:"steady", cr:3000,pop:50000, desc:"Riesige Kolonie.", bonus:"+3.000 Kr./s" },
    { id:"ganymil",   name:"Magnetfeld-Waffe",    emoji:"🧲",   baseCost:9000000, type:"steady", def:3000,          desc:"Magnetfeld als Waffe.", bonus:"+3.000 Vert./Stufe" },
  ],
  saturn: [
    { id:"satring",   name:"Ringe-Bergbau",       emoji:"💍",   baseCost:12000000,type:"steady", cr:4000,en:600,    desc:"Eisringe als Rohstoff.", bonus:"+4.000 Kr./s · +600 En." },
    { id:"satbase",   name:"Saturn-Station",      emoji:"🛸",   baseCost:15000000,type:"steady", cr:5000,pop:80000, desc:"Gigantische Raumstation.", bonus:"+5.000 Kr./s" },
    { id:"titanexp",  name:"Titan-Kolonie",       emoji:"🚀",   baseCost:18000000,type:"unlock", unlocks:"titan",   desc:"Saturns Mond Titan.", bonus:"Schaltet Titan frei!" },
    { id:"enceexp",   name:"Enceladus-Sonden",    emoji:"💧",   baseCost:20000000,type:"unlock", unlocks:"enceladus",desc:"Wassergeysire.", bonus:"Schaltet Enceladus frei!" },
    { id:"uranexp",   name:"Uranus-Route",        emoji:"🔵",   baseCost:25000000,type:"unlock", unlocks:"uranus",  desc:"Route zu Uranus.", bonus:"Schaltet Uranus frei!" },
  ],
  titan: [
    { id:"titanbase", name:"Titan-Basis",         emoji:"🏗️",   baseCost:15000000,type:"steady", cr:6000,pop:100000,desc:"Dichte Atmosphäre – Siedlungen.", bonus:"+6.000 Kr./s" },
    { id:"titanmult", name:"Titan-Forschung",     emoji:"🔬",   baseCost:25000000,type:"multiplier",mult:1.15,      desc:"Revolutionäre Chemie.", bonus:"×1.15 auf alles" },
  ],
  enceladus: [
    { id:"encbase",   name:"Geysir-Reaktoren",    emoji:"💧",   baseCost:18000000,type:"steady", cr:4000,en:1000,   desc:"Energie aus Wassergeysiren.", bonus:"+4.000 Kr./s · +1.000 En." },
    { id:"enclife",   name:"Ozeanforschung",      emoji:"🦠",   baseCost:30000000,type:"random", minR:100000,maxR:1000000,sci:true,desc:"Mögliches Leben unter dem Eis.", bonus:"+100K–1Mio Wiss." },
  ],
  uranus: [
    { id:"uranbase",  name:"Uranus-Station",      emoji:"🔵",   baseCost:30000000,type:"steady", cr:8000,en:1500,   desc:"Eisriese – gewaltige Energie.", bonus:"+8.000 Kr./s" },
    { id:"uranmil",   name:"Magnetfeld-Kanonen",  emoji:"⚡",   baseCost:45000000,type:"steady", def:5000,          desc:"Magnetfeld als Waffe.", bonus:"+5.000 Vert./Stufe" },
    { id:"nepexp",    name:"Neptun-Route",        emoji:"🌀",   baseCost:50000000,type:"unlock", unlocks:"neptun",  desc:"Route zu Neptun.", bonus:"Schaltet Neptun frei!" },
  ],
  neptun: [
    { id:"nepbase",   name:"Neptun-Außenposten",  emoji:"🌀",   baseCost:50000000,type:"steady", cr:12000,en:2000,  desc:"Äußerster Planet.", bonus:"+12.000 Kr./s" },
    { id:"tritonexp", name:"Triton-Basis",        emoji:"🚀",   baseCost:60000000,type:"unlock", unlocks:"triton",  desc:"Neptunmond Triton.", bonus:"Schaltet Triton frei!" },
    { id:"nepmod",    name:"Stilles-Universum-Detektor",emoji:"📡",   baseCost:70000000,type:"multiplier",mult:1.2,       desc:"Suche nach stillen Universum-Signalen.", bonus:"×1.2 auf alles" },
    { id:"trisig",    name:"Khaos-Signal",   emoji:"📡",   baseCost:80000000,type:"unlock", unlocks:"khaos",desc:"Signal Richtung Khaos-System.", bonus:"Schaltet Khaos frei!" },
  ],
  triton: [
    { id:"tritbase",  name:"Triton-Eisbasis",     emoji:"❄️",   baseCost:55000000,type:"steady", cr:8000,def:3000,  desc:"Eisige Basis auf Triton.", bonus:"+8.000 Kr./s · +3.000 Vert." },
    { id:"tritmult",  name:"Randquantenforschung",emoji:"🔮",   baseCost:75000000,type:"multiplier",mult:1.25,      desc:"Quantenphysik am Rand.", bonus:"×1.25 auf alles" },
  ],
  khaos: [
    { id:"handel",    name:"Handelsvertrag",      emoji:"🤝",   baseCost:5000000,  type:"random", minR:20000000,maxR:80000000,sci:false,desc:"Riskant aber sehr profitabel – Einnahmen weit über Einsatz.", bonus:"+20Mio–80Mio Kredite" },
    { id:"alientech", name:"Alien-Reaktortechnik",emoji:"☢️",   baseCost:40000000, type:"steady", cr:50000,en:5000, desc:"Fremde Technologie.", bonus:"+50.000 Kr./s · +5.000 En." },
    { id:"alien",     name:"Technologietausch",   emoji:"💡",   baseCost:80000000, type:"multiplier",mult:2.0,      desc:"Alle Erträge ×2.", bonus:"×2.0 auf ALLES" },
  ],
  eigene_welt: [
    { id:"ew_kern",   name:"Planetenkern",        emoji:"⚙️",   baseCost:5000000000,  type:"steady",     cr:500000, pop:1e9,   desc:"Der glühende Kern deiner Welt – Basis für alles weitere.", bonus:"+500.000 Kr./s · +1Mrd Bev." },
    { id:"ew_atmo",   name:"Atmosphäre",          emoji:"🌫️",   baseCost:8000000000,  type:"steady",     cr:800000, en:10000,  desc:"Eine atmbare Atmosphäre – deine Welt wird bewohnbar.", bonus:"+800.000 Kr./s · +10K En." },
    { id:"ew_ozean",  name:"Weltozean",           emoji:"🌊",   baseCost:10000000000, type:"steady",     cr:1000000,pop:5e9,   desc:"Riesige Ozeane bedecken deine Welt.", bonus:"+1Mio Kr./s · +5Mrd Bev." },
    { id:"ew_atom",   name:"Fusionskraftwerke",   emoji:"⚛️",   baseCost:12000000000, type:"steady",     cr:1500000,en:50000,  desc:"Tausende Fusionskraftwerke versorgen deine Zivilisation.", bonus:"+1.5Mio Kr./s · +50K En." },
    { id:"ew_sci",    name:"Megaforschungszentrum",emoji:"🔬",  baseCost:15000000000, type:"random",     minR:500000000,maxR:5000000000,sci:true, desc:"Das größte Forschungszentrum der Menschheitsgeschichte.", bonus:"+500Mio–5Mrd Wissenschaft" },
    { id:"ew_bio",    name:"Biotechzivilisation", emoji:"🧬",   baseCost:20000000000, type:"steady",     cr:3000000,pop:20e9,  desc:"Biotechnik hebt deine Zivilisation auf die nächste Stufe.", bonus:"+3Mio Kr./s · +20Mrd Bev." },
    { id:"ew_mil",    name:"Planetare Abwehr",    emoji:"🛡️",   baseCost:18000000000, type:"steady",     def:200000,           desc:"Planetare Verteidigungsschilde gegen alle Bedrohungen.", bonus:"+200.000 Verteidigung/Stufe" },
    { id:"ew_quant",  name:"Quantennetz",         emoji:"🔮",   baseCost:50000000000, type:"multiplier", mult:2.0,             desc:"Quantenvernetzung aller Systeme – alles verdoppelt sich.", bonus:"×2.0 auf alle Einnahmen" },
    { id:"ew_dys1",   name:"Dyson-Sphäre I",     emoji:"🌟",   baseCost:150000000000,type:"multiplier", mult:3.0,             desc:"Erste Stufe der Dyson-Sphäre – dreifache Energie der Sonne.", bonus:"×3.0 auf ALLES" },
    { id:"ew_dark",   name:"Dunkle Materie",      emoji:"🌑",   baseCost:200000000000,type:"random",     minR:10000000000,maxR:100000000000,sci:true,desc:"Ernte dunkle Materie aus dem Universum.", bonus:"+10Mrd–100Mrd Wissenschaft" },
    { id:"ew_dys2",   name:"Dyson-Sphäre II",    emoji:"⭐",   baseCost:500000000000,type:"multiplier", mult:5.0,             desc:"Vollständige Dyson-Sphäre – die Sonne gehört dir.", bonus:"×5.0 auf ALLES" },
    { id:"ew_multi",  name:"Multiversum-Tor",     emoji:"🚪",   baseCost:2000000000000,type:"multiplier",mult:10.0,           desc:"Ein Tor zu parallelen Universen. Unbegrenzte Ressourcen.", bonus:"×10.0 auf ALLES" },
  ],
};

export const PLANET_INFO = {
  erde:       { name:"Erde",       emoji:"🌍", color:"#1a8fff", bg:"linear-gradient(160deg,#001830,#002a50)" },
  mond:       { name:"Mond",       emoji:"🌕", color:"#a0a8b8", bg:"linear-gradient(160deg,#141420,#20202e)" },
  venus:      { name:"Venus",      emoji:"🌕", color:"#e8a020", bg:"linear-gradient(160deg,#201000,#302000)" },
  mars:       { name:"Mars",       emoji:"🔴", color:"#d04020", bg:"linear-gradient(160deg,#200800,#3a1000)" },
  phobos:     { name:"Phobos",     emoji:"🪨", color:"#806050", bg:"linear-gradient(160deg,#100800,#201000)" },
  deimos:     { name:"Deimos",     emoji:"🪨", color:"#706048", bg:"linear-gradient(160deg,#0e0806,#1a1008)" },
  ceres:      { name:"Ceres",      emoji:"⚪", color:"#909090", bg:"linear-gradient(160deg,#101010,#181818)" },
  vesta:      { name:"Vesta",      emoji:"🪨", color:"#806840", bg:"linear-gradient(160deg,#120e04,#201808)" },
  jupiter:    { name:"Jupiter",    emoji:"🟠", color:"#c07020", bg:"linear-gradient(160deg,#180e00,#281800)" },
  io:         { name:"Io",         emoji:"🌋", color:"#d0b020", bg:"linear-gradient(160deg,#201000,#301800)" },
  europa:     { name:"Europa",     emoji:"🌊", color:"#4090d0", bg:"linear-gradient(160deg,#001828,#002038)" },
  ganymed:    { name:"Ganymed",    emoji:"🌑", color:"#7090a0", bg:"linear-gradient(160deg,#081218,#101820)" },
  saturn:     { name:"Saturn",     emoji:"🪐", color:"#c0a040", bg:"linear-gradient(160deg,#181000,#282000)" },
  titan:      { name:"Titan",      emoji:"🟡", color:"#c08030", bg:"linear-gradient(160deg,#181000,#281800)" },
  enceladus:  { name:"Enceladus",  emoji:"❄️", color:"#a0d0f0", bg:"linear-gradient(160deg,#081828,#102030)" },
  uranus:     { name:"Uranus",     emoji:"🔵", color:"#40c0d0", bg:"linear-gradient(160deg,#041820,#082028)" },
  neptun:     { name:"Neptun",     emoji:"🌀", color:"#2060d0", bg:"linear-gradient(160deg,#040818,#081020)" },
  triton:     { name:"Triton",     emoji:"❄️", color:"#6090c0", bg:"linear-gradient(160deg,#061018,#0a1828)" },
  khaos:  { name:"Khaos",   emoji:"☀️", color:"#ff5020", bg:"linear-gradient(160deg,#1e0400,#300800)" },
  eigene_welt: { name:"Eigene Welt",  emoji:"🌌", color:"#c040ff", bg:"linear-gradient(160deg,#0a0020,#180040)" },
};

export const ORBITS = {
  venus:     {r:48,  speed:.80, parent:null},
  mond:      {r:38,  speed:2.0, parent:"erde"},
  erde:      {r:70,  speed:.62, parent:null},
  mars:      {r:100, speed:.38, parent:null},
  phobos:    {r:22,  speed:4.0, parent:"mars"},
  deimos:    {r:32,  speed:2.5, parent:"mars"},
  ceres:     {r:132, speed:.26, parent:null},
  vesta:     {r:124, speed:.29, parent:null},
  jupiter:   {r:172, speed:.14, parent:null},
  io:        {r:28,  speed:3.5, parent:"jupiter"},
  europa:    {r:38,  speed:2.8, parent:"jupiter"},
  ganymed:   {r:50,  speed:2.0, parent:"jupiter"},
  saturn:    {r:218, speed:.10, parent:null},
  titan:     {r:38,  speed:1.6, parent:"saturn"},
  enceladus: {r:26,  speed:2.8, parent:"saturn"},
  uranus:    {r:262, speed:.07, parent:null},
  neptun:    {r:298, speed:.05, parent:null},
  triton:    {r:30,  speed:1.8, parent:"neptun"},
  khaos:{r:334, speed:.03, parent:null},
};

export const P_SIZES = {
  erde:17, mond:6, venus:14, mars:11, phobos:4, deimos:3,
  ceres:6, vesta:5, jupiter:22, io:6, europa:7, ganymed:8,
  saturn:20, titan:9, enceladus:5, uranus:16, neptun:15, triton:6,
  khaos:14,
};

export const DEF_EVENTS = [
  { id:"d1", emoji:"👁️", title:"Spion-Partikel-Interferenz!",   msg:"Ein Spion-Partikel sabotiert eure Abwehrsysteme. Die Die Fremden beobachten alles.",         defDrop:150 },
  { id:"d2", emoji:"🛸", title:"Neue Antriebstechnik!",  msg:"Khaos hat schnellere Raumschiffe – die Ankunft rückt näher!",              defDrop:200 },
  { id:"d3", emoji:"⚔️", title:"Die Fremden: Das Schwert!",   msg:"Die Die Fremden haben das Stilles-Universum-Schwert aktiviert. Abwehr gestört!",           defDrop:180 },
  { id:"d4", emoji:"💻", title:"Cyberangriff!",           msg:"Fremde KI infiltriert eure Verteidigungscomputer. Systeme offline.",         defDrop:120 },
  { id:"d5", emoji:"🌊", title:"Gravitationswelle!",      msg:"Dreigestirn-Konjunktion – alle Satelliten außer Kontrolle.",                    defDrop:100 },
  { id:"d6", emoji:"🔭", title:"Flotte gesichtet!",       msg:"Eine fremde Vorhut im Sonnensystem gesichtet. Alarmstufe Rot!",              defDrop:180 },
];

export const EVENTS = [
  { id:"e1", planet:"mond",     emoji:"💨", title:"Gasquelle!",       desc:"Unterirdische Gasquelle auf dem Mond entdeckt.",    cost:3000,  returnCr:12000,returnSci:300, secs:60  },
  { id:"e2", planet:"mond",     emoji:"💧", title:"Wassereis!",        desc:"Riesige Wassereisvorkommen auf dem Mond gefunden.", cost:4000,  returnCr:10000,returnSci:0,   secs:50  },
  { id:"e3", planet:"erde",     emoji:"💼", title:"Privatinvestoren!", desc:"Milliardäre investieren in Raumfahrt.",             cost:2000,  returnCr:6000, returnSci:800, secs:40  },
  { id:"e4", planet:"erde",     emoji:"🏭", title:"Fabrikauftrag!",    desc:"Rüstungsunternehmen brauchen euren Input.",         cost:1500,  returnCr:8000, returnSci:0,   secs:45  },
  { id:"e5", planet:"mars",     emoji:"🕳️", title:"Höhlen entdeckt!", desc:"Perfekte Siedlungshöhlen auf dem Mars.",            cost:40000, returnCr:80000,returnSci:2000,secs:75  },
  { id:"e6", planet:"mars",     emoji:"🌋", title:"Vulkan aktiv!",     desc:"Geothermische Energie aus dem Marsvulkan.",         cost:25000, returnCr:60000,returnSci:1500,secs:60  },
  { id:"e7", planet:"asteroid", emoji:"💎", title:"Seltene Erden!",   desc:"Extrem wertvolle Mineralien in einem Asteroiden.",  cost:150000,returnCr:600000,returnSci:0, secs:100 },
  { id:"e8", planet:"jupiter",  emoji:"🌀", title:"Anomalie!",         desc:"Energieanomalie liefert Forschungsdaten.",          cost:400000,returnCr:300000,returnSci:30000,secs:90},
];

export function getSpinRewards(credits){

  const base = Math.max(500, Math.floor(credits * 0.08));
  const sciBase = Math.max(200, Math.floor(credits * 0.03));
  return [
    { label:`${fmt(base)} Kr.`,       color:"#28a850", fn:g=>({...g,credits:g.credits+base}) },
    { label:`${fmt(base*4)} Kr.`,     color:"#30c060", fn:g=>({...g,credits:g.credits+base*4}) },
    { label:`${fmt(sciBase)} Wiss.`,  color:"#3080ff", fn:g=>({...g,science:g.science+sciBase}) },
    { label:`×1.5 Boost`,             color:"#a030e0", fn:g=>({...g,mult:g.mult*1.5}) },
    { label:`${fmt(base*12)} Kr.`,    color:"#40e070", fn:g=>({...g,credits:g.credits+base*12}) },
    { label:`+Verteidigung`,          color:"#30b090", fn:g=>({...g,xdef:g.xdef+300}) },
    { label:`${fmt(base*6)} Kr.`,     color:"#38c868", fn:g=>({...g,credits:g.credits+base*6}) },
    { label:`${fmt(sciBase*3)} Wiss.`,color:"#5090ff", fn:g=>({...g,science:g.science+sciBase*3}) },
  ];
}

export function fmt(n){
  if(n>=1e9) return(n/1e9).toFixed(1)+"Mrd";
  if(n>=1e6) return(n/1e6).toFixed(2)+"Mio";
  if(n>=1e3) return(n/1e3).toFixed(1)+"K";
  return Math.floor(n)+"";
}
export function fmtPop(n){
  if(n>=1e9) return(n/1e9).toFixed(2)+" Mrd.";
  if(n>=1e6) return(n/1e6).toFixed(1)+" Mio.";
  if(n>=1e3) return(n/1e3).toFixed(0)+"K";
  return Math.floor(n)+"";
}
export const STARS=Array.from({length:80},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,s:Math.random()*1.4+0.3,d:Math.random()*3+2,del:Math.random()*4}));

export const ACHIEVEMENTS = [

  { id:"click_100",    emoji:"👆", name:"Erster Schritt",          desc:"100 Mal auf die Erde geklickt.",              reward:{cr:500},      check:(s)=>s.totalClicks>=100 },
  { id:"click_1k",     emoji:"👊", name:"Klick-Profi",             desc:"1.000 Mal geklickt.",                         reward:{cr:5000},     check:(s)=>s.totalClicks>=1000 },
  { id:"click_10k",    emoji:"🤜", name:"Klick-Maschine",          desc:"10.000 Mal geklickt.",                        reward:{cr:50000},    check:(s)=>s.totalClicks>=10000 },
  { id:"click_50k",    emoji:"⚡", name:"Klick-Legende",           desc:"50.000 Mal geklickt – Respekt!",              reward:{sci:100000},  check:(s)=>s.totalClicks>=50000 },
  { id:"click_max",    emoji:"🔱", name:"Klick-Gott",              desc:"Klick-Level 33+ erreicht (fast ×100)!",       reward:{mult:1.5},    check:(s)=>s.clickLevel>=33 },

  { id:"cr_1k",        emoji:"💰", name:"Erste Tausend",           desc:"1.000 Kredite gesammelt.",                    reward:{sci:100},     check:(s)=>s.totalEarned>=1000 },
  { id:"cr_100k",      emoji:"💵", name:"Aufsteiger",              desc:"100.000 Kredite gesammelt.",                  reward:{sci:2000},    check:(s)=>s.totalEarned>=100000 },
  { id:"cr_1m",        emoji:"💎", name:"Millionär",               desc:"1 Million Kredite gesammelt.",                reward:{sci:10000},   check:(s)=>s.totalEarned>=1e6 },
  { id:"cr_1b",        emoji:"🏦", name:"Milliardär",              desc:"1 Milliarde Kredite gesammelt.",              reward:{sci:100000},  check:(s)=>s.totalEarned>=1e9 },
  { id:"cr_1t",        emoji:"🌐", name:"Billionär",               desc:"1 Billion Kredite gesammelt.",                reward:{mult:1.2},    check:(s)=>s.totalEarned>=1e12 },
  { id:"cr_1q",        emoji:"♾️", name:"Unendlicher Reichtum",    desc:"1 Billiarde Kredite gesammelt.",              reward:{mult:1.5},    check:(s)=>s.totalEarned>=1e15 },

  { id:"pl_venus",     emoji:"🌕", name:"Venusflug",               desc:"Venus-Station errichtet.",                    reward:{cr:20000},    check:(s)=>s.unlocked.includes("venus") },
  { id:"pl_moon",      emoji:"🌕", name:"Mondfahrer",              desc:"Mondbasis freigeschaltet.",                   reward:{cr:10000},    check:(s)=>s.unlocked.includes("mond") },
  { id:"pl_mars",      emoji:"🔴", name:"Mars-Pionier",            desc:"Mars-Kolonie gegründet.",                     reward:{cr:50000},    check:(s)=>s.unlocked.includes("mars") },
  { id:"pl_phobos",    emoji:"🪨", name:"Phobos-Basis",            desc:"Marsmond Phobos besiedelt.",                  reward:{cr:120000},   check:(s)=>s.unlocked.includes("phobos") },
  { id:"pl_deimos",    emoji:"🪨", name:"Deimos-Außenposten",      desc:"Marsmond Deimos erreicht.",                   reward:{cr:200000},   check:(s)=>s.unlocked.includes("deimos") },
  { id:"pl_ceres",     emoji:"⚪", name:"Zwergplanet",             desc:"Ceres – größter Körper im Asteroidengürtel.", reward:{cr:300000},   check:(s)=>s.unlocked.includes("ceres") },
  { id:"pl_vesta",     emoji:"🪨", name:"Asteroid-Bergbau",        desc:"Vesta-Expedition erfolgreich.",               reward:{cr:400000},   check:(s)=>s.unlocked.includes("vesta") },
  { id:"pl_jupiter",   emoji:"🟠", name:"Jupitermensch",           desc:"Jupiter-Station errichtet.",                  reward:{cr:1000000},  check:(s)=>s.unlocked.includes("jupiter") },
  { id:"pl_io",        emoji:"🌋", name:"Vulkanwelt",              desc:"Io – aktivster Vulkanmond besiedelt.",        reward:{cr:2000000},  check:(s)=>s.unlocked.includes("io") },
  { id:"pl_europa",    emoji:"🌊", name:"Lebenssucher",            desc:"Europa – Ozean unter dem Eis erforscht.",     reward:{sci:50000},   check:(s)=>s.unlocked.includes("europa") },
  { id:"pl_ganymed",   emoji:"🌑", name:"Großer Mond",             desc:"Ganymed – größter Mond im Sonnensystem.",     reward:{cr:3000000},  check:(s)=>s.unlocked.includes("ganymed") },
  { id:"pl_saturn",    emoji:"🪐", name:"Ringe des Saturn",        desc:"Saturn erreicht.",                            reward:{cr:5000000},  check:(s)=>s.unlocked.includes("saturn") },
  { id:"pl_titan",     emoji:"🟡", name:"Titan-Bezwinger",         desc:"Titan mit Methanseen besiedelt.",             reward:{cr:8000000},  check:(s)=>s.unlocked.includes("titan") },
  { id:"pl_enceladus", emoji:"❄️", name:"Geysir-Jäger",           desc:"Enceladus – Wassergeysire entdeckt.",         reward:{sci:80000},   check:(s)=>s.unlocked.includes("enceladus") },
  { id:"pl_uranus",    emoji:"🔵", name:"Eisriese",                desc:"Uranus – der rollende Planet erreicht.",      reward:{cr:10000000}, check:(s)=>s.unlocked.includes("uranus") },
  { id:"pl_neptun",    emoji:"🌀", name:"Rand des Systems",        desc:"Neptun – äußerster Planet besiedelt.",        reward:{sci:200000},  check:(s)=>s.unlocked.includes("neptun") },
  { id:"pl_triton",    emoji:"❄️", name:"Retrograder Mond",        desc:"Triton – rückwärts kreisender Mond.",         reward:{cr:20000000}, check:(s)=>s.unlocked.includes("triton") },
  { id:"pl_khaos",     emoji:"☀️", name:"Erster Kontakt",          desc:"Khaos – die Fremden warten.",                 reward:{mult:1.5},    check:(s)=>s.unlocked.includes("khaos") },
  { id:"pl_all_real",  emoji:"🌍", name:"Sonnensystem komplett",   desc:"Alle 8 echten Planeten besiedelt.",           reward:{mult:2.0},    check:(s)=>["venus","mond","mars","jupiter","saturn","uranus","neptun","khaos"].every(p=>s.unlocked.includes(p)) },
  { id:"pl_all_moons", emoji:"🛸", name:"Mondkolonist",            desc:"Alle Monde besiedelt.",                       reward:{mult:1.5},    check:(s)=>["mond","phobos","deimos","io","europa","ganymed","titan","enceladus","triton"].every(p=>s.unlocked.includes(p)) },
  { id:"pl_all_ast",   emoji:"☄️", name:"Asteroiden-König",        desc:"Ceres und Vesta beide besiedelt.",            reward:{cr:5000000},  check:(s)=>s.unlocked.includes("ceres")&&s.unlocked.includes("vesta") },

  { id:"sci_1k",       emoji:"🔬", name:"Neugierig",               desc:"1.000 Wissenschaft erreicht.",                reward:{cr:5000},     check:(s)=>s.science>=1000 },
  { id:"sci_10k",      emoji:"🧪", name:"Laborant",                desc:"10.000 Wissenschaft erreicht.",               reward:{cr:50000},    check:(s)=>s.science>=10000 },
  { id:"sci_100k",     emoji:"🧬", name:"Forscher",                desc:"100.000 Wissenschaft erreicht.",              reward:{cr:200000},   check:(s)=>s.science>=100000 },
  { id:"sci_1m",       emoji:"🏛️", name:"Nobelpreis",              desc:"1 Million Wissenschaft erreicht.",            reward:{mult:1.2},    check:(s)=>s.science>=1e6 },
  { id:"sci_1b",       emoji:"🔭", name:"Universums-Forscher",     desc:"1 Milliarde Wissenschaft erreicht.",          reward:{mult:1.5},    check:(s)=>s.science>=1e9 },
  { id:"sci_discount", emoji:"💡", name:"Rabatt-Meister",          desc:"40% Wissenschafts-Rabatt erreicht (80K Wiss).",reward:{cr:1000000}, check:(s)=>s.science>=80000 },

  { id:"def_1k",       emoji:"🛡️", name:"Verteidiger",             desc:"Verteidigung über 1.000 aufgebaut.",          reward:{cr:100000},   check:(s)=>s.defence>=1000 },
  { id:"def_5k",       emoji:"⚔️", name:"Festung",                 desc:"Verteidigung über 5.000.",                    reward:{cr:500000},   check:(s)=>s.defence>=5000 },
  { id:"def_20k",      emoji:"🏰", name:"Unbesiegbar",             desc:"Verteidigung über 20.000 aufgebaut.",         reward:{mult:1.1},    check:(s)=>s.defence>=20000 },
  { id:"def_khaos",    emoji:"👁️", name:"Spion-Abwehr",            desc:"Khaos erreicht und Verteidigung > 10.000.",   reward:{mult:1.2},    check:(s)=>s.unlocked.includes("khaos")&&s.defence>=10000 },

  { id:"mult_2",       emoji:"⚙️", name:"Effizienz",               desc:"Multiplikator ×2 erreicht.",                  reward:{cr:100000},   check:(s)=>s.mult>=2 },
  { id:"mult_5",       emoji:"⚡", name:"Supersystem",             desc:"Multiplikator ×5 erreicht.",                  reward:{sci:100000},  check:(s)=>s.mult>=5 },
  { id:"mult_10",      emoji:"🔮", name:"Quantensprung",           desc:"Multiplikator ×10 erreicht.",                 reward:{mult:1.2},    check:(s)=>s.mult>=10 },
  { id:"mult_50",      emoji:"🌠", name:"Hyperantrieb",            desc:"Multiplikator ×50 erreicht.",                 reward:{mult:1.5},    check:(s)=>s.mult>=50 },
  { id:"mult_100",     emoji:"💫", name:"Göttermaschine",          desc:"Multiplikator ×100 erreicht!",                reward:{mult:2.0},    check:(s)=>s.mult>=100 },

  { id:"pop_10b",      emoji:"👥", name:"Weltbevölkerung",         desc:"10 Milliarden Einwohner.",                    reward:{cr:100000},   check:(s)=>s.population>=10e9 },
  { id:"pop_100b",     emoji:"🌍", name:"Interplanetare Völker",   desc:"100 Milliarden Einwohner.",                   reward:{mult:1.1},    check:(s)=>s.population>=100e9 },
  { id:"pop_1t",       emoji:"🌌", name:"Galaktische Zivilisation",desc:"1 Billion Einwohner!",                        reward:{mult:1.3},    check:(s)=>s.population>=1e12 },

  { id:"spin_1",       emoji:"🎰", name:"Erster Dreh",             desc:"Das Glücksrad zum ersten Mal gedreht.",       reward:{cr:1000},     check:(s)=>s.totalSpins>=1 },
  { id:"spin_10",      emoji:"🎲", name:"Glücksspieler",           desc:"10 Mal das Rad gedreht.",                     reward:{cr:10000},    check:(s)=>s.totalSpins>=10 },
  { id:"spin_50",      emoji:"🍀", name:"Glückskind",              desc:"50 Mal gedreht.",                             reward:{cr:100000},   check:(s)=>s.totalSpins>=50 },
  { id:"spin_100",     emoji:"🌈", name:"Rad-Legende",             desc:"100 Mal gedreht – du liebst das Rad!",        reward:{mult:1.1},    check:(s)=>s.totalSpins>=100 },

  { id:"ev_1",         emoji:"⚡", name:"Investor",                desc:"Erstes Ereignis investiert.",                 reward:{cr:5000},     check:(s)=>s.totalEvents>=1 },
  { id:"ev_20",        emoji:"📈", name:"Vollzeit-Investor",       desc:"20 Ereignisse investiert.",                   reward:{cr:500000},   check:(s)=>s.totalEvents>=20 },
  { id:"ev_50",        emoji:"💼", name:"Investitions-Guru",       desc:"50 Ereignisse investiert.",                   reward:{mult:1.2},    check:(s)=>s.totalEvents>=50 },

  { id:"tech_10",      emoji:"🔧", name:"Tüftler",                 desc:"10 Technologien investiert.",                 reward:{cr:50000},    check:(s)=>Object.keys(s.invested).length>=10 },
  { id:"tech_30",      emoji:"🏗️", name:"Ingenieur",               desc:"30 Technologien investiert.",                 reward:{cr:500000},   check:(s)=>Object.keys(s.invested).length>=30 },
  { id:"tech_60",      emoji:"🤖", name:"Meister-Ingenieur",       desc:"60 Technologien investiert.",                 reward:{mult:1.3},    check:(s)=>Object.keys(s.invested).length>=60 },

  { id:"en_1k",        emoji:"⚡", name:"Energieversorger",        desc:"1.000 Energie erzeugt.",                      reward:{cr:100000},   check:(s)=>s.energy>=1000 },
  { id:"en_10k",       emoji:"🔋", name:"Energieriese",            desc:"10.000 Energie erzeugt.",                     reward:{cr:1000000},  check:(s)=>s.energy>=10000 },
  { id:"en_100k",      emoji:"☢️", name:"Fusionsmeister",          desc:"100.000 Energie erzeugt.",                    reward:{mult:1.2},    check:(s)=>s.energy>=100000 },

  { id:"khaos_handel", emoji:"🤝", name:"Händler der Sterne",      desc:"Handelsvertrag mit den Fremden.",             reward:{cr:50000000}, check:(s)=>!!s.invested["handel"] },
  { id:"khaos_alien",  emoji:"💡", name:"Technologiedieb",         desc:"Alien-Technologie übernommen.",               reward:{mult:1.5},    check:(s)=>!!s.invested["alientech"] },
  { id:"khaos_mult",   emoji:"🌀", name:"Fremde Überlegenheit",    desc:"Technologietausch mit den Fremden.",          reward:{mult:1.5},    check:(s)=>!!s.invested["alien"] },

  { id:"spec_passiv",  emoji:"🧘", name:"Passiv-König",            desc:"1 Mio. Kredite mit weniger als 10 Klicks.",   reward:{mult:1.2},    check:(s)=>s.totalEarned>=1e6&&s.totalClicks<10 },
  { id:"spec_all_sci", emoji:"👨🔬",name:"Wissenschafts-Fanatiker", desc:"Alle Zufalls-Forschungs-Techs gekauft.",      reward:{sci:1000000}, check:(s)=>["wiss","biotech","wallfacer","mondlabs","terra","europlife","enclife"].every(t=>!!s.invested[t]) },
  { id:"spec_all_mil", emoji:"⚔️", name:"Kriegsherr",              desc:"Alle Militär-Technologien gekauft.",          reward:{cr:10000000}, check:(s)=>["militaer","pdc","mondmil","marsflotte","marswaffen","jupwaffen","uranmil","iomil","ganymil"].every(t=>!!s.invested[t]) },

  { id:"final_all",    emoji:"🌌", name:"ALLES ERREICHT – Eigene Welt!",
    desc:"Alle anderen Erfolge freigeschaltet! Als Belohnung...",
    reward:{unlock:"eigene_welt"}, check:(s)=>false },
];

export const NORMAL_ACH_COUNT = ACHIEVEMENTS.filter(a=>a.id!=="final_all").length;

export const ACHIEVEMENTS_NORMAL = ACHIEVEMENTS.filter(a=>a.id!=="all_done");

export function AchievementToast({ach,onDone}){
  const [visible,setVisible]=useState(true);
  useEffect(()=>{
    const t1=setTimeout(()=>setVisible(false),4500); // fade out
    const t2=setTimeout(()=>onDone(),5000);           // remove after 5s
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[onDone]);
  return(
    <div style={{
      position:"fixed",top:64,left:"50%",transform:"translateX(-50%)",
      zIndex:3500,pointerEvents:"none",
      opacity:visible?1:0,transition:"opacity .5s ease",
      width:"92%",maxWidth:420,
    }}>
      <div style={{
        background:"linear-gradient(135deg,rgba(30,20,0,.97),rgba(50,30,0,.97))",
        border:"1.5px solid rgba(255,200,0,.45)",borderRadius:14,
        padding:"10px 14px",display:"flex",alignItems:"center",gap:10,
        boxShadow:"0 4px 20px rgba(255,150,0,.25)",
      }}>
        <div style={{fontSize:24,flexShrink:0}}>{ach.emoji}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:8,color:"rgba(255,180,0,.6)",letterSpacing:2,marginBottom:1}}>🏆 ERFOLG</div>
          <div style={{fontSize:13,fontWeight:"bold",color:"#ffe080",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ach.name}</div>
          <div style={{fontSize:9,color:"rgba(200,160,80,.7)",marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ach.desc}</div>
        </div>
        <div style={{fontSize:9,color:"rgba(180,140,60,.5)",flexShrink:0}}>5s</div>
      </div>
    </div>
  );
}

export const CHALLENGE_POOL = [
  { id:"dc_click50",   emoji:"👆", name:"Klick-Sprint",        desc:"50 Mal klicken",          type:"clicks",   target:50,    reward:{cr:5000} },
  { id:"dc_click200",  emoji:"👊", name:"Klick-Marathon",      desc:"200 Mal klicken",         type:"clicks",   target:200,   reward:{cr:15000} },
  { id:"dc_click500",  emoji:"🤜", name:"Klick-Legende",       desc:"500 Mal klicken",         type:"clicks",   target:500,   reward:{cr:40000} },
  { id:"dc_earn100k",  emoji:"💰", name:"Kleiner Investor",    desc:"100.000 Kr. verdienen",   type:"earn",     target:1e5,   reward:{sci:500} },
  { id:"dc_earn1m",    emoji:"💵", name:"Großer Investor",     desc:"1 Mio. Kr. verdienen",    type:"earn",     target:1e6,   reward:{sci:2000} },
  { id:"dc_earn10m",   emoji:"💎", name:"Mega-Investor",       desc:"10 Mio. Kr. verdienen",   type:"earn",     target:1e7,   reward:{sci:10000} },
  { id:"dc_spin3",     emoji:"🎰", name:"Glückstag",           desc:"3x drehen heute",         type:"spins",    target:3,     reward:{cr:20000} },
  { id:"dc_spin5",     emoji:"🍀", name:"Glückswoche",         desc:"5x drehen heute",         type:"spins",    target:5,     reward:{mult:1.05} },
  { id:"dc_invest3",   emoji:"⚡", name:"Ereignis-Jäger",      desc:"3 Ereignisse investieren", type:"events",  target:3,     reward:{cr:50000} },
  { id:"dc_invest5",   emoji:"📈", name:"Voll-Investor",       desc:"5 Ereignisse investieren", type:"events",  target:5,     reward:{sci:5000} },
  { id:"dc_tech3",     emoji:"🔧", name:"Forscher",            desc:"3 Technologien kaufen",    type:"techs",   target:3,     reward:{cr:30000} },
  { id:"dc_tech5",     emoji:"🛠️", name:"Ingenieur",           desc:"5 Technologien kaufen",    type:"techs",   target:5,     reward:{sci:8000} },
  { id:"dc_def500",    emoji:"🛡️", name:"Verteidiger",         desc:"Verteidigung auf 500+",   type:"defence",  target:500,   reward:{cr:10000} },
  { id:"dc_def2k",     emoji:"🏰", name:"Festung",             desc:"Verteidigung auf 2.000+", type:"defence",  target:2000,  reward:{cr:50000} },
  { id:"dc_sci1k",     emoji:"🔬", name:"Wissenschaftstag",    desc:"1.000 Wiss. sammeln",     type:"science",  target:1000,  reward:{cr:20000} },
  { id:"dc_sci10k",    emoji:"🧪", name:"Forschungstag",       desc:"10.000 Wiss. sammeln",    type:"science",  target:10000, reward:{mult:1.05} },
  { id:"dc_newplanet", emoji:"🚀", name:"Entdecker",           desc:"Neuen Planeten freischalten", type:"unlock", target:1,  reward:{cr:100000} },
];

export function getDailyChallenges(seed){

  const rng=(n)=>{let x=Math.sin(seed+n)*10000;return x-Math.floor(x);};
  const picked=[];
  const pool=[...CHALLENGE_POOL];
  for(let i=0;i<3;i++){
    const idx=Math.floor(rng(i*7)*pool.length);
    picked.push(pool.splice(idx,1)[0]);
  }
  return picked;
}

export function getDaySeed(){
  const d=new Date();
  return d.getFullYear()*10000+d.getMonth()*100+d.getDate();
}

export const KHAOS_WAVES = [
  { id:"w1", name:"Aufklärung",     emoji:"👁️", desc:"Spion-Partikel scannen eure Systeme.",        defDrain:50,  duration:30, minPlanets:2 },
  { id:"w2", name:"Vorhut",         emoji:"🛸", desc:"Kleine Fremden-Einheit nähert sich.",          defDrain:150, duration:45, minPlanets:3 },
  { id:"w3", name:"Quantenangriff", emoji:"💻", desc:"Fremden-KI greift eure Computer an.",          defDrain:200, duration:60, minPlanets:4 },
  { id:"w4", name:"Flottensichtung",emoji:"🔭", desc:"Große Fremden-Flotte im Sonnensystem!",        defDrain:400, duration:60, minPlanets:5 },
  { id:"w5", name:"Das Schwert",    emoji:"⚔️", desc:"Die Fremden aktivieren ihre Hauptwaffe!",      defDrain:600, duration:90, minPlanets:7 },
  { id:"w6", name:"Vollangriff",    emoji:"☀️", desc:"Die Fremden greifen mit voller Macht an!",     defDrain:1000,duration:120,minPlanets:10 },
];

export const PLANET_FACTS = {
  erde:       { title:"Erde", discovered:"Bekannt seit Menschengedenken", description:"Die Erde ist der einzige bekannte Planet mit Leben. Sie ist 4,5 Milliarden Jahre...", resources:["Wasser (71% der Oberfläche)","Sauerstoff & Stickstoff (Atmosphäre)","Eisen, Nickel (Kern)","Seltene Erden, Gold, Platin"], funfact:"Die Erde ist der einzige Planet, der nicht nach einer Gottheit benannt wurde." },
  mond:       { title:"Mond", discovered:"Bekannt seit Jahrtausenden – erste Landung 1969 (Apollo 11)", description:"Der Mond ist Erdens einziger natürlicher Satellit. Er entstand vermutlich durch ...", resources:["Helium-3 (Fusionsbrennstoff)","Wassereis (Pole)","Titanium, Silizium","Aluminium, Eisen"], funfact:"Der Mond entfernt sich jedes Jahr um 3,8 cm von der Erde." },
  venus:      { title:"Venus", discovered:"Bekannt seit Antike – Galileo Galilei beobachtete sie 1610", description:"Venus ist der heißeste Planet (465°C) trotz größerer Distanz zur Sonne als Merku...", resources:["Schwefelsäure (Wolken)","CO₂ (Atmosphäre)","Möglicherweise Phosphin (Leben?)","Titan, Eisen (Oberfläche)"], funfact:"Ein Tag auf Venus dauert länger als ein Jahr auf Venus – und sie dreht..." },
  mars:       { title:"Mars", discovered:"Bekannt seit Antike – Schiaparelli kartierte ihn 1877", description:"Der rote Planet verdankt seine Farbe Eisenoxid (Rost). Er hat die größte Vulkans...", resources:["Eisenoxid (roter Boden)","Wassereis (Polkappen)","Perchlorat-Salze","CO₂ (Atmosphäre)"], funfact:"Die Valles Marineris auf dem Mars ist 4x tiefer und 10x länger als der..." },
  phobos:     { title:"Phobos", discovered:"Asaph Hall, 1877", description:"Phobos ist der größere der beiden Marsmonde und der sonnensysteminterne Mond, de...", resources:["Kohlenstoff-reiche Mineralien","Eis (möglicherweise)","Phyllosilikat (Tonmineral)"], funfact:"Phobos umkreist den Mars dreimal täglich – schneller als Mars rotiert!" },
  deimos:     { title:"Deimos", discovered:"Asaph Hall, 1877 (gleicher Tag wie Phobos)", description:"Deimos ist der kleinere und weiter entfernte Marsmond. Er hat eine sehr glatte O...", resources:["Kohlenstoff-reiche Mineralien","Silikatgestein","Möglicherweise flüchtige Stoffe"], funfact:"Von der Marsoberfläche aus sieht Deimos aus wie ein heller Stern, nich..." },
  ceres:      { title:"Ceres (Zwergplanet)", discovered:"Giuseppe Piazzi, 1. Januar 1801", description:"Ceres ist der größte Körper im Asteroidengürtel und der einzige Zwergplanet im i...", resources:["Wassereis (massiv)","Ammoniumsalze","Natrium-Karbonat","Kohlenstoff-reiche Mineralien"], funfact:"Ceres enthält mehr Süßwasser als die gesamte Erde – größtenteils als Eis." },
  vesta:      { title:"Vesta", discovered:"Heinrich Wilhelm Olbers, 29. März 1807", description:"Vesta ist der zweitmassivste Körper im Asteroidengürtel. Er hat einen riesigen E...", resources:["Basalt (Vulkangestein)","Eisen-Nickel (Kern)","Pyroxen, Olivin","Seltene HED-Meteoriten"], funfact:"Viele Meteoriten auf der Erde stammen von Vesta – erkennbar an ihrer e..." },
  jupiter:    { title:"Jupiter", discovered:"Bekannt seit Antike – Galileo sah Monde 1610", description:"Jupiter ist der größte Planet – alle anderen Planeten zusammen hätten darin Plat...", resources:["Wasserstoff (90% der Atmosphäre)","Helium (10%)","Wassereis, Ammoniak","Flüssiges metallisches Wasserstoff (Kern)"], funfact:"Jupiters Magnetfeld ist 20.000x stärker als das der Erde und schützt d..." },
  io:         { title:"Io", discovered:"Galileo Galilei, 7. Januar 1610", description:"Io ist der vulkanisch aktivste Körper im Sonnensystem – über 400 aktive Vulkane....", resources:["Schwefel (Oberfläche gelb/orange)","Schwefeldioxid","Silikate","Eisen-Nickel (Kern)"], funfact:"Jupiters Gravitationskräfte quetschen Io so stark, dass sein Inneres s..." },
  europa:     { title:"Europa", discovered:"Galileo Galilei, 7. Januar 1610", description:"Europa hat einen flüssigen Ozean unter einer Eisschicht von 10–30 km Dicke. Dies...", resources:["Flüssiges Wasser (Ozean)","Wassereis","Magnesiumsulfat (Salze)","Organische Verbindungen?"], funfact:"Europas Ozean enthält vermutlich doppelt so viel Wasser wie alle Erden..." },
  ganymed:    { title:"Ganymed", discovered:"Galileo Galilei, 7. Januar 1610", description:"Ganymed ist der größte Mond im Sonnensystem – sogar größer als Merkur. Als einzi...", resources:["Wassereis (60% der Oberfläche)","Silikate","Eisen (Kern)","Sauerstoffatmosphäre (dünn)"], funfact:"Ganymed ist der einzige Mond im Sonnensystem mit einem eigenen Magnetfeld." },
  saturn:     { title:"Saturn", discovered:"Bekannt seit Antike – Ringe entdeckt von Galileo 1610", description:"Saturns Ringe bestehen aus Milliarden von Eispartikeln und Felsen. Saturn ist so...", resources:["Wasserstoff & Helium (Atmosphäre)","Wassereis (Ringe)","Silikat-Gestein (Ringe)","Mögliches metallisches Wasserstoff"], funfact:"Saturns Ringe sind 270.000 km breit, aber nur 20 Meter dick – proporti..." },
  titan:      { title:"Titan", discovered:"Christiaan Huygens, 25. März 1655", description:"Titan ist der einzige Mond mit einer dichten Atmosphäre und Seen – allerdings au...", resources:["Methan (Seen und Atmosphäre)","Ethan","Stickstoff (Atmosphäre 95%)","Organische Komplexmoleküle (Tholine)"], funfact:"Titan hat einen Methan-Kreislauf wie die Erde einen Wasserkreislauf – ..." },
  enceladus:  { title:"Enceladus", discovered:"William Herschel, 28. August 1789", description:"Enceladus spuckt Wasserdampf-Geysire aus dem Südpol, die Saturns E-Ring speisen....", resources:["Flüssiges Wasser (Ozean)","Wasserstoff (hydrothermal)","Natriumchlorid (Salz)","Organische Moleküle"], funfact:"Die Cassini-Sonde flog durch Enceladus' Geysire und fand komplexe orga..." },
  uranus:     { title:"Uranus", discovered:"William Herschel, 13. März 1781", description:"Uranus rotiert auf der Seite – seine Achse ist um 98° geneigt. Er hat die kältes...", resources:["Wasser-Eis (Mantel)","Methan-Eis","Ammoniak-Eis","Wasserstoff & Helium (Atmosphäre)"], funfact:"Uranus 'rollt' um die Sonne – sein Nordpol zeigt manchmal direkt zur S..." },
  neptun:     { title:"Neptun", discovered:"Urbain Le Verrier & John Adams (berechnet) / Johann Galle (beobachtet), 23. September 1846", description:"Neptun wurde durch mathematische Berechnungen entdeckt, bevor man ihn sah. Er ha...", resources:["Wasser, Ammoniak, Methan (Eis)","Wasserstoff & Helium","Silizium, Eisen (Kern)","Möglicherweise Diamanten unter Druck"], funfact:"Unter Neptuns Oberfläche könnten Temperaturen und Druck Kohlenstoff zu..." },
  triton:     { title:"Triton", discovered:"William Lassell, 10. Oktober 1846", description:"Triton ist der einzige große Mond, der rückwärts (retrograd) um seinen Planeten ...", resources:["Stickstoffeis","Methaneis","Kohlendioxideis","Wassereis (Untergrund)"], funfact:"Triton hat aktive Geysire, die Stickstoff 8 km hoch in die Luft schleu..." },
  khaos: { title:"Khaos (Khaos-System Bb?)", discovered:"Durch das Khaos-Signal entdeckt", description:"Ein fiktiver Planet aus einem Science-Fiction 'Krisenkommando-Problem'. Khaos um...", resources:["Unbekannte Alien-Materialien","Spion-Partikel-Technologie","Dunkle Materie?","Gravitationswellen-Energie"], funfact:"Khaos erscheint in einem Science-Fiction Debütroman und hat den Sci-Fi..." },
  eigene_welt:{ title:"Deine Eigene Welt", discovered:"Von dir erschaffen", description:"Diese Welt existiert jenseits des bekannten Sonnensystems. Du hast sie aus dem N...", resources:["Alles was du hineinbaust","Unbegrenzte Energie","Dunkle Materie","Das Unmögliche"], funfact:"Du hast das Unmögliche möglich gemacht. Eine Zivilisation aus dem Nich..." },
};

export function PlanetDetails({id,customName,onClose}){
  const f=PLANET_FACTS[id];
  const info=PLANET_INFO[id];
  if(!f||!info) return null;
  const displayName=id==="eigene_welt"?(customName||"Eigene Welt"):f.title;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:1400,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:`linear-gradient(180deg,${info.bg.match(/#\w+/g)?.[1]||"#001020"} 0%,#000810 100%)`,border:`1px solid ${info.color}50`,borderRadius:"22px 22px 0 0",padding:"24px 20px 48px",maxWidth:500,width:"100%",maxHeight:"80vh",overflow:"auto",boxShadow:"0 -8px 30px rgba(0,0,0,.7)"}}>
        <div style={{width:40,height:4,background:"rgba(255,255,255,.15)",borderRadius:2,margin:"0 auto 20px"}}/>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
          <PlanetMini id={id} size={64} animated={true}/>
          <div>
            <div style={{fontSize:20,fontWeight:"bold",color:info.color}}>{displayName}</div>
            <div style={{fontSize:11,color:"rgba(150,180,220,.6)",marginTop:3}}>{f.discovered}</div>
          </div>
        </div>

        {/* Description */}
        <div style={{background:"rgba(0,20,50,.5)",borderRadius:14,padding:"14px",marginBottom:14}}>
          <div style={{fontSize:10,color:"rgba(100,150,200,.6)",letterSpacing:1,marginBottom:8}}>📖 BESCHREIBUNG</div>
          <div style={{fontSize:13,color:"rgba(180,210,255,.8)",lineHeight:1.7}}>{f.description}</div>
        </div>

        {/* Resources */}
        <div style={{background:"rgba(0,20,50,.5)",borderRadius:14,padding:"14px",marginBottom:14}}>
          <div style={{fontSize:10,color:"rgba(100,150,200,.6)",letterSpacing:1,marginBottom:10}}>⛏️ ROHSTOFFE & RESSOURCEN</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {f.resources.map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:info.color,fontSize:12}}>◆</span>
                <span style={{fontSize:12,color:"rgba(180,210,180,.8)"}}>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fun fact */}
        <div style={{background:`linear-gradient(135deg,${info.color}18,${info.color}08)`,border:`1px solid ${info.color}30`,borderRadius:14,padding:"14px",marginBottom:20}}>
          <div style={{fontSize:10,color:info.color,letterSpacing:1,marginBottom:8}}>💡 WUSSTEST DU?</div>
          <div style={{fontSize:13,color:"rgba(200,220,200,.8)",lineHeight:1.65,fontStyle:"italic"}}>"{f.funfact}"</div>
        </div>

        <button onClick={onClose} style={{width:"100%",padding:"16px",borderRadius:14,background:`linear-gradient(135deg,${info.color}22,${info.color}44)`,border:`1px solid ${info.color}60`,color:info.color,fontSize:15,fontWeight:"bold",cursor:"pointer"}}>
          Schließen ✓
        </button>
      </div>
    </div>
  );
}
export const INFO = {
  kredite: {
    emoji:"💰", title:"Kredite", color:"#28aa50",
    short:"Deine Hauptwährung – damit kaufst du alles.",
    bullets:[
      "Kaufe Technologien, schalte Planeten frei und investiere in Ereignisse.",
      "Passiv-Einnahmen: jede Sekunde fließen automatisch Kredite rein – je mehr Techs du hast, desto schneller.",
      "Tippe auf 🌍 oben links für Extra-Klick-Einnahmen. Nach 100 Klicks steigt dein Klick-Multiplikator.",
      "Wissenschaft gibt dir bis zu 40% Rabatt auf alle Käufe – lohnt sich, früh in Forschung zu investieren!",
    ]
  },
  wissenschaft: {
    emoji:"🔬", title:"Wissenschaft", color:"#3080ff",
    short:"Forschungspunkte – machen alles günstiger und finden mehr Chancen.",
    bullets:[
      "Jede 1.000 Wissenschaft = 0,5% Rabatt auf alle Technologie-Kosten (max. 40% Rabatt bei 80.000).",
      "Mehr Wissenschaft = höhere Chance dass Ereignisse auftauchen (Gasquellen, seltene Erden, Anomalien...).",
      "Verdiene Wissenschaft durch: Wissenschaftler (zufällig), Mondlabore, Terraforming, Schattenstratege-Programm.",
      "Tipp: Frühzeitig in Wissenschaft investieren spart später enorm viel Geld bei teuren Techs.",
    ]
  },
  energie: {
    emoji:"⚡", title:"Energie", color:"#ff9020",
    short:"Treibstoff für deine Expansion – je mehr desto besser.",
    bullets:[
      "Energie wird durch Solarkraftwerke, Helium-3-Abbau, Atomreaktoren und Fusionsanlagen erzeugt.",
      "Höhere Energie beschleunigt zukünftige Forschungsprojekte und Produktionsprozesse.",
      "Besonders wichtig ab Jupiter: die Fusionsreaktoren liefern massive Energiemengen.",
      "Tipp: Atomenergie auf der Erde ist frühzeitig ein guter Investment – günstiger Einstieg mit hohem Ertrag.",
    ]
  },
  bevoelkerung: {
    emoji:"👥", title:"Bevölkerung", color:"#40a0c0",
    short:"Menschen = Arbeitskraft = direkt mehr Einnahmen.",
    bullets:[
      "Jede 1 Milliarde Menschen = +0,5 Kr./s extra (mit Multiplikator verstärkt).",
      "Bevölkerung wächst durch Stadtausbau (Erde), Koloniekuppeln (Mars), Orbitalplattformen (Jupiter) und viele weitere Kolonien.",
      "Wenn die Verteidigung auf 0 fällt, verlierst du langsam Bevölkerung – Aliens greifen an!",
      "Tipp: Viele Kolonien auf verschiedenen Planeten maximieren die Bevölkerung und damit dein Einkommen.",
    ]
  },
  multiplikator: {
    emoji:"⚙️", title:"Multiplikator", color:"#b040f0",
    short:"Verstärkt ALLE deine Einnahmen gleichzeitig.",
    bullets:[
      "Der Multiplikator wird durch Computertechnik (×1.12), Quantencomputer (×1.18) und Technologietausch (×2.0) erhöht.",
      "Er wirkt auf alle Kredit-Einnahmen – verdoppelst du ihn, verdoppelt sich dein passives Einkommen.",
      "Beispiel: Hast du +100 Kr./s und ×2.0, bekommst du +200 Kr./s.",
      "Tipp: Computertechnik früh kaufen – schon ×1.12 macht einen großen Unterschied über Zeit.",
    ]
  },
  verteidigung: {
    emoji:"🛡️", title:"Verteidigung", color:"#00dd70",
    short:"Schützt dich vor fremden Invasionen.",
    bullets:[
      "Verteidigung startet bei 2.000 und sinkt automatisch – je mehr Planeten du besitzt, desto schneller.",
      "Investiere in Militär-Techs: diese setzen eine Obergrenze. Der Balken lädt sich langsam bis dahin auf.",
      "Sobald er die Obergrenze erreicht, sinkt er wieder – du musst also regelmäßig nachsteuern!",
      "Geht Verteidigung auf 0: Aliens plündern langsam deine Kredite, Wissenschaft und Bevölkerung.",
      "Tipp: Nach jedem neuen Planeten sofort ins Militär investieren – der Drain steigt mit jedem Standort.",
    ]
  },
  ereignisse: {
    emoji:"⚡", title:"Ereignisse & Chancen", color:"#ffa030",
    short:"Zeitlich begrenzte Investitionen mit garantiertem Ertrag.",
    bullets:[
      "Ereignisse tauchen zufällig auf – du investierst einmalig und bekommst über Zeit mehr zurück.",
      "Beispiel: 3.000 Kr. investieren -> 12.000 Kr. + 300 Wiss. über 60 Sekunden zurückbekommen.",
      "Mit mehr Wissenschaft tauchen Ereignisse häufiger auf – bis zu 3× mehr Chancen!",
      "Ereignisse erscheinen erst nach dem Mond + mindestens 3 Technologien.",
      "Tipp: Immer annehmen wenn du kannst – der Ertrag ist fast immer mehr als das Dreifache des Einsatzes.",
    ]
  },
  spin: {
    emoji:"🎰", title:"Täglicher Dreh", color:"#a040f0",
    short:"Alle 5 Minuten gratis drehen – nur Gewinne!",
    bullets:[
      "Alle 5 Minuten kannst du das Rad drehen – komplett kostenlos.",
      "Die Belohnungen skalieren mit deinen aktuellen Krediten – immer relevant, egal wie weit du bist.",
      "Mögliche Gewinne: Kredite, Wissenschaft, Verteidigungs-Boost oder ×1.5 auf alle Einnahmen.",
      "Du bekommst eine Benachrichtigung sobald der Dreh wieder bereit ist.",
      "Tipp: Dreht man regelmäßig, summieren sich die Boni enorm – besonders der ×1.5 Multiplikator!",
    ]
  },
};

export function InfoSheet({info,onClose}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:1300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"linear-gradient(180deg,#001428,#000c1e)",border:`1px solid ${info.color}60`,borderRadius:"22px 22px 0 0",padding:"24px 20px 48px",maxWidth:500,width:"100%",boxShadow:"0 -8px 30px rgba(0,0,0,.7)"}}>
        <div style={{width:40,height:4,background:"rgba(255,255,255,.15)",borderRadius:2,margin:"0 auto 20px"}}/>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
          <span style={{fontSize:38}}>{info.emoji}</span>
          <div>
            <div style={{fontSize:20,fontWeight:"bold",color:info.color}}>{info.title}</div>
            <div style={{fontSize:12,color:"#506070",marginTop:3}}>{info.short}</div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
          {info.bullets.map((b,i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{color:info.color,fontSize:14,marginTop:1,flexShrink:0}}>›</span>
              <span style={{fontSize:13,color:"#5070a0",lineHeight:1.6}}>{b}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{width:"100%",padding:"16px",borderRadius:14,background:`linear-gradient(135deg,${info.color}22,${info.color}44)`,border:`1px solid ${info.color}60`,color:info.color,fontSize:15,fontWeight:"bold",cursor:"pointer"}}>
          Verstanden ✓
        </button>
      </div>
    </div>
  );
}
export function ToastContainer({toasts}){
  return(
    <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",zIndex:3000,display:"flex",flexDirection:"column",alignItems:"center",gap:6,paddingTop:10,pointerEvents:"none",width:"100%",maxWidth:480}}>
      {toasts.map(t=>(
        <div key={t.id} style={{background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,padding:"10px 18px",color:t.color,fontSize:13,fontWeight:"bold",boxShadow:"0 4px 20px rgba(0,0,0,.5)",animation:"toastIn .3s ease",display:"flex",alignItems:"center",gap:8,maxWidth:"90%"}}>
          {t.icon&&<span style={{fontSize:16}}>{t.icon}</span>}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

export function DefBar({val,max=2000}){
  const pct=Math.min(1,Math.max(0,val/max));
  const col=pct<0.25?"#ff3030":pct<0.55?"#ffaa00":"#00dd70";
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",gap:3}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:"#6080a0"}}>
        <span>🛡️ VERTEIDIGUNG</span>
        <span style={{color:col,fontWeight:"bold"}}>{fmt(val)}</span>
      </div>
      <div style={{position:"relative",height:10,borderRadius:5,background:"linear-gradient(90deg,#cc1010 0%,#ff9900 45%,#00cc60 100%)"}}>
        <div style={{position:"absolute",top:"50%",left:`${pct*100}%`,transform:"translate(-50%,-50%)",width:16,height:16,borderRadius:8,background:col,border:"2px solid rgba(255,255,255,.8)",boxShadow:`0 0 8px ${col}`,transition:"left 1s ease",zIndex:2}}/>
      </div>
    </div>
  );
}

export function Invaders({onWin,attempt}){
  const cvs=useRef(null);
  const g=useRef({px:160,moving:null,bullets:[],aliens:[],abuls:[],alive:true,lastShot:0,lastA:0,won:false});
  const cb=useRef({onWin});
  cb.current={onWin};

  const rows = Math.min(2+attempt, 5);
  const cols = Math.min(5+attempt, 9);
  const alienSpeed = Math.max(200, 1300 - attempt*150);
  const bulletSpeed = Math.min(4+attempt, 9);

  useEffect(()=>{
    const canvas=cvs.current;
    const ctx=canvas.getContext("2d");
    const W=canvas.width,H=canvas.height;
    const gg=g.current;
    gg.aliens=[];
    for(let r=0;r<rows;r++)
      for(let c=0;c<cols;c++)
        gg.aliens.push({x:10+c*(Math.floor((W-20)/cols)),y:22+r*40,alive:true});
    gg.px=W/2-22;gg.bullets=[];gg.abuls=[];gg.alive=true;gg.won=false;
    let aid;
    const loop=(ts)=>{
      if(!gg.alive){cancelAnimationFrame(aid);return;}
      ctx.fillStyle="#000814";ctx.fillRect(0,0,W,H);

      if(attempt>0){
        ctx.fillStyle="#ff6040";ctx.font="bold 10px sans-serif";
        ctx.fillText(`Versuch ${attempt+1} – Schwierigkeit ↑`,W/2-70,H-6);
      }

      if(gg.moving==="l") gg.px=Math.max(0,gg.px-5);
      if(gg.moving==="r") gg.px=Math.min(W-44,gg.px+5);

      ctx.fillStyle="#40c0ff";
      ctx.beginPath();ctx.moveTo(gg.px+22,H-52);ctx.lineTo(gg.px,H-34);ctx.lineTo(gg.px+44,H-34);ctx.closePath();ctx.fill();
      ctx.fillStyle="#60e0ff";ctx.fillRect(gg.px+16,H-34,12,9);

      if(ts-gg.lastShot>350){gg.bullets.push({x:gg.px+22,y:H-55});gg.lastShot=ts;}
      gg.bullets=gg.bullets.filter(b=>b.y>0);
      gg.bullets.forEach(b=>{b.y-=9;ctx.fillStyle="#00ff80";ctx.fillRect(b.x-2,b.y,4,12);});

      if(ts-gg.lastA>alienSpeed){
        const al=gg.aliens.filter(a=>a.alive);
        if(al.length){

          const shootCount=Math.min(Math.ceil(attempt/2)+1,al.length);
          for(let i=0;i<shootCount;i++){
            const a=al[Math.floor(Math.random()*al.length)];
            gg.abuls.push({x:a.x+14,y:a.y+20});
          }
        }
        gg.lastA=ts;
      }
      gg.abuls=gg.abuls.filter(b=>b.y<H);
      gg.abuls.forEach(b=>{
        b.y+=bulletSpeed;ctx.fillStyle="#ff4040";ctx.fillRect(b.x-2,b.y,4,12);
        if(b.y>H-55&&b.x>gg.px&&b.x<gg.px+44){
          gg.alive=false;gg.won=false;
          setTimeout(()=>cb.current.onWin(false),300);
        }
      });

      gg.aliens.forEach(a=>{
        if(!a.alive)return;
        gg.bullets.forEach((b,bi)=>{if(b.x>a.x&&b.x<a.x+28&&b.y>a.y&&b.y<a.y+28){a.alive=false;gg.bullets.splice(bi,1);}});
        if(!a.alive)return;
        ctx.fillStyle="#ff3060";ctx.beginPath();ctx.ellipse(a.x+14,a.y+12,13,9,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="#ff6090";
        ctx.beginPath();ctx.arc(a.x+8,a.y+8,4,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.arc(a.x+20,a.y+8,4,0,Math.PI*2);ctx.fill();
      });

      if(gg.aliens.every(a=>!a.alive)&&gg.alive){
        gg.alive=false;gg.won=true;
        setTimeout(()=>cb.current.onWin(true),300);
      }
      if(gg.aliens.some(a=>a.alive&&a.y>H-68)&&gg.alive){
        gg.alive=false;
        setTimeout(()=>cb.current.onWin(false),300);
      }

      ctx.fillStyle="#4080ff";ctx.font="bold 12px sans-serif";
      ctx.fillText("Feinde: "+gg.aliens.filter(a=>a.alive).length,8,16);
      aid=requestAnimationFrame(loop);
    };
    aid=requestAnimationFrame(loop);
    return()=>{gg.alive=false;cancelAnimationFrame(aid);};
  },[rows,cols,alienSpeed,bulletSpeed,attempt]);

  return(
    <div style={{position:"fixed",inset:0,background:"#000814",zIndex:2000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{color:"#ff4040",fontSize:15,fontWeight:"bold",letterSpacing:2,marginBottom:6,textAlign:"center"}}>
        ⚠️ INVASION! Verteidige die Erde!
      </div>
      {attempt>0&&(
        <div style={{color:"#ff8040",fontSize:11,marginBottom:8,textAlign:"center"}}>
          Versuch {attempt+1} – Die Aliens werden stärker! Du musst gewinnen!
        </div>
      )}
      <canvas ref={cvs} width={360} height={280} style={{border:`2px solid ${attempt>2?"#ff6020":"#ff3030"}`,borderRadius:12,maxWidth:"95vw",boxShadow:`0 0 30px ${attempt>2?"#ff602055":"#ff303055"}`}}/>
      <div style={{display:"flex",gap:20,marginTop:18}}>
        {[["◀","l"],["▶","r"]].map(([lbl,dir])=>(
          <button key={dir} onPointerDown={()=>g.current.moving=dir} onPointerUp={()=>g.current.moving=null} onPointerLeave={()=>g.current.moving=null}
            style={{width:90,height:90,borderRadius:45,background:"rgba(0,60,140,.85)",border:"2px solid rgba(60,140,255,.5)",color:"#60c0ff",fontSize:32,cursor:"pointer",userSelect:"none",touchAction:"none"}}>
            {lbl}
          </button>
        ))}
      </div>
      <div style={{color:"#607898",fontSize:11,marginTop:8}}>Schiff schießt automatisch • Du musst alle besiegen!</div>
    </div>
  );
}

export function DailySpin({onClose,onApply,spinRewards}){
  const [spinning,setSpin]=useState(false);
  const [rot,setRot]=useState(0);
  const [result,setResult]=useState(null);
  const N=spinRewards.length,slice=360/N;
  const cx=155,cy=155,rOuter=138,rInner=50;

  const spin=()=>{
    if(spinning||result)return;
    setSpin(true);
    const idx=Math.floor(Math.random()*N);
    const targetRot=360*7+(360-idx*slice-slice/2);
    setRot(v=>v+targetRot);
    setTimeout(()=>{setSpin(false);setResult(spinRewards[idx]);},3600);
  };

  const segColors=[
    ["#1a6a30","#2aaa50"],["#1a2a7a","#2a50cc"],["#6a1a70","#aa30cc"],
    ["#1a5a6a","#2aaabb"],["#7a4a10","#cc8020"],["#1a6a30","#2aaa50"],
    ["#5a1a20","#cc3040"],["#1a3a7a","#3060dd"],
  ];

  const W=310,H=310;

  return(
    <div style={{position:"fixed",inset:0,zIndex:1500,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16,
      background:"radial-gradient(ellipse at 50% 40%, rgba(10,20,60,.98) 0%, rgba(0,4,16,.99) 100%)"}}>

      {/* Stars bg */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",opacity:.4}}>
        {Array.from({length:60},(_,i)=>(
          <circle key={i} cx={`${(i*137.5)%100}%`} cy={`${(i*97.3)%100}%`} r={Math.random()*1.5+.3} fill="white" opacity={.3+Math.random()*.4}/>
        ))}
      </svg>

      <div style={{color:"#c0d8ff",fontSize:11,letterSpacing:6,marginBottom:6,textAlign:"center",opacity:.7}}>TÄGLICHER</div>
      <div style={{color:"#ffffff",fontSize:26,fontWeight:"900",letterSpacing:3,marginBottom:20,textAlign:"center",
        textShadow:"0 0 20px rgba(100,160,255,.8), 0 0 40px rgba(60,120,255,.4)"}}>
        🎰 GLÜCKSRAD
      </div>

      {/* Wheel container */}
      <div style={{position:"relative",width:W,height:W,maxWidth:"94vw",maxHeight:"50vw"}}>
        {/* Outer glow ring */}
        <div style={{position:"absolute",inset:-8,borderRadius:"50%",
          background:"transparent",
          boxShadow:`0 0 30px rgba(80,140,255,.35), 0 0 60px rgba(40,80,255,.15), inset 0 0 20px rgba(0,0,0,.5)`,
          border:"2px solid rgba(100,160,255,.25)"}}/>

        <svg width={W} height={H} style={{filter:"drop-shadow(0 0 12px rgba(60,120,255,.3))"}}>
          <defs>
            {segColors.map(([c1,c2],i)=>(
              <radialGradient key={i} id={`sg${i}`} cx="30%" cy="30%" r="80%">
                <stop offset="0%" stopColor={c2}/>
                <stop offset="100%" stopColor={c1}/>
              </radialGradient>
            ))}
            <radialGradient id="centerGrad" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#2a4080"/>
              <stop offset="100%" stopColor="#060d20"/>
            </radialGradient>
            <filter id="segGlow">
              <feGaussianBlur stdDeviation="1.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Spinning wheel group - use div wrapper for smooth rotation */}
          <g>
          <foreignObject x="0" y="0" width={W} height={H} style={{overflow:"visible"}}>
            <div style={{width:W,height:H,position:"relative"}}>
              <div style={{
                position:"absolute",inset:0,
                transform:`rotate(${rot}deg)`,
                transformOrigin:`${cx}px ${cy}px`,
                transition:spinning?`transform 3.6s cubic-bezier(0.1,0.7,0.1,1)`:"none",
                willChange:"transform",
              }}>
                <svg width={W} height={H}>
                  {spinRewards.map((item,i)=>{
                    const a0=(i*slice-90)*Math.PI/180,a1=((i+1)*slice-90)*Math.PI/180;
                    const x1=cx+rOuter*Math.cos(a0),y1=cy+rOuter*Math.sin(a0);
                    const x2=cx+rOuter*Math.cos(a1),y2=cy+rOuter*Math.sin(a1);
                    const xi1=cx+rInner*Math.cos(a0),yi1=cy+rInner*Math.sin(a0);
                    const xi2=cx+rInner*Math.cos(a1),yi2=cy+rInner*Math.sin(a1);
                    const midA=(a0+a1)/2;
                    const tx=cx+(rInner+(rOuter-rInner)*.58)*Math.cos(midA);
                    const ty=cy+(rInner+(rOuter-rInner)*.58)*Math.sin(midA);
                    const colorIdx=i%segColors.length;
                    return(
                      <g key={i}>
                        <path d={`M${xi1},${yi1} L${x1},${y1} A${rOuter},${rOuter} 0 0,1 ${x2},${y2} L${xi2},${yi2} A${rInner},${rInner} 0 0,0 ${xi1},${yi1} Z`}
                          fill={`url(#sg${colorIdx})`} stroke="rgba(0,8,24,.8)" strokeWidth={1.5}/>
                        <line x1={cx+rInner*Math.cos(a0)} y1={cy+rInner*Math.sin(a0)}
                          x2={cx+rOuter*Math.cos(a0)} y2={cy+rOuter*Math.sin(a0)}
                          stroke="rgba(255,255,255,.12)" strokeWidth={1}/>
                        <text x={tx} y={ty-6} textAnchor="middle" dominantBaseline="middle"
                          fill="rgba(255,255,255,.95)" fontSize={11} fontWeight="bold"
                          transform={`rotate(${i*slice+slice/2},${tx},${ty})`}>
                          {item.label.split(" ")[0]}
                        </text>
                        <text x={tx} y={ty+7} textAnchor="middle" dominantBaseline="middle"
                          fill="rgba(255,255,255,.75)" fontSize={8}
                          transform={`rotate(${i*slice+slice/2},${tx},${ty})`}>
                          {item.label.split(" ").slice(1).join(" ")}
                        </text>
                      </g>
                    );
                  })}
                  <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="rgba(100,160,255,.3)" strokeWidth={3}/>
                  {Array.from({length:N*2},(_,i)=>{
                    const a=i/N/2*Math.PI*2-Math.PI/2;
                    const r1=rOuter-2,r2=rOuter+6;
                    return <line key={i} x1={cx+r1*Math.cos(a)} y1={cy+r1*Math.sin(a)} x2={cx+r2*Math.cos(a)} y2={cy+r2*Math.sin(a)} stroke="rgba(150,200,255,.5)" strokeWidth={i%2===0?2:1}/>;
                  })}
                </svg>
              </div>
            </div>
          </foreignObject>
          </g>

          {/* Static pointer arrow */}
          <g filter="url(#segGlow)">
            <polygon points={`${cx-11},0 ${cx+11},0 ${cx+7},28 ${cx},38 ${cx-7},28`}
              fill="white" stroke="rgba(100,160,255,.6)" strokeWidth={1.5}
              style={{filter:"drop-shadow(0 2px 8px rgba(100,180,255,.8))"}}/>
            <circle cx={cx} cy={4} r={5} fill="rgba(180,220,255,.9)"/>
          </g>

          {/* Center hub */}
          <circle cx={cx} cy={cy} r={rInner} fill="url(#centerGrad)"
            stroke="rgba(100,160,255,.4)" strokeWidth={2}
            style={{filter:"drop-shadow(0 0 8px rgba(60,120,255,.5))"}}/>
          <text x={cx} y={cy-4} textAnchor="middle" fontSize={20} fill="white">🌌</text>
          <text x={cx} y={cy+12} textAnchor="middle" fontSize={8} fill="rgba(150,200,255,.7)"
            style={{fontFamily:"system-ui,sans-serif",letterSpacing:1}}>SPIN</text>
        </svg>
      </div>

      {/* Result or button */}
      {!result?(
        <button
          onClick={spin}
          onTouchEnd={e=>{e.preventDefault();spin();}}
          disabled={spinning}
          style={{
            position:"relative",zIndex:10,
            marginTop:24,padding:"18px 52px",
            background:spinning
              ?"rgba(20,30,60,.6)"
              :"linear-gradient(135deg,#0a2878,#1848c8)",
            border:`2px solid ${spinning?"rgba(60,100,200,.3)":"rgba(100,160,255,.7)"}`,
            borderRadius:50,color:"#c0d8ff",fontSize:17,fontWeight:"bold",
            cursor:spinning?"wait":"pointer",minWidth:220,letterSpacing:2,
            boxShadow:spinning?"none":"0 0 24px rgba(60,120,255,.4), 0 4px 20px rgba(0,0,0,.4)",
            transition:"all .2s",WebkitAppearance:"none",touchAction:"manipulation",
          }}>
          {spinning?(
            <span style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center"}}>
              <span style={{display:"inline-block",animation:"spinIcon 1s linear infinite"}}>🌀</span> DREHT...
            </span>
          ):"▶  DREHEN"}
        </button>
      ):(
        <div style={{textAlign:"center",marginTop:20,animation:"resultPop .4s ease"}}>
          <div style={{fontSize:14,color:"rgba(180,220,255,.7)",letterSpacing:2,marginBottom:8}}>DU HAST GEWONNEN</div>
          <div style={{fontSize:30,color:result.color,fontWeight:"900",marginBottom:6,
            textShadow:`0 0 20px ${result.color}88`}}>
            {result.label}
          </div>
          <div style={{fontSize:12,color:"rgba(150,200,150,.7)",marginBottom:20}}>wird deinem Konto gutgeschrieben</div>
          <button onClick={()=>{onApply(result);onClose();}} style={{
            padding:"18px 48px",
            background:"linear-gradient(135deg,#0a4020,#1a8040)",
            border:"2px solid rgba(0,220,100,.5)",borderRadius:50,
            color:"#40ff80",fontSize:16,fontWeight:"bold",cursor:"pointer",
            boxShadow:"0 0 20px rgba(0,200,80,.35)",letterSpacing:1,
          }}>EINLÖSEN ✓</button>
        </div>
      )}

      <button onClick={onClose} style={{marginTop:14,background:"none",border:"none",color:"rgba(100,140,180,.5)",fontSize:13,cursor:"pointer",padding:10,letterSpacing:1}}>
        Schließen
      </button>

      <style>{`
        @keyframes spinIcon{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes resultPop{from{opacity:0;transform:scale(.8) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
      `}</style>
    </div>
  );
}

export const MAP_ORBITS = {
  venus:     {r:60,  speed:.80, parent:null,   col:"#e8a020"},
  erde:      {r:82,  speed:.62, parent:null,   col:"#1a8fff"},
  mond:      {r:18,  speed:2.0, parent:"erde", col:"#a0a8b8"},
  mars:      {r:112, speed:.38, parent:null,   col:"#d04020"},
  phobos:    {r:14,  speed:4.0, parent:"mars", col:"#806050"},
  deimos:    {r:20,  speed:2.5, parent:"mars", col:"#706048"},
  ceres:     {r:148, speed:.26, parent:null,   col:"#909090"},
  vesta:     {r:140, speed:.29, parent:null,   col:"#806840"},
  jupiter:   {r:195, speed:.14, parent:null,   col:"#c07020"},
  io:        {r:22,  speed:3.5, parent:"jupiter",col:"#d0b020"},
  europa:    {r:30,  speed:2.8, parent:"jupiter",col:"#4090d0"},
  ganymed:   {r:40,  speed:2.0, parent:"jupiter",col:"#7090a0"},
  saturn:    {r:258, speed:.10, parent:null,   col:"#c0a040"},
  titan:     {r:30,  speed:1.6, parent:"saturn",col:"#c08030"},
  enceladus: {r:20,  speed:2.8, parent:"saturn",col:"#a0d0f0"},
  uranus:    {r:320, speed:.07, parent:null,   col:"#40c0d0"},
  neptun:    {r:375, speed:.05, parent:null,   col:"#2060d0"},
  triton:    {r:22,  speed:1.8, parent:"neptun",col:"#6090c0"},
  khaos:{r:440, speed:.03, parent:null,   col:"#ff5020"},
  eigene_welt:{r:520, speed:.015,parent:null,  col:"#c040ff"},
};
export const MAP_SIZES={
  erde:15,mond:5,venus:13,mars:10,phobos:3,deimos:3,
  ceres:5,vesta:5,jupiter:20,io:5,europa:6,ganymed:7,
  saturn:18,titan:8,enceladus:4,uranus:14,neptun:13,triton:5,
  khaos:13,eigene_welt:18,
};

// ── XP & LEVEL SYSTEM ──
export const XP_PER_LEVEL = (lvl) => Math.floor(100 * Math.pow(1.4, lvl - 1));
export const LEVEL_TITLES = [
  "Neuling","Entdecker","Pionier","Forscher","Ingenieur",
  "Raumfahrer","Mondfahrer","Mars-Kolonist","Asteroiden-Jaeger",
  "Jupiter-Kommandant","Saturn-Admiral","Uranus-Forscher",
  "Neptun-Bezwinger","Khaos-Jaeger","Galaxis-Retter",
  "Sternen-Koenig","Dimensionsreisender","Universumsherrscher",
  "Welterschaffer","Schoepfer aller Welten"
];
export const XP_REWARDS = {
  click:0.1, tech:15, unlock:100, event:20, spin:10,
  achievement:50, dailyDone:30, khaosDefeat:80, earnMillion:5,
};

// ── LEADERBOARD ──
export const LB_KEY = "krisenkommando_leaderboard";
export const PLAYER_KEY = "krisenkommando_player";
export function getLeaderboard(){
  try{ return JSON.parse(localStorage.getItem(LB_KEY)||"[]"); }
  catch{ return []; }
}
export function upsertLeaderboard(entry){
  const lb=getLeaderboard();
  const idx=lb.findIndex(e=>e.playerId===entry.playerId);
  if(idx>=0) lb[idx]={...lb[idx],...entry,updatedAt:Date.now()};
  else lb.push({...entry,updatedAt:Date.now()});
  lb.sort((a,b)=>b.level-a.level||b.xp-a.xp);
  localStorage.setItem(LB_KEY,JSON.stringify(lb.slice(0,100)));
}
export function getPlayerName(){ return localStorage.getItem(PLAYER_KEY)||""; }
export function setPlayerName(n){ localStorage.setItem(PLAYER_KEY,n); }

// ── SAVE SYSTEM ──
export const SAVE_VERSION = "v1.0-launch";
export const VERSION_KEY  = "krisenkommando_version";
export const MAX_SLOTS = 3;
export const SAVE_KEY = "dreikörper_saves";

if(typeof localStorage!=="undefined" && localStorage.getItem(VERSION_KEY)!==SAVE_VERSION){
  ["dreikörper_saves","krisenkommando_leaderboard","krisenkommando_player",
   "krisenkommando_desc","krisenkommando_avatar","krisenkommando_version"]
    .forEach(k=>localStorage.removeItem(k));
  localStorage.setItem(VERSION_KEY, SAVE_VERSION);
}

export function getSaves(){
  try{ return JSON.parse(localStorage.getItem(SAVE_KEY)||"{}"); }
  catch{ return {}; }
}
export function writeSave(slot,data){
  const saves=getSaves();
  saves[slot]=data;
  localStorage.setItem(SAVE_KEY,JSON.stringify(saves));
}
export function deleteSave(slot){
  const saves=getSaves();
  delete saves[slot];
  localStorage.setItem(SAVE_KEY,JSON.stringify(saves));
}

// ── LEVEL HELPERS ──
export function getLevelTitle(lvl){
  return LEVEL_TITLES[Math.min(lvl-1,LEVEL_TITLES.length-1)]||"Unsterblicher";
}
export function getXpForLevel(lvl){
  return Math.floor(100*Math.pow(1.4,lvl-1));
}
