const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof URLSearchParams)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.detail || "Request failed");
  }
  return data;
}

// ---- Auth ----
export const registerUser = ({ username, email, password }) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });

export const loginUser = ({ email, password }) => {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  return request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
};

// ---- Profile / Dashboard ----
export const getProfile = () => request("/api/profile");
export const getDashboard = () => request("/api/dashboard");

// ---- Diagnosis ----
export const createDiagnosis = ({ symptoms, medical_history, patient_name }) =>
  request("/api/diagnosis", {
    method: "POST",
    body: JSON.stringify({ symptoms, medical_history, patient_name }),
  });

// ---- History ----
export const getHistory = () => request("/api/history");
export const getHistoryById = (id) => request(`/api/history/${id}`);
export const deleteHistory = (id) =>
  request(`/api/history/${id}`, { method: "DELETE" });

// ---- Feedback ----
export const submitFeedback = ({ query_id, rating, comments }) =>
  request("/api/feedback", {
    method: "POST",
    body: JSON.stringify({ query_id, rating, comments }),
  });