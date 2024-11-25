import { createContext, useContext, useState } from "react";

const context = createContext(undefined);

const ContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState();
  return (
    <context.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </context.Provider>
  );
};

export const globalState = () => {
  const globalContext = useContext(context);
  if (!globalContext) {
    throw new Error("useglobalState must be used within a ChatssProvider");
  }
  return globalContext;
};

export default ContextProvider;
