import axios from "axios";
import { useEffect, useState } from "react";
import "./chatOnline.css";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
   const PF = process.env.REACT_APP_PUBLIC_FOLDER;
   const [friends, setFriends] = useState([]);
   const [onlineFriends, setOnlineFriends] = useState([]);

   useEffect(() => {
      const getFriends = async () => {
         const res = await axios.get(
            "https://pgee-social-media.herokuapp.com/api/users/friends/" + currentId
         );
         setFriends(res.data);
      };

      getFriends();
   }, [currentId]);

   useEffect(() => {
      setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
   }, [friends, onlineUsers]);

   const handleClick = async (user) => {
      try {
         const res = await axios.get(
            `https://pgee-social-media.herokuapp.com/api/conversations/find/${currentId}/${user._id}`
         );
         setCurrentChat(res.data);
      } catch (error) {
         console.log(error); 
      }
   };

   return (
      <div className="chatOnline">
         {onlineFriends.map((o, key) => (
            <div key={key} className="chatOnlineFriend" onClick={() => handleClick(o)}>
               <div className="chatOnlineImgContainer">
                  <img
                     className="chatOnlineImg"
                     src={
                        o?.profilePicture
                           ? PF + o.profilePicture
                           : "https://res.cloudinary.com/dmvkam3rh/image/upload/v1682256559/noAvatar_pua4bg.png"
                     }
                     alt=""
                  />
                  <div className="chatOnlineBadge"></div>
               </div>
               <span className="chatOnlineName">{o?.username}</span>
            </div>
         ))}
      </div>
   );
}
