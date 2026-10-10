import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { getUpcomingEvents } from "../api/client";
import { ScreenHeader, BottomNav, StateMessage } from "../components/Shared";

/**
 * Screen 6: Upcoming Events
 * FIX: Date parsed with "T00:00:00" suffix to avoid UTC off-by-one day issue
 *      (new Date("2025-06-15") is parsed as UTC midnight → shows June 14 in local time).
 * FIX: tags can be undefined/null from API — guard added.
 */
export default function EventsPage({ student }) {
  const navigate = useNavigate();
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    getUpcomingEvents(student?.departmentId)
      .then(setEvents)
      .catch((err) => setError(err.message || "Could not load events."))
      .finally(() => setLoading(false));
  }, [student]);

  // FIX: force local-time parsing so Jun 15 stays Jun 15 in every timezone
  const parseLocalDate = (dateStr) => new Date(dateStr + "T00:00:00");

  return (
    <div className="app-shell">
      <ScreenHeader title="Upcoming Events" right={<Bell size={18} />} />
      <div className="app-content" style={{ padding: "14px 16px" }}>
        <div style={{ fontSize: 14, fontWeight: 800 }}>Don't miss out! 🎉</div>
        <div style={{ fontSize: 11, color: "var(--color-sub)", marginBottom: 14 }}>
          Check out the exciting events ahead
        </div>

        {loading && <StateMessage>Loading events...</StateMessage>}
        {error   && <StateMessage error>{error}</StateMessage>}

        {!loading && !error && events.length === 0 && (
          <StateMessage>No upcoming events for your department.</StateMessage>
        )}

        {events.map((e) => {
          const dateObj = parseLocalDate(e.eventDate);
          const month   = dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase();
          const day     = String(dateObj.getDate()).padStart(2, "0");

          return (
            <div key={e.id} className="event-card">
              <div style={{ display: "flex", gap: 10 }}>
                <div className="event-date-badge">
                  <div className="month">{month}</div>
                  <div className="day">{day}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>{e.title}</div>
                  {e.subtitle && (
                    <div style={{ fontSize: 11, color: "var(--color-sub)" }}>{e.subtitle}</div>
                  )}
                  {/* FIX: null-safe tags */}
                  <div style={{ display: "flex", gap: 6, margin: "5px 0", flexWrap: "wrap" }}>
                    {(e.tags || []).map((t) => (
                      <span key={t} className="event-tag">{t}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 10.5, color: "var(--color-sub)" }}>
                    {e.startTime} – {e.endTime}
                  </div>
                </div>
              </div>
              <button
                className="btn-secondary"
                style={{ marginTop: 10 }}
                onClick={() => navigate(`/events/${e.id}`)}
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
}
