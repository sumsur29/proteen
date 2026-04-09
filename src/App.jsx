import { useState, useEffect, useRef, useCallback } from "react";

// ============ AURA TYPES ============
const AURAS = {
  paneer_mafia: { name: "PANEER MAFIA", emoji: "🧀", color: "#FF5733", accent: "#FF7B5C", bg: "linear-gradient(160deg, #0A0200 0%, #1A0A05 40%, #25100A 100%)", tagline: "Tu paneer ke bina jee nahi sakta", desc: "Paneer tikka, paneer bhurji, paneer paratha — tu har cheez mein paneer daal deta hai. Variety weak but protein strong. King shit.", proteinLevel: "HIGH", rizzScore: 82, percentile: 72, bollywood: "\"Paneer ke bina khaana, khaana nahi hota\" — Rocky, probably", roast: "Bro tera blood type paneer positive hai 🧀", flexLine: "Paneer is my love language" },
  soya_sigma: { name: "SOYA SIGMA", emoji: "🟤", color: "#A78BFA", accent: "#C4B5FD", bg: "linear-gradient(160deg, #08001A 0%, #120030 40%, #1A0048 100%)", tagline: "₹8 mein 26g protein. Sigma grindset.", desc: "₹8 ki soya chunks se 26g protein. Budget king. Maximum output, minimum spend. True sigma behavior.", proteinLevel: "VERY HIGH", rizzScore: 91, percentile: 94, bollywood: "\"Mogambo khush hua\" — every time soya chunks go on sale", roast: "Financial advisor + dietician combo hai tu 💰", flexLine: "₹8 mein 26g. Your whey can't relate." },
  whey_bro: { name: "WHEY BRO", emoji: "💪", color: "#60A5FA", accent: "#93C5FD", bg: "linear-gradient(160deg, #000814 0%, #001D3D 40%, #002952 100%)", tagline: "Shaker bottle is personality trait", desc: "Tera shaker bottle tere se zyada social hai. ON Gold Standard is religion. Protein sorted. Personality beyond gym? Loading...", proteinLevel: "VERY HIGH", rizzScore: 75, percentile: 81, bollywood: "\"Ek baar jo maine commitment kar di\" — to the gym, not people", roast: "Tu shaker bottle leke paida hua tha kya? 🥤", flexLine: "My shaker has more personality than you" },
  dal_delusional: { name: "DAL DELUSIONAL", emoji: "🥣", color: "#FB7185", accent: "#FDA4AF", bg: "linear-gradient(160deg, #0A0000 0%, #1A0505 40%, #2D0A0A 100%)", tagline: "\"Main toh dal khata hoon roz\" 🤡", desc: "1 bowl dal = 7g protein. You need 60g. That's 8.5 bowls PER DAY. Wake up call delivered.", proteinLevel: "LOW", rizzScore: 34, percentile: 18, bollywood: "\"Kabhi kabhi lagta hai apun hi bhagwan hai\" — bhagwan bhi 60g khata hoga", roast: "Dal se protein? Pani se petrol bhi milega? 💀", flexLine: "Main dal se survive kar raha hoon (barely)" },
  egg_carton: { name: "EGG CARTON", emoji: "🥚", color: "#FB923C", accent: "#FDBA74", bg: "linear-gradient(160deg, #0A0500 0%, #1A0E00 40%, #2D1800 100%)", tagline: "6 eggs a day. Cholesterol is a myth.", desc: "Tera fridge = eggs only. Boiled, bhurji, omelette — eggs ke 50 shades. Cholesterol? \"Wo kya hota hai bhai?\"", proteinLevel: "HIGH", rizzScore: 70, percentile: 68, bollywood: "\"Ande ka funda\" — literally tera life philosophy", roast: "Tu murgi se zyada eggs consume karta hai 🐔", flexLine: "6 eggs deep. No regrets." },
  protein_poser: { name: "PROTEIN POSER", emoji: "🤳", color: "#F472B6", accent: "#F9A8D4", bg: "linear-gradient(160deg, #0A0008 0%, #1A0012 40%, #2D001F 100%)", tagline: "Gym selfie > actual protein intake", desc: "Tu protein KE BAARE MEIN baat karta hai zyada, khaata kam. Gym selfie posted. Tracking? \"Kal se bro.\" This app is for you.", proteinLevel: "LOW", rizzScore: 55, percentile: 22, bollywood: "\"Picture abhi baaki hai mere dost\" — aur protein bhi", roast: "Tera filter game > protein game 💅", flexLine: "Gym selfie posted. Protein? Pending." },
  sattu_og: { name: "SATTU OG", emoji: "🥤", color: "#34D399", accent: "#6EE7B7", bg: "linear-gradient(160deg, #000A04 0%, #001A0D 40%, #002D16 100%)", tagline: "Bihar discovered protein before it was cool", desc: "Jab duniya whey discover kar rahi thi, tera family sattu pee raha tha. ₹5 mein 20g. No influencer marketing. Pure OG. 🙏", proteinLevel: "HIGH", rizzScore: 88, percentile: 85, bollywood: "\"Jab tak hai jaan\" — tab tak sattu peeta rahunga", roast: "Before-it-was-cool ka pioneer — sattu > whey 🏆", flexLine: "Sattu pee ke results de raha hoon since birth" },
  clean_label_queen: { name: "CLEAN LABEL QUEEN", emoji: "✨", color: "#2DD4BF", accent: "#5EEAD4", bg: "linear-gradient(160deg, #000A08 0%, #001A15 40%, #002520 100%)", tagline: "\"Ingredients padhte ho? I only eat clean.\"", desc: "Whole Truth bars, Epigamia, organic PB — premium game. No added sugar, no palm oil. \"Health is an investment, bro.\"", proteinLevel: "HIGH", rizzScore: 85, percentile: 79, bollywood: "\"The Whole Truth and nothing but the truth\"", roast: "Tu grocery mein label padh ke 45 min lagata hai 🔍", flexLine: "If I can't read the label, I don't eat it" },
};

