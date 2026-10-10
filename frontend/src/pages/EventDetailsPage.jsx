import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Share2, Calendar, Clock, MapPin, Users, FileText } from "lucide-react";
import { getEventDetails, registerForEvent } from "../api/client";
import { ScreenHeader, PrimaryButton, BottomNav, StateMessage } from "../components/Shared";

/**
 * Screen 7: Event Details
 * FIX: Date off-by-one (same T00:00:00 fix as EventsPage).
 * FIX: registrationDeadline is a datetime string from Spring — parsed correctly.
 * FIX: tags null-guard added.
 * FIX: error message shown in red, success in green (both were same color).
 */
export default function EventDetailsPage({ student }) {
  const { eventId } = useParams();
  const [event, setEvent]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [actionMsg, setActionMsg] = useState({ text: "", isError: false });
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    getEventDetails(eventId, student?.studentId)
      .then(setEvent)
      .catch((err) => setFetchError(err.message || "Could not load event details."))
      .finally(() => setLoading(false));
  }, [eventId, student]);

  const handleRegister = async () => {
    setRegistering(true);
    setActionMsg({ text: "", isError: false });
    try {
      const res = await registerForEvent(eventId, student.studentId);
      setActionMsg({ text: res.message, isError: false });
      setEvent((prev) => ({ ...prev, registered: true }));
    } catch (err) {
      setActionMsg({
        text: err.response?.data?.message || err.message || "Registration failed.",
        isError: true,
      });
    } finally {
      setRegistering(false);
    }
  };

  // FIX: local-time date parsing
  const parseLocalDate = (str) => new Date(str + "T00:00:00");

  return (
    <div className="app-shell">
      <ScreenHeader title="Event Details" showBack right={<Share2 size={18} />} />
      <div className="app-content" style={{ padding: "14px 16px" }}>
        {loading    && <StateMessage>Loading...</StateMessage>}
        {fetchError && <StateMessage error>{fetchError}</StateMessage>}

        {event && (
          <>
            {/* Header */}
            <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
              <div className="event-date-badge">
                <div className="month">
                  {parseLocalDate(event.eventDate)
                    .toLocaleString("en-US", { month: "short" })
                    .toUpperCase()}
                </div>
                <div className="day">
                  {String(parseLocalDate(event.eventDate).getDate()).padStart(2, "0")}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{event.title}</div>
                {event.subtitle && (
                  <div style={{ fontSize: 12, color: "var(--color-sub)" }}>{event.subtitle}</div>
                )}
                {/* FIX: null-safe tags */}
                <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                  {(event.tags || []).map((t) => (
                    <span key={t} className="event-tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Detail rows */}
            <div style={{ marginTop: 4 }}>
              <DetailRow
                icon={<Calendar size={15} />}
                label="Date"
                value={parseLocalDate(event.eventDate).toLocaleDateString("en-GB", {
                  day: "2-digit", month: "long", year: "numeric",
                })}
              />
              <DetailRow
                icon={<Clock size={15} />}
                label="Time"
                value={`${event.startTime} – ${event.endTime}`}
              />
              {event.venue && (
                <DetailRow icon={<MapPin size={15} />} label="Venue" value={event.venue} />
              )}
              {event.eligibility && (
                <DetailRow icon={<Users size={15} />} label="Eligibility" value={event.eligibility} />
              )}
              {event.description && (
                <DetailRow icon={<FileText size={15} />} label="Description" value={event.description} />
              )}
              {event.teamSize && (
                <DetailRow icon={<Users size={15} />} label="Team Size" value={event.teamSize} />
              )}
              {event.registrationDeadline && (
                <DetailRow
                  icon={<Calendar size={15} />}
                  label="Registration Last Date"
                  value={new Date(event.registrationDeadline).toLocaleString("en-GB", {
                    day: "2-digit", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                />
              )}
            </div>

            {/* FIX: separate success (green) vs error (red) styling */}
            {actionMsg.text && (
              <div style={{
                fontSize: 12, fontWeight: 700, margin: "12px 0",
                color: actionMsg.isError ? "#E0444C" : "#16A34A",
                background: actionMsg.isError ? "#FEF2F2" : "#F0FDF4",
                borderRadius: 8, padding: "8px 12px",
              }}>
                {actionMsg.text}
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <PrimaryButton
                onClick={handleRegister}
                disabled={registering || event.registered}
              >
                {event.registered
                  ? "Registered ✓"
                  : registering
                  ? "Registering..."
                  : "Register Now"}
              </PrimaryButton>
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="detail-row">
      <div className="icon">{icon}</div>
      <div style={{ flex: 1 }}>
        <div className="label">{label}</div>
        <div className="value">{value}</div>
      </div>
    </div>
  );
}
