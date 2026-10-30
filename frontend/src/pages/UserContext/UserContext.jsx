import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentTeacher } from "../../services/teacher";

export const UserContext = createContext({
  user: null,
  updateUser: () => {},
  clearUser: () => {},
  loadingUser: true,
  sessionError: "",
  retrySession: () => {},
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sessionError, setSessionError] = useState("");

  const restoreSession = useCallback(async () => {
    setLoadingUser(true);
    setSessionError("");
    try {
      const currentUser = await getCurrentTeacher();
      setUser(currentUser || null);
    } catch (error) {
      const status = error.response?.status;
      // A temporary outage is not the same as an expired/invalid login.
      if (!status || status >= 500) {
        setSessionError("CampSync is temporarily having trouble connecting. Your session has not been cleared. Please try again.");
      } else {
        setUser(null);
      }
    } finally {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const restore = async () => {
      setLoadingUser(true);
      setSessionError("");
      try {
        const currentUser = await getCurrentTeacher();
        if (active) setUser(currentUser || null);
      } catch (error) {
        if (!active) return;
        const status = error.response?.status;
        if (!status || status >= 500) {
          setSessionError("CampSync is temporarily having trouble connecting. Your session has not been cleared. Please try again.");
        } else {
          setUser(null);
        }
      } finally {
        if (active) setLoadingUser(false);
      }
    };
    restore();
    return () => { active = false; };
  }, []);

  const updateUser = useCallback((userData) => {
    setSessionError("");
    setUser(userData);
  }, []);
  const clearUser = useCallback(() => setUser(null), []);
  const value = useMemo(
    () => ({ user, updateUser, clearUser, loadingUser, sessionError, retrySession: restoreSession }),
    [user, updateUser, clearUser, loadingUser, sessionError, restoreSession]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
