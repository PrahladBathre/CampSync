import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentTeacher } from "../../services/teacher";

export const UserContext = createContext({ user: null, updateUser: () => {}, clearUser: () => {}, loadingUser: true });

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    let active = true;
    getCurrentTeacher()
      .then((currentUser) => { if (active && currentUser) setUser(currentUser); })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setLoadingUser(false); });
    return () => { active = false; };
  }, []);

  const updateUser = useCallback((userData) => setUser(userData), []);
  const clearUser = useCallback(() => setUser(null), []);
  const value = useMemo(() => ({ user, updateUser, clearUser, loadingUser }), [user, updateUser, clearUser, loadingUser]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
