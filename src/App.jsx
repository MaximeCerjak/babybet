import { useState, useEffect } from "react";
import echoSecret from "./assets/echo/echo_secret.png";
import echoJoufflu from "./assets/echo/echo_joufflu.png";
import echoLangue from "./assets/echo/echo_langue.png";
import logo from "./assets/logo.png";
import lotSexe from "./assets/lot_sexe.png";
import lotPoids from "./assets/lot_poids.png";
import lotTaille from "./assets/lot_taille.png";
import lotDate from "./assets/lot_date.png";
import babyPhoto from "./assets/bebe.jpg";
import { GenderMale, GenderFemale } from "@phosphor-icons/react";
import bets from "./data/bets.json";
import { results } from "./data/results.js";

// --- Données figées ---------------------------------------------------
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

// --- Présentation du bébé ------------------------------------------------
function BabyIntro({ results }) {
  const dateAffichee = results.date_naissance
    ? new Date(results.date_naissance).toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" })
    : null;

  return (
    <div className="fadeUp" style={{ background:"#fff", borderRadius:24, boxShadow:"0 8px 32px rgba(44,36,32,.10)", padding:32, width:"100%", maxWidth:540, marginBottom:24, textAlign:"center" }}>
      <img
        src={babyPhoto}
        alt={results.prenom || "Bébé"}
        style={{
          width:180, height:180, objectFit:"cover", borderRadius:"50%",
          margin:"0 auto 20px", display:"block",
          border:"6px solid #FFF8F0", boxShadow:"0 8px 24px rgba(44,36,32,.18)",
        }}
      />
      <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:"2rem", marginBottom:6 }}>
        {results.prenom || "Notre fille"}
      </h2>
      <p style={{ color:"#8B7B74", fontSize:"0.95rem", marginBottom:20 }}>
        {results.sexe === "garcon" ? <GenderMale size={18} weight="duotone" color="#2980B9" style={{ verticalAlign:"-3px", marginRight:4 }} /> : <GenderFemale size={18} weight="duotone" color="#C0392B" style={{ verticalAlign:"-3px", marginRight:4 }} />}
        Née le {dateAffichee}{results.heure_naissance ? ` à ${results.heure_naissance}` : ""}
      </p>
      <div style={{ display:"flex", justifyContent:"center", gap:28, flexWrap:"wrap" }}>
        <div>
          <div style={{ fontFamily:"Playfair Display,serif", fontSize:"1.3rem" }}>{results.poids} kg</div>
          <div style={{ fontSize:"0.75rem", color:"#8B7B74", textTransform:"uppercase", letterSpacing:"0.05em" }}>Poids</div>
        </div>
        <div>
          <div style={{ fontFamily:"Playfair Display,serif", fontSize:"1.3rem" }}>{results.taille} cm</div>
          <div style={{ fontSize:"0.75rem", color:"#8B7B74", textTransform:"uppercase", letterSpacing:"0.05em" }}>Taille</div>
        </div>
      </div>
    </div>
  );
}

