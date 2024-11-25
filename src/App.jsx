import React from "react";
import LoginScreen from "./Screens/LoginScreen";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Screens/Home";
import ContextProvider from "./Context/GlobalContext";
import DuplicateFinder from "./Components/DuplicateFinder";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginScreen />,
    },
    {
      path: "/home",
      element: <Home />,
    },
  ]);
  return (
    <>
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </>
  );
}

export default App;
