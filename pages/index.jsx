import { useState, useRef, useCallback, useEffect } from "react";
import Head from "next/head";

const SECTIONS = ["Colors", "Avoid", "Clothing", "Outfits", "Occasions", "Analyzer"];

// ===================== DATA =====================

const colorGroups = [
  {
    name: "Greens — Your Power Colors",
    desc: "Your single strongest color family. These make your complexion glow.",
    colors: [
      { name: "Forest Green", hex: "#2D5016", use: "Quarter-zips, sweaters, jackets" },
      { name: "Hunter Green", hex: "#355E3B", use: "Blazers, overcoats, chinos" },
      { name: "Olive Green", hex: "#556B2F", use: "Casual jackets, cargo pants, tees" },
      { name: "Moss Green", hex: "#8A9A5B", use: "Summer shirts, light layers" },
      { name: "Dark Teal", hex: "#008080", use: "Shirts, knitwear, scarves" },
    ],
  },
  {
    name: "Blues — Versatile Foundation",
    desc: "Navy and deep blues are your most versatile neutrals. Avoid icy or bright blues.",
    colors: [
      { name: "Navy Blue", hex: "#1B2A4A", use: "Blazers, polos, suits, overcoats" },
      { name: "Deep Teal Blue", hex: "#003B5C", use: "Shirts, knitwear, layering" },
      { name: "Petrol Blue", hex: "#1B3A4B", use: "Casual shirts, quarter-zips" },
      { name: "Slate Blue", hex: "#4A5E78", use: "Trousers, light jackets" },
    ],
  },
  {
    name: "Browns & Neutrals — Your Warm Base",
    desc: "These replace black and grey as your wardrobe backbone.",
    colors: [
      { name: "Dark Chocolate", hex: "#3B2314", use: "Boots, belts, bags, trousers" },
      { name: "Cognac / Camel", hex: "#9A6324", use: "Shoes, belts, overcoats" },
      { name: "Warm Beige / Tan", hex: "#C8AD7F", use: "Chinos, summer trousers" },
      { name: "Warm Charcoal", hex: "#4A4A44", use: "Trousers, suits (your black alt)" },
      { name: "Off-White / Cream", hex: "#F5F0E0", use: "Shirts, tees, summer knits" },
    ],
  },
  {
    name: "Reds & Warm Accents — Statement Colors",
    desc: "Use for pieces that add visual interest — sweaters, scarves, polos.",
    colors: [
      { name: "Burgundy / Wine", hex: "#722F37", use: "Sweaters, scarves, knitwear" },
      { name: "Rust", hex: "#CC5500", use: "T-shirts, casual shirts" },
      { name: "Terracotta", hex: "#C04000", use: "Summer shirts, casual knits" },
      { name: "Mustard Gold", hex: "#D4A017", use: "Accent sweaters, scarves" },
      { name: "Deep Plum", hex: "#5C3A6E", use: "Knitwear, dress shirts" },
    ],
  },
];

const avoidColors = [
  { name: "Pure Black", hex: "#000000", why: "Too stark and cool — drains warmth from your skin", instead: "Warm Charcoal", insteadHex: "#4A4A44" },
  { name: "Bright White", hex: "#FFFFFF", why: "High contrast looks jarring against warm skin", instead: "Off-White / Cream", insteadHex: "#F5F0E0" },
  { name: "Baby Blue", hex: "#89CFF0", why: "Cool-toned and too light — makes skin look sallow", instead: "Deep Teal", insteadHex: "#008080" },
  { name: "Pastel Pink", hex: "#FFD1DC", why: "Too light and cool — washes you out completely", instead: "Terracotta", insteadHex: "#C04000" },
  { name: "Lavender", hex: "#C5A3CF", why: "Cool purple tones clash with warm undertones", instead: "Deep Plum", insteadHex: "#5C3A6E" },
  { name: "Cool Grey", hex: "#9E9E9E", why: "Flat and lifeless — drains color from your face", instead: "Warm Charcoal", insteadHex: "#4A4A44" },
  { name: "Hot Pink", hex: "#FF69B4", why: "Too cool and bright — creates visual tension", instead: "Burgundy", insteadHex: "#722F37" },
  { name: "Neon Yellow", hex: "#DFFF00", why: "Synthetic and overpowering — kills your warmth", instead: "Mustard Gold", insteadHex: "#D4A017" },
  { name: "Electric Blue", hex: "#0047AB", why: "Too bright and cool-toned for your palette", instead: "Navy Blue", insteadHex: "#1B2A4A" },
  { name: "Bright Orange", hex: "#FF6600", why: "Too loud on its own — can look costumey", instead: "Rust / Burnt Orange", insteadHex: "#CC5500" },
];

