import { useState, useRef, useCallback } from "react";

// ============ AURA TYPES ============
const AURAS = {
  paneer_mafia: {
    name: "PANEER MAFIA", emoji: "🧀", color: "#FF6B6B", accent: "#FF8E8E",
    bg: "linear-gradient(160deg, #0A0000 0%, #1A0808 40%, #250F0F 100%)",
    tagline: "Tu paneer ke bina jee nahi sakta",
    desc: "Paneer tikka, paneer bhurji, paneer paratha — tu har cheez mein paneer daal deta hai. Variety weak but protein strong. King shit.",
    proteinLevel: "HIGH", rizzScore: 82, percentile: 72,
    bollywood: "\"Paneer ke bina khaana, khaana nahi hota\" — Rocky, probably",
    roast: "Bro tera blood type paneer positive hai 🧀",
    flexLine: "Paneer is my love language"
  },
  soya_sigma: {
    name: "SOYA SIGMA", emoji: "🟤", color: "#A78BFA", accent: "#C4B5FD",
    bg: "linear-gradient(160deg, #08001A 0%, #120030 40%, #1A0048 100%)",
    tagline: "₹8 mein 26g protein. Sigma grindset.",
    desc: "₹8 ki soya chunks se 26g protein. Budget king. Maximum output, minimum spend. True sigma behavior.",
    proteinLevel: "VERY HIGH", rizzScore: 91, percentile: 94,
    bollywood: "\"Mogambo khush hua\" — every time soya chunks go on sale",
    roast: "Financial advisor + dietician combo hai tu 💰",
    flexLine: "₹8 mein 26g. Your whey can't relate."
  },
  whey_bro: {
    name: "WHEY BRO", emoji: "💪", color: "#60A5FA", accent: "#93C5FD",
    bg: "linear-gradient(160deg, #000814 0%, #001D3D 40%, #002952 100%)",
    tagline: "Shaker bottle is personality trait",
    desc: "Tera shaker bottle tere se zyada social hai. ON Gold Standard is religion. Protein sorted. Personality beyond gym? Loading...",
    proteinLevel: "VERY HIGH", rizzScore: 75, percentile: 81,
    bollywood: "\"Ek baar jo maine commitment kar di\" — to the gym, not people",
    roast: "Tu shaker bottle leke paida hua tha kya? 🥤",
    flexLine: "My shaker has more personality than you"
  },
  dal_delusional: {
    name: "DAL DELUSIONAL", emoji: "🥣", color: "#FB7185", accent: "#FDA4AF",
    bg: "linear-gradient(160deg, #0A0000 0%, #1A0505 40%, #2D0A0A 100%)",
    tagline: "\"Main toh dal khata hoon roz\" 🤡",
    desc: "1 bowl dal = 7g protein. You need 60g. That's 8.5 bowls PER DAY. Wake up call delivered.",
    proteinLevel: "LOW", rizzScore: 34, percentile: 18,
    bollywood: "\"Kabhi kabhi lagta hai apun hi bhagwan hai\" — bhagwan bhi 60g khata hoga",
    roast: "Dal se protein? Pani se petrol bhi milega? 💀",
    flexLine: "Main dal se survive kar raha hoon (barely)"
  },
  egg_carton: {
    name: "EGG CARTON", emoji: "🥚", color: "#FB923C", accent: "#FDBA74",
    bg: "linear-gradient(160deg, #0A0500 0%, #1A0E00 40%, #2D1800 100%)",
    tagline: "6 eggs a day. Cholesterol is a myth.",
    desc: "Tera fridge = eggs only. Boiled, bhurji, omelette — eggs ke 50 shades. Cholesterol? \"Wo kya hota hai bhai?\"",
    proteinLevel: "HIGH", rizzScore: 70, percentile: 68,
    bollywood: "\"Ande ka funda\" — literally tera life philosophy",
    roast: "Tu murgi se zyada eggs consume karta hai 🐔",
    flexLine: "6 eggs deep. No regrets."
  },
  protein_poser: {
    name: "PROTEIN POSER", emoji: "🤳", color: "#F472B6", accent: "#F9A8D4",
    bg: "linear-gradient(160deg, #0A0008 0%, #1A0012 40%, #2D001F 100%)",
    tagline: "Gym selfie > actual protein intake",
    desc: "Tu protein KE BAARE MEIN baat karta hai zyada, khaata kam. Gym selfie posted. Tracking? \"Kal se bro.\" This app is for you.",
    proteinLevel: "LOW", rizzScore: 55, percentile: 22,
    bollywood: "\"Picture abhi baaki hai mere dost\" — aur protein bhi",
    roast: "Tera filter game > protein game 💅",
    flexLine: "Gym selfie posted. Protein? Pending."
  },
  sattu_og: {
    name: "SATTU OG", emoji: "🥤", color: "#34D399", accent: "#6EE7B7",
    bg: "linear-gradient(160deg, #000A04 0%, #001A0D 40%, #002D16 100%)",
    tagline: "Bihar discovered protein before it was cool",
    desc: "Jab duniya whey discover kar rahi thi, tera family sattu pee raha tha. ₹5 mein 20g. No influencer marketing. Pure OG. 🙏",
    proteinLevel: "HIGH", rizzScore: 88, percentile: 85,
    bollywood: "\"Jab tak hai jaan\" — tab tak sattu peeta rahunga",
    roast: "Before-it-was-cool ka pioneer — sattu > whey 🏆",
    flexLine: "Sattu pee ke results de raha hoon since birth"
  },
  clean_label_queen: {
    name: "CLEAN LABEL QUEEN", emoji: "✨", color: "#2DD4BF", accent: "#5EEAD4",
    bg: "linear-gradient(160deg, #000A08 0%, #001A15 40%, #002520 100%)",
    tagline: "\"Ingredients padhte ho? I only eat clean.\"",
    desc: "Whole Truth bars, Epigamia, organic PB — premium game. No added sugar, no palm oil. \"Health is an investment, bro.\"",
    proteinLevel: "HIGH", rizzScore: 85, percentile: 79,
    bollywood: "\"The Whole Truth and nothing but the truth\"",
    roast: "Tu grocery mein label padh ke 45 min lagata hai 🔍",
    flexLine: "If I can't read the label, I don't eat it"
  },
};

