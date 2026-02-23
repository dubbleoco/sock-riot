import { useState, useEffect, useRef } from "react";

const PRODUCTS = [
  { id: 1, name: "Fuck Off, I'm Reading", cat: "Women's Crew", price: 14.99, tag: "BESTSELLER", accent: "#E8423F", bg: "#FFF0EF", humor: "sweary", desc: "For when you need a socially acceptable way to tell everyone to leave you alone with your book." },
  { id: 2, name: "This Meeting Is Bullshit", cat: "Men's Crew", price: 15.99, tag: "STAFF PICK", accent: "#E87D3E", bg: "#FFF4EC", humor: "sweary", desc: "The universal truth, now available for your feet. Wear them to your next standup." },
  { id: 3, name: "Dog Person", cat: "Women's Ankle", price: 13.99, tag: null, accent: "#4BA364", bg: "#EEFBF2", humor: "wholesome", desc: "You've chosen your side. Now let your ankles do the talking." },
  { id: 4, name: "Turns Out I'm Tough As Shit", cat: "Women's Crew", price: 14.99, tag: "NEW", accent: "#9B59B6", bg: "#F6F0FA", humor: "sweary", desc: "Plot twist: you survived all of it. Celebrate with unnecessarily comfortable socks." },
  { id: 5, name: "Take No Shit Give No Fucks", cat: "Women's Crew", price: 14.99, tag: "BESTSELLER", accent: "#E8423F", bg: "#FFF0EF", humor: "sweary", desc: "The mantra. The lifestyle. The socks." },
  { id: 6, name: "Most Likely To Say It To Your Face", cat: "Women's Crew", price: 14.99, tag: null, accent: "#D4A017", bg: "#FFFCEE", humor: "sarcastic", desc: "Voted most likely by everyone who's ever met you." },
  { id: 7, name: "Bird Lady", cat: "Women's Ankle", price: 13.99, tag: "NEW", accent: "#2F9CAD", bg: "#EDF9FB", humor: "wholesome", desc: "You know who you are. The birds know who you are. Embrace it." },
  { id: 8, name: "Have You Tried Screaming???", cat: "Women's Ankle", price: 13.99, tag: "NEW", accent: "#D64BA0", bg: "#FDF0F8", humor: "sarcastic", desc: "Wellness tip: sometimes you just need to let it out. Preferably into a pillow." },
  { id: 9, name: "Fuck Work", cat: "Men's Crew", price: 15.99, tag: null, accent: "#E8423F", bg: "#FFF0EF", humor: "sweary", desc: "Monday through Friday mood. Saturday and Sunday too, honestly." },
  { id: 10, name: "Sisters Are The Shit", cat: "Women's Crew", price: 14.99, tag: null, accent: "#E87D3E", bg: "#FFF4EC", humor: "sweary", desc: "The perfect gift that says 'I love you' and 'I'll fight anyone for you' simultaneously." },
  { id: 11, name: "This Is My Best Behavior", cat: "Women's Crew", price: 14.99, tag: "NEW", accent: "#9B59B6", bg: "#F6F0FA", humor: "sarcastic", desc: "Spoiler alert: it only gets worse from here." },
  { id: 12, name: "Peace Love & Therapy", cat: "Sneaker", price: 14.99, tag: null, accent: "#4BA364", bg: "#EEFBF2", humor: "wholesome", desc: "The holy trinity of getting your life together. Starts at the feet." },
];

const BUNDLES = [
  { name: "THE RIOT PACK", sub: "Pick Any 3", price: 39.99, was: 44.97, accent: "#E8423F", bg: "#FFF0EF", icon: "🔥" },
  { name: "THE FULL RIOT", sub: "Pick Any 5", price: 59.99, was: 74.95, accent: "#E87D3E", bg: "#FFF4EC", icon: "💥" },
  { name: "THE OFFICE RIOT", sub: "3 Work Socks + Gift Box", price: 49.99, was: 57.96, accent: "#9B59B6", bg: "#F6F0FA", icon: "💼" },
];