const clothingTypes = [
  {
    category: "Tops",
    items: [
      { name: "Quarter-Zip Sweater", verdict: "wear", qty: "3–4", bestColors: ["#2D5016", "#1B2A4A", "#722F37", "#4A4A44"], desc: "Your signature piece. Knit or fleece, sitting just below the belt. Layer over Oxford shirts or wear solo." },
      { name: "Crew-Neck Sweater", verdict: "wear", qty: "2–3", bestColors: ["#9A6324", "#008080", "#CC5500", "#722F37"], desc: "Merino wool or lambswool. Layer over collared shirts for smart casual. Slim fit — skim, not cling." },
      { name: "Roll/Turtle-Neck", verdict: "wear", qty: "1–2", bestColors: ["#3B2314", "#4A4A44"], desc: "Elevated winter piece. Amazing under blazers and overcoats. Dark chocolate and charcoal." },
      { name: "Knit Polo Shirt", verdict: "wear", qty: "2–3", bestColors: ["#1B2A4A", "#2D5016", "#722F37"], desc: "Not the athletic pique — a knit polo is refined and elevated. Great for conferences and dinners." },
      { name: "Henley (Long-Sleeve)", verdict: "wear", qty: "2–3", bestColors: ["#4A4A44", "#2D5016", "#F5F0E0"], desc: "Step-up from a plain tee. Perfect for Dublin pub nights and casual dinners." },
      { name: "Oxford Button-Down", verdict: "wear", qty: "3–4", bestColors: ["#F5F0E0", "#B8D4E3", "#C5CEAA"], desc: "Most versatile 'dress-up' shirt. Works under blazers, with chinos, or rolled-up with jeans." },
      { name: "Crew-Neck T-Shirt", verdict: "wear", qty: "5–7", bestColors: ["#F5F0E0", "#556B2F", "#CC5500", "#722F37", "#2D5016", "#4A4A44"], desc: "Casual base layer. Invest in structured, heavier cotton. Choose warm palette colors over grey." },
      { name: "Graphic/Logo Tee", verdict: "avoid", qty: "0", bestColors: [], desc: "Graphic tees with large logos cheapen your look. Clean and minimal reads more polished." },
      { name: "Sweatshirt", verdict: "wear", qty: "2", bestColors: ["#4A4A44", "#556B2F"], desc: "Weekend casual. French terry or heavyweight cotton. Relaxed slim fit." },
    ],
  },
  {
    category: "Bottoms",
    items: [
      { name: "Slim Tapered Chinos", verdict: "wear", qty: "4–5", bestColors: ["#C8AD7F", "#556B2F", "#1B2A4A", "#4A4A44", "#9A6324"], desc: "Your wardrobe workhorse. Tan is your go-to — expand into olive, navy, and charcoal." },
      { name: "Dark Wash Jeans", verdict: "wear", qty: "2", bestColors: ["#1C2841", "#2C2420"], desc: "Slim or slim-tapered. No distressing, no pre-fading. Dark indigo reads polished." },
      { name: "Wool Trousers", verdict: "wear", qty: "2", bestColors: ["#4A4A44", "#1B2A4A"], desc: "Formal occasions, dinners, meetings. Get them tailored/tapered." },
      { name: "Baggy/Wide-Leg Jeans", verdict: "avoid", qty: "0", bestColors: [], desc: "Too much fabric for your 65kg lean frame. Will swallow your silhouette." },
      { name: "Skinny Jeans", verdict: "avoid", qty: "0", bestColors: [], desc: "Too restrictive and outdated. Slim-tapered gives the clean line without being painted on." },
    ],
  },
  {
    category: "Outerwear",
    items: [
      { name: "Wool Overcoat", verdict: "wear", qty: "1–2", bestColors: ["#9A6324", "#4A4A44"], desc: "THE investment piece. Camel is stunning on Deep Autumns. Mid-thigh length." },
      { name: "Unstructured Blazer", verdict: "wear", qty: "1–2", bestColors: ["#1B2A4A", "#2D5016", "#4A4A44"], desc: "Biggest 'level-up' piece. Navy is must-have. Wear with chinos and Oxford or over a tee." },
      { name: "Bomber Jacket", verdict: "wear", qty: "1", bestColors: ["#556B2F", "#3B2314"], desc: "Casual spring/autumn layer. Works with jeans and henleys." },
      { name: "Brown Leather Jacket", verdict: "wear", qty: "1", bestColors: ["#3B2314", "#9A6324"], desc: "Warm brown suits your coloring FAR better than black. 10+ year investment piece." },
      { name: "Black Leather Jacket", verdict: "avoid", qty: "0", bestColors: [], desc: "Black leather clashes with warm undertones. Brown is always better for Deep Autumns." },
      { name: "Rain Jacket", verdict: "wear", qty: "1", bestColors: ["#1B2A4A", "#556B2F"], desc: "Dublin essential. Clean, minimalist style — not sporty hiking gear." },
    ],
  },
  {
    category: "Footwear",
    items: [
      { name: "White Leather Sneakers", verdict: "wear", qty: "1", bestColors: ["#FFFFFF"], desc: "Classic and versatile. Pair with almost anything. Keep them clean." },
      { name: "Chelsea Boots (Brown)", verdict: "wear", qty: "1", bestColors: ["#8B4513", "#9A6324"], desc: "Essential for Dublin. Sleek, pairs with everything. Chestnut or cognac leather." },
      { name: "Desert Boots", verdict: "wear", qty: "1", bestColors: ["#C8AD7F", "#8B4513"], desc: "Casual-smart bridge. Great with chinos and knitwear." },
      { name: "Derby/Oxford Shoes", verdict: "wear", qty: "1", bestColors: ["#3B2314", "#9A6324"], desc: "For formal occasions. Dark brown or cognac — never black." },
      { name: "Black Dress Shoes", verdict: "avoid", qty: "0", bestColors: [], desc: "Black footwear clashes with your warm palette. Brown, cognac, and tan are better." },
    ],
  },
  {
    category: "Accessories",
    items: [
      { name: "Tortoiseshell Sunglasses", verdict: "wear", qty: "1", bestColors: ["#8B4513"], desc: "Perfect Deep Autumn frame. Warm and flattering. Avoid jet black frames." },
      { name: "Leather Belt (Brown)", verdict: "wear", qty: "2", bestColors: ["#3B2314", "#9A6324"], desc: "Dark brown and cognac/tan. Match loosely to shoes. Never black leather." },
      { name: "Wool Scarf", verdict: "wear", qty: "1–2", bestColors: ["#722F37", "#D4A017", "#9A6324"], desc: "Adds color near your face. Burgundy and mustard for Dublin winters." },
      { name: "Watch", verdict: "wear", qty: "1–2", bestColors: ["#B8860B"], desc: "Warm metals (gold/rose gold). Brown leather straps. Avoid silver/steel." },
    ],
  },
];

