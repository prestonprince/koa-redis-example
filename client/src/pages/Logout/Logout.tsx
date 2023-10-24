import { useNavigate } from "react-router-dom";
import { useLogout } from "./store/logout.api";
import { useUserContext } from "../../context/util";

export const Logout = () => {
  const { mutate, isLoading } = useLogout();
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();

  const handleLogout = () => {
    const successCallback = () => {
      setUser(null);
      navigate("/login", { replace: true });
    };

    if (user) {
      mutate({ username: user.username }, { onSuccess: successCallback });
    }
  };

  return (
    <button disabled={isLoading} onClick={handleLogout}>
      logout
    </button>
  );
};
