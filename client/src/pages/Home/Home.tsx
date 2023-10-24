import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/util";
import { useEffect } from "react";

export const Home = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  return <div>Home</div>;
};