// ============ DIET-AWARE QUESTIONS ============
const getQuestions = (diet) => {
  const isVeg = diet === "veg";
  const isNonveg = diet === "nonveg";
  return [
    { q: "subah uthke sabse pehle kya karta/karti hai?", emoji: "🌅",
      options: isVeg ? [
        { text: "phone check — fitness stories dekhunga", scores: { protein_poser: 3, clean_label_queen: 1 } },
        { text: "kitchen mein paneer/tofu banana shuru", scores: { paneer_mafia: 2, sattu_og: 2 } },
        { text: "sattu ghol ke pee leta hoon — OG drink", scores: { sattu_og: 3, soya_sigma: 1 } },
        { text: "chai + biscuit — protein baad mein dekhenge", scores: { dal_delusional: 3, protein_poser: 1 } },
      ] : isNonveg ? [
        { text: "phone check — gym stories dekhna zaroori", scores: { protein_poser: 3, whey_bro: 1 } },
        { text: "eggs crack karna — daily ritual hai", scores: { egg_carton: 3, whey_bro: 1 } },
        { text: "shaker bottle dhundta hoon — pre-workout", scores: { whey_bro: 3, egg_carton: 1 } },
        { text: "chai + paratha — protein? wo kya hota hai?", scores: { dal_delusional: 3, protein_poser: 1 } },
      ] : [
        { text: "phone check — gym stories dekhunga", scores: { protein_poser: 3, whey_bro: 1 } },
        { text: "kitchen mein eggs ya paneer banana", scores: { paneer_mafia: 2, egg_carton: 2 } },
        { text: "shaker bottle ya sattu — mood pe depend", scores: { whey_bro: 2, sattu_og: 2 } },
        { text: "chai + biscuit — classic combo", scores: { dal_delusional: 3, protein_poser: 1 } },
      ],
    },
    { q: "restaurant mein waiter bola \"sir kya laayein?\"", emoji: "🍽️",
      options: isVeg ? [
        { text: "\"paneer tikka, paneer masala, EXTRA paneer\"", scores: { paneer_mafia: 3 } },
        { text: "\"sabse zyada protein kismein hai bhaiya?\"", scores: { clean_label_queen: 2, soya_sigma: 2 } },
        { text: "\"dal makhani + raita + paneer side\"", scores: { sattu_og: 2, paneer_mafia: 1 } },
        { text: "\"jo bestseller hai wahi le aao\" — YOLO", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : isNonveg ? [
        { text: "\"chicken breast grilled, no oil, steamed\"", scores: { whey_bro: 3, clean_label_queen: 1 } },
        { text: "\"butter chicken + naan\" — protein toh hai right?", scores: { dal_delusional: 2, protein_poser: 1 } },
        { text: "\"egg curry + chicken tikka — double protein\"", scores: { egg_carton: 2, whey_bro: 2 } },
        { text: "\"protein per dish kitna hai?\" *waiter confused*", scores: { clean_label_queen: 3 } },
      ] : [
        { text: "\"paneer tikka + egg curry bhi maybe\"", scores: { paneer_mafia: 2, egg_carton: 2 } },
        { text: "\"protein per dish kitna hai?\"", scores: { clean_label_queen: 2, soya_sigma: 2 } },
        { text: "\"chicken ya paneer — jo zyada protein de\"", scores: { whey_bro: 2, paneer_mafia: 2 } },
        { text: "\"jo bestseller hai wahi le aao\"", scores: { dal_delusional: 2, protein_poser: 2 } },
      ],
    },
    { q: "bestie bola \"protein bar de na\" — tu:", emoji: "🍫",
      options: isVeg ? [
        { text: "\"le Whole Truth bar — clean label 🌿\"", scores: { clean_label_queen: 3 } },
        { text: "\"bar? ₹150 ka 10g? soya kha ₹8 mein 26g\"", scores: { soya_sigma: 3 } },
        { text: "\"ruk homemade sattu ladoo deta hoon\"", scores: { sattu_og: 3 } },
        { text: "\"mere paas nahi, Swiggy pe order kar\"", scores: { protein_poser: 2, dal_delusional: 2 } },
      ] : isNonveg ? [
        { text: "\"le Whole Truth bar — clean, no junk\"", scores: { clean_label_queen: 3 } },
        { text: "\"ruk mera shaker half de deta hoon\"", scores: { whey_bro: 3 } },
        { text: "\"bar chod, 3 boiled eggs kha\"", scores: { egg_carton: 3 } },
        { text: "\"mere paas nahi, Swiggy pe order kar\"", scores: { protein_poser: 2, dal_delusional: 2 } },
      ] : [
        { text: "\"le Whole Truth bar — clean label\"", scores: { clean_label_queen: 3 } },
        { text: "\"₹150 ka 10g? soya chunks kha\"", scores: { soya_sigma: 3 } },
        { text: "\"ruk mera shaker se half de deta hoon\"", scores: { whey_bro: 3 } },
        { text: "\"mere paas nahi bro\"", scores: { protein_poser: 2, dal_delusional: 2 } },
      ],
    },
    { q: "mummy ne pucha \"dinner mein kya banana hai?\"", emoji: "👩‍🍳",
      options: isVeg ? [
        { text: "\"paneer. BAS. kuch bhi bana do paneer daal do\"", scores: { paneer_mafia: 3 } },
        { text: "\"soya curry + chana dal extra daal do 🥺\"", scores: { soya_sigma: 2, sattu_og: 2 } },
        { text: "\"main khud Greek yogurt smoothie bana lunga\"", scores: { clean_label_queen: 3 } },
        { text: "\"jo bhi ban raha hai\" *cries later about protein*", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : isNonveg ? [
        { text: "\"chicken breast grilled — no oil please\"", scores: { whey_bro: 3 } },
        { text: "\"egg bhurji + chicken curry — double up\"", scores: { egg_carton: 2, whey_bro: 2 } },
        { text: "\"main khud bana lunga\" *makes egg bhurji*", scores: { egg_carton: 3 } },
        { text: "\"jo bhi ban raha hai\" *orders biryani*", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : [
        { text: "\"paneer ya egg curry — mood pe depend\"", scores: { paneer_mafia: 2, egg_carton: 2 } },
        { text: "\"dal mein chana extra daal do 🥺\"", scores: { sattu_og: 2, soya_sigma: 2 } },
        { text: "\"main khud bana lunga\" *omelette time*", scores: { egg_carton: 3 } },
        { text: "\"jo bhi ban raha hai\" 😔", scores: { dal_delusional: 2, protein_poser: 2 } },
      ],
    },
    { q: "dating profile mein kya hoga? honest bol 😏", emoji: "💘",
      options: isVeg ? [
        { text: "\"will cook paneer for you on first date 🧀\"", scores: { paneer_mafia: 3 } },
        { text: "\"clean eating, ingredient reader 🌿\"", scores: { clean_label_queen: 3 } },
        { text: "\"sattu + soya believer. low maintenance.\"", scores: { soya_sigma: 2, sattu_og: 2 } },
        { text: "\"i eat healthy\" *maggi + extra cheese*", scores: { protein_poser: 3 } },
      ] : isNonveg ? [
        { text: "\"gym 5x/week, macro tracking 💪\"", scores: { whey_bro: 3 } },
        { text: "\"will make egg bhurji at 2 AM 🥚\"", scores: { egg_carton: 3 } },
        { text: "\"clean eating, mindful living 🌿\"", scores: { clean_label_queen: 3 } },
        { text: "\"i eat healthy\" *butter chicken x naan x3*", scores: { protein_poser: 3 } },
      ] : [
        { text: "\"will cook paneer for you 🧀\"", scores: { paneer_mafia: 3 } },
        { text: "\"gym 5x/week, don't waste my time\"", scores: { whey_bro: 3 } },
        { text: "\"clean eating, mindful living 🌿\"", scores: { clean_label_queen: 3 } },
        { text: "\"i eat healthy\" *orders maggi*", scores: { protein_poser: 3 } },
      ],
    },
    { q: "budget tight hai. protein kahan se?", emoji: "💸",
      options: isVeg ? [
        { text: "soya + sattu + sprouts — ₹500/month 🫡", scores: { soya_sigma: 3, sattu_og: 2 } },
        { text: "paneer khareedna padega — no compromise", scores: { paneer_mafia: 3 } },
        { text: "Whole Truth subscription — investment hai", scores: { clean_label_queen: 2, protein_poser: 1 } },
        { text: "\"mehenga hai\" *₹200 daily Zomato*", scores: { dal_delusional: 3 } },
      ] : isNonveg ? [
        { text: "6 eggs = ₹42. daily. simple math.", scores: { egg_carton: 3 } },
        { text: "chicken breast wholesale — meal prep", scores: { whey_bro: 3 } },
        { text: "soya + eggs — budget king combo", scores: { soya_sigma: 2, egg_carton: 2 } },
        { text: "\"mehenga hai\" *Swiggy biryani daily*", scores: { dal_delusional: 3 } },
      ] : [
        { text: "soya + sattu + eggs — ₹600/month", scores: { soya_sigma: 3, egg_carton: 1 } },
        { text: "eggs + paneer rotation", scores: { egg_carton: 2, paneer_mafia: 2 } },
        { text: "supplements se solve karunga", scores: { whey_bro: 2, clean_label_queen: 2 } },
        { text: "\"mehenga hai\" *₹200 on Zomato*", scores: { dal_delusional: 3 } },
      ],
    },
    { q: "Pushpa style — \"main jhukunga nahi\" — kya nahi chhodega?", emoji: "🔥",
      options: isVeg ? [
        { text: "\"mera paneer koi nahi chheen sakta\" 🧀", scores: { paneer_mafia: 3 } },
        { text: "\"mera sattu — generations se hai\"", scores: { sattu_og: 3 } },
        { text: "\"mera soya — ₹8 = 26g, fight me\"", scores: { soya_sigma: 3 } },
        { text: "\"mera... actually flexible hoon\" 💀", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : isNonveg ? [
        { text: "\"mera whey — fire me, still buying\"", scores: { whey_bro: 3 } },
        { text: "\"mere eggs — 6/day, non-negotiable\"", scores: { egg_carton: 3 } },
        { text: "\"mera chicken — meal prep is religion\"", scores: { whey_bro: 2, clean_label_queen: 2 } },
        { text: "\"mera... actually flexible hoon\" 💀", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : [
        { text: "\"mera paneer — koi nahi chheen sakta\" 🧀", scores: { paneer_mafia: 3 } },
        { text: "\"mere eggs — 6/day, non-negotiable\"", scores: { egg_carton: 3 } },
        { text: "\"mera sattu — family mein generations se\"", scores: { sattu_og: 3 } },
        { text: "\"mera... actually flexible hoon\" 💀", scores: { dal_delusional: 2, protein_poser: 2 } },
      ],
    },
    { q: "grocery store mein pehle kahan jaata hai?", emoji: "🛒",
      options: isVeg ? [
        { text: "dairy — paneer, dahi, Greek yogurt 🧀", scores: { paneer_mafia: 2, clean_label_queen: 2 } },
        { text: "pulses — chana, rajma, soya, sattu", scores: { soya_sigma: 2, sattu_og: 2 } },
        { text: "supplement aisle — plant protein, bars", scores: { clean_label_queen: 3 } },
        { text: "snacks — \"kal se healthy\" 🤡", scores: { protein_poser: 2, dal_delusional: 2 } },
      ] : isNonveg ? [
        { text: "meat — chicken breast, fish, keema", scores: { whey_bro: 2, egg_carton: 1 } },
        { text: "egg tray — 30 ka crate leke nikalta hoon 🥚", scores: { egg_carton: 3 } },
        { text: "supplement aisle — whey, bars", scores: { whey_bro: 2, clean_label_queen: 2 } },
        { text: "snacks — \"kal se healthy\" 🤡", scores: { protein_poser: 2, dal_delusional: 2 } },
      ] : [
        { text: "dairy — paneer, dahi, yogurt", scores: { paneer_mafia: 2, clean_label_queen: 2 } },
        { text: "eggs + pulses — soya, 30-egg tray", scores: { soya_sigma: 2, egg_carton: 2 } },
        { text: "supplement aisle — whey, bars", scores: { whey_bro: 2, clean_label_queen: 2 } },
        { text: "snacks — \"kal se healthy\" 🤡", scores: { protein_poser: 2, dal_delusional: 2 } },
      ],
    },
    { q: "Stree 2 — \"wo kuch bhi kar sakti hai\" — teri protein superpower?", emoji: "⚡",
      options: isVeg ? [
        { text: "\"1 meal mein paneer se 40g nikaal sakta\" 🧀", scores: { paneer_mafia: 3 } },
        { text: "\"₹500/month mein 60g daily\" 🟤", scores: { soya_sigma: 3 } },
        { text: "\"har label 2 sec mein scan\" ✨", scores: { clean_label_queen: 3 } },
        { text: "\"main toh bas survive kar raha\" 💀", scores: { dal_delusional: 3 } },
      ] : isNonveg ? [
        { text: "\"6 eggs 5 min mein done\" 🥚", scores: { egg_carton: 3 } },
        { text: "\"meal prep Sunday se Friday chalta\" 💪", scores: { whey_bro: 3 } },
        { text: "\"har label 2 sec mein read\" ✨", scores: { clean_label_queen: 3 } },
        { text: "\"bas gym selfie le sakta hoon\" 📸", scores: { protein_poser: 3 } },
      ] : [
        { text: "\"kisi bhi food se protein nikaalunga\" 🔥", scores: { sattu_og: 2, soya_sigma: 2 } },
        { text: "\"meal prep game unmatched\" 💪", scores: { whey_bro: 2, egg_carton: 2 } },
        { text: "\"har label 2 sec mein scan\" ✨", scores: { clean_label_queen: 3 } },
        { text: "\"bas survive kar raha hoon\" 💀", scores: { dal_delusional: 2, protein_poser: 2 } },
      ],
    },
    { q: "last — protein journey ka Bollywood anthem? 🎬", emoji: "🎵",
      options: isVeg ? [
        { text: "\"Apna Time Aayega\" — soya+sattu grind", scores: { sattu_og: 2, soya_sigma: 2 } },
        { text: "\"Butter Paneer\" — wrong song right food 🧀", scores: { paneer_mafia: 3 } },
        { text: "\"Zinda\" Bhaag Milkha — clean fuel 🌿", scores: { clean_label_queen: 3 } },
        { text: "\"Kal Ho Na Ho\" — kal se pakka 🤡", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : isNonveg ? [
        { text: "\"Jhoome Jo Pathaan\" — full send 🔥", scores: { whey_bro: 2, egg_carton: 2 } },
        { text: "\"Animal\" track — obsession max 💪", scores: { whey_bro: 3 } },
        { text: "\"Apna Time Aayega\" — consistency wins", scores: { sattu_og: 2, clean_label_queen: 2 } },
        { text: "\"Kal Ho Na Ho\" — kal se pakka 🤡", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : [
        { text: "\"Apna Time Aayega\" — consistent grind", scores: { sattu_og: 2, soya_sigma: 2 } },
        { text: "\"Jhoome Jo Pathaan\" — full energy 🔥", scores: { whey_bro: 2, egg_carton: 2 } },
        { text: "\"Butter Paneer\" — wrong song right food 🧀", scores: { paneer_mafia: 3 } },
        { text: "\"Kal Ho Na Ho\" — kal se pakka 🤡", scores: { dal_delusional: 2, protein_poser: 2 } },
      ],
    },
  ];
};

// ============ iPHONE MOCKUP COMPONENT ============
const PhoneMockup = ({ children, label }) => (
  <div style={{ flexShrink: 0, scrollSnapAlign: "center", width: 185 }}>
    <div style={{
      width: 185, height: 370, background: "#0A0A0F", borderRadius: 28,
      border: "2px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)",
    }}>
      {/* Notch */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 80, height: 22, background: "#000", borderRadius: "0 0 14px 14px", zIndex: 5 }} />
      {/* Status bar */}
      <div style={{ padding: "28px 14px 6px", display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>
        <span>9:41</span>
        <span>●●● ■</span>
      </div>
      {/* Content */}
      <div style={{ padding: "0 12px 12px", height: 310, overflow: "hidden" }}>
        {children}
      </div>
    </div>
    <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.25)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
  </div>
);

// Score Screen
const ScoreScreen = () => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 4, letterSpacing: 1 }}>YOUR PROTEIN SCORE</div>
    <div style={{ position: "relative", width: 100, height: 100, margin: "8px auto" }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#C8FF00" strokeWidth="6" strokeDasharray={`${78 * 2.64} 264`} strokeLinecap="round" transform="rotate(-90 50 50)" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: "#fff" }}>78</div>
        <div style={{ fontSize: 7, color: "#C8FF00", fontWeight: 700 }}>TOP 15%</div>
      </div>
    </div>
    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>better than 85% of India 🇮🇳</div>
    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 10px", textAlign: "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#fff", marginBottom: 4 }}>
        <span>Today</span><span style={{ color: "#C8FF00" }}>62g ✓</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
        <span>Target</span><span>80g</span>
      </div>
    </div>
    <div style={{ background: "#C8FF00", borderRadius: 8, padding: 6, marginTop: 8, fontSize: 10, fontWeight: 800, color: "#000" }}>SHARE SCORE →</div>
    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", marginTop: 6, fontStyle: "italic" }}>put this in your bio 💅</div>
  </div>
);

// Roast Screen
const RoastScreen = () => (
  <div>
    <div style={{ fontSize: 10, color: "#FF6B6B", fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>🔥 ROAST MODE</div>
    <div style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.12)", borderRadius: 12, padding: 10, marginBottom: 8 }}>
      <div style={{ fontSize: 24, marginBottom: 4 }}>🫣</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>Bhai 3 samose kha liye</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>9g protein • 750 cal</div>
      <div style={{ fontSize: 11, color: "#FF6B6B", marginTop: 6, fontWeight: 700 }}>Sharma ji disappointed hai. 😔</div>
    </div>
    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 8 }}>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginBottom: 4 }}>TODAY'S LOG</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
        ☕ Chai + biscuit — 2g<br />🥟 3x samosa — 9g<br />🍚 Rice + dal — 8g
      </div>
      <div style={{ fontSize: 10, color: "#FF6B6B", marginTop: 6, fontWeight: 600 }}>Total: 19g / 80g target 💀</div>
    </div>
  </div>
);

// Wrapped Screen
const WrappedScreen = () => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: 9, color: "#A78BFA", fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>PROTEIN WRAPPED</div>
    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", marginBottom: 8 }}>THIS WEEK</div>
    <div style={{ fontSize: 36, fontWeight: 900, color: "#fff" }}>420g</div>
    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>total protein this week</div>
    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 8, marginBottom: 6, textAlign: "left" }}>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginBottom: 3 }}>TOP SOURCE</div>
      <div style={{ fontSize: 13, color: "#fff" }}>🧀 Paneer — 180g</div>
    </div>
    <div style={{ background: "rgba(168,139,250,0.08)", borderRadius: 8, padding: 8, textAlign: "left" }}>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginBottom: 3 }}>YOU'RE IN THE</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: "#A78BFA" }}>TOP 12%</div>
      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)" }}>of India 🇮🇳</div>
    </div>
    <div style={{ background: "#A78BFA", borderRadius: 8, padding: 6, marginTop: 8, fontSize: 10, fontWeight: 800, color: "#000" }}>SHARE WRAPPED →</div>
  </div>
);

// Squad Screen
const SquadScreen = () => (
  <div>
    <div style={{ fontSize: 10, color: "#34D399", fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>⚔️ SQUAD BATTLES</div>
    <div style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.12)", borderRadius: 10, padding: 8, marginBottom: 4 }}>
      <div style={{ fontSize: 10, color: "#34D399", fontWeight: 700 }}>🏆 SOYA GANG</div>
      <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", textAlign: "center" }}>410g</div>
      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>this week • winning</div>
    </div>
    <div style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.15)", margin: "2px 0" }}>VS</div>
    <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 10, padding: 8, marginBottom: 8 }}>
      <div style={{ fontSize: 10, color: "#FB7185", fontWeight: 700 }}>💀 PANEER BOYS</div>
      <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", textAlign: "center" }}>340g</div>
      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>this week • losing</div>
    </div>
    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 6, textAlign: "center" }}>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Losers do a dare 😈</div>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>3 days left</div>
    </div>
  </div>
);

