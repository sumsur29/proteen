import { useState, useEffect, useRef, useCallback } from "react";

// ============ AURA TYPES ============
const AURAS = {
  paneer_mafia: {
    name: "PANEER MAFIA", emoji: "🧀", color: "#FACC15", accent: "#FDE047",
    bg: "linear-gradient(160deg, #0C0A00 0%, #1A1400 40%, #2D1F00 100%)",
    tagline: "Tu paneer ke bina jee nahi sakta",
    desc: "Paneer tikka, paneer bhurji, paneer paratha, paneer in dal, paneer in maggi — tu har cheez mein paneer daal deta hai. Tera protein game strong hai but variety game weak. Still, respect. Paneer is king and you know it.",
    proteinLevel: "HIGH", rizzScore: 82,
    bollywood: "\"Paneer ke bina khaana, khaana nahi hota\" — Rocky, probably",
    roast: "Bro tera blood type paneer positive hai 🧀"
  },
  soya_sigma: {
    name: "SOYA SIGMA", emoji: "🟤", color: "#A855F7", accent: "#C084FC",
    bg: "linear-gradient(160deg, #0A0015 0%, #150028 40%, #1F0040 100%)",
    tagline: "₹8 mein 26g protein. Sigma grindset.",
    desc: "While others burn ₹150 on protein bars, tu ₹8 ki soya chunks se 26g protein nikal raha hai. Budget king. Efficiency lord. Maximum protein, minimum spend. True sigma behavior.",
    proteinLevel: "VERY HIGH", rizzScore: 91,
    bollywood: "\"Mogambo khush hua\" — every time soya chunks go on sale",
    roast: "₹8 mein 26g protein — tu toh financial advisor + dietician combo hai 💰"
  },
  whey_bro: {
    name: "WHEY BRO", emoji: "💪", color: "#3B82F6", accent: "#60A5FA",
    bg: "linear-gradient(160deg, #000814 0%, #001D3D 40%, #003566 100%)",
    tagline: "Shaker bottle is personality trait",
    desc: "Tera shaker bottle tere se zyada social hai. Gym mein ON Gold Standard flex karta hai, post-workout selfie mandatory hai. Protein intake? Sorted. Personality beyond gym? Loading...",
    proteinLevel: "VERY HIGH", rizzScore: 75,
    bollywood: "\"Ek baar jo maine commitment kar di\" — to the gym, not to people",
    roast: "Bhai tu shaker bottle leke paida hua tha kya? 🥤"
  },
  dal_delusional: {
    name: "DAL DELUSIONAL", emoji: "🥣", color: "#EF4444", accent: "#F87171",
    bg: "linear-gradient(160deg, #0A0000 0%, #1A0505 40%, #2D0A0A 100%)",
    tagline: "\"Main toh dal khata hoon roz\" 🤡",
    desc: "Bro. 1 bowl cooked dal = 7g protein. Tujhe 60g chahiye. That's 8.5 bowls of dal. PER DAY. Tu sochta hai dal kha ke protein ho gaya but actually tu protein deficient hai. This quiz is your wake-up call.",
    proteinLevel: "LOW", rizzScore: 34,
    bollywood: "\"Kabhi kabhi lagta hai apun hi bhagwan hai\" — but bhagwan bhi 60g protein khata hoga",
    roast: "Dal se protein milega bro? Aur pani se petrol bhi milega? 💀"
  },
  egg_carton: {
    name: "EGG CARTON", emoji: "🥚", color: "#F97316", accent: "#FB923C",
    bg: "linear-gradient(160deg, #0A0500 0%, #1A0E00 40%, #2D1800 100%)",
    tagline: "6 eggs a day. Cholesterol is a myth apparently.",
    desc: "Tera fridge mein eggs ke alawa kuch nahi hai. Boiled, bhurji, omelette, curry — tu eggs ke 50 shades jaanta hai. Cheap, effective, simple. Cholesterol? \"Wo kya hota hai bhai?\"",
    proteinLevel: "HIGH", rizzScore: 70,
    bollywood: "\"Ande ka funda\" — literally tera life philosophy",
    roast: "Bhai tu murgi se zyada eggs consume karta hai 🐔"
  },
  protein_poser: {
    name: "PROTEIN POSER", emoji: "🤳", color: "#EC4899", accent: "#F472B6",
    bg: "linear-gradient(160deg, #0A0008 0%, #1A0012 40%, #2D001F 100%)",
    tagline: "Instagram pe gym selfie. Actual intake: 30g.",
    desc: "Tu protein KE BAARE MEIN baat karta hai zyada, khaata kam hai. Gym selfie? Posted. Whey protein ka photo? Story pe daala. Actual tracking? \"Kal se karunga bro.\" This app is literally made for you.",
    proteinLevel: "LOW", rizzScore: 55,
    bollywood: "\"Picture abhi baaki hai mere dost\" — aur protein bhi",
    roast: "Gym selfie 📸 > actual workout. Tera protein intake se zyada tera filter game strong hai 💅"
  },
  sattu_og: {
    name: "SATTU OG", emoji: "🥤", color: "#22C55E", accent: "#4ADE80",
    bg: "linear-gradient(160deg, #000A00 0%, #001A00 40%, #002D00 100%)",
    tagline: "Bihar ne protein discover kiya before it was cool",
    desc: "Jab duniya whey protein discover kar rahi thi, tera family sattu pee raha tha. ₹5 mein 20g protein. No fancy packaging, no influencer marketing, just pure desi protein energy. Tu OG hai. Respect. 🙏",
    proteinLevel: "HIGH", rizzScore: 88,
    bollywood: "\"Jab tak hai jaan\" — tab tak sattu peeta rahunga",
    roast: "Tu before-it-was-cool ka pioneer hai — sattu > whey any day 🏆"
  },
  clean_label_queen: {
    name: "CLEAN LABEL QUEEN", emoji: "✨", color: "#14B8A6", accent: "#2DD4BF",
    bg: "linear-gradient(160deg, #000A08 0%, #001A15 40%, #002D25 100%)",
    tagline: "\"Ingredients padhte ho? I only eat clean.\"",
    desc: "Whole Truth bars, Epigamia Greek yogurt, organic peanut butter — tera protein game premium hai. Tu ingredient list padh ke khaata hai. No added sugar, no palm oil, only clean gains. Mehenga hai? \"Health is an investment, bro.\"",
    proteinLevel: "HIGH", rizzScore: 85,
    bollywood: "\"The Whole Truth and nothing but the truth\" — literally tera brand",
    roast: "Bro tu grocery store mein ingredient list padh ke 45 min lagata hai 🔍"
  },
};

