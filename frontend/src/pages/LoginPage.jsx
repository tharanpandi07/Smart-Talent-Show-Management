import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, ChevronRight } from "lucide-react";
import { login } from "../api/client";
import { PrimaryButton } from "../components/Shared";
import collegeLogo from "../assets/college.jpeg";
import mgrLogo from "../assets/collegelogo.jpeg";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [registerNumber, setRegisterNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!registerNumber || !mobileNumber) {
      setError("Please enter your Register Number and Mobile Number.");
      return;
    }
    setLoading(true);
    try {
      const data = await login(registerNumber, mobileNumber);
      onLogin(data);
      if (!data.departmentSelected) {
        navigate("/department");
      } else if (!data.talentSelected) {
        navigate("/category");
      } else {
        navigate("/team");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid Register Number or Mobile Number. Please contact your coordinator."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div style={{ padding: "20px 20px 0", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* MGR Logo only - no text */}
<div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
  <img
    src={mgrLogo}
    alt="Dr. MGR Logo"
    style={{
      width: "100%",
      height: 80,
      objectFit: "contain",
    }}
  />
</div>

        <div style={{ fontSize: 21, fontWeight: 800 }}><center>Welcome Back</center></div>
        <div style={{ fontSize: 12.5, color: "var(--color-sub)", marginBottom: 18 }}><center>
          Login to continue</center>
        </div>

        {/* College building photo */}
        <div style={{ height: 150, borderRadius: 18, marginBottom: 22, overflow: "hidden" }}>
          <img
            src={collegeLogo}
            alt="Dr. M.G.R College"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div className="field">
          <User size={16} />
          <input
            placeholder="Register Number"
            value={registerNumber}
            onChange={(e) => setRegisterNumber(e.target.value)}
          />
        </div>

        <div className="field">
          <Lock size={16} />
          <input
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </div>

        {error && (
          <div style={{ color: "#E0444C", fontSize: 11.5, marginBottom: 8, fontWeight: 600 }}>
            {error}
          </div>
        )}

        <PrimaryButton onClick={handleLogin} icon={<ChevronRight size={16} />} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </PrimaryButton>

        <div style={{ textAlign: "center", fontSize: 11.5, color: "var(--color-sub)", margin: "12px 0" }}>
          New here?{" "}
          <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>
            Contact your coordinator
          </span>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "10px 0 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "var(--color-primary-dark)" }}>
          Smart Talent Exposure
        </div>
        <div style={{ fontSize: 9, color: "var(--color-sub)" }}>Discover • Connect • Perform</div>
      </div>
    </div>
  );
}