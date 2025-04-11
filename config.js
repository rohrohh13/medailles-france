const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const config = {
  medalsUrl: `${API_BASE_URL}/api/medailles`,
  athletesUrl: `${API_BASE_URL}/api/athletes`,
};



/*export const config = {
  medalsUrl: 'https://opensheet.elk.sh/1DvKrqg4A1wTXDOi1_l_w5PlHuzxGKKm-MYHoWZjUuTk/medaille',
  athletesUrl: 'https://opensheet.elk.sh/1DvKrqg4A1wTXDOi1_l_w5PlHuzxGKKm-MYHoWZjUuTk/sportif',
};*/