import { motion } from "framer-motion"
import { useState } from "react"

export default function Navbar() {
  const current = window.location.pathname
  const [hoveredLink, setHoveredLink] = useState(null)

  const links = [
    { href: "/",         label: "Home",     icon: "🏠" },
    { href: "/calendar", label: "Calendar", icon: "🗓" },
  ]

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(10, 14, 26, 0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(212, 175, 55, 0.18)",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
      }}
    >
      {/* Logo */}
      <motion.a
        href="/"
        whileHover={{ scale: 1.03 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
        }}
      >
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "linear-gradient(135deg, #d4af37, #b8962e)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          boxShadow: "0 0 18px rgba(212,175,55,0.35)",
        }}>
          🎓
        </div>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 18,
          fontWeight: 700,
          background: "linear-gradient(135deg, #d4af37, #f0d060)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "0.3px",
        }}>
          CollegeCalendar
        </span>
      </motion.a>

      {/* Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {links.map((link) => {
          const isActive = current === link.href
          const isHovered = hoveredLink === link.href
          return (
            <motion.a
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.href)}
              onMouseLeave={() => setHoveredLink(null)}
              whileTap={{ scale: 0.95 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 16px",
                borderRadius: 10,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#d4af37" : isHovered ? "#e2e8f0" : "#94a3b8",
                background: isActive
                  ? "rgba(212,175,55,0.12)"
                  : isHovered
                    ? "rgba(255,255,255,0.05)"
                    : "transparent",
                border: `1px solid ${isActive ? "rgba(212,175,55,0.3)" : "transparent"}`,
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ fontSize: 15 }}>{link.icon}</span>
              {link.label}
            </motion.a>
          )
        })}

        {/* CTA Button */}
        <motion.a
          href="/"
          whileHover={{ scale: 1.05, filter: "brightness(1.15)" }}
          whileTap={{ scale: 0.96 }}
          style={{
            marginLeft: 8,
            padding: "8px 18px",
            borderRadius: 10,
            background: "linear-gradient(135deg, #d4af37, #b8962e)",
            color: "#0a0e1a",
            fontWeight: 700,
            fontSize: 13,
            textDecoration: "none",
            boxShadow: "0 4px 18px rgba(212,175,55,0.25)",
          }}
        >
          + Add Event
        </motion.a>
      </div>
    </motion.nav>
  )
}