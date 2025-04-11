const API_BASE_URL = import.meta.env.VITE_API_URL || "https://medaille-backend.onrender.com";

export const config = {
  medalsUrl: `${API_BASE_URL}/api/medailles`,
  athletesUrl: `${API_BASE_URL}/api/athletes`,
};