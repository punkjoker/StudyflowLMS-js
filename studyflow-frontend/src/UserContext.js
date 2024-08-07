import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  return (
    <UserContext.Provider value={{ userRole, setUserRole, userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