// --- Calcul des gagnants et du classement -------------------------------
// Règles (inchangées) :
//  - Sexe : 1 pt si deviné exactement.
//  - Poids : 1 pt si écart ≤ 10g, sinon le(s) plus proche(s) l'emporte(nt).
//  - Taille : 1 pt si écart ≤ 1cm, sinon le(s) plus proche(s) l'emporte(nt).
//  - Date : 1 pt si jour exact, sinon le(s) plus proche(s) l'emporte(nt).
//
// Note : la vraie taille peut comporter une décimale (ex: 49.5cm) alors que
// les paris sont toujours des entiers. On arrondit donc la vraie taille au
// centimètre le plus proche (Math.round) plutôt que de la tronquer.
function computeResults(bets, results) {
  const realPoids  = parseFloat(results.poids);
  const realTaille = parseFloat(results.taille);
  const realDate   = results.date_naissance;

  const diffsPoids  = bets.map(b => Math.abs(parseFloat(b.poids) - realPoids));
  const minDiffPoids = bets.length ? Math.min(...diffsPoids) : null;
  const winnersPoidsExact = diffsPoids.some(d => d <= 0.01);
  const poidsWinners = winnersPoidsExact
    ? bets.filter(b => Math.abs(parseFloat(b.poids) - realPoids) <= 0.01)
    : bets.filter((_, i) => diffsPoids[i] === minDiffPoids);

  const diffsTaille  = bets.map(b => Math.abs(parseInt(b.taille) - realTaille));
  const minDiffTaille = bets.length ? Math.min(...diffsTaille) : null;
  const tailleExact = diffsTaille.some(d => d <= 1);
  const tailleWinners = tailleExact
    ? bets.filter(b => Math.abs(parseInt(b.taille) - realTaille) <= 1)
    : bets.filter((_, i) => diffsTaille[i] === minDiffTaille);

  const diffsDate = bets.map(b => b.date_naissance
    ? Math.abs(new Date(b.date_naissance) - new Date(realDate)) / 86400000
    : Infinity);
  const minDiffDate = bets.length ? Math.min(...diffsDate) : null;
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

  return { winners, catLabels, score, ranked };
}

function ResultsSection({ bets, results }) {
  const { winners, catLabels, score, ranked } = computeResults(bets, results);

  return (
    <div className="fadeUp" style={{ background:"#fff",borderRadius:20,boxShadow:"0 8px 32px rgba(44,36,32,.10)",padding:32,width:"100%",maxWidth:540,marginBottom:24 }}>
      <h3 style={{ fontFamily:"Playfair Display,serif", fontSize:"1.3rem", marginBottom:20 }}>Résultats des paris</h3>

      {bets.length === 0
        ? <p style={{ color:"#8B7B74",textAlign:"center",padding:"12px 0 20px" }}>Aucun pari n'a été enregistré.</p>
        : <>
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
          </>
      }
    </div>
  );
}

function AllBetsSection({ bets }) {
  return (
    <details className="fadeUp" style={{ width:"100%", maxWidth:540, marginBottom:40 }}>
      <summary style={{ fontSize:"0.9rem", color:"#8B7B74", cursor:"pointer", textAlign:"center", padding:10, fontWeight:500 }}>
        Voir tous les paris ({bets.length})
      </summary>
      <div style={{ background:"#fff",borderRadius:20,boxShadow:"0 8px 32px rgba(44,36,32,.10)",padding:24,marginTop:8 }}>
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
    </details>
  );
}

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FFF8F0; font-family: 'DM Sans', sans-serif; color: #2C2420; min-height: 100vh; overflow-x: hidden; }
        @keyframes fall { 0% { transform: translateY(-20px) rotate(0deg); opacity:1; } 100% { transform: translateY(110vh) rotate(720deg); opacity:0; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        .fadeUp { animation: fadeUp 0.7s ease both; }
        details summary { list-style: none; }
        details summary::-webkit-details-marker { display: none; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <Confettis />
      {!isMobile && <EchoGallery />}

      <div style={{ position:"relative", zIndex:3, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", padding:"32px 16px 100px" }}>
        <div className="fadeUp" style={{ textAlign:"center", marginBottom: isMobile ? 16 : 36, width:"100%" }}>
          {isMobile && <MobileGallery />}
          <img src={logo} alt="Logo" style={{ width:120, display:"block", margin:"0 auto 12px", animation:"bounce 2s ease-in-out infinite" }} />
          <h1 style={{ fontFamily:"Playfair Display,serif", fontSize:"clamp(2rem,5vw,3rem)", fontWeight:700, lineHeight:1.15, marginBottom:8 }}>
            Les paris de<br /><em>bébé</em>
          </h1>
          <p style={{ fontSize:"1rem", color:"#8B7B74", fontWeight:300 }}>Merci à tous pour vos pronostics, voici les résultats !</p>
        </div>

        <BabyIntro results={results} />
        <ResultsSection bets={bets} results={results} />
        <AllBetsSection bets={bets} />
      </div>
    </>
  );
}