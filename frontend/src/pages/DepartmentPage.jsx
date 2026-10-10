import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Monitor, Cpu, Radio, Zap, Settings, Building, Brain } from "lucide-react";
import { getDepartments, selectDepartment } from "../api/client";
import { ScreenHeader, PrimaryButton, StepDots, OptionCard, RadioDot, StateMessage } from "../components/Shared";

// lucide icons instead of emoji - no rendering issues
const DEPT_ICONS = {
  it:    <Monitor size={16} color="#5B4FE9" />,
  cse:   <Cpu size={16} color="#5B4FE9" />,
  ece:   <Radio size={16} color="#5B4FE9" />,
  eee:   <Zap size={16} color="#5B4FE9" />,
  mech:  <Settings size={16} color="#5B4FE9" />,
  civil: <Building size={16} color="#5B4FE9" />,
  aids:  <Brain size={16} color="#5B4FE9" />,
};

export default function DepartmentPage({ student, onDepartmentSelected }) {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [selected, setSelected] = useState(student?.departmentId || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDepartments()
      .then(setDepartments)
      .catch(() => setError("Could not load departments. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const handleContinue = async () => {
    if (!selected) { setError("Please choose your department."); return; }
    setSaving(true);
    setError("");
    try {
      const dept = await selectDepartment(student.studentId, selected);
      onDepartmentSelected(dept);
      navigate("/category");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save your department.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-shell">
      <ScreenHeader title="Select Department" right={<span style={{ fontSize: 18 }}>⋮</span>} />
      <div style={{ padding: "16px 16px 0", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 2 }}>
          Choose your department
        </div>
        <div style={{ fontSize: 11, color: "var(--color-sub)", marginBottom: 14 }}>
          (You can't change it later)
        </div>

        {loading && <StateMessage>Loading departments...</StateMessage>}
        {error   && <StateMessage error>{error}</StateMessage>}

        <div style={{ flex: 1 }}>
          {departments.map((d) => {
            const active = d.id === selected;
            return (
              <OptionCard
                key={d.id}
                active={active}
                onClick={() => setSelected(d.id)}
                left={
                  <>
                    <span style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: active ? "var(--color-primary-light)" : "var(--color-bg)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {DEPT_ICONS[d.id] || <Monitor size={16} color="#5B4FE9" />}
                    </span>
                    <span style={{ fontSize: 12.5 }}>{d.name}</span>
                  </>
                }
                right={<RadioDot active={active} />}
              />
            );
          })}
        </div>

        <div style={{ padding: "16px 0" }}>
          <PrimaryButton onClick={handleContinue} icon={<ChevronRight size={16} />} disabled={saving}>
            {saving ? "Saving..." : "Continue"}
          </PrimaryButton>
          <StepDots step={2} />
        </div>
      </div>
    </div>
  );
}