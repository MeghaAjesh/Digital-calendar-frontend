import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getEvents } from "../services/api"
import EventCard from "../components/EventCard"
import EventForm from "../components/EventForm"
import Navbar from "../components/Navbar"

const FILTERS = [
  { value: "all",      icon: "✦",  label: "All",       color: "#d4af37" },
  { value: "exam",     icon: "📝", label: "Exams",     color: "#ef4444" },
  { value: "holiday",  icon: "🎉", label: "Holidays",  color: "#22c55e" },
  { value: "function", icon: "🎓", label: "Functions", color: "#f59e0b" },
  { value: "seminar",  icon: "📢", label: "Seminars",  color: "#8b5cf6" },
  { value: "sports",   icon: "🏆", label: "Sports",    color: "#06b6d4" },
]

const CAT_META = {
  exam:     { color: "#ef4444", icon: "📝", label: "Examination"      },
  holiday:  { color: "#22c55e", icon: "🎉", label: "Holiday"          },
  function: { color: "#f59e0b", icon: "🎓", label: "College Function" },
  seminar:  { color: "#8b5cf6", icon: "📢", label: "Seminar"          },
  sports:   { color: "#06b6d4", icon: "🏆", label: "Sports Event"     },
  other:    { color: "#94a3b8", icon: "📌", label: "Other"            },
}