const outfitCombos = [
  { name: "Everyday Smart Casual", occasion: "Office / Daily Wear", top: { name: "Forest Green Quarter-Zip", color: "#2D5016" }, bottom: { name: "Tan Chinos", color: "#C8AD7F" }, shoes: { name: "White Sneakers", color: "#FFFFFF" }, accent: { name: "Brown Leather Belt", color: "#9A6324" } },
  { name: "Conference Ready", occasion: "Conferences / Events", top: { name: "Navy Blazer + Off-White Oxford", color: "#1B2A4A" }, bottom: { name: "Charcoal Wool Trousers", color: "#4A4A44" }, shoes: { name: "Cognac Derby Shoes", color: "#9A6324" }, accent: { name: "Burgundy Pocket Square", color: "#722F37" } },
  { name: "Dinner Date", occasion: "Dinner / Going Out", top: { name: "Dark Chocolate Roll-Neck", color: "#3B2314" }, bottom: { name: "Navy Wool Trousers", color: "#1B2A4A" }, shoes: { name: "Brown Chelsea Boots", color: "#8B4513" }, accent: { name: "Gold-Tone Watch", color: "#B8860B" } },
  { name: "Weekend Casual", occasion: "Weekend / Relaxed", top: { name: "Rust Crew-Neck Tee", color: "#CC5500" }, bottom: { name: "Dark Wash Jeans", color: "#1C2841" }, shoes: { name: "White Sneakers", color: "#FFFFFF" }, accent: { name: "Tortoiseshell Sunglasses", color: "#8B4513" } },
  { name: "Dublin Layered Look", occasion: "Autumn / Rainy Day", top: { name: "Camel Overcoat + Navy Quarter-Zip", color: "#9A6324" }, bottom: { name: "Dark Olive Chinos", color: "#556B2F" }, shoes: { name: "Brown Chelsea Boots", color: "#8B4513" }, accent: { name: "Mustard Wool Scarf", color: "#D4A017" } },
  { name: "Summer Evening", occasion: "Summer Dinner / Event", top: { name: "Deep Teal Knit Polo", color: "#008080" }, bottom: { name: "Tan Chinos", color: "#C8AD7F" }, shoes: { name: "Brown Suede Loafers", color: "#A0785A" }, accent: { name: "Brown Leather Belt", color: "#3B2314" } },
];

