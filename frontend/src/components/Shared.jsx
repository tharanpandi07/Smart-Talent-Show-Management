import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Home, Users, Calendar, User, Check } from "lucide-react";

export function ScreenHeader({ title, showBack, right }) {
  const navigate = useNavigate();
  return (
    <div className="screen-header">
      <div className="header-left">
        {showBack && (
          <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <ChevronLeft size={20} />
          </button>
        )}
        <h1>{title}</h1>
      </div>
      {right && <div className="icon-btn">{right}</div>}
    </div>
  );
}

export function PrimaryButton({ children, onClick, icon, disabled, type = "button" }) {
  return (
    <button className="btn-primary" onClick={onClick} disabled={disabled} type={type}>
      {children}
      {icon}
    </button>
  );
}

export function StepDots({ step, total = 3 }) {
  return (
    <div className="step-dots">
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        const active = n === step;
        return (
          <div key={n} className={`step-dot ${active ? "active" : ""}`}>
            {active ? n : ""}
          </div>
        );
      })}
    </div>
  );
}

export function HintBanner({ children }) {
  return <div className="hint-banner">{children}</div>;
}

export function RadioDot({ active }) {
  return (
    <div className={`radio-dot ${active ? "active" : ""}`}>
      {active && <Check size={12} color="#fff" strokeWidth={3} />}
    </div>
  );
}

export function OptionCard({ active, onClick, left, right }) {
  return (
    <div className={`option-card ${active ? "active" : ""}`} onClick={onClick}>
      <div className="option-card-left">{left}</div>
      {right}
    </div>
  );
}

/**
 * FIX: BottomNav had broken active-detection logic with duplicate /team paths.
 * Simplified: each nav item has a unique path; active = exact or startsWith match.
 */
export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { label: "Home",    icon: Home,     path: "/home"    },
    { label: "Team",    icon: Users,    path: "/team"    },
    { label: "Events",  icon: Calendar, path: "/events"  },
    { label: "Profile", icon: User,     path: "/profile" },
  ];

  return (
    <div className="bottom-nav">
      {items.map((it) => {
        // Events is active for both /events and /events/:id
        const isActive =
          it.path === "/events"
            ? location.pathname.startsWith("/events")
            : location.pathname === it.path;
        const Icon = it.icon;
        return (
          <button
            key={it.label}
            className={`nav-item ${isActive ? "active" : ""}`}
            onClick={() => navigate(it.path)}
          >
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
            <span>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function StateMessage({ children, error }) {
  return (
    <div className={`state-message ${error ? "error" : ""}`}>{children}</div>
  );
}
