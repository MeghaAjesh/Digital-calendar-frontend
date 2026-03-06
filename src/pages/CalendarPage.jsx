import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getEvents } from "../services/api"
import Navbar from "../components/Navbar"

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

const CAT = {
  exam:     { color:"#ef4444", light:"#fef2f2", border:"#fecaca", icon:"📝", label:"Examination"      },
  holiday:  { color:"#16a34a", light:"#f0fdf4", border:"#bbf7d0", icon:"🎉", label:"Holiday"          },
  function: { color:"#d97706", light:"#fffbeb", border:"#fde68a", icon:"🎓", label:"College Function" },
  seminar:  { color:"#7c3aed", light:"#f5f3ff", border:"#ddd6fe", icon:"📢", label:"Seminar"          },
  sports:   { color:"#0891b2", light:"#ecfeff", border:"#a5f3fc", icon:"🏆", label:"Sports"           },
  other:    { color:"#64748b", light:"#f8fafc", border:"#e2e8f0", icon:"📌", label:"Other"            },
}

function toDateStr(y,m,d){ return `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}` }

/* ── Day detail panel (right sidebar) ── */
function DayPanel({ date, events, onClose }) {
  const d = date ? new Date(date + "T00:00:00") : null
  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.22,1,0.36,1] }}
      style={{
        width: 280, flexShrink: 0,
        background: "#fff", borderRadius: 18,
        border: "1px solid #e2e8f0",
        boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
        overflow: "hidden", alignSelf: "flex-start",
        position: "sticky", top: 84,
      }}
    >
      {/* Panel header */}
      <div style={{ background: "linear-gradient(135deg,#d4af37,#b8962e)", padding:"18px 20px", position:"relative" }}>
        <button onClick={onClose} style={{
          position:"absolute", top:12, right:12, width:24, height:24, borderRadius:"50%",
          background:"rgba(0,0,0,0.15)", border:"none", color:"#fff", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:13,
        }}>✕</button>
        <div style={{ color:"rgba(255,255,255,0.75)", fontSize:11, fontWeight:700, letterSpacing:"1.5px", marginBottom:4 }}>
          {d && d.toLocaleDateString("en-IN",{weekday:"long"}).toUpperCase()}
        </div>
        <div style={{ color:"#fff", fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, lineHeight:1 }}>
          {d && d.getDate()}
        </div>
        <div style={{ color:"rgba(255,255,255,0.8)", fontSize:13, marginTop:2 }}>
          {d && d.toLocaleDateString("en-IN",{month:"long", year:"numeric"})}
        </div>
      </div>

      {/* Events list */}
      <div style={{ padding:"16px" }}>
        {events.length === 0 ? (
          <div style={{ textAlign:"center", padding:"24px 0", color:"#94a3b8" }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🗓</div>
            <p style={{ fontSize:13 }}>No events on this day</p>
            <p style={{ fontSize:12, color:"#cbd5e1", marginTop:4 }}>Click + Add Event to schedule something</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:"1px", marginBottom:2 }}>
              {events.length} EVENT{events.length!==1&&"S"}
            </div>
            {events.map(ev => {
              const c = CAT[ev.category]||CAT.other
              return (
                <div key={ev.id} style={{
                  background:c.light, border:`1px solid ${c.border}`,
                  borderRadius:10, padding:"11px 13px",
                  borderLeft:`4px solid ${c.color}`,
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                    <span style={{ fontSize:15 }}>{c.icon}</span>
                    <span style={{ fontSize:11, fontWeight:700, color:c.color }}>{c.label}</span>
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1e293b", lineHeight:1.3 }}>{ev.title}</div>
                  {ev.description && (
                    <div style={{ fontSize:11, color:"#64748b", marginTop:4 }}>{ev.description}</div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ── Main Calendar Page ── */
export default function CalendarPage() {
  const today = new Date()
  const [events, setEvents]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [curDate, setCurDate]   = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState(null)
  const [hoveredIdx, setHover]  = useState(null)

  const year  = curDate.getFullYear()
  const month = curDate.getMonth()

  useEffect(() => {
    getEvents()
      .then(res => setEvents(res.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const cells = useMemo(() => {
    const firstDay = new Date(year,month,1).getDay()
    const dim = new Date(year,month+1,0).getDate()
    const prev = new Date(year,month,0).getDate()
    const list = []
    for(let i=0;i<firstDay;i++) list.push({day:prev-firstDay+1+i,cur:false})
    for(let i=1;i<=dim;i++) list.push({day:i,cur:true})
    while(list.length%7!==0) list.push({day:list.length-firstDay-dim+1,cur:false})
    return list
  },[year,month])

  const eventsOnDay = (d) => {
    const ds = toDateStr(year,month+1,d)
    return events.filter(e=>e.date===ds)
  }

  const isToday = (d) => d===today.getDate()&&month===today.getMonth()&&year===today.getFullYear()
  const isSelected = (d) => selected?.date === toDateStr(year,month+1,d)

  const selectedEvs = selected ? events.filter(e=>e.date===selected.date) : []
  const monthEvCount = events.filter(e=>e.date.startsWith(toDateStr(year,month+1,1).slice(0,7))).length

  // Category breakdown for this month
  const monthStats = useMemo(() =>
    Object.entries(CAT).map(([k,v]) => ({
      ...v, key:k,
      count: events.filter(e=>e.category===k && e.date.startsWith(toDateStr(year,month+1,1).slice(0,7))).length
    })).filter(s=>s.count>0)
  , [events,year,month])

  return (
    /* Completely different design: clean white/light background */
    <div style={{ minHeight:"100vh", background:"#f1f5f9", color:"#1e293b", fontFamily:"'Inter',sans-serif" }}>
      <Navbar />

      {/* ── HEADER BAR (teal-to-navy gradient, totally different from Home) ── */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f2d4a 100%)",
        padding: "28px 32px 24px",
        borderBottom: "3px solid #d4af37",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative diagonal stripes */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:"repeating-linear-gradient(135deg,transparent,transparent 40px,rgba(212,175,55,0.03) 40px,rgba(212,175,55,0.03) 80px)",
        }} />

        <div style={{ maxWidth:1240, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16, position:"relative" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(212,175,55,0.15)", border:"1px solid rgba(212,175,55,0.3)", borderRadius:50, padding:"3px 12px", marginBottom:10 }}>
              <span style={{ fontSize:13 }}>🗓</span>
              <span style={{ color:"#d4af37", fontSize:11, fontWeight:700, letterSpacing:"2px" }}>ACADEMIC CALENDAR</span>
            </div>
            <h1 style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:"clamp(22px,3.5vw,38px)", fontWeight:700, color:"#fff", margin:"0 0 4px",
            }}>
              {MONTHS[month]} {year}
            </h1>
            <p style={{ color:"rgba(255,255,255,0.45)", fontSize:14 }}>
              {monthEvCount} event{monthEvCount!==1&&"s"} scheduled this month
            </p>
          </div>

          {/* Month nav */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={()=>setCurDate(new Date(year,month-1,1))} style={{
              width:40,height:40,borderRadius:10,background:"rgba(255,255,255,0.08)",
              border:"1px solid rgba(255,255,255,0.15)",color:"#d4af37",fontSize:18,
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",
            }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(212,175,55,0.2)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}
            >‹</button>
            <button onClick={()=>setCurDate(new Date(today.getFullYear(),today.getMonth(),1))} style={{
              padding:"8px 16px", borderRadius:10, background:"rgba(212,175,55,0.15)",
              border:"1px solid rgba(212,175,55,0.35)", color:"#d4af37",
              fontSize:12, fontWeight:700, cursor:"pointer",
            }}>Today</button>
            <button onClick={()=>setCurDate(new Date(year,month+1,1))} style={{
              width:40,height:40,borderRadius:10,background:"rgba(255,255,255,0.08)",
              border:"1px solid rgba(255,255,255,0.15)",color:"#d4af37",fontSize:18,
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",
            }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(212,175,55,0.2)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}
            >›</button>
          </div>
        </div>
      </div>

      {/* Month category chips */}
      {monthStats.length > 0 && (
        <div style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"10px 32px", display:"flex", gap:8, flexWrap:"wrap" }}>
          {monthStats.map(s => (
            <span key={s.key} style={{
              display:"inline-flex",alignItems:"center",gap:5,
              padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:600,
              background:s.light,color:s.color,border:`1px solid ${s.border}`,
            }}>
              {s.icon} {s.count} {s.label}{s.count!==1&&"s"}
            </span>
          ))}
        </div>
      )}

      {/* ── CALENDAR + SIDE PANEL ── */}
      <div style={{ maxWidth:1240, margin:"0 auto", padding:"24px", display:"flex", gap:20, alignItems:"flex-start" }}>

        {/* Calendar card */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5 }}
          style={{
            flex:1,
            background:"#fff",
            borderRadius:20,
            border:"1px solid #e2e8f0",
            overflow:"hidden",
            boxShadow:"0 4px 24px rgba(0,0,0,0.08)",
          }}
        >
          {/* Day name headers */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", background:"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
            {DAYS.map(d=>(
              <div key={d} style={{
                padding:"12px 8px", textAlign:"center",
                fontSize:12, fontWeight:700, letterSpacing:"0.8px",
                color: d==="Sun"||d==="Sat" ? "#d4af37" : "#94a3b8",
              }}>{d}</div>
            ))}
          </div>

          {/* Date grid */}
          {loading ? (
            <div style={{ padding:"80px 0", textAlign:"center", color:"#94a3b8" }}>
              <div style={{ width:28,height:28,border:"3px solid #e2e8f0",borderTopColor:"#d4af37",borderRadius:"50%",margin:"0 auto 12px",animation:"spin 0.8s linear infinite" }} />
              Loading calendar…
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)" }}>
              {cells.map((cell,idx)=>{
                const evs   = cell.cur ? eventsOnDay(cell.day) : []
                const isTod = cell.cur && isToday(cell.day)
                const isSel = cell.cur && isSelected(cell.day)
                const isWkd = idx%7===0||idx%7===6
                const hov   = hoveredIdx===idx && cell.cur
                return (
                  <div key={idx}
                    onMouseEnter={()=>setHover(idx)}
                    onMouseLeave={()=>setHover(null)}
                    onClick={()=>{
                      if(!cell.cur)return
                      const ds=toDateStr(year,month+1,cell.day)
                      setSelected(s=>s?.date===ds?null:{date:ds})
                    }}
                    style={{
                      minHeight:100, padding:"8px 6px",
                      borderRight:idx%7!==6?"1px solid #f1f5f9":"none",
                      borderBottom:"1px solid #f1f5f9",
                      cursor:cell.cur?"pointer":"default",
                      background: isSel ? "#fffbeb" : isTod ? "#fefce8" : hov&&cell.cur ? "#f8fafc" : "#fff",
                      transition:"background 0.15s",
                      position:"relative",
                    }}
                  >
                    {/* Today indicator line */}
                    {isTod && <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#d4af37,#f0d060)" }} />}

                    {/* Day number */}
                    <div style={{
                      width:28, height:28, borderRadius:"50%", marginBottom:4,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      background: isTod ? "linear-gradient(135deg,#d4af37,#b8962e)" : isSel ? "#fef3c7" : "transparent",
                      fontSize:13,
                      color: !cell.cur ? "#cbd5e1" : isTod ? "#fff" : isWkd ? "#d97706" : "#374151",
                      fontWeight: isTod||isSel ? 700 : 400,
                      border: isSel&&!isTod ? "2px solid #d4af37" : "none",
                    }}>
                      {cell.day}
                    </div>

                    {/* Event pills */}
                    <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                      {evs.slice(0,2).map(ev=>{
                        const c=CAT[ev.category]||CAT.other
                        return (
                          <div key={ev.id} style={{
                            fontSize:10, padding:"2px 5px", borderRadius:4,
                            background:c.light, color:c.color,
                            border:`1px solid ${c.border}`,
                            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                            fontWeight:600,
                          }}>
                            {c.icon} {ev.title}
                          </div>
                        )
                      })}
                      {evs.length>2&&(
                        <div style={{ fontSize:10, color:"#d97706", fontWeight:700, paddingLeft:3 }}>
                          +{evs.length-2} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Right panel — appears when day is selected */}
        <AnimatePresence>
          {selected && (
            <DayPanel
              date={selected.date}
              events={selectedEvs}
              onClose={()=>setSelected(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div style={{ maxWidth:1240, margin:"0 auto", padding:"0 24px 32px", display:"flex", flexWrap:"wrap", gap:12 }}>
        {Object.entries(CAT).map(([k,v])=>(
          <div key={k} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:10, height:10, borderRadius:3, background:v.color }} />
            <span style={{ fontSize:12, color:"#94a3b8" }}>{v.icon} {v.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}