import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io, { Socket } from "socket.io-client";

import { useUserContext } from "../../context/util";

const SOCKET_URL = "ws://0.0.0.0:3001";

function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useUserContext();

  useEffect(() => {
    const socketIo = io(SOCKET_URL, {
      reconnection: true,
      upgrade: true,
      transports: ["websocket", "polling"],
      query: {
        userid: String(user?.id),
      },
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [user]);

  return socket;
}

export const Home = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("connected to socket");
    });
  }, [socket]);

  useEffect(() => {
    if (!user || !user.isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  return <div>Home</div>;
};
