import "./post.css";
import { MoreVert } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import TimeAgo from "react-timeago";
import bgStrings from "react-timeago/lib/language-strings/bg";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

const formatter = buildFormatter(bgStrings);

export default function Post({ post }) {
   const [like, setLike] = useState(post.likes.length);
   const [isLiked, setIsLiked] = useState(false);
   const [user, setUser] = useState({});
   const PF = process.env.REACT_APP_PUBLIC_FOLDER;
   const axiosLink = `http://localhost:8800/api/users?userId=${post.userId}`;
   const { user: currentUser } = useContext(AuthContext);

   useEffect(() => {
      const fetchUser = async () => {
         const res = await axios.get(axiosLink);
         setUser(res.data);
      };
      fetchUser();
   }, [axiosLink]);

   useEffect(() => {
      setIsLiked(post.likes.includes(currentUser._id));
   }, [currentUser._id, post.likes]);

   const likeHandler = () => {
      try {
         axios.put(`http://localhost:8800/api/posts/` + post._id + "/like", {
            userId: currentUser._id,
         });
      } catch (err) {
         console.log(err);
      }
      if (currentUser._id !== user._id) {
         setLike(isLiked ? like - 1 : like + 1);
         setIsLiked(!isLiked);
      }
   };
   return (
      <div className="post">
         <div className="postWrapper">
            <div className="postTop">
               <div className="postTopLeft">
                  <Link to={`/profile/${user.username}`}>
                     <img
                        className="postProfileImg"
                        src={
                           user.profilePicture
                              ? PF + user.profilePicture
                              : PF + "person/noAvatar.png"
                        }
                        alt=""
                     />
                  </Link>
                  <span className="postUsername">{user.username}</span>
                  <span className="postDate">
                     <TimeAgo date={post.createdAt} formatter={formatter} />
                  </span>
               </div>
               <div className="postTopRight">
                  <MoreVert />
               </div>
            </div>
            <div className="postCenter">
               <span className="postText">{post?.description}</span>
               <img className="postImg" src={PF + post.img} alt="" />
            </div>
            <div className="postBottom">
               <div className="postBottomLeft">
                  {isLiked ? (
                     <>
                        <img
                           className="postLikeIconLiked"
                           src={`${PF}like.png`}
                           onClick={likeHandler}
                           alt=""
                        />
                     </>
                  ) : (
                     <>
                        <img
                           className="postLikeIcon"
                           src={`${PF}like.png`}
                           onClick={likeHandler}
                           alt=""
                        />
                     </>
                  )}
                  {like === 1 ? (
                     <>
                        {" "}
                        <span className="postLikeCounter">
                           {like} харесване
                        </span>
                     </>
                  ) : (
                     <>
                        {" "}
                        <span className="postLikeCounter">
                           {like} харесвания
                        </span>
                     </>
                  )}
               </div>
               <div className="postBottomRight"></div>
            </div>
         </div>
      </div>
   );
}