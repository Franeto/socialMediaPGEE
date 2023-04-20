import "./rightbar.css";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Message, Remove } from "@mui/icons-material";
import { Follow, Unfollow } from "../../context/AuthActions";

export default function Rightbar({ user, onlineUsers, currentId }) {
   const PF = process.env.REACT_APP_PUBLIC_FOLDER;
   const [friends, setFriends] = useState([]);
   const { user: currentUser, dispatch } = useContext(AuthContext);
   const [followed, setFollowed] = useState(false);
   const [onlineFriends, setOnlineFriends] = useState([]);
   const navigate = useNavigate();

   useEffect(() => {
      const getFriends = async () => {
         try {
            if (user) {
               const friendList = await axios.get(
                  "http://localhost:8800/api/users/friends/" + user?._id
               );
               setFriends(friendList.data);
            } else {
               const friendList = await axios.get(
                  "http://localhost:8800/api/users/friends/" + currentId
               );
               setFriends(friendList.data);
            }
         } catch (err) {
            console.log(err);
         }
      };
      getFriends();
   }, [user]);
   //Getting currently online friends
   useEffect(() => {
      setOnlineFriends(friends?.filter((f) => onlineUsers?.includes(f._id)));
   }, [friends, onlineUsers]);

   const handleNavigate = (e)=>{
      e.preventDefault();
      navigate("/messenger")
   }

   const handleClick = async () => {
      try {
         if (followed) {
            await axios.put(
               "http://localhost:8800/api/users/" + user._id + "/unfollow",
               { userId: currentUser._id }
            );
            dispatch(Unfollow(user._id));
         } else {
            await axios.put(
               "http://localhost:8800/api/users/" + user._id + "/follow",
               { userId: currentUser._id }
            );
            dispatch(Follow(user._id));
         }
      } catch (err) {
         console.log(err);
      }

      setFollowed(!followed);
      localStorage.setItem(`followed-${user._id}`, JSON.stringify(!followed));
   };

   const HomeRightbar = () => {
      
      return (
         <div>
            {/* <div className="birthdayContainer">
               <img src="assets/gift.png" alt="" className="birthdayImg" />
               <span className="birthdayText">
                  {" "}
                  <b>Pola Foster</b> and <b>3 other friends</b> have a birthday
                  today
               </span>
            </div> */}
            <img src={PF+"assets/pgeeLogo.png"} alt="" className="rightbarAd" />
            <h4 className="rightbarTitle">На линия</h4>
            <ul className="rightbarFriendList">
               {onlineFriends.map((u, key) => (
                  // <Online key={key} user={u} />
                  <Link
                     to={`/profile/${u.username}`}
                     style={{ textDecoration: "none" }}
                  >
                     <li className="rightbarFriend">
                        <div className="rightbarProfileImgContainer">
                           <img
                              src={
                                 u?.profilePicture
                                    ? PF + u.profilePicture
                                    : PF + "person/noAvatar.png"
                              }
                              alt=""
                              className="rightbarProfileImg"
                           />
                           <span className="rightbarOnline"></span>
                        </div>
                        <span className="rightbarUsername">{u.username}</span>
                     </li>
                  </Link>
               ))}
            </ul>
         </div>
      );
   };
   const ProfileRightbar = () => {
      // Checks whether the user is followed or not
      useEffect(() => {
         const storedFollowed = JSON.parse(
            localStorage.getItem(`followed-${user._id}`)
         );
         setFollowed(
            storedFollowed || currentUser.following.includes(user._id)
         );
      }, [user, currentUser]);

      return (
         <>
            {user.username !== currentUser.username && (
               <div className="rightbarButtonContainer">
                  <button
                     className="rightbarButton"
                     onClick={handleClick}
                  >
                     {followed ? "Отпоследвай" : "Последвай"}
                     {followed ? <Remove /> : <Add />}
                  </button>
                  <button
                     className="rightbarButton"
                     onClick={handleNavigate}
                  >
                     Изпрати съобщение
                  </button>
               </div>
            )}
            {/* <h4 className="rightbarTitle">User information</h4>
            <div className="rightbarInfo">
               <div className="rightbarInfoItem">
                  <span className="rightbarInfoKey">City:</span>
                  <span className="rightbarInfoValue">{user.city}</span>
               </div>
               <div className="rightbarInfoItem">
                  <span className="rightbarInfoKey">From:</span>
                  <span className="rightbarInfoValue">{user.from}</span>
               </div>
               <div className="rightbarInfoItem">
                  <span className="rightbarInfoKey">Relationship:</span>
                  <span className="rightbarInfoValue">
                     {user.relationship === 1
                        ? "Single"
                        : user.relationship === 2
                        ? "Married"
                        : user.relationship === 3
                        ? "Taken"
                        : "-"}
                  </span>
               </div>
            </div> */}
            <h4 className="rightbarTitle">Приятели</h4>
            <div className="rightbarFollowings">
               {friends.map((friend, key) => (
                  <Link
                     key={key}
                     to={"/profile/" + friend.username}
                     style={{ textDecoration: "none" }}
                  >
                     <div className="rightbarFollowing">
                        <img
                           src={
                              friend.profilePicture
                                 ? PF + friend.profilePicture
                                 : PF + "person/noAvatar.png"
                           }
                           alt=""
                           className="rightbarFollowingImg"
                        />
                        <span className="rightbarFollowingName">
                           {friend.username}
                        </span>
                     </div>
                  </Link>
               ))}
            </div>
         </>
      );
   };

   return (
      <div className="rightbar">
         <div className="rightbatWrapper">
            {user ? <ProfileRightbar /> : <HomeRightbar />}
         </div>
      </div>
   );
}
