import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";
import { AccountCircle } from "@mui/icons-material";

export default function Conversation({ conversation, currentUser }) {
   const PF = process.env.REACT_APP_PUBLIC_FOLDER;
   const [user, setUser] = useState(null);

   useEffect(() => {
      const friendId = conversation.members.find((m) => m !== currentUser._id);
      
      const getUser = async () => {
         try {
            const res = await axios(
               "https://pgee-social-media.herokuapp.com/api/users?userId=" + friendId
            );
            setUser(res.data)
         } catch (err) {
            console.log(err);
         }
      };
      getUser();
   }, [currentUser,conversation]);
   return (
      <div className="conversation">
         <span className="conversationImg"><AccountCircle/></span>
         <span className="conversationName">{user?.username}</span>
      </div>
   );
}
