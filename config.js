const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const config = {
  medalsUrl: `${API_BASE_URL}/api/medailles`,
  athletesUrl: `${API_BASE_URL}/api/athletes`,
};