// ============ DIET-AWARE QUESTIONS (same as before) ============
const getQuestions = (diet) => {
  const isVeg = diet === "veg", isNonveg = diet === "nonveg";
  return [
    { q: "subah uthke sabse pehle kya karta/karti hai?", emoji: "🌅", options: isVeg ? [
      { text: "phone check — fitness stories dekhunga", scores: { protein_poser: 3, clean_label_queen: 1 } }, { text: "kitchen mein paneer/tofu banana shuru", scores: { paneer_mafia: 2, sattu_og: 2 } }, { text: "sattu ghol ke pee leta hoon — OG drink", scores: { sattu_og: 3, soya_sigma: 1 } }, { text: "chai + biscuit — protein baad mein dekhenge", scores: { dal_delusional: 3, protein_poser: 1 } },
    ] : isNonveg ? [
      { text: "phone check — gym stories dekhna zaroori", scores: { protein_poser: 3, whey_bro: 1 } }, { text: "eggs crack karna — daily ritual hai", scores: { egg_carton: 3, whey_bro: 1 } }, { text: "shaker bottle dhundta hoon — pre-workout", scores: { whey_bro: 3, egg_carton: 1 } }, { text: "chai + paratha — protein? wo kya hota hai?", scores: { dal_delusional: 3, protein_poser: 1 } },
    ] : [
      { text: "phone check — gym stories dekhunga", scores: { protein_poser: 3, whey_bro: 1 } }, { text: "kitchen mein eggs ya paneer banana", scores: { paneer_mafia: 2, egg_carton: 2 } }, { text: "shaker bottle ya sattu — mood pe depend", scores: { whey_bro: 2, sattu_og: 2 } }, { text: "chai + biscuit — classic combo", scores: { dal_delusional: 3, protein_poser: 1 } },
    ]},
    { q: "restaurant mein waiter bola \"sir kya laayein?\"", emoji: "🍽️", options: isVeg ? [
      { text: "\"paneer tikka, paneer masala, EXTRA paneer\"", scores: { paneer_mafia: 3 } }, { text: "\"sabse zyada protein kismein hai bhaiya?\"", scores: { clean_label_queen: 2, soya_sigma: 2 } }, { text: "\"dal makhani + raita + paneer side\"", scores: { sattu_og: 2, paneer_mafia: 1 } }, { text: "\"jo bestseller hai wahi le aao\" — YOLO", scores: { dal_delusional: 2, protein_poser: 2 } },
    ] : isNonveg ? [
      { text: "\"chicken breast grilled, no oil, steamed\"", scores: { whey_bro: 3, clean_label_queen: 1 } }, { text: "\"butter chicken + naan\" — protein toh hai right?", scores: { dal_delusional: 2, protein_poser: 1 } }, { text: "\"egg curry + chicken tikka — double protein\"", scores: { egg_carton: 2, whey_bro: 2 } }, { text: "\"protein per dish kitna hai?\" *waiter confused*", scores: { clean_label_queen: 3 } },
    ] : [
      { text: "\"paneer tikka + egg curry bhi maybe\"", scores: { paneer_mafia: 2, egg_carton: 2 } }, { text: "\"protein per dish kitna hai?\"", scores: { clean_label_queen: 2, soya_sigma: 2 } }, { text: "\"chicken ya paneer — jo zyada protein de\"", scores: { whey_bro: 2, paneer_mafia: 2 } }, { text: "\"jo bestseller hai wahi le aao\"", scores: { dal_delusional: 2, protein_poser: 2 } },
    ]},
    { q: "bestie bola \"protein bar de na\" — tu:", emoji: "🍫", options: isVeg ? [
      { text: "\"le Whole Truth bar — clean label 🌿\"", scores: { clean_label_queen: 3 } }, { text: "\"bar? ₹150 ka 10g? soya kha ₹8 mein 26g\"", scores: { soya_sigma: 3 } }, { text: "\"ruk homemade sattu ladoo deta hoon\"", scores: { sattu_og: 3 } }, { text: "\"mere paas nahi, Swiggy pe order kar\"", scores: { protein_poser: 2, dal_delusional: 2 } },
    ] : isNonveg ? [
      { text: "\"le Whole Truth bar — clean, no junk\"", scores: { clean_label_queen: 3 } }, { text: "\"ruk mera shaker half de deta hoon\"", scores: { whey_bro: 3 } }, { text: "\"bar chod, 3 boiled eggs kha\"", scores: { egg_carton: 3 } }, { text: "\"mere paas nahi, Swiggy pe order kar\"", scores: { protein_poser: 2, dal_delusional: 2 } },
    ] : [
      { text: "\"le Whole Truth bar — clean label\"", scores: { clean_label_queen: 3 } }, { text: "\"₹150 ka 10g? soya chunks kha\"", scores: { soya_sigma: 3 } }, { text: "\"ruk mera shaker se half de deta hoon\"", scores: { whey_bro: 3 } }, { text: "\"mere paas nahi bro\"", scores: { protein_poser: 2, dal_delusional: 2 } },
    ]},
    { q: "mummy ne pucha \"dinner mein kya banana hai?\"", emoji: "👩‍🍳", options: isVeg ? [
      { text: "\"paneer. BAS. kuch bhi bana do paneer daal do\"", scores: { paneer_mafia: 3 } }, { text: "\"soya curry + chana dal extra daal do 🥺\"", scores: { soya_sigma: 2, sattu_og: 2 } }, { text: "\"main khud Greek yogurt smoothie bana lunga\"", scores: { clean_label_queen: 3 } }, { text: "\"jo bhi ban raha hai\" *cries later about protein*", scores: { dal_delusional: 2, protein_poser: 2 } },
    ] : isNonveg ? [
      { text: "\"chicken breast grilled — no oil please\"", scores: { whey_bro: 3 } }, { text: "\"egg bhurji + chicken curry — double up\"", scores: { egg_carton: 2, whey_bro: 2 } }, { text: "\"main khud bana lunga\" *makes egg bhurji*", scores: { egg_carton: 3 } }, { text: "\"jo bhi ban raha hai\" *orders biryani*", scores: { dal_delusional: 2, protein_poser: 2 } },
    ] : [
      { text: "\"paneer ya egg curry — mood pe depend\"", scores: { paneer_mafia: 2, egg_carton: 2 } }, { text: "\"dal mein chana extra daal do 🥺\"", scores: { sattu_og: 2, soya_sigma: 2 } }, { text: "\"main khud bana lunga\" *omelette time*", scores: { egg_carton: 3 } }, { text: "\"jo bhi ban raha hai\" 😔", scores: { dal_delusional: 2, protein_poser: 2 } },
    ]},
    { q: "dating profile mein kya hoga? honest bol 😏", emoji: "💘", options: isVeg ? [
      { text: "\"will cook paneer for you on first date 🧀\"", scores: { paneer_mafia: 3 } }, { text: "\"clean eating, ingredient reader 🌿\"", scores: { clean_label_queen: 3 } }, { text: "\"sattu + soya believer. low maintenance.\"", scores: { soya_sigma: 2, sattu_og: 2 } }, { text: "\"i eat healthy\" *maggi + extra cheese*", scores: { protein_poser: 3 } },
    ] : isNonveg ? [
      { text: "\"gym 5x/week, macro tracking 💪\"", scores: { whey_bro: 3 } }, { text: "\"will make egg bhurji at 2 AM 🥚\"", scores: { egg_carton: 3 } }, { text: "\"clean eating, mindful living 🌿\"", scores: { clean_label_queen: 3 } }, { text: "\"i eat healthy\" *butter chicken x naan x3*", scores: { protein_poser: 3 } },
    ] : [
      { text: "\"will cook paneer for you 🧀\"", scores: { paneer_mafia: 3 } }, { text: "\"gym 5x/week, don't waste my time\"", scores: { whey_bro: 3 } }, { text: "\"clean eating, mindful living 🌿\"", scores: { clean_label_queen: 3 } }, { text: "\"i eat healthy\" *orders maggi*", scores: { protein_poser: 3 } },
    ]},
    { q: "budget tight hai. protein kahan se?", emoji: "💸", options: isVeg ? [
      { text: "soya + sattu + sprouts — ₹500/month 🫡", scores: { soya_sigma: 3, sattu_og: 2 } }, { text: "paneer khareedna padega — no compromise", scores: { paneer_mafia: 3 } }, { text: "Whole Truth subscription — investment hai", scores: { clean_label_queen: 2, protein_poser: 1 } }, { text: "\"mehenga hai\" *₹200 daily Zomato*", scores: { dal_delusional: 3 } },
    ] : isNonveg ? [
      { text: "6 eggs = ₹42. daily. simple math.", scores: { egg_carton: 3 } }, { text: "chicken breast wholesale — meal prep", scores: { whey_bro: 3 } }, { text: "soya + eggs — budget king combo", scores: { soya_sigma: 2, egg_carton: 2 } }, { text: "\"mehenga hai\" *Swiggy biryani daily*", scores: { dal_delusional: 3 } },
    ] : [
      { text: "soya + sattu + eggs — ₹600/month", scores: { soya_sigma: 3, egg_carton: 1 } }, { text: "eggs + paneer rotation", scores: { egg_carton: 2, paneer_mafia: 2 } }, { text: "supplements se solve karunga", scores: { whey_bro: 2, clean_label_queen: 2 } }, { text: "\"mehenga hai\" *₹200 on Zomato*", scores: { dal_delusional: 3 } },
    ]},
    { q: "Pushpa style — \"main jhukunga nahi\" — kya nahi chhodega?", emoji: "🔥", options: isVeg ? [
      { text: "\"mera paneer koi nahi chheen sakta\" 🧀", scores: { paneer_mafia: 3 } }, { text: "\"mera sattu — generations se hai\"", scores: { sattu_og: 3 } }, { text: "\"mera soya — ₹8 = 26g, fight me\"", scores: { soya_sigma: 3 } }, { text: "\"mera... actually flexible hoon\" 💀", scores: { dal_delusional: 2, protein_poser: 2 } },
    ] : isNonveg ? [
      { text: "\"mera whey — fire me, still buying\"", scores: { whey_bro: 3 } }, { text: "\"mere eggs — 6/day, non-negotiable\"", scores: { egg_carton: 3 } }, { text: "\"mera chicken — meal prep is religion\"", scores: { whey_bro: 2, clean_label_queen: 2 } }, { text: "\"mera... actually flexible hoon\" 💀", scores: { dal_delusional: 2, protein_poser: 2 } },
    ] : [
      { text: "\"mera paneer — koi nahi chheen sakta\" 🧀", scores: { paneer_mafia: 3 } }, { text: "\"mere eggs — 6/day, non-negotiable\"", scores: { egg_carton: 3 } }, { text: "\"mera sattu — family mein generations se\"", scores: { sattu_og: 3 } }, { text: "\"mera... actually flexible hoon\" 💀", scores: { dal_delusional: 2, protein_poser: 2 } },
    ]},
    { q: "grocery store mein pehle kahan jaata hai?", emoji: "🛒", options: isVeg ? [
      { text: "dairy — paneer, dahi, Greek yogurt 🧀", scores: { paneer_mafia: 2, clean_label_queen: 2 } }, { text: "pulses — chana, rajma, soya, sattu", scores: { soya_sigma: 2, sattu_og: 2 } }, { text: "supplement aisle — plant protein, bars", scores: { clean_label_queen: 3 } }, { text: "snacks — \"kal se healthy\" 🤡", scores: { protein_poser: 2, dal_delusional: 2 } },
    ] : isNonveg ? [
      { text: "meat — chicken breast, fish, keema", scores: { whey_bro: 2, egg_carton: 1 } }, { text: "egg tray — 30 ka crate leke nikalta hoon 🥚", scores: { egg_carton: 3 } }, { text: "supplement aisle — whey, bars", scores: { whey_bro: 2, clean_label_queen: 2 } }, { text: "snacks — \"kal se healthy\" 🤡", scores: { protein_poser: 2, dal_delusional: 2 } },
    ] : [
      { text: "dairy — paneer, dahi, yogurt", scores: { paneer_mafia: 2, clean_label_queen: 2 } }, { text: "eggs + pulses — soya, 30-egg tray", scores: { soya_sigma: 2, egg_carton: 2 } }, { text: "supplement aisle — whey, bars", scores: { whey_bro: 2, clean_label_queen: 2 } }, { text: "snacks — \"kal se healthy\" 🤡", scores: { protein_poser: 2, dal_delusional: 2 } },
    ]},
    { q: "Stree 2 — \"wo kuch bhi kar sakti hai\" — teri protein superpower?", emoji: "⚡", options: isVeg ? [
      { text: "\"1 meal mein paneer se 40g nikaal sakta\" 🧀", scores: { paneer_mafia: 3 } }, { text: "\"₹500/month mein 60g daily\" 🟤", scores: { soya_sigma: 3 } }, { text: "\"har label 2 sec mein scan\" ✨", scores: { clean_label_queen: 3 } }, { text: "\"main toh bas survive kar raha\" 💀", scores: { dal_delusional: 3 } },
    ] : isNonveg ? [
      { text: "\"6 eggs 5 min mein done\" 🥚", scores: { egg_carton: 3 } }, { text: "\"meal prep Sunday se Friday chalta\" 💪", scores: { whey_bro: 3 } }, { text: "\"har label 2 sec mein read\" ✨", scores: { clean_label_queen: 3 } }, { text: "\"bas gym selfie le sakta hoon\" 📸", scores: { protein_poser: 3 } },
    ] : [
      { text: "\"kisi bhi food se protein nikaalunga\" 🔥", scores: { sattu_og: 2, soya_sigma: 2 } }, { text: "\"meal prep game unmatched\" 💪", scores: { whey_bro: 2, egg_carton: 2 } }, { text: "\"har label 2 sec mein scan\" ✨", scores: { clean_label_queen: 3 } }, { text: "\"bas survive kar raha hoon\" 💀", scores: { dal_delusional: 2, protein_poser: 2 } },
    ]},
    { q: "last — protein journey ka Bollywood anthem? 🎬", emoji: "🎵", options: isVeg ? [
      { text: "\"Apna Time Aayega\" — soya+sattu grind", scores: { sattu_og: 2, soya_sigma: 2 } }, { text: "\"Butter Paneer\" — wrong song right food 🧀", scores: { paneer_mafia: 3 } }, { text: "\"Zinda\" Bhaag Milkha — clean fuel 🌿", scores: { clean_label_queen: 3 } }, { text: "\"Kal Ho Na Ho\" — kal se pakka 🤡", scores: { dal_delusional: 2, protein_poser: 2 } },
    ] : isNonveg ? [
      { text: "\"Jhoome Jo Pathaan\" — full send 🔥", scores: { whey_bro: 2, egg_carton: 2 } }, { text: "\"Animal\" track — obsession max 💪", scores: { whey_bro: 3 } }, { text: "\"Apna Time Aayega\" — consistency wins", scores: { sattu_og: 2, clean_label_queen: 2 } }, { text: "\"Kal Ho Na Ho\" — kal se pakka 🤡", scores: { dal_delusional: 2, protein_poser: 2 } },
    ] : [
      { text: "\"Apna Time Aayega\" — consistent grind", scores: { sattu_og: 2, soya_sigma: 2 } }, { text: "\"Jhoome Jo Pathaan\" — full energy 🔥", scores: { whey_bro: 2, egg_carton: 2 } }, { text: "\"Butter Paneer\" — wrong song right food 🧀", scores: { paneer_mafia: 3 } }, { text: "\"Kal Ho Na Ho\" — kal se pakka 🤡", scores: { dal_delusional: 2, protein_poser: 2 } },
    ]},
  ];
};

