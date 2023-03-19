import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import Feed from "../../components/feed/Feed";
import "./home.css"
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { io } from "socket.io-client";

export default function Home() {
	const socket = useRef(io("ws://localhost:8900"));
   const { user } = useContext(AuthContext);
   const [onlineUsers, setOnlineUsers] = useState([]);


	useEffect(() => {
      socket.current.emit("addUser", user._id);
      socket.current.on("getUsers", (users) => {
         setOnlineUsers(user.following.filter(f=>users.some(u=>u.userId===f)))
      });

   }, [user._id]);

   return (
   	<>
   		<Topbar/>
   		<div className="homeContainer">
   			<Sidebar/>
   			<Feed/>
   			<Rightbar onlineUsers={onlineUsers} currentId={user._id}/>
   		</div>

   	</>
  )
}
