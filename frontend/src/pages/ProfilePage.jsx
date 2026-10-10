import React, { useEffect, useState } from "react";
import { Edit3, Code2, Users, Trophy, Award, Star } from "lucide-react";
import { getProfile } from "../api/client";
import { ScreenHeader, BottomNav, StateMessage } from "../components/Shared";

/**
 * Screen 8: My Profile
 * Shows the student's talent, team, and activity stats.
 */
export default function ProfilePage({ student }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!student?.studentId) return;
    getProfile(student.studentId)
      .then(setProfile)
      .catch(() => setError("Could not load your profile."))
      .finally(() => setLoading(false));
  }, [student]);

  return (
    <div className="app-shell">
      <ScreenHeader title="My Profile" right={<Edit3 size={18} />} />
      <div className="app-content" style={{ padding: "14px 16px" }}>
        {loading && <StateMessage>Loading profile...</StateMessage>}
        {error && <StateMessage error>{error}</StateMessage>}

        {profile && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--color-primary-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                }}
              >
                
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 800 }}>{profile.name}</span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "var(--color-primary-dark)",
                      background: "var(--color-primary-light)",
                      borderRadius: 6,
                      padding: "2px 7px",
                    }}
                  >
                    Student
                  </span>
                </div>
              </div>
            </div>

            <div style={{ border: "1px solid var(--color-border)", borderRadius: 14, padding: 12, marginBottom: 12 }}>
              <ProfileRow label="Register No" value={profile.registerNumber} />
              <ProfileRow label="Department" value={profile.departmentName} />
              <ProfileRow label="Year" value={profile.year} />
              <ProfileRow label="Email" value={profile.email} />
              <ProfileRow label="Phone" value={profile.mobileNumber} />
            </div>

            {profile.talentName && (
              <ProfileCard icon={<Code2 size={16} color="var(--color-primary)" />} title="My Talent" value={profile.talentName} />
            )}
            {profile.teamName && (
              <ProfileCard
                icon={<Users size={16} color="var(--color-primary)" />}
                title="My Team"
                value={profile.teamName}
                sub={profile.teamLeader ? "Team Leader" : undefined}
              />
            )}

            <div style={{ fontSize: 12.5, fontWeight: 800, margin: "10px 0 8px" }}>My Activity</div>
            <div style={{ display: "flex", gap: 8 }}>
              <Stat icon={<Trophy size={18} color="var(--color-amber)" />} value={profile.eventsParticipated} label="Events Participated" />
              <Stat icon={<Award size={18} color="var(--color-amber)" />} value={profile.certificatesEarned} label="Certificates Earned" />
              <Stat icon={<Star size={18} color="var(--color-amber)" />} value={profile.achievements} label="Achievements" />
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="profile-row">
      <span className="label">{label}</span>
      <span className="value">: &nbsp;{value || "-"}</span>
    </div>
  );
}

function ProfileCard({ icon, title, value, sub }) {
  return (
    <div className="profile-card">
      <div className="profile-icon-box">{icon}</div>
      <div>
        <div style={{ fontSize: 10.5, color: "var(--color-sub)", fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 12.5, fontWeight: 800 }}>{value}</div>
        {sub && <div style={{ fontSize: 10, color: "var(--color-sub)" }}>{sub}</div>}
      </div>
    </div>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="stat-box">
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
