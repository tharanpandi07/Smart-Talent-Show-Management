import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Global error interceptor — unwrap Spring Boot error bodies consistently
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Attach a clean message so callers can do err.message
    if (err.response?.data?.message) {
      err.message = err.response.data.message;
    }
    return Promise.reject(err);
  }
);

// ---------- Auth ----------
export const login = (registerNumber, mobileNumber) =>
  api.post("/auth/login", { registerNumber, mobileNumber }).then((r) => r.data);

// ---------- Departments ----------
export const getDepartments = () =>
  api.get("/departments").then((r) => r.data);

export const selectDepartment = (studentId, departmentId) =>
  api.post(`/departments/select/${studentId}`, { departmentId }).then((r) => r.data);

// ---------- Categories ----------
export const getCategories = () =>
  api.get("/categories").then((r) => r.data);

// ---------- Talents ----------
// FIX: was missing null-guard on categoryId — now sends only if defined
export const getTalentsByCategory = (categoryId) => {
  if (!categoryId) return Promise.resolve([]);
  return api.get("/talents", { params: { categoryId } }).then((r) => r.data);
};

export const selectTalent = (studentId, talentId) =>
  api.post(`/talents/select/${studentId}`, { talentId }).then((r) => r.data);

// ---------- Team ----------
export const getMyTeam = (studentId) =>
  api.get(`/teams/my/${studentId}`).then((r) => r.data);

// ---------- Events ----------
// FIX: was passing undefined departmentId to params; axios sends "undefined" as string
export const getUpcomingEvents = (departmentId) =>
  api
    .get("/events", { params: departmentId ? { departmentId } : {} })
    .then((r) => r.data);

export const getEventDetails = (eventId, studentId) =>
  api
    .get(`/events/${eventId}`, { params: studentId ? { studentId } : {} })
    .then((r) => r.data);

export const registerForEvent = (eventId, studentId) =>
  api.post(`/events/${eventId}/register`, { studentId }).then((r) => r.data);

// ---------- Profile ----------
export const getProfile = (studentId) =>
  api.get(`/profile/${studentId}`).then((r) => r.data);

export default api;

// ---------- Feed ----------
export const getFeed = () =>
  api.get("/feed").then((r) => r.data);

export const likeFeedPost = (postId) =>
  api.post(`/feed/${postId}/like`).then((r) => r.data);

export const uploadFeedPost = (formData) =>
  api
    .post("/feed/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);