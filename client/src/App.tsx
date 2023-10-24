import "./App.css";

import { Login } from "./pages/Login/Login";
import { useUserContext } from "./context/util";

function App() {
  const { user } = useUserContext();

  return <>{user?.isLoggedIn ? <h1>welcome to bantr chat</h1> : <Login />}</>;
}

export default App;
