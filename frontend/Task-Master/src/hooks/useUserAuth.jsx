import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

export const useUserAuth = () => {
  const { user, loading, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      clearUser(); // optional: only if it’s needed when user is null
      navigate("/login");
    }
  }, [user, loading, clearUser, navigate]);
};
