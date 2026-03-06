import { motion } from "framer-motion"
import { useState } from "react"

const CATEGORY_STYLES = {
  exam:     { color: "#ef4444", bg: "rgba(239,68,68,0.13)",   icon: "📝", label: "Examination"      },
  holiday:  { color: "#22c55e", bg: "rgba(34,197,94,0.13)",   icon: "🎉", label: "Holiday"          },
  function: { color: "#f59e0b", bg: "rgba(245,158,11,0.13)",  icon: "🎓", label: "College Function" },
  seminar:  { color: "#8b5cf6", bg: "rgba(139,92,246,0.13)",  icon: "📢", label: "Seminar"          },
  sports:   { color: "#06b6d4", bg: "rgba(6,182,212,0.13)",   icon: "🏆", label: "Sports"           },
  other:    { color: "#94a3b8", bg: "rgba(148,163,184,0.13)", icon: "📌", label: "Other"            },
}

function formatDate(dateStr) {
  if (!dateStr) return ""
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
}

function getDaysUntil(dateStr) {
  if (!dateStr) return null
  const today = new Date(); today.setHours(0,0,0,0)
  const event = new Date(dateStr + "T00:00:00")
  const diff = Math.round((event - today) / 86400000)
  if (diff === 0) return { label: "Today!", urgent: true }
  if (diff === 1) return { label: "Tomorrow", urgent: true }
  if (diff < 0)  return { label: "Past", urgent: false }
  if (diff <= 7) return { label: `In ${diff} days`, urgent: true }
  return { label: `In ${diff} days`, urgent: false }
}

export default function EventCard({ event, onDelete, onEdit }) {
  const [hovered, setHovered] = useState(false)
  const cat   = CATEGORY_STYLES[event.category] || CATEGORY_STYLES.other
  const badge = getDaysUntil(event.date)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: "rgba(255,255,255,0.028)",
        border: `1px solid ${hovered ? cat.color + "55" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 18,
        padding: "22px 22px 18px",
        backdropFilter: "blur(12px)",
        overflow: "hidden",
        transition: "border-color 0.3s ease",
        cursor: "pointer",
        boxShadow: hovered
          ? `0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px ${cat.color}22`
          : "0 4px 24px rgba(0,0,0,0.2)",
      }}
    >
      {/* Glowing top edge */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)`,
        opacity: hovered ? 1 : 0.4,
        transition: "opacity 0.3s",
      }} />

      {/* Corner glow */}
      <div style={{
        position: "absolute",
        top: -40, right: -40,
        width: 100, height: 100,
        borderRadius: "50%",
        background: cat.color,
        opacity: hovered ? 0.07 : 0.03,
        filter: "blur(30px)",
        transition: "opacity 0.3s",
        pointerEvents: "none",
      }} />

      {/* Category pill */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "4px 11px",
          borderRadius: 20,
          background: cat.bg,
          color: cat.color,
          fontSize: 11,
          fontWeight: 700,
          border: `1px solid ${cat.color}35`,
          letterSpacing: "0.4px",
        }}>
          {cat.icon} {cat.label}
        </span>

        {badge && (
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            color: badge.urgent ? "#d4af37" : "#475569",
            background: badge.urgent ? "rgba(212,175,55,0.12)" : "transparent",
            padding: badge.urgent ? "3px 8px" : "0",
            borderRadius: 6,
            border: badge.urgent ? "1px solid rgba(212,175,55,0.25)" : "none",
          }}>
            {badge.label}
          </span>
        )}
      </div>

      {/* Title */}
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 18,
        fontWeight: 700,
        color: "#e2e8f0",
        marginBottom: 8,
        lineHeight: 1.3,
      }}>
        {event.title}
      </h2>

      {/* Description */}
      {event.description && (
        <p style={{
          fontSize: 13,
          color: "#64748b",
          marginBottom: 14,
          lineHeight: 1.5,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {event.description}
        </p>
      )}

      {/* Footer */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
        paddingTop: 12,
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#475569" }}>
          <span>📅</span>
          <span>{formatDate(event.date)}</span>
        </span>

        {/* Action buttons — visible on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          style={{ display: "flex", gap: 6 }}
        >
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(event) }}
              style={iconBtnStyle("#d4af37")}
            >✏️</button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(event.id) }}
              style={iconBtnStyle("#ef4444")}
            >🗑</button>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

function iconBtnStyle(color) {
  return {
    width: 30,
    height: 30,
    borderRadius: 7,
    background: `${color}18`,
    border: `1px solid ${color}35`,
    color,
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
  }
}