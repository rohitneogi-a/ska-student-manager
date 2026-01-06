import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const LoginContext = createContext();

const decodeTokenAndGetRole = (token) => {
  try {
    const decoded = jwtDecode(token);
    const rawRole = decoded?.role || decoded?.userRole || decoded?.type || null;

    // Normalize role for consistency
    const roleMap = {
      'SuperAdmin': 'SuperAdmin',
      'superadmin': 'SuperAdmin',
      'DepartmentAdmin': 'departmentadmin',
      'departmentadmin': 'departmentadmin',
      'Department': 'department',
      'department': 'department',
      'Moderator': 'moderator',
      'moderator': 'moderator',
      'User': 'user',
      'user': 'user'
    };

    return roleMap[rawRole] || (rawRole ? rawRole.toLowerCase() : null);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const LoginProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (token) {
      const decodedRole = decodeTokenAndGetRole(token);
      setRole(decodedRole);
      localStorage.setItem("Role", decodedRole || "");
    } else {
      setRole(null);
      localStorage.removeItem("Role");
    }
  }, []);

  const refreshRole = () => {
    const token = localStorage.getItem("Token");
    const decodedRole = token ? decodeTokenAndGetRole(token) : null;
    setRole(decodedRole);
    localStorage.setItem("Role", decodedRole || "");
  };

  return (
    <LoginContext.Provider value={{ role, refreshRole }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);