// ============ DIET-AWARE QUESTIONS ============
const getQuestions = (diet) => {
  const isVeg = diet === "veg";
  const isNonveg = diet === "nonveg";
  
  return [
    {
      q: "subah uthke sabse pehle kya karta/karti hai?",
      emoji: "🌅",
      options: isVeg ? [
        { text: "phone check — Instagram pe fitness stories dekhunga", scores: { protein_poser: 3, clean_label_queen: 1 } },
        { text: "kitchen mein paneer/tofu kuch banana shuru", scores: { paneer_mafia: 2, sattu_og: 2 } },
        { text: "sattu ghol ke pee leta hoon — OG morning drink", scores: { sattu_og: 3, soya_sigma: 1 } },
        { text: "chai + biscuit — protein baad mein dekhenge", scores: { dal_delusional: 3, protein_poser: 1 } },
      ] : isNonveg ? [
        { text: "phone check — gym stories dekhna zaroori hai", scores: { protein_poser: 3, whey_bro: 1 } },
        { text: "kitchen mein eggs crack karna — daily ritual", scores: { egg_carton: 3, whey_bro: 1 } },
        { text: "shaker bottle dhundta hoon — pre-workout time", scores: { whey_bro: 3, egg_carton: 1 } },
        { text: "chai + paratha — protein? wo kya hota hai?", scores: { dal_delusional: 3, protein_poser: 1 } },
      ] : [
        { text: "phone check — Instagram pe gym stories dekhunga", scores: { protein_poser: 3, whey_bro: 1 } },
        { text: "kitchen mein kuch banana shuru — eggs ya paneer", scores: { paneer_mafia: 2, egg_carton: 2 } },
        { text: "shaker bottle ya sattu — depends on mood", scores: { whey_bro: 2, sattu_og: 2 } },
        { text: "chai + biscuit — classic combo", scores: { dal_delusional: 3, protein_poser: 1 } },
      ],
    },
    {
      q: "restaurant mein waiter bola \"sir kya laayein?\" — tu:",
      emoji: "🍽️",
      options: isVeg ? [
        { text: "\"paneer tikka, paneer butter masala, extra paneer\"", scores: { paneer_mafia: 3 } },
        { text: "\"bhaiya menu mein sabse zyada protein kismein hai?\"", scores: { clean_label_queen: 2, soya_sigma: 2 } },
        { text: "\"dal makhani + raita + paneer side\" — balanced king", scores: { sattu_og: 2, paneer_mafia: 1 } },
        { text: "\"jo bestseller hai wahi le aao\" — YOLO", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : isNonveg ? [
        { text: "\"chicken breast grilled, no oil, steamed veggies side mein\"", scores: { whey_bro: 3, clean_label_queen: 1 } },
        { text: "\"butter chicken + extra naan\" — protein toh hai usme right?", scores: { dal_delusional: 2, protein_poser: 1 } },
        { text: "\"egg curry + chicken tikka — double protein combo\"", scores: { egg_carton: 2, whey_bro: 2 } },
        { text: "\"menu mein protein per dish kitna hai?\" *waiter confused*", scores: { clean_label_queen: 3 } },
      ] : [
        { text: "\"paneer tikka + maybe egg curry bhi — mood pe depend\"", scores: { paneer_mafia: 2, egg_carton: 2 } },
        { text: "\"menu mein protein per dish kitna hai?\" *waiter confused*", scores: { clean_label_queen: 2, soya_sigma: 2 } },
        { text: "\"chicken ya paneer — jo bhi zyada protein de\"", scores: { whey_bro: 2, paneer_mafia: 2 } },
        { text: "\"jo bestseller hai wahi le aao\"", scores: { dal_delusional: 2, protein_poser: 2 } },
      ],
    },
    {
      q: "bestie bola \"bhai/behen protein bar de na\" — tu:",
      emoji: "🍫",
      options: isVeg ? [
        { text: "\"le Whole Truth bar — clean label, no added sugar 🌿\"", scores: { clean_label_queen: 3 } },
        { text: "\"protein bar? ₹150 ka 10g? le soya chunks kha ₹8 mein 26g\"", scores: { soya_sigma: 3 } },
        { text: "\"ruk ghar ka homemade chana sattu ladoo deta hoon\"", scores: { sattu_og: 3 } },
        { text: "\"mere paas toh nahi hai bro, Swiggy pe order kar\"", scores: { protein_poser: 2, dal_delusional: 2 } },
      ] : isNonveg ? [
        { text: "\"le Whole Truth bar — clean hai, no junk\"", scores: { clean_label_queen: 3 } },
        { text: "\"protein bar? ruk mera shaker half de deta hoon\"", scores: { whey_bro: 3 } },
        { text: "\"bar chod, 3 boiled eggs kha — cheaper + better\"", scores: { egg_carton: 3 } },
        { text: "\"mere paas toh nahi hai bro, Swiggy pe order kar\"", scores: { protein_poser: 2, dal_delusional: 2 } },
      ] : [
        { text: "\"le Whole Truth bar — clean label hai\"", scores: { clean_label_queen: 3 } },
        { text: "\"protein bar? ₹150 ka 10g? le soya chunks kha\"", scores: { soya_sigma: 3 } },
        { text: "\"ruk mera shaker mein se half de deta hoon\"", scores: { whey_bro: 3 } },
        { text: "\"mere paas toh nahi hai bro\"", scores: { protein_poser: 2, dal_delusional: 2 } },
      ],
    },
    {
      q: "mummy ne pucha \"aaj dinner mein kya banana hai?\"",
      emoji: "👩‍🍳",
      options: isVeg ? [
        { text: "\"paneer. bas. kuch bhi bana do but paneer DAAL DO\"", scores: { paneer_mafia: 3 } },
        { text: "\"mummy soya chunk curry + chana dal extra daal do 🥺\"", scores: { soya_sigma: 2, sattu_og: 2 } },
        { text: "\"main khud Greek yogurt smoothie bana lunga 💅\"", scores: { clean_label_queen: 3 } },
        { text: "\"jo bhi ban raha hai\" *later cries about low protein*", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : isNonveg ? [
        { text: "\"chicken breast please mummy — grilled, no oil\"", scores: { whey_bro: 3 } },
        { text: "\"egg bhurji + chicken curry — double protein dinner\"", scores: { egg_carton: 2, whey_bro: 2 } },
        { text: "\"mummy main khud bana lunga\" *makes egg bhurji*", scores: { egg_carton: 3 } },
        { text: "\"jo bhi ban raha hai\" *orders biryani anyway*", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : [
        { text: "\"paneer ya egg curry — jo bhi mood hai\"", scores: { paneer_mafia: 2, egg_carton: 2 } },
        { text: "\"mummy dal mein thoda chana extra daal do 🥺\"", scores: { sattu_og: 2, soya_sigma: 2 } },
        { text: "\"mummy main khud bana lunga\" *makes omelette*", scores: { egg_carton: 3 } },
        { text: "\"jo bhi ban raha hai theek hai\" 😔", scores: { dal_delusional: 2, protein_poser: 2 } },
      ],
    },
    {
      q: "teri dating profile mein kya hoga? be honest 😏",
      emoji: "💘",
      options: isVeg ? [
        { text: "\"will cook paneer for you on the first date 🧀\"", scores: { paneer_mafia: 3 } },
        { text: "\"clean eating, mindful living, ingredient reader 🌿\"", scores: { clean_label_queen: 3 } },
        { text: "\"sattu + soya mein believe karta hoon. low maintenance\"", scores: { soya_sigma: 2, sattu_og: 2 } },
        { text: "\"i eat healthy\" *last meal was maggi with extra cheese*", scores: { protein_poser: 3 } },
      ] : isNonveg ? [
        { text: "\"gym 5x/week, macro tracking, don't waste my time 💪\"", scores: { whey_bro: 3 } },
        { text: "\"will make you egg bhurji at 2 AM 🥚\"", scores: { egg_carton: 3 } },
        { text: "\"clean eating, mindful living 🌿\"", scores: { clean_label_queen: 3 } },
        { text: "\"i eat healthy\" *last meal was butter chicken + naan x3*", scores: { protein_poser: 3 } },
      ] : [
        { text: "\"will cook paneer for you on the first date 🧀\"", scores: { paneer_mafia: 3 } },
        { text: "\"gym 5x/week, macro tracking, don't waste my time\"", scores: { whey_bro: 3 } },
        { text: "\"clean eating, mindful living 🌿\"", scores: { clean_label_queen: 3 } },
        { text: "\"i eat healthy\" *proceeds to order maggi*", scores: { protein_poser: 3 } },
      ],
    },
    {
      q: "budget tight hai. protein kahan se laayega?",
      emoji: "💸",
      options: isVeg ? [
        { text: "soya chunks + sattu + sprouts — ₹500/month sorted 🫡", scores: { soya_sigma: 3, sattu_og: 2 } },
        { text: "paneer toh khareedna hi padega — budget se compromise nahi", scores: { paneer_mafia: 3 } },
        { text: "Whole Truth bar ka subscription — invest in health bro", scores: { clean_label_queen: 2, protein_poser: 1 } },
        { text: "\"protein mehenga hai yaar\" *spends ₹200 daily on Zomato*", scores: { dal_delusional: 3 } },
      ] : isNonveg ? [
        { text: "eggs. 6 eggs = ₹42. daily. simple math. done.", scores: { egg_carton: 3 } },
        { text: "chicken breast from wholesale — meal prep Sunday", scores: { whey_bro: 3 } },
        { text: "soya + eggs combo — budget king energy", scores: { soya_sigma: 2, egg_carton: 2 } },
        { text: "\"protein mehenga hai yaar\" *orders biryani on Swiggy*", scores: { dal_delusional: 3 } },
      ] : [
        { text: "soya chunks + sattu + eggs — ₹600/month sorted", scores: { soya_sigma: 3, egg_carton: 1 } },
        { text: "eggs + paneer rotation — depends on day", scores: { egg_carton: 2, paneer_mafia: 2 } },
        { text: "supplements leke solve karunga — efficient", scores: { whey_bro: 2, clean_label_queen: 2 } },
        { text: "\"bro protein mehenga hai\" *spends ₹200 on Zomato*", scores: { dal_delusional: 3 } },
      ],
    },
    {
      q: "Pushpa style — \"main jhukunga nahi\" — protein mein tu kya nahi chhodega?",
      emoji: "🔥",
      options: isVeg ? [
        { text: "\"mera paneer koi nahi chheen sakta\" *Pushpa intensity*", scores: { paneer_mafia: 3 } },
        { text: "\"mera sattu — generations se family mein hai\"", scores: { sattu_og: 3 } },
        { text: "\"mera soya chunks — ₹8 mein 26g, fight me\"", scores: { soya_sigma: 3 } },
        { text: "\"mera... actually main flexible hoon\" 💀", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : isNonveg ? [
        { text: "\"mera whey protein — fire me, I'll still buy it\"", scores: { whey_bro: 3 } },
        { text: "\"mere eggs — 6 a day, non-negotiable\"", scores: { egg_carton: 3 } },
        { text: "\"mera chicken breast — meal prep is religion\"", scores: { whey_bro: 2, clean_label_queen: 2 } },
        { text: "\"mera... actually flexible hoon\" 💀", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : [
        { text: "\"mera paneer — koi nahi chheen sakta\" 🧀", scores: { paneer_mafia: 3 } },
        { text: "\"mere eggs — 6 a day, non-negotiable\"", scores: { egg_carton: 3 } },
        { text: "\"mera sattu — it's been in my family for generations\"", scores: { sattu_og: 3 } },
        { text: "\"mera... actually main flexible hoon\" 💀", scores: { dal_delusional: 2, protein_poser: 2 } },
      ],
    },
    {
      q: "grocery store mein tu pehle kahan jaata hai?",
      emoji: "🛒",
      options: isVeg ? [
        { text: "dairy section — paneer, dahi, Greek yogurt, cheese 🧀", scores: { paneer_mafia: 2, clean_label_queen: 2 } },
        { text: "dal/pulses — chana, rajma, soya chunks, sattu", scores: { soya_sigma: 2, sattu_og: 2 } },
        { text: "supplement aisle — plant protein, bars, protein milk", scores: { clean_label_queen: 3 } },
        { text: "snacks section — chips, biscuits... \"kal se healthy\" 🤡", scores: { protein_poser: 2, dal_delusional: 2 } },
      ] : isNonveg ? [
        { text: "meat section — chicken breast, fish, keema", scores: { whey_bro: 2, egg_carton: 1 } },
        { text: "egg tray — 30 ka crate leke nikalta hoon 🥚", scores: { egg_carton: 3 } },
        { text: "supplement aisle — whey, bars, protein milk", scores: { whey_bro: 2, clean_label_queen: 2 } },
        { text: "snacks section — \"kal se healthy\" 🤡", scores: { protein_poser: 2, dal_delusional: 2 } },
      ] : [
        { text: "dairy section — paneer, dahi, Greek yogurt", scores: { paneer_mafia: 2, clean_label_queen: 2 } },
        { text: "eggs + pulses — soya, chana, 30-egg tray", scores: { soya_sigma: 2, egg_carton: 2 } },
        { text: "supplement aisle — whey, bars, the works", scores: { whey_bro: 2, clean_label_queen: 2 } },
        { text: "snacks section — \"kal se healthy\" 🤡", scores: { protein_poser: 2, dal_delusional: 2 } },
      ],
    },
    {
      q: "Stree 2 style — \"wo stree hai, wo kuch bhi kar sakti hai\" but for protein. teri superpower kya hai?",
      emoji: "⚡",
      options: isVeg ? [
        { text: "\"main paneer se 40g protein ek meal mein nikaal sakta hoon\" 🧀", scores: { paneer_mafia: 3 } },
        { text: "\"main ₹500/month mein 60g daily protein kar sakta hoon\" 🟤", scores: { soya_sigma: 3 } },
        { text: "\"main har product ka label 2 sec mein scan kar sakta hoon\" ✨", scores: { clean_label_queen: 3 } },
        { text: "\"main... main toh bas survive kar raha hoon bro\" 💀", scores: { dal_delusional: 3 } },
      ] : isNonveg ? [
        { text: "\"main 6 eggs 5 min mein kha sakta hoon\" 🥚", scores: { egg_carton: 3 } },
        { text: "\"mera meal prep Sunday se Friday tak chalta hai\" 💪", scores: { whey_bro: 3 } },
        { text: "\"main har product ka label 2 sec mein read karta hoon\" ✨", scores: { clean_label_queen: 3 } },
        { text: "\"main... bas gym selfie le sakta hoon\" 📸", scores: { protein_poser: 3 } },
      ] : [
        { text: "\"main kisi bhi food mein se protein nikaal sakta hoon\" 🔥", scores: { sattu_og: 2, soya_sigma: 2 } },
        { text: "\"mera meal prep game unmatched hai\" 💪", scores: { whey_bro: 2, egg_carton: 2 } },
        { text: "\"main har label 2 sec mein scan karta hoon\" ✨", scores: { clean_label_queen: 3 } },
        { text: "\"main... survive kar raha hoon bro\" 💀", scores: { dal_delusional: 2, protein_poser: 2 } },
      ],
    },
    {
      q: "last one — tera protein journey ka Bollywood anthem kya hai? 🎬",
      emoji: "🎵",
      options: isVeg ? [
        { text: "\"Apna Time Aayega\" — building slowly, soya + sattu way", scores: { sattu_og: 2, soya_sigma: 2 } },
        { text: "\"Butter Paneer\" — wait wrong song but right food 🧀", scores: { paneer_mafia: 3 } },
        { text: "\"Zinda\" from Bhaag Milkha — clean fuel only 🌿", scores: { clean_label_queen: 3 } },
        { text: "\"Kal Ho Na Ho\" — kal se protein pakka start 🤡", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : isNonveg ? [
        { text: "\"Jhoome Jo Pathaan\" — full energy, full protein, no mercy 🔥", scores: { whey_bro: 2, egg_carton: 2 } },
        { text: "\"Animal\" title track — protein obsession level max 💪", scores: { whey_bro: 3 } },
        { text: "\"Apna Time Aayega\" — consistency > intensity", scores: { sattu_og: 2, clean_label_queen: 2 } },
        { text: "\"Kal Ho Na Ho\" — kal se start karunga, pakka 🤡", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : [
        { text: "\"Apna Time Aayega\" — building slowly, consistently", scores: { sattu_og: 2, soya_sigma: 2 } },
        { text: "\"Jhoome Jo Pathaan\" — full energy no mercy 🔥", scores: { whey_bro: 2, egg_carton: 2 } },
        { text: "\"Butter Paneer\" — wrong song right food 🧀", scores: { paneer_mafia: 3 } },
        { text: "\"Kal Ho Na Ho\" — kal se start pakka 🤡", scores: { dal_delusional: 2, protein_poser: 2 } },
      ],
    },
  ];
};

// ============ APP MOCKUP SCREENS ============
const AppMockup = ({ type, color }) => {
  const mockups = {
    score: (
      <div style={{ background: "#0A0A0A", borderRadius: 20, padding: "16px", width: 160, height: 280, border: "1px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40, background: "linear-gradient(180deg, rgba(234,179,8,0.1), transparent)" }} />
        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: 8, letterSpacing: 1 }}>PROTEIN SCORE™</div>
        <div style={{ textAlign: "center", margin: "12px 0" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", border: `3px solid ${color || "#FACC15"}`, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div style={{ position: "absolute", inset: 4, borderRadius: "50%", background: `conic-gradient(${color || "#FACC15"} 78%, rgba(255,255,255,0.05) 0)`, opacity: 0.2 }} />
            <span style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>78</span>
          </div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>TOP 15% IN INDIA</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 8, marginTop: 8 }}>
          <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>TODAY</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#fff" }}>
            <span>Protein</span><span style={{ color: color || "#FACC15" }}>62g</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#fff", marginTop: 2 }}>
            <span>Target</span><span>80g</span>
          </div>
        </div>
        <div style={{ background: color || "#FACC15", borderRadius: 8, padding: "6px", textAlign: "center", marginTop: 10, fontSize: 8, fontWeight: 700, color: "#000" }}>SHARE SCORE</div>
      </div>
    ),
    roast: (
      <div style={{ background: "#0A0A0A", borderRadius: 20, padding: "16px", width: 160, height: 280, border: "1px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40, background: "linear-gradient(180deg, rgba(239,68,68,0.1), transparent)" }} />
        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: 8, letterSpacing: 1 }}>ROAST MODE 🔥</div>
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, padding: 10, marginTop: 8 }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>🫣</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
            Bhai 3 samose kha liye — 9g protein, 750 cal.
          </div>
          <div style={{ fontSize: 8, color: "#EF4444", marginTop: 6, fontWeight: 600 }}>
            Sharma ji disappointed hai.
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 8, marginTop: 10 }}>
          <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)" }}>TODAY'S LOG</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 4, lineHeight: 1.6 }}>
            ☕ Chai + biscuit<br/>🥟 3x samosa<br/>🍚 Rice + dal
          </div>
        </div>
        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 10, fontStyle: "italic" }}>brutal honesty since 2025</div>
      </div>
    ),
    wrapped: (
      <div style={{ background: "#0A0A0A", borderRadius: 20, padding: "16px", width: 160, height: 280, border: "1px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 60, background: "linear-gradient(180deg, rgba(168,85,247,0.15), transparent)" }} />
        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: 6, letterSpacing: 1 }}>PROTEIN WRAPPED</div>
        <div style={{ fontSize: 7, color: "#A855F7", marginBottom: 10 }}>THIS WEEK</div>
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#fff" }}>420g</div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>total protein this week</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>TOP SOURCE</div>
          <div style={{ fontSize: 11, color: "#fff" }}>🧀 Paneer — 180g</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 8 }}>
          <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>YOU'RE IN THE</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#A855F7" }}>TOP 12%</div>
          <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)" }}>of India 🇮🇳</div>
        </div>
      </div>
    ),
    squad: (
      <div style={{ background: "#0A0A0A", borderRadius: 20, padding: "16px", width: 160, height: 280, border: "1px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40, background: "linear-gradient(180deg, rgba(34,197,94,0.1), transparent)" }} />
        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: 8, letterSpacing: 1 }}>SQUAD BATTLES ⚔️</div>
        <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 10, padding: 8, marginBottom: 6 }}>
          <div style={{ fontSize: 8, color: "#22C55E", fontWeight: 700 }}>🏆 SOYA GANG</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", textAlign: "center" }}>410g</div>
          <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>this week</div>
        </div>
        <div style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.2)", margin: "4px 0" }}>VS</div>
        <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 10, padding: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 8, color: "#EF4444", fontWeight: 700 }}>💀 PANEER BOYS</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", textAlign: "center" }}>340g</div>
          <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>this week</div>
        </div>
        <div style={{ fontSize: 7, color: "rgba(255,255,255,0.4)", textAlign: "center", lineHeight: 1.5 }}>Losers do a dare 😈<br/>3 days left</div>
      </div>
    ),
  };
  return mockups[type] || null;
};