const Marquee = ({ children }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let pos = 0, raf;
    const tick = () => {
      pos -= 0.5;
      if (pos <= -(el.scrollWidth / 2)) pos = 0;
      el.style.transform = `translateX(${pos}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}><div ref={ref} style={{ display: "inline-block", willChange: "transform" }}>{children}{children}</div></div>;
};

const SockSVG = ({ color, size = 100 }) => (
  <svg viewBox="0 0 100 140" width={size} height={size * 1.4} style={{ filter: `drop-shadow(0 6px 16px ${color}30)` }}>
    <defs>
      <linearGradient id={`s-${color.replace("#","")}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.9" />
        <stop offset="100%" stopColor={color} stopOpacity="0.7" />
      </linearGradient>
    </defs>
    <path d="M32 10 C32 4,68 4,68 10 L71 78 C71 78,71 93,81 106 C91 119,89 133,74 133 L52 133 C37 133,29 124,33 112 C37 102,30 90,30 78 Z"
      fill={`url(#s-${color.replace("#","")})`} stroke={color} strokeWidth="1.5" />
    <path d="M32 10 C32 4,68 4,68 10 L69 26 C69 26,50 24,31 26 Z" fill="#fff" opacity="0.25" />
    <line x1="32" y1="26" x2="69" y2="26" stroke="#fff" strokeWidth="0.7" strokeDasharray="3,4" opacity="0.3" />
    <ellipse cx="52" cy="68" rx="8" ry="5" fill="#fff" opacity="0.08" />
  </svg>
);

export default function SockRiot() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [quickView, setQuickView] = useState(null);
  const [flashId, setFlashId] = useState(null);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const addToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      return ex ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...p, qty: 1 }];
    });
    setFlashId(p.id);
    setTimeout(() => setFlashId(null), 900);
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, d) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const freeShip = cartTotal >= 35;

  const filtered = filter === "ALL" ? PRODUCTS
    : filter === "SWEARY" ? PRODUCTS.filter(p => p.humor === "sweary")
    : filter === "NEW" ? PRODUCTS.filter(p => p.tag === "NEW")
    : filter === "BEST" ? PRODUCTS.filter(p => p.tag === "BESTSELLER")
    : PRODUCTS.filter(p => p.price < 15);

  const cream = "#FBF7F0";
  const dark = "#2C2420";
  const red = "#E8423F";

  return (
    <div style={{ minHeight: "100vh", background: cream, color: dark, fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=Lilita+One&family=Caveat:wght@600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
        ::selection { background:${red}; color:#fff; }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn { 0%{transform:scale(0.85);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes cartBounce { 0%{transform:scale(1)} 50%{transform:scale(1.3)} 100%{transform:scale(1)} }
        @keyframes wobble { 0%,100%{transform:rotate(-2deg)} 25%{transform:rotate(2deg)} 50%{transform:rotate(-1deg)} 75%{transform:rotate(1.5deg)} }
        @keyframes float { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-14px) rotate(3deg)} }
        @keyframes wave { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(8deg)} 75%{transform:rotate(-8deg)} }
        .sr-card { transition:all 0.3s cubic-bezier(0.4,0,0.2,1); cursor:pointer; }
        .sr-card:hover { transform:translateY(-8px); box-shadow:0 16px 40px rgba(44,36,32,0.1); }
        .sr-card:hover .sr-sock { transform:rotate(-6deg) scale(1.1); }
        .sr-sock { transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        .sr-filter { cursor:pointer; border:2px solid #E8DFD3; background:transparent; color:#A09080; padding:10px 20px; font-family:'DM Mono',monospace; font-size:11px; font-weight:500; text-transform:uppercase; letter-spacing:1.5px; transition:all 0.2s; border-radius:100px; }
        .sr-filter:hover { border-color:${red}; color:${red}; background:#FFF5F4; }
        .sr-filter.on { border-color:${red}; background:${red}; color:#fff; }
        .sr-btn { cursor:pointer; border:none; font-family:'DM Mono',monospace; font-weight:500; text-transform:uppercase; letter-spacing:1.5px; transition:all 0.2s; border-radius:100px; }
        .sr-btn:hover { transform:translateY(-2px); filter:brightness(1.05); box-shadow:0 4px 16px rgba(0,0,0,0.1); }
        .sr-btn:active { transform:translateY(0); }
        .sr-link { font-family:'DM Mono',monospace; font-size:12px; letter-spacing:2px; color:#A09080; cursor:pointer; transition:color 0.2s; text-decoration:none; }
        .sr-link:hover { color:${red}; }
        .sr-bundle { transition:all 0.3s ease; cursor:pointer; }
        .sr-bundle:hover { transform:translateY(-6px); box-shadow:0 12px 32px rgba(44,36,32,0.08); }
        @media (max-width:768px) {
          .sr-grid { grid-template-columns:repeat(2,1fr) !important; gap:16px !important; }
          .sr-bundles { flex-direction:column !important; }
          .sr-hero-title { font-size:52px !important; }
          .sr-nav-links { display:none !important; }
          .sr-hero-wrap { flex-direction:column !important; text-align:center !important; }
          .sr-hero-socks { position:relative !important; right:auto !important; top:auto !important; transform:none !important; margin-top:20px; }
          .sr-cta-row { justify-content:center !important; }
        }
      `}</style>

      {/* ═══ TOP BANNER ═══ */}
      <div style={{ background: red, padding: "9px 0" }}>
        <Marquee>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", color: "#fff", padding: "0 48px" }}>
            🧦 Free shipping over $35 &nbsp;&nbsp;♥&nbsp;&nbsp; 1% supports Doctors Without Borders &nbsp;&nbsp;♥&nbsp;&nbsp; The Riot Pack: Any 3 for $39.99 &nbsp;&nbsp;♥&nbsp;&nbsp; Handmade gift boxes available &nbsp;&nbsp;♥&nbsp;&nbsp;
          </span>
        </Marquee>
      </div>

      {/* ═══ NAV ═══ */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 48px", borderBottom: `1px solid #EDE7DD`, position: "sticky", top: 0, background: `${cream}EE`, backdropFilter: "blur(12px)", zIndex: 150 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <span style={{ fontFamily: "'Lilita One',cursive", fontSize: "32px", color: red, lineHeight: 1 }}>sock</span>
          <span style={{ fontFamily: "'Lilita One',cursive", fontSize: "32px", color: dark, lineHeight: 1 }}>riot</span>
          <span style={{ fontFamily: "'Caveat',cursive", fontSize: "18px", color: red, marginLeft: "4px", transform: "rotate(-4deg)", display: "inline-block" }}>!</span>
        </div>
        <div className="sr-nav-links" style={{ display: "flex", gap: "32px" }}>
          {["SHOP", "BUNDLES", "GIFT BOXES", "ABOUT"].map(item => (
            <span key={item} className="sr-link">{item}</span>
          ))}
        </div>
        <div onClick={() => setShowCart(!showCart)} style={{ position: "relative", cursor: "pointer", padding: "8px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={dark} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
          </svg>
          {cartCount > 0 && (
            <div key={cartCount} style={{ position: "absolute", top: 0, right: 0, background: red, color: "#fff", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Mono',monospace", animation: "cartBounce 0.3s ease" }}>
              {cartCount}
            </div>
          )}
        </div>
      </nav>

      {/* ═══ CART DRAWER ═══ */}
      {showCart && <>
        <div onClick={() => setShowCart(false)} style={{ position: "fixed", inset: 0, background: "#00000033", zIndex: 190 }} />
        <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(400px, 90vw)", background: "#FFFDF9", borderLeft: "1px solid #EDE7DD", zIndex: 200, padding: "28px 24px", overflowY: "auto", animation: "slideUp 0.3s ease", boxShadow: "-8px 0 40px rgba(44,36,32,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
            <div style={{ fontFamily: "'Lilita One',cursive", fontSize: "24px", color: dark }}>your riot 🧦</div>
            <div onClick={() => setShowCart(false)} style={{ cursor: "pointer", fontSize: "22px", color: "#B0A090", padding: "8px" }}>✕</div>
          </div>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px", animation: "wobble 2s ease-in-out infinite" }}>🧦</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "13px", color: "#B0A090", letterSpacing: "1px" }}>Nothing here yet!</div>
              <div style={{ fontSize: "14px", color: "#C0B0A0", marginTop: "6px" }}>Time to start a riot.</div>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", gap: "14px", padding: "14px 0", borderBottom: "1px solid #EDE7DD", animation: "slideUp 0.3s ease" }}>
                  <div style={{ width: "52px", height: "52px", background: item.bg, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <SockSVG color={item.accent} size={32} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "2px", color: dark }}>{item.name}</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: "#B0A090" }}>{item.cat}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid #E0D8CC", borderRadius: "100px", background: "#fff" }}>
                        <button onClick={() => updateQty(item.id, -1)} style={{ background: "transparent", border: "none", color: "#B0A090", padding: "3px 10px", cursor: "pointer", fontSize: "15px" }}>−</button>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "12px", padding: "0 2px", color: dark }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} style={{ background: "transparent", border: "none", color: "#B0A090", padding: "3px 10px", cursor: "pointer", fontSize: "15px" }}>+</button>
                      </div>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "13px", fontWeight: 500, color: red }}>${(item.price * item.qty).toFixed(2)}</div>
                      <div onClick={() => removeFromCart(item.id)} style={{ marginLeft: "auto", cursor: "pointer", fontSize: "11px", color: "#C0B0A0", fontFamily: "'DM Mono',monospace" }}>remove</div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Shipping meter */}
              <div style={{ margin: "20px 0", padding: "14px 16px", background: freeShip ? "#F0FAF2" : "#FFF8F0", borderRadius: "12px", border: `1px solid ${freeShip ? "#C8E8D0" : "#F0E0D0"}` }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", letterSpacing: "1px", color: freeShip ? "#4BA364" : "#C09060", marginBottom: "8px" }}>
                  {freeShip ? "🎉 Free shipping unlocked!" : `$${(35 - cartTotal).toFixed(2)} away from free shipping`}
                </div>
                <div style={{ height: "6px", background: freeShip ? "#D8F0DD" : "#F0E0D0", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, (cartTotal / 35) * 100)}%`, background: freeShip ? "#4BA364" : `linear-gradient(90deg, ${red}, #E87D3E)`, borderRadius: "3px", transition: "width 0.5s ease" }} />
                </div>
              </div>
              <div style={{ borderTop: "1px solid #EDE7DD", paddingTop: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "13px", color: "#A09080" }}>Total</span>
                  <span style={{ fontFamily: "'Lilita One',cursive", fontSize: "22px", color: red }}>${cartTotal.toFixed(2)}</span>
                </div>
                <button className="sr-btn" style={{ width: "100%", padding: "16px", background: red, color: "#fff", fontSize: "13px" }}>
                  Checkout — ${cartTotal.toFixed(2)}
                </button>
              </div>
            </>
          )}
        </div>
      </>}

      {/* ═══ QUICK VIEW ═══ */}
      {quickView && <>
        <div onClick={() => setQuickView(null)} style={{ position: "fixed", inset: 0, background: "#00000044", zIndex: 300 }} />
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(580px, 92vw)", background: "#FFFDF9", border: "1px solid #EDE7DD", borderRadius: "20px", zIndex: 310, padding: "36px", animation: "popIn 0.3s ease", boxShadow: "0 24px 60px rgba(44,36,32,0.12)" }}>
          <div onClick={() => setQuickView(null)} style={{ position: "absolute", top: "16px", right: "20px", cursor: "pointer", fontSize: "18px", color: "#C0B0A0" }}>✕</div>
          <div style={{ display: "flex", gap: "28px", flexWrap: "wrap" }}>
            <div style={{ flex: "0 0 170px", display: "flex", alignItems: "center", justifyContent: "center", background: quickView.bg, borderRadius: "16px", padding: "28px" }}>
              <div style={{ animation: "float 4s ease-in-out infinite" }}>
                <SockSVG color={quickView.accent} size={120} />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: "200px" }}>
              {quickView.tag && (
                <div style={{ display: "inline-block", fontFamily: "'DM Mono',monospace", fontSize: "10px", fontWeight: 500, letterSpacing: "1.5px", color: quickView.accent, background: quickView.bg, padding: "5px 12px", borderRadius: "100px", marginBottom: "12px" }}>{quickView.tag}</div>
              )}
              <h2 style={{ fontFamily: "'Lilita One',cursive", fontSize: "28px", lineHeight: 1.1, marginBottom: "6px", color: dark }}>{quickView.name}</h2>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: "#B0A090", marginBottom: "14px" }}>{quickView.cat}</div>
              <p style={{ fontSize: "15px", lineHeight: 1.65, color: "#8A7A6A", marginBottom: "20px" }}>{quickView.desc}</p>
              <div style={{ fontFamily: "'Lilita One',cursive", fontSize: "28px", color: red, marginBottom: "18px" }}>${quickView.price.toFixed(2)}</div>
              <button className="sr-btn" onClick={() => { addToCart(quickView); setQuickView(null); setShowCart(true); }}
                style={{ padding: "14px 32px", background: red, color: "#fff", fontSize: "12px" }}>
                Add to Riot 🧦
              </button>
              <div style={{ marginTop: "14px", fontFamily: "'Caveat',cursive", fontSize: "14px", color: "#C0B0A0" }}>
                1% of this purchase supports Doctors Without Borders ♥
              </div>
            </div>
          </div>
        </div>
      </>}

      {/* ═══ HERO ═══ */}
      <section style={{ padding: "80px 48px 60px", position: "relative", overflow: "hidden" }}>
        {/* Soft blobs */}
        <div style={{ position: "absolute", top: "-20%", right: "-5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, #FFE0DD44 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "10%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, #FFE8D044 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="sr-hero-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: "540px" }}>
            <div style={{ fontFamily: "'Caveat',cursive", fontSize: "20px", color: red, marginBottom: "8px", transform: "rotate(-2deg)", display: "inline-block" }}>
              socks that say what you're thinking
            </div>
            <h1 className="sr-hero-title" style={{ fontFamily: "'Lilita One',cursive", fontSize: "72px", lineHeight: 0.95, color: dark, marginBottom: "24px" }}>
              Start a riot<br />
              in your sock<br />
              drawer<span style={{ color: red }}>.</span>
            </h1>
            <p style={{ fontSize: "17px", lineHeight: 1.7, color: "#8A7A6A", maxWidth: "420px", marginBottom: "36px" }}>
              Funny, honest, and unapologetically sweary socks from Blue Q — plus handmade gift boxes you won't find anywhere else.
            </p>
            <div className="sr-cta-row" style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <button className="sr-btn" style={{ padding: "16px 36px", background: red, color: "#fff", fontSize: "13px" }}>
                Shop All Socks
              </button>
              <button className="sr-btn" style={{ padding: "16px 36px", background: "#fff", color: dark, fontSize: "13px", border: "2px solid #E0D8CC" }}>
                Build a Bundle
              </button>
            </div>
          </div>

          <div className="sr-hero-socks" style={{ position: "relative", width: "320px", height: "340px", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: "0", left: "30px", animation: "float 5s ease-in-out infinite" }}>
              <SockSVG color="#E8423F" size={110} />
            </div>
            <div style={{ position: "absolute", top: "60px", right: "10px", animation: "float 6s ease-in-out infinite 0.6s" }}>
              <SockSVG color="#E87D3E" size={95} />
            </div>
            <div style={{ position: "absolute", bottom: "10px", left: "70px", animation: "float 4.5s ease-in-out infinite 1.2s" }}>
              <SockSVG color="#9B59B6" size={100} />
            </div>
            {/* Decorative scribble */}
            <svg style={{ position: "absolute", top: "-10px", right: "-10px", width: "60px", opacity: 0.15 }} viewBox="0 0 60 60">
              <path d="M10 30 Q20 10 30 30 Q40 50 50 30" fill="none" stroke={red} strokeWidth="2" />
              <path d="M15 35 Q25 15 35 35 Q45 55 55 35" fill="none" stroke="#E87D3E" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <div style={{ display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap", padding: "24px 48px 48px" }}>
        {[
          { icon: "🧦", text: "Designed by real artists" },
          { icon: "📦", text: "Free shipping over $35" },
          { icon: "❤️", text: "1% to Doctors Without Borders" },
          { icon: "🎁", text: "Handmade gift boxes" },
        ].map(t => (
          <div key={t.text} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>{t.icon}</span>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", letterSpacing: "0.5px", color: "#A09080" }}>{t.text}</span>
          </div>
        ))}
      </div>

      {/* ═══ BUNDLES ═══ */}
      <section style={{ padding: "40px 48px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontFamily: "'Caveat',cursive", fontSize: "22px", color: red, marginBottom: "4px" }}>save more, riot harder</div>
          <h2 style={{ fontFamily: "'Lilita One',cursive", fontSize: "42px", color: dark }}>Bundles</h2>
        </div>
        <div className="sr-bundles" style={{ display: "flex", gap: "20px", maxWidth: "1000px", margin: "0 auto" }}>
          {BUNDLES.map(b => (
            <div key={b.name} className="sr-bundle" style={{ flex: 1, background: "#fff", border: "1px solid #EDE7DD", borderRadius: "20px", padding: "32px 24px", textAlign: "center", boxShadow: "0 2px 12px rgba(44,36,32,0.04)" }}>
              <div style={{ width: "56px", height: "56px", background: b.bg, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "24px" }}>{b.icon}</div>
              <div style={{ fontFamily: "'Lilita One',cursive", fontSize: "22px", color: dark, marginBottom: "4px" }}>{b.name}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: "#B0A090", letterSpacing: "0.5px", marginBottom: "18px" }}>{b.sub}</div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "10px", marginBottom: "18px" }}>
                <span style={{ fontFamily: "'Lilita One',cursive", fontSize: "32px", color: b.accent }}>${b.price}</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "13px", color: "#C0B0A0", textDecoration: "line-through" }}>${b.was}</span>
              </div>
              <button className="sr-btn" style={{ padding: "12px 28px", background: b.accent, color: "#fff", fontSize: "11px", width: "100%" }}>
                Build This Bundle
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PRODUCT GRID ═══ */}
      <section style={{ padding: "40px 48px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontFamily: "'Caveat',cursive", fontSize: "22px", color: red, marginBottom: "4px" }}>curated chaos</div>
          <h2 style={{ fontFamily: "'Lilita One',cursive", fontSize: "42px", color: dark, marginBottom: "28px" }}>The Collection</h2>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { key: "ALL", label: "All Socks" },
              { key: "BEST", label: "Bestsellers" },
              { key: "NEW", label: "New Drops" },
              { key: "SWEARY", label: "Sweary AF" },
              { key: "UNDER15", label: "Under $15" },
            ].map(f => (
              <button key={f.key} className={`sr-filter ${filter === f.key ? "on" : ""}`} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sr-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "22px", maxWidth: "1100px", margin: "0 auto" }}>
          {filtered.map((p, i) => (
            <div key={p.id} className="sr-card" onClick={() => setQuickView(p)}
              style={{ background: "#fff", borderRadius: "18px", border: "1px solid #EDE7DD", overflow: "hidden", animation: `slideUp 0.4s ease ${i * 0.04}s both`,
                boxShadow: flashId === p.id ? `0 0 0 3px ${p.accent}44, 0 8px 24px ${p.accent}20` : "0 2px 8px rgba(44,36,32,0.04)" }}>
              <div style={{ position: "relative", padding: "24px 16px 12px", background: p.bg, display: "flex", justifyContent: "center", minHeight: "160px", alignItems: "center" }}>
                {p.tag && (
                  <div style={{ position: "absolute", top: "10px", left: "10px", fontFamily: "'DM Mono',monospace", fontSize: "9px", fontWeight: 500, letterSpacing: "1.5px",
                    color: p.tag === "NEW" ? "#4BA364" : p.tag === "BESTSELLER" ? red : "#E87D3E",
                    background: "#fff", padding: "4px 10px", borderRadius: "100px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                    {p.tag === "BESTSELLER" ? "🔥 BESTSELLER" : p.tag === "NEW" ? "✨ NEW" : `⭐ ${p.tag}`}
                  </div>
                )}
                <div className="sr-sock"><SockSVG color={p.accent} size={90} /></div>
              </div>
              <div style={{ padding: "14px 18px 18px" }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "9px", color: "#B0A090", letterSpacing: "1px", marginBottom: "4px" }}>{p.cat.toUpperCase()}</div>
                <div style={{ fontSize: "15px", fontWeight: 700, lineHeight: 1.3, color: dark, marginBottom: "12px", minHeight: "40px" }}>{p.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Lilita One',cursive", fontSize: "18px", color: p.accent }}>${p.price.toFixed(2)}</span>
                  <button className="sr-btn" onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                    style={{ padding: "8px 16px", background: p.bg, color: p.accent, fontSize: "10px", border: `1.5px solid ${p.accent}33` }}>
                    Add +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ GIFT BOX CALLOUT ═══ */}
      <section style={{ margin: "0 48px 64px", borderRadius: "24px", background: "#FFF8F0", border: "1px solid #F0E0D0", padding: "56px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "32px" }}>
        <div style={{ maxWidth: "480px" }}>
          <div style={{ fontFamily: "'Caveat',cursive", fontSize: "20px", color: "#E87D3E", marginBottom: "8px" }}>only at sock riot</div>
          <h2 style={{ fontFamily: "'Lilita One',cursive", fontSize: "36px", color: dark, marginBottom: "12px" }}>Handmade Cedar Gift Boxes</h2>
          <p style={{ fontSize: "15px", color: "#8A7A6A", lineHeight: 1.65 }}>
            Laser-engraved with a custom message. Fits 1–3 pairs. Made in our workshop with real cedar. The gift box that makes the socks unforgettable.
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Lilita One',cursive", fontSize: "36px", color: "#E87D3E" }}>$12.99</div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", color: "#C09060", letterSpacing: "1px", marginBottom: "14px" }}>ADD TO ANY ORDER</div>
          <button className="sr-btn" style={{ padding: "14px 32px", background: "#E87D3E", color: "#fff", fontSize: "12px" }}>
            Add Gift Box 🎁
          </button>
        </div>
      </section>

      {/* ═══ EMAIL ═══ */}
      <section style={{ padding: "60px 48px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'Lilita One',cursive", fontSize: "40px", color: dark, marginBottom: "8px" }}>Join the Riot</div>
          <p style={{ fontSize: "15px", color: "#8A7A6A", marginBottom: "28px", lineHeight: 1.6 }}>
            First dibs on new drops, exclusive bundles, and 10% off your first order. No spam — just socks and good vibes.
          </p>
          {joined ? (
            <div style={{ fontFamily: "'Caveat',cursive", fontSize: "22px", color: "#4BA364", animation: "popIn 0.3s ease" }}>
              🎉 You're in! Check your inbox.
            </div>
          ) : (
            <div style={{ display: "flex", gap: 0, maxWidth: "420px", margin: "0 auto" }}>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                style={{ flex: 1, padding: "14px 18px", background: "#fff", border: "2px solid #E0D8CC", borderRight: "none", color: dark, fontFamily: "'DM Mono',monospace", fontSize: "13px", outline: "none", borderRadius: "100px 0 0 100px" }}
                onFocus={e => e.target.style.borderColor = red} onBlur={e => e.target.style.borderColor = "#E0D8CC"} />
              <button className="sr-btn" onClick={() => { if (email.includes("@")) setJoined(true); }}
                style={{ padding: "14px 24px", background: red, color: "#fff", fontSize: "12px", borderRadius: "0 100px 100px 0", whiteSpace: "nowrap" }}>
                Join the Riot
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: "1px solid #EDE7DD", padding: "56px 48px 36px", background: "#FAF6EF" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "40px", marginBottom: "40px", maxWidth: "1100px", margin: "0 auto 40px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "5px", marginBottom: "12px" }}>
              <span style={{ fontFamily: "'Lilita One',cursive", fontSize: "26px", color: red }}>sock</span>
              <span style={{ fontFamily: "'Lilita One',cursive", fontSize: "26px", color: dark }}>riot</span>
            </div>
            <div style={{ fontSize: "13px", color: "#A09080", maxWidth: "250px", lineHeight: 1.6 }}>
              Funny socks, handmade gift boxes, and a whole lot of personality. Powered by Dubble-O Design Co.
            </div>
          </div>
          {[
            { title: "SHOP", links: ["All Socks", "Women's", "Men's", "Ankle", "Bundles", "Gift Boxes"] },
            { title: "HELP", links: ["Shipping & Returns", "FAQ", "Contact", "Size Guide"] },
            { title: "CONNECT", links: ["Instagram", "TikTok", "Pinterest", "Email"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", letterSpacing: "2px", color: "#B0A090", marginBottom: "14px" }}>{col.title}</div>
              {col.links.map(link => (
                <div key={link} style={{ fontSize: "13px", color: "#A09080", marginBottom: "9px", cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = red} onMouseLeave={e => e.target.style.color = "#A09080"}>
                  {link}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #EDE7DD", paddingTop: "20px", maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", color: "#C0B0A0", letterSpacing: "0.5px" }}>
            © 2026 Sock Riot — A Dubble-O Design Co. venture
          </div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", color: "#C0B0A0" }}>
            1% of sock sales supports Doctors Without Borders ♥
          </div>
        </div>
      </footer>
    </div>
  );
}