export default function Home() {
  const role = localStorage.getItem("role")

  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState("all")
  const [search, setSearch]   = useState("")

  const fetchEvents = async () => {
    try { const res = await getEvents(); setEvents(res.data) }
    catch { setEvents([]) }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchEvents() }, [])

  const visible = events
    .filter(e => filter === "all" || e.category === filter)
    .filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const today = new Date(); today.setHours(0,0,0,0)
  const upcoming = useMemo(() =>
    events.filter(e => new Date(e.date + "T00:00:00") >= today)
      .sort((a,b) => new Date(a.date) - new Date(b.date)).slice(0, 5)
  , [events])

  const counts = useMemo(() =>
    Object.keys(CAT_META).reduce((a, k) => ({ ...a, [k]: events.filter(e => e.category === k).length }), {})
  , [events])

  return (
    <div style={{ minHeight: "100vh", background: "#0b1120", color: "#e2e8f0", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* ── TOP BANNER (unique to Home) ── */}
      <div style={{
        background: "linear-gradient(135deg, #0d1b2a 0%, #0f2034 60%, #0b1120 100%)",
        borderBottom: "1px solid rgba(212,175,55,0.12)",
        padding: "32px 40px 28px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative glow orbs */}
        <div style={{ position:"absolute", top:-60, right:-60, width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-80, left:"35%", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(79,127,228,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />

        <div style={{ maxWidth:1240, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(212,175,55,0.1)", border:"1px solid rgba(212,175,55,0.25)", borderRadius:50, padding:"4px 14px", marginBottom:12 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", display:"inline-block" }} />
              <span style={{ color:"#d4af37", fontSize:11, fontWeight:700, letterSpacing:"2.5px" }}>ACADEMIC DASHBOARD</span>
            </div>
            <h1 style={{
              fontFamily:"'Playfair Display', serif", fontSize:"clamp(24px,4vw,40px)", fontWeight:700, margin:"0 0 6px",
              background:"linear-gradient(135deg,#d4af37,#f0d060,#d4af37)", backgroundSize:"200% auto",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"shimmer 4s linear infinite",
            }}>Digital College Calendar</h1>
            <p style={{ color:"#475569", fontSize:14 }}>Your events, exams and holidays — organized beautifully.</p>
          </motion.div>

          {/* Top-right quick stats */}
          <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.15 }}
            style={{ display:"flex", gap:10 }}>
            {[
              { label:"Total",    value:events.length,           color:"#d4af37" },
              { label:"Upcoming", value:upcoming.length,         color:"#22c55e" },
              { label:"Exams",    value:counts.exam||0,          color:"#ef4444" },
              { label:"Holidays", value:counts.holiday||0,       color:"#22c55e" },
            ].map((s,i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"13px 18px", textAlign:"center" }}>
                <div style={{ fontSize:24, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:11, color:"#64748b", marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── SIDEBAR + MAIN ── */}
      <div style={{ maxWidth:1240, margin:"0 auto", padding:"28px 24px", display:"grid", gridTemplateColumns:"250px 1fr", gap:24, alignItems:"start" }}>

        {/* LEFT SIDEBAR */}
        <aside>
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }} style={{ marginBottom:20 }}>
{role === "ADMIN" && (
  <EventForm refresh={fetchEvents} />
)}
          </motion.div>

          {/* Category list */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, overflow:"hidden", marginBottom:20 }}>
            <div style={{ padding:"13px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize:11, fontWeight:700, color:"#64748b", letterSpacing:"1.2px" }}>CATEGORIES</span>
            </div>
            {Object.entries(CAT_META).map(([k, v]) => (
              <div key={k} onClick={() => setFilter(filter===k ? "all" : k)}
                style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"10px 16px", cursor:"pointer", transition:"all 0.18s",
                  background: filter===k ? `${v.color}12` : "transparent",
                  borderLeft:`3px solid ${filter===k ? v.color : "transparent"}`,
                }}
                onMouseEnter={e => e.currentTarget.style.background=`${v.color}08`}
                onMouseLeave={e => e.currentTarget.style.background=filter===k?`${v.color}12`:"transparent"}
              >
                <span style={{ fontSize:13, color:filter===k?v.color:"#94a3b8", display:"flex", alignItems:"center", gap:8 }}>
                  {v.icon} {v.label}
                </span>
                <span style={{ fontSize:12, fontWeight:700, color:filter===k?v.color:"#475569", background:filter===k?`${v.color}20`:"rgba(255,255,255,0.05)", padding:"1px 8px", borderRadius:20 }}>
                  {counts[k]||0}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
              style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, overflow:"hidden" }}>
              <div style={{ padding:"13px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#64748b", letterSpacing:"1.2px" }}>COMING UP</span>
              </div>
              {upcoming.map(ev => {
                const c = CAT_META[ev.category]||CAT_META.other
                const diff = Math.round((new Date(ev.date+"T00:00:00") - today) / 86400000)
                return (
                  <div key={ev.id} style={{ padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:16 }}>{c.icon}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:"#cbd5e1", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ev.title}</div>
                      <div style={{ fontSize:11, color:"#475569", marginTop:1 }}>
                        {diff===0?"Today":diff===1?"Tomorrow":`In ${diff} days`}
                      </div>
                    </div>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:c.color, flexShrink:0 }} />
                  </div>
                )
              })}
            </motion.div>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <div>
          {/* Filter pills + search */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15 }}
            style={{ display:"flex", flexWrap:"wrap", gap:8, alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {FILTERS.map(f => (
                <button key={f.value} onClick={() => setFilter(f.value)} style={{
                  padding:"6px 13px", borderRadius:20, cursor:"pointer",
                  border:`1px solid ${filter===f.value ? f.color : "rgba(255,255,255,0.08)"}`,
                  background: filter===f.value ? `${f.color}20` : "transparent",
                  color: filter===f.value ? f.color : "#64748b",
                  fontSize:12, fontWeight:filter===f.value?700:500, transition:"all 0.18s",
                }}>
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#475569", fontSize:13 }}>🔍</span>
              <input type="text" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}
                style={{ padding:"7px 13px 7px 30px", borderRadius:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#e2e8f0", fontSize:13, outline:"none", width:170 }}
                onFocus={e=>e.target.style.borderColor="rgba(212,175,55,0.4)"}
                onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.08)"}
              />
            </div>
          </motion.div>

          {/* Count label */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <span style={{ fontSize:12, color:"#475569", fontWeight:600 }}>
              {visible.length} event{visible.length!==1&&"s"}
            </span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.05)" }} />
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ textAlign:"center", padding:"80px 0", color:"#475569" }}>
              <div style={{ width:28, height:28, border:"3px solid rgba(212,175,55,0.15)", borderTopColor:"#d4af37", borderRadius:"50%", margin:"0 auto 12px", animation:"spin 0.8s linear infinite" }} />
              Loading events…
            </div>
          ) : visible.length === 0 ? (
            <div style={{ textAlign:"center", padding:"70px 0", color:"#475569" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
              <p>{search ? `No events match "${search}"` : "No events yet — add one from the sidebar!"}</p>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(270px, 1fr))", gap:16 }}>
              <AnimatePresence>
                {visible.map((event, i) => (
                  <motion.div key={event.id}
                    initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
                    transition={{ delay:i*0.04, duration:0.32 }}>
                    <EventCard event={event} onDelete={id => setEvents(prev => prev.filter(e=>e.id!==id))} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}