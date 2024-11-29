import React from "react";
import LoginScreen from "./Screens/LoginScreen";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Screens/Home";
import ContextProvider from "./Context/GlobalContext";

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
        <div className="bg-black min-h-screen ">
          <RouterProvider router={router} />
        </div>
      </ContextProvider>
    </>
  );
}

export default App;
