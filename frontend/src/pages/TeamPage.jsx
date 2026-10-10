import React, { useEffect, useState } from "react";
import { Bell, Code2, Users } from "lucide-react";
import { getMyTeam } from "../api/client";
import { BottomNav, StateMessage } from "../components/Shared";

/**
 * Screen 5: My Team
 * FIX: team.talentName was being used as team heading but TeamDto now has
 *      separate `name` (team name) and `talentName` fields — both rendered.
 * FIX: members array may be undefined if API returns 404 — guard added.
 */
export default function TeamPage({ student }) {
  const [team, setTeam]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    if (!student?.studentId) return;
    getMyTeam(student.studentId)
      .then(setTeam)
      .catch((err) => setError(err.message || "Could not load your team."))
      .finally(() => setLoading(false));
  }, [student]);

  return (
    <div className="app-shell">
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "14px 16px",
      }}>
        <span style={{ fontSize: 20 }}>☰</span>
        <span style={{ fontSize: 15, fontWeight: 800 }}>My Team</span>
        <Bell size={18} />
      </div>

      <div className="app-content" style={{ padding: "0 16px" }}>
        {loading && <StateMessage>Loading your team...</StateMessage>}
        {error   && <StateMessage error>{error}</StateMessage>}

        {team && (
          <>
            {/* Team hero card */}
            <div className="team-hero">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "rgba(255,255,255,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Code2 size={18} />
                </div>
                <div>
                  {/* FIX: show talentName as heading, team name as badge */}
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{team.talentName}</div>
                  <span style={{
                    fontSize: 9.5, fontWeight: 700,
                    background: "rgba(255,255,255,0.22)",
                    borderRadius: 6, padding: "2px 8px",
                  }}>
                    {team.name}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, opacity: 0.95 }}>
                <span style={{ fontSize: 22 }}>👨‍💻👩‍💻</span>
                <div>
                  <div>Team Leader: {team.leaderName}</div>
                  <div>Total Members: {team.totalMembers} ({team.departmentName || "IT Department"})</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10 }}>
              Team Members{" "}
              <span style={{ fontSize: 10.5, color: "var(--color-sub)", fontWeight: 600 }}>
                (IT Department Only)
              </span>
            </div>

            {/* FIX: guard against undefined members */}
            {(team.members || []).map((m) => (
              <div key={m.id} className="team-member-card">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "var(--color-primary-light)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16,
                  }}>
                    {m.you ? "👤" : "👤"}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{m.name}</div>
                    <div style={{ fontSize: 10, color: "var(--color-sub)" }}>{m.year}</div>
                  </div>
                </div>
                <span className={`role-badge ${m.role === "Team Leader" ? "leader" : "member"}`}>
                  {m.role}
                </span>
              </div>
            ))}

            {team.totalMembers > (team.members || []).length && (
              <div style={{
                textAlign: "center", fontSize: 11,
                color: "var(--color-primary)", fontWeight: 700,
                padding: "8px 0 12px",
              }}>
                + {team.totalMembers - (team.members || []).length} more members
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}