// ============ MAIN ============
export default function ProteeenQuiz() {
  const [step, setStep] = useState("landing");
  const [diet, setDiet] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({});
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
    const ns = { ...scores };
    for (const [k, v] of Object.entries(option.scores)) ns[k] = (ns[k] || 0) + v;
    setScores(ns);
    setTimeout(() => {
      if (currentQ < questions.length - 1) { setCurrentQ(currentQ + 1); }
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

  const handleWaitlist = () => { if (email?.includes("@")) setSubmitted(true); };

  // VIRAL CARD — status-first design
  const generateAndAction = useCallback(async (action) => {
    if (!result) return;
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    const w = 1080, h = 1350; c.width = w; c.height = h;

    // BG
    ctx.fillStyle = "#06060A"; ctx.fillRect(0, 0, w, h);
    const g = ctx.createRadialGradient(w/2, 380, 0, w/2, 380, 500);
    g.addColorStop(0, result.color + "12"); g.addColorStop(1, "transparent");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

    // Top bar
    ctx.fillStyle = result.color; ctx.fillRect(0, 0, w, 5);

    // PROTEEEN
    ctx.textAlign = "center";
    ctx.font = "bold 32px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillText("PROTEEEN", w/2, 60);

    // Big emoji
    ctx.font = "180px serif"; ctx.fillText(result.emoji, w/2, 310);

    // Name
    ctx.font = "900 76px sans-serif"; ctx.fillStyle = result.color;
    ctx.fillText(result.name, w/2, 440);

    // Flex line — this is the viral hook
    ctx.font = "italic 30px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText(`"${result.flexLine}"`, w/2, 500);

    // Rizz meter bar
    const barY = 570, barH = 36, barW = 700, barX = (w - barW) / 2;
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.beginPath(); ctx.roundRect(barX, barY, barW, barH, 18); ctx.fill();
    const fillW = (result.rizzScore / 100) * barW;
    ctx.fillStyle = result.color + "CC";
    ctx.beginPath(); ctx.roundRect(barX, barY, fillW, barH, 18); ctx.fill();
    ctx.font = "bold 16px sans-serif"; ctx.fillStyle = "#000";
    ctx.fillText(`RIZZ: ${result.rizzScore}/100`, barX + fillW / 2, barY + 24);

    // Three stats
    const statsY = 660;
    const statItems = [
      { icon: "⚡", label: "PROTEIN", val: result.proteinLevel },
      { icon: "🏆", label: "PERCENTILE", val: `TOP ${100 - result.percentile}%` },
      { icon: "🔥", label: "RIZZ", val: `${result.rizzScore}/100` },
    ];
    statItems.forEach((s, i) => {
      const sx = w/2 + (i-1) * 280;
      ctx.font = "36px serif"; ctx.fillText(s.icon, sx, statsY);
      ctx.font = "bold 26px sans-serif"; ctx.fillStyle = "#fff";
      ctx.fillText(s.val, sx, statsY + 40);
      ctx.font = "12px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillText(s.label, sx, statsY + 60);
      ctx.fillStyle = result.color; // reset for next icon
    });

    // Roast
    ctx.fillStyle = result.color + "0A";
    ctx.beginPath(); ctx.roundRect(120, 790, w-240, 80, 14); ctx.fill();
    ctx.font = "24px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText("🔥 " + result.roast.substring(0, 50), w/2, 840);

    // Divider
    ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(200, 920); ctx.lineTo(w-200, 920); ctx.stroke();

    // Tagline
    ctx.font = "20px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillText("india ka protein app. tu kaha pe hai?", w/2, 970);

    // CTA
    ctx.fillStyle = result.color;
    ctx.beginPath(); ctx.roundRect(w/2-200, 1060, 400, 68, 18); ctx.fill();
    ctx.font = "bold 24px sans-serif"; ctx.fillStyle = "#000";
    ctx.fillText("FIND YOUR AURA →", w/2, 1102);

    // Footer
    ctx.font = "15px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillText("proteeen.app • app coming soon", w/2, 1230);
    ctx.fillStyle = result.color; ctx.fillRect(0, h-5, w, 5);

    if (action === "copy") {
      try {
        const blob = await new Promise(r => c.toBlob(r, "image/png"));
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopyMsg("Copied! Paste anywhere 📋");
      } catch { doDownload(c); setCopyMsg("Downloaded! 📥"); }
    } else { doDownload(c); setCopyMsg("Downloaded! 📥"); }
    setTimeout(() => setCopyMsg(null), 3000);
  }, [result, diet]);

  function doDownload(canvas) {
    const l = document.createElement("a");
    l.download = `proteeen-${result.name.toLowerCase().replace(/\s/g,"-")}.png`;
    l.href = canvas.toDataURL("image/png"); l.click();
  }

  // Palette — electric lime + coral on dark navy
  const P = { lime: "#C8FF00", coral: "#FF6B6B", navy: "#06060A", cream: "#E8E4DC" };
  const font_ = "'Anybody', Impact, sans-serif";
  const fb = "'DM Sans', sans-serif";
  const fm = "'JetBrains Mono', monospace";

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:wght@400;700&family=Anybody:wght@400;700;800;900&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
    body{background:${P.navy}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
    @keyframes popIn{from{opacity:0;transform:scale(.3) rotate(-10deg)}to{opacity:1;transform:scale(1) rotate(0)}}
    @keyframes glitch{0%,100%{text-shadow:2px 0 ${P.coral},-2px 0 ${P.lime}}25%{text-shadow:-2px 0 ${P.coral},2px 0 ${P.lime}}50%{text-shadow:2px 2px ${P.coral},-2px -2px ${P.lime}}75%{text-shadow:-2px 2px ${P.coral},2px -2px ${P.lime}}}
    @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
    button{cursor:pointer;font-family:inherit}button:active{transform:scale(.97)!important}
    ::-webkit-scrollbar{display:none}
  `;
  const pg = { minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,fontFamily:fb,background:P.navy,color:"#fff",position:"relative",overflow:"hidden" };

  // ===== LANDING =====
  if (step === "landing") return (
    <div style={pg}>
      <style>{css}</style>
      {/* Marquee — lime on dark */}
      <div style={{ position:"fixed",top:0,left:0,right:0,background:P.lime,padding:"7px 0",overflow:"hidden",zIndex:10 }}>
        <div style={{ display:"flex",animation:"marquee 25s linear infinite",whiteSpace:"nowrap" }}>
          {Array(10).fill("PROTEEEN • APP COMING SOON • INDIA KA PROTEIN APP • ").map((t,i)=>(
            <span key={i} style={{ fontSize:11,fontWeight:900,color:"#000",fontFamily:font_,letterSpacing:2 }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ textAlign:"center",maxWidth:520,zIndex:2,animation:"fadeUp 0.8s ease",marginTop:40,padding:"0 4px" }}>
        <div style={{ position:"relative",display:"inline-block",marginBottom:12 }}>
          <h1 style={{ fontSize:"clamp(3.5rem,14vw,6.5rem)",fontFamily:font_,fontWeight:900,lineHeight:.85,letterSpacing:"-0.03em" }}>
            <span style={{ color:P.cream }}>PROTE</span>
            <span style={{ color:"#fff",animation:"glitch 3s infinite" }}>EEN</span>
          </h1>
          <div style={{ position:"absolute",top:-6,right:-14,background:P.coral,color:"#fff",fontSize:9,fontWeight:800,padding:"3px 8px",borderRadius:4,transform:"rotate(12deg)",fontFamily:fm,letterSpacing:1 }}>BETA</div>
        </div>

        <p style={{ fontSize:"clamp(.95rem,3vw,1.15rem)",color:P.cream+"70",marginBottom:4,fontStyle:"italic" }}>india ka protein score. tu kitne pe hai?</p>
        <p style={{ fontSize:12,color:"rgba(255,255,255,0.12)",fontFamily:fm,marginBottom:8 }}>not a health app. a status signal. 💅</p>
        
        {/* Subtext — look good energy */}
        <p style={{ fontSize:13,color:P.lime+"80",marginBottom:28,fontWeight:600 }}>
          look better • flex harder • join the protein tribe
        </p>

        {/* iPhone Mockups */}
        <div style={{ marginBottom:24,marginLeft:-20,marginRight:-20 }}>
          <div style={{ display:"flex",gap:14,overflowX:"auto",scrollSnapType:"x mandatory",WebkitOverflowScrolling:"touch",scrollbarWidth:"none",padding:"0 20px 8px" }}>
            <PhoneMockup label="Protein Score"><ScoreScreen /></PhoneMockup>
            <PhoneMockup label="Roast Mode"><RoastScreen /></PhoneMockup>
            <PhoneMockup label="Wrapped"><WrappedScreen /></PhoneMockup>
            <PhoneMockup label="Squads"><SquadScreen /></PhoneMockup>
          </div>
        </div>

        {/* Coming soon */}
        <div style={{ background:P.lime+"0A",border:`1px solid ${P.lime}18`,borderRadius:14,padding:"12px 20px",marginBottom:28,display:"inline-flex",alignItems:"center",gap:10 }}>
          <span style={{ fontSize:16 }}>🚀</span>
          <span style={{ fontSize:13,color:P.cream+"90" }}><strong style={{ color:P.lime }}>App dropping soon</strong> — quiz le, waitlist join kar</span>
        </div>
        <br />

        <button onClick={()=>setStep("diet")} style={{
          background:`linear-gradient(135deg,${P.lime},#B8F000)`,color:"#000",border:"none",borderRadius:16,padding:"18px 48px",
          fontSize:"clamp(1rem,4vw,1.15rem)",fontWeight:900,fontFamily:font_,textTransform:"uppercase",letterSpacing:1,
          boxShadow:`0 8px 40px ${P.lime}30`,animation:"pulse 2.5s infinite",
        }}>FIND MY PROTEIN AURA →</button>
        <p style={{ fontSize:11,color:"rgba(255,255,255,0.1)",marginTop:14,fontFamily:fm }}>30 sec • 10 questions • 1 truth bomb 💣</p>
      </div>
    </div>
  );

  // ===== DIET =====
  if (step === "diet") return (
    <div style={pg}>
      <style>{css}</style>
      <div style={{ textAlign:"center",maxWidth:420,animation:"fadeUp 0.5s ease",zIndex:2 }}>
        <div style={{ fontSize:11,color:P.lime,fontFamily:fm,letterSpacing:3,marginBottom:20 }}>STEP 1 / 2</div>
        <h2 style={{ fontSize:"clamp(2rem,7vw,2.8rem)",fontWeight:900,fontFamily:font_,marginBottom:6,textTransform:"uppercase",lineHeight:.95,color:P.cream }}>PEHLE YE BATA</h2>
        <p style={{ fontSize:14,color:"rgba(255,255,255,0.3)",marginBottom:32 }}>questions teri diet ke hisaab se aayenge</p>
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {[
            { key:"veg",emoji:"🟢",label:"VEGETARIAN",sub:"paneer, dal, soya, dahi",color:"#34D399" },
            { key:"nonveg",emoji:"🔴",label:"NON-VEG",sub:"chicken, eggs, fish + everything above",color:P.coral },
            { key:"all",emoji:"🍳",label:"EGGITARIAN / FLEX",sub:"eggs yes, chicken depends, vibes matter",color:P.lime },
          ].map((d,i)=>(
            <button key={d.key} onClick={()=>{setDiet(d.key);setStep("quiz")}} style={{
              background:d.color+"08",border:`2px solid ${d.color}20`,borderRadius:16,padding:"20px 24px",textAlign:"left",
              display:"flex",alignItems:"center",gap:18,transition:"all 0.2s",animation:`slideIn 0.4s ease ${i*.1}s both`,
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=d.color+"50";e.currentTarget.style.transform="translateX(4px)"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=d.color+"20";e.currentTarget.style.transform="translateX(0)"}}>
              <span style={{ fontSize:36 }}>{d.emoji}</span>
              <div>
                <div style={{ fontSize:16,fontWeight:900,color:d.color,fontFamily:font_,letterSpacing:1 }}>{d.label}</div>
                <div style={{ fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:3 }}>{d.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ===== QUIZ =====
  if (step === "quiz") {
    const q = questions[currentQ]; const progress = ((currentQ+1)/questions.length)*100;
    return (
      <div style={{ ...pg,justifyContent:"flex-start",paddingTop:40 }}>
        <style>{css}</style>
        <div style={{ width:"100%",maxWidth:480,zIndex:2 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <span style={{ fontSize:11,fontFamily:fm,color:"rgba(255,255,255,0.2)" }}>{currentQ+1}/{questions.length}</span>
            <span style={{ fontSize:11,fontFamily:fm,color:P.lime,fontWeight:700 }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ width:"100%",height:3,background:"rgba(255,255,255,0.04)",borderRadius:2,marginBottom:36 }}>
            <div style={{ width:`${progress}%`,height:"100%",background:`linear-gradient(90deg,${P.lime},${P.coral})`,borderRadius:2,transition:"width 0.4s cubic-bezier(0.4,0,0.2,1)",boxShadow:`0 0 16px ${P.lime}40` }} />
          </div>
          <div key={currentQ} style={{ animation:animating?"none":"fadeUp 0.4s ease" }}>
            <span style={{ fontSize:48,display:"block",marginBottom:16 }}>{q.emoji}</span>
            <h2 style={{ fontSize:"clamp(1.15rem,4vw,1.5rem)",fontWeight:700,marginBottom:28,lineHeight:1.45,color:P.cream }}>{q.q}</h2>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {q.options.map((opt,i)=>(
                <button key={i} onClick={()=>handleAnswer(opt)} style={{
                  background:"rgba(255,255,255,0.02)",border:"1.5px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"16px 20px",textAlign:"left",
                  color:"rgba(255,255,255,0.85)",fontSize:14,fontFamily:fb,lineHeight:1.55,transition:"all 0.2s",animation:`slideIn 0.3s ease ${i*.07}s both`,
                }}
                onMouseEnter={e=>{e.currentTarget.style.background=P.lime+"0A";e.currentTarget.style.borderColor=P.lime+"30";e.currentTarget.style.transform="translateX(6px)"}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.02)";e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";e.currentTarget.style.transform="translateX(0)"}}>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== RESULT =====
  if (step === "result" && result) return (
    <div style={{ ...pg,background:result.bg,justifyContent:"flex-start",paddingTop:30,paddingBottom:40 }}>
      <style>{css}</style>
      <canvas ref={canvasRef} style={{ display:"none" }} />
      <div style={{ textAlign:"center",maxWidth:440,zIndex:2,animation:"fadeUp 0.6s ease" }}>
        <div style={{ fontSize:11,fontFamily:fm,color:"rgba(255,255,255,0.2)",letterSpacing:3,marginBottom:16 }}>YOUR PROTEIN AURA IS</div>
        <div style={{ fontSize:80,marginBottom:8,animation:"popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both",filter:`drop-shadow(0 0 50px ${result.color}40)` }}>{result.emoji}</div>
        <h1 style={{ fontSize:"clamp(2rem,8vw,3rem)",fontWeight:900,fontFamily:font_,color:result.color,letterSpacing:"-0.02em",marginBottom:4,textShadow:`0 0 60px ${result.color}25`,textTransform:"uppercase" }}>{result.name}</h1>
        <p style={{ fontSize:15,color:"rgba(255,255,255,0.5)",marginBottom:6,fontStyle:"italic",fontWeight:600 }}>"{result.flexLine}"</p>
        <p style={{ fontSize:13,color:"rgba(255,255,255,0.3)",marginBottom:20 }}>{result.tagline}</p>

        {/* Stats with percentile */}
        <div style={{ display:"flex",gap:8,marginBottom:18,justifyContent:"center" }}>
          {[
            { label:"PROTEIN",value:result.proteinLevel,color:result.proteinLevel==="VERY HIGH"?"#34D399":result.proteinLevel==="HIGH"?P.lime:"#FB7185" },
            { label:"RIZZ",value:`${result.rizzScore}/100`,color:result.color },
            { label:"RANK",value:`TOP ${100-result.percentile}%`,color:"#fff" },
          ].map((s,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.04)",borderRadius:14,padding:"12px 14px",textAlign:"center",flex:1,border:"1px solid rgba(255,255,255,0.06)",animation:`fadeUp 0.4s ease ${.3+i*.1}s both` }}>
              <div style={{ fontSize:9,color:"rgba(255,255,255,0.2)",fontFamily:fm,marginBottom:4,letterSpacing:1 }}>{s.label}</div>
              <div style={{ fontSize:14,fontWeight:800,color:s.color,fontFamily:font_ }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Rizz bar */}
        <div style={{ marginBottom:18 }}>
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:"rgba(255,255,255,0.2)",fontFamily:fm,marginBottom:4 }}>
            <span>RIZZ METER</span><span>{result.rizzScore}/100</span>
          </div>
          <div style={{ width:"100%",height:8,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden" }}>
            <div style={{ width:`${result.rizzScore}%`,height:"100%",background:`linear-gradient(90deg,${result.color},${result.accent})`,borderRadius:4,transition:"width 1s ease",boxShadow:`0 0 12px ${result.color}50` }} />
          </div>
        </div>

        {/* Roast */}
        <div style={{ background:result.color+"08",border:`1px solid ${result.color}15`,borderRadius:14,padding:"14px 18px",marginBottom:14,borderLeft:`3px solid ${result.color}50`,textAlign:"left" }}>
          <div style={{ fontSize:9,color:result.color,fontFamily:fm,letterSpacing:1,marginBottom:6,fontWeight:700 }}>🔥 ROAST</div>
          <p style={{ fontSize:14,color:"rgba(255,255,255,0.55)",lineHeight:1.6 }}>{result.roast}</p>
        </div>

        {/* Desc */}
        <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"14px 18px",marginBottom:14,textAlign:"left" }}>
          <p style={{ fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.7 }}>{result.desc}</p>
        </div>

        {/* Bollywood */}
        <div style={{ background:result.color+"06",borderRadius:10,padding:"12px 16px",marginBottom:24,borderLeft:`3px solid ${result.color}25` }}>
          <p style={{ fontSize:12,color:"rgba(255,255,255,0.25)",fontStyle:"italic",lineHeight:1.5 }}>{result.bollywood}</p>
        </div>

        {copyMsg && <div style={{ background:"#34D399",color:"#000",borderRadius:10,padding:"10px 16px",fontSize:13,fontWeight:700,marginBottom:12,animation:"fadeUp 0.3s ease" }}>{copyMsg}</div>}

        <div style={{ display:"flex",gap:8,marginBottom:10 }}>
          <button onClick={()=>generateAndAction("copy")} style={{ flex:1,background:"rgba(255,255,255,0.04)",border:"1.5px solid rgba(255,255,255,0.08)",borderRadius:14,padding:15,color:"#fff",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>📋 Copy Card</button>
          <button onClick={()=>generateAndAction("download")} style={{ flex:1,background:"rgba(255,255,255,0.04)",border:"1.5px solid rgba(255,255,255,0.08)",borderRadius:14,padding:15,color:"#fff",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>📥 Save Card</button>
        </div>

        <button onClick={()=>setStep("waitlist")} style={{
          width:"100%",background:`linear-gradient(135deg,${result.color},${result.accent})`,border:"none",borderRadius:14,padding:16,color:"#000",
          fontSize:15,fontWeight:900,fontFamily:font_,letterSpacing:1,textTransform:"uppercase",boxShadow:`0 4px 30px ${result.color}30`,marginBottom:12,
        }}>JOIN PROTEEEN WAITLIST →</button>

        <button onClick={()=>{setCurrentQ(0);setScores({});setStep("diet");setCopyMsg(null)}} style={{ background:"none",border:"none",color:"rgba(255,255,255,0.15)",fontSize:12,fontFamily:fm,padding:8 }}>retake quiz 🔄</button>
      </div>
    </div>
  );

  // ===== WAITLIST =====
  if (step === "waitlist") return (
    <div style={pg}>
      <style>{css}</style>
      <div style={{ textAlign:"center",maxWidth:440,animation:"fadeUp 0.5s ease",zIndex:2,padding:"0 4px" }}>
        {submitted ? (
          <>
            <div style={{ fontSize:64,marginBottom:16,animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>🎉</div>
            <h2 style={{ fontSize:"clamp(2rem,7vw,2.8rem)",fontWeight:900,fontFamily:font_,color:P.lime,marginBottom:6,textTransform:"uppercase" }}>YOU'RE IN</h2>
            <p style={{ fontSize:14,color:"rgba(255,255,255,0.35)",marginBottom:28,lineHeight:1.7 }}>
              We'll hit you up when PROTEEEN drops.<br/>
              {result && <>Your Aura: <span style={{ color:result.color,fontWeight:700 }}>{result.emoji} {result.name}</span></>}
            </p>

            <div style={{ marginBottom:24,marginLeft:-20,marginRight:-20 }}>
              <div style={{ fontSize:10,color:"rgba(255,255,255,0.15)",fontFamily:fm,letterSpacing:2,marginBottom:14 }}>WHAT'S COMING</div>
              <div style={{ display:"flex",gap:14,overflowX:"auto",scrollSnapType:"x mandatory",scrollbarWidth:"none",padding:"0 20px 8px" }}>
                <PhoneMockup label="Score"><ScoreScreen /></PhoneMockup>
                <PhoneMockup label="Roasts"><RoastScreen /></PhoneMockup>
                <PhoneMockup label="Wrapped"><WrappedScreen /></PhoneMockup>
                <PhoneMockup label="Squads"><SquadScreen /></PhoneMockup>
              </div>
            </div>

            {result && (
              <button onClick={()=>generateAndAction("download")} style={{
                width:"100%",background:`linear-gradient(135deg,${P.lime},#B8F000)`,color:"#000",border:"none",borderRadius:14,padding:16,
                fontSize:15,fontWeight:900,fontFamily:font_,textTransform:"uppercase",letterSpacing:1,marginBottom:12,
              }}>📥 DOWNLOAD & SHARE MY AURA</button>
            )}
            {copyMsg && <div style={{ background:"#34D399",color:"#000",borderRadius:10,padding:10,fontSize:13,fontWeight:700,marginBottom:12 }}>{copyMsg}</div>}

            <div style={{ display:"flex",gap:8 }}>
              <a href="https://t.me/protein_hi_protein" target="_blank" rel="noopener noreferrer" style={{ flex:1,background:"rgba(0,136,204,0.06)",border:"1px solid rgba(0,136,204,0.12)",borderRadius:12,padding:12,textDecoration:"none",textAlign:"center",color:"#0088cc",fontSize:13,fontWeight:700 }}>✈️ Telegram</a>
              <a href="https://protein-tracker-one.vercel.app" target="_blank" rel="noopener noreferrer" style={{ flex:1,background:P.lime+"08",border:`1px solid ${P.lime}12`,borderRadius:12,padding:12,textDecoration:"none",textAlign:"center",color:P.lime,fontSize:13,fontWeight:700 }}>📱 Tracker</a>
            </div>
          </>
        ) : (
          <>
            <h1 style={{ fontSize:"clamp(2.5rem,10vw,4rem)",fontFamily:font_,fontWeight:900,marginBottom:6 }}>
              <span style={{ color:P.cream }}>PROTE</span><span style={{ animation:"glitch 3s infinite" }}>EEN</span>
            </h1>
            <h2 style={{ fontSize:"clamp(1.1rem,4vw,1.4rem)",fontWeight:800,fontFamily:font_,marginBottom:6,textTransform:"uppercase",letterSpacing:1,color:P.cream+"80" }}>JOIN THE WAITLIST</h2>
            <p style={{ fontSize:13,color:"rgba(255,255,255,0.3)",marginBottom:28,lineHeight:1.6 }}>
              {result ? `Your aura: ${result.emoji} ${result.name}. ` : ""}Be first when it drops.
            </p>
            <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:16 }}>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="your name" style={{ background:"rgba(255,255,255,0.03)",border:"1.5px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"15px 18px",color:"#fff",fontSize:15,outline:"none",fontFamily:fb,transition:"border-color 0.2s" }} onFocus={e=>e.target.style.borderColor=P.lime+"40"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.06)"} />
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your email" type="email" style={{ background:"rgba(255,255,255,0.03)",border:"1.5px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"15px 18px",color:"#fff",fontSize:15,outline:"none",fontFamily:fb,transition:"border-color 0.2s" }} onFocus={e=>e.target.style.borderColor=P.lime+"40"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.06)"} />
              <button onClick={handleWaitlist} style={{ background:`linear-gradient(135deg,${P.lime},#B8F000)`,color:"#000",border:"none",borderRadius:14,padding:16,fontSize:15,fontWeight:900,fontFamily:font_,textTransform:"uppercase",letterSpacing:1,opacity:(!email||!email.includes("@"))?.4:1,transition:"opacity 0.2s" }}>GET EARLY ACCESS →</button>
            </div>
            <p style={{ fontSize:11,color:"rgba(255,255,255,0.1)",fontFamily:fm }}>no spam. just protein. pinky promise 🤙</p>
          </>
        )}
      </div>
    </div>
  );

  return null;
}
