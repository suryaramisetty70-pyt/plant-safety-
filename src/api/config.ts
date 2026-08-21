export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || "",
  demoMode: import.meta.env.VITE_DEMO_MODE !== "false"
};

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_CONFIG.baseUrl}${normalizedPath}`;
};