const occasionGuides = [
  { name: "Office / Work Day", icon: "💼", level: "Smart Casual", formula: "Collared or knit top + chinos/trousers + clean shoes", doList: ["Quarter-zips over Oxford shirts", "Crew-neck sweaters with chinos", "Knit polos with trousers", "Chelsea boots or clean sneakers", "Leather-strap watch"], dontList: ["Hoodies or graphic tees", "Joggers or track pants", "Flashy sneakers", "Overly formal suits", "Black leather accessories"] },
  { name: "Conference / Event", icon: "🎤", level: "Elevated Smart Casual", formula: "Blazer + smart shirt or knit polo + tailored trousers + polished shoes", doList: ["Unstructured blazer over Oxford", "Knit polo under blazer", "Pocket square in burgundy/mustard", "Cognac Derby shoes", "Tailored wool trousers"], dontList: ["Full formal suit with tie", "Sneakers (unless very clean white)", "Bright/flashy colors", "Loose-fitting anything", "Backpack (use leather bag)"] },
  { name: "Dinner / Going Out", icon: "🍽️", level: "Polished Casual", formula: "Rich-toned knit or shirt + dark trousers + polished shoes", doList: ["Roll-neck sweaters", "Dark trousers (navy or charcoal)", "Chelsea boots", "Burgundy or plum knitwear", "Minimal accessories"], dontList: ["Jeans (unless upscale casual)", "White sneakers for nice restaurants", "Bright statement colors", "Athleisure or sporty pieces", "Oversized fits"] },
  { name: "Weekend / Casual", icon: "☕", level: "Relaxed", formula: "Quality tee or henley + jeans/casual chinos + sneakers", doList: ["Rust, olive, or cream tees", "Dark wash jeans", "White sneakers", "Henleys", "Bomber jacket for layering"], dontList: ["All-black outfits", "Worn-out or stained clothes", "Cargo shorts", "Heavy formal pieces", "Cool-toned pastels"] },
  { name: "Special / Formal (Eid, Weddings)", icon: "✨", level: "Formal / Traditional", formula: "Suit or shalwar kameez in palette colors + polished accessories", doList: ["Navy or charcoal suit", "Deep navy/forest green kurta", "Cognac shoes + matching belt", "Cream kurta + dark waistcoat for Eid", "Off-white dress shirt"], dontList: ["Black suit (charcoal is better)", "Bright pastel kurtas", "Black shoes", "Mismatched accessories", "Overly trendy pieces"] },
];

// ===================== COMPONENTS =====================

function ColorSwatch({ hex, size = 48 }) {
  const isLight = hex === "#FFFFFF" || hex === "#F5F0E0";
  return (
    <div style={{
      width: size, height: size, backgroundColor: hex, borderRadius: size > 30 ? 8 : 4, flexShrink: 0,
      border: isLight ? "2px solid #d4cfc7" : "2px solid rgba(0,0,0,0.08)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }} />
  );
}

function VerdictBadge({ verdict }) {
  const config = {
    BUY: { bg: "#E8F5E9", color: "#2D5016", border: "#C8E6C9", icon: "✅", text: "BUY IT" },
    SKIP: { bg: "#FFEBEE", color: "#C41E3A", border: "#FFCDD2", icon: "❌", text: "SKIP IT" },
    MAYBE: { bg: "#FFF8E1", color: "#E65100", border: "#FFE0B2", icon: "🤔", text: "MAYBE" },
  };
  const c = config[verdict] || config.MAYBE;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px",
      backgroundColor: c.bg, border: `2px solid ${c.border}`, borderRadius: 30,
      fontSize: 18, fontWeight: 700, color: c.color,
    }}>
      <span style={{ fontSize: 22 }}>{c.icon}</span> {c.text}
    </div>
  );
}

