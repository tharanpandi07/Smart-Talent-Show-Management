import React, { useEffect, useState } from "react";
import { Bell, Heart, ImagePlus, X } from "lucide-react";
import { getFeed, likeFeedPost, uploadFeedPost } from "../api/client";
import { BottomNav, StateMessage } from "../components/Shared";

/**
 * Screen: Home — Talent Feed
 * Instagram-style feed of event participation photos posted by students.
 */

const IMAGE_BASE = "http://localhost:8080";

function timeAgo(dateStr) {
  const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function UploadModal({ student, onClose, onPosted }) {
  const [eventId, setEventId] = useState("");
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!image) {
      setError("Image is required.");
      return;
    }
    setSubmitting(true);
    setError("");
    const formData = new FormData();
    formData.append("studentId", student.studentId);
    if (eventId) formData.append("eventId", eventId);
    formData.append("caption", caption);
    formData.append("image", image);

    try {
      await uploadFeedPost(formData);
      onPosted();
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
    }}>
      <div style={{
        background: "var(--color-card, #111)", borderRadius: 12,
        padding: 16, width: "88%", maxWidth: 360,
        border: "1px solid var(--color-primary)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 12,
        }}>
          <span style={{ fontSize: 13, fontWeight: 800 }}>Share Event Moment</span>
          <X size={16} style={{ cursor: "pointer" }} onClick={onClose} />
        </div>

        <input
          type="number"
          placeholder="Event ID (optional)"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          style={inputStyle}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ ...inputStyle, padding: 8 }}
        />
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={{ ...inputStyle, minHeight: 60, resize: "none" }}
        />

        {error && <div style={{ color: "#ff5555", fontSize: 10.5, marginBottom: 8 }}>{error}</div>}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: "100%", padding: 10, background: "var(--color-primary)",
            color: "#050505", border: "none", borderRadius: 8,
            fontWeight: 700, fontSize: 12, cursor: "pointer",
          }}
        >
          {submitting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "8px 10px", marginBottom: 10,
  background: "#0a0a0a", border: "1px solid #333", borderRadius: 6,
  color: "#fff", fontSize: 11.5, boxSizing: "border-box",
};

export default function HomePage({ student }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const loadFeed = () => {
    setLoading(true);
    getFeed()
      .then(setPosts)
      .catch((err) => setError(err.message || "Could not load feed."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const handleLike = async (postId) => {
    try {
      const res = await likeFeedPost(postId);
      setPosts((prev) =>
        prev.map((p) => (p.postId === postId ? { ...p, likesCount: res.likes } : p))
      );
    } catch {
      // silent fail on like — non-critical
    }
  };

  return (
    <div className="app-shell">
      {/* Top bar */}
      <div style={{
  display: "flex", alignItems: "center",
  justifyContent: "space-between", padding: "14px 16px",
  background: "linear-gradient(135deg, #6C63FF, #4C46B3)",
  color: "#fff",
}}>
        <span style={{ fontSize: 20 }}>☰</span>
        <span style={{ fontSize: 15, fontWeight: 800 }}>DR.MGR UNIVERSITY</span>
        <Bell size={18} />
      </div>

      <div className="app-content" style={{ padding: "0 16px" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          marginBottom: 10,
        }}>
          <button
            onClick={() => setShowUpload(true)}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "var(--color-primary)", color: "#050505",
              border: "none", borderRadius: 8, padding: "6px 10px",
              fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}
          >
            <ImagePlus size={13} /> Post
          </button>
        </div>

        {loading && <StateMessage>Loading feed...</StateMessage>}
        {error && <StateMessage error>{error}</StateMessage>}
        {!loading && !error && posts.length === 0 && (
          <StateMessage>No posts yet. Share your event moment!</StateMessage>
        )}

        {posts.map((post) => (
          <div key={post.postId} className="team-member-card" style={{
            flexDirection: "column", alignItems: "stretch", padding: 0,
            overflow: "hidden", marginBottom: 12,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "var(--color-primary-light)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800,
              }}>
                {post.studentName?.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 700 }}>{post.studentName}</div>
                <div style={{ fontSize: 9.5, color: "var(--color-sub)" }}>
                  {post.department} · {post.eventName}
                </div>
              </div>
            </div>

            <img
              src={`${IMAGE_BASE}${post.imageUrl}`}
              alt={post.eventName}
              style={{ width: "100%", display: "block", maxHeight: 340, objectFit: "cover" }}
            />

            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 12px",
            }}>
              <button
                onClick={() => handleLike(post.postId)}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "transparent", border: "1px solid var(--color-primary)",
                  color: "var(--color-primary)", borderRadius: 16,
                  padding: "4px 10px", fontSize: 10.5, fontWeight: 700, cursor: "pointer",
                }}
              >
                <Heart size={12} /> {post.likesCount}
              </button>
              <span style={{ fontSize: 9.5, color: "var(--color-sub)" }}>
                {timeAgo(post.createdAt)}
              </span>
            </div>

            {post.caption && (
              <div style={{ padding: "0 12px 10px", fontSize: 11 }}>
                <b>{post.studentName}</b> {post.caption}
              </div>
            )}
          </div>
        ))}

        {showUpload && (
          <UploadModal
            student={student}
            onClose={() => setShowUpload(false)}
            onPosted={() => {
              setShowUpload(false);
              loadFeed();
            }}
          />
        )}
      </div>

      <BottomNav />
    </div>
  );
}