// ============ HERO BANNER — stacking chain reaction ============
const HERO_LINES = [
  { text: "MORE PROTEIN → BETTER SKIN", color: "#FF5733" },
  { text: "BETTER SKIN → BETTER BODY", color: "#FB923C" },
  { text: "BETTER BODY → MORE RIZZ", color: "#A78BFA" },
  { text: "MORE RIZZ → BETTER DMs 😏", color: "#F472B6" },
  { text: "YOU'RE WELCOME.", color: "#34D399", big: true },
  { text: "PROTEEEN TRACKS IT ALL.", color: "#FF5733", isCta: true },
];

const HeroBanner = ({ primary, gold, cream, ft }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= HERO_LINES.length) {
      const reset = setTimeout(() => setCount(0), 2500);
      return () => clearTimeout(reset);
    }
    const delay = count === HERO_LINES.length - 1 ? 1800 : count === HERO_LINES.length - 2 ? 1600 : 1200;
    const timer = setTimeout(() => setCount(c => c + 1), delay);
    return () => clearTimeout(timer);
  }, [count]);

  const visibleLines = HERO_LINES.slice(0, Math.min(count, HERO_LINES.length));

  return (
    <div style={{
      background: `linear-gradient(135deg, ${primary}0C, ${gold}06)`,
      border: `1px solid ${primary}18`, borderRadius: 22,
      padding: "clamp(22px, 5vw, 36px) clamp(16px, 4vw, 28px)",
      marginBottom: 24, textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      {/* Stacking lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(4px, 1.2vw, 8px)", minHeight: "clamp(120px, 32vw, 180px)", justifyContent: "center" }}>
        {visibleLines.map((line, i) => {
          const isLatest = i === visibleLines.length - 1;
          const isPast = !isLatest;
          return (
            <div key={i} style={{
              fontSize: line.big
                ? "clamp(1.6rem, 6.5vw, 2.4rem)"
                : line.small
                  ? "clamp(0.65rem, 2.2vw, 0.85rem)"
                  : line.isCta
                    ? "clamp(1rem, 3.5vw, 1.4rem)"
                    : isPast
                      ? "clamp(0.7rem, 2.5vw, 0.9rem)"
                      : "clamp(1.1rem, 4.2vw, 1.6rem)",
              fontWeight: line.small ? 600 : 900, fontFamily: line.small ? "'JetBrains Mono', monospace" : ft, textTransform: "uppercase",
              color: isPast ? line.color + "40" : line.color,
              letterSpacing: line.small ? 2 : line.isCta ? 1 : "-0.02em", lineHeight: 1.2,
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: isLatest ? 1 : 0.5,
              transform: isLatest ? "scale(1)" : "scale(0.95)",
            }}>
              {line.text}
            </div>
          );
        })}
        {visibleLines.length === 0 && (
          <div style={{ fontSize: "clamp(1.1rem, 4.2vw, 1.6rem)", fontWeight: 900, fontFamily: ft, color: "rgba(255,255,255,0.08)", textTransform: "uppercase" }}>...</div>
        )}
      </div>

      {/* Rizz meter */}
      <div style={{ width: "80%", maxWidth: 300, margin: "clamp(12px, 2.5vw, 18px) auto 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "clamp(7px, 1.5vw, 9px)", color: "rgba(255,255,255,0.2)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
          <span>RIZZ LEVEL</span>
          <span>{Math.min(Math.round((count / HERO_LINES.length) * 100), 100)}%</span>
        </div>
        <div style={{ width: "100%", height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            width: `${Math.min((count / HERO_LINES.length) * 100, 100)}%`, height: "100%",
            background: `linear-gradient(90deg, ${primary}, ${visibleLines.length > 0 ? visibleLines[visibleLines.length - 1].color : primary})`,
            borderRadius: 3, transition: "width 0.5s ease",
            boxShadow: `0 0 10px ${primary}40`,
          }} />
        </div>
      </div>
    </div>
  );
};

// ============ FEATURE BANNERS ============
const FEATURES = [
  { icon: "💯", title: "PROTEIN SCORE™", desc: "One number. 0-100. Like credit score but protein. Put it in your bio. Flex on everyone.", color: "#FF5733", detail: "78", detailLabel: "YOUR SCORE" },
  { icon: "🔥", title: "ROAST MODE", desc: "App roasts you in Hinglish when you eat trash. Sharma ji disappointed hai. Friends join the roast.", color: "#FB7185", detail: "💀", detailLabel: "3 SAMOSE = 9g" },
  { icon: "📊", title: "PROTEIN WRAPPED", desc: "Weekly stats card like Spotify Wrapped. Top sources, rank vs India. Designed for your story.", color: "#D4A853", detail: "TOP 12%", detailLabel: "OF INDIA" },
  { icon: "⚔️", title: "SQUAD BATTLES", desc: "Weekly protein war with friends. Losers do a dare. Create your squad. Talk trash.", color: "#34D399", detail: "410 vs 340", detailLabel: "SOYA GANG WINS" },
  { icon: "😏", title: "RIZZ RATING", desc: "High protein = better skin = better body = more rizz. It's science* (*not really but GenZ loves it)", color: "#A78BFA", detail: "87", detailLabel: "CERTIFIED 🔥" },
  { icon: "👨‍👩‍👧", title: "PARENT MODE", desc: "Subscribe mummy. One daily tip she can't ignore. Silently turn your family healthy.", color: "#FB923C", detail: "📲", detailLabel: "MUMMY ENROLLED" },
];

const FeatureBanner = ({ f, i }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: "clamp(12px, 3vw, 24px)",
    flexDirection: i % 2 === 0 ? "row" : "row-reverse",
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 20, padding: "clamp(16px, 4vw, 26px)",
    animation: `fadeUp 0.5s ease ${i * 0.08}s both`,
  }}>
    {/* Visual side */}
    <div style={{
      width: "clamp(85px, 22vw, 120px)", height: "clamp(85px, 22vw, 120px)",
      borderRadius: 22, background: f.color + "10", border: `1.5px solid ${f.color}20`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <div style={{ fontSize: "clamp(34px, 9vw, 48px)" }}>{f.icon}</div>
      <div style={{ fontSize: "clamp(10px, 2.5vw, 14px)", color: f.color, fontWeight: 800, marginTop: 3, fontFamily: "'Anybody', Impact, sans-serif" }}>{f.detail}</div>
      <div style={{ fontSize: "clamp(6px, 1.4vw, 8px)", color: "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.5 }}>{f.detailLabel}</div>
    </div>
    {/* Text side */}
    <div style={{ flex: 1, textAlign: i % 2 === 0 ? "left" : "right" }}>
      <div style={{ fontSize: "clamp(15px, 3.8vw, 20px)", fontWeight: 900, color: f.color, fontFamily: "'Anybody', Impact, sans-serif", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>{f.title}</div>
      <div style={{ fontSize: "clamp(12px, 2.8vw, 14px)", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{f.desc}</div>
    </div>
  </div>
);

const FeatureList = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28, width: "100%" }}>
    {FEATURES.map((f, i) => <FeatureBanner key={i} f={f} i={i} />)}
  </div>
);

// Compact version for waitlist
const FeatureStrip = () => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 24 }}>
    {FEATURES.slice(0, 4).map((f, i) => (
      <div key={i} style={{ background: f.color + "0A", border: `1px solid ${f.color}15`, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, flex: "1 1 calc(50% - 4px)", minWidth: 150 }}>
        <span style={{ fontSize: 22 }}>{f.icon}</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: f.color, fontFamily: "'Anybody', Impact, sans-serif" }}>{f.title}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{f.detail} — {f.detailLabel.toLowerCase()}</div>
        </div>
      </div>
    ))}
  </div>
);

// ============ MAIN ============
export default function ProteeenQuiz() {
  const [step, setStep] = useState("landing");
  const [diet, setDiet] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({});
  const [answerHistory, setAnswerHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [name, setName] = useState("");
  const [copyMsg, setCopyMsg] = useState(null);
  const canvasRef = useRef(null);
  const questions = diet ? getQuestions(diet) : [];

  const handleAnswer = (option) => {
    setAnimating(true);
    setAnswerHistory([...answerHistory, { q: currentQ, scores: { ...scores } }]);
    const ns = { ...scores };
    for (const [k, v] of Object.entries(option.scores)) ns[k] = (ns[k] || 0) + v;
    setScores(ns);
    setTimeout(() => {
      if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
      else {
        let max = 0, top = "dal_delusional";
        for (const [k, v] of Object.entries(ns)) {
          if (diet === "veg" && (k === "egg_carton" || k === "whey_bro")) continue;
          if (v > max) { max = v; top = k; }
        }
        setResult(AURAS[top]); setStep("result");
      }
      setAnimating(false);
    }, 300);
  };

  const handleBack = () => {
    if (currentQ > 0 && answerHistory.length > 0) {
      const prev = answerHistory[answerHistory.length - 1];
      setScores(prev.scores); setCurrentQ(prev.q); setAnswerHistory(answerHistory.slice(0, -1));
    } else { setStep("diet"); setCurrentQ(0); setScores({}); setAnswerHistory([]); }
  };

  const handleWaitlist = () => { if (email?.includes("@")) setSubmitted(true); };

  const generateAndAction = useCallback(async (action) => {
    if (!result) return;
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); const w = 1080, h = 1350; c.width = w; c.height = h;
    ctx.fillStyle = "#08080C"; ctx.fillRect(0, 0, w, h);
    const g = ctx.createRadialGradient(w/2, 380, 0, w/2, 380, 500); g.addColorStop(0, result.color + "12"); g.addColorStop(1, "transparent"); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = result.color; ctx.fillRect(0, 0, w, 5);
    ctx.textAlign = "center"; ctx.font = "bold 32px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.fillText("PROTEEEN", w/2, 60);
    ctx.font = "180px serif"; ctx.fillText(result.emoji, w/2, 310);
    ctx.font = "900 76px sans-serif"; ctx.fillStyle = result.color; ctx.fillText(result.name, w/2, 440);
    ctx.font = "italic 30px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fillText(`"${result.flexLine}"`, w/2, 500);
    const barY = 570, barW = 700, barX = (w-barW)/2;
    ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.beginPath(); ctx.roundRect(barX, barY, barW, 36, 18); ctx.fill();
    ctx.fillStyle = result.color + "CC"; ctx.beginPath(); ctx.roundRect(barX, barY, (result.rizzScore/100)*barW, 36, 18); ctx.fill();
    ctx.font = "bold 16px sans-serif"; ctx.fillStyle = "#fff"; ctx.fillText(`RIZZ: ${result.rizzScore}/100`, barX + (result.rizzScore/100)*barW/2, barY + 24);
    const statsY = 660;
    [{icon:"⚡",label:"PROTEIN",val:result.proteinLevel},{icon:"🏆",label:"PERCENTILE",val:`TOP ${100-result.percentile}%`},{icon:"🔥",label:"RIZZ",val:`${result.rizzScore}/100`}].forEach((s,i) => {
      const sx = w/2 + (i-1)*280; ctx.font = "36px serif"; ctx.fillText(s.icon, sx, statsY);
      ctx.font = "bold 26px sans-serif"; ctx.fillStyle = "#fff"; ctx.fillText(s.val, sx, statsY+40);
      ctx.font = "12px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fillText(s.label, sx, statsY+60); ctx.fillStyle = result.color;
    });
    ctx.fillStyle = result.color + "0A"; ctx.beginPath(); ctx.roundRect(120, 790, w-240, 80, 14); ctx.fill();
    ctx.font = "24px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fillText("🔥 " + result.roast.substring(0, 50), w/2, 840);
    ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(200, 920); ctx.lineTo(w-200, 920); ctx.stroke();
    ctx.font = "20px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fillText("protein check ✓  rizz check ✓  aura check ✓", w/2, 970);
    ctx.fillStyle = result.color; ctx.beginPath(); ctx.roundRect(w/2-200, 1060, 400, 68, 18); ctx.fill();
    ctx.font = "bold 24px sans-serif"; ctx.fillStyle = "#fff"; ctx.fillText("FIND YOUR AURA →", w/2, 1102);
    ctx.font = "15px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.1)"; ctx.fillText("proteeen.app • coming soon", w/2, 1230);
    ctx.fillStyle = result.color; ctx.fillRect(0, h-5, w, 5);
    if (action === "copy") {
      try { const blob = await new Promise(r => c.toBlob(r, "image/png")); await navigator.clipboard.write([new ClipboardItem({"image/png":blob})]); setCopyMsg("Copied! Paste anywhere 📋"); }
      catch { doDownload(c); setCopyMsg("Downloaded! 📥"); }
    } else { doDownload(c); setCopyMsg("Downloaded! 📥"); }
    setTimeout(() => setCopyMsg(null), 3000);
  }, [result, diet]);

  function doDownload(canvas) { const l = document.createElement("a"); l.download = `proteeen-${result.name.toLowerCase().replace(/\s/g,"-")}.png`; l.href = canvas.toDataURL("image/png"); l.click(); }

  const P = { primary: "#FF5733", gold: "#D4A853", bg: "#08080C", cream: "#F5F0EB" };
  const ft = "'Anybody', Impact, sans-serif", fb = "'DM Sans', sans-serif", fm = "'JetBrains Mono', monospace";
  const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:wght@400;700&family=Anybody:wght@400;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}body{background:${P.bg}}@keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}@keyframes slideIn{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}@keyframes popIn{from{opacity:0;transform:scale(.3) rotate(-10deg)}to{opacity:1;transform:scale(1) rotate(0)}}@keyframes glitch{0%,100%{text-shadow:2px 0 ${P.primary},-2px 0 ${P.gold}}25%{text-shadow:-2px 0 ${P.primary},2px 0 ${P.gold}}50%{text-shadow:2px 2px ${P.primary},-2px -2px ${P.gold}}75%{text-shadow:-2px 2px ${P.primary},2px -2px ${P.gold}}}@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}button{cursor:pointer;font-family:inherit}button:active{transform:scale(.97)!important}::-webkit-scrollbar{display:none}`;
  const pg = { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: fb, background: P.bg, color: "#fff", position: "relative", overflow: "hidden" };

  // LANDING
  if (step === "landing") return (
    <div style={{ ...pg, justifyContent: "flex-start", paddingTop: 50 }}><style>{css}</style>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, background: P.primary, padding: "7px 0", overflow: "hidden", zIndex: 10 }}>
        <div style={{ display: "flex", animation: "marquee 25s linear infinite", whiteSpace: "nowrap" }}>
          {Array(10).fill("PROTEEEN • COMING SOON • INDIA KA PROTEIN SCORE • ").map((t, i) => <span key={i} style={{ fontSize: 11, fontWeight: 900, color: "#fff", fontFamily: ft, letterSpacing: 2 }}>{t}</span>)}
        </div>
      </div>
      <div style={{ textAlign: "center", maxWidth: 560, zIndex: 2, animation: "fadeUp 0.8s ease", padding: "0 4px", width: "100%" }}>
        <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
          <h1 style={{ fontSize: "clamp(3.5rem,14vw,6.5rem)", fontFamily: ft, fontWeight: 900, lineHeight: .85, letterSpacing: "-0.03em" }}>
            <span style={{ color: P.cream }}>PROTE</span><span style={{ color: "#fff", animation: "glitch 3s infinite" }}>EEN</span>
          </h1>
          <div style={{ position: "absolute", top: -6, right: -14, background: P.gold, color: "#000", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 4, transform: "rotate(12deg)", fontFamily: fm, letterSpacing: 1 }}>BETA</div>
        </div>
        <p style={{ fontSize: "clamp(.95rem,3vw,1.15rem)", color: P.cream + "70", marginBottom: 4 }}>protein check ✓ rizz check ✓ aura check ✓</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.12)", fontFamily: fm, marginBottom: 24 }}>not a health app. a status signal. 💅</p>

        {/* Hero banner — chain reaction cycling */}
        <HeroBanner primary={P.primary} gold={P.gold} cream={P.cream} ft={ft} />

        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1, marginBottom: 14 }}>coming soon • take the quiz • share your score • join the waitlist</p>

        {/* Primary CTA — above the fold */}
        <button onClick={() => setStep("diet")} style={{ background: `linear-gradient(135deg, ${P.primary}, #FF7B5C)`, color: "#fff", border: "none", borderRadius: 16, padding: "18px 48px", fontSize: "clamp(1rem,4vw,1.15rem)", fontWeight: 900, fontFamily: ft, textTransform: "uppercase", letterSpacing: 1, boxShadow: `0 8px 40px ${P.primary}30`, animation: "pulse 2.5s infinite", marginBottom: 8 }}>FIND MY PROTEIN AURA →</button>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.1)", fontFamily: fm, marginBottom: 32 }}>30 sec • 10 questions • 1 truth bomb 💣</p>

        {/* What's in the app */}
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", fontFamily: fm, letterSpacing: 3, marginBottom: 16, textTransform: "uppercase" }}>WHAT'S IN THE APP</div>

        {/* Feature Banners */}
        <FeatureList />

        <div style={{ background: P.primary + "0A", border: `1px solid ${P.primary}18`, borderRadius: 14, padding: "12px 20px", marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>🚀</span>
          <span style={{ fontSize: 13, color: P.cream + "90" }}><strong style={{ color: P.primary }}>Coming soon</strong> — quiz le, waitlist join kar</span>
        </div>
        <br />
        {/* Bottom CTA — smaller, outline style */}
        <button onClick={() => setStep("diet")} style={{ background: "transparent", color: P.primary, border: `2px solid ${P.primary}`, borderRadius: 14, padding: "14px 36px", fontSize: "clamp(0.85rem,3.2vw,1rem)", fontWeight: 800, fontFamily: ft, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>TAKE THE QUIZ →</button>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.1)", marginTop: 8, fontFamily: fm, marginBottom: 40 }}>find your protein aura in 30 seconds</p>
      </div>
    </div>
  );

  // DIET
  if (step === "diet") return (
    <div style={pg}><style>{css}</style>
      <div style={{ textAlign: "center", maxWidth: 420, animation: "fadeUp 0.5s ease", zIndex: 2 }}>
        <button onClick={() => setStep("landing")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 6, margin: "0 auto 20px" }}>← back</button>
        <div style={{ fontSize: 11, color: P.primary, fontFamily: fm, letterSpacing: 3, marginBottom: 20 }}>STEP 1 / 2</div>
        <h2 style={{ fontSize: "clamp(2rem,7vw,2.8rem)", fontWeight: 900, fontFamily: ft, marginBottom: 6, textTransform: "uppercase", lineHeight: .95, color: P.cream }}>PEHLE YE BATA</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", marginBottom: 32 }}>questions teri diet ke hisaab se aayenge</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { key: "veg", emoji: "🟢", label: "VEGETARIAN", sub: "paneer, dal, soya, dahi", color: "#34D399" },
            { key: "nonveg", emoji: "🔴", label: "NON-VEG", sub: "chicken, eggs, fish + everything above", color: P.primary },
            { key: "all", emoji: "🍳", label: "EGGITARIAN / FLEX", sub: "eggs yes, chicken depends, vibes matter", color: P.gold },
          ].map((d, i) => (
            <button key={d.key} onClick={() => { setDiet(d.key); setStep("quiz"); setCurrentQ(0); setScores({}); setAnswerHistory([]); }} style={{ background: d.color + "08", border: `2px solid ${d.color}20`, borderRadius: 16, padding: "20px 24px", textAlign: "left", display: "flex", alignItems: "center", gap: 18, transition: "all 0.2s", animation: `slideIn 0.4s ease ${i*.1}s both` }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = d.color + "50"; e.currentTarget.style.transform = "translateX(4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = d.color + "20"; e.currentTarget.style.transform = "translateX(0)"; }}>
              <span style={{ fontSize: 36 }}>{d.emoji}</span>
              <div><div style={{ fontSize: 16, fontWeight: 900, color: d.color, fontFamily: ft, letterSpacing: 1 }}>{d.label}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{d.sub}</div></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // QUIZ
  if (step === "quiz") {
    const q = questions[currentQ], progress = ((currentQ+1)/questions.length)*100;
    return (
      <div style={{ ...pg, justifyContent: "flex-start", paddingTop: 40 }}><style>{css}</style>
        <div style={{ width: "100%", maxWidth: 480, zIndex: 2 }}>
          <button onClick={handleBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 13, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>← {currentQ === 0 ? "home" : "back"}</button>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontFamily: fm, color: "rgba(255,255,255,0.2)" }}>{currentQ+1}/{questions.length}</span>
            <span style={{ fontSize: 11, fontFamily: fm, color: P.primary, fontWeight: 700 }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,0.04)", borderRadius: 2, marginBottom: 36 }}>
            <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${P.primary}, ${P.gold})`, borderRadius: 2, transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)", boxShadow: `0 0 16px ${P.primary}40` }} />
          </div>
          <div key={currentQ} style={{ animation: animating ? "none" : "fadeUp 0.4s ease" }}>
            <span style={{ fontSize: 48, display: "block", marginBottom: 16 }}>{q.emoji}</span>
            <h2 style={{ fontSize: "clamp(1.15rem,4vw,1.5rem)", fontWeight: 700, marginBottom: 28, lineHeight: 1.45, color: P.cream }}>{q.q}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(opt)} style={{ background: "rgba(255,255,255,0.02)", border: "1.5px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px 20px", textAlign: "left", color: "rgba(255,255,255,0.85)", fontSize: 14, fontFamily: fb, lineHeight: 1.55, transition: "all 0.2s", animation: `slideIn 0.3s ease ${i*.07}s both` }}
                onMouseEnter={e => { e.currentTarget.style.background = P.primary + "0A"; e.currentTarget.style.borderColor = P.primary + "30"; e.currentTarget.style.transform = "translateX(6px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateX(0)"; }}>{opt.text}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RESULT
  if (step === "result" && result) return (
    <div style={{ ...pg, background: result.bg, justifyContent: "flex-start", paddingTop: 30, paddingBottom: 40 }}><style>{css}</style>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div style={{ textAlign: "center", maxWidth: 440, zIndex: 2, animation: "fadeUp 0.6s ease" }}>
        <div style={{ fontSize: 11, fontFamily: fm, color: "rgba(255,255,255,0.2)", letterSpacing: 3, marginBottom: 16 }}>YOUR PROTEIN AURA IS</div>
        <div style={{ fontSize: 80, marginBottom: 8, animation: "popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both", filter: `drop-shadow(0 0 50px ${result.color}40)` }}>{result.emoji}</div>
        <h1 style={{ fontSize: "clamp(2rem,8vw,3rem)", fontWeight: 900, fontFamily: ft, color: result.color, letterSpacing: "-0.02em", marginBottom: 4, textShadow: `0 0 60px ${result.color}25`, textTransform: "uppercase" }}>{result.name}</h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginBottom: 6, fontStyle: "italic", fontWeight: 600 }}>"{result.flexLine}"</p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>{result.tagline}</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 18, justifyContent: "center" }}>
          {[{ label: "PROTEIN", value: result.proteinLevel, color: result.proteinLevel === "VERY HIGH" ? "#34D399" : result.proteinLevel === "HIGH" ? P.gold : "#FB7185" }, { label: "RIZZ", value: `${result.rizzScore}/100`, color: result.color }, { label: "RANK", value: `TOP ${100-result.percentile}%`, color: "#fff" }].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "12px 14px", textAlign: "center", flex: 1, border: "1px solid rgba(255,255,255,0.06)", animation: `fadeUp 0.4s ease ${.3+i*.1}s both` }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: fm, marginBottom: 4, letterSpacing: 1 }}>{s.label}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: s.color, fontFamily: ft }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: fm, marginBottom: 4 }}><span>RIZZ METER</span><span>{result.rizzScore}/100</span></div>
          <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${result.rizzScore}%`, height: "100%", background: `linear-gradient(90deg, ${result.color}, ${result.accent})`, borderRadius: 4, transition: "width 1s ease", boxShadow: `0 0 12px ${result.color}50` }} />
          </div>
        </div>
        <div style={{ background: result.color + "08", border: `1px solid ${result.color}15`, borderRadius: 14, padding: "14px 18px", marginBottom: 14, borderLeft: `3px solid ${result.color}50`, textAlign: "left" }}>
          <div style={{ fontSize: 9, color: result.color, fontFamily: fm, letterSpacing: 1, marginBottom: 6, fontWeight: 700 }}>🔥 ROAST</div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{result.roast}</p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "14px 18px", marginBottom: 14, textAlign: "left" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{result.desc}</p>
        </div>
        <div style={{ background: result.color + "06", borderRadius: 10, padding: "12px 16px", marginBottom: 24, borderLeft: `3px solid ${result.color}25` }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontStyle: "italic", lineHeight: 1.5 }}>{result.bollywood}</p>
        </div>
        {copyMsg && <div style={{ background: "#34D399", color: "#000", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 700, marginBottom: 12, animation: "fadeUp 0.3s ease" }}>{copyMsg}</div>}
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button onClick={() => generateAndAction("copy")} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 15, color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>📋 Copy Card</button>
          <button onClick={() => generateAndAction("download")} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 15, color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>📥 Save Card</button>
        </div>
        <button onClick={() => setStep("waitlist")} style={{ width: "100%", background: `linear-gradient(135deg, ${result.color}, ${result.accent})`, border: "none", borderRadius: 14, padding: 16, color: "#fff", fontSize: 15, fontWeight: 900, fontFamily: ft, letterSpacing: 1, textTransform: "uppercase", boxShadow: `0 4px 30px ${result.color}30`, marginBottom: 12 }}>JOIN PROTEEEN WAITLIST →</button>
        <button onClick={() => { setCurrentQ(0); setScores({}); setAnswerHistory([]); setStep("diet"); setCopyMsg(null); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.15)", fontSize: 12, fontFamily: fm, padding: 8 }}>retake quiz 🔄</button>
      </div>
    </div>
  );

  // WAITLIST
  if (step === "waitlist") return (
    <div style={pg}><style>{css}</style>
      <div style={{ textAlign: "center", maxWidth: 480, animation: "fadeUp 0.5s ease", zIndex: 2, padding: "0 4px" }}>
        {submitted ? (<>
          <div style={{ fontSize: 64, marginBottom: 16, animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>🎉</div>
          <h2 style={{ fontSize: "clamp(2rem,7vw,2.8rem)", fontWeight: 900, fontFamily: ft, color: P.primary, marginBottom: 6, textTransform: "uppercase" }}>YOU'RE IN</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", marginBottom: 28, lineHeight: 1.7 }}>We'll hit you up when PROTEEEN drops.<br/>{result && <>Your Aura: <span style={{ color: result.color, fontWeight: 700 }}>{result.emoji} {result.name}</span></>}</p>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", fontFamily: fm, letterSpacing: 2, marginBottom: 14 }}>WHAT'S COMING</div>
          <FeatureStrip />
          {result && <button onClick={() => generateAndAction("download")} style={{ width: "100%", background: `linear-gradient(135deg, ${P.primary}, #FF7B5C)`, color: "#fff", border: "none", borderRadius: 14, padding: 16, fontSize: 15, fontWeight: 900, fontFamily: ft, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>📥 DOWNLOAD & SHARE MY AURA</button>}
          {copyMsg && <div style={{ background: "#34D399", color: "#000", borderRadius: 10, padding: 10, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{copyMsg}</div>}
          <div style={{ display: "flex", gap: 8 }}>
            <a href="https://t.me/protein_hi_protein" target="_blank" rel="noopener noreferrer" style={{ flex: 1, background: "rgba(0,136,204,0.06)", border: "1px solid rgba(0,136,204,0.12)", borderRadius: 12, padding: 12, textDecoration: "none", textAlign: "center", color: "#0088cc", fontSize: 13, fontWeight: 700 }}>✈️ Telegram</a>
            <a href="https://protein-tracker-one.vercel.app" target="_blank" rel="noopener noreferrer" style={{ flex: 1, background: P.primary + "08", border: `1px solid ${P.primary}12`, borderRadius: 12, padding: 12, textDecoration: "none", textAlign: "center", color: P.primary, fontSize: 13, fontWeight: 700 }}>📱 Tracker</a>
          </div>
        </>) : (<>
          <h1 style={{ fontSize: "clamp(2.5rem,10vw,4rem)", fontFamily: ft, fontWeight: 900, marginBottom: 6 }}><span style={{ color: P.cream }}>PROTE</span><span style={{ animation: "glitch 3s infinite" }}>EEN</span></h1>
          <h2 style={{ fontSize: "clamp(1.1rem,4vw,1.4rem)", fontWeight: 800, fontFamily: ft, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1, color: P.cream + "80" }}>JOIN THE WAITLIST</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 28, lineHeight: 1.6 }}>{result ? `Your aura: ${result.emoji} ${result.name}. ` : ""}Be first when it drops.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="your name" style={{ background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "15px 18px", color: "#fff", fontSize: 15, outline: "none", fontFamily: fb, transition: "border-color 0.2s" }} onFocus={e => e.target.style.borderColor = P.primary + "40"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.06)"} />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your email" type="email" style={{ background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "15px 18px", color: "#fff", fontSize: 15, outline: "none", fontFamily: fb, transition: "border-color 0.2s" }} onFocus={e => e.target.style.borderColor = P.primary + "40"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.06)"} />
            <button onClick={handleWaitlist} style={{ background: `linear-gradient(135deg, ${P.primary}, #FF7B5C)`, color: "#fff", border: "none", borderRadius: 14, padding: 16, fontSize: 15, fontWeight: 900, fontFamily: ft, textTransform: "uppercase", letterSpacing: 1, opacity: (!email || !email.includes("@")) ? .4 : 1, transition: "opacity 0.2s" }}>GET EARLY ACCESS →</button>
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.1)", fontFamily: fm }}>no spam. just protein. pinky promise 🤙</p>
        </>)}
      </div>
    </div>
  );
  return null;
}