function ConfidenceMeter({ value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
      <span style={{ fontSize: 12, color: "#999" }}>Confidence:</span>
      <div style={{ display: "flex", gap: 3 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{
            width: 12, height: 12, borderRadius: 3,
            backgroundColor: i < value ? (value >= 7 ? "#2D5016" : value >= 4 ? "#D4A017" : "#C41E3A") : "#E8E2DA",
          }} />
        ))}
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>{value}/10</span>
    </div>
  );
}

// ===================== MAIN APP =====================

export default function Home() {
  const [activeSection, setActiveSection] = useState("Colors");
  const [activeClothingCat, setActiveClothingCat] = useState("Tops");

  // Analyzer state
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setResult(null);
    setError(null);
    setMediaType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setImageData(e.target.result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  }, []);

  // Paste handler
  useEffect(() => {
    const handlePaste = (e) => {
      if (activeSection !== "Analyzer") return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          processFile(item.getAsFile());
          break;
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [activeSection, processFile]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) processFile(file);
  };

  const analyzeImage = async () => {
    if (!imageData) return;
    setAnalyzing(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData, mediaType }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalyzer = () => {
    setImagePreview(null);
    setImageData(null);
    setMediaType(null);
    setResult(null);
    setError(null);
  };

  return (
    <>
      <Head>
        <title>Bilal — Personal Style Guide</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎨</text></svg>" />
      </Head>

      <div style={{ minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #2D5016 0%, #1B2A4A 50%, #3B2314 100%)", padding: "28px 20px 20px", color: "white" }}>
          <div style={{ maxWidth: 920, margin: "0 auto" }}>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", opacity: 0.6, marginBottom: 6 }}>Personal Style Guide</div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, marginBottom: 4 }}>Bilal — Deep Autumn</h1>
            <div style={{ fontSize: 13, opacity: 0.75 }}>173cm • 65kg • Slim Build • Dublin, Ireland</div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#FAF8F5", borderBottom: "2px solid #E8E2DA", padding: "0 20px", overflowX: "auto" }}>
          <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", gap: 0 }}>
            {SECTIONS.map((s) => {
              const labels = { Colors: "✅ Wear", Avoid: "❌ Avoid", Clothing: "👔 Clothing", Outfits: "🎨 Outfits", Occasions: "📋 Occasions", Analyzer: "📸 Analyzer" };
              return (
                <button key={s} onClick={() => setActiveSection(s)} style={{
                  padding: "12px 16px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontFamily: "inherit",
                  fontWeight: activeSection === s ? 700 : 400, color: activeSection === s ? "#2D5016" : "#999",
                  borderBottom: activeSection === s ? "3px solid #2D5016" : "3px solid transparent", whiteSpace: "nowrap", transition: "all 0.2s",
                }}>{labels[s]}</button>
              );
            })}
          </div>
        </div>

        <div style={{ maxWidth: 920, margin: "0 auto", padding: "24px 20px 80px" }}>

          {/* ===== COLORS ===== */}
          {activeSection === "Colors" && (
            <div className="fade-in">
              <h2 style={{ fontSize: 22, color: "#2D5016", marginBottom: 6 }}>Your Color Palette</h2>
              <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                As a <strong>Deep Autumn</strong>, your best colors are rich, warm, and saturated — matching your dark hair, brown eyes, and golden-undertone skin.
              </p>
              {colorGroups.map((g, gi) => (
                <div key={gi} style={{ marginBottom: 32 }}>
                  <h3 style={{ fontSize: 16, color: "#6B3A2A", marginBottom: 4 }}>{g.name}</h3>
                  <p style={{ fontSize: 12, color: "#999", marginBottom: 12 }}>{g.desc}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {g.colors.map((c, ci) => (
                      <div key={ci} style={{ display: "flex", alignItems: "center", gap: 14, backgroundColor: "white", borderRadius: 12, padding: "10px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", border: "1px solid #EDE7DF" }}>
                        <ColorSwatch hex={c.hex} size={52} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: "#aaa", fontFamily: "monospace", marginTop: 1 }}>{c.hex}</div>
                        </div>
                        <div style={{ fontSize: 12, color: "#777", textAlign: "right", maxWidth: 200 }}>{c.use}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 32 }}>
                <h3 style={{ fontSize: 16, color: "#6B3A2A", marginBottom: 10 }}>Full Palette at a Glance</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: 16, backgroundColor: "white", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  {colorGroups.flatMap((g) => g.colors).map((c, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ width: 48, height: 48, backgroundColor: c.hex, borderRadius: 8, border: c.hex === "#F5F0E0" ? "2px solid #d4cfc7" : "2px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }} />
                      <div style={{ fontSize: 8, marginTop: 3, color: "#999", maxWidth: 48, lineHeight: 1.2 }}>{c.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== AVOID ===== */}
          {activeSection === "Avoid" && (
            <div className="fade-in">
              <h2 style={{ fontSize: 22, color: "#C41E3A", marginBottom: 6 }}>Colors to Avoid</h2>
              <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                These will wash you out or clash with your warm undertones. Each has a better alternative from your palette.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {avoidColors.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, backgroundColor: "white", borderRadius: 14, padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", border: "1px solid #EDE7DF", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 160 }}>
                      <div style={{ position: "relative" }}>
                        <ColorSwatch hex={c.hex} size={48} />
                        <div style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: "#E53935", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>✕</div>
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#C41E3A" }}>{c.name}</div>
                        <div style={{ fontSize: 10, color: "#aaa", fontFamily: "monospace" }}>{c.hex}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 20, color: "#ccc", padding: "0 2px" }}>→</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 160 }}>
                      <div style={{ position: "relative" }}>
                        <ColorSwatch hex={c.insteadHex} size={48} />
                        <div style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: "#2D5016", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>✓</div>
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#2D5016" }}>{c.instead}</div>
                        <div style={{ fontSize: 10, color: "#aaa", fontFamily: "monospace" }}>{c.insteadHex}</div>
                      </div>
                    </div>
                    <div style={{ flex: 1, fontSize: 12, color: "#888", minWidth: 180, paddingLeft: 4 }}>{c.why}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 36, display: "flex", gap: 20, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#C41E3A", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>❌ Avoid These</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, padding: 14, backgroundColor: "#FFF5F5", borderRadius: 12, border: "1px solid #FFCDD2" }}>
                    {avoidColors.map((c, i) => <div key={i} style={{ width: 40, height: 40, backgroundColor: c.hex, borderRadius: 6, border: c.hex === "#FFFFFF" ? "2px solid #ddd" : "2px solid rgba(0,0,0,0.06)" }} />)}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#2D5016", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>✅ Wear Instead</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, padding: 14, backgroundColor: "#F1F8E9", borderRadius: 12, border: "1px solid #C8E6C9" }}>
                    {avoidColors.map((c, i) => <div key={i} style={{ width: 40, height: 40, backgroundColor: c.insteadHex, borderRadius: 6, border: c.insteadHex === "#F5F0E0" ? "2px solid #d4cfc7" : "2px solid rgba(0,0,0,0.06)" }} />)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== CLOTHING ===== */}
          {activeSection === "Clothing" && (
            <div className="fade-in">
              <h2 style={{ fontSize: 22, color: "#2D5016", marginBottom: 6 }}>Clothing Types</h2>
              <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                Each item marked <span style={{ color: "#2D5016", fontWeight: 700 }}>✅ WEAR</span> or <span style={{ color: "#C41E3A", fontWeight: 700 }}>❌ AVOID</span> with quantities and colors.
              </p>
              <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
                {clothingTypes.map((cat) => (
                  <button key={cat.category} onClick={() => setActiveClothingCat(cat.category)} style={{
                    padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                    backgroundColor: activeClothingCat === cat.category ? "#2D5016" : "#EDE7DF",
                    color: activeClothingCat === cat.category ? "white" : "#777", transition: "all 0.2s",
                  }}>{cat.category}</button>
                ))}
              </div>
              {clothingTypes.filter((c) => c.category === activeClothingCat).map((cat) => (
                <div key={cat.category} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {cat.items.map((item, ii) => (
                    <div key={ii} style={{
                      backgroundColor: "white", borderRadius: 14, padding: "16px 18px",
                      boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                      border: item.verdict === "avoid" ? "2px solid #FFCDD2" : "2px solid #C8E6C9",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1,
                          color: item.verdict === "avoid" ? "#C41E3A" : "#2D5016",
                          backgroundColor: item.verdict === "avoid" ? "#FFEBEE" : "#E8F5E9",
                          padding: "3px 10px", borderRadius: 10,
                        }}>{item.verdict === "avoid" ? "❌ AVOID" : "✅ WEAR"}</span>
                        {item.qty !== "0" && <span style={{ fontSize: 11, color: "#aaa" }}>Own {item.qty}</span>}
                      </div>
                      <h4 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>{item.name}</h4>
                      <p style={{ fontSize: 13, color: "#666", lineHeight: 1.5, margin: 0, marginBottom: item.bestColors.length ? 8 : 0 }}>{item.desc}</p>
                      {item.bestColors.length > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, color: "#aaa" }}>Best in:</span>
                          <div style={{ display: "flex", gap: 4 }}>{item.bestColors.map((h, ci) => <ColorSwatch key={ci} hex={h} size={22} />)}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* ===== OUTFITS ===== */}
          {activeSection === "Outfits" && (
            <div className="fade-in">
              <h2 style={{ fontSize: 22, color: "#2D5016", marginBottom: 6 }}>Outfit Combinations</h2>
              <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>Pre-built outfits tested against your Deep Autumn palette. Grab and go.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {outfitCombos.map((o, oi) => (
                  <div key={oi} style={{ backgroundColor: "white", borderRadius: 14, padding: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", border: "1px solid #EDE7DF" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{o.name}</h3>
                      <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 10, backgroundColor: "#F5F0EB", color: "#999", fontWeight: 600 }}>{o.occasion}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
                      {[{ label: "Top", ...o.top }, { label: "Bottom", ...o.bottom }, { label: "Shoes", ...o.shoes }, { label: "Accent", ...o.accent }].map((p, pi) => (
                        <div key={pi} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", backgroundColor: "#FAFAF8", borderRadius: 10, border: "1px solid #EDE7DF" }}>
                          <ColorSwatch hex={p.color} size={38} />
                          <div>
                            <div style={{ fontSize: 9, color: "#bbb", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{p.label}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#444" }}>{p.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, color: "#ccc" }}>Harmony:</span>
                      <div style={{ display: "flex", gap: 0, borderRadius: 5, overflow: "hidden" }}>
                        {[o.top, o.bottom, o.shoes, o.accent].map((p, i) => (
                          <div key={i} style={{ width: 36, height: 12, backgroundColor: p.color, border: p.color === "#FFFFFF" ? "1px solid #ddd" : "none" }} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== OCCASIONS ===== */}
          {activeSection === "Occasions" && (
            <div className="fade-in">
              <h2 style={{ fontSize: 22, color: "#2D5016", marginBottom: 6 }}>Dressing by Occasion</h2>
              <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>What to wear and avoid for every situation.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {occasionGuides.map((occ, oi) => (
                  <div key={oi} style={{ backgroundColor: "white", borderRadius: 14, padding: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", border: "1px solid #EDE7DF" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 26 }}>{occ.icon}</span>
                      <div>
                        <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{occ.name}</h3>
                        <div style={{ fontSize: 11, color: "#aaa" }}>Level: {occ.level}</div>
                      </div>
                    </div>
                    <div style={{ backgroundColor: "#F5F0EB", borderRadius: 8, padding: "8px 12px", margin: "10px 0 14px", fontSize: 12, color: "#666" }}>
                      <strong>Formula:</strong> {occ.formula}
                    </div>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ flex: "1 1 230px" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#2D5016", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>✅ Do</div>
                        {occ.doList.map((item, i) => <div key={i} style={{ fontSize: 12, color: "#666", padding: "3px 0 3px 14px", position: "relative", lineHeight: 1.5 }}><span style={{ position: "absolute", left: 0, color: "#2D5016" }}>•</span>{item}</div>)}
                      </div>
                      <div style={{ flex: "1 1 230px" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#C41E3A", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>❌ Don't</div>
                        {occ.dontList.map((item, i) => <div key={i} style={{ fontSize: 12, color: "#666", padding: "3px 0 3px 14px", position: "relative", lineHeight: 1.5 }}><span style={{ position: "absolute", left: 0, color: "#C41E3A" }}>•</span>{item}</div>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== ANALYZER ===== */}
          {activeSection === "Analyzer" && (
            <div className="fade-in">
              <h2 style={{ fontSize: 22, color: "#2D5016", marginBottom: 6 }}>Should I Buy This?</h2>
              <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                Upload, drag & drop, or <strong>paste (Ctrl+V / Cmd+V)</strong> a photo of any clothing item. AI will analyze it against your palette and tell you whether to buy it.
              </p>

              {!imagePreview ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `3px dashed ${dragOver ? "#2D5016" : "#CCC4B8"}`,
                    borderRadius: 20,
                    padding: "60px 40px",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: dragOver ? "#F1F8E9" : "#FEFDFB",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 52, marginBottom: 12 }}>📸</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#555", marginBottom: 6 }}>Drop an image here, click to upload, or paste from clipboard</div>
                  <div style={{ fontSize: 13, color: "#aaa" }}>Works with screenshots, product photos, or anything showing the clothing item</div>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => processFile(e.target.files?.[0])} />
                </div>
              ) : (
                <div>
                  {/* Image preview */}
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
                    <div style={{ position: "relative" }}>
                      <img src={imagePreview} alt="Clothing to analyze" style={{ maxWidth: 300, maxHeight: 400, borderRadius: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", objectFit: "contain" }} />
                      <button onClick={resetAnalyzer} style={{
                        position: "absolute", top: 8, right: 8, width: 32, height: 32, borderRadius: 16,
                        backgroundColor: "rgba(0,0,0,0.6)", color: "white", border: "none", cursor: "pointer",
                        fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                      }}>✕</button>
                    </div>

                    <div style={{ flex: 1, minWidth: 240 }}>
                      {!result && !analyzing && (
                        <button onClick={analyzeImage} style={{
                          padding: "14px 32px", backgroundColor: "#2D5016", color: "white", border: "none",
                          borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                          boxShadow: "0 4px 14px rgba(45,80,22,0.3)", transition: "all 0.2s",
                        }}>
                          Analyze This Item
                        </button>
                      )}

                      {analyzing && (
                        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0" }}>
                          <div style={{ width: 24, height: 24, border: "3px solid #E8E2DA", borderTopColor: "#2D5016", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                          <span style={{ fontSize: 15, color: "#666" }}>Analyzing against your palette...</span>
                        </div>
                      )}

                      {error && (
                        <div style={{ padding: "14px 18px", backgroundColor: "#FFEBEE", borderRadius: 12, border: "1px solid #FFCDD2", color: "#C41E3A", fontSize: 14 }}>
                          {error}
                        </div>
                      )}

                      {result && (
                        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                          <div>
                            <VerdictBadge verdict={result.verdict} />
                            <div style={{ marginTop: 8 }}>
                              <ConfidenceMeter value={result.confidence} />
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>{result.item_name}</div>
                            <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>Detected color: {result.detected_color}</div>
                          </div>

                          {/* Color match */}
                          <div style={{ backgroundColor: "#FAFAF8", borderRadius: 12, padding: "14px 16px", border: "1px solid #EDE7DF" }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#6B3A2A", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                              Color Match: {result.color_match}
                            </div>
                            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>{result.color_explanation}</p>
                          </div>

                          {/* Fit */}
                          <div style={{ backgroundColor: "#FAFAF8", borderRadius: 12, padding: "14px 16px", border: "1px solid #EDE7DF" }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#6B3A2A", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Fit Assessment</div>
                            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>{result.fit_assessment}</p>
                          </div>

                          {/* Styling tips */}
                          <div style={{ backgroundColor: "#FAFAF8", borderRadius: 12, padding: "14px 16px", border: "1px solid #EDE7DF" }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#6B3A2A", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Styling Tips</div>
                            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>{result.styling_tips}</p>
                          </div>

                          {/* Matching palette colors */}
                          {result.palette_colors_that_match?.length > 0 && (
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: "#6B3A2A", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Pairs well with</div>
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {result.palette_colors_that_match.map((h, i) => <ColorSwatch key={i} hex={h} size={32} />)}
                              </div>
                            </div>
                          )}

                          <button onClick={resetAnalyzer} style={{
                            padding: "10px 24px", backgroundColor: "#EDE7DF", color: "#555", border: "none",
                            borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                            alignSelf: "flex-start", marginTop: 4,
                          }}>
                            Analyze Another Item
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
