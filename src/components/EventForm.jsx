import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addEvent } from "../services/api"

const CATEGORIES = [
  { value: "exam",     icon: "📝", label: "Examination",      color: "#ef4444", bg: "rgba(239,68,68,0.13)"   },
  { value: "holiday",  icon: "🎉", label: "Holiday",          color: "#22c55e", bg: "rgba(34,197,94,0.13)"   },
  { value: "function", icon: "🎓", label: "College Function", color: "#f59e0b", bg: "rgba(245,158,11,0.13)"  },
  { value: "seminar",  icon: "📢", label: "Seminar",          color: "#8b5cf6", bg: "rgba(139,92,246,0.13)"  },
  { value: "sports",   icon: "🏆", label: "Sports",           color: "#06b6d4", bg: "rgba(6,182,212,0.13)"   },
  { value: "other",    icon: "📌", label: "Other",            color: "#94a3b8", bg: "rgba(148,163,184,0.13)" },
]

const EMPTY = { title: "", description: "", date: "", category: "exam" }

export default function EventForm({ refresh }) {
  const [form, setForm]       = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [open, setOpen]       = useState(false)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

const handleSubmit = async (e) => {
  e.preventDefault()
  if (!form.title.trim() || !form.date) return

  setLoading(true)

  try {

    await addEvent(form)

    setSuccess(true)
    setForm(EMPTY)
    refresh()

    setTimeout(() => {
      setSuccess(false)
      setOpen(false)
    }, 1600)

  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}

  const selectedCat = CATEGORIES.find(c => c.value === form.category)

  return (
    <div style={{ marginBottom: 36 }}>
      {/* Toggle button */}
      {!open && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03, filter: "brightness(1.1)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 24px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #d4af37, #b8962e)",
            border: "none",
            color: "#0a0e1a",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 6px 24px rgba(212,175,55,0.3)",
          }}
        >
          <span style={{ fontSize: 18 }}>+</span>
          Add New Event
        </motion.button>
      )}

      {/* Form panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "rgba(13, 27, 42, 0.95)",
              border: "1px solid rgba(212,175,55,0.25)",
              borderRadius: 20,
              padding: "28px 28px 24px",
              backdropFilter: "blur(16px)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(212,175,55,0.08)",
              maxWidth: 620,
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 20,
                color: "#d4af37",
                margin: 0,
              }}>
                ✨ New Event
              </h2>
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8", fontSize: 15, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Title & Date — side by side */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 12 }}>

                <FormField label="Event Title *">
                  <input
                    type="text"
                    placeholder="e.g. Internal Assessment"
                    value={form.title}
                    onChange={e => set("title", e.target.value)}
                    style={inputStyle}
                  />
                </FormField>
                <FormField label="Date *">
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => set("date", e.target.value)}
                    style={{ ...inputStyle, colorScheme: "dark" }}
                  />
                </FormField>
              </div>

              {/* Description */}
              <FormField label="Description" style={{ marginBottom: 14 }}>
                <input
                  type="text"
                  placeholder="Brief description (optional)..."
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                  style={inputStyle}
                />
              </FormField>

              {/* Category picker */}
              <FormField label="Category">

<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => set("category", cat.value)}
                      style={{
                        padding: "10px 4px",
                        borderRadius: 10,
                        border: `1px solid ${form.category === cat.value ? cat.color : "rgba(255,255,255,0.08)"}`,
                        background: form.category === cat.value ? cat.bg : "rgba(255,255,255,0.02)",
                        color: form.category === cat.value ? cat.color : "#475569",
                        fontSize: 10,
                        fontWeight: form.category === cat.value ? 700 : 400,
                        cursor: "pointer",
                        textAlign: "center",
                        lineHeight: 1.6,
                        transition: "all 0.18s",
                      }}
                    >
                      <div style={{ fontSize: 18, marginBottom: 2 }}>{cat.icon}</div>
                      {cat.label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </FormField>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading || !form.title.trim() || !form.date}
                whileHover={!loading ? { scale: 1.02, filter: "brightness(1.1)" } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                style={{
                  width: "100%",
                  marginTop: 18,
                  padding: "13px 0",
                  borderRadius: 12,
                  background: success
                    ? "linear-gradient(135deg, #22c55e, #16a34a)"
                    : (form.title.trim() && form.date)
                      ? "linear-gradient(135deg, #d4af37, #b8962e)"
                      : "rgba(255,255,255,0.05)",
                  border: "none",
                  color: (form.title.trim() && form.date) ? "#0a0e1a" : "#475569",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: (form.title.trim() && form.date) ? "pointer" : "not-allowed",
                  transition: "all 0.25s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {loading ? (
                  <span style={{
                    width: 18, height: 18,
                    border: "2px solid rgba(0,0,0,0.3)",
                    borderTopColor: "#0a0e1a",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }} />
                ) : success ? (
                  "✅ Event Added!"
                ) : (
                  <>
                    <span style={{ fontSize: 18 }}>{selectedCat?.icon}</span>
                    Add {selectedCat?.label}
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FormField({ label, children, style = {} }) {
  return (
    <div style={{ marginBottom: 12, ...style }}>
      <label style={{
        display: "block",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.7px",
        textTransform: "uppercase",
        color: "#64748b",
        marginBottom: 6,
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: "100%",
  padding: "10px 13px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#e2e8f0",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
}