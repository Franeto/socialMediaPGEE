import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { logoutCall } from "../../apiCalls";
import axios from "axios";

export default function Topbar() {
   const { user, dispatch } = useContext(AuthContext);
   const [allUsers, setAllUsers] = useState([]);
   const [filteredData, setFilteredData] = useState([]);
   const PF = process.env.REACT_APP_PUBLIC_FOLDER;

   useEffect(() => {
      const getAllUsers = async () => {
         const res = await axios.get("http://localhost:8800/api/users/users");
         setAllUsers(res.data); // You should use res.data to set the allUsers state
      };
      getAllUsers();
   }, []);

   const handleClick = () => {
      logoutCall(dispatch);
   };

   const handleFilter = (event) => {
      const searchWord = event.target.value;

      const newFilter = allUsers.filter((user) => {
         return user.username.toLowerCase().includes(searchWord.toLowerCase());
      });

      if (searchWord === "") {
         setFilteredData([]);
      } else {
         setFilteredData(newFilter);
      }
   };
   return (
      <div className="topbarContainer">
         <div className="topbarLeft">
            <Link to="/" style={{ textDecoration: "none" }}>
               <span className="logo">ПГЕЕ</span>
            </Link>
         </div>
         <div className="topbarCenter">
            <div className="searchbar">
               <Search className="searchIcon" />
               <input
                  placeholder="Търси приятели, постове или видеа"
                  className="searchInput"
                  onChange={handleFilter}
               />
               <div className="searchResult">
                  {filteredData.map((user, key) => {
                     return (
                        <Link
                           key={key}
                           to={`/profile/${user.username}`}
                           style={{ textDecoration: "none" }}
                        >
                           <div className="searchItemResult">
                              <img
                                 className="postProfileImg"
                                 src={
                                    user.profilePicture
                                       ? PF + user.profilePicture
                                       : PF + "person/noAvatar.png"
                                 }
                                 alt=""
                              />
                              <span className="searchItemResultName">
                                 {user.username}
                              </span>
                           </div>
                        </Link>
                     );
                  })}
               </div>
            </div>
         </div>
         <div className="topbarRight">
            <div className="topbarLinks">
               <span className="topbarLink">Начало</span>
               <span className="topbarLink">История</span>
            </div>
            <div className="topbarIcons">
               <div className="topbarIconItem">
                  <Person />
                  <span className="topbarIconBadge">1</span>
               </div>
               <div className="topbarIconItem">
                  <Link to={"/messenger"} style={{ textDecoration: "none" }}>
                     <Chat style={{textDecoration:"none", color:"white"}} />
                  </Link>
                  <span className="topbarIconBadge">2</span>
               </div>
               <div className="topbarIconItem">
                  <Notifications />
                  <span className="topbarIconBadge">1</span>
               </div>
            </div>
            <Link to={`/profile/${user.username}`}>
               <img
                  src={
                     user.profilePicture
                        ? PF + user.profilePicture
                        : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="topbarImg"
               />
            </Link>
            <span className="topbarLink" onClick={handleClick}>
               Sign out
            </span>
         </div>
      </div>
   );
}
