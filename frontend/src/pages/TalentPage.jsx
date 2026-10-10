import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Code2, Globe, Smartphone, Cpu, Palette, Music, Mic, Camera, Video, BookOpen } from "lucide-react";
import { getTalentsByCategory, selectTalent } from "../api/client";
import {
  ScreenHeader, PrimaryButton, StepDots,
  OptionCard, RadioDot, StateMessage,
} from "../components/Shared";

const TALENT_ICONS = {
  "Coding (Java, Python, etc.)": Code2,
  "Web Development":             Globe,
  "App Development":             Smartphone,
  "DSA / Problem Solving":       Cpu,
  "UI/UX Design":                Palette,
  "Dance":                       Music,
  "Singing":                     Mic,
  "Music (Instrument)":          Music,
  "Acting":                      Video,
  "Drawing / Painting":          Palette,
  "Kabaddi":                     ChevronRight,
  "Basketball":                  ChevronRight,
  "Cricket":                     ChevronRight,
  "Football":                    ChevronRight,
  "Athletics":                   ChevronRight,
  "Gym / Fitness":               ChevronRight,
  "Public Speaking":             Mic,
  "Storytelling":                BookOpen,
  "Anchoring (Host)":            Mic,
  "Photography":                 Camera,
  "Video Editing":               Video,
  "Content Creation":            Smartphone,
  "Meme Creation":               Video,
};

export default function TalentPage({ category, student, onTalentSelected }) {
  const navigate = useNavigate();
  const [talents, setTalents]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [saving, setSaving]     = useState(false);

  const categoryId    = category?.id   || "technical";
  const categoryLabel = category?.name || "Technical / IT";

  useEffect(() => {
    setSelected(null);
    setError("");
    setLoading(true);
    getTalentsByCategory(categoryId)
      .then(setTalents)
      .catch(() => setError("Could not load talents. Please try again."))
      .finally(() => setLoading(false));
  }, [categoryId]);

  const handleSave = async () => {
    if (!selected) { setError("Please select a talent."); return; }
    setSaving(true);
    setError("");
    try {
      const talent = await selectTalent(student.studentId, selected.id);
      onTalentSelected(talent);
      navigate("/team");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Could not save your selection.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-shell">
      <ScreenHeader title={categoryLabel} showBack />
      <div style={{ padding: "14px 16px 0", flex: 1, display: "flex", flexDirection: "column" }}>

        <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10 }}>
          Select your talent{" "}
          <span style={{ fontSize: 10.5, color: "var(--color-sub)", fontWeight: 600 }}>
            (You can select only one)
          </span>
        </div>

        {loading && <StateMessage>Loading talents...</StateMessage>}
        {error   && <StateMessage error>{error}</StateMessage>}

        <div style={{ flex: 1 }}>
          {talents.map((t) => {
            const active = selected?.id === t.id;
            const Icon   = TALENT_ICONS[t.name] || ChevronRight;
            return (
              <OptionCard
                key={t.id}
                active={active}
                onClick={() => setSelected(t)}
                left={
                  <>
                    <span style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: active ? "var(--color-primary-light)" : "var(--color-bg)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Icon size={15} color={active ? "var(--color-primary)" : "var(--color-sub)"} />
                    </span>
                    <span>{t.name}</span>
                  </>
                }
                right={<RadioDot active={active} />}
              />
            );
          })}
        </div>

        <div style={{ padding: "16px 0" }}>
          <PrimaryButton
            onClick={handleSave}
            icon={<ChevronRight size={16} />}
            disabled={saving || loading}
          >
            {saving ? "Saving..." : "Save & Continue"}
          </PrimaryButton>
          <StepDots step={3} />
        </div>
      </div>
    </div>
  );
}