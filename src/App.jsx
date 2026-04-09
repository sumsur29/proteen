import { useState, useEffect, useRef, useCallback } from "react";

// ============ AURA TYPES ============
const AURAS = {
  paneer_mafia: {
    name: "PANEER MAFIA", emoji: "🧀", color: "#F59E0B", accent: "#FBBF24",
    bg: "linear-gradient(160deg, #0C0A00 0%, #1A1400 40%, #2D1F00 100%)",
    tagline: "Tu paneer ke bina jee nahi sakta",
    desc: "Paneer tikka, paneer bhurji, paneer paratha — tu har cheez mein paneer daal deta hai. Variety game weak but protein game strong. Paneer is king and you know it.",
    proteinLevel: "HIGH", rizzScore: 82,
    bollywood: "\"Paneer ke bina khaana, khaana nahi hota\" — Rocky, probably",
    roast: "Bro tera blood type paneer positive hai 🧀"
  },
  soya_sigma: {
    name: "SOYA SIGMA", emoji: "🟤", color: "#8B5CF6", accent: "#A78BFA",
    bg: "linear-gradient(160deg, #0A0015 0%, #150028 40%, #1F0040 100%)",
    tagline: "₹8 mein 26g protein. Sigma grindset.",
    desc: "While others burn ₹150 on protein bars, tu ₹8 ki soya chunks se 26g nikal raha hai. Budget king. Maximum protein, minimum spend. True sigma.",
    proteinLevel: "VERY HIGH", rizzScore: 91,
    bollywood: "\"Mogambo khush hua\" — every time soya chunks go on sale",
    roast: "Tu toh financial advisor + dietician combo hai 💰"
  },
  whey_bro: {
    name: "WHEY BRO", emoji: "💪", color: "#3B82F6", accent: "#60A5FA",
    bg: "linear-gradient(160deg, #000814 0%, #001D3D 40%, #003566 100%)",
    tagline: "Shaker bottle is personality trait",
    desc: "Tera shaker bottle tere se zyada social hai. ON Gold Standard flex mandatory. Protein intake sorted. Personality beyond gym? Loading...",
    proteinLevel: "VERY HIGH", rizzScore: 75,
    bollywood: "\"Ek baar jo maine commitment kar di\" — to the gym, not people",
    roast: "Bhai tu shaker bottle leke paida hua tha kya? 🥤"
  },
  dal_delusional: {
    name: "DAL DELUSIONAL", emoji: "🥣", color: "#EF4444", accent: "#F87171",
    bg: "linear-gradient(160deg, #0A0000 0%, #1A0505 40%, #2D0A0A 100%)",
    tagline: "\"Main toh dal khata hoon roz\" 🤡",
    desc: "1 bowl dal = 7g protein. Tujhe 60g chahiye. That's 8.5 bowls PER DAY. Tu protein deficient hai aur tujhe pata bhi nahi. Wake up.",
    proteinLevel: "LOW", rizzScore: 34,
    bollywood: "\"Kabhi kabhi lagta hai apun hi bhagwan hai\" — bhagwan bhi 60g khata hoga",
    roast: "Dal se protein? Aur pani se petrol bhi milega? 💀"
  },
  egg_carton: {
    name: "EGG CARTON", emoji: "🥚", color: "#F97316", accent: "#FB923C",
    bg: "linear-gradient(160deg, #0A0500 0%, #1A0E00 40%, #2D1800 100%)",
    tagline: "6 eggs a day. Cholesterol is a myth.",
    desc: "Tera fridge mein eggs ke alawa kuch nahi. Boiled, bhurji, omelette — tu eggs ke 50 shades jaanta hai. Cholesterol? \"Wo kya hota hai bhai?\"",
    proteinLevel: "HIGH", rizzScore: 70,
    bollywood: "\"Ande ka funda\" — literally tera life philosophy",
    roast: "Tu murgi se zyada eggs consume karta hai 🐔"
  },
  protein_poser: {
    name: "PROTEIN POSER", emoji: "🤳", color: "#EC4899", accent: "#F472B6",
    bg: "linear-gradient(160deg, #0A0008 0%, #1A0012 40%, #2D001F 100%)",
    tagline: "Instagram pe gym selfie. Actual intake: 30g.",
    desc: "Tu protein KE BAARE MEIN baat karta hai zyada, khaata kam. Gym selfie posted. Actual tracking? \"Kal se karunga bro.\" This app is for you.",
    proteinLevel: "LOW", rizzScore: 55,
    bollywood: "\"Picture abhi baaki hai mere dost\" — aur protein bhi",
    roast: "Tera protein intake se zyada tera filter game strong hai 💅"
  },
  sattu_og: {
    name: "SATTU OG", emoji: "🥤", color: "#10B981", accent: "#34D399",
    bg: "linear-gradient(160deg, #000A00 0%, #001A00 40%, #002D00 100%)",
    tagline: "Bihar ne protein discover kiya before it was cool",
    desc: "Jab duniya whey discover kar rahi thi, tera family sattu pee raha tha. ₹5 mein 20g protein. No influencer marketing, just desi energy. OG respect. 🙏",
    proteinLevel: "HIGH", rizzScore: 88,
    bollywood: "\"Jab tak hai jaan\" — tab tak sattu peeta rahunga",
    roast: "Tu before-it-was-cool ka pioneer hai — sattu > whey 🏆"
  },
  clean_label_queen: {
    name: "CLEAN LABEL QUEEN", emoji: "✨", color: "#14B8A6", accent: "#2DD4BF",
    bg: "linear-gradient(160deg, #000A08 0%, #001A15 40%, #002D25 100%)",
    tagline: "\"Ingredients padhte ho? I only eat clean.\"",
    desc: "Whole Truth bars, Epigamia Greek yogurt, organic peanut butter — tera game premium hai. No added sugar, no palm oil. Mehenga? \"Health is an investment, bro.\"",
    proteinLevel: "HIGH", rizzScore: 85,
    bollywood: "\"The Whole Truth and nothing but the truth\"",
    roast: "Tu grocery mein ingredient list padh ke 45 min lagata hai 🔍"
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
        { text: "kitchen mein kuch banana — eggs ya paneer", scores: { paneer_mafia: 2, egg_carton: 2 } },
        { text: "shaker bottle ya sattu — depends on mood", scores: { whey_bro: 2, sattu_og: 2 } },
        { text: "chai + biscuit — classic combo", scores: { dal_delusional: 3, protein_poser: 1 } },
      ],
    },
    {
      q: "restaurant mein waiter bola \"sir kya laayein?\" — tu:",
      emoji: "🍽️",
      options: isVeg ? [
        { text: "\"paneer tikka, paneer butter masala, extra paneer\"", scores: { paneer_mafia: 3 } },
        { text: "\"bhaiya sabse zyada protein kismein hai?\"", scores: { clean_label_queen: 2, soya_sigma: 2 } },
        { text: "\"dal makhani + raita + paneer side\" — balanced", scores: { sattu_og: 2, paneer_mafia: 1 } },
        { text: "\"jo bestseller hai wahi le aao\" — YOLO", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : isNonveg ? [
        { text: "\"chicken breast grilled, no oil, steamed veggies\"", scores: { whey_bro: 3, clean_label_queen: 1 } },
        { text: "\"butter chicken + extra naan\" — protein toh hai right?", scores: { dal_delusional: 2, protein_poser: 1 } },
        { text: "\"egg curry + chicken tikka — double protein\"", scores: { egg_carton: 2, whey_bro: 2 } },
        { text: "\"menu mein protein per dish kitna hai?\"", scores: { clean_label_queen: 3 } },
      ] : [
        { text: "\"paneer tikka + maybe egg curry bhi\"", scores: { paneer_mafia: 2, egg_carton: 2 } },
        { text: "\"protein per dish kitna hai?\" *waiter confused*", scores: { clean_label_queen: 2, soya_sigma: 2 } },
        { text: "\"chicken ya paneer — jo zyada protein de\"", scores: { whey_bro: 2, paneer_mafia: 2 } },
        { text: "\"jo bestseller hai wahi le aao\"", scores: { dal_delusional: 2, protein_poser: 2 } },
      ],
    },
    {
      q: "bestie bola \"bhai protein bar de na\" — tu:",
      emoji: "🍫",
      options: isVeg ? [
        { text: "\"le Whole Truth bar — clean label, no added sugar 🌿\"", scores: { clean_label_queen: 3 } },
        { text: "\"bar? ₹150 ka 10g? le soya chunks kha ₹8 mein 26g\"", scores: { soya_sigma: 3 } },
        { text: "\"ruk ghar ka homemade chana sattu ladoo deta hoon\"", scores: { sattu_og: 3 } },
        { text: "\"mere paas nahi hai bro, Swiggy pe order kar\"", scores: { protein_poser: 2, dal_delusional: 2 } },
      ] : isNonveg ? [
        { text: "\"le Whole Truth bar — clean hai, no junk\"", scores: { clean_label_queen: 3 } },
        { text: "\"bar? ruk mera shaker half de deta hoon\"", scores: { whey_bro: 3 } },
        { text: "\"bar chod, 3 boiled eggs kha — cheaper + better\"", scores: { egg_carton: 3 } },
        { text: "\"mere paas nahi hai bro, Swiggy pe order kar\"", scores: { protein_poser: 2, dal_delusional: 2 } },
      ] : [
        { text: "\"le Whole Truth bar — clean label hai\"", scores: { clean_label_queen: 3 } },
        { text: "\"bar? ₹150 ka 10g? soya chunks kha\"", scores: { soya_sigma: 3 } },
        { text: "\"ruk mera shaker mein se half de deta hoon\"", scores: { whey_bro: 3 } },
        { text: "\"mere paas nahi hai bro\"", scores: { protein_poser: 2, dal_delusional: 2 } },
      ],
    },
    {
      q: "mummy ne pucha \"dinner mein kya banana hai?\"",
      emoji: "👩‍🍳",
      options: isVeg ? [
        { text: "\"paneer. bas. kuch bhi bana do but paneer DAAL DO\"", scores: { paneer_mafia: 3 } },
        { text: "\"soya chunk curry + chana dal extra daal do 🥺\"", scores: { soya_sigma: 2, sattu_og: 2 } },
        { text: "\"main khud Greek yogurt smoothie bana lunga 💅\"", scores: { clean_label_queen: 3 } },
        { text: "\"jo bhi ban raha hai\" *later cries about low protein*", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : isNonveg ? [
        { text: "\"chicken breast please — grilled, no oil\"", scores: { whey_bro: 3 } },
        { text: "\"egg bhurji + chicken curry — double protein\"", scores: { egg_carton: 2, whey_bro: 2 } },
        { text: "\"main khud bana lunga\" *makes egg bhurji*", scores: { egg_carton: 3 } },
        { text: "\"jo bhi ban raha hai\" *orders biryani anyway*", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : [
        { text: "\"paneer ya egg curry — mood pe depend\"", scores: { paneer_mafia: 2, egg_carton: 2 } },
        { text: "\"dal mein thoda chana extra daal do 🥺\"", scores: { sattu_og: 2, soya_sigma: 2 } },
        { text: "\"main khud bana lunga\" *makes omelette*", scores: { egg_carton: 3 } },
        { text: "\"jo bhi ban raha hai theek hai\" 😔", scores: { dal_delusional: 2, protein_poser: 2 } },
      ],
    },
    {
      q: "teri dating profile mein kya hoga? honest bol 😏",
      emoji: "💘",
      options: isVeg ? [
        { text: "\"will cook paneer for you on the first date 🧀\"", scores: { paneer_mafia: 3 } },
        { text: "\"clean eating, mindful living, ingredient reader 🌿\"", scores: { clean_label_queen: 3 } },
        { text: "\"sattu + soya believer. low maintenance.\"", scores: { soya_sigma: 2, sattu_og: 2 } },
        { text: "\"i eat healthy\" *last meal was maggi + extra cheese*", scores: { protein_poser: 3 } },
      ] : isNonveg ? [
        { text: "\"gym 5x/week, macro tracking, don't waste my time 💪\"", scores: { whey_bro: 3 } },
        { text: "\"will make you egg bhurji at 2 AM 🥚\"", scores: { egg_carton: 3 } },
        { text: "\"clean eating, mindful living 🌿\"", scores: { clean_label_queen: 3 } },
        { text: "\"i eat healthy\" *last meal: butter chicken + naan x3*", scores: { protein_poser: 3 } },
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
        { text: "soya + sattu + sprouts — ₹500/month sorted 🫡", scores: { soya_sigma: 3, sattu_og: 2 } },
        { text: "paneer khareedna padega — budget se compromise nahi", scores: { paneer_mafia: 3 } },
        { text: "Whole Truth bar subscription — health is investment", scores: { clean_label_queen: 2, protein_poser: 1 } },
        { text: "\"protein mehenga hai\" *₹200 daily Zomato*", scores: { dal_delusional: 3 } },
      ] : isNonveg ? [
        { text: "eggs. 6 eggs = ₹42. daily. simple math.", scores: { egg_carton: 3 } },
        { text: "chicken breast wholesale — meal prep Sunday", scores: { whey_bro: 3 } },
        { text: "soya + eggs combo — budget king energy", scores: { soya_sigma: 2, egg_carton: 2 } },
        { text: "\"protein mehenga hai\" *orders biryani on Swiggy*", scores: { dal_delusional: 3 } },
      ] : [
        { text: "soya + sattu + eggs — ₹600/month sorted", scores: { soya_sigma: 3, egg_carton: 1 } },
        { text: "eggs + paneer rotation — depends on day", scores: { egg_carton: 2, paneer_mafia: 2 } },
        { text: "supplements leke solve karunga — efficient", scores: { whey_bro: 2, clean_label_queen: 2 } },
        { text: "\"protein mehenga hai\" *₹200 on Zomato*", scores: { dal_delusional: 3 } },
      ],
    },
    {
      q: "Pushpa style — \"main jhukunga nahi\" — protein mein kya nahi chhodega?",
      emoji: "🔥",
      options: isVeg ? [
        { text: "\"mera paneer koi nahi chheen sakta\" 🧀", scores: { paneer_mafia: 3 } },
        { text: "\"mera sattu — generations se family mein hai\"", scores: { sattu_og: 3 } },
        { text: "\"mera soya chunks — ₹8 = 26g, fight me\"", scores: { soya_sigma: 3 } },
        { text: "\"mera... actually flexible hoon\" 💀", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : isNonveg ? [
        { text: "\"mera whey — fire me, I'll still buy it\"", scores: { whey_bro: 3 } },
        { text: "\"mere eggs — 6 a day, non-negotiable\"", scores: { egg_carton: 3 } },
        { text: "\"mera chicken breast — meal prep is religion\"", scores: { whey_bro: 2, clean_label_queen: 2 } },
        { text: "\"mera... actually flexible hoon\" 💀", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : [
        { text: "\"mera paneer koi nahi chheen sakta\" 🧀", scores: { paneer_mafia: 3 } },
        { text: "\"mere eggs — 6 a day, non-negotiable\"", scores: { egg_carton: 3 } },
        { text: "\"mera sattu — family mein generations se hai\"", scores: { sattu_og: 3 } },
        { text: "\"mera... actually flexible hoon\" 💀", scores: { dal_delusional: 2, protein_poser: 2 } },
      ],
    },
    {
      q: "grocery store mein pehle kahan jaata hai?",
      emoji: "🛒",
      options: isVeg ? [
        { text: "dairy — paneer, dahi, Greek yogurt, cheese 🧀", scores: { paneer_mafia: 2, clean_label_queen: 2 } },
        { text: "dal/pulses — chana, rajma, soya, sattu", scores: { soya_sigma: 2, sattu_og: 2 } },
        { text: "supplement aisle — plant protein, bars", scores: { clean_label_queen: 3 } },
        { text: "snacks — chips, biscuits... \"kal se healthy\" 🤡", scores: { protein_poser: 2, dal_delusional: 2 } },
      ] : isNonveg ? [
        { text: "meat section — chicken breast, fish, keema", scores: { whey_bro: 2, egg_carton: 1 } },
        { text: "egg tray — 30 ka crate leke nikalta hoon 🥚", scores: { egg_carton: 3 } },
        { text: "supplement aisle — whey, bars, protein milk", scores: { whey_bro: 2, clean_label_queen: 2 } },
        { text: "snacks — \"kal se healthy\" 🤡", scores: { protein_poser: 2, dal_delusional: 2 } },
      ] : [
        { text: "dairy — paneer, dahi, Greek yogurt", scores: { paneer_mafia: 2, clean_label_queen: 2 } },
        { text: "eggs + pulses — soya, chana, 30-egg tray", scores: { soya_sigma: 2, egg_carton: 2 } },
        { text: "supplement aisle — whey, bars, the works", scores: { whey_bro: 2, clean_label_queen: 2 } },
        { text: "snacks — \"kal se healthy\" 🤡", scores: { protein_poser: 2, dal_delusional: 2 } },
      ],
    },
    {
      q: "Stree 2 style — \"wo kuch bhi kar sakti hai\" — teri protein superpower?",
      emoji: "⚡",
      options: isVeg ? [
        { text: "\"1 meal mein paneer se 40g nikal sakta hoon\" 🧀", scores: { paneer_mafia: 3 } },
        { text: "\"₹500/month mein 60g daily kar sakta hoon\" 🟤", scores: { soya_sigma: 3 } },
        { text: "\"har label 2 sec mein scan kar sakta hoon\" ✨", scores: { clean_label_queen: 3 } },
        { text: "\"main toh bas survive kar raha hoon\" 💀", scores: { dal_delusional: 3 } },
      ] : isNonveg ? [
        { text: "\"6 eggs 5 min mein kha sakta hoon\" 🥚", scores: { egg_carton: 3 } },
        { text: "\"mera meal prep Sunday se Friday chalta hai\" 💪", scores: { whey_bro: 3 } },
        { text: "\"har label 2 sec mein read karta hoon\" ✨", scores: { clean_label_queen: 3 } },
        { text: "\"bas gym selfie le sakta hoon\" 📸", scores: { protein_poser: 3 } },
      ] : [
        { text: "\"kisi bhi food se protein nikaal sakta hoon\" 🔥", scores: { sattu_og: 2, soya_sigma: 2 } },
        { text: "\"mera meal prep game unmatched hai\" 💪", scores: { whey_bro: 2, egg_carton: 2 } },
        { text: "\"har label 2 sec mein scan karta hoon\" ✨", scores: { clean_label_queen: 3 } },
        { text: "\"bas survive kar raha hoon\" 💀", scores: { dal_delusional: 2, protein_poser: 2 } },
      ],
    },
    {
      q: "last one — protein journey ka Bollywood anthem? 🎬",
      emoji: "🎵",
      options: isVeg ? [
        { text: "\"Apna Time Aayega\" — slowly building, soya+sattu way", scores: { sattu_og: 2, soya_sigma: 2 } },
        { text: "\"Butter Paneer\" — wrong song right food 🧀", scores: { paneer_mafia: 3 } },
        { text: "\"Zinda\" Bhaag Milkha — clean fuel only 🌿", scores: { clean_label_queen: 3 } },
        { text: "\"Kal Ho Na Ho\" — kal se protein pakka 🤡", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : isNonveg ? [
        { text: "\"Jhoome Jo Pathaan\" — full energy no mercy 🔥", scores: { whey_bro: 2, egg_carton: 2 } },
        { text: "\"Animal\" title track — obsession level max 💪", scores: { whey_bro: 3 } },
        { text: "\"Apna Time Aayega\" — consistency > intensity", scores: { sattu_og: 2, clean_label_queen: 2 } },
        { text: "\"Kal Ho Na Ho\" — kal se start pakka 🤡", scores: { dal_delusional: 2, protein_poser: 2 } },
      ] : [
        { text: "\"Apna Time Aayega\" — building consistently", scores: { sattu_og: 2, soya_sigma: 2 } },
        { text: "\"Jhoome Jo Pathaan\" — full energy no mercy 🔥", scores: { whey_bro: 2, egg_carton: 2 } },
        { text: "\"Butter Paneer\" — wrong song right food 🧀", scores: { paneer_mafia: 3 } },
        { text: "\"Kal Ho Na Ho\" — kal se start pakka 🤡", scores: { dal_delusional: 2, protein_poser: 2 } },
      ],
    },
  ];
};

// ============ FEATURE CARD ============
const FeatureCard = ({ icon, title, desc, accent }) => (
  <div style={{
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 20, padding: "24px 20px", width: 200, minWidth: 200,
    flexShrink: 0, scrollSnapAlign: "center",
  }}>
    <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
    <div style={{ fontSize: 15, fontWeight: 800, color: accent, marginBottom: 6, fontFamily: "'Anybody', Impact, sans-serif", textTransform: "uppercase", letterSpacing: 0.5 }}>{title}</div>
    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{desc}</div>
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
    const newScores = { ...scores };
    for (const [k, v] of Object.entries(option.scores)) {
      newScores[k] = (newScores[k] || 0) + v;
    }
    setScores(newScores);
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        let max = 0, top = "dal_delusional";
        for (const [k, v] of Object.entries(newScores)) {
          if (diet === "veg" && (k === "egg_carton" || k === "whey_bro")) continue;
          if (v > max) { max = v; top = k; }
        }
        setResult(AURAS[top]);
        setStep("result");
      }
      setAnimating(false);
    }, 300);
  };

  const handleWaitlist = () => {
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
  };

  // Clean card — less text, more visual
  const generateAndAction = useCallback(async (action) => {
    if (!result) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = 1080, h = 1350;
    canvas.width = w;
    canvas.height = h;

    // BG
    ctx.fillStyle = "#060606";
    ctx.fillRect(0, 0, w, h);

    // Glow
    const glow = ctx.createRadialGradient(w/2, 420, 0, w/2, 420, 450);
    glow.addColorStop(0, result.color + "15");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Top + bottom accent bars
    ctx.fillStyle = result.color;
    ctx.fillRect(0, 0, w, 5);
    ctx.fillRect(0, h - 5, w, 5);

    // Header
    ctx.textAlign = "center";
    ctx.font = "bold 36px sans-serif";
    ctx.fillStyle = result.color + "80";
    ctx.fillText("PROTEEEN", w/2, 70);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillText("india ka protein score", w/2, 96);

    // Divider line
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(200, 125); ctx.lineTo(w-200, 125); ctx.stroke();

    // Emoji
    ctx.font = "200px serif";
    ctx.fillText(result.emoji, w/2, 370);

    // Aura name
    ctx.font = "900 80px sans-serif";
    ctx.fillStyle = result.color;
    ctx.fillText(result.name, w/2, 500);

    // Tagline
    ctx.font = "italic 26px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillText(`"${result.tagline}"`, w/2, 555);

    // Stats — three clean circles
    const cy = 700, cr = 65, spacing = 280;
    const stats = [
      { label: "PROTEIN", val: result.proteinLevel, c: result.proteinLevel === "VERY HIGH" ? "#10B981" : result.proteinLevel === "HIGH" ? "#F59E0B" : "#EF4444" },
      { label: "RIZZ", val: `${result.rizzScore}`, c: result.color },
      { label: "DIET", val: diet === "veg" ? "VEG" : diet === "nonveg" ? "NV" : "FLEX", c: "#fff" },
    ];
    stats.forEach((s, i) => {
      const cx = w/2 + (i-1) * spacing;
      ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI*2);
      ctx.fillStyle = s.c + "0C"; ctx.fill();
      ctx.strokeStyle = s.c + "35"; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.font = `bold ${s.val.length > 4 ? 20 : 30}px sans-serif`;
      ctx.fillStyle = s.c;
      ctx.fillText(s.val, cx, cy + 8);
      ctx.font = "11px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillText(s.label, cx, cy + cr + 22);
    });

    // Roast
    ctx.fillStyle = result.color + "0A";
    ctx.beginPath(); ctx.roundRect(120, 850, w-240, 80, 14); ctx.fill();
    ctx.strokeStyle = result.color + "18"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(120, 850, w-240, 80, 14); ctx.stroke();
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillText("🔥  " + result.roast.substring(0, 50), w/2, 898);

    // Short desc
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    const lines = wrapText(ctx, result.desc, w-260, 20);
    lines.slice(0, 2).forEach((l, i) => { ctx.fillText(l, w/2, 990 + i*28); });

    // CTA
    ctx.fillStyle = result.color;
    ctx.beginPath(); ctx.roundRect(w/2-200, 1110, 400, 68, 18); ctx.fill();
    ctx.font = "bold 24px sans-serif";
    ctx.fillStyle = "#000";
    ctx.fillText("FIND YOUR PROTEIN AURA →", w/2, 1152);

    // Footer
    ctx.font = "15px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillText("proteeen.app • coming soon", w/2, 1250);

    // Action
    if (action === "copy") {
      try {
        const blob = await new Promise(res => canvas.toBlob(res, "image/png"));
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopyMsg("Copied! Paste on Insta/WhatsApp 📋");
      } catch {
        doDownload(canvas);
        setCopyMsg("Downloaded! 📥");
      }
    } else {
      doDownload(canvas);
      setCopyMsg("Downloaded! 📥");
    }
    setTimeout(() => setCopyMsg(null), 3000);
  }, [result, diet]);

  function doDownload(canvas) {
    const link = document.createElement("a");
    link.download = `proteeen-${result.name.toLowerCase().replace(/\s/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function wrapText(ctx, text, maxW, fs) {
    ctx.font = `${fs}px sans-serif`;
    const words = text.split(" ");
    const lines = []; let cur = "";
    for (const w of words) {
      const t = cur ? cur + " " + w : w;
      if (ctx.measureText(t).width > maxW) { if (cur) lines.push(cur); cur = w; }
      else cur = t;
    }
    if (cur) lines.push(cur);
    return lines;
  }

  // Fonts & palette
  const font = "'Anybody', Impact, sans-serif";
  const fontBody = "'DM Sans', 'Helvetica Neue', sans-serif";
  const fontMono = "'JetBrains Mono', 'Fira Code', monospace";
  const C = { amber: "#F59E0B", amberLight: "#FBBF24", cream: "#FEF3C7", red: "#EF4444" };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:wght@400;700&family=Anybody:wght@400;700;800;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body { background: #060606; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(40px) } to { opacity: 1; transform: translateY(0) } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-30px) } to { opacity: 1; transform: translateX(0) } }
    @keyframes popIn { from { opacity: 0; transform: scale(0.3) rotate(-10deg) } to { opacity: 1; transform: scale(1) rotate(0) } }
    @keyframes glitch { 0%,100% { text-shadow: 2px 0 #EF4444, -2px 0 #10B981 } 25% { text-shadow: -2px 0 #EF4444, 2px 0 #10B981 } 50% { text-shadow: 2px 2px #EF4444, -2px -2px #10B981 } 75% { text-shadow: -2px 2px #EF4444, 2px -2px #10B981 } }
    @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
    @keyframes pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.04) } }
    button { cursor: pointer; font-family: inherit; }
    button:active { transform: scale(0.97) !important; }
    ::-webkit-scrollbar { display: none; }
  `;

  const pageBase = {
    minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "20px", fontFamily: fontBody, background: "#060606", color: "#fff",
    position: "relative", overflow: "hidden",
  };

  // ===== LANDING =====
  if (step === "landing") return (
    <div style={pageBase}>
      <style>{globalStyles}</style>

      {/* Marquee */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, background: C.amber, padding: "7px 0", overflow: "hidden", zIndex: 10 }}>
        <div style={{ display: "flex", animation: "marquee 25s linear infinite", whiteSpace: "nowrap" }}>
          {Array(10).fill("PROTEEEN • INDIA KA PROTEIN SCORE • APP COMING SOON • ").map((t, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 900, color: "#000", fontFamily: font, letterSpacing: 2 }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", maxWidth: 520, zIndex: 2, animation: "fadeUp 0.8s ease", marginTop: 40, padding: "0 4px" }}>
        {/* Logo */}
        <div style={{ position: "relative", marginBottom: 12, display: "inline-block" }}>
          <h1 style={{ fontSize: "clamp(3.5rem, 14vw, 6.5rem)", fontFamily: font, fontWeight: 900, lineHeight: 0.85, letterSpacing: "-0.03em" }}>
            <span style={{ color: C.cream }}>PROTE</span>
            <span style={{ color: "#fff", animation: "glitch 3s infinite" }}>EEN</span>
          </h1>
          <div style={{ position: "absolute", top: -6, right: -14, background: C.red, color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 4, transform: "rotate(12deg)", fontFamily: fontMono, letterSpacing: 1 }}>BETA</div>
        </div>

        <p style={{ fontSize: "clamp(0.95rem, 3vw, 1.15rem)", color: C.cream + "70", marginBottom: 4, fontStyle: "italic" }}>
          india ka protein score. tu kitne pe hai?
        </p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.12)", fontFamily: fontMono, marginBottom: 28 }}>
          not a health app. a status signal. 💅
        </p>

        {/* Feature cards — scrollable, properly sized */}
        <div style={{ marginBottom: 24, marginLeft: -20, marginRight: -20 }}>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", padding: "0 20px 8px" }}>
            <FeatureCard icon="💯" title="Protein Score™" desc="0-100 number. Like credit score but protein. Bio-worthy." accent={C.amber} />
            <FeatureCard icon="🔥" title="Roast Mode" desc="App roasts you in Hinglish. Sharma ji disappointed." accent="#EF4444" />
            <FeatureCard icon="📊" title="Wrapped" desc="Weekly stats. Top sources. Top 12% of India. Share it." accent="#8B5CF6" />
            <FeatureCard icon="⚔️" title="Squad Battles" desc="Battle friends weekly. Losers do a dare." accent="#10B981" />
            <FeatureCard icon="😏" title="Rizz Rating" desc="High protein = more rizz. It's science* (*not really)" accent="#EC4899" />
          </div>
        </div>

        {/* Coming soon callout */}
        <div style={{
          background: C.amber + "08", border: `1px solid ${C.amber}15`, borderRadius: 14,
          padding: "14px 20px", marginBottom: 28, display: "inline-flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>🚀</span>
          <span style={{ fontSize: 13, color: C.cream + "90" }}>
            <strong>App launching soon</strong> — take the quiz, join the waitlist
          </span>
        </div>

        <br />

        {/* CTA */}
        <button onClick={() => setStep("diet")} style={{
          background: `linear-gradient(135deg, ${C.amber}, ${C.amberLight})`, color: "#000",
          border: "none", borderRadius: 16, padding: "18px 48px",
          fontSize: "clamp(1rem, 4vw, 1.15rem)", fontWeight: 900,
          fontFamily: font, textTransform: "uppercase", letterSpacing: 1,
          boxShadow: `0 8px 40px ${C.amber}30`, animation: "pulse 2.5s infinite",
        }}>
          FIND MY PROTEIN AURA →
        </button>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.1)", marginTop: 14, fontFamily: fontMono }}>
          30 sec • 10 questions • 1 truth bomb 💣
        </p>
      </div>
    </div>
  );

  // ===== DIET =====
  if (step === "diet") return (
    <div style={pageBase}>
      <style>{globalStyles}</style>
      <div style={{ textAlign: "center", maxWidth: 420, animation: "fadeUp 0.5s ease", zIndex: 2 }}>
        <div style={{ fontSize: 11, color: C.amber, fontFamily: fontMono, letterSpacing: 3, marginBottom: 20 }}>STEP 1 / 2</div>
        <h2 style={{ fontSize: "clamp(2rem, 7vw, 2.8rem)", fontWeight: 900, fontFamily: font, marginBottom: 6, textTransform: "uppercase", lineHeight: 0.95, color: C.cream }}>PEHLE YE BATA</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", marginBottom: 32 }}>questions teri diet ke hisaab se aayenge</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { key: "veg", emoji: "🟢", label: "VEGETARIAN", sub: "paneer, dal, soya, dahi", color: "#10B981" },
            { key: "nonveg", emoji: "🔴", label: "NON-VEG", sub: "chicken, eggs, fish + everything above", color: "#EF4444" },
            { key: "all", emoji: "🍳", label: "EGGITARIAN / FLEX", sub: "eggs yes, chicken depends, vibes matter", color: C.amber },
          ].map((d, i) => (
            <button key={d.key} onClick={() => { setDiet(d.key); setStep("quiz"); }} style={{
              background: d.color + "08", border: `2px solid ${d.color}20`, borderRadius: 16,
              padding: "20px 24px", textAlign: "left", display: "flex", alignItems: "center", gap: 18,
              transition: "all 0.2s", animation: `slideIn 0.4s ease ${i*0.1}s both`,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = d.color + "50"; e.currentTarget.style.transform = "translateX(4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = d.color + "20"; e.currentTarget.style.transform = "translateX(0)"; }}>
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
    const progress = ((currentQ+1) / questions.length) * 100;
    return (
      <div style={{ ...pageBase, justifyContent: "flex-start", paddingTop: 40 }}>
        <style>{globalStyles}</style>
        <div style={{ width: "100%", maxWidth: 480, zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontFamily: fontMono, color: "rgba(255,255,255,0.2)" }}>{currentQ+1}/{questions.length}</span>
            <span style={{ fontSize: 11, fontFamily: fontMono, color: C.amber, fontWeight: 700 }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,0.04)", borderRadius: 2, marginBottom: 36 }}>
            <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${C.amber}, #F97316)`, borderRadius: 2, transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)", boxShadow: `0 0 16px ${C.amber}40` }} />
          </div>
          <div key={currentQ} style={{ animation: animating ? "none" : "fadeUp 0.4s ease" }}>
            <span style={{ fontSize: 48, display: "block", marginBottom: 16 }}>{q.emoji}</span>
            <h2 style={{ fontSize: "clamp(1.15rem, 4vw, 1.5rem)", fontWeight: 700, marginBottom: 28, lineHeight: 1.45, color: C.cream }}>{q.q}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(opt)} style={{
                  background: "rgba(255,255,255,0.02)", border: "1.5px solid rgba(255,255,255,0.06)",
                  borderRadius: 14, padding: "16px 20px", textAlign: "left",
                  color: "rgba(255,255,255,0.85)", fontSize: 14, fontFamily: fontBody, lineHeight: 1.55,
                  transition: "all 0.2s", animation: `slideIn 0.3s ease ${i*0.07}s both`,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.amber + "0A"; e.currentTarget.style.borderColor = C.amber + "30"; e.currentTarget.style.transform = "translateX(6px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateX(0)"; }}>
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
    <div style={{ ...pageBase, background: result.bg, justifyContent: "flex-start", paddingTop: 30, paddingBottom: 40 }}>
      <style>{globalStyles}</style>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div style={{ textAlign: "center", maxWidth: 440, zIndex: 2, animation: "fadeUp 0.6s ease" }}>
        <div style={{ fontSize: 11, fontFamily: fontMono, color: "rgba(255,255,255,0.2)", letterSpacing: 3, marginBottom: 16 }}>YOUR PROTEIN AURA IS</div>
        <div style={{ fontSize: 80, marginBottom: 8, animation: "popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both", filter: `drop-shadow(0 0 50px ${result.color}40)` }}>{result.emoji}</div>
        <h1 style={{ fontSize: "clamp(2rem, 8vw, 3rem)", fontWeight: 900, fontFamily: font, color: result.color, letterSpacing: "-0.02em", marginBottom: 4, textShadow: `0 0 60px ${result.color}25`, textTransform: "uppercase" }}>{result.name}</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 20, fontStyle: "italic" }}>"{result.tagline}"</p>

        {/* Stats */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18, justifyContent: "center" }}>
          {[
            { label: "PROTEIN", value: result.proteinLevel, color: result.proteinLevel === "VERY HIGH" ? "#10B981" : result.proteinLevel === "HIGH" ? "#F59E0B" : "#EF4444" },
            { label: "RIZZ", value: `${result.rizzScore}/100`, color: result.color },
            { label: "DIET", value: diet === "veg" ? "🟢 VEG" : diet === "nonveg" ? "🔴 NV" : "🍽️ FLEX", color: "#fff" },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "12px 16px", textAlign: "center", flex: 1, border: "1px solid rgba(255,255,255,0.06)", animation: `fadeUp 0.4s ease ${0.3+i*0.1}s both` }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: fontMono, marginBottom: 4, letterSpacing: 1 }}>{s.label}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: s.color, fontFamily: font }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Roast */}
        <div style={{ background: result.color + "08", border: `1px solid ${result.color}15`, borderRadius: 14, padding: "14px 18px", marginBottom: 14, borderLeft: `3px solid ${result.color}50`, textAlign: "left" }}>
          <div style={{ fontSize: 9, color: result.color, fontFamily: fontMono, letterSpacing: 1, marginBottom: 6, fontWeight: 700 }}>🔥 ROAST</div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{result.roast}</p>
        </div>

        {/* Desc */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "14px 18px", marginBottom: 14, textAlign: "left" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{result.desc}</p>
        </div>

        {/* Bollywood */}
        <div style={{ background: result.color + "06", borderRadius: 10, padding: "12px 16px", marginBottom: 24, borderLeft: `3px solid ${result.color}25` }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontStyle: "italic", lineHeight: 1.5 }}>{result.bollywood}</p>
        </div>

        {/* Feedback toast */}
        {copyMsg && <div style={{ background: "#10B981", color: "#000", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 700, marginBottom: 12, animation: "fadeUp 0.3s ease" }}>{copyMsg}</div>}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button onClick={() => generateAndAction("copy")} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "15px", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>📋 Copy Card</button>
          <button onClick={() => generateAndAction("download")} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "15px", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>📥 Save Card</button>
        </div>

        <button onClick={() => setStep("waitlist")} style={{
          width: "100%", background: `linear-gradient(135deg, ${result.color}, ${result.accent})`,
          border: "none", borderRadius: 14, padding: "16px", color: "#000",
          fontSize: 15, fontWeight: 900, fontFamily: font, letterSpacing: 1, textTransform: "uppercase",
          boxShadow: `0 4px 30px ${result.color}30`, marginBottom: 12,
        }}>JOIN PROTEEEN WAITLIST →</button>

        <button onClick={() => { setCurrentQ(0); setScores({}); setStep("diet"); setCopyMsg(null); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.15)", fontSize: 12, fontFamily: fontMono, padding: 8 }}>retake quiz 🔄</button>
      </div>
    </div>
  );

  // ===== WAITLIST =====
  if (step === "waitlist") return (
    <div style={pageBase}>
      <style>{globalStyles}</style>
      <div style={{ textAlign: "center", maxWidth: 440, animation: "fadeUp 0.5s ease", zIndex: 2, padding: "0 4px" }}>
        {submitted ? (
          <>
            <div style={{ fontSize: 64, marginBottom: 16, animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>🎉</div>
            <h2 style={{ fontSize: "clamp(2rem, 7vw, 2.8rem)", fontWeight: 900, fontFamily: font, color: C.cream, marginBottom: 6, textTransform: "uppercase" }}>YOU'RE IN</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", marginBottom: 28, lineHeight: 1.7 }}>
              We'll hit you up when PROTEEEN drops.<br />
              {result && <>Your Aura: <span style={{ color: result.color, fontWeight: 700 }}>{result.emoji} {result.name}</span></>}
            </p>

            {/* Features */}
            <div style={{ marginBottom: 24, marginLeft: -20, marginRight: -20 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", fontFamily: fontMono, letterSpacing: 2, marginBottom: 14 }}>WHAT'S COMING</div>
              <div style={{ display: "flex", gap: 12, overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", padding: "0 20px 8px" }}>
                <FeatureCard icon="💯" title="Score" desc="Your protein number. Like credit score but flex." accent={C.amber} />
                <FeatureCard icon="🔥" title="Roast" desc="App bullies you in Hinglish. Duolingo energy." accent="#EF4444" />
                <FeatureCard icon="📊" title="Wrapped" desc="Weekly shareable stats. Top 12% of India." accent="#8B5CF6" />
                <FeatureCard icon="⚔️" title="Squads" desc="Battle friends. Losers do a dare." accent="#10B981" />
              </div>
            </div>

            {result && (
              <>
                <button onClick={() => generateAndAction("download")} style={{
                  width: "100%", background: `linear-gradient(135deg, ${C.amber}, ${C.amberLight})`,
                  color: "#000", border: "none", borderRadius: 14, padding: "16px",
                  fontSize: 15, fontWeight: 900, fontFamily: font, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12,
                }}>📥 DOWNLOAD & SHARE MY AURA</button>
                {copyMsg && <div style={{ background: "#10B981", color: "#000", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{copyMsg}</div>}
              </>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <a href="https://t.me/protein_hi_protein" target="_blank" rel="noopener noreferrer" style={{
                flex: 1, background: "rgba(0,136,204,0.06)", border: "1px solid rgba(0,136,204,0.12)",
                borderRadius: 12, padding: "12px", textDecoration: "none", textAlign: "center",
                color: "#0088cc", fontSize: 13, fontWeight: 700,
              }}>✈️ Telegram</a>
              <a href="https://protein-tracker-one.vercel.app" target="_blank" rel="noopener noreferrer" style={{
                flex: 1, background: C.amber + "08", border: `1px solid ${C.amber}12`,
                borderRadius: 12, padding: "12px", textDecoration: "none", textAlign: "center",
                color: C.amber, fontSize: 13, fontWeight: 700,
              }}>📱 Tracker</a>
            </div>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: "clamp(2.5rem, 10vw, 4rem)", fontFamily: font, fontWeight: 900, marginBottom: 6 }}>
              <span style={{ color: C.cream }}>PROTE</span>
              <span style={{ animation: "glitch 3s infinite" }}>EEN</span>
            </h1>
            <h2 style={{ fontSize: "clamp(1.1rem, 4vw, 1.4rem)", fontWeight: 800, fontFamily: font, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1, color: C.cream + "80" }}>JOIN THE WAITLIST</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 28, lineHeight: 1.6 }}>
              {result ? `Your aura: ${result.emoji} ${result.name}. ` : ""}Be first when it drops.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="your name"
                style={{ background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "15px 18px", color: "#fff", fontSize: 15, outline: "none", fontFamily: fontBody, transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = C.amber + "40"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.06)"} />
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your email" type="email"
                style={{ background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "15px 18px", color: "#fff", fontSize: 15, outline: "none", fontFamily: fontBody, transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = C.amber + "40"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.06)"} />
              <button onClick={handleWaitlist} style={{
                background: `linear-gradient(135deg, ${C.amber}, ${C.amberLight})`,
                color: "#000", border: "none", borderRadius: 14, padding: "16px",
                fontSize: 15, fontWeight: 900, fontFamily: font, textTransform: "uppercase", letterSpacing: 1,
                opacity: (!email || !email.includes("@")) ? 0.4 : 1, transition: "opacity 0.2s",
              }}>GET EARLY ACCESS →</button>
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.1)", fontFamily: fontMono }}>no spam. just protein. pinky promise 🤙</p>
          </>
        )}
      </div>
    </div>
  );

  return null;
}
