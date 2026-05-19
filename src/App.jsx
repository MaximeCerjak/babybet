import { useState, useEffect } from "react";
import echoSecret from "./assets/echo/echo_secret.png";
import echoJoufflu from "./assets/echo/echo_joufflu.png";
import echoLangue from "./assets/echo/echo_langue.png";
import logo from "./assets/logo.png";
import lotSexe from "./assets/lot_sexe.png";
import lotPoids from "./assets/lot_poids.png";
import lotTaille from "./assets/lot_taille.png";
import lotDate from "./assets/lot_date.png";
import { Scales, Ruler, GenderIntersex, GenderMale, GenderFemale, CalendarDots } from "@phosphor-icons/react";

const SUPABASE_URL = "https://tphimitnaeiikqpistdz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwaGltaXRuYWVpaWtxcGlzdGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMDQwOTIsImV4cCI6MjA5NDY4MDA5Mn0.3pFkOGrBC3sg_SmxRcn5bNLnjR3X6qFP0ZOKTUM01F8";

const LOTS = {
  sexe:   "Une tablée pour deux chez le chef Max !",
  poids:  "Le poids de bébé en gros sel de Noirmoutier (et salicornes, miam) !",
  taille: "On vous invite à boire un coup !",
  date:   "Un calendrier perpétuel et quelques gourmandises !",
};
const LOTS_IMG = {
  sexe:   lotSexe,
  poids:  lotPoids,
  taille: lotTaille,
  date:   lotDate,
};

async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

const getAllBets = () => sbFetch("/paris_naissance?select=*&order=created_at.asc");
const upsertBet = (bet) =>
  sbFetch("/paris_naissance", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=representation",
    body: JSON.stringify({ ...bet, updated_at: new Date().toISOString() }),
  });

