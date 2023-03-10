import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@mui/icons-material";
import { Follow, Unfollow } from "../../context/AuthActions";

export default function Rightbar({ user }) {
   const PF = process.env.REACT_APP_PUBLIC_FOLDER;
   const [friends, setFriends] = useState([]);
   const { user: currentUser, dispatch } = useContext(AuthContext);
   const [followed, setFollowed] = useState(false);

   useEffect(() => {
      const getFriends = async () => {
         try {
            const friendList = await axios.get(
               "http://localhost:8800/api/users/friends/" + user._id
            );
            setFriends(friendList.data);
         } catch (err) {
            console.log(err);
         }
      };
      getFriends();
   }, [user]);

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

   const ProfileRightbar = () => {
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
               <button
                  className="rightbarFollowingButton"
                  onClick={handleClick}
               >
                  {followed ? "Unfollow" : "Follow"}
                  {followed ? <Remove /> : <Add />}
               </button>
            )}
            <h4 className="rightbarTitle">User information</h4>
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
            </div>
            <h4 className="rightbarTitle">User friend</h4>
            <div className="rightbarFollowings">
               {friends.map((friend) => (
                  <Link
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
   const HomeRightbar = () => {
      return (
         <>
            <div className="birthdayContainer">
               <img src="assets/gift.png" alt="" className="birthdayImg" />
               <span className="birthdayText">
                  {" "}
                  <b>Pola Foster</b> and <b>3 other friends</b> have a birthday
                  today
               </span>
            </div>
            <img src="assets/ad.png" alt="" className="rightbarAd" />
            <h4 className="rightbarTitle">Online Friends</h4>
            <ul className="rightbarFriendList">
               {Users.map((u) => (
                  <Online key={u.id} user={u} />
               ))}
            </ul>
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