// ============ MAIN COMPONENT ============
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
  const [cardGenerated, setCardGenerated] = useState(false);
  const [cardDataUrl, setCardDataUrl] = useState(null);
  const canvasRef = useRef(null);
  
  const questions = diet ? getQuestions(diet) : [];

  const getTopAura = useCallback(() => {
    let max = 0, top = "dal_delusional";
    for (const [k, v] of Object.entries(scores)) {
      if (diet === "veg" && k === "egg_carton") continue;
      if (diet === "veg" && k === "whey_bro") continue;
      if (v > max) { max = v; top = k; }
    }
    return AURAS[top];
  }, [scores, diet]);

  const handleAnswer = (option) => {
    setAnimating(true);
    const newScores = { ...scores };
    for (const [k, v] of Object.entries(option.scores)) {
      newScores[k] = (newScores[k] || 0) + v;
    }
    setScores(newScores);
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        const topAura = (() => {
          let max = 0, top = "dal_delusional";
          for (const [k, v] of Object.entries(newScores)) {
            if (diet === "veg" && k === "egg_carton") continue;
            if (diet === "veg" && k === "whey_bro") continue;
            if (v > max) { max = v; top = k; }
          }
          return AURAS[top];
        })();
        setResult(topAura);
        setStep("result");
      }
      setAnimating(false);
    }, 300);
  };

  const handleWaitlist = () => {
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
  };

  // Generate share card on canvas
  const generateCard = useCallback(() => {
    if (!result || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const w = 1080, h = 1350;
    canvas.width = w;
    canvas.height = h;

    // Background
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#000");
    grad.addColorStop(0.5, "#0A0A0A");
    grad.addColorStop(1, "#111");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Accent glow
    const glow = ctx.createRadialGradient(w / 2, h * 0.35, 0, w / 2, h * 0.35, 400);
    glow.addColorStop(0, result.color + "25");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Top bar
    ctx.fillStyle = result.color;
    ctx.fillRect(0, 0, w, 6);

    // PROTEEEN header
    ctx.font = "bold 42px sans-serif";
    ctx.fillStyle = result.color;
    ctx.textAlign = "center";
    ctx.fillText("PROTEEEN", w / 2, 80);
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillText("india ka protein score", w / 2, 110);

    // Emoji
    ctx.font = "140px serif";
    ctx.fillText(result.emoji, w / 2, 320);

    // Aura name
    ctx.font = "bold 64px sans-serif";
    ctx.fillStyle = result.color;
    ctx.fillText(result.name, w / 2, 430);

    // Tagline
    ctx.font = "italic 26px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText(`"${result.tagline}"`, w / 2, 480);

    // Stats boxes
    const boxY = 540;
    const boxW = 280;
    const boxH = 100;
    const gap = 30;
    const startX = (w - (boxW * 3 + gap * 2)) / 2;

    const stats = [
      { label: "PROTEIN LEVEL", value: result.proteinLevel, color: result.proteinLevel === "VERY HIGH" ? "#22C55E" : result.proteinLevel === "HIGH" ? "#FACC15" : "#EF4444" },
      { label: "RIZZ SCORE", value: `${result.rizzScore}/100`, color: result.color },
      { label: "DIET", value: diet === "veg" ? "VEG 🟢" : diet === "nonveg" ? "NON-VEG 🔴" : "FLEX 🍽️", color: "#fff" },
    ];

    stats.forEach((s, i) => {
      const x = startX + i * (boxW + gap);
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.beginPath();
      ctx.roundRect(x, boxY, boxW, boxH, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = "12px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.textAlign = "center";
      ctx.fillText(s.label, x + boxW / 2, boxY + 35);
      ctx.font = "bold 28px sans-serif";
      ctx.fillStyle = s.color;
      ctx.fillText(s.value, x + boxW / 2, boxY + 72);
    });

    // Roast
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath();
    ctx.roundRect(80, 690, w - 160, 100, 16);
    ctx.fill();
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.textAlign = "center";
    const roastLines = wrapText(ctx, result.roast, w - 200, 24);
    roastLines.forEach((line, i) => {
      ctx.fillText(line, w / 2, 730 + i * 32);
    });

    // Description
    ctx.font = "22px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    const descLines = wrapText(ctx, result.desc, w - 200, 22);
    let descY = 840;
    descLines.slice(0, 4).forEach((line, i) => {
      ctx.fillText(line, w / 2, descY + i * 30);
    });

    // Bollywood quote
    ctx.fillStyle = result.color + "15";
    ctx.beginPath();
    ctx.roundRect(80, 1000, w - 160, 70, 12);
    ctx.fill();
    ctx.strokeStyle = result.color + "30";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.font = "italic 18px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillText(result.bollywood.substring(0, 60), w / 2, 1042);

    // Bottom CTA
    ctx.fillStyle = result.color;
    ctx.beginPath();
    ctx.roundRect(w / 2 - 200, 1130, 400, 70, 20);
    ctx.fill();
    ctx.font = "bold 26px sans-serif";
    ctx.fillStyle = "#000";
    ctx.fillText("FIND YOUR PROTEIN AURA →", w / 2, 1173);

    // Footer
    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillText("proteeen.app", w / 2, 1270);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillText("not a health app. a status signal.", w / 2, 1300);

    const dataUrl = canvas.toDataURL("image/png");
    setCardDataUrl(dataUrl);
    setCardGenerated(true);
  }, [result, diet]);

  useEffect(() => {
    if (step === "result" && result) {
      setTimeout(() => generateCard(), 500);
    }
  }, [step, result, generateCard]);

  // Text wrap helper
  function wrapText(ctx, text, maxWidth, fontSize) {
    ctx.font = `${fontSize}px sans-serif`;
    const words = text.split(" ");
    const lines = [];
    let current = "";
    for (const word of words) {
      const test = current ? current + " " + word : word;
      if (ctx.measureText(test).width > maxWidth) {
        if (current) lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  const downloadCard = () => {
    if (!cardDataUrl) return;
    const link = document.createElement("a");
    link.download = `proteeen-${result.name.toLowerCase().replace(/\s/g, "-")}-aura.png`;
    link.href = cardDataUrl;
    link.click();
  };

  const copyCard = async () => {
    if (!canvasRef.current) return;
    try {
      const blob = await new Promise(res => canvasRef.current.toBlob(res, "image/png"));
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      alert("Card copied! Paste it anywhere 📋");
    } catch {
      downloadCard();
    }
  };

  // ===== STYLES =====
  const font = "'Anybody', 'Impact', sans-serif";
  const fontBody = "'DM Sans', 'Helvetica Neue', sans-serif";
  const fontMono = "'JetBrains Mono', 'Fira Code', monospace";

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:wght@400;700&display=swap');
    @font-face {
      font-family: 'Anybody';
      src: url('https://fonts.googleapis.com/css2?family=Anybody:wght@400;700;800;900&display=swap');
    }
    @import url('https://fonts.googleapis.com/css2?family=Anybody:wght@400;700;800;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body { background: #000; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(40px) } to { opacity: 1; transform: translateY(0) } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-30px) } to { opacity: 1; transform: translateX(0) } }
    @keyframes popIn { from { opacity: 0; transform: scale(0.3) rotate(-10deg) } to { opacity: 1; transform: scale(1) rotate(0) } }
    @keyframes glitch { 0%,100% { text-shadow: 2px 0 #ff0040, -2px 0 #00ff9f } 25% { text-shadow: -2px 0 #ff0040, 2px 0 #00ff9f } 50% { text-shadow: 2px 2px #ff0040, -2px -2px #00ff9f } 75% { text-shadow: -2px 2px #ff0040, 2px -2px #00ff9f } }
    @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
    @keyframes pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.03) } }
    @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
    @keyframes shake { 0%,100% { transform: rotate(0) } 25% { transform: rotate(-2deg) } 75% { transform: rotate(2deg) } }
    @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
    @keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
    button { cursor: pointer; font-family: inherit; }
    button:active { transform: scale(0.97); }
  `;

  const page = {
    minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "20px", fontFamily: fontBody, background: "#000", color: "#fff",
    position: "relative", overflow: "hidden",
  };

  // ===== LANDING =====
  if (step === "landing") return (
    <div style={page}>
      <style>{globalStyles}</style>
      {/* Noise overlay */}
      <div style={{ position: "fixed", inset: 0, background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")", opacity: 0.5, pointerEvents: "none", zIndex: 1 }} />
      
      {/* Scrolling marquee */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, background: "#FACC15", padding: "6px 0", overflow: "hidden", zIndex: 10 }}>
        <div style={{ display: "flex", animation: "marquee 20s linear infinite", whiteSpace: "nowrap" }}>
          {Array(8).fill("PROTEEEN /// INDIA KA PROTEIN SCORE /// TU KITNE PE HAI? /// ").map((t, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 800, color: "#000", fontFamily: font, letterSpacing: 2, marginRight: 0 }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", maxWidth: 500, zIndex: 2, animation: "fadeUp 0.8s ease", marginTop: 30 }}>
        {/* Logo */}
        <div style={{ position: "relative", marginBottom: 8 }}>
          <h1 style={{
            fontSize: "clamp(4rem, 15vw, 7rem)", fontFamily: font, fontWeight: 900,
            lineHeight: 0.85, letterSpacing: "-0.03em", textTransform: "uppercase",
          }}>
            <span style={{ color: "#FACC15", textShadow: "0 0 80px rgba(250,204,21,0.3)", display: "inline-block" }}>PROTE</span>
            <span style={{ color: "#fff", display: "inline-block", animation: "glitch 3s infinite" }}>EEN</span>
          </h1>
          <div style={{ position: "absolute", top: -10, right: -10, background: "#EF4444", color: "#fff", fontSize: 9, fontWeight: 800, padding: "4px 8px", borderRadius: 4, transform: "rotate(12deg)", fontFamily: fontMono }}>BETA</div>
        </div>

        <p style={{ fontSize: "clamp(1rem, 3vw, 1.3rem)", color: "rgba(255,255,255,0.4)", marginBottom: 4, fontWeight: 300, fontStyle: "italic" }}>
          india ka protein score. tu kitne pe hai?
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.15)", fontFamily: fontMono, marginBottom: 40, letterSpacing: 1 }}>
          not a health app. a status signal. 💅
        </p>

        {/* App Mockup Carousel */}
        <div style={{ marginBottom: 36, overflow: "hidden", marginLeft: -20, marginRight: -20 }}>
          <div style={{ display: "flex", gap: 14, padding: "0 20px", overflowX: "auto", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <div style={{ scrollSnapAlign: "center" }}>
              <AppMockup type="score" color="#FACC15" />
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 6, fontFamily: fontMono, textTransform: "uppercase", letterSpacing: 1 }}>Protein Score™</div>
            </div>
            <div style={{ scrollSnapAlign: "center" }}>
              <AppMockup type="roast" color="#EF4444" />
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 6, fontFamily: fontMono, textTransform: "uppercase", letterSpacing: 1 }}>Roast Mode</div>
            </div>
            <div style={{ scrollSnapAlign: "center" }}>
              <AppMockup type="wrapped" color="#A855F7" />
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 6, fontFamily: fontMono, textTransform: "uppercase", letterSpacing: 1 }}>Weekly Wrapped</div>
            </div>
            <div style={{ scrollSnapAlign: "center" }}>
              <AppMockup type="squad" color="#22C55E" />
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 6, fontFamily: fontMono, textTransform: "uppercase", letterSpacing: 1 }}>Squad Battles</div>
            </div>
          </div>
        </div>

        {/* Feature tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 32 }}>
          {[
            { t: "PROTEIN SCORE™", c: "#FACC15" },
            { t: "ROAST MODE", c: "#EF4444" },
            { t: "SQUAD BATTLES", c: "#22C55E" },
            { t: "PROTEIN WRAPPED", c: "#A855F7" },
            { t: "RIZZ RATING 😏", c: "#EC4899" },
            { t: "PARENT MODE", c: "#F97316" },
          ].map((f, i) => (
            <span key={i} style={{
              fontSize: 10, fontWeight: 700, fontFamily: fontMono, letterSpacing: 1,
              padding: "5px 10px", borderRadius: 6,
              background: f.c + "10", color: f.c, border: `1px solid ${f.c}30`,
            }}>{f.t}</span>
          ))}
        </div>

        {/* CTA */}
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.35)", marginBottom: 14, fontWeight: 500 }}>
          but first — let's find your protein aura 👇
        </p>
        <button onClick={() => setStep("diet")} style={{
          background: "#FACC15", color: "#000", border: "none", borderRadius: 16,
          padding: "18px 56px", fontSize: "clamp(1rem, 4vw, 1.2rem)", fontWeight: 900,
          fontFamily: font, textTransform: "uppercase", letterSpacing: 1,
          boxShadow: "0 0 60px rgba(250,204,21,0.25), inset 0 1px 0 rgba(255,255,255,0.3)",
          animation: "pulse 2.5s infinite",
        }}>
          FIND MY PROTEIN AURA →
        </button>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.12)", marginTop: 14, fontFamily: fontMono }}>
          30 sec · 10 questions · 1 truth bomb 💣
        </p>
      </div>
    </div>
  );

  // ===== DIET SELECTION =====
  if (step === "diet") return (
    <div style={page}>
      <style>{globalStyles}</style>
      <div style={{ position: "fixed", inset: 0, background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")", opacity: 0.5, pointerEvents: "none" }} />
      <div style={{ textAlign: "center", maxWidth: 420, animation: "fadeUp 0.5s ease", zIndex: 2 }}>
        <div style={{ fontSize: 11, color: "#FACC15", fontFamily: fontMono, letterSpacing: 3, marginBottom: 20, textTransform: "uppercase" }}>STEP 1 / 2</div>
        <h2 style={{ fontSize: "clamp(2rem, 7vw, 3rem)", fontWeight: 900, fontFamily: font, marginBottom: 6, textTransform: "uppercase", lineHeight: 0.95 }}>
          PEHLE YE BATA
        </h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", marginBottom: 32 }}>questions teri diet ke hisaab se aayenge</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { key: "veg", emoji: "🟢", label: "VEGETARIAN", sub: "paneer, dal, soya, dahi — the OG sources", color: "#22C55E", bg: "rgba(34,197,94,0.06)" },
            { key: "nonveg", emoji: "🔴", label: "NON-VEG", sub: "chicken, eggs, fish + everything above", color: "#EF4444", bg: "rgba(239,68,68,0.04)" },
            { key: "all", emoji: "🍳", label: "EGGITARIAN / FLEX", sub: "eggs yes, chicken depends, vibes matter", color: "#FACC15", bg: "rgba(250,204,21,0.04)" },
          ].map((d, i) => (
            <button key={d.key} onClick={() => { setDiet(d.key); setStep("quiz"); }} style={{
              background: d.bg, border: `2px solid ${d.color}25`,
              borderRadius: 16, padding: "20px 24px", textAlign: "left",
              display: "flex", alignItems: "center", gap: 18,
              transition: "all 0.2s", animation: `slideIn 0.4s ease ${i * 0.1}s both`,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = d.color + "60"; e.currentTarget.style.transform = "translateX(4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = d.color + "25"; e.currentTarget.style.transform = "translateX(0)"; }}>
              <span style={{ fontSize: 36 }}>{d.emoji}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: d.color, fontFamily: font, letterSpacing: 1 }}>{d.label}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{d.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ===== QUIZ =====
  if (step === "quiz") {
    const q = questions[currentQ];
    const progress = ((currentQ + 1) / questions.length) * 100;
    return (
      <div style={{ ...page, justifyContent: "flex-start", paddingTop: 40 }}>
        <style>{globalStyles}</style>
        <div style={{ position: "fixed", inset: 0, background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")", opacity: 0.5, pointerEvents: "none" }} />
        <div style={{ width: "100%", maxWidth: 480, zIndex: 2 }}>
          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontFamily: fontMono, color: "rgba(255,255,255,0.25)" }}>{currentQ + 1}/{questions.length}</span>
            <span style={{ fontSize: 11, fontFamily: fontMono, color: "#FACC15", fontWeight: 700 }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 2, marginBottom: 36 }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #FACC15, #F97316)", borderRadius: 2, transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 0 20px rgba(250,204,21,0.3)" }} />
          </div>

          {/* Question */}
          <div key={currentQ} style={{ animation: animating ? "none" : "fadeUp 0.4s ease" }}>
            <span style={{ fontSize: 48, display: "block", marginBottom: 16 }}>{q.emoji}</span>
            <h2 style={{
              fontSize: "clamp(1.2rem, 4vw, 1.6rem)", fontWeight: 700, marginBottom: 28,
              lineHeight: 1.4, color: "#fff", fontFamily: fontBody,
            }}>{q.q}</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(opt)} style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1.5px solid rgba(255,255,255,0.06)",
                  borderRadius: 14, padding: "16px 20px", textAlign: "left",
                  color: "#fff", fontSize: 15, fontFamily: fontBody, lineHeight: 1.5,
                  transition: "all 0.2s", animation: `slideIn 0.3s ease ${i * 0.07}s both`,
                  position: "relative", overflow: "hidden",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(250,204,21,0.06)";
                  e.currentTarget.style.borderColor = "rgba(250,204,21,0.25)";
                  e.currentTarget.style.transform = "translateX(6px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}>
                  <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "#FACC15", opacity: 0, transition: "opacity 0.2s" }} />
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
    <div style={{ ...page, background: result.bg, justifyContent: "flex-start", paddingTop: 30, paddingBottom: 40 }}>
      <style>{globalStyles}</style>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div style={{ position: "fixed", inset: 0, background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")", opacity: 0.5, pointerEvents: "none" }} />

      <div style={{ textAlign: "center", maxWidth: 440, zIndex: 2, animation: "fadeUp 0.6s ease" }}>
        <div style={{ fontSize: 11, fontFamily: fontMono, color: "rgba(255,255,255,0.25)", letterSpacing: 3, marginBottom: 16, textTransform: "uppercase" }}>YOUR PROTEIN AURA IS</div>

        <div style={{ fontSize: 80, marginBottom: 8, animation: "popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both", filter: `drop-shadow(0 0 40px ${result.color}40)` }}>{result.emoji}</div>

        <h1 style={{
          fontSize: "clamp(2rem, 8vw, 3.2rem)", fontWeight: 900, fontFamily: font,
          color: result.color, letterSpacing: "-0.02em", marginBottom: 4,
          textShadow: `0 0 60px ${result.color}30`, textTransform: "uppercase",
        }}>{result.name}</h1>

        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 20, fontStyle: "italic" }}>
          "{result.tagline}"
        </p>

        {/* Stats */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, justifyContent: "center" }}>
          {[
            { label: "PROTEIN", value: result.proteinLevel, color: result.proteinLevel === "VERY HIGH" ? "#22C55E" : result.proteinLevel === "HIGH" ? "#FACC15" : "#EF4444" },
            { label: "RIZZ", value: `${result.rizzScore}/100`, color: result.color },
            { label: "DIET", value: diet === "veg" ? "🟢 VEG" : diet === "nonveg" ? "🔴 NV" : "🍽️ FLEX", color: "#fff" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "12px 18px",
              textAlign: "center", flex: 1, border: "1px solid rgba(255,255,255,0.06)",
              animation: `fadeUp 0.4s ease ${0.3 + i * 0.1}s both`,
            }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: fontMono, marginBottom: 4, letterSpacing: 1 }}>{s.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: s.color, fontFamily: font }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Roast */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: `1px solid ${result.color}15`,
          borderRadius: 14, padding: "14px 18px", marginBottom: 14, textAlign: "left",
          borderLeft: `3px solid ${result.color}`,
        }}>
          <div style={{ fontSize: 9, color: result.color, fontFamily: fontMono, letterSpacing: 1, marginBottom: 6, fontWeight: 700 }}>🔥 ROAST</div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{result.roast}</p>
        </div>

        {/* Description */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14, padding: "14px 18px", marginBottom: 14, textAlign: "left",
        }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{result.desc}</p>
        </div>

        {/* Bollywood */}
        <div style={{
          background: `${result.color}08`, borderRadius: 10, padding: "12px 16px", marginBottom: 24,
          borderLeft: `3px solid ${result.color}30`,
        }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontStyle: "italic", lineHeight: 1.5 }}>{result.bollywood}</p>
        </div>

        {/* Share Card Preview */}
        {cardDataUrl && (
          <div style={{ marginBottom: 16, animation: "fadeUp 0.4s ease 0.5s both" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: fontMono, letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>YOUR SHAREABLE CARD</div>
            <img src={cardDataUrl} alt="Protein Aura Card" style={{ width: "100%", maxWidth: 300, borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", marginBottom: 8 }} />
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button onClick={copyCard} style={{
            flex: 1, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)",
            borderRadius: 14, padding: "14px", color: "#fff", fontSize: 14, fontWeight: 700,
            fontFamily: fontBody, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            📋 Copy Card
          </button>
          <button onClick={downloadCard} style={{
            flex: 1, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)",
            borderRadius: 14, padding: "14px", color: "#fff", fontSize: 14, fontWeight: 700,
            fontFamily: fontBody, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            📥 Save Card
          </button>
        </div>
        
        <button onClick={() => setStep("waitlist")} style={{
          width: "100%", background: result.color, border: "none",
          borderRadius: 14, padding: "16px", color: "#000", fontSize: 16, fontWeight: 900,
          fontFamily: font, letterSpacing: 1, textTransform: "uppercase",
          boxShadow: `0 0 40px ${result.color}30`,
          marginBottom: 12,
        }}>
          JOIN PROTEEEN WAITLIST →
        </button>

        <button onClick={() => { setCurrentQ(0); setScores({}); setStep("diet"); setCardGenerated(false); setCardDataUrl(null); }} style={{
          background: "none", border: "none", color: "rgba(255,255,255,0.2)", fontSize: 12,
          fontFamily: fontMono,
        }}>retake quiz 🔄</button>

        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.08)", marginTop: 16, fontFamily: fontMono }}>proteeen.app — coming soon</p>
      </div>
    </div>
  );

  // ===== WAITLIST =====
  if (step === "waitlist") return (
    <div style={page}>
      <style>{globalStyles}</style>
      <div style={{ position: "fixed", inset: 0, background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")", opacity: 0.5, pointerEvents: "none" }} />
      <div style={{ textAlign: "center", maxWidth: 440, animation: "fadeUp 0.5s ease", zIndex: 2 }}>
        {submitted ? (
          <>
            <div style={{ fontSize: 64, marginBottom: 16, animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>🎉</div>
            <h2 style={{ fontSize: "clamp(2rem, 7vw, 3rem)", fontWeight: 900, fontFamily: font, color: "#FACC15", marginBottom: 6, textTransform: "uppercase" }}>YOU'RE IN</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 28, lineHeight: 1.7 }}>
              We'll hit you up when PROTEEEN drops.<br />
              {result && <>Your Aura: <span style={{ color: result.color, fontWeight: 700 }}>{result.emoji} {result.name}</span></>}
            </p>

            {/* What's coming - App Mockups */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: fontMono, letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" }}>WHAT'S COMING</div>
              <div style={{ display: "flex", gap: 12, overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none", padding: "0 4px" }}>
                <div style={{ flexShrink: 0 }}><AppMockup type="score" color="#FACC15" /><div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 4, fontFamily: fontMono }}>PROTEIN SCORE</div></div>
                <div style={{ flexShrink: 0 }}><AppMockup type="roast" color="#EF4444" /><div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 4, fontFamily: fontMono }}>ROAST MODE</div></div>
                <div style={{ flexShrink: 0 }}><AppMockup type="wrapped" color="#A855F7" /><div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 4, fontFamily: fontMono }}>WRAPPED</div></div>
                <div style={{ flexShrink: 0 }}><AppMockup type="squad" color="#22C55E" /><div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 4, fontFamily: fontMono }}>SQUAD BATTLES</div></div>
              </div>
            </div>

            {cardDataUrl && (
              <button onClick={downloadCard} style={{
                width: "100%", background: "#FACC15", color: "#000", border: "none", borderRadius: 14,
                padding: "16px", fontSize: 15, fontWeight: 900, fontFamily: font, textTransform: "uppercase",
                letterSpacing: 1, marginBottom: 12,
              }}>📥 DOWNLOAD & SHARE MY AURA CARD</button>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <a href="https://t.me/protein_hi_protein" target="_blank" rel="noopener noreferrer" style={{
                flex: 1, background: "rgba(0,136,204,0.06)", border: "1px solid rgba(0,136,204,0.15)",
                borderRadius: 12, padding: "12px", textDecoration: "none", textAlign: "center",
                color: "#0088cc", fontSize: 13, fontWeight: 700, fontFamily: fontBody,
              }}>✈️ Telegram</a>
              <a href="https://protein-tracker-one.vercel.app" target="_blank" rel="noopener noreferrer" style={{
                flex: 1, background: "rgba(250,204,21,0.06)", border: "1px solid rgba(250,204,21,0.15)",
                borderRadius: 12, padding: "12px", textDecoration: "none", textAlign: "center",
                color: "#FACC15", fontSize: 13, fontWeight: 700, fontFamily: fontBody,
              }}>📱 Tracker</a>
            </div>
          </>
        ) : (
          <>
            <h1 style={{
              fontSize: "clamp(2.5rem, 10vw, 4rem)", fontFamily: font, fontWeight: 900,
              marginBottom: 6, textTransform: "uppercase",
            }}>
              <span style={{ color: "#FACC15" }}>PROTE</span><span>EEN</span>
            </h1>
            <h2 style={{ fontSize: "clamp(1.2rem, 4vw, 1.6rem)", fontWeight: 800, fontFamily: font, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>JOIN THE WAITLIST</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 28, lineHeight: 1.6 }}>
              {result ? `Your aura: ${result.emoji} ${result.name}. ` : ""}Be first when it drops.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="your name"
                style={{
                  background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(255,255,255,0.06)",
                  borderRadius: 12, padding: "15px 18px", color: "#fff", fontSize: 15,
                  outline: "none", fontFamily: fontBody, transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(250,204,21,0.3)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.06)"}
              />
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your email" type="email"
                style={{
                  background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(255,255,255,0.06)",
                  borderRadius: 12, padding: "15px 18px", color: "#fff", fontSize: 15,
                  outline: "none", fontFamily: fontBody, transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(250,204,21,0.3)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.06)"}
              />
              <button onClick={handleWaitlist} style={{
                background: "#FACC15", color: "#000", border: "none", borderRadius: 14,
                padding: "16px", fontSize: 16, fontWeight: 900, fontFamily: font,
                textTransform: "uppercase", letterSpacing: 1,
                opacity: (!email || !email.includes("@")) ? 0.4 : 1,
                transition: "opacity 0.2s",
              }}>GET EARLY ACCESS →</button>
            </div>

            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.12)", fontFamily: fontMono }}>
              no spam. just protein. pinky promise 🤙
            </p>
          </>
        )}
      </div>
    </div>
  );

  return null;
}
