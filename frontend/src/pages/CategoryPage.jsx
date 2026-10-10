import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Music, Mic, Brain, Dumbbell, Monitor } from "lucide-react";
import { getCategories } from "../api/client";
import { ScreenHeader, StepDots, StateMessage } from "../components/Shared";

// lucide icons instead of emoji
const CATEGORY_ICONS = {
  arts:          <Music size={18} color="#5B4FE9" />,
  technical:     <Monitor size={18} color="#5B4FE9" />,
  sports:        <Dumbbell size={18} color="#5B4FE9" />,
  communication: <Mic size={18} color="#5B4FE9" />,
  creative:      <Brain size={18} color="#5B4FE9" />,
};

export default function CategoryPage({ onCategorySelected }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setError("Could not load categories. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (category) => {
    onCategorySelected(category);
    navigate("/talent");
  };

  return (
    <div className="app-shell">
      <ScreenHeader
        title="Select Talent Category"
        showBack
        right={<span style={{ fontSize: 18 }}>⋮</span>}
      />
      <div style={{ padding: "16px 16px 0", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: 14,
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>Choose a category</div>
            <div style={{ fontSize: 11, color: "var(--color-sub)" }}>to explore talents</div>
          </div>
          <Sparkles size={18} color="var(--color-primary)" />
        </div>

        {loading && <StateMessage>Loading categories...</StateMessage>}
        {error   && <StateMessage error>{error}</StateMessage>}

        <div style={{ flex: 1 }}>
          {categories.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelect(c)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 14px",
                borderRadius: 14,
                border: "1.5px solid var(--color-border)",
                background: "#fff",
                cursor: "pointer",
                marginBottom: 10,
              }}
            >
              {/* Icon box */}
              <div style={{
                width: 40, height: 40,
                borderRadius: 10,
                background: "var(--color-primary-light)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {CATEGORY_ICONS[c.id] || <Monitor size={18} color="#5B4FE9" />}
              </div>

              {/* Label */}
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>
                {c.name}
              </span>
            </div>
          ))}
        </div>

        <div style={{ padding: "16px 0" }}>
          <StepDots step={3} />
        </div>
      </div>
    </div>
  );
}