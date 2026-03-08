import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signupUser,loginUser } from "../services/api"

const GOLD = "#d4af37"
const GOLD2 = "#b8962e"
const GOLD_LIGHT = "#f0d060"
const NAVY = "#0a0e1a"
const NAVY2 = "#0d1b2a"
const NAVY3 = "#0f2034"

export default function AuthPages() {
    const navigate = useNavigate();
  const [page, setPage] = useState("login") // "login" | "signup"
  const [role, setRole] = useState("STUDENT")
  const [showPass, setShowPass] = useState(false)
  const [focused, setFocused] = useState("")
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const ROLES = [
    { value: "STUDENT", icon: "🎓", label: "Student" },
    { value: "TEACHER", icon: "📚", label: "Teacher" },
  ]

const handleLogin = async () => {
  try {

    const res = await loginUser({
      email: form.email,
      password: form.password
    })

    if(res.data){

      localStorage.setItem("role", res.data.role)
      localStorage.setItem("userId", res.data.id)

      navigate("/calendar")

    } else {
      alert("Invalid login")
    }

  } catch(err){
    console.log(err)
    alert("Login failed")
  }
}

const handleSignup = async () => {

  if(form.password !== form.confirm){
    alert("Passwords do not match")
    return
  }

  try{

    await signupUser({
      name: form.name,
      email: form.email,
      password: form.password,
      role: role
    })

    alert("Account created! Please login.")
navigate("/login")
  }catch(err){
    console.log(err)
    alert("Signup failed")
  }

}
  return (
    <div style={{
      minHeight: "100vh",
      background: NAVY,
      display: "flex",
      fontFamily: "'Inter', sans-serif",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* ── Animated background orbs ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-10%", left: "-5%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 65%)",
          animation: "float1 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "-15%", right: "-8%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,127,228,0.05) 0%, transparent 65%)",
          animation: "float2 10s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "40%", right: "25%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 65%)",
          animation: "float1 12s ease-in-out infinite reverse",
        }} />
        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
      </div>

      {/* ── LEFT PANEL ── */}
      <div style={{
        width: "42%",
        background: `linear-gradient(145deg, ${NAVY2} 0%, ${NAVY3} 50%, #091628 100%)`,
        borderRight: "1px solid rgba(212,175,55,0.12)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 56px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative diagonal stripe */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(135deg,transparent,transparent 40px,rgba(212,175,55,0.02) 40px,rgba(212,175,55,0.02) 80px)",
        }} />

        {/* Gold vertical accent bar */}
        <div style={{
          position: "absolute", left: 0, top: "20%", bottom: "20%",
          width: 3,
          background: `linear-gradient(180deg, transparent, ${GOLD}, transparent)`,
          opacity: 0.6,
        }} />

        {/* Logo */}
        <div style={{ marginBottom: 56 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "rgba(212,175,55,0.08)",
            border: "1px solid rgba(212,175,55,0.2)",
            borderRadius: 50, padding: "6px 18px", marginBottom: 32,
          }}>
            <span style={{ fontSize: 14 }}>🗓</span>
            <span style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "2.5px" }}>ACADEMIC PORTAL</span>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 42, fontWeight: 700, margin: "0 0 16px",
            lineHeight: 1.15,
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT}, ${GOLD})`,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 4s linear infinite",
          }}>
            Digital College<br />Calendar
          </h1>
          <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.7, maxWidth: 320 }}>
            Your complete academic event management system — exams, holidays, seminars and more, organized beautifully.
          </p>
        </div>

        {/* Feature list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            { icon: "📝", title: "Track Examinations", desc: "Never miss an exam date again" },
            { icon: "🎉", title: "Holiday Calendar",   desc: "Plan ahead with holiday schedules" },
            { icon: "🏆", title: "Sports & Functions", desc: "Stay updated on all college events" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: "rgba(212,175,55,0.08)",
                border: "1px solid rgba(212,175,55,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>{f.icon}</div>
              <div>
                <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{f.title}</div>
                <div style={{ color: "#475569", fontSize: 12 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div style={{
          marginTop: 56, paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "#334155", fontSize: 12, letterSpacing: "0.5px",
        }}>
          © 2026 Digital College Calendar · Secure Academic Portal
        </div>
      </div>

      {/* ── RIGHT PANEL — FORM ── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 32px",
      }}>
        <div style={{
          width: "100%", maxWidth: 440,
          background: "rgba(13,27,42,0.85)",
          border: "1px solid rgba(212,175,55,0.18)",
          borderRadius: 24,
          padding: "40px 40px 36px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.06)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Top gold glow line */}
          <div style={{
            position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            opacity: 0.5,
          }} />

          {/* Tab switcher */}
          <div style={{
            display: "flex", background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12, padding: 4, marginBottom: 32, gap: 4,
          }}>
            {["login", "signup"].map(t => (
              <button key={t} onClick={() => setPage(t)} style={{
                flex: 1, padding: "9px 0", borderRadius: 9, border: "none",
                background: page === t
                  ? `linear-gradient(135deg, ${GOLD}, ${GOLD2})`
                  : "transparent",
                color: page === t ? NAVY : "#475569",
                fontWeight: 700, fontSize: 13,
                cursor: "pointer", transition: "all 0.22s",
                letterSpacing: "0.3px",
              }}>
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 26, fontWeight: 700,
              color: "#f1f5f9", margin: "0 0 6px",
            }}>
              {page === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p style={{ color: "#475569", fontSize: 13, margin: 0 }}>
              {page === "login"
                ? "Sign in to access your academic calendar"
                : "Join your college's digital calendar platform"}
            </p>
          </div>

          {/* SIGNUP ONLY — Role picker */}
          {page === "signup" && (
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>I am a</label>
              <div style={{ display: "flex", gap: 8 }}>
                {ROLES.map(r => (
                  <button key={r.value} type="button" onClick={() => setRole(r.value)} style={{
                    flex: 1, padding: "11px 8px", borderRadius: 10, border: "none",
                    background: role === r.value
                      ? "rgba(212,175,55,0.12)"
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${role === r.value ? GOLD + "55" : "rgba(255,255,255,0.08)"}`,
                    color: role === r.value ? GOLD : "#475569",
                    fontWeight: role === r.value ? 700 : 500,
                    fontSize: 13, cursor: "pointer",
                    transition: "all 0.18s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  }}>
                    <span style={{ fontSize: 16 }}>{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIGNUP ONLY — Name */}
          {page === "signup" && (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Full Name</label>
              <div style={inputWrap(focused === "name")}>
                <span style={iconStyle}>👤</span>
                <input
                  placeholder="e.g. Arjun Menon"
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused("")}
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email Address</label>
            <div style={inputWrap(focused === "email")}>
              <span style={iconStyle}>✉️</span>
              <input
                type="email"
                placeholder="you@college.edu"
                value={form.email}
                onChange={e => set("email", e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: page === "signup" ? 16 : 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={labelStyle}>Password</label>
              {page === "login" && (
                <span style={{ fontSize: 11, color: GOLD, cursor: "pointer", fontWeight: 600 }}>
                  Forgot password?
                </span>
              )}
            </div>
            <div style={inputWrap(focused === "password")}>
              <span style={iconStyle}>🔒</span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={e => set("password", e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                style={{ ...inputStyle, paddingRight: 40 }}
              />
              <button onClick={() => setShowPass(s => !s)} style={{
                position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: "#475569",
                cursor: "pointer", fontSize: 14, padding: 0,
              }}>
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* SIGNUP ONLY — Confirm password */}
          {page === "signup" && (
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Confirm Password</label>
              <div style={inputWrap(focused === "confirm")}>
                <span style={iconStyle}>🔒</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={e => set("confirm", e.target.value)}
                  onFocus={() => setFocused("confirm")}
                  onBlur={() => setFocused("")}
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <button onClick={page === "login" ? handleLogin : handleSignup}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`,
            color: NAVY, fontWeight: 800, fontSize: 15,
            cursor: "pointer", letterSpacing: "0.3px",
            boxShadow: "0 8px 28px rgba(212,175,55,0.3)",
            transition: "all 0.22s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
            onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-1px)" }}
            onMouseLeave={e => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.transform = "translateY(0)" }}
          >
            {page === "login" ? (
              <><span>✦</span> Sign In to Dashboard</>
            ) : (
              <><span>🎓</span> Create {role === "STUDENT" ? "Student" : "Teacher"} Account</>
            )}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0 20px" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            <span style={{ color: "#334155", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Switch page */}
          <p style={{ textAlign: "center", color: "#475569", fontSize: 13, margin: 0 }}>
            {page === "login" ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={() => setPage(page === "login" ? "signup" : "login")}
              style={{ color: GOLD, fontWeight: 700, cursor: "pointer" }}
            >
              {page === "login" ? "Sign Up" : "Sign In"}
            </span>
          </p>

          {/* Admin note */}
          {page === "login" && (
            <div style={{
              marginTop: 20, padding: "10px 14px", borderRadius: 10,
              background: "rgba(212,175,55,0.06)",
              border: "1px solid rgba(212,175,55,0.12)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 13 }}>🛡️</span>
              <span style={{ color: "#64748b", fontSize: 11 }}>
                Admin accounts are pre-configured. Contact IT for access.
              </span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:0% center} 100%{background-position:200% center} }
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(15px)} }
        * { box-sizing: border-box; }
        input::placeholder { color: #334155; }
        input { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  )
}

// ── Shared micro-styles ──
const labelStyle = {
  display: "block", fontSize: 11, fontWeight: 700,
  letterSpacing: "0.7px", textTransform: "uppercase",
  color: "#64748b", marginBottom: 7,
}

const inputWrap = (focused) => ({
  position: "relative", display: "flex", alignItems: "center",
  background: "rgba(255,255,255,0.03)",
  border: `1px solid ${focused ? "rgba(212,175,55,0.45)" : "rgba(255,255,255,0.08)"}`,
  borderRadius: 10, transition: "border-color 0.2s",
  boxShadow: focused ? "0 0 0 3px rgba(212,175,55,0.08)" : "none",
})

const iconStyle = {
  position: "absolute", left: 13,
  fontSize: 14, pointerEvents: "none",
  userSelect: "none",
}

const inputStyle = {
  width: "100%", padding: "11px 13px 11px 38px",
  background: "transparent", border: "none",
  color: "#e2e8f0", fontSize: 14, outline: "none",
}