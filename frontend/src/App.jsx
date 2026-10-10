import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DepartmentPage from "./pages/DepartmentPage";
import CategoryPage from "./pages/CategoryPage";
import TalentPage from "./pages/TalentPage";
import TeamPage from "./pages/TeamPage";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import ProfilePage from "./pages/ProfilePage";

/**
 * Smart Talent Exposure - Student Flow (IT Department Only)
 *
 * Screens:
 *  1. Login
 *  2. Department Selection
 *  3. Talent Category
 *  4. Choose Your Talent (IT)
 *  5. My Team
 *  6. Upcoming Events
 *  7. Event Details
 *  8. My Profile
 *  9. Home (Talent Feed) — NEW
 */
export default function App() {
  const [student, setStudent] = useState(null); // { studentId, name, registerNumber, departmentId, ... }
  const [category, setCategory] = useState(null); // selected talent category

  const handleLogin = (data) => {
    setStudent(data);
  };

  const handleDepartmentSelected = (department) => {
    setStudent((prev) => ({ ...prev, departmentId: department.id, departmentSelected: true }));
  };

  const handleTalentSelected = (talent) => {
    setStudent((prev) => ({ ...prev, talentSelected: true, talentName: talent.name }));
  };

  return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
      <Route
        path="/department"
        element={
          student ? (
            <DepartmentPage student={student} onDepartmentSelected={handleDepartmentSelected} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/category"
        element={student ? <CategoryPage onCategorySelected={setCategory} /> : <Navigate to="/" />}
      />
      <Route
        path="/talent"
        element={
          student ? (
            <TalentPage category={category} student={student} onTalentSelected={handleTalentSelected} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route path="/home" element={student ? <HomePage student={student} /> : <Navigate to="/" />} />
      <Route path="/team" element={student ? <TeamPage student={student} /> : <Navigate to="/" />} />
      <Route path="/events" element={student ? <EventsPage student={student} /> : <Navigate to="/" />} />
      <Route
        path="/events/:eventId"
        element={student ? <EventDetailsPage student={student} /> : <Navigate to="/" />}
      />
      <Route path="/profile" element={student ? <ProfilePage student={student} /> : <Navigate to="/" />} />
    </Routes>
  );
}