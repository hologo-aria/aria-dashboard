import React, { createContext, useState } from 'react';

const GlobalContext = createContext();

export const GlobalUserProvider = ({ children }) => {
  const [userData, setUserData] = useState([]);

  const updateUser = (data) => {
    setUserData(data);
  };


  const logout = () => {
    setUserData(null);
    localStorage.clear();
  }

  return (
    <GlobalContext.Provider value={{ userData, updateUser , logout }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useUser = () => React.useContext(GlobalContext);
