import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import Feed from "../../components/feed/Feed";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

export default function Profile() {
   const PF = process.env.REACT_APP_PUBLIC_FOLDER;
   const [user, setUser] = useState({});
   const username = useParams().username;
   const axiosLink = `https://pgee-social-media.herokuapp.com/api/users?username=${username}`;

   useEffect(() => {
      const fetchUser = async () => {
         const res = await axios.get(axiosLink);
         setUser(res.data);
      };
      fetchUser();
   }, [axiosLink]);

   return (
      <>
         <Topbar />
         <div className="profile">
            {/* <Sidebar /> */}
            <div className="profileRight">
               <div className="profileRightTop">
                  <div className="profileCover">
                     <img
                        className="profileCoverImg"
                        src={
                           user.coverPicture
                              ? PF + user.coverPicture
                              : "https://res.cloudinary.com/dmvkam3rh/image/upload/v1682256577/noCover_pm9xwc.png"
                        }
                        alt=""
                     />
                     <img
                        className="profileUserImg"
                        src={
                           user.profilePicture
                              ? PF + user.profilePicture
                              : "https://res.cloudinary.com/dmvkam3rh/image/upload/v1682256559/noAvatar_pua4bg.png"
                        }
                        alt=""
                     />
                  </div>
                  <div className="profileInfo">
                     <h4 className="profileInfoName">{user.username}</h4>
                     <span className="profileInfoDesc">{user.description}</span>
                  </div>
               </div>
               <div className="profileRightBottom">
                  <Feed username={username} />
                  <Rightbar user={user} />
               </div>
            </div>
         </div>
      </>
   );
}
