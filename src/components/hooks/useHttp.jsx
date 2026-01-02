// src/hooks/useHttp.jsx
import { useState, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://mcqtestbackend.iem.edu.in";
// Example .env value:
// VITE_BACKEND_URL="https://your-backend-url.com/api"

export const useHttp = () => {
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (endpoint, method = "GET", body = null, headers = {}) => {
      setLoading(true);
      setError(null);

      try {
        const config = {
          method,
          headers: {
            ...headers,
          },
        };

        if (body) {
          if (body instanceof FormData) {
            config.body = body; // Do NOT set Content-Type for FormData
          } else {
            config.headers["Content-Type"] = "application/json";
            config.body = JSON.stringify(body);
          }
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        const data = await response.json();

        if (!response.ok) {
          const errorMsg = data?.message || `HTTP error! Status: ${response.status}`;
          setError(errorMsg);
          return { success: false, message: errorMsg };
        }

        return data;
      } catch (err) {
        setError(err.message);
        return { success: false, message: err.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const get = useCallback(
    (endpoint, headers) => request(endpoint, "GET", null, headers),
    [request]
  );
  const post = useCallback(
    (endpoint, body, headers) => request(endpoint, "POST", body, headers),
    [request]
  );
  const put = useCallback(
    (endpoint, body, headers) => request(endpoint, "PUT", body, headers),
    [request]
  );
  const del = useCallback(
    (endpoint, headers) => request(endpoint, "DELETE", null, headers),
    [request]
  );

  return { get, post, put, del, loading, error };
};