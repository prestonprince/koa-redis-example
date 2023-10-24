import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Login } from "./pages/Login/Login";
import { Home } from "./pages/Home/Home";
import { UserContextProvider } from "./context/userContext";

function App() {
  return (
    <>
      <BrowserRouter>
        <UserContextProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </UserContextProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