const CONFETTI_PIECES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 3}s`,
  duration: `${2.5 + Math.random() * 2}s`,
  color: ["#FFD700","#FF69B4","#87CEEB","#98FB98","#DDA0DD","#F4A460"][i % 6],
  size: `${8 + Math.random() * 8}px`,
  round: Math.random() > 0.5,
}));

const ECHO_PHOTOS = [
  {
    src: echoSecret,
    alt: "Bébé qui chuchote",
    bubble: "Pssst… je suis un garçon !\n…ou pas 🤫",
    top: "80px", right: "calc(50% - 380px)", left: null,
    rotation: "8deg",
    bubbleDir: "left",
  },
  {
    src: echoJoufflu,
    alt: "Bébé joufflu",
    bubble: "J'ai bien mangé pendant ce séjour !",
    top: "180px", left: "calc(50% - 350px)", right: null,
    rotation: "-20deg",
    bubbleDir: "right",
  },
  {
    src: echoLangue,
    alt: "Bébé qui tire la langue",
    bubble: "Suis-je une future farceuse ? 😏",
    top: "210px", right: "calc(50% - 360px)", left: null,
    rotation: "35deg",
    bubbleDir: "left",
  },
];

// Galerie mobile : rangée horizontale scrollable
function MobileGallery() {
  return (
    <div style={{
      width: "100%",
      overflowX: "auto",
      display: "flex",
      gap: 12,
      padding: "0 16px 8px",
      marginBottom: 24,
      scrollbarWidth: "none",
    }}>
      {ECHO_PHOTOS.map((photo, i) => (
        <div key={i} style={{
          flexShrink: 0,
          width: 110,
          background: "#fff",
          padding: "6px 6px 20px",
          borderRadius: 3,
          boxShadow: "0 4px 16px rgba(44,36,32,.12)",
          transform: `rotate(${photo.rotation})`,
        }}>
          <img src={photo.src} alt={photo.alt}
            style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block", borderRadius: 2 }} />
        </div>
      ))}
    </div>
  );
}

// Galerie desktop : photos éparpillées en fond
function EchoGallery() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:2 }}>
      {ECHO_PHOTOS.map((photo, i) => (
        <PolaroidCard key={i} photo={photo} />
      ))}
    </div>
  );
}

function PolaroidCard({ photo }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        top: photo.top,
        ...(photo.left !== null ? { left: photo.left } : { right: photo.right }),
        width: 150,
        overflow: "visible",
        pointerEvents: "auto",
        cursor: "default",
        zIndex: hovered ? 20 : 2,
        transform: hovered ? "rotate(0deg) scale(1.1) translateY(-8px)" : `rotate(${photo.rotation}) scale(1)`,
        transition: "transform 0.4s cubic-bezier(.34,1.56,.64,1), filter 0.3s",
        filter: hovered ? "drop-shadow(0 20px 40px rgba(44,36,32,0.3))" : "drop-shadow(0 6px 16px rgba(44,36,32,0.18))",
        opacity: 0.95,
      }}
    >
      <div style={{ background: "#fff", padding: "8px 8px 28px 8px", borderRadius: 3 }}>
        <img src={photo.src} alt={photo.alt}
          style={{ width:"100%", aspectRatio:"1", objectFit:"cover", display:"block", borderRadius:2 }} />
      </div>
      <div style={{
        position: "absolute", top: "20%",
        ...(photo.bubbleDir === "right" ? { left: "calc(100% + 12px)" } : { right: "calc(100% + 12px)" }),
        width: 170, background: "#2C2420", color: "#fff", borderRadius: 14,
        padding: "10px 14px", fontSize: "0.78rem", lineHeight: 1.5, whiteSpace: "pre-line",
        fontFamily: "'DM Sans', sans-serif", boxShadow: "0 8px 24px rgba(44,36,32,.25)",
        zIndex: 30,
        transformOrigin: photo.bubbleDir === "right" ? "left center" : "right center",
        transform: hovered ? "scale(1) translateY(0)" : "scale(0.6) translateY(6px)",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.25s ease, transform 0.3s cubic-bezier(.34,1.56,.64,1)",
        pointerEvents: "none",
      }}>
        {photo.bubble}
        <div style={{
          position: "absolute", top: "50%", transform: "translateY(-50%)",
          ...(photo.bubbleDir === "right"
            ? { left: -7, borderRight: "8px solid #2C2420", borderTop: "7px solid transparent", borderBottom: "7px solid transparent" }
            : { right: -7, borderLeft: "8px solid #2C2420", borderTop: "7px solid transparent", borderBottom: "7px solid transparent" }
          ),
          width: 0, height: 0,
        }} />
      </div>
    </div>
  );
}

function Confettis() {
  return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:0 }}>
      {CONFETTI_PIECES.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:p.left, top:"-20px",
          width:p.size, height:p.size, backgroundColor:p.color,
          borderRadius: p.round ? "50%" : "0",
          animation:`fall ${p.duration} ${p.delay} linear infinite`,
        }} />
      ))}
    </div>
  );
}

function BetCard({ title, icon: Icon, lot, lotKey, done, children }) {
  return (
    <div style={{
      background: done ? "#F4FAF5" : "#fff",
      borderRadius:20, padding:"20px 24px 24px",
      width:"100%", maxWidth:480, marginBottom:16,
      boxShadow:"0 8px 32px rgba(44,36,32,.10)",
      border:`2px solid ${done ? "#B5CDB9" : "transparent"}`,
      transition:"all .3s",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <Icon size={28} weight="duotone" color="#D4A843" style={{ flexShrink:0 }} />
        <h3 style={{ fontFamily:"Playfair Display,serif", fontSize:"1.1rem" }}>{title}</h3>
      </div>
      {children}
      <div style={{ textAlign:"center", marginTop:16, position:"relative" }}>
        <img src={LOTS_IMG[lotKey]} alt={lot}
          style={{ width:180, objectFit:"cover", borderRadius:16, boxShadow:"0 4px 16px rgba(44,36,32,.12)" }} />
        <p style={{ fontSize:"0.78rem", color:"#8B7B74", marginTop:8 }}>
          Lot · <strong style={{ color:"#2C2420" }}>{lot}</strong>
        </p>
        {done && (
          <span style={{ position:"absolute", top:0, right:0, width:28,height:28,borderRadius:"50%",background:"#B5CDB9",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold",fontSize:"0.9rem" }}>✓</span>
        )}
      </div>
    </div>
  );
}

function AllBetsModal({ bets, onClose }) {
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(44,36,32,.5)",backdropFilter:"blur(4px)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff",borderRadius:20,padding:32,maxWidth:500,width:"100%",maxHeight:"85vh",overflowY:"auto",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:16,right:16,background:"#EDE8E4",border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:"1rem" }}>✕</button>
        <h2 style={{ fontFamily:"Playfair Display,serif",fontSize:"1.5rem",marginBottom:20 }}>Tous les paris</h2>
        {bets.length === 0
          ? <p style={{ color:"#8B7B74",textAlign:"center",padding:"20px 0" }}>Aucun pari pour l'instant !</p>
          : bets.map((b) => (
            <div key={b.id} style={{ background:"#FFF8F0",borderRadius:12,padding:"14px 16px",marginBottom:10 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8,fontWeight:500 }}>
                <span style={{ width:32,height:32,borderRadius:"50%",background:"#2C2420",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.85rem",fontWeight:700,flexShrink:0 }}>
                  {b.prenom[0]?.toUpperCase()}
                </span>
                <strong>{b.prenom}</strong>
              </div>
              <div style={{ display:"flex",gap:16,fontSize:"0.85rem",color:"#8B7B74",flexWrap:"wrap" }}>
                <span style={{display:"flex",alignItems:"center",gap:4}}>
                  {b.sexe === "garcon" ? <GenderMale size={16} weight="duotone" color="#2980B9" /> : <GenderFemale size={16} weight="duotone" color="#C0392B" />}
                  {b.sexe === "garcon" ? "Garçon" : "Fille"}
                </span>
                <span>{b.poids} kg</span>
                <span>{b.taille} cm</span>
                {b.date_naissance && <span>{new Date(b.date_naissance).toLocaleDateString("fr-FR")}</span>}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

function ResultsModal({ bets, results, onClose }) {
  const realPoids  = parseFloat(results.poids);
  const realTaille = parseInt(results.taille);
  const realDate   = results.date_naissance;

  const diffsPoids  = bets.map(b => Math.abs(parseFloat(b.poids) - realPoids));
  const minDiffPoids = Math.min(...diffsPoids);
  const winnersPoidsExact = diffsPoids.some(d => d <= 0.01);
  const poidsWinners = winnersPoidsExact
    ? bets.filter(b => Math.abs(parseFloat(b.poids) - realPoids) <= 0.01)
    : bets.filter((_, i) => diffsPoids[i] === minDiffPoids);

  const diffsTaille  = bets.map(b => Math.abs(parseInt(b.taille) - realTaille));
  const minDiffTaille = Math.min(...diffsTaille);
  const tailleExact = diffsTaille.some(d => d <= 1);
  const tailleWinners = tailleExact
    ? bets.filter(b => Math.abs(parseInt(b.taille) - realTaille) <= 1)
    : bets.filter((_, i) => diffsTaille[i] === minDiffTaille);

  // Date : exact = même jour, sinon le plus proche en jours
  const diffsDate = bets.map(b => b.date_naissance
    ? Math.abs(new Date(b.date_naissance) - new Date(realDate)) / 86400000
    : Infinity);
  const minDiffDate = Math.min(...diffsDate);
  const dateExact = diffsDate.some(d => d === 0);
  const dateWinners = dateExact
    ? bets.filter(b => b.date_naissance === realDate)
    : bets.filter((_, i) => diffsDate[i] === minDiffDate && diffsDate[i] !== Infinity);

  const winners = {
    sexe:   bets.filter(b => b.sexe === results.sexe),
    poids:  poidsWinners,
    taille: tailleWinners,
    date:   dateWinners,
  };

  const catLabels = {
    sexe:   null,
    poids:  winnersPoidsExact ? null : `(plus proche : ${(minDiffPoids * 1000).toFixed(0)}g d'écart)`,
    taille: tailleExact ? null : `(plus proche : ${minDiffTaille}cm d'écart)`,
    date:   dateExact ? null : `(plus proche : ${minDiffDate === 1 ? "1 jour" : `${minDiffDate} jours`} d'écart)`,
  };

  const score = b => (
    (b.sexe === results.sexe ? 1 : 0) +
    (poidsWinners.includes(b) ? 1 : 0) +
    (tailleWinners.includes(b) ? 1 : 0) +
    (dateWinners.includes(b) ? 1 : 0)
  );
  const ranked = [...bets].sort((a, b) => score(b) - score(a));

  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(44,36,32,.5)",backdropFilter:"blur(4px)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff",borderRadius:20,padding:32,maxWidth:540,width:"100%",maxHeight:"88vh",overflowY:"auto",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:16,right:16,background:"#EDE8E4",border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:"1rem" }}>✕</button>
        <h2 style={{ fontFamily:"Playfair Display,serif",fontSize:"1.5rem",marginBottom:20 }}>Résultats !</h2>
        <div style={{ background:"#2C2420",color:"#fff",borderRadius:16,padding:20,marginBottom:24,textAlign:"center" }}>
          <h3 style={{ fontFamily:"Playfair Display,serif",marginBottom:12 }}>Le bébé est arrivé !</h3>
          <div style={{ display:"flex",justifyContent:"center",gap:20,flexWrap:"wrap" }}>
            <span style={{display:"flex",alignItems:"center",gap:6}}>
              {results.sexe === "garcon" ? <GenderMale size={20} weight="duotone" color="#fff" /> : <GenderFemale size={20} weight="duotone" color="#fff" />}
              {results.sexe === "garcon" ? "Garçon" : "Fille"}
            </span>
            <span>{results.poids} kg</span>
            <span>{results.taille} cm</span>
            {results.date_naissance && <span>{new Date(results.date_naissance).toLocaleDateString("fr-FR")}</span>}
          </div>
        </div>
        {[["sexe","Sexe"],["poids","Poids"],["taille","Taille"],["date","Date"]].map(([cat, label]) => (
          <div key={cat} style={{ marginBottom:20,paddingBottom:20,borderBottom:"1px solid #EDE8E4" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
              <strong>{label}</strong>
              <span style={{ display:"flex",alignItems:"center",gap:6,fontSize:"0.78rem",color:"#8B7B74" }}>
                <img src={LOTS_IMG[cat]} alt="" style={{ width:32,height:32,objectFit:"contain",borderRadius:6 }} />
                {LOTS[cat]}
              </span>
            </div>
            {winners[cat].length === 0
              ? <p style={{ color:"#8B7B74",fontSize:"0.9rem" }}>Pas de gagnant</p>
              : <>
                  {catLabels[cat] && <p style={{ fontSize:"0.75rem",color:"#8B7B74",marginBottom:8,fontStyle:"italic" }}>{catLabels[cat]}</p>}
                  <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                    {winners[cat].map((w,i) => (
                      <span key={i} style={{ background:"#D4A843",color:"#fff",borderRadius:50,padding:"6px 14px",fontSize:"0.85rem",fontWeight:500 }}>🏅 {w.prenom}</span>
                    ))}
                  </div>
                </>
            }
          </div>
        ))}
        <div>
          <strong style={{ display:"block",marginBottom:12 }}>Classement général</strong>
          {ranked.map((b,i) => (
            <div key={b.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:"1px solid #F5F0EC",fontSize:"0.95rem" }}>
              <span style={{ fontSize:"1.2rem",width:28 }}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}.`}</span>
              <span>{b.prenom}</span>
              <span style={{ marginLeft:"auto",fontWeight:600,color:"#D4A843" }}>{score(b)}/4 pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [bets, setBets]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState(null);
  const [prenom, setPrenom]           = useState("");
  const [step, setStep]               = useState("name");
  const [currentBet, setCurrentBet]   = useState({ sexe: null, poids: "", taille: "", date_naissance: "" });
  const [showAll, setShowAll]         = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults]         = useState({ sexe: "fille", poids: "", taille: "", date_naissance: "" });
  const [adminMode, setAdminMode]     = useState(false);
  const [adminCode, setAdminCode]     = useState("");
  const [adminError, setAdminError]   = useState(false);
  const [shake, setShake]             = useState(false);
  const [isMobile, setIsMobile]       = useState(false);

  useEffect(() => {
    getAllBets()
      .then(setBets)
      .catch(e => setError("Impossible de charger les paris : " + e.message))
      .finally(() => setLoading(false));
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const existingBet = bets.find(b => b.prenom.toLowerCase() === prenom.trim().toLowerCase());
  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 500); };

  const handleStart = () => {
    if (!prenom.trim()) { triggerShake(); return; }
    if (existingBet) setCurrentBet({
      sexe: existingBet.sexe,
      poids: String(existingBet.poids),
      taille: String(existingBet.taille),
      date_naissance: existingBet.date_naissance || "",
    });
    setStep("bets");
  };

  const handleSubmit = async () => {
    setSaving(true); setError(null);
    try {
      await upsertBet({
        prenom: prenom.trim(),
        sexe: currentBet.sexe,
        poids: parseFloat(currentBet.poids),
        taille: parseInt(currentBet.taille),
        date_naissance: currentBet.date_naissance || null,
      });
      setBets(await getAllBets());
      setStep("done");
    } catch (e) {
      setError("Erreur lors de l'enregistrement : " + e.message);
    } finally { setSaving(false); }
  };

  const handleAdmin = () => {
    if (adminCode === "bebe2026") { setAdminMode(true); setAdminCode(""); setAdminError(false); }
    else setAdminError(true);
  };

  const betsValid = currentBet.sexe
    && currentBet.poids && parseFloat(currentBet.poids) >= 1 && parseFloat(currentBet.poids) <= 6
    && currentBet.taille && parseInt(currentBet.taille) >= 30 && parseInt(currentBet.taille) <= 65
    && currentBet.date_naissance;

  const inputSt = (extra = {}) => ({
    width:"100%", padding:"14px 18px", border:"2px solid #EDE8E4", borderRadius:12,
    fontFamily:"DM Sans,sans-serif", fontSize:"1rem", color:"#2C2420", background:"#FFF8F0",
    outline:"none", transition:"border-color .2s", ...extra,
  });
  const btnP = (extra = {}) => ({
    display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8,
    padding:"14px 28px", borderRadius:50, fontFamily:"DM Sans,sans-serif", fontSize:"1rem",
    fontWeight:500, cursor:"pointer", border:"none", background:"#2C2420", color:"#fff",
    transition:"all .2s", width:"100%", ...extra,
  });
  const btnG = (extra = {}) => ({ ...btnP(), background:"transparent", color:"#8B7B74", border:"2px solid #EDE8E4", width:"auto", ...extra });
  const sexBtn = (active, variant) => ({
    padding:"20px 12px", borderRadius:16, cursor:"pointer", textAlign:"center",
    fontFamily:"DM Sans,sans-serif", fontSize:"0.95rem", fontWeight:500, flex:1,
    border:`2.5px solid ${active ? (variant==="garcon" ? "#87CEEB" : "#F7C5C5") : "#EDE8E4"}`,
    background: active ? (variant==="garcon" ? "#EBF7FF" : "#FFF0F0") : "#FFF8F0",
    color: active ? (variant==="garcon" ? "#2980B9" : "#C0392B") : "#8B7B74",
    transition:"all .2s",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FFF8F0; font-family: 'DM Sans', sans-serif; color: #2C2420; min-height: 100vh; overflow-x: hidden; }
        @keyframes fall { 0% { transform: translateY(-20px) rotate(0deg); opacity:1; } 100% { transform: translateY(110vh) rotate(720deg); opacity:0; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        @keyframes shake { 0%,100% { transform:translateX(0); } 25% { transform:translateX(-8px); } 75% { transform:translateX(8px); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        .fadeUp { animation: fadeUp 0.7s ease both; }
        input:focus { border-color: #D4A843 !important; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
        details summary { list-style: none; }
        details summary::-webkit-details-marker { display: none; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {step === "done" && <Confettis />}
      {step === "name" && !isMobile && <EchoGallery />}

      <div style={{ position:"relative", zIndex:3, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", padding:"32px 16px 100px" }}>

        {step === "name" && (
          <div className="fadeUp" style={{ textAlign:"center", marginBottom: isMobile ? 16 : 36, width:"100%" }}>
            {/* Galerie mobile au-dessus du logo */}
            {isMobile && <MobileGallery />}
            <img src={logo} alt="Logo" style={{ width:120, display:"block", margin:"0 auto 12px", animation:"bounce 2s ease-in-out infinite" }} />
            <h1 style={{ fontFamily:"Playfair Display,serif", fontSize:"clamp(2rem,5vw,3rem)", fontWeight:700, lineHeight:1.15, marginBottom:8 }}>
              Les paris de<br /><em>bébé</em>
            </h1>
            <p style={{ fontSize:"1rem", color:"#8B7B74", fontWeight:300 }}>Tentez votre chance et gagnez de beaux lots !</p>
          </div>
        )}

        {step === "name" && !loading && (
          <div className="fadeUp" style={{ background:"#2C2420", color:"#fff", borderRadius:50, padding:"10px 28px", fontSize:"0.9rem", marginBottom:28, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontFamily:"Playfair Display,serif", fontSize:"1.4rem", color:"#D4A843" }}>{bets.length}</span>
            {bets.length <= 1 ? "pari enregistré" : "paris enregistrés"}
          </div>
        )}

        {loading && (
          <div style={{ textAlign:"center", padding:40, color:"#8B7B74" }}>
            <div style={{ width:32, height:32, border:"3px solid #EDE8E4", borderTopColor:"#D4A843", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }} />
            Chargement des paris…
          </div>
        )}

        {error && (
          <div style={{ background:"#FDECEA", border:"1px solid #F5C6CB", borderRadius:12, padding:"12px 18px", marginBottom:16, color:"#C0392B", maxWidth:480, width:"100%", fontSize:"0.9rem" }}>
            {error}
          </div>
        )}

        {/* STEP: name */}
        {!loading && step === "name" && (
          <>
            <div className="fadeUp" style={{ background:"rgba(255,255,255,0.92)", backdropFilter:"blur(8px)", borderRadius:20, boxShadow:"0 8px 32px rgba(44,36,32,.10)", padding:32, width:"100%", maxWidth:480 }}>
              <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:"1.4rem", marginBottom:20 }}>Votre prénom 👋</h2>
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:"0.85rem", fontWeight:500, color:"#8B7B74", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Qui êtes-vous ?</label>
                <input
                  style={inputSt(shake ? { animation:"shake .4s ease", borderColor:"#E57373" } : {})}
                  type="text" placeholder="Ex : Mamie Dodo, Papi Jef…"
                  value={prenom} onChange={e => setPrenom(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleStart()} autoFocus
                />
              </div>
              {existingBet && <p style={{ fontSize:"0.85rem", color:"#D4A843", marginBottom:12 }}>Vous avez déjà un pari ! Vous pouvez le modifier.</p>}
              <button style={btnP()} onClick={handleStart}>{existingBet ? "Modifier mon pari" : "Placer mon pari"} →</button>
            </div>

            <details style={{ width:"100%", maxWidth:480, marginTop:16 }}>
              <summary style={{ fontSize:"0.8rem", color:"#8B7B74", cursor:"pointer", textAlign:"center", padding:8 }}>⚙️ Administration</summary>
              <div style={{ background:"rgba(255,255,255,0.92)", backdropFilter:"blur(8px)", borderRadius:20, padding:20, marginTop:8, boxShadow:"0 8px 32px rgba(44,36,32,.10)" }}>
                {!adminMode ? (
                  <>
                    <h4 style={{ fontFamily:"Playfair Display,serif", marginBottom:14 }}>Accès administrateur</h4>
                    <div style={{ display:"flex", gap:8 }}>
                      <input type="password" placeholder="Code secret" value={adminCode}
                        onChange={e => { setAdminCode(e.target.value); setAdminError(false); }}
                        onKeyDown={e => e.key === "Enter" && handleAdmin()}
                        style={inputSt(adminError ? { borderColor:"#E57373" } : {})} />
                      <button onClick={handleAdmin} style={btnG({ flexShrink:0 })}>OK</button>
                    </div>
                    {adminError && <p style={{ fontSize:"0.8rem", color:"#E57373", marginTop:6 }}>Code incorrect</p>}
                  </>
                ) : (
                  <>
                    <h4 style={{ fontFamily:"Playfair Display,serif", marginBottom:14 }}>Révéler les résultats</h4>
                    <p style={{ fontSize:"0.82rem", color:"#8B7B74", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:10 }}>Données réelles du bébé</p>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                      {["garcon","fille"].map(v => (
                        <button key={v} onClick={() => setResults(r => ({ ...r, sexe: v }))} style={sexBtn(results.sexe===v, v)}>
                          {v === "garcon"
                            ? <GenderMale size={40} weight="duotone" color={results.sexe==="garcon" ? "#2980B9" : "#B5A89E"} style={{ display:"block", margin:"0 auto 6px" }} />
                            : <GenderFemale size={40} weight="duotone" color={results.sexe==="fille" ? "#C0392B" : "#B5A89E"} style={{ display:"block", margin:"0 auto 6px" }} />
                          }
                          {v === "garcon" ? "Garçon" : "Fille"}
                        </button>
                      ))}
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                      <div>
                        <label style={{ display:"block", fontSize:"0.82rem", color:"#8B7B74", marginBottom:6 }}>Poids (kg)</label>
                        <input type="number" step="0.01" min="1" max="6" placeholder="3.45" value={results.poids} onChange={e => setResults(r => ({ ...r, poids: e.target.value }))} style={inputSt()} />
                      </div>
                      <div>
                        <label style={{ display:"block", fontSize:"0.82rem", color:"#8B7B74", marginBottom:6 }}>Taille (cm)</label>
                        <input type="number" min="30" max="65" placeholder="50" value={results.taille} onChange={e => setResults(r => ({ ...r, taille: e.target.value }))} style={inputSt()} />
                      </div>
                    </div>
                    <div style={{ marginBottom:14 }}>
                      <label style={{ display:"block", fontSize:"0.82rem", color:"#8B7B74", marginBottom:6 }}>Date de naissance</label>
                      <input type="date" value={results.date_naissance} onChange={e => setResults(r => ({ ...r, date_naissance: e.target.value }))} style={inputSt()} />
                    </div>
                    <button onClick={() => results.poids && results.taille && results.date_naissance && setShowResults(true)}
                      disabled={!results.poids || !results.taille || !results.date_naissance}
                      style={btnP({ background:"#D4A843", opacity: results.poids && results.taille && results.date_naissance ? 1 : 0.5 })}>
                      Voir les gagnants
                    </button>
                  </>
                )}
              </div>
            </details>
          </>
        )}

        {/* STEP: bets */}
        {step === "bets" && (
          <>
            <div className="fadeUp" style={{ width:"100%", maxWidth:480, marginBottom:24 }}>
              <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:"1.6rem", marginBottom:4 }}>Vos pronostics, {prenom}</h2>
              <p style={{ color:"#8B7B74", fontSize:"0.9rem" }}>Remplissez les 4 critères pour valider</p>
            </div>

            <BetCard title="Le sexe" icon={GenderIntersex} lot={LOTS.sexe} lotKey="sexe" done={!!currentBet.sexe}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {["garcon","fille"].map(v => (
                  <button key={v} onClick={() => setCurrentBet(b => ({ ...b, sexe: v }))} style={sexBtn(currentBet.sexe===v, v)}>
                    {v === "garcon"
                      ? <GenderMale size={40} weight="duotone" color={currentBet.sexe==="garcon" ? "#2980B9" : "#B5A89E"} style={{ display:"block", margin:"0 auto 6px" }} />
                      : <GenderFemale size={40} weight="duotone" color={currentBet.sexe==="fille" ? "#C0392B" : "#B5A89E"} style={{ display:"block", margin:"0 auto 6px" }} />
                    }
                    {v === "garcon" ? "Garçon" : "Fille"}
                  </button>
                ))}
              </div>
            </BetCard>

            <BetCard title="Le poids" icon={Scales} lot={LOTS.poids} lotKey="poids" done={currentBet.poids && parseFloat(currentBet.poids) >= 1}>
              <input type="number" step="0.001" min="1" max="6" placeholder="3.310" value={currentBet.poids}
                onChange={e => setCurrentBet(b => ({ ...b, poids: e.target.value }))} style={inputSt()} />
              <p style={{ fontSize:"0.78rem", color:"#8B7B74", marginTop:6 }}>En kilogrammes · Tolérance ± 10g</p>
            </BetCard>

            <BetCard title="La taille" icon={Ruler} lot={LOTS.taille} lotKey="taille" done={currentBet.taille && parseInt(currentBet.taille) >= 30}>
              <input type="number" step="1" min="30" max="65" placeholder="50" value={currentBet.taille}
                onChange={e => setCurrentBet(b => ({ ...b, taille: e.target.value }))} style={inputSt()} />
              <p style={{ fontSize:"0.78rem", color:"#8B7B74", marginTop:6 }}>En centimètres · Tolérance ± 1cm</p>
            </BetCard>

            <BetCard title="La date de naissance" icon={CalendarDots} lot={LOTS.date} lotKey="date" done={!!currentBet.date_naissance}>
              <input type="date" value={currentBet.date_naissance}
                onChange={e => setCurrentBet(b => ({ ...b, date_naissance: e.target.value }))} style={inputSt()} />
              <p style={{ fontSize:"0.78rem", color:"#8B7B74", marginTop:6 }}>Même jour = gagnant, sinon le plus proche l'emporte</p>
            </BetCard>

            <div style={{ display:"flex", gap:10, width:"100%", maxWidth:480 }}>
              <button onClick={() => setStep("name")} style={btnG()}>← Retour</button>
              <button onClick={() => betsValid && setStep("confirm")} disabled={!betsValid}
                style={btnP({ flex:1, opacity: betsValid ? 1 : 0.5 })}>
                Confirmer mon pari ✓
              </button>
            </div>
          </>
        )}

        {/* STEP: confirm */}
        {step === "confirm" && (
          <div className="fadeUp" style={{ background:"#fff", borderRadius:20, boxShadow:"0 8px 32px rgba(44,36,32,.10)", padding:32, width:"100%", maxWidth:480, textAlign:"center" }}>
            <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:"1.4rem", marginBottom:8 }}>Récapitulatif</h2>
            <p style={{ color:"#8B7B74", marginBottom:20, fontSize:"0.9rem" }}>Vérifiez votre pari avant de valider</p>
            {[
              { label:"Sexe",             value: currentBet.sexe === "garcon" ? "Garçon" : "Fille",                             lotKey:"sexe" },
              { label:"Poids",            value: `${currentBet.poids} kg`,                                                       lotKey:"poids" },
              { label:"Taille",           value: `${currentBet.taille} cm`,                                                      lotKey:"taille" },
              { label:"Date de naissance", value: new Date(currentBet.date_naissance).toLocaleDateString("fr-FR"),               lotKey:"date" },
            ].map(row => (
              <div key={row.label} style={{ padding:"14px 0", borderBottom:"1px solid #EDE8E4", textAlign:"left" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ color:"#8B7B74", fontSize:"0.9rem" }}>{row.label}</span>
                  <strong>{row.value}</strong>
                </div>
                <div style={{ fontSize:"0.75rem", color:"#D4A843", display:"flex", alignItems:"center", gap:5 }}>
                  <img src={LOTS_IMG[row.lotKey]} alt="" style={{ width:16, height:16, objectFit:"contain" }} />
                  {LOTS[row.lotKey]}
                </div>
              </div>
            ))}
            <div style={{ display:"flex", gap:10, marginTop:24 }}>
              <button onClick={() => setStep("bets")} style={btnG({ flex:1 })}>← Modifier</button>
              <button onClick={handleSubmit} disabled={saving}
                style={btnP({ flex:1, background:"#D4A843", opacity: saving ? 0.7 : 1 })}>
                {saving ? "Enregistrement…" : "Valider !"}
              </button>
            </div>
          </div>
        )}

        {/* STEP: done */}
        {step === "done" && (
          <div className="fadeUp" style={{ textAlign:"center", padding:20 }}>
            <span style={{ fontSize:80, display:"block", marginBottom:16 }}>🎊</span>
            <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:"2rem", marginBottom:12 }}>Pari enregistré !</h2>
            <p style={{ color:"#8B7B74", marginBottom:32, lineHeight:1.6 }}>
              Merci <strong>{prenom}</strong> !<br />
              Rendez-vous à la naissance pour les résultats.
            </p>
            <div style={{ background:"#fff", borderRadius:20, padding:24, marginBottom:24, boxShadow:"0 8px 32px rgba(44,36,32,.10)", textAlign:"left" }}>
              <h3 style={{ fontFamily:"Playfair Display,serif", fontSize:"1rem", marginBottom:12 }}>Votre pari</h3>
              {[
                { label:"Sexe",   value: currentBet.sexe === "garcon" ? "Garçon" : "Fille" },
                { label:"Poids",  value: `${currentBet.poids} kg` },
                { label:"Taille", value: `${currentBet.taille} cm` },
                { label:"Date",   value: new Date(currentBet.date_naissance).toLocaleDateString("fr-FR") },
              ].map(row => (
                <div key={row.label} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #EDE8E4", fontSize:"0.95rem" }}>
                  <span style={{ color:"#8B7B74" }}>{row.label}</span>
                  <strong>{row.value}</strong>
                </div>
              ))}
            </div>
            <button onClick={() => { setStep("name"); setPrenom(""); setCurrentBet({ sexe:null, poids:"", taille:"", date_naissance:"" }); }} style={btnG()}>
              ← Retour à l'accueil
            </button>
          </div>
        )}
      </div>

      {step === "name" && !loading && bets.length > 0 && (
        <div style={{ position:"fixed", bottom:20, left:"50%", transform:"translateX(-50%)", zIndex:10 }}>
          <button onClick={() => setShowAll(true)}
            style={btnG({ background:"#fff", boxShadow:"0 4px 16px rgba(0,0,0,.12)", border:"1px solid #EDE8E4" })}>
            Voir tous les paris ({bets.length})
          </button>
        </div>
      )}

      {showAll     && <AllBetsModal bets={bets} onClose={() => setShowAll(false)} />}
      {showResults && <ResultsModal bets={bets} results={results} onClose={() => setShowResults(false)} />}
    </>
